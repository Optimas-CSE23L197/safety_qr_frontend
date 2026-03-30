/**
<<<<<<< HEAD
 * SCHOOL ADMIN DASHBOARD
 * Converted from raw inline CSS → Tailwind CSS utility classes
 * Design system CSS variables (--color-brand-*, etc.) retained only where
 * no Tailwind equivalent exists (e.g. sidebar-specific variables).
=======
 * SCHOOL ADMIN DASHBOARD — RESQID
 * Real API integration via useDashboard (TanStack Query)
 * No mock data. No manual fetch/useState/useEffect for server state.
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
 */

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import {
    GraduationCap, Cpu, AlertTriangle, ScanLine,
    TrendingUp, TrendingDown, Clock, CheckCircle, ArrowRight,
<<<<<<< HEAD
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
=======
    CreditCard, Users, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useDashboard } from '../../hooks/useDashboard.js';
import { formatRelativeTime, humanizeEnum, formatCompact } from '../../utils/formatters.js';
import { ROUTES } from '../../config/routes.config.js';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ w = '100%', h = '16px', radius = '6px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, trend, trendLabel, loading }) => (
    <div className="card animate-fadeIn" style={{ padding: '24px', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px',
                }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                    {label}
                </p>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
<<<<<<< HEAD
                    <div className="font-display text-3xl font-bold text-slate-900 leading-none">
=======
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.875rem',
                        fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1,
                    }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                        {value}
                    </div>
                )}
                {!loading && trendLabel && (
<<<<<<< HEAD
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
=======
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                        {trend === 'up' && <TrendingUp size={13} color="var(--color-success-600)" />}
                        {trend === 'down' && <TrendingDown size={13} color="var(--color-danger-600)" />}
                        <span style={{
                            fontSize: '0.75rem', fontWeight: 500,
                            color: trend === 'up' ? 'var(--color-success-600)'
                                : trend === 'down' ? 'var(--color-danger-600)'
                                    : 'var(--text-muted)',
                        }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
<<<<<<< HEAD
            <div className={`w-[46px] h-[46px] rounded-xl ${bgClass} flex items-center justify-center shrink-0 ml-4`}>
                <Icon size={22} className={colorClass} />
=======
            <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: `${color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, marginLeft: '16px',
            }}>
                <Icon size={22} color={color} />
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
            </div>
        </div>
    </div>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
<<<<<<< HEAD
const BADGE_STYLES = {
    HIGH:    'bg-red-50 text-red-700',
    MEDIUM:  'bg-amber-50 text-amber-700',
    LOW:     'bg-sky-50 text-sky-700',
    PENDING: 'bg-amber-50 text-amber-700',
=======
const Badge = ({ status, colorMap }) => {
    const colors = colorMap?.[status] || { bg: '#F1F5F9', text: '#475569' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
            borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
            background: colors.bg, color: colors.text, whiteSpace: 'nowrap',
        }}>
            {humanizeEnum(status)}
        </span>
    );
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
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
<<<<<<< HEAD
        <div className="flex items-start justify-between mb-5">
            <div>
                <h3 className="font-display text-base font-semibold text-slate-900 m-0">
=======
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    fontWeight: 600, color: 'var(--text-primary)', margin: 0,
                }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[0.8125rem] text-slate-400 mt-0.5">{subtitle}</p>
                )}
            </div>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
<<<<<<< HEAD
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 bg-transparent text-[0.8125rem] font-medium text-blue-700 cursor-pointer transition-all duration-100 hover:bg-blue-50 hover:border-blue-300"
=======
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', borderRadius: '6px',
                        border: '1px solid var(--border-default)', background: 'transparent',
                        fontSize: '0.8125rem', fontWeight: 500,
                        color: 'var(--color-brand-600)', cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-brand-50)';
                        e.currentTarget.style.borderColor = 'var(--color-brand-300)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                >
                    {actionLabel} <ArrowRight size={13} />
                </button>
            )}
        </div>
    );
};

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
<<<<<<< HEAD
        <div className="bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5">
            <p className="text-white/60 text-xs mb-1.5">{label}</p>
=======
        <div style={{
            background: 'var(--color-slate-900)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '10px 14px',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '6px' }}>{label}</p>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
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

<<<<<<< HEAD
// ── Donut colors ──────────────────────────────────────────────────────────────
=======
// ── Token donut colors ────────────────────────────────────────────────────────
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
const TOKEN_DONUT_COLORS = {
    ACTIVE:     '#10B981',
    UNASSIGNED: '#94A3B8',
    ISSUED:     '#0EA5E9',
    EXPIRED:    '#F59E0B',
    REVOKED:    '#EF4444',
    INACTIVE:   '#CBD5E1',
};

// ── Severity color map ─────────────────────────────────────────────────────────
const SEVERITY_COLORS = {
    HIGH: { bg: 'var(--color-danger-50)', text: 'var(--color-danger-700)' },
    MEDIUM: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)' },
    LOW: { bg: 'var(--color-info-50)', text: 'var(--color-info-700)' },
    CRITICAL: { bg: '#FDF2F8', text: '#9D174D' },
};

// ── Error Banner ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ onRetry }) => (
    <div style={{
        background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-200)',
        borderRadius: '10px', padding: '14px 20px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="var(--color-danger-600)" />
            <span style={{ fontWeight: 500, color: 'var(--color-danger-700)', fontSize: '0.875rem' }}>
                Failed to load dashboard data.
            </span>
        </div>
        <button
            onClick={onRetry}
            style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '6px',
                border: '1px solid var(--color-danger-300)',
                background: 'white', color: 'var(--color-danger-600)',
                fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            }}
        >
            <RefreshCw size={13} /> Retry
        </button>
    </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const SchoolAdminDashboard = () => {
    console.log("Dashboard mounted");
    const { schoolId } = useAuth();
<<<<<<< HEAD
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
=======
    const navigate = useNavigate();
    console.log("schoolId:", schoolId);

    // ── TanStack Query — single hook replaces useState + useEffect + try/catch
    const { data, isLoading, isError, refetch } = useDashboard(schoolId);

    // ── Safe destructure with defaults — no optional chaining chains everywhere
    const stats = data?.stats ?? {};
    const scanTrend = data?.scanTrend ?? [];
    const tokenBreakdown = data?.tokenBreakdown ?? [];
    const recentAnomalies = data?.recentAnomalies ?? [];
    const pendingRequests = data?.pendingRequests ?? [];
    const subscription = data?.subscription ?? null;
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="max-w-[1400px]">

            {/* ── Page greeting ─────────────────────────────────────────────── */}
<<<<<<< HEAD
            <div className="mb-7">
                <h2 className="font-display text-[1.375rem] font-bold text-slate-900 mb-1">
=======
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.375rem',
                    fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px',
                }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                    Good morning 👋
                </h2>
                <p className="text-slate-400 text-sm">{today}</p>
            </div>

<<<<<<< HEAD
            {/* ── Subscription warning banner ────────────────────────────────── */}
            {subscription?.status === 'PAST_DUE' && (
                <div className="bg-amber-50 border border-amber-500 rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3">
                    <CreditCard size={18} className="text-amber-600" />
                    <div className="flex-1">
                        <span className="font-semibold text-amber-700 text-sm">
=======
            {/* ── Error banner — shown only on fetch failure ─────────────────── */}
            {isError && <ErrorBanner onRetry={refetch} />}

            {/* ── Subscription warning ───────────────────────────────────────── */}
            {subscription?.status === 'PAST_DUE' && (
                <div style={{
                    background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-500)',
                    borderRadius: '10px', padding: '14px 20px', marginBottom: '24px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <CreditCard size={18} color="var(--color-warning-600)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-warning-700)', fontSize: '0.875rem' }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                            Subscription payment overdue.{' '}
                        </span>
                        <span className="text-amber-600 text-sm">
                            Please renew to avoid service interruption.
                        </span>
                    </div>
                </div>
            )}

            {/* ── KPI Stat Cards ─────────────────────────────────────────────── */}
<<<<<<< HEAD
            <div className="stagger-children grid grid-cols-4 gap-4 mb-6">
=======
            <div className="stagger-children" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px', marginBottom: '24px',
            }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                <StatCard
                    label="Total Students"
                    value={formatCompact(stats.totalStudents ?? 0)}
                    icon={GraduationCap}
                    colorClass="text-blue-700"
                    bgClass="bg-blue-50"
                    trend="up"
                    trendLabel={stats.newStudentsThisMonth ? `+${stats.newStudentsThisMonth} this month` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Active Tokens"
                    value={formatCompact(stats.activeTokens ?? 0)}
                    icon={Cpu}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                    trendLabel={stats.totalTokens ? `${stats.totalTokens} total issued` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Expiring Soon"
                    value={formatCompact(stats.expiringTokens ?? 0)}
                    icon={Clock}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                    trendLabel="Within 30 days"
                    loading={isLoading}
                />
                <StatCard
                    label="Today's Scans"
                    value={formatCompact(stats.todayScans ?? 0)}
                    icon={ScanLine}
<<<<<<< HEAD
                    colorClass="text-sky-600"
                    bgClass="bg-sky-50"
                    trend={stats.scanTrendUp ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={loading}
=======
                    color="var(--color-info-600)"
                    trend={stats.scanTrendUp === true ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent != null ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={isLoading}
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                />
            </div>

            {/* ── Charts Row ─────────────────────────────────────────────────── */}
<<<<<<< HEAD
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 340px' }}>
=======
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 340px',
                gap: '16px', marginBottom: '24px',
            }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3

                {/* Scan Activity Chart */}
                <div className="card p-6">
                    <SectionHeader
                        title="Scan Activity"
                        subtitle="Last 7 days — success vs failed scans"
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.SCAN_LOGS}
                    />
<<<<<<< HEAD
                    {loading ? (
                        <Skeleton className="h-[200px]" />
=======
                    {isLoading ? (
                        <Skeleton h="200px" />
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
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
<<<<<<< HEAD
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                                    axisLine={false}
                                    tickLine={false}
=======
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                                    axisLine={false} tickLine={false}
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
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
<<<<<<< HEAD
                    {loading ? (
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
=======
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                            <Skeleton h="160px" w="160px" radius="50%" />
                        </div>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                    ) : tokenBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
<<<<<<< HEAD
                                        data={tokenBreakdown}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={72}
                                        paddingAngle={2} dataKey="count" strokeWidth={0}
=======
                                        data={tokenBreakdown} cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={72}
                                        paddingAngle={2} dataKey="count" nameKey="status" strokeWidth={0}
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                                    >
                                        {tokenBreakdown.map((entry) => (
                                            <Cell
                                                key={entry.status}
                                                fill={TOKEN_DONUT_COLORS[entry.status] || '#94A3B8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, typeof name === 'string' ? humanizeEnum(name) : name]}
                                        contentStyle={{
<<<<<<< HEAD
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.8125rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
=======
                                            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                                            borderRadius: '8px', border: '1px solid var(--border-default)',
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-1.5 mt-1">
                                {tokenBreakdown.map((entry) => (
<<<<<<< HEAD
                                    <div key={entry.status} className="flex items-center justify-between text-[0.8125rem]">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: TOKEN_DONUT_COLORS[entry.status] || '#94A3B8' }}
                                            />
                                            <span className="text-slate-600">{humanizeEnum(entry.status)}</span>
=======
                                    <div key={entry.status} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', fontSize: '0.8125rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                                background: TOKEN_DONUT_COLORS[entry.status] || '#94A3B8',
                                            }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                {humanizeEnum(entry.status)}
                                            </span>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                                        </div>
                                        <span className="font-semibold text-slate-900">{entry.count}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
<<<<<<< HEAD
                        <div className="text-center text-slate-400 py-10 text-sm">
=======
                        <div style={{
                            textAlign: 'center', color: 'var(--text-muted)',
                            padding: '40px 0', fontSize: '0.875rem',
                        }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                            No token data available
                        </div>
                    )}
                </div>
            </div>

<<<<<<< HEAD
            {/* ── Bottom Row ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
=======
            {/* ── Bottom Row: Anomalies + Parent Requests ────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3

                {/* Recent Anomalies */}
                <div className="card p-6">
                    <SectionHeader
                        title="Recent Anomalies"
                        subtitle={
                            isLoading ? null
                                : recentAnomalies.length > 0
                                    ? `${recentAnomalies.length} flagged scans`
                                    : 'No active anomalies'
                        }
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.ANOMALIES}
                    />
<<<<<<< HEAD
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-[52px]" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-slate-400">
                            <CheckCircle size={32} className="text-emerald-500 mb-2.5" />
                            <span className="text-sm font-medium">No anomalies detected</span>
=======
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '32px 0', color: 'var(--text-muted)',
                        }}>
                            <CheckCircle size={32} color="var(--color-success-500)" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No anomalies detected</span>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                        </div>
                    ) : (
                        <div className="flex flex-col gap-px">
                            {recentAnomalies.slice(0, 5).map((anomaly) => (
                                <div
                                    key={anomaly.id}
<<<<<<< HEAD
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 hover:bg-slate-50"
                                >
                                    <div className="w-[34px] h-[34px] rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle size={15} className="text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 truncate">
=======
                                    onClick={() => navigate(ROUTES.SCHOOL_ADMIN.ANOMALIES)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '8px',
                                        cursor: 'pointer', transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '8px',
                                        background: 'var(--color-danger-50)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <AlertTriangle size={15} color="var(--color-danger-600)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: 'var(--text-primary)', whiteSpace: 'nowrap',
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                                            {humanizeEnum(anomaly.type)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {anomaly.student_name} · {formatRelativeTime(anomaly.created_at)}
                                        </div>
                                    </div>
<<<<<<< HEAD
                                    <Badge status={anomaly.severity || 'HIGH'} />
=======
                                    <Badge
                                        status={anomaly.severity ?? 'HIGH'}
                                        colorMap={SEVERITY_COLORS}
                                    />
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Parent Requests */}
                <div className="card p-6">
                    <SectionHeader
                        title="Parent Requests"
<<<<<<< HEAD
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
=======
                        subtitle={
                            isLoading ? null
                                : pendingRequests.length > 0
                                    ? `${pendingRequests.length} awaiting review`
                                    : 'All caught up'
                        }
                        actionLabel="Review all"
                        actionPath={ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS}
                    />
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '32px 0', color: 'var(--text-muted)',
                        }}>
                            <CheckCircle size={32} color="var(--color-success-500)" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No pending requests</span>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                        </div>
                    ) : (
                        <div className="flex flex-col gap-px">
                            {pendingRequests.slice(0, 5).map((req) => (
                                <div
                                    key={req.id}
<<<<<<< HEAD
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
=======
                                    onClick={() => navigate(ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '8px',
                                        cursor: 'pointer', transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '8px',
                                        background: 'var(--color-brand-50)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <Users size={15} color="var(--color-brand-600)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: 'var(--text-primary)', whiteSpace: 'nowrap',
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {req.student_name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {req.parent_name} · {humanizeEnum(req.type)} · {formatRelativeTime(req.created_at)}
                                        </div>
                                    </div>
                                    <Badge
                                        status="PENDING"
                                        colorMap={{ PENDING: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)' } }}
                                    />
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
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