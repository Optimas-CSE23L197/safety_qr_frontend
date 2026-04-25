// src/pages/school_admin/Dashboard.jsx
/**
 * SCHOOL ADMIN DASHBOARD — RESQID
 * Plan-aware: Basic vs Premium with PremiumGate, PlanCard,
 * chart period toggle, and locked stat placeholders.
 */

import { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
    GraduationCap, Cpu, AlertTriangle, ScanLine,
    TrendingUp, TrendingDown, Clock, CheckCircle,
    ArrowRight, CreditCard, Users, RefreshCw,
    Lock, Timer, Fingerprint, Download, Sparkles,
    QrCode,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';
import { useDashboard } from '../../hooks/useDashboard.js';
import useDashboardStore from '../../store/dashboardStore.js';
import { formatRelativeTime, humanizeEnum, formatCompact } from '../../utils/formatters.js';
import { ROUTES } from '../../config/routes.config.js';
import PremiumGate from '../../components/shared/PremiumGate.jsx';
import PlanCard from '../../components/dashboard/PlanCard.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Local sub-components (unchanged from original unless noted)
// ─────────────────────────────────────────────────────────────────────────────

const Skeleton = ({ w = '100%', h = '16px', radius = '6px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

// ── Plan badge (new) ──────────────────────────────────────────────────────────
const PlanBadge = ({ isPremium }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 10px', borderRadius: '9999px',
        fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: isPremium
            ? 'linear-gradient(135deg, #F59E0B, #D97706)'
            : 'var(--color-slate-200)',
        color: isPremium ? 'white' : 'var(--color-slate-500)',
        verticalAlign: 'middle',
    }}>
        {isPremium && <Sparkles size={9} />}
        {isPremium ? 'Premium' : 'Basic'}
    </span>
);

// ── Stat card — extended to support a "locked" state (new prop) ───────────────
const StatCard = ({
    label, value, icon: Icon, color,
    trend, trendLabel, loading,
    locked = false,             // <── new
}) => (
    <div className="card animate-fadeIn" style={{
        padding: '24px', flex: 1, minWidth: 0,
        opacity: locked ? 0.6 : 1,
        position: 'relative', overflow: 'hidden',
    }}>
        {/* Lock ribbon for basic users */}
        {locked && (
            <div style={{
                position: 'absolute', top: '10px', right: '10px',
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'var(--color-slate-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Lock size={13} color="var(--color-slate-400)" />
            </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px',
                }}>
                    {label}
                </p>
                {loading ? (
                    <Skeleton h="32px" w="80px" />
                ) : locked ? (
                    /* Premium-only placeholder */
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.875rem',
                        fontWeight: 700, color: 'var(--color-slate-300)', lineHeight: 1,
                        letterSpacing: '0.1em',
                    }}>
                        ——
                    </div>
                ) : (
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.875rem',
                        fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1,
                    }}>
                        {value}
                    </div>
                )}
                {!loading && !locked && trendLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                        {trend === 'up' && <TrendingUp size={13} color="var(--color-success-600)" />}
                        {trend === 'down' && <TrendingDown size={13} color="var(--color-danger-600)" />}
                        <span style={{
                            fontSize: '0.75rem', fontWeight: 500,
                            color: trend === 'up' ? 'var(--color-success-600)'
                                : trend === 'down' ? 'var(--color-danger-600)'
                                    : 'var(--text-muted)',
                        }}>
                            {trendLabel}
                        </span>
                    </div>
                )}
                {locked && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-600)', marginTop: '8px', fontWeight: 500 }}>
                        Premium only
                    </p>
                )}
            </div>
            <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: locked ? 'var(--color-slate-100)' : `${color}15`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, marginLeft: '16px',
            }}>
                <Icon size={22} color={locked ? 'var(--color-slate-300)' : color} />
            </div>
        </div>
    </div>
);

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
};

const SectionHeader = ({ title, subtitle, actionLabel, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: '20px',
        }}>
            <div>
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    fontWeight: 600, color: 'var(--text-primary)', margin: 0,
                }}>
                    {title}
                </h3>
                {subtitle && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
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
                >
                    {actionLabel} <ArrowRight size={13} />
                </button>
            )}
        </div>
    );
};

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--color-slate-900)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '10px 14px',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '6px' }}>{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} style={{
                    display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px',
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                    <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {entry.name}: {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const TOKEN_DONUT_COLORS = {
    ACTIVE: '#10B981', UNASSIGNED: '#94A3B8',
    ISSUED: '#0EA5E9', EXPIRED: '#F59E0B',
    REVOKED: '#EF4444', INACTIVE: '#CBD5E1',
};

const SEVERITY_COLORS = {
    HIGH: { bg: 'var(--color-danger-50)', text: 'var(--color-danger-700)' },
    MEDIUM: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)' },
    LOW: { bg: 'var(--color-info-50)', text: 'var(--color-info-700)' },
    CRITICAL: { bg: '#FDF2F8', text: '#9D174D' },
};

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

// ── Period toggle button (new, for chart) ─────────────────────────────────────
const PeriodBtn = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '4px 12px', borderRadius: '6px', border: 'none',
            fontSize: '0.8125rem', fontWeight: active ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.15s ease',
            background: active ? 'var(--color-brand-600)' : 'transparent',
            color: active ? 'white' : 'var(--text-muted)',
        }}
    >
        {label}
    </button>
);

// ── Actionable empty state (new) ──────────────────────────────────────────────
const ActionableEmpty = ({ icon: Icon, message, actionLabel, actionPath, iconColor = 'var(--color-brand-500)' }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '32px 20px',
            textAlign: 'center', gap: '10px',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${iconColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={22} color={iconColor} />
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', margin: 0 }}>
                {message}
            </p>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '6px 14px', borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                        background: 'transparent', color: 'var(--color-brand-600)',
                        fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                    }}
                >
                    {actionLabel} <ArrowRight size={12} />
                </button>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const SchoolAdminDashboard = () => {
    const { schoolId } = useAuth();
    const navigate = useNavigate();

    // ── Chart period: local UI state ──────────────────────────────────
    const [chartPeriod, setChartPeriod] = useState(7);

    // ── Plan from Zustand (hydrated by useDashboard) ──────────────────
    const { plan, isPremium, subscriptionEnd, featureUsage } = useDashboardStore();

    // ── Server state ──────────────────────────────────────────────────
    const { data, isLoading, isError, refetch } = useDashboard(schoolId, chartPeriod);

    const stats = data?.stats ?? {};
    const scanTrend = data?.scanTrend ?? [];
    const tokenBreakdown = data?.tokenBreakdown ?? [];
    const recentAnomalies = data?.recentAnomalies ?? [];
    const pendingRequests = data?.pendingRequests ?? [];
    const subscription = data?.subscription ?? null;

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // ── CSV export handler (premium) ──────────────────────────────────
    const handleExportCSV = () => {
        if (!scanTrend.length) return;
        const header = 'Date,Success,Failed';
        const rows = scanTrend.map((r) => `${r.date},${r.success},${r.failed}`);
        const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scan-activity-${chartPeriod}d.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: '1400px' }}>

            {/* ── Top bar: greeting + plan badge + upgrade CTA ──────────── */}
            <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)', fontSize: '1.375rem',
                            fontWeight: 700, color: 'var(--text-primary)', margin: 0,
                        }}>
                            Good morning 👋
                        </h2>
                        {/* Plan badge — always visible */}
                        <PlanBadge isPremium={isPremium} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        {today}
                    </p>
                </div>

                {/* Upgrade CTA in top bar — only for basic */}
                {!isPremium && (
                    <button
                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: 'white', fontWeight: 600, fontSize: '0.875rem',
                            cursor: 'pointer', flexShrink: 0,
                            boxShadow: '0 2px 10px rgba(217,119,6,0.35)',
                            transition: 'transform 0.1s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Sparkles size={14} />
                        Upgrade Plan
                    </button>
                )}
            </div>

            {/* ── Banners ────────────────────────────────────────────────── */}
            {isError && <ErrorBanner onRetry={refetch} />}

            {subscription?.status === 'PAST_DUE' && (
                <div style={{
                    background: 'var(--color-warning-50)',
                    border: '1px solid var(--color-warning-500)',
                    borderRadius: '10px', padding: '14px 20px', marginBottom: '24px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <CreditCard size={18} color="var(--color-warning-600)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-warning-700)', fontSize: '0.875rem' }}>
                            Subscription payment overdue.{' '}
                        </span>
                        <span style={{ color: 'var(--color-warning-600)', fontSize: '0.875rem' }}>
                            Please renew to avoid service interruption.
                        </span>
                    </div>
                </div>
            )}

            {/* ── Stat cards: 4 base + 2 premium ────────────────────────── */}
            <div className="stagger-children" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '16px', marginBottom: '24px',
            }}>
                {/* ── Always visible (Basic + Premium) ── */}
                <StatCard
                    label="Total Students"
                    value={formatCompact(stats.totalStudents ?? 0)}
                    icon={GraduationCap}
                    color="var(--color-brand-600)"
                    trend="up"
                    trendLabel={stats.newStudentsThisMonth
                        ? `+${stats.newStudentsThisMonth} this month` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Active Tokens"
                    value={formatCompact(stats.activeTokens ?? 0)}
                    icon={Cpu}
                    color="var(--color-success-600)"
                    trendLabel={stats.totalTokens ? `${stats.totalTokens} total issued` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Expiring Soon"
                    value={formatCompact(stats.expiringTokens ?? 0)}
                    icon={Clock}
                    color="var(--color-warning-600)"
                    trendLabel="Within 30 days"
                    loading={isLoading}
                />
                <StatCard
                    label="Today's Scans"
                    value={formatCompact(stats.todayScans ?? 0)}
                    icon={ScanLine}
                    color="var(--color-info-600)"
                    trend={stats.scanTrendUp === true ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent != null
                        ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={isLoading}
                />

                {/* ── Premium-only stat cards ── */}
                <StatCard
                    label="Avg Scan Time"
                    value={isPremium && stats.avgScanTimeMs != null
                        ? `${stats.avgScanTimeMs}ms` : '——'}
                    icon={Timer}
                    color="var(--color-purple-600, #7C3AED)"
                    trendLabel={isPremium ? 'Per scan event' : null}
                    loading={isLoading}
                    locked={!isPremium}
                />
                <StatCard
                    label="Unique Scanners"
                    value={isPremium && stats.uniqueScanners != null
                        ? formatCompact(stats.uniqueScanners) : '——'}
                    icon={Fingerprint}
                    color="var(--color-pink-600, #DB2777)"
                    trendLabel={isPremium ? 'Distinct devices' : null}
                    loading={isLoading}
                    locked={!isPremium}
                />
            </div>

            {/* ── Charts row ─────────────────────────────────────────────── */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 340px',
                gap: '16px', marginBottom: '24px',
            }}>

                {/* Scan Activity Chart — period toggle + export for Premium */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', marginBottom: '20px',
                        flexWrap: 'wrap', gap: '10px',
                    }}>
                        <div>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1rem',
                                fontWeight: 600, color: 'var(--text-primary)', margin: 0,
                            }}>
                                Scan Activity
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {chartPeriod}-day success vs failed scans
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Period toggle: basic gets only 7d; premium gets both */}
                            <div style={{
                                display: 'flex', background: 'var(--color-slate-100)',
                                borderRadius: '8px', padding: '3px',
                            }}>
                                <PeriodBtn
                                    label="7d"
                                    active={chartPeriod === 7}
                                    onClick={() => setChartPeriod(7)}
                                />
                                {/* 30-day gated */}
                                {isPremium ? (
                                    <PeriodBtn
                                        label="30d"
                                        active={chartPeriod === 30}
                                        onClick={() => setChartPeriod(30)}
                                    />
                                ) : (
                                    <button
                                        title="Upgrade to unlock 30-day view"
                                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            padding: '4px 10px', borderRadius: '6px',
                                            border: 'none', background: 'transparent',
                                            color: 'var(--color-warning-600)',
                                            fontSize: '0.8125rem', cursor: 'pointer',
                                        }}
                                    >
                                        <Lock size={11} /> 30d
                                    </button>
                                )}
                            </div>

                            {/* CSV export: premium only */}
                            {isPremium && (
                                <button
                                    onClick={handleExportCSV}
                                    title="Export as CSV"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '6px 12px', borderRadius: '6px',
                                        border: '1px solid var(--border-default)',
                                        background: 'transparent', color: 'var(--text-secondary)',
                                        fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Download size={13} /> Export
                                </button>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <Skeleton h="200px" />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={scanTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                                    axisLine={false} tickLine={false}
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
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Token Status"
                        actionLabel="Manage"
                        actionPath={ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY}
                    />
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                            <Skeleton h="160px" w="160px" radius="50%" />
                        </div>
                    ) : tokenBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={tokenBreakdown} cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={72}
                                        paddingAngle={2} dataKey="count"
                                        nameKey="status" strokeWidth={0}
                                    >
                                        {tokenBreakdown.map((entry) => (
                                            <Cell
                                                key={entry.status}
                                                fill={TOKEN_DONUT_COLORS[entry.status] || '#94A3B8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [
                                            value,
                                            typeof name === 'string' ? humanizeEnum(name) : name,
                                        ]}
                                        contentStyle={{
                                            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                                            borderRadius: '8px', border: '1px solid var(--border-default)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                gap: '6px', marginTop: '4px',
                            }}>
                                {tokenBreakdown.map((entry) => (
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
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {entry.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* ── Actionable empty state (replaces plain "No token data") ── */
                        <ActionableEmpty
                            icon={QrCode}
                            message="No tokens yet. Generate your first QR token in Token Management."
                            actionLabel="Go to Token Management"
                            actionPath={ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY}
                            iconColor="var(--color-brand-500)"
                        />
                    )}
                </div>
            </div>

            {/* ── Bottom row: Anomalies + Parent Requests + Plan card ────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '16px' }}>

                {/* Recent Anomalies — basic gets plain list; premium gets severity */}
                <div className="card" style={{ padding: '24px' }}>
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
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map((i) => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '32px 0', color: 'var(--text-muted)',
                        }}>
                            <CheckCircle size={32} color="var(--color-success-500)" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No anomalies detected</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {recentAnomalies.slice(0, 5).map((anomaly) => (
                                <div
                                    key={anomaly.id}
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
                                        background: 'var(--color-danger-50)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <AlertTriangle size={15} color="var(--color-danger-600)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: 'var(--text-primary)', whiteSpace: 'nowrap',
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {humanizeEnum(anomaly.type)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {anomaly.student_name}
                                            {/* Premium: show relative time; Basic: hide it */}
                                            {isPremium && ` · ${formatRelativeTime(anomaly.created_at)}`}
                                        </div>
                                    </div>
                                    {/* Premium: show severity badge; Basic: show plain dot */}
                                    {isPremium ? (
                                        <Badge
                                            status={anomaly.severity ?? 'HIGH'}
                                            colorMap={SEVERITY_COLORS}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                            background: anomaly.severity === 'HIGH' || anomaly.severity === 'CRITICAL'
                                                ? 'var(--color-danger-500)'
                                                : 'var(--color-warning-400)',
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Premium gate for the full anomaly detail view */}
                    {!isPremium && recentAnomalies.length > 0 && (
                        <div style={{
                            marginTop: '12px', padding: '10px 14px',
                            borderRadius: '8px',
                            background: 'var(--color-warning-50)',
                            border: '1px solid var(--color-warning-200)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <Lock size={13} color="var(--color-warning-600)" />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-warning-700)', fontWeight: 500 }}>
                                Severity breakdown & drill-down available on Premium.
                            </span>
                        </div>
                    )}
                </div>

                {/* Parent Requests — basic: simple list; premium: type + preview */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Parent Requests"
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
                            {[1, 2, 3].map((i) => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <ActionableEmpty
                            icon={Users}
                            message="No pending parent requests. You're all caught up!"
                            iconColor="var(--color-success-500)"
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {pendingRequests.slice(0, 5).map((req) => (
                                <div
                                    key={req.id}
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
                                        background: 'var(--color-brand-50)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0,
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
                                            {req.parent_name}
                                            {/* Premium: show request type + time */}
                                            {isPremium && ` · ${humanizeEnum(req.type)} · ${formatRelativeTime(req.created_at)}`}
                                        </div>
                                    </div>
                                    <Badge
                                        status="PENDING"
                                        colorMap={{
                                            PENDING: {
                                                bg: 'var(--color-warning-50)',
                                                text: 'var(--color-warning-700)',
                                            },
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Plan card — right column */}
                <PlanCard
                    plan={plan}
                    isPremium={isPremium}
                    subscriptionEnd={subscriptionEnd}
                    featureUsage={featureUsage}
                />
            </div>

            {/* ── Full-section Premium gate example ─────────────────────── */}
            {/* (drop this anywhere you want a hard gate around a whole section) */}
            {/*
            <div style={{ marginTop: '24px' }}>
                <PremiumGate
                    isPremium={isPremium}
                    feature="Advanced Location Tracking"
                    minHeight="260px"
                    blurPreview={false}
                >
                    <LocationTrackingWidget />
                </PremiumGate>
            </div>
            */}

        </div>
    );
};

export default SchoolAdminDashboard;