/**
 * SUPER ADMIN — HEALTH MONITOR
 * Real-time service status, uptime, response times, error rates.
 */

import { useState } from 'react';
import {
    Activity, CheckCircle, AlertTriangle, XCircle,
    RefreshCw, Server, Database, Wifi, Cloud, Clock,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters.js';

const SERVICES = [
    { id: 'api',     name: 'API Server',              icon: Server,   status: 'HEALTHY',  uptime: 99.97, latency: 142,  region: 'Mumbai'      },
    { id: 'db',      name: 'Database (Postgres)',      icon: Database, status: 'HEALTHY',  uptime: 99.99, latency: 8,    region: 'Mumbai'      },
    { id: 'qr',      name: 'QR Scan Service',          icon: Wifi,     status: 'HEALTHY',  uptime: 99.95, latency: 98,   region: 'Global CDN'  },
    { id: 'notif',   name: 'Notification Service',     icon: Cloud,    status: 'DEGRADED', uptime: 98.12, latency: 520,  region: 'Mumbai'      },
    { id: 'sms',     name: 'SMS Gateway',              icon: Cloud,    status: 'DEGRADED', uptime: 97.45, latency: 1240, region: 'Third-party' },
    { id: 'storage', name: 'File Storage (S3)',        icon: Server,   status: 'HEALTHY',  uptime: 99.99, latency: 32,   region: 'Mumbai'      },
    { id: 'cache',   name: 'Redis Cache',              icon: Database, status: 'HEALTHY',  uptime: 99.98, latency: 2,    region: 'Mumbai'      },
    { id: 'email',   name: 'Email Service',            icon: Cloud,    status: 'DOWN',     uptime: 93.20, latency: null, region: 'Third-party' },
];

const INCIDENTS = [
    { id: 'inc1', title: 'SMS Gateway degraded performance', status: 'INVESTIGATING', severity: 'MEDIUM', started_at: new Date(Date.now() - 3600000 * 2).toISOString(), updated_at: new Date(Date.now() - 1800000).toISOString(),    message: 'Elevated latency observed on outbound SMS delivery. Vendor notified.' },
    { id: 'inc2', title: 'Email service outage',             status: 'IDENTIFIED',    severity: 'HIGH',   started_at: new Date(Date.now() - 3600000 * 4).toISOString(), updated_at: new Date(Date.now() - 3600000).toISOString(),     message: 'Email service provider experiencing an outage. Escalated to vendor support.' },
    { id: 'inc3', title: 'Scheduled DB maintenance',         status: 'RESOLVED',      severity: 'LOW',    started_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString(), message: 'Maintenance completed successfully. All systems operational.' },
];

// Tailwind classes per service/overall status
const STATUS_META = {
    HEALTHY:  { label: 'Healthy',  textColor: 'text-success-700', badgeCls: 'bg-success-50 text-success-700', iconBg: 'bg-success-50',  bannerBg: 'bg-success-50  border-success-500', Icon: CheckCircle  },
    DEGRADED: { label: 'Degraded', textColor: 'text-warning-700', badgeCls: 'bg-warning-50 text-warning-700', iconBg: 'bg-warning-50',  bannerBg: 'bg-warning-50  border-warning-500', Icon: AlertTriangle },
    DOWN:     { label: 'Down',     textColor: 'text-danger-700',  badgeCls: 'bg-danger-50  text-danger-700',  iconBg: 'bg-danger-50',   bannerBg: 'bg-danger-50   border-danger-500',  Icon: XCircle      },
};

const INCIDENT_STATUS_BADGE = {
    INVESTIGATING: 'bg-danger-50  text-danger-700',
    IDENTIFIED:    'bg-warning-50 text-warning-700',
    MONITORING:    'bg-info-50    text-info-700',
    RESOLVED:      'bg-success-50 text-success-700',
};

const SEVERITY_BADGE = {
    HIGH:   'bg-danger-50  text-danger-700',
    MEDIUM: 'bg-warning-50 text-warning-700',
    LOW:    'bg-info-50    text-info-700',
};

const OVERALL_LABEL = {
    HEALTHY:  'All Systems Operational',
    DEGRADED: 'Partial System Degradation',
    DOWN:     'Service Disruption Detected',
};

/* ── Stats mini-card ─────────────────────────────────────────────────────── */
// color/bg are kept as raw hex because these four are one-off values not in the palette
const StatMini = ({ label, value, color, bg }) => (
    <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] px-5 py-[18px]">
        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1.5">
            {label}
        </div>
        <div
            className="font-display text-[1.75rem] font-bold"
            style={{ color }}
        >
            {value}
        </div>
    </div>
);

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function HealthMonitor() {
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [refreshing, setRefreshing]       = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 800));
        setLastRefreshed(new Date());
        setRefreshing(false);
    };

    const healthyCount  = SERVICES.filter(s => s.status === 'HEALTHY').length;
    const degradedCount = SERVICES.filter(s => s.status === 'DEGRADED').length;
    const downCount     = SERVICES.filter(s => s.status === 'DOWN').length;
    const overallStatus = downCount > 0 ? 'DOWN' : degradedCount > 0 ? 'DEGRADED' : 'HEALTHY';
    const activeIncidents = INCIDENTS.filter(i => i.status !== 'RESOLVED');

    const overall = STATUS_META[overallStatus];
    const OverallIcon = overall.Icon;

    return (
        <div className="max-w-[1100px]">

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        Health Monitor
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        Last refreshed {formatRelativeTime(lastRefreshed.toISOString())}
                    </p>
                </div>

                <button
                    onClick={refresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 py-[9px] px-[18px] rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-medium text-sm disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw
                        size={15}
                        className={refreshing ? 'animate-spin-fast' : ''}
                    />
                    Refresh
                </button>
            </div>

            {/* ── Overall status banner ─────────────────────────────────── */}
            <div className={`${overall.bannerBg} border rounded-xl px-5 py-4 mb-6 flex items-center gap-3`}>
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
                    <OverallIcon size={22} className={overall.textColor} />
                </div>
                <div>
                    <div className={`font-display font-bold text-base ${overall.textColor}`}>
                        {OVERALL_LABEL[overallStatus]}
                    </div>
                    <div className="text-[0.8125rem] text-[var(--text-secondary)] mt-0.5">
                        {healthyCount} healthy · {degradedCount} degraded · {downCount} down
                        {activeIncidents.length > 0 && ` · ${activeIncidents.length} active incident${activeIncidents.length > 1 ? 's' : ''}`}
                    </div>
                </div>
            </div>

            {/* ── Stats row ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-[14px] mb-6">
                <StatMini label="Healthy Services" value={healthyCount}          color="#10B981" bg="#ECFDF5" />
                <StatMini label="Degraded"         value={degradedCount}         color="#F59E0B" bg="#FFFBEB" />
                <StatMini label="Down"             value={downCount}             color="#EF4444" bg="#FEF2F2" />
                <StatMini label="Active Incidents" value={activeIncidents.length} color="#6366F1" bg="#EEF2FF" />
            </div>

            {/* ── Two-column layout ─────────────────────────────────────── */}
            <div className="grid grid-cols-[1fr_400px] gap-4 items-start">

                {/* Service list */}
                <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
                        <h3 className="font-display text-[0.9375rem] font-bold text-[var(--text-primary)] m-0">
                            Service Status
                        </h3>
                    </div>

                    {SERVICES.map((service, idx) => {
                        const meta = STATUS_META[service.status];
                        const ServiceIcon = service.icon;
                        const StatusIcon  = meta.Icon;
                        const highLatency = service.latency !== null && service.latency > 500;

                        return (
                            <div
                                key={service.id}
                                className={[
                                    'px-5 py-[14px] flex items-center gap-3.5 transition-colors hover:bg-slate-50',
                                    idx < SERVICES.length - 1 ? 'border-b border-[var(--border-default)]' : '',
                                ].join(' ')}
                            >
                                {/* Service icon */}
                                <div className={`w-[38px] h-[38px] rounded-[9px] ${meta.iconBg} flex items-center justify-center shrink-0`}>
                                    <ServiceIcon size={17} className={meta.textColor} />
                                </div>

                                {/* Name + region/uptime */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-[var(--text-primary)]">
                                        {service.name}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                        {service.region} · {service.uptime}% uptime
                                    </div>
                                </div>

                                {/* Latency */}
                                {service.latency !== null && (
                                    <div className="text-right">
                                        <div className={`font-mono text-sm font-semibold ${highLatency ? 'text-warning-700' : 'text-success-600'}`}>
                                            {service.latency}ms
                                        </div>
                                        <div className="text-[0.7rem] text-[var(--text-muted)]">latency</div>
                                    </div>
                                )}

                                {/* Status badge */}
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${meta.badgeCls}`}>
                                    <StatusIcon size={11} /> {meta.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Incidents */}
                <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50 flex justify-between items-center">
                        <h3 className="font-display text-[0.9375rem] font-bold text-[var(--text-primary)] m-0">
                            Incidents
                        </h3>
                        {activeIncidents.length > 0 && (
                            <span className="bg-danger-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                                {activeIncidents.length} active
                            </span>
                        )}
                    </div>

                    <div className="p-3 flex flex-col gap-2">
                        {INCIDENTS.map(inc => {
                            const statusBadge = INCIDENT_STATUS_BADGE[inc.status] ?? INCIDENT_STATUS_BADGE.INVESTIGATING;
                            const sevBadge    = SEVERITY_BADGE[inc.severity]      ?? SEVERITY_BADGE.MEDIUM;

                            return (
                                <div
                                    key={inc.id}
                                    className={[
                                        'px-4 py-3.5 rounded-[10px] border border-[var(--border-default)]',
                                        inc.status === 'RESOLVED' ? 'bg-slate-50' : 'bg-white',
                                    ].join(' ')}
                                >
                                    {/* Title + badges */}
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span className="font-bold text-sm text-[var(--text-primary)] flex-1 min-w-[100px]">
                                            {inc.title}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-bold ${statusBadge}`}>
                                            {inc.status}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-bold ${sevBadge}`}>
                                            {inc.severity}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    <p className="text-[0.8125rem] text-[var(--text-secondary)] m-0 mb-2 leading-relaxed">
                                        {inc.message}
                                    </p>

                                    {/* Timestamps */}
                                    <div className="text-xs text-[var(--text-muted)] flex gap-2.5 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} /> Started {formatRelativeTime(inc.started_at)}
                                        </span>
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