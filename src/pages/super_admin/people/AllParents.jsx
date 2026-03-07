/**
 * ALL PARENTS — Super Admin
 * Schema models: ParentUser, ParentStudent, ParentDevice, Session, Student, School
 *
 * ParentUser fields: id, phone, phone_index, email, is_phone_verified,
 *   is_email_verified, status (ACTIVE|SUSPENDED|DELETED), created_at,
 *   last_login_at, deleted_at
 * ParentDevice: id, parent_id, device_token, platform (IOS|ANDROID|WEB),
 *   device_name, app_version, is_active, last_seen_at
 * ParentStudent: parent_id, student_id, relationship, is_primary
 *
 * Production: replace simulateAPI() with real fetch to
 *   GET /api/super/parents?q=&status=&verified=&platform=&page=&limit=20
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Users, Search, SlidersHorizontal, X, ChevronDown,
    ChevronLeft, ChevronRight, Eye, ShieldOff, ShieldCheck,
    Smartphone, Phone, Mail, CheckCircle2, XCircle,
    AlertTriangle, RefreshCw, Loader2, Clock, Ban,
    UserX, UserCheck, Check, Copy, KeyRound, Layers,
    Monitor, Tablet, LogOut, CircleDot, Hash,
    BadgeCheck, PhoneCall, MailCheck, MailX, PhoneOff,
    Building2, User, Heart, Calendar
} from 'lucide-react';

// ─── SCHEMA-ALIGNED MOCK DATA ─────────────────────────────────────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International', code: 'GWI' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA' },
    { id: 'sch-003', name: 'Delhi Public School R3', code: 'DPS' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS' },
];

const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt', 'Grandparent'];
const PLATFORMS = ['IOS', 'ANDROID', 'WEB'];
const USER_STATUSES = ['ACTIVE', 'SUSPENDED', 'DELETED'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randPhone() { return `+91${Math.floor(9000000000 + Math.random() * 999999999)}`; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

const FIRST_NAMES = ['Rajesh', 'Sunita', 'Amit', 'Priya', 'Vikram', 'Meena', 'Sanjay', 'Kavita', 'Anil', 'Rekha', 'Suresh', 'Nisha', 'Deepak', 'Seema', 'Ravi', 'Anita', 'Manoj', 'Pooja', 'Dinesh', 'Lata'];
const LAST_NAMES = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehta', 'Shah', 'Joshi', 'Nair', 'Reddy', 'Rao', 'Iyer', 'Das', 'Bose', 'Mishra', 'Tiwari', 'Pandey', 'Kapoor', 'Malhotra'];

const TOTAL_MOCK = 183;

const ALL_PARENTS = Array.from({ length: TOTAL_MOCK }, (_, i) => {
    const fn = FIRST_NAMES[i % 20];
    const ln = LAST_NAMES[Math.floor(i / 20) % 20];
    const stat = i % 15 === 0 ? 'SUSPENDED' : i % 25 === 0 ? 'DELETED' : 'ACTIVE';
    const numDevices = Math.floor(Math.random() * 3) + 1;
    const school = SCHOOLS[i % SCHOOLS.length];

    const devices = Array.from({ length: numDevices }, (_, j) => ({
        id: `dev-${i}-${j}`,
        platform: rand(PLATFORMS),
        device_name: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'iPad Pro', 'OnePlus 12', 'Pixel 8', 'Redmi Note 13'][Math.floor(Math.random() * 6)],
        app_version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        is_active: j === 0,
        last_seen_at: j === 0 ? daysAgo(Math.floor(Math.random() * 7)) : daysAgo(Math.floor(Math.random() * 60) + 7),
        device_token: `fcm_${Math.random().toString(36).slice(2, 14)}`,
    }));

    const numChildren = Math.floor(Math.random() * 3) + 1;
    const children = Array.from({ length: numChildren }, (_, j) => ({
        student_id: `stu-${String(i * 3 + j + 1).padStart(5, '0')}`,
        student_name: `${['Aarav', 'Ananya', 'Arjun', 'Diya', 'Ishaan'][j % 5]} ${ln}`,
        class: `${Math.floor(Math.random() * 12) + 1}`,
        section: rand(['A', 'B', 'C', 'D']),
        relationship: rand(RELATIONSHIPS),
        is_primary: j === 0,
        school: school,
    }));

    return {
        id: `par-${String(i + 1).padStart(5, '0')}`,
        phone: randPhone(),
        phone_index: `+91${String(9000000000 + i)}`,
        email: i % 4 === 0 ? null : `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
        is_phone_verified: i % 8 !== 0,
        is_email_verified: i % 4 !== 0 && i % 6 !== 0,
        status: stat,
        created_at: daysAgo(Math.floor(Math.random() * 400)),
        last_login_at: stat === 'ACTIVE' ? daysAgo(Math.floor(Math.random() * 30)) : null,
        deleted_at: stat === 'DELETED' ? daysAgo(5) : null,
        devices,
        children,
        _name: `${fn} ${ln}`,
    };
});

// ─── SERVER-SIDE SIMULATION ───────────────────────────────────────────────────
async function simulateAPI({ q, status, phoneVerified, emailVerified, platform, page, limit }) {
    await new Promise(r => setTimeout(r, 300));
    let results = [...ALL_PARENTS];
    if (q) {
        const lq = q.toLowerCase();
        results = results.filter(p =>
            p._name.toLowerCase().includes(lq) ||
            p.id.toLowerCase().includes(lq) ||
            p.phone.includes(lq) ||
            (p.email || '').toLowerCase().includes(lq)
        );
    }
    if (status !== 'ALL') results = results.filter(p => p.status === status);
    if (phoneVerified !== 'ALL') results = results.filter(p => phoneVerified === 'YES' ? p.is_phone_verified : !p.is_phone_verified);
    if (emailVerified !== 'ALL') results = results.filter(p => emailVerified === 'YES' ? p.is_email_verified : !p.is_email_verified);
    if (platform !== 'ALL') results = results.filter(p => p.devices.some(d => d.platform === platform && d.is_active));
    const total = results.length;
    const data = results.slice((page - 1) * limit, page * limit);
    return { data, total, page, limit };
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const STATUS_CFG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5' },
    SUSPENDED: { label: 'Suspended', color: '#F59E0B', bg: '#FFFBEB' },
    DELETED: { label: 'Deleted', color: '#EF4444', bg: '#FEF2F2' },
};
const PLATFORM_CFG = {
    IOS: { label: 'iOS', color: '#374151', bg: '#F3F4F6', Icon: Smartphone },
    ANDROID: { label: 'Android', color: '#10B981', bg: '#ECFDF5', Icon: Smartphone },
    WEB: { label: 'Web', color: '#6366F1', bg: '#EEF2FF', Icon: Monitor },
};

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtPhone = p => p ? p.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3') : '—';
const initials = name => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
const avatarColor = id => {
    const colors = ['#EC4899', '#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#6366F1', '#14B8A6'];
    let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % colors.length;
    return colors[h];
};
const LIMIT = 20;

// ─── DRAWER ───────────────────────────────────────────────────────────────────
function ParentDrawer({ parent: raw, onClose, onAction }) {
    const [parent, setParent] = useState(raw);
    const [busy, setBusy] = useState(null);
    const [done, setDone] = useState(null);
    const [copied, setCopied] = useState(null);
    const [tab, setTab] = useState('profile'); // profile | devices | children

    useEffect(() => { setParent(raw); setBusy(null); setDone(null); setTab('profile'); }, [raw]);
    if (!parent) return null;

    const copy = (val, k) => { navigator.clipboard.writeText(val).catch(() => { }); setCopied(k); setTimeout(() => setCopied(null), 1800); };

    const doAction = async (type) => {
        setBusy(type);
        await new Promise(r => setTimeout(r, 1000));
        let updated = { ...parent };
        if (type === 'suspend') updated.status = 'SUSPENDED';
        if (type === 'activate') updated.status = 'ACTIVE';
        if (type === 'revoke_devices') updated = { ...updated, devices: updated.devices.map(d => ({ ...d, is_active: false })) };
        setParent(updated);
        setBusy(null); setDone(type);
        onAction(parent.id, type, updated);
        setTimeout(() => setDone(null), 2000);
    };

    const sc = STATUS_CFG[parent.status];
    const ac = avatarColor(parent.id);
    const activeDevices = parent.devices.filter(d => d.is_active);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 300, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ width: '100%', maxWidth: 520, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 50px rgba(0,0,0,0.18)', animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}>

                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', padding: '28px 28px 0', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                {initials(parent._name)}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>{parent._name}</h2>
                                <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.5)', margin: '3px 0 0', fontFamily: 'monospace' }}>{parent.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                            <X size={15} color="rgba(255,255,255,0.6)" />
                        </button>
                    </div>

                    {/* Status strip */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        <DChip label={sc.label} color={sc.color} />
                        <DChip label={parent.is_phone_verified ? 'Phone Verified' : 'Phone Unverified'} color={parent.is_phone_verified ? '#10B981' : '#EF4444'} />
                        <DChip label={`${parent.children.length} Child${parent.children.length !== 1 ? 'ren' : ''}`} color="#6366F1" />
                        <DChip label={`${activeDevices.length} Device${activeDevices.length !== 1 ? 's' : ''}`} color="#0EA5E9" />
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['profile', 'devices', 'children'].map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 18px', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t ? '#6366F1' : 'transparent'}`, color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s', marginBottom: -1 }}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

                    {tab === 'profile' && (
                        <>
                            <DSection title="Contact Info" icon={Phone} color="#6366F1">
                                <DRow label="Phone" value={<CopyV val={fmtPhone(parent.phone)} k="ph" copied={copied} onCopy={copy} raw={parent.phone} />} />
                                <DRow label="Phone Index" value={<code style={{ fontSize: '0.78rem', color: '#6366F1' }}>{parent.phone_index || '—'}</code>} />
                                <DRow label="Email" value={parent.email ? <CopyV val={parent.email} k="em" copied={copied} onCopy={copy} /> : <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Not provided</span>} />
                            </DSection>
                            <DSection title="Verification" icon={BadgeCheck} color="#10B981">
                                <DRow label="Phone Verified" value={<VerBadge ok={parent.is_phone_verified} yes="Verified" no="Unverified" />} />
                                <DRow label="Email Verified" value={parent.email ? <VerBadge ok={parent.is_email_verified} yes="Verified" no="Unverified" /> : <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>No email</span>} />
                            </DSection>
                            <DSection title="Account" icon={User} color="#0EA5E9">
                                <DRow label="Status" value={<span style={{ padding: '3px 9px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, color: sc.color, background: sc.bg }}>{sc.label}</span>} />
                                <DRow label="Joined" value={fmtDate(parent.created_at)} />
                                <DRow label="Last Login" value={fmtDate(parent.last_login_at)} />
                                {parent.deleted_at && <DRow label="Deleted At" value={<span style={{ color: '#EF4444', fontWeight: 700 }}>{fmtDate(parent.deleted_at)}</span>} />}
                            </DSection>
                        </>
                    )}

                    {tab === 'devices' && (
                        <>
                            {parent.devices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                                    <Smartphone size={32} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 8 }} />
                                    <p style={{ fontWeight: 700, margin: 0 }}>No devices registered</p>
                                </div>
                            ) : parent.devices.map((d, i) => {
                                const pc = PLATFORM_CFG[d.platform] || PLATFORM_CFG.ANDROID;
                                const PIcon = pc.Icon;
                                return (
                                    <div key={d.id} style={{ background: d.is_active ? '#F8FAFC' : '#FAFAFA', borderRadius: 12, padding: '14px 16px', border: `1px solid ${d.is_active ? '#E2E8F0' : '#F1F5F9'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <PIcon size={16} color={pc.color} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{d.device_name}</p>
                                                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '2px 0 0' }}>{d.platform} · v{d.app_version}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 7, flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: d.is_active ? '#10B981' : '#94A3B8', background: d.is_active ? '#ECFDF5' : '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>
                                                    {d.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Last seen {fmtDate(d.last_seen_at)}</span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                                            <DRow label="Token" value={<code style={{ fontSize: '0.7rem', color: '#6366F1' }}>{d.device_token.slice(0, 20)}…</code>} />
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {tab === 'children' && (
                        <>
                            {parent.children.map((c, i) => (
                                <div key={c.student_id} style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{c.student_name}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '2px 0 0', fontFamily: 'monospace' }}>{c.student_id}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {c.is_primary && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '2px 7px', borderRadius: 20 }}>PRIMARY</span>}
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#374151', background: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>{c.relationship}</span>
                                        </div>
                                    </div>
                                    <DRow label="School" value={c.school?.name} />
                                    <DRow label="Class" value={`Class ${c.class} — Section ${c.section}`} />
                                </div>
                            ))}
                        </>
                    )}

                    {/* Danger warning */}
                    {parent.status === 'SUSPENDED' && (
                        <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '12px 16px', border: '1px solid #FDE68A', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Account Suspended</p>
                                <p style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 500, margin: '3px 0 0' }}>Parent cannot log in. All devices are blocked.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <p style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Actions</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {parent.status === 'ACTIVE' ? (
                            <ActBtn icon={UserX} label="Suspend" type="suspend" busy={busy} done={done} color="#F59E0B" bg="#FFFBEB" onClick={() => doAction('suspend')} />
                        ) : parent.status === 'SUSPENDED' ? (
                            <ActBtn icon={UserCheck} label="Reactivate" type="activate" busy={busy} done={done} color="#10B981" bg="#ECFDF5" onClick={() => doAction('activate')} />
                        ) : null}
                        <ActBtn icon={LogOut} label="Revoke Devices" type="revoke_devices" busy={busy} done={done} color="#EF4444" bg="#FEF2F2"
                            disabled={activeDevices.length === 0} onClick={() => doAction('revoke_devices')} />
                    </div>
                    <button onClick={onClose} style={{ padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AllParentsPage() {
    const [parents, setParents] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [debouncedQ, setDebouncedQ] = useState('');
    const [statusF, setStatusF] = useState('ALL');
    const [phoneVerF, setPhoneVerF] = useState('ALL');
    const [emailVerF, setEmailVerF] = useState('ALL');
    const [platformF, setPlatformF] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState(null);
    const [toast, setToast] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { setDebouncedQ(q); setPage(1); }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [q]);

    const fetchParents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await simulateAPI({ q: debouncedQ, status: statusF, phoneVerified: phoneVerF, emailVerified: emailVerF, platform: platformF, page, limit: LIMIT });
            setParents(res.data);
            setTotal(res.total);
        } finally { setLoading(false); }
    }, [debouncedQ, statusF, phoneVerF, emailVerF, platformF, page]);

    useEffect(() => { fetchParents(); }, [fetchParents]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const activeFilters = [statusF !== 'ALL', phoneVerF !== 'ALL', emailVerF !== 'ALL', platformF !== 'ALL'].filter(Boolean).length;
    const clearFilters = () => { setStatusF('ALL'); setPhoneVerF('ALL'); setEmailVerF('ALL'); setPlatformF('ALL'); setPage(1); };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

    const handleAction = (id, type, updated) => {
        setParents(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
        const msgs = { suspend: 'Parent suspended', activate: 'Parent reactivated', revoke_devices: 'All devices revoked' };
        showToast(msgs[type] || 'Action complete');
    };

    const stats = {
        total: TOTAL_MOCK,
        active: ALL_PARENTS.filter(p => p.status === 'ACTIVE').length,
        suspended: ALL_PARENTS.filter(p => p.status === 'SUSPENDED').length,
        phoneVer: ALL_PARENTS.filter(p => p.is_phone_verified).length,
        devices: ALL_PARENTS.reduce((s, p) => s + p.devices.filter(d => d.is_active).length, 0),
    };

    const GRID = '2fr 1.3fr 0.9fr 0.9fr 1fr 1fr 0.5fr';
    const COLS = ['Parent', 'Phone / Email', 'Status', 'Verified', 'Children', 'Last Login', ''];

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto', fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .fup { animation:fadeUp 0.3s ease both; }
        .tr:hover { background:#F8FAFC !important; }
        input:focus,select:focus { border-color:#6366F1 !important; outline:none; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#F3F4F6} ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:8px}
      `}</style>

            {toast && (
                <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#0F172A', color: '#fff', padding: '11px 20px', borderRadius: 12, fontSize: '0.83rem', fontWeight: 700, zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8, animation: 'toastIn 0.2s ease', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <CheckCircle2 size={14} color="#10B981" />{toast}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }} className="fup">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#EC4899,#F43F5E)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(236,72,153,0.4)' }}>
                        <Users size={19} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>All Parents</h1>
                        <p style={{ fontSize: '0.77rem', color: '#64748B', margin: '2px 0 0' }}>
                            {loading ? 'Loading…' : `${total.toLocaleString()} parents · ${stats.devices.toLocaleString()} active devices`}
                        </p>
                    </div>
                </div>
                <button onClick={fetchParents} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.color = '#EC4899'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}>
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 13, marginBottom: 22 }} className="fup">
                <StatTile label="Total Parents" value={stats.total} color="#EC4899" bg="#FDF2F8" icon={Users} />
                <StatTile label="Active" value={stats.active} color="#10B981" bg="#ECFDF5" icon={UserCheck} />
                <StatTile label="Suspended" value={stats.suspended} color="#F59E0B" bg="#FFFBEB" icon={UserX} />
                <StatTile label="Phone Verified" value={stats.phoneVer} color="#6366F1" bg="#EEF2FF" icon={PhoneCall} />
                <StatTile label="Active Devices" value={stats.devices} color="#0EA5E9" bg="#E0F2FE" icon={Smartphone} />
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '13px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fup">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, parent ID, phone number, email…"
                            style={{ width: '100%', padding: '9px 12px 9px 33px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', color: '#0F172A', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
                    </div>
                    <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${showFilters || activeFilters ? '#EC4899' : '#E2E8F0'}`, background: showFilters || activeFilters ? '#FDF2F8' : '#F8FAFC', color: showFilters || activeFilters ? '#EC4899' : '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <SlidersHorizontal size={13} /> Filters
                        {activeFilters > 0 && <span style={{ background: '#EC4899', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: '0.66rem', fontWeight: 900 }}>{activeFilters}</span>}
                    </button>
                    <span style={{ fontSize: '0.77rem', color: '#94A3B8', fontWeight: 600, marginLeft: 'auto', flexShrink: 0 }}>
                        {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : `${total.toLocaleString()} records`}
                    </span>
                </div>

                {showFilters && (
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 12, paddingTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <FGroup label="Status">
                            {['ALL', 'ACTIVE', 'SUSPENDED', 'DELETED'].map(s => {
                                const cfg = STATUS_CFG[s];
                                return <FPill key={s} active={statusF === s} color={cfg?.color || '#EC4899'} bg={cfg?.bg || '#FDF2F8'} onClick={() => { setStatusF(s); setPage(1); }}>
                                    {s === 'ALL' ? 'All' : cfg.label}
                                </FPill>;
                            })}
                        </FGroup>
                        <FGroup label="Phone">
                            {[['ALL', 'All'], ['YES', 'Verified'], ['NO', 'Unverified']].map(([v, l]) => <FPill key={v} active={phoneVerF === v} color="#10B981" bg="#ECFDF5" onClick={() => { setPhoneVerF(v); setPage(1); }}>{l}</FPill>)}
                        </FGroup>
                        <FGroup label="Email">
                            {[['ALL', 'All'], ['YES', 'Verified'], ['NO', 'Unverified']].map(([v, l]) => <FPill key={v} active={emailVerF === v} color="#6366F1" bg="#EEF2FF" onClick={() => { setEmailVerF(v); setPage(1); }}>{l}</FPill>)}
                        </FGroup>
                        <FGroup label="Device">
                            {['ALL', ...PLATFORMS].map(p => <FPill key={p} active={platformF === p} color="#0EA5E9" bg="#E0F2FE" onClick={() => { setPlatformF(p); setPage(1); }}>
                                {p === 'ALL' ? 'All' : p}
                            </FPill>)}
                        </FGroup>
                        {activeFilters > 0 && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'center', marginLeft: 'auto' }}><X size={10} />Clear All</button>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }} className="fup">
                <div style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                    {COLS.map(c => <div key={c} style={{ padding: '11px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>)}
                </div>

                {loading ? (
                    <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#94A3B8' }}>
                        <Loader2 size={28} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite', color: '#EC4899' }} />
                        <p style={{ fontSize: '0.83rem', fontWeight: 600, margin: 0 }}>Loading parents…</p>
                    </div>
                ) : parents.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                        <Users size={36} strokeWidth={1} style={{ opacity: 0.35, marginBottom: 10 }} />
                        <p style={{ fontWeight: 800, color: '#64748B', margin: 0 }}>No parents found</p>
                        <p style={{ fontSize: '0.8rem', margin: '5px 0 0' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : parents.map((p, i) => {
                    const sc = STATUS_CFG[p.status];
                    const ac = avatarColor(p.id);
                    const activeDevices = p.devices.filter(d => d.is_active);
                    const primaryChild = p.children.find(c => c.is_primary) || p.children[0];
                    return (
                        <div key={p.id} className="tr" style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', borderBottom: i < parents.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                            onClick={() => setSelected(p)}>
                            {/* Parent */}
                            <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: 11 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                    {initials(p._name)}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p._name}</p>
                                    <p style={{ fontSize: '0.69rem', color: '#94A3B8', margin: '1px 0 0', fontFamily: 'monospace' }}>{p.id}</p>
                                </div>
                            </div>
                            {/* Contact */}
                            <div style={{ padding: '12px 8px' }}>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', margin: 0 }}>{fmtPhone(p.phone)}</p>
                                {p.email
                                    ? <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{p.email}</p>
                                    : <p style={{ fontSize: '0.7rem', color: '#CBD5E1', margin: '2px 0 0', fontStyle: 'italic' }}>No email</p>}
                            </div>
                            {/* Status */}
                            <div style={{ padding: '12px 8px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: '0.69rem', fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}20` }}>
                                    <CircleDot size={8} strokeWidth={3} />{sc.label}
                                </span>
                            </div>
                            {/* Verified */}
                            <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', fontWeight: 700, color: p.is_phone_verified ? '#10B981' : '#EF4444' }}>
                                    {p.is_phone_verified ? <CheckCircle2 size={11} /> : <XCircle size={11} />} Phone
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', fontWeight: 700, color: p.is_email_verified ? '#10B981' : '#94A3B8' }}>
                                    {p.is_email_verified ? <CheckCircle2 size={11} /> : <XCircle size={11} />} Email
                                </span>
                            </div>
                            {/* Children */}
                            <div style={{ padding: '12px 8px' }}>
                                {primaryChild ? (
                                    <>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{primaryChild.student_name}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0' }}>+{p.children.length - 1} more · {primaryChild.school?.code}</p>
                                    </>
                                ) : <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>—</span>}
                            </div>
                            {/* Last login */}
                            <div style={{ padding: '12px 8px' }}>
                                {p.last_login_at
                                    ? <span style={{ fontSize: '0.77rem', color: '#64748B' }}>{fmtDate(p.last_login_at)}</span>
                                    : <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontStyle: 'italic' }}>Never</span>}
                                {activeDevices.length > 0 && <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '2px 0 0' }}>{activeDevices.length} device{activeDevices.length !== 1 ? 's' : ''}</p>}
                            </div>
                            {/* Action */}
                            <div style={{ padding: '12px 8px', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={e => { e.stopPropagation(); setSelected(p); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 7px', cursor: 'pointer', display: 'flex', color: '#64748B', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FDF2F8'; e.currentTarget.style.color = '#EC4899'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                                    <Eye size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Pagination */}
                {!loading && total > LIMIT && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <PBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} accent="#EC4899"><ChevronLeft size={14} /></PBtn>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let n; if (totalPages <= 5) n = i + 1; else if (page <= 3) n = i + 1; else if (page >= totalPages - 2) n = totalPages - 4 + i; else n = page - 2 + i;
                                return <PBtn key={n} active={page === n} accent="#EC4899" onClick={() => setPage(n)}>{n}</PBtn>;
                            })}
                            {totalPages > 5 && <span style={{ padding: '0 4px', lineHeight: '32px', color: '#94A3B8' }}>…</span>}
                            <PBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} accent="#EC4899"><ChevronRight size={14} /></PBtn>
                        </div>
                    </div>
                )}
            </div>

            {selected && <ParentDrawer parent={parents.find(p => p.id === selected.id) || selected} onClose={() => setSelected(null)} onAction={handleAction} />}
        </div>
    );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function StatTile({ label, value, color, bg, icon: Icon }) {
    return (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 5px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} strokeWidth={1.8} />
            </div>
            <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{value.toLocaleString()}</p>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '4px 0 0', fontWeight: 600 }}>{label}</p>
            </div>
        </div>
    );
}
function DSection({ title, icon: Icon, color, children }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={12} color={color} strokeWidth={2.2} />
                </div>
                <p style={{ fontSize: '0.68rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{title}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{children}</div>
        </div>
    );
}
function DRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <div style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</div>
        </div>
    );
}
function DChip({ label, color }) {
    return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, color, background: color + '22', border: `1px solid ${color}25` }}>{label}</span>;
}
function VerBadge({ ok, yes, no }) {
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: ok ? '#10B981' : '#EF4444' }}>
        {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}{ok ? yes : no}
    </span>;
}
function CopyV({ val, k, copied, onCopy, raw }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>{val}</span>
            <button onClick={() => onCopy(raw || val, k)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#CBD5E1', display: 'flex', padding: 2 }}>
                {copied === k ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
            </button>
        </span>
    );
}
function ActBtn({ icon: Icon, label, type, busy, done, color, bg, disabled, onClick }) {
    const isLoading = busy === type; const isDone = done === type;
    return (
        <button onClick={onClick} disabled={disabled || busy !== null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${color}25`, background: bg, color, fontSize: '0.78rem', fontWeight: 700, cursor: disabled || busy ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s' }}>
            {isLoading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : isDone ? <Check size={13} /> : <Icon size={13} />}
            {isLoading ? 'Wait…' : isDone ? 'Done!' : label}
        </button>
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
function FPill({ active, color = '#EC4899', bg = '#FDF2F8', onClick, children }) {
    return <button onClick={onClick} style={{ padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${active ? color : '#E2E8F0'}`, background: active ? bg : '#fff', color: active ? color : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}>{children}</button>;
}
function PBtn({ onClick, disabled, active, accent = '#6366F1', children }) {
    return <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1.5px solid ${active ? accent : '#E2E8F0'}`, background: active ? accent : '#fff', color: active ? '#fff' : '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>{children}</button>;
}