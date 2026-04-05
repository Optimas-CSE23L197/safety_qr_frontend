/**
 * SUPER ADMIN — HEALTH MONITOR
 * Real-time service status, uptime, response times, error rates.
 */

import { useState } from 'react';
import {
    Activity, CheckCircle, AlertTriangle, XCircle,
    RefreshCw, Server, Database, Wifi, Cloud, Clock,
    TrendingUp, TrendingDown, Zap, Shield, Bell, Eye,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters.js';

const SERVICES = [
    { id: 'api', name: 'API Server', icon: Server, status: 'HEALTHY', uptime: 99.97, latency: 142, region: 'Mumbai', trend: 'stable' },
    { id: 'db', name: 'Database (Postgres)', icon: Database, status: 'HEALTHY', uptime: 99.99, latency: 8, region: 'Mumbai', trend: 'up' },
    { id: 'qr', name: 'QR Scan Service', icon: Wifi, status: 'HEALTHY', uptime: 99.95, latency: 98, region: 'Global CDN', trend: 'stable' },
    { id: 'notif', name: 'Notification Service', icon: Cloud, status: 'DEGRADED', uptime: 98.12, latency: 520, region: 'Mumbai', trend: 'down' },
    { id: 'sms', name: 'SMS Gateway', icon: Cloud, status: 'DEGRADED', uptime: 97.45, latency: 1240, region: 'Third-party', trend: 'down' },
    { id: 'storage', name: 'File Storage (S3)', icon: Server, status: 'HEALTHY', uptime: 99.99, latency: 32, region: 'Mumbai', trend: 'stable' },
    { id: 'cache', name: 'Redis Cache', icon: Database, status: 'HEALTHY', uptime: 99.98, latency: 2, region: 'Mumbai', trend: 'stable' },
    { id: 'email', name: 'Email Service', icon: Cloud, status: 'DOWN', uptime: 93.20, latency: null, region: 'Third-party', trend: 'down' },
];

const INCIDENTS = [
    { id: 'inc1', title: 'SMS Gateway degraded performance', status: 'INVESTIGATING', severity: 'MEDIUM', started_at: new Date(Date.now() - 3600000 * 2).toISOString(), updated_at: new Date(Date.now() - 1800000).toISOString(), message: 'Elevated latency observed on outbound SMS delivery. Vendor notified.' },
    { id: 'inc2', title: 'Email service outage', status: 'IDENTIFIED', severity: 'HIGH', started_at: new Date(Date.now() - 3600000 * 4).toISOString(), updated_at: new Date(Date.now() - 3600000).toISOString(), message: 'Email service provider experiencing an outage. Escalated to vendor support.' },
    { id: 'inc3', title: 'Scheduled DB maintenance', status: 'RESOLVED', severity: 'LOW', started_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString(), message: 'Maintenance completed successfully. All systems operational.' },
];

const STATUS_META = {
    HEALTHY: { label: 'Operational', textColor: 'text-emerald-600', badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-50', borderColor: 'border-emerald-200', Icon: CheckCircle },
    DEGRADED: { label: 'Degraded', textColor: 'text-amber-600', badgeCls: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'bg-amber-50', borderColor: 'border-amber-200', Icon: AlertTriangle },
    DOWN: { label: 'Outage', textColor: 'text-rose-600', badgeCls: 'bg-rose-50 text-rose-700 border-rose-200', iconBg: 'bg-rose-50', borderColor: 'border-rose-200', Icon: XCircle },
};

const INCIDENT_STATUS_BADGE = {
    INVESTIGATING: 'bg-rose-50 text-rose-700 border-rose-200',
    IDENTIFIED: 'bg-amber-50 text-amber-700 border-amber-200',
    MONITORING: 'bg-sky-50 text-sky-700 border-sky-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const SEVERITY_BADGE = {
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-sky-50 text-sky-700 border-sky-200',
};

const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-emerald-500" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-rose-500" />;
    return <Activity size={12} className="text-slate-400" />;
};

export default function HealthMonitor() {
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

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

    const overall = STATUS_META[overallStatus];
    const OverallIcon = overall.Icon;

    const uptimePercentage = (SERVICES.reduce((acc, s) => acc + s.uptime, 0) / SERVICES.length).toFixed(2);
    const avgLatency = Math.floor(SERVICES.filter(s => s.latency).reduce((acc, s) => acc + s.latency, 0) / SERVICES.filter(s => s.latency).length);

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
            <div className="max-w-[1400px] mx-auto">

                {/* Header with gradient accent */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                    <Activity size={16} className="text-white" />
                                </div>
                                <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                    System Health Monitor
                                </h2>
                            </div>
                            <p className="text-[var(--text-muted)] text-sm">
                                Real-time service status, uptime, and incident tracking
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs text-[var(--text-muted)]">Last updated</div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">{formatRelativeTime(lastRefreshed.toISOString())}</div>
                            </div>
                            <button
                                onClick={refresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 py-2 px-4 rounded-xl border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-medium text-sm disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overall Status Card - Premium */}
                <div className={`relative overflow-hidden rounded-2xl border ${overall.borderColor} bg-white shadow-lg mb-8`}>
                    <div className={`absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full ${overall.iconBg} opacity-20`} />
                    <div className="relative p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl ${overall.iconBg} flex items-center justify-center`}>
                                <OverallIcon size={32} className={overall.textColor} />
                            </div>
                            <div className="flex-1">
                                <div className={`text-2xl font-bold ${overall.textColor}`}>
                                    {overallStatus === 'HEALTHY' ? 'All Systems Operational' : overallStatus === 'DEGRADED' ? 'Partial System Degradation' : 'Service Disruption Detected'}
                                </div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">
                                    {healthyCount} operational · {degradedCount} degraded · {downCount} outage
                                    {activeIncidents.length > 0 && ` · ${activeIncidents.length} active incident${activeIncidents.length > 1 ? 's' : ''}`}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-[var(--text-primary)]">{uptimePercentage}%</div>
                                <div className="text-xs text-[var(--text-muted)]">30d uptime</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Modern */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle size={18} className="text-emerald-600" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">{healthyCount}</span>
                        </div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Healthy Services</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">All systems normal</div>
                    </div>

                    <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <AlertTriangle size={18} className="text-amber-600" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">{degradedCount}</span>
                        </div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Degraded Services</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">Performance impacted</div>
                    </div>

                    <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                <XCircle size={18} className="text-rose-600" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">{downCount}</span>
                        </div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Service Outages</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">Critical issues</div>
                    </div>

                    <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Zap size={18} className="text-slate-600" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">{avgLatency}ms</span>
                        </div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Avg Response</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">Across all services</div>
                    </div>
                </div>

                {/* Main Content - Two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Services List - Takes 2/3 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-[var(--border-default)] bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[var(--text-primary)]">Service Status Dashboard</h3>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Real-time metrics and performance</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className="text-[var(--text-muted)]" />
                                        <span className="text-xs text-[var(--text-muted)]">Auto-refresh: 30s</span>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-[var(--border-default)]">
                                {SERVICES.map((service) => {
                                    const meta = STATUS_META[service.status];
                                    const ServiceIcon = service.icon;
                                    const StatusIcon = meta.Icon;
                                    const highLatency = service.latency !== null && service.latency > 500;

                                    return (
                                        <div
                                            key={service.id}
                                            className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Service Icon */}
                                                <div className={`w-12 h-12 rounded-xl ${meta.iconBg} flex items-center justify-center`}>
                                                    <ServiceIcon size={20} className={meta.textColor} />
                                                </div>

                                                {/* Service Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-[var(--text-primary)]">{service.name}</span>
                                                        <TrendIcon trend={service.trend} />
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-[var(--text-muted)]">{service.region}</span>
                                                        <span className="text-xs text-[var(--text-muted)]">•</span>
                                                        <span className="text-xs font-mono text-[var(--text-muted)]">{service.uptime}% uptime</span>
                                                    </div>
                                                </div>

                                                {/* Latency */}
                                                {service.latency !== null && (
                                                    <div className="text-right">
                                                        <div className={`font-mono text-lg font-bold ${highLatency ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                            {service.latency}ms
                                                        </div>
                                                        <div className="text-[0.7rem] text-[var(--text-muted)]">latency</div>
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.badgeCls}`}>
                                                    <StatusIcon size={10} />
                                                    {meta.label}
                                                </span>
                                            </div>

                                            {/* Expanded Details */}
                                            {selectedService === service.id && (
                                                <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <div className="text-xs text-[var(--text-muted)]">Endpoint</div>
                                                            <div className="text-sm font-mono mt-0.5">/{service.id}/v1</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[var(--text-muted)]">Error Rate</div>
                                                            <div className="text-sm font-semibold text-emerald-600 mt-0.5">0.02%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[var(--text-muted)]">Last Incident</div>
                                                            <div className="text-sm mt-0.5">2 days ago</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Incidents Timeline - Takes 1/3 */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden shadow-sm sticky top-6">
                            <div className="px-5 py-4 border-b border-[var(--border-default)] bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[var(--text-primary)]">Incident Timeline</h3>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Recent events & updates</p>
                                    </div>
                                    {activeIncidents.length > 0 && (
                                        <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-pulse">
                                            {activeIncidents.length} active
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto">
                                {INCIDENTS.map((inc, idx) => {
                                    const statusBadge = INCIDENT_STATUS_BADGE[inc.status];
                                    const sevBadge = SEVERITY_BADGE[inc.severity];

                                    return (
                                        <div
                                            key={inc.id}
                                            className={[
                                                'px-5 py-4 border-b border-[var(--border-default)] transition-colors',
                                                inc.status !== 'RESOLVED' ? 'bg-rose-50/30' : 'hover:bg-slate-50',
                                            ].join(' ')}
                                        >
                                            {/* Status Indicator Line */}
                                            <div className="flex items-start gap-3">
                                                <div className="relative">
                                                    <div className={`w-2 h-2 mt-2 rounded-full ${inc.status === 'RESOLVED' ? 'bg-emerald-500' : inc.status === 'IDENTIFIED' ? 'bg-amber-500' : 'bg-rose-500'} ${inc.status !== 'RESOLVED' ? 'animate-pulse' : ''}`} />
                                                    {idx < INCIDENTS.length - 1 && (
                                                        <div className="absolute top-4 left-0.5 w-px h-12 bg-[var(--border-default)]" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                                        <span className="font-semibold text-sm text-[var(--text-primary)]">{inc.title}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold border ${sevBadge}`}>
                                                            {inc.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[0.75rem] text-[var(--text-secondary)] mb-2 leading-relaxed">
                                                        {inc.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-[0.65rem] text-[var(--text-muted)]">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} /> {formatRelativeTime(inc.started_at)}
                                                        </span>
                                                        <span>•</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-medium border ${statusBadge}`}>
                                                            {inc.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* View All Link */}
                            <div className="px-5 py-3 border-t border-[var(--border-default)] bg-slate-50">
                                <button className="w-full text-center text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center justify-center gap-1">
                                    <Eye size={14} /> View Full Incident History
                                </button>
                            </div>
                        </div>

                        {/* Uptime Commitment Card */}
                        <div className="mt-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={16} className="text-emerald-400" />
                                <span className="text-sm font-semibold">SLA Commitment</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">99.9%</div>
                            <div className="text-xs text-slate-300">Uptime guarantee for core services</div>
                            <div className="mt-3 pt-3 border-t border-slate-700">
                                <div className="flex justify-between text-xs">
                                    <span>Current uptime</span>
                                    <span className="font-mono text-emerald-400">{uptimePercentage}%</span>
                                </div>
                                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(parseFloat(uptimePercentage) / 100) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}