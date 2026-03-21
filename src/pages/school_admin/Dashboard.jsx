/**
 * SCHOOL ADMIN DASHBOARD
 * Converted from raw inline CSS → Tailwind CSS utility classes
 * Design system CSS variables (--color-brand-*, etc.) retained only where
 * no Tailwind equivalent exists (e.g. sidebar-specific variables).
 */

import { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import {
    GraduationCap, Cpu, AlertTriangle, ScanLine,
    TrendingUp, TrendingDown, Clock, CheckCircle, ArrowRight,
    CreditCard, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getSchoolDashboardApi } from '../../api/school.api.js';
import { formatRelativeTime, humanizeEnum, formatCompact } from '../../utils/formatters.js';
import { ROUTES } from '../../config/routes.config.js';

// ── Skeleton loader ────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
    <div className={`skeleton rounded-md ${className}`} />
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, colorClass, bgClass, trend, trendLabel, loading }) => (
    <div className="card animate-fadeIn p-6 flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                    {label}
                </p>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="font-display text-3xl font-bold text-slate-900 leading-none">
                        {value}
                    </div>
                )}
                {!loading && trendLabel && (
                    <div className="flex items-center gap-1 mt-2">
                        {trend === 'up' ? (
                            <TrendingUp size={13} className="text-emerald-600" />
                        ) : trend === 'down' ? (
                            <TrendingDown size={13} className="text-red-600" />
                        ) : null}
                        <span className={`text-xs font-medium ${
                            trend === 'up' ? 'text-emerald-600' :
                            trend === 'down' ? 'text-red-600' :
                            'text-slate-400'
                        }`}>
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
            <div className={`w-[46px] h-[46px] rounded-xl ${bgClass} flex items-center justify-center shrink-0 ml-4`}>
                <Icon size={22} className={colorClass} />
            </div>
        </div>
    </div>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
const BADGE_STYLES = {
    HIGH:    'bg-red-50 text-red-700',
    MEDIUM:  'bg-amber-50 text-amber-700',
    LOW:     'bg-sky-50 text-sky-700',
    PENDING: 'bg-amber-50 text-amber-700',
};

const Badge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${BADGE_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
        {humanizeEnum(status)}
    </span>
);

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, actionLabel, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-start justify-between mb-5">
            <div>
                <h3 className="font-display text-base font-semibold text-slate-900 m-0">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[0.8125rem] text-slate-400 mt-0.5">{subtitle}</p>
                )}
            </div>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 bg-transparent text-[0.8125rem] font-medium text-blue-700 cursor-pointer transition-all duration-100 hover:bg-blue-50 hover:border-blue-300"
                >
                    {actionLabel} <ArrowRight size={13} />
                </button>
            )}
        </div>
    );
};

// ── Custom Tooltip for chart ──────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5">
            <p className="text-white/60 text-xs mb-1.5">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex gap-2 items-center mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                    <span className="text-white text-[0.8125rem] font-semibold">
                        {entry.name}: {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

// ── Donut colors ──────────────────────────────────────────────────────────────
const TOKEN_DONUT_COLORS = {
    ACTIVE:     '#10B981',
    UNASSIGNED: '#94A3B8',
    ISSUED:     '#0EA5E9',
    EXPIRED:    '#F59E0B',
    REVOKED:    '#EF4444',
    INACTIVE:   '#CBD5E1',
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const SchoolAdminDashboard = () => {
    const { schoolId } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!schoolId) return;
            try {
                const res = await getSchoolDashboardApi(schoolId);
                setData(res.data);
            } catch {
                // Data remains null — components handle gracefully
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [schoolId]);

    const stats             = data?.stats            || {};
    const scanTrend         = data?.scanTrend         || [];
    const tokenBreakdown    = data?.tokenBreakdown    || [];
    const recentAnomalies   = data?.recentAnomalies   || [];
    const pendingRequests   = data?.pendingRequests   || [];
    const subscription      = data?.subscription;

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="max-w-[1400px]">

            {/* ── Page greeting ─────────────────────────────────────────────── */}
            <div className="mb-7">
                <h2 className="font-display text-[1.375rem] font-bold text-slate-900 mb-1">
                    Good morning 👋
                </h2>
                <p className="text-slate-400 text-sm">{today}</p>
            </div>

            {/* ── Subscription warning banner ────────────────────────────────── */}
            {subscription?.status === 'PAST_DUE' && (
                <div className="bg-amber-50 border border-amber-500 rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3">
                    <CreditCard size={18} className="text-amber-600" />
                    <div className="flex-1">
                        <span className="font-semibold text-amber-700 text-sm">
                            Subscription payment overdue.{' '}
                        </span>
                        <span className="text-amber-600 text-sm">
                            Please renew to avoid service interruption.
                        </span>
                    </div>
                </div>
            )}

            {/* ── KPI Stat Cards ─────────────────────────────────────────────── */}
            <div className="stagger-children grid grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Students"
                    value={formatCompact(stats.totalStudents ?? 0)}
                    icon={GraduationCap}
                    colorClass="text-blue-700"
                    bgClass="bg-blue-50"
                    trend="up"
                    trendLabel={stats.newStudentsThisMonth ? `+${stats.newStudentsThisMonth} this month` : null}
                    loading={loading}
                />
                <StatCard
                    label="Active Tokens"
                    value={formatCompact(stats.activeTokens ?? 0)}
                    icon={Cpu}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                    trendLabel={stats.totalTokens ? `${stats.totalTokens} total issued` : null}
                    loading={loading}
                />
                <StatCard
                    label="Expiring Soon"
                    value={formatCompact(stats.expiringTokens ?? 0)}
                    icon={Clock}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                    trendLabel="Within 30 days"
                    loading={loading}
                />
                <StatCard
                    label="Today's Scans"
                    value={formatCompact(stats.todayScans ?? 0)}
                    icon={ScanLine}
                    colorClass="text-sky-600"
                    bgClass="bg-sky-50"
                    trend={stats.scanTrendUp ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={loading}
                />
            </div>

            {/* ── Charts Row ─────────────────────────────────────────────────── */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 340px' }}>

                {/* Scan Activity Chart */}
                <div className="card p-6">
                    <SectionHeader
                        title="Scan Activity"
                        subtitle="Last 7 days — success vs failed scans"
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.SCAN_LOGS}
                    />
                    {loading ? (
                        <Skeleton className="h-[200px]" />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={scanTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone" dataKey="success" name="Success"
                                    stroke="#10B981" strokeWidth={2} fill="url(#successGrad)"
                                    dot={false} activeDot={{ r: 4, fill: '#10B981' }}
                                />
                                <Area
                                    type="monotone" dataKey="failed" name="Failed"
                                    stroke="#EF4444" strokeWidth={2} fill="url(#failGrad)"
                                    dot={false} activeDot={{ r: 4, fill: '#EF4444' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Token Donut */}
                <div className="card p-6">
                    <SectionHeader
                        title="Token Status"
                        actionLabel="Manage"
                        actionPath={ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY}
                    />
                    {loading ? (
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                    ) : tokenBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={tokenBreakdown}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={72}
                                        paddingAngle={2} dataKey="count" strokeWidth={0}
                                    >
                                        {tokenBreakdown.map((entry) => (
                                            <Cell key={entry.status} fill={TOKEN_DONUT_COLORS[entry.status] || '#94A3B8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, humanizeEnum(name)]}
                                        contentStyle={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.8125rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-1.5 mt-1">
                                {tokenBreakdown.map((entry) => (
                                    <div key={entry.status} className="flex items-center justify-between text-[0.8125rem]">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: TOKEN_DONUT_COLORS[entry.status] || '#94A3B8' }}
                                            />
                                            <span className="text-slate-600">{humanizeEnum(entry.status)}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">{entry.count}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-slate-400 py-10 text-sm">
                            No token data available
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom Row ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">

                {/* Recent Anomalies */}
                <div className="card p-6">
                    <SectionHeader
                        title="Recent Anomalies"
                        subtitle={recentAnomalies.length > 0 ? `${recentAnomalies.length} flagged scans` : 'No active anomalies'}
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.ANOMALIES}
                    />
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-[52px]" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-slate-400">
                            <CheckCircle size={32} className="text-emerald-500 mb-2.5" />
                            <span className="text-sm font-medium">No anomalies detected</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-px">
                            {recentAnomalies.slice(0, 5).map((anomaly) => (
                                <div
                                    key={anomaly.id}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 hover:bg-slate-50"
                                >
                                    <div className="w-[34px] h-[34px] rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle size={15} className="text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 truncate">
                                            {humanizeEnum(anomaly.type)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {anomaly.student_name} · {formatRelativeTime(anomaly.created_at)}
                                        </div>
                                    </div>
                                    <Badge status={anomaly.severity || 'HIGH'} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Parent Requests */}
                <div className="card p-6">
                    <SectionHeader
                        title="Parent Requests"
                        subtitle={pendingRequests.length > 0 ? `${pendingRequests.length} awaiting review` : 'All caught up'}
                        actionLabel="Review all"
                        actionPath={ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS}
                    />
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-[52px]" />)}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-slate-400">
                            <CheckCircle size={32} className="text-emerald-500 mb-2.5" />
                            <span className="text-sm font-medium">No pending requests</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-px">
                            {pendingRequests.slice(0, 5).map((req) => (
                                <div
                                    key={req.id}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 hover:bg-slate-50"
                                >
                                    <div className="w-[34px] h-[34px] rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <Users size={15} className="text-blue-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 truncate">
                                            {req.student_name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {req.parent_name} · {formatRelativeTime(req.created_at)}
                                        </div>
                                    </div>
                                    <Badge status="PENDING" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolAdminDashboard;