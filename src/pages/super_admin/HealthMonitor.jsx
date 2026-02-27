/**
 * SUPER ADMIN — HEALTH MONITOR
 * Real-time service status, uptime, response times, error rates.
 */

import { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Server, Database, Wifi, Cloud, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters.js';

const SERVICES = [
    { id: 'api', name: 'API Server', icon: Server, status: 'HEALTHY', uptime: 99.97, latency: 142, region: 'Mumbai' },
    { id: 'db', name: 'Database (Postgres)', icon: Database, status: 'HEALTHY', uptime: 99.99, latency: 8, region: 'Mumbai' },
    { id: 'qr', name: 'QR Scan Service', icon: Wifi, status: 'HEALTHY', uptime: 99.95, latency: 98, region: 'Global CDN' },
    { id: 'notif', name: 'Notification Service', icon: Cloud, status: 'DEGRADED', uptime: 98.12, latency: 520, region: 'Mumbai' },
    { id: 'sms', name: 'SMS Gateway', icon: Cloud, status: 'DEGRADED', uptime: 97.45, latency: 1240, region: 'Third-party' },
    { id: 'storage', name: 'File Storage (S3)', icon: Server, status: 'HEALTHY', uptime: 99.99, latency: 32, region: 'Mumbai' },
    { id: 'cache', name: 'Redis Cache', icon: Database, status: 'HEALTHY', uptime: 99.98, latency: 2, region: 'Mumbai' },
    { id: 'email', name: 'Email Service', icon: Cloud, status: 'DOWN', uptime: 93.20, latency: null, region: 'Third-party' },
];

const INCIDENTS = [
    { id: 'inc1', title: 'SMS Gateway degraded performance', status: 'INVESTIGATING', severity: 'MEDIUM', started_at: new Date(Date.now() - 3600000 * 2).toISOString(), updated_at: new Date(Date.now() - 1800000).toISOString(), message: 'Elevated latency observed on outbound SMS delivery. Vendor notified.' },
    { id: 'inc2', title: 'Email service outage', status: 'IDENTIFIED', severity: 'HIGH', started_at: new Date(Date.now() - 3600000 * 4).toISOString(), updated_at: new Date(Date.now() - 3600000 * 1).toISOString(), message: 'Email service provider experiencing an outage. Escalated to vendor support.' },
    { id: 'inc3', title: 'Scheduled DB maintenance', status: 'RESOLVED', severity: 'LOW', started_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date(Date.now() - 86400000 * 1).toISOString(), message: 'Maintenance completed successfully. All systems operational.' },
];

const STATUS_META = {
    HEALTHY: { label: 'Healthy', color: '#047857', bg: '#ECFDF5', Icon: CheckCircle },
    DEGRADED: { label: 'Degraded', color: '#B45309', bg: '#FFFBEB', Icon: AlertTriangle },
    DOWN: { label: 'Down', color: '#B91C1C', bg: '#FEF2F2', Icon: XCircle },
};

const INCIDENT_STATUS_META = {
    INVESTIGATING: { color: '#B91C1C', bg: '#FEF2F2' },
    IDENTIFIED: { color: '#B45309', bg: '#FFFBEB' },
    MONITORING: { color: '#0369A1', bg: '#E0F2FE' },
    RESOLVED: { color: '#047857', bg: '#ECFDF5' },
};

const SEVERITY_META = {
    HIGH: { color: '#B91C1C', bg: '#FEF2F2' },
    MEDIUM: { color: '#B45309', bg: '#FFFBEB' },
    LOW: { color: '#0369A1', bg: '#E0F2FE' },
};

export default function HealthMonitor() {
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 800));
        setLastRefreshed(new Date());
        setRefreshing(false);
    };

    const healthyCount = SERVICES.filter(s => s.status === 'HEALTHY').length;
    const degradedCount = SERVICES.filter(s => s.status === 'DEGRADED').length;
    const downCount = SERVICES.filter(s => s.status === 'DOWN').length;
    const overallStatus = downCount > 0 ? 'DOWN' : degradedCount > 0 ? 'DEGRADED' : 'HEALTHY';
    const activeIncidents = INCIDENTS.filter(i => i.status !== 'RESOLVED');

    return (
        <div style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Health Monitor</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        Last refreshed {formatRelativeTime(lastRefreshed.toISOString())}
                    </p>
                </div>
                <button
                    onClick={refresh}
                    disabled={refreshing}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', cursor: refreshing ? 'not-allowed' : 'pointer' }}>
                    <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </div>

            {/* Overall status banner */}
            <div style={{
                background: STATUS_META[overallStatus].bg,
                border: `1px solid ${overallStatus === 'HEALTHY' ? '#10B981' : overallStatus === 'DEGRADED' ? '#F59E0B' : '#EF4444'}`,
                borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.createElement(STATUS_META[overallStatus].Icon, { size: 22, color: STATUS_META[overallStatus].color })}
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: STATUS_META[overallStatus].color }}>
                        {overallStatus === 'HEALTHY' ? 'All Systems Operational' : overallStatus === 'DEGRADED' ? 'Partial System Degradation' : 'Service Disruption Detected'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {healthyCount} healthy · {degradedCount} degraded · {downCount} down
                        {activeIncidents.length > 0 && ` · ${activeIncidents.length} active incident${activeIncidents.length > 1 ? 's' : ''}`}
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {[
                    ['Healthy Services', healthyCount, '#10B981', '#ECFDF5'],
                    ['Degraded', degradedCount, '#F59E0B', '#FFFBEB'],
                    ['Down', downCount, '#EF4444', '#FEF2F2'],
                    ['Active Incidents', activeIncidents.length, '#6366F1', '#EEF2FF'],
                ].map(([label, val, color, bg]) => (
                    <div key={label} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color }}>{val}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '16px', alignItems: 'start' }}>
                {/* Service list */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Service Status</h3>
                    </div>
                    {SERVICES.map((service, idx) => {
                        const meta = STATUS_META[service.status];
                        return (
                            <div key={service.id} style={{ padding: '14px 20px', borderBottom: idx < SERVICES.length - 1 ? '1px solid var(--border-default)' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <service.icon size={17} color={meta.color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{service.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {service.region} · {service.uptime}% uptime
                                    </div>
                                </div>
                                {service.latency !== null && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: service.latency > 500 ? '#B45309' : 'var(--color-success-600)' }}>
                                            {service.latency}ms
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>latency</div>
                                    </div>
                                )}
                                <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                    <meta.Icon size={11} /> {meta.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Incidents */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Incidents</h3>
                        {activeIncidents.length > 0 && (
                            <span style={{ background: '#EF4444', color: 'white', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{activeIncidents.length} active</span>
                        )}
                    </div>
                    <div style={{ padding: '12px' }}>
                        {INCIDENTS.map(inc => {
                            const statusMeta = INCIDENT_STATUS_META[inc.status] || INCIDENT_STATUS_META.INVESTIGATING;
                            const sevMeta = SEVERITY_META[inc.severity] || SEVERITY_META.MEDIUM;
                            return (
                                <div key={inc.id} style={{ padding: '14px 16px', marginBottom: '8px', borderRadius: '10px', border: '1px solid var(--border-default)', background: inc.status === 'RESOLVED' ? 'var(--color-slate-50)' : 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1, minWidth: '100px' }}>{inc.title}</span>
                                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: statusMeta.bg, color: statusMeta.color }}>{inc.status}</span>
                                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: sevMeta.bg, color: sevMeta.color }}>{inc.severity}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.5 }}>{inc.message}</p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> Started {formatRelativeTime(inc.started_at)}</span>
                                        <span>· Updated {formatRelativeTime(inc.updated_at)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Need React for createElement in JSX context
import React from 'react';