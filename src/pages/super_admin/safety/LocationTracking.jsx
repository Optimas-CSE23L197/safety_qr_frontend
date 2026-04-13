/**
 * LOCATION TRACKING PAGE — Super Admin
 *
 * CHANGE LOG (this update):
 *   - MapView now uses real Leaflet via CDN (react-leaflet pattern)
 *   - Added LeafletMap component that injects Leaflet CSS + JS dynamically
 *   - All other functionality unchanged
 *
 * Schema models used:
 *   LocationEvent   → id, student_id, token_id, latitude, longitude, accuracy, source, created_at
 *   LocationConsent → student_id, enabled, consented_by, updated_at
 *   TrustedScanZone → id, school_id, label, latitude, longitude, radius_m, ip_range, is_active
 *   ScanLog         → latitude, longitude, ip_city, ip_region, ip_country, result, created_at
 *   SchoolSettings  → allow_location (gate per school)
 *   LocationSource  → SCAN_TRIGGER | PARENT_APP | MANUAL
 *
 * Map: Uses Leaflet injected via CDN script tag (no npm install needed).
 *      In production replace LeafletMap with <MapContainer> from react-leaflet.
 *
 * API endpoint to wire:
 *   GET /api/super/location/events?school_id=&student_id=&source=&from=&to=&page=&limit=
 *   GET /api/super/location/zones?school_id=
 *   GET /api/super/location/consent?school_id=
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    MapPin, Search, SlidersHorizontal, X, ChevronDown,
    ChevronLeft, ChevronRight, Eye, Shield, ShieldOff,
    ShieldCheck, Zap, Smartphone, Navigation, Clock,
    Building2, Users, CircleDot, AlertTriangle, CheckCircle2,
    RefreshCw, Loader2, Calendar, Filter, Layers,
    Radio, Target, TrendingUp, ArrowUpRight, Info,
    Lock, Unlock, Activity, Map, List, LocateFixed,
    Wifi, WifiOff
} from 'lucide-react';

// ─── INDIA CITY CENTERS ───────────────────────────────────────────────────────
const CITY_CENTERS = [
    { lat: 28.6139, lng: 77.2090, city: 'New Delhi' },
    { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
    { lat: 12.9716, lng: 77.5946, city: 'Bengaluru' },
    { lat: 22.5726, lng: 88.3639, city: 'Kolkata' },
    { lat: 13.0827, lng: 80.2707, city: 'Chennai' },
    { lat: 18.5204, lng: 73.8567, city: 'Pune' },
    { lat: 17.3850, lng: 78.4867, city: 'Hyderabad' },
    { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad' },
];

function nearCity(city) {
    return {
        lat: city.lat + (Math.random() - 0.5) * 0.08,
        lng: city.lng + (Math.random() - 0.5) * 0.08,
    };
}
function daysAgo(n, h = 0) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(d.getHours() - h);
    return d.toISOString();
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International', code: 'GWI', city: 'New Delhi', allow_location: true },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA', city: 'Bengaluru', allow_location: true },
    { id: 'sch-003', name: 'Delhi Public School R3', code: 'DPS', city: 'New Delhi', allow_location: false },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC', city: 'Kolkata', allow_location: true },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS', city: 'Pune', allow_location: false },
];

const TRUSTED_ZONES = [
    { id: 'tz-001', school_id: 'sch-001', label: 'Main Campus', latitude: 28.6140, longitude: 77.2091, radius_m: 300, ip_range: '103.21.x.x', is_active: true, created_at: daysAgo(90) },
    { id: 'tz-002', school_id: 'sch-001', label: 'Sports Complex', latitude: 28.6155, longitude: 77.2110, radius_m: 150, ip_range: null, is_active: true, created_at: daysAgo(60) },
    { id: 'tz-003', school_id: 'sch-002', label: 'Bengaluru Campus', latitude: 12.9718, longitude: 77.5948, radius_m: 250, ip_range: '49.37.x.x', is_active: true, created_at: daysAgo(45) },
    { id: 'tz-004', school_id: 'sch-004', label: 'Kolkata Main', latitude: 22.5728, longitude: 88.3641, radius_m: 200, ip_range: null, is_active: false, created_at: daysAgo(30) },
];

const STUDENT_NAMES = [
    ['Aarav', 'Sharma'], ['Ananya', 'Patel'], ['Arjun', 'Singh'], ['Diya', 'Kumar'],
    ['Ishaan', 'Gupta'], ['Kavya', 'Verma'], ['Rohan', 'Mehta'], ['Priya', 'Shah'],
    ['Vivaan', 'Joshi'], ['Siya', 'Nair'], ['Aditya', 'Reddy'], ['Meera', 'Rao'],
    ['Kiran', 'Iyer'], ['Riya', 'Das'], ['Arnav', 'Bose'], ['Neha', 'Mishra'],
    ['Dev', 'Tiwari'], ['Pooja', 'Pandey'], ['Shiv', 'Kapoor'], ['Nisha', 'Malhotra'],
];
const SOURCES = ['SCAN_TRIGGER', 'SCAN_TRIGGER', 'SCAN_TRIGGER', 'PARENT_APP', 'MANUAL'];
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const STUDENTS_WITH_LOCATION = Array.from({ length: 48 }, (_, i) => {
    const [fn, ln] = STUDENT_NAMES[i % STUDENT_NAMES.length];
    const school = SCHOOLS[i % 3];
    const cityC = CITY_CENTERS.find(c => c.city === school.city) || CITY_CENTERS[0];
    const coord = nearCity(cityC);
    const consent = i % 6 !== 0;
    const source = rand(SOURCES);
    return {
        id: `stu-${String(i + 1).padStart(4, '0')}`,
        first_name: fn, last_name: ln,
        class: String(Math.floor(Math.random() * 12) + 1),
        section: rand(['A', 'B', 'C', 'D']),
        school_id: school.id, school,
        consent: {
            enabled: consent,
            consented_by: consent ? rand(['parent', 'school_admin']) : null,
            updated_at: daysAgo(Math.floor(Math.random() * 30)),
        },
        last_event: consent ? {
            id: `evt-${i}`,
            latitude: coord.lat,
            longitude: coord.lng,
            accuracy: Math.floor(Math.random() * 50 + 5),
            source, city: cityC.city,
            created_at: daysAgo(0, Math.floor(Math.random() * 48)),
            token_id: `tok-${i}`,
        } : null,
        in_zone: consent && i % 5 !== 0,
        event_count: consent ? Math.floor(Math.random() * 120 + 10) : 0,
    };
});

function generateHistory(student) {
    if (!student.consent.enabled) return [];
    const cityC = CITY_CENTERS.find(c => c.city === student.school.city) || CITY_CENTERS[0];
    return Array.from({ length: Math.floor(Math.random() * 18 + 5) }, (_, i) => {
        const coord = nearCity(cityC);
        return {
            id: `evt-hist-${student.id}-${i}`,
            latitude: coord.lat, longitude: coord.lng,
            accuracy: Math.floor(Math.random() * 50 + 5),
            source: rand(SOURCES),
            created_at: daysAgo(Math.floor(i / 3), Math.floor(Math.random() * 8)),
            in_zone: Math.random() > 0.3,
            ip_city: cityC.city, ip_country: 'IN',
        };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SOURCE_CFG = {
    SCAN_TRIGGER: { label: 'Scan', color: '#6366F1', bg: '#EEF2FF', icon: Zap },
    PARENT_APP: { label: 'Parent App', color: '#10B981', bg: '#ECFDF5', icon: Smartphone },
    MANUAL: { label: 'Manual', color: '#F59E0B', bg: '#FFFBEB', icon: Navigation },
};

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtTime = d => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtAgo = d => {
    if (!d) return '—';
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};
const fmtCoord = n => n?.toFixed(5) ?? '—';
const avatarColor = id => {
    const c = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EC4899', '#14B8A6'];
    let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % c.length; return c[h];
};
const initials = s => `${s.first_name[0]}${s.last_name?.[0] || ''}`.toUpperCase();

// ─── LEAFLET MAP COMPONENT ────────────────────────────────────────────────────
// Injects Leaflet via CDN, renders a real tile map with CircleMarkers + zone rings.
// Replace this entire component with react-leaflet's <MapContainer> in production.

function LeafletMap({ students, zones, selectedId, onSelect, schoolFilter }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});   // student_id → L.circleMarker
    const zonesRef = useRef([]);   // L.circle[] for zone rings
    const leafletLoadedRef = useRef(false);
    const [leafletReady, setLeafletReady] = useState(false);
    const [mapError, setMapError] = useState(false);

    const visibleStudents = useMemo(() =>
        students.filter(s => s.last_event && (schoolFilter === 'ALL' || s.school_id === schoolFilter)),
        [students, schoolFilter]
    );

    // ── 1. Inject Leaflet CSS + JS from CDN ──────────────────────────────────
    useEffect(() => {
        // Already loaded in a previous render cycle
        if (window.L) { leafletLoadedRef.current = true; setLeafletReady(true); return; }

        // CSS — no integrity hash (hashes break when CDN serves different encodings)
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // JS — no integrity hash, try unpkg first then cdnjs as fallback
        const loadScript = (src, onSuccess, onFail) => {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = src;
            script.async = true;
            script.onload = onSuccess;
            script.onerror = onFail;
            document.head.appendChild(script);
        };

        if (!document.getElementById('leaflet-js')) {
            loadScript(
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                () => { leafletLoadedRef.current = true; setLeafletReady(true); },
                () => {
                    // unpkg failed — remove and try cdnjs
                    document.getElementById('leaflet-js')?.remove();
                    loadScript(
                        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
                        () => { leafletLoadedRef.current = true; setLeafletReady(true); },
                        () => setMapError(true)   // both CDNs failed
                    );
                }
            );
        } else {
            // Tag already in DOM (hot-reload scenario) — wait for window.L
            const poll = setInterval(() => {
                if (window.L) { clearInterval(poll); leafletLoadedRef.current = true; setLeafletReady(true); }
            }, 100);
            setTimeout(() => { clearInterval(poll); if (!window.L) setMapError(true); }, 10000);
        }
    }, []);

    // ── 2. Initialise map once Leaflet is ready ───────────────────────────────
    useEffect(() => {
        if (!leafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

        const L = window.L;

        // Fix broken default marker icon paths (common Leaflet gotcha)
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map(mapContainerRef.current, {
            center: [20.5937, 78.9629],  // India centre
            zoom: 5,
            zoomControl: false,
            attributionControl: false,
        });

        // OSM standard tiles — reliable, no API key, works everywhere.
        // For dark tiles swap the URL to CartoDB:
        //   'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'  + subdomains:'abcd'
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { maxZoom: 19, attribution: '' }
        ).addTo(map);

        L.control.attribution({ position: 'bottomright', prefix: false })
            .addAttribution('\u00a9 <a href="https://www.openstreetmap.org/copyright" style="color:#6366F1">OpenStreetMap</a>')
            .addTo(map);

        // Zoom control top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markersRef.current = {};
            zonesRef.current = [];
        };
    }, [leafletReady]);

    // ── 3. Sync zone circles whenever map or filter changes ───────────────────
    useEffect(() => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!L || !map) return;

        // Remove old zone layers
        zonesRef.current.forEach(c => c.remove());
        zonesRef.current = [];

        const visZones = zones.filter(z =>
            z.latitude && z.longitude && z.is_active &&
            (schoolFilter === 'ALL' || z.school_id === schoolFilter)
        );

        visZones.forEach(z => {
            // Filled ring
            const ring = L.circle([z.latitude, z.longitude], {
                radius: z.radius_m,       // metres — Leaflet handles projection
                color: '#6366F1',
                fillColor: '#6366F1',
                fillOpacity: 0.07,
                weight: 1.5,
                dashArray: '4 4',
            }).addTo(map);

            // Label via tooltip always open
            ring.bindTooltip(z.label, {
                permanent: true,
                direction: 'top',
                className: 'lf-zone-label',
                offset: [0, -4],
            });

            zonesRef.current.push(ring);
        });
    }, [leafletReady, zones, schoolFilter, mapInstanceRef.current]);

    // ── 4. Sync student markers ───────────────────────────────────────────────
    useEffect(() => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!L || !map) return;

        const nextIds = new Set(visibleStudents.map(s => s.id));

        // Remove markers no longer in filtered set
        Object.keys(markersRef.current).forEach(id => {
            if (!nextIds.has(id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        visibleStudents.forEach(s => {
            const e = s.last_event;
            const isSelected = selectedId === s.id;
            const color = isSelected ? avatarColor(s.id) : s.in_zone ? '#10B981' : '#F59E0B';
            const radius = isSelected ? 11 : 7;

            if (markersRef.current[s.id]) {
                // Update existing marker style
                markersRef.current[s.id].setStyle({
                    color,
                    fillColor: color,
                    fillOpacity: isSelected ? 1 : 0.85,
                    weight: isSelected ? 3 : 1.5,
                    radius,
                });
            } else {
                // Create new marker
                const marker = L.circleMarker([e.latitude, e.longitude], {
                    radius,
                    color,
                    fillColor: color,
                    fillOpacity: isSelected ? 1 : 0.85,
                    weight: isSelected ? 3 : 1.5,
                    interactive: true,
                });

                // Rich popup
                const popupHtml = `
                  <div style="font-family:'IBM Plex Sans',sans-serif;min-width:180px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                      <div style="width:32px;height:32px;border-radius:8px;background:${avatarColor(s.id)};display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;color:#fff;flex-shrink:0">
                        ${initials(s)}
                      </div>
                      <div>
                        <p style="font-size:0.85rem;font-weight:800;color:#0F172A;margin:0">${s.first_name} ${s.last_name}</p>
                        <p style="font-size:0.68rem;color:#64748B;margin:0;font-family:monospace">${s.id}</p>
                      </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
                      <div style="background:#F8FAFC;border-radius:6px;padding:5px 8px">
                        <p style="font-size:0.6rem;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0">School</p>
                        <p style="font-size:0.78rem;font-weight:700;color:#0F172A;margin:2px 0 0">${s.school.code}</p>
                      </div>
                      <div style="background:#F8FAFC;border-radius:6px;padding:5px 8px">
                        <p style="font-size:0.6rem;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0">Class</p>
                        <p style="font-size:0.78rem;font-weight:700;color:#0F172A;margin:2px 0 0">${s.class}-${s.section}</p>
                      </div>
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
                      <span style="padding:2px 8px;border-radius:20px;font-size:0.66rem;font-weight:700;color:${s.in_zone ? '#10B981' : '#F59E0B'};background:${s.in_zone ? '#ECFDF5' : '#FFFBEB'}">
                        ${s.in_zone ? '✓ In Zone' : '⚠ Outside Zone'}
                      </span>
                      <span style="padding:2px 8px;border-radius:20px;font-size:0.66rem;font-weight:700;color:#6366F1;background:#EEF2FF">
                        ${SOURCE_CFG[e.source]?.label || e.source}
                      </span>
                    </div>
                    <p style="font-size:0.7rem;color:#94A3B8;margin:0;font-family:monospace">
                      ${fmtCoord(e.latitude)}, ${fmtCoord(e.longitude)} · ±${e.accuracy}m
                    </p>
                    <p style="font-size:0.7rem;color:#94A3B8;margin:4px 0 0">${fmtAgo(e.created_at)}</p>
                  </div>`;

                marker.bindPopup(popupHtml, {
                    maxWidth: 260,
                    className: 'lf-custom-popup',
                    offset: [0, -4],
                });

                marker.on('click', () => onSelect(s));
                marker.addTo(map);
                markersRef.current[s.id] = marker;
            }
        });

        // Fit bounds to all visible students when filter changes (not on every re-render)
        if (visibleStudents.length > 0) {
            const latLngs = visibleStudents.map(s => [s.last_event.latitude, s.last_event.longitude]);
            map.fitBounds(latLngs, { padding: [48, 48], maxZoom: 14 });
        }
    }, [leafletReady, visibleStudents, selectedId]);

    // ── 5. Pan + highlight when selectedId changes ────────────────────────────
    useEffect(() => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!L || !map) return;

        if (selectedId && markersRef.current[selectedId]) {
            const m = markersRef.current[selectedId];
            map.panTo(m.getLatLng(), { animate: true, duration: 0.5 });
            m.openPopup();
        }
    }, [selectedId]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Leaflet mount point — must have explicit dimensions */}
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%', borderRadius: 0 }}
            />

            {/* Loading overlay */}
            {!leafletReady && !mapError && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: '#0A1628',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 12,
                    zIndex: 1000,
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        border: '3px solid rgba(99,102,241,0.2)',
                        borderTop: '3px solid #6366F1',
                        animation: 'spin 0.9s linear infinite',
                    }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                        Loading map…
                    </p>
                </div>
            )}

            {/* Error state */}
            {mapError && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: '#0A1628',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 10,
                    zIndex: 1000,
                }}>
                    <WifiOff size={28} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>
                        Map tiles unavailable
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: 0 }}>
                        Check your internet connection
                    </p>
                </div>
            )}

            {/* Student count badge */}
            {leafletReady && (
                <div style={{
                    position: 'absolute', top: 14, left: 14, zIndex: 500,
                    background: 'rgba(10,22,40,0.88)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 10, padding: '6px 14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)' }}>
                        {visibleStudents.length} students on map
                    </span>
                </div>
            )}

            {/* Legend */}
            {leafletReady && (
                <div style={{
                    position: 'absolute', bottom: 32, left: 14, zIndex: 500,
                    background: 'rgba(10,22,40,0.88)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 10, padding: '8px 14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                        <LegItem color="#10B981" label="In Zone" />
                        <LegItem color="#F59E0B" label="Outside Zone" />
                        <LegItem color="#6366F1" border label="Trusted Zone" />
                    </div>
                </div>
            )}

            {/* Custom Leaflet styles injected globally */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Popup */
                .lf-custom-popup .leaflet-popup-content-wrapper {
                    background: #fff;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
                    border: 1px solid #E2E8F0;
                    padding: 0 !important;
                }
                .lf-custom-popup .leaflet-popup-content {
                    margin: 14px 16px !important;
                }
                .lf-custom-popup .leaflet-popup-tip-container {
                    margin-top: -1px;
                }
                .lf-custom-popup .leaflet-popup-tip {
                    background: #fff !important;
                    box-shadow: none !important;
                }
                .lf-custom-popup .leaflet-popup-close-button {
                    color: #94A3B8 !important;
                    font-size: 18px !important;
                    top: 8px !important;
                    right: 10px !important;
                }

                /* Zone label tooltip */
                .lf-zone-label {
                    background: rgba(99,102,241,0.12) !important;
                    border: 1px solid rgba(99,102,241,0.35) !important;
                    border-radius: 5px !important;
                    color: rgba(150,153,255,0.9) !important;
                    font-size: 0.6rem !important;
                    font-weight: 800 !important;
                    letter-spacing: 0.06em !important;
                    text-transform: uppercase !important;
                    padding: 2px 7px !important;
                    box-shadow: none !important;
                    backdrop-filter: blur(6px);
                }
                .lf-zone-label::before { display: none !important; }

                /* Leaflet zoom control — match dark theme */
                .leaflet-control-zoom a {
                    background: rgba(10,22,40,0.9) !important;
                    color: rgba(255,255,255,0.7) !important;
                    border-color: rgba(255,255,255,0.1) !important;
                    font-size: 16px !important;
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(99,102,241,0.3) !important;
                    color: #fff !important;
                }
                .leaflet-control-attribution {
                    background: rgba(10,22,40,0.75) !important;
                    color: rgba(255,255,255,0.3) !important;
                    font-size: 0.6rem !important;
                }
                .leaflet-control-attribution a {
                    color: rgba(150,153,255,0.6) !important;
                }
            `}</style>
        </div>
    );
}

function LegItem({ color, label, border }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: border ? 'transparent' : color,
                border: border ? `2px solid ${color}` : 'none',
                flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{label}</span>
        </div>
    );
}

// ─── STUDENT DETAIL PANEL ─────────────────────────────────────────────────────
function StudentPanel({ student, onClose }) {
    const [history] = useState(() => generateHistory(student));
    const ac = avatarColor(student.id);
    const sc = student.consent;
    const le = student.last_event;

    return (
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #E2E8F0', animation: 'slideIn 0.22s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', padding: '20px 22px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                            {initials(student)}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: 0 }}>{student.first_name} {student.last_name}</p>
                            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0', fontFamily: 'monospace' }}>{student.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                        <X size={14} color="rgba(255,255,255,0.6)" />
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <MiniStat label="School" value={student.school.code} />
                    <MiniStat label="Class" value={`${student.class}-${student.section}`} />
                    <MiniStat label="Consent" value={sc.enabled ? 'Granted' : 'Revoked'} color={sc.enabled ? '#10B981' : '#EF4444'} />
                    <MiniStat label="Events" value={student.event_count} />
                </div>
            </div>

            {/* Consent banner */}
            {!sc.enabled && (
                <div style={{ background: '#FEF2F2', padding: '10px 18px', borderBottom: '1px solid #FCA5A5', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Lock size={13} color="#EF4444" />
                    <p style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 600, margin: 0 }}>Location consent not granted. No data available.</p>
                </div>
            )}

            {sc.enabled && le && (
                <div style={{ padding: '16px 18px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                    <p style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Last Known Location</p>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: student.in_zone ? '#ECFDF5' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MapPin size={16} color={student.in_zone ? '#10B981' : '#F59E0B'} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{le.city}</p>
                            <p style={{ fontSize: '0.7rem', color: '#64748B', margin: '2px 0 0', fontFamily: 'monospace' }}>{fmtCoord(le.latitude)}, {fmtCoord(le.longitude)}</p>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                                <SourceBadge source={le.source} />
                                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{fmtAgo(le.created_at)}</span>
                                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>±{le.accuracy}m</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: student.in_zone ? '#10B981' : '#F59E0B' }}>
                                    {student.in_zone ? '✓ In Zone' : '⚠ Outside Zone'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Event history */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
                <p style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                    Location History ({history.length} events)
                </p>

                {!sc.enabled ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                        <ShieldOff size={28} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>No location data</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 1, background: '#E2E8F0' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {history.map((evt, i) => {
                                const sc2 = SOURCE_CFG[evt.source];
                                const SIcon = sc2.icon;
                                return (
                                    <div key={evt.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 14, position: 'relative' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${evt.in_zone ? '#10B981' : '#F59E0B'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, background: '#fff' }}>
                                            <SIcon size={12} color={sc2.color} />
                                        </div>
                                        <div style={{ flex: 1, background: i === 0 ? '#F8FAFC' : 'transparent', borderRadius: 8, padding: i === 0 ? '8px 10px' : '2px 0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>{evt.ip_city || 'Unknown'}</span>
                                                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginLeft: 6 }}>{sc2.label}</span>
                                                </div>
                                                <span style={{ fontSize: '0.68rem', color: '#94A3B8', flexShrink: 0 }}>{fmtAgo(evt.created_at)}</span>
                                            </div>
                                            <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '3px 0 0', fontFamily: 'monospace' }}>
                                                {fmtCoord(evt.latitude)}, {fmtCoord(evt.longitude)} · ±{evt.accuracy}m
                                            </p>
                                            {!evt.in_zone && (
                                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F59E0B', background: '#FFFBEB', padding: '1px 6px', borderRadius: 4, marginTop: 3, display: 'inline-block' }}>Outside trusted zone</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MiniStat({ label, value, color }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '7px 10px' }}>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: color || 'rgba(255,255,255,0.9)', margin: '2px 0 0' }}>{value}</p>
        </div>
    );
}

function SourceBadge({ source }) {
    const cfg = SOURCE_CFG[source];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 20, fontSize: '0.66rem', fontWeight: 700, color: cfg.color, background: cfg.bg }}>
            <Icon size={9} strokeWidth={2.5} />{cfg.label}
        </span>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LocationTrackingPage() {
    const [view, setView] = useState('map');
    const [schoolF, setSchoolF] = useState('ALL');
    const [consentF, setConsentF] = useState('ALL');
    const [zoneF, setZoneF] = useState('ALL');
    const [sourceF, setSourceF] = useState('ALL');
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const LIMIT = 15;

    const stats = useMemo(() => ({
        total: STUDENTS_WITH_LOCATION.length,
        consented: STUDENTS_WITH_LOCATION.filter(s => s.consent.enabled).length,
        inZone: STUDENTS_WITH_LOCATION.filter(s => s.consent.enabled && s.in_zone).length,
        outsideZone: STUDENTS_WITH_LOCATION.filter(s => s.consent.enabled && !s.in_zone && s.last_event).length,
        noConsent: STUDENTS_WITH_LOCATION.filter(s => !s.consent.enabled).length,
        locEnabled: SCHOOLS.filter(s => s.allow_location).length,
    }), []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return STUDENTS_WITH_LOCATION.filter(s => {
            if (schoolF !== 'ALL' && s.school_id !== schoolF) return false;
            if (consentF === 'GRANTED' && !s.consent.enabled) return false;
            if (consentF === 'REVOKED' && s.consent.enabled) return false;
            if (zoneF === 'IN_ZONE' && (!s.consent.enabled || !s.in_zone || !s.last_event)) return false;
            if (zoneF === 'OUTSIDE' && (!s.consent.enabled || s.in_zone || !s.last_event)) return false;
            if (sourceF !== 'ALL' && s.last_event?.source !== sourceF) return false;
            if (q && !`${s.first_name} ${s.last_name}`.toLowerCase().includes(q) &&
                !s.id.toLowerCase().includes(q) &&
                !s.school.name.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [schoolF, consentF, zoneF, sourceF, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
    const activeFilters = [schoolF !== 'ALL', consentF !== 'ALL', zoneF !== 'ALL', sourceF !== 'ALL'].filter(Boolean).length;
    const clearFilters = () => { setSchoolF('ALL'); setConsentF('ALL'); setZoneF('ALL'); setSourceF('ALL'); setPage(1); };

    const schoolFilteredStudents = STUDENTS_WITH_LOCATION.filter(s => schoolF === 'ALL' || s.school_id === schoolF);

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1600, margin: '0 auto', fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
                @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .fup { animation:fadeUp 0.3s ease both; }
                .tr:hover { background:#F8FAFC !important; }
                ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#F3F4F6} ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:8px}
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }} className="fup">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(14,165,233,0.4)' }}>
                        <MapPin size={19} color="#fff" strokeWidth={2.2} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>Location Tracking</h1>
                        <p style={{ fontSize: '0.77rem', color: '#64748B', margin: '2px 0 0' }}>
                            Live student locations · Trusted scan zones · Consent management
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10 }}>
                        <AlertTriangle size={13} color="#F59E0B" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
                            {SCHOOLS.filter(s => !s.allow_location).length} school{SCHOOLS.filter(s => !s.allow_location).length !== 1 ? 's' : ''} have location disabled
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 10, padding: 3 }}>
                        {[['map', Map], ['list', List]].map(([v, Icon]) => (
                            <button key={v} onClick={() => setView(v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === v ? '#fff' : 'transparent', color: view === v ? '#0F172A' : '#64748B', fontSize: '0.78rem', fontWeight: 700, boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                                <Icon size={13} />{v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 22 }} className="fup">
                <KpiTile label="Students Tracked" value={stats.consented} color="#0EA5E9" bg="#E0F2FE" Icon={Users} />
                <KpiTile label="In Trusted Zone" value={stats.inZone} color="#10B981" bg="#ECFDF5" Icon={ShieldCheck} />
                <KpiTile label="Outside Zone" value={stats.outsideZone} color="#F59E0B" bg="#FFFBEB" Icon={AlertTriangle} />
                <KpiTile label="No Consent" value={stats.noConsent} color="#EF4444" bg="#FEF2F2" Icon={Lock} />
                <KpiTile label="Trusted Zones" value={TRUSTED_ZONES.filter(z => z.is_active).length} color="#6366F1" bg="#EEF2FF" Icon={Target} />
                <KpiTile label="Schools Enabled" value={`${stats.locEnabled}/${SCHOOLS.length}`} color="#8B5CF6" bg="#F5F3FF" Icon={Building2} />
            </div>

            {/* School location access status */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '14px 20px', marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fup">
                <p style={{ fontSize: '0.68rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>School Location Access (SchoolSettings.allow_location)</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {SCHOOLS.map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 10, background: s.allow_location ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${s.allow_location ? '#10B98120' : '#EF444420'}` }}>
                            {s.allow_location ? <Unlock size={12} color="#10B981" /> : <Lock size={12} color="#EF4444" />}
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: s.allow_location ? '#064E3B' : '#991B1B' }}>{s.name}</span>
                            <span style={{ fontSize: '0.68rem', color: s.allow_location ? '#10B981' : '#EF4444', fontWeight: 600 }}>{s.allow_location ? 'Enabled' : 'Disabled'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '12px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fup">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student name, ID, school…"
                            style={{ width: '100%', padding: '9px 12px 9px 33px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', color: '#0F172A', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }}
                            onFocus={e => e.target.style.borderColor = '#0EA5E9'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${showFilters || activeFilters ? '#0EA5E9' : '#E2E8F0'}`, background: showFilters || activeFilters ? '#E0F2FE' : '#F8FAFC', color: showFilters || activeFilters ? '#0EA5E9' : '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <SlidersHorizontal size={13} /> Filters
                        {activeFilters > 0 && <span style={{ background: '#0EA5E9', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: '0.66rem', fontWeight: 900 }}>{activeFilters}</span>}
                    </button>
                    <span style={{ fontSize: '0.77rem', color: '#94A3B8', fontWeight: 600, marginLeft: 'auto' }}>
                        {filtered.length} students
                    </span>
                </div>

                {showFilters && (
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 12, paddingTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <FGroup label="School">
                            <FSel value={schoolF} onChange={e => { setSchoolF(e.target.value); setPage(1); }} active={schoolF !== 'ALL'}>
                                <option value="ALL">All Schools</option>
                                {SCHOOLS.filter(s => s.allow_location).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </FSel>
                        </FGroup>
                        <FGroup label="Consent">
                            {[['ALL', 'All'], ['GRANTED', 'Granted'], ['REVOKED', 'Not Granted']].map(([v, l]) => (
                                <FPill key={v} active={consentF === v} onClick={() => { setConsentF(v); setPage(1); }}>{l}</FPill>
                            ))}
                        </FGroup>
                        <FGroup label="Zone Status">
                            {[['ALL', 'All'], ['IN_ZONE', 'In Zone'], ['OUTSIDE', 'Outside']].map(([v, l]) => (
                                <FPill key={v} active={zoneF === v} onClick={() => { setZoneF(v); setPage(1); }}>{l}</FPill>
                            ))}
                        </FGroup>
                        <FGroup label="Source">
                            {['ALL', ...Object.keys(SOURCE_CFG)].map(s => {
                                const cfg = SOURCE_CFG[s];
                                return <FPill key={s} active={sourceF === s} accent={cfg?.color || '#0EA5E9'} onClick={() => { setSourceF(s); setPage(1); }}>
                                    {s === 'ALL' ? 'All Sources' : cfg.label}
                                </FPill>;
                            })}
                        </FGroup>
                        {activeFilters > 0 && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'center', marginLeft: 'auto' }}><X size={10} />Clear</button>}
                    </div>
                )}
            </div>

            {/* ── MAP VIEW ── */}
            {view === 'map' ? (
                <div style={{ display: 'flex', gap: 0, height: 560, borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }} className="fup">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* ↓ Only this block changed — LeafletMap replaces the old MapView */}
                        <LeafletMap
                            students={schoolFilteredStudents}
                            zones={TRUSTED_ZONES}
                            selectedId={selected?.id}
                            onSelect={s => setSelected(prev => prev?.id === s.id ? null : s)}
                            schoolFilter={schoolF}
                        />
                    </div>
                    {selected && (
                        <StudentPanel student={selected} onClose={() => setSelected(null)} />
                    )}
                </div>
            ) : (
                /* ── LIST VIEW (unchanged) ── */
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }} className="fup">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '0 20px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                                {['Student', 'School', 'Consent', 'Zone', 'Last Event', 'Source', ''].map(c => (
                                    <div key={c} style={{ padding: '11px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>
                                ))}
                            </div>

                            {paginated.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                                    <MapPin size={34} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 10 }} />
                                    <p style={{ fontWeight: 800, color: '#64748B', margin: 0 }}>No students match your filters</p>
                                </div>
                            ) : paginated.map((s, i) => {
                                const le = s.last_event;
                                const ac = avatarColor(s.id);
                                return (
                                    <div key={s.id} className="tr" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '0 20px', borderBottom: i < paginated.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                                        onClick={() => setSelected(s === selected ? null : s)}>
                                        <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: 9, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                                {initials(s)}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.first_name} {s.last_name}</p>
                                                <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '1px 0 0', fontFamily: 'monospace' }}>{s.id}</p>
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 8px' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', margin: 0 }}>{s.school.code}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0' }}>Class {s.class}-{s.section}</p>
                                        </div>
                                        <div style={{ padding: '12px 8px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, color: s.consent.enabled ? '#10B981' : '#EF4444', background: s.consent.enabled ? '#ECFDF5' : '#FEF2F2' }}>
                                                {s.consent.enabled ? <Unlock size={9} /> : <Lock size={9} />}
                                                {s.consent.enabled ? 'Granted' : 'Revoked'}
                                            </span>
                                        </div>
                                        <div style={{ padding: '12px 8px' }}>
                                            {le ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700, color: s.in_zone ? '#10B981' : '#F59E0B' }}>
                                                    <CircleDot size={9} strokeWidth={3} />{s.in_zone ? 'In Zone' : 'Outside'}
                                                </span>
                                            ) : <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>—</span>}
                                        </div>
                                        <div style={{ padding: '12px 8px' }}>
                                            {le ? (
                                                <>
                                                    <p style={{ fontSize: '0.77rem', fontWeight: 600, color: '#374151', margin: 0 }}>{fmtAgo(le.created_at)}</p>
                                                    <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '1px 0 0' }}>{le.city}</p>
                                                </>
                                            ) : <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>No data</span>}
                                        </div>
                                        <div style={{ padding: '12px 8px' }}>
                                            {le ? <SourceBadge source={le.source} /> : <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>—</span>}
                                        </div>
                                        <div style={{ padding: '12px 8px', display: 'flex', justifyContent: 'center' }}>
                                            <button onClick={e => { e.stopPropagation(); setSelected(s); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 7px', cursor: 'pointer', display: 'flex', color: '#64748B', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#E0F2FE'; e.currentTarget.style.color = '#0EA5E9'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                                                <Eye size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {filtered.length > LIMIT && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                                        {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, filtered.length)} of {filtered.length}
                                    </span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <PBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></PBtn>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let n; if (totalPages <= 5) n = i + 1; else if (page <= 3) n = i + 1; else if (page >= totalPages - 2) n = totalPages - 4 + i; else n = page - 2 + i;
                                            return <PBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PBtn>;
                                        })}
                                        <PBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></PBtn>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {selected && (
                        <div style={{ width: 380, flexShrink: 0, border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', height: 'fit-content', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                            <StudentPanel student={selected} onClose={() => setSelected(null)} />
                        </div>
                    )}
                </div>
            )}

            {/* Trusted zones table (unchanged) */}
            <div style={{ marginTop: 20 }} className="fup">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '16px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Trusted Scan Zones</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '3px 0 0' }}>TrustedScanZone — school geofences used to validate scan locations</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{TRUSTED_ZONES.length} zones</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.8fr', padding: '0 22px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                        {['School', 'Label', 'Coordinates', 'Radius', 'IP Range', 'Status'].map(c => (
                            <div key={c} style={{ padding: '10px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>
                        ))}
                    </div>
                    {TRUSTED_ZONES.map((z, i) => {
                        const sch = SCHOOLS.find(s => s.id === z.school_id);
                        return (
                            <div key={z.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.8fr', padding: '0 22px', borderBottom: i < TRUSTED_ZONES.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center' }}>
                                <div style={{ padding: '12px 8px' }}>
                                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{sch?.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0' }}>{sch?.code}</p>
                                </div>
                                <div style={{ padding: '12px 8px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontWeight: 700, color: '#6366F1' }}>
                                        <Target size={12} color="#6366F1" />{z.label}
                                    </span>
                                </div>
                                <div style={{ padding: '12px 8px' }}>
                                    {z.latitude && z.longitude ? (
                                        <p style={{ fontSize: '0.7rem', color: '#374151', margin: 0, fontFamily: 'monospace' }}>
                                            {fmtCoord(z.latitude)}<br />{fmtCoord(z.longitude)}
                                        </p>
                                    ) : <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>—</span>}
                                </div>
                                <div style={{ padding: '12px 8px' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>{z.radius_m}m</span>
                                </div>
                                <div style={{ padding: '12px 8px' }}>
                                    {z.ip_range
                                        ? <code style={{ fontSize: '0.72rem', color: '#6366F1', background: '#EEF2FF', padding: '2px 6px', borderRadius: 4 }}>{z.ip_range}</code>
                                        : <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>Not set</span>}
                                </div>
                                <div style={{ padding: '12px 8px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: '0.69rem', fontWeight: 700, color: z.is_active ? '#10B981' : '#94A3B8', background: z.is_active ? '#ECFDF5' : '#F3F4F6' }}>
                                        <CircleDot size={8} strokeWidth={3} />{z.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Tiny helpers (all unchanged) ─────────────────────────────────────────────
function KpiTile({ label, value, color, bg, Icon }) {
    return (
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 5px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={color} strokeWidth={1.8} />
            </div>
            <div>
                <p style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '3px 0 0', fontWeight: 600 }}>{label}</p>
            </div>
        </div>
    );
}
function FGroup({ label, children }) {
    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 2 }}>{label}:</span>
            {children}
        </div>
    );
}
function FPill({ active, accent = '#0EA5E9', onClick, children }) {
    return <button onClick={onClick} style={{ padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${active ? accent : '#E2E8F0'}`, background: active ? accent + '15' : '#fff', color: active ? accent : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}>{children}</button>;
}
function FSel({ value, onChange, active, accent = '#0EA5E9', children }) {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value} onChange={onChange} style={{ padding: '4px 26px 4px 11px', borderRadius: 20, border: `1.5px solid ${active ? accent : '#E2E8F0'}`, background: active ? accent + '12' : '#fff', color: active ? accent : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', appearance: 'none', outline: 'none', fontFamily: 'inherit' }}>{children}</select>
            <ChevronDown size={10} color={active ? accent : '#94A3B8'} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
    );
}
function PBtn({ onClick, disabled, active, children }) {
    return <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1.5px solid ${active ? '#0EA5E9' : '#E2E8F0'}`, background: active ? '#0EA5E9' : '#fff', color: active ? '#fff' : '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>{children}</button>;
}
