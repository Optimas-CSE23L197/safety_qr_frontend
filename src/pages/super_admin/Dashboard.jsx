/**
 * SUPER ADMIN DASHBOARD
 * Platform-wide KPIs, school growth chart, subscription breakdown,
 * recent audit activity, system health snapshot.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
    Building2, Users, CreditCard, Activity, TrendingUp, TrendingDown,
    ArrowRight, CheckCircle, AlertTriangle, XCircle, Clock,
    GraduationCap, Cpu, Shield, Server,
} from 'lucide-react';
import { ROUTES } from '../../config/routes.config.js';
import { formatCompact, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ w = '100%', h = '16px', radius = '6px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendLabel, loading }) => (
    <div className="card animate-fadeIn" style={{ padding: '24px', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px',
                }}>
                    {label}
                </p>
                {loading ? <Skeleton h="32px" w="80px" /> : (
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.875rem',
                        fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1,
                    }}>
                        {value}
                    </div>
                )}
                {!loading && trendLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                        {trend === 'up'
                            ? <TrendingUp size={13} color="var(--color-success-600)" />
                            : trend === 'down'
                                ? <TrendingDown size={13} color="var(--color-danger-600)" />
                                : null}
                        <span style={{
                            fontSize: '0.75rem', fontWeight: 500,
                            color: trend === 'up' ? 'var(--color-success-600)' : trend === 'down' ? 'var(--color-danger-600)' : 'var(--text-muted)',
                        }}>
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
            <div style={{
                width: '46px', height: '46px', borderRadius: '12px', background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginLeft: '16px',
            }}>
                <Icon size={22} color={color} />
            </div>
        </div>
    </div>
);

// ── Section Header ─────────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, actionLabel, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    fontWeight: 600, color: 'var(--text-primary)', margin: 0,
                }}>
                    {title}
                </h3>
                {subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
            </div>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px',
                        borderRadius: '6px', border: '1px solid var(--border-default)',
                        background: 'transparent', fontSize: '0.8125rem', fontWeight: 500,
                        color: 'var(--color-brand-600)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                    {actionLabel} <ArrowRight size={13} />
                </button>
            )}
        </div>
    );
};

// ── Chart Tooltip ──────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--color-slate-900)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '10px 14px',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '6px' }}>{label}</p>
            {payload.map(entry => (
                <div key={entry.name} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                    <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {entry.name}: {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_STATS = {
    totalSchools: 142,
    activeSchools: 128,
    totalStudents: 89430,
    activeSubscriptions: 119,
    trialingSchools: 9,
    pastDueSchools: 4,
    mrrUsd: 47800,
    schoolsThisMonth: 7,
    studentsThisMonth: 3210,
};

const MOCK_GROWTH = [
    { month: 'Aug', schools: 108, students: 67200 },
    { month: 'Sep', schools: 114, students: 72000 },
    { month: 'Oct', schools: 119, students: 76400 },
    { month: 'Nov', schools: 124, students: 80100 },
    { month: 'Dec', schools: 128, students: 83900 },
    { month: 'Jan', schools: 135, students: 86700 },
    { month: 'Feb', schools: 142, students: 89430 },
];

const MOCK_SUB_BREAKDOWN = [
    { status: 'ACTIVE', count: 119, color: '#10B981' },
    { status: 'TRIALING', count: 9, color: '#0EA5E9' },
    { status: 'PAST_DUE', count: 4, color: '#F59E0B' },
    { status: 'CANCELED', count: 6, color: '#EF4444' },
    { status: 'EXPIRED', count: 4, color: '#94A3B8' },
];

const MOCK_RECENT_SCHOOLS = [
    { id: 's1', name: 'Delhi Public School, Noida', city: 'Noida', status: 'TRIALING', students: 0, created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
    { id: 's2', name: 'St. Mary\'s Convent, Pune', city: 'Pune', status: 'ACTIVE', students: 412, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 's3', name: 'Kendriya Vidyalaya, Bhopal', city: 'Bhopal', status: 'ACTIVE', students: 287, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 's4', name: 'Ryan International, Mumbai', city: 'Mumbai', status: 'TRIALING', students: 0, created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 's5', name: 'Cambridge High School, Hyderabad', city: 'Hyderabad', status: 'ACTIVE', students: 650, created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
];

const MOCK_RECENT_AUDIT = [
    { id: 'a1', action: 'SCHOOL_CREATED', actor: 'super@admin.com', entity: 'Delhi Public School', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'a2', action: 'SUBSCRIPTION_UPDATED', actor: 'super@admin.com', entity: 'Ryan International', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'a3', action: 'FEATURE_FLAG_TOGGLED', actor: 'super@admin.com', entity: 'allow_location', created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 'a4', action: 'ADMIN_CREATED', actor: 'super@admin.com', entity: 'Ramesh Kumar', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'a5', action: 'SCHOOL_SUSPENDED', actor: 'super@admin.com', entity: 'Old Academy, Delhi', created_at: new Date(Date.now() - 86400000 * 1.5).toISOString() },
];

const SUB_STATUS_STYLE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857' },
    TRIALING: { bg: '#E0F2FE', color: '#0369A1' },
    PAST_DUE: { bg: '#FFFBEB', color: '#B45309' },
    CANCELED: { bg: '#FEF2F2', color: '#B91C1C' },
    EXPIRED: { bg: '#F1F5F9', color: '#475569' },
};

const AUDIT_ACTION_META = {
    SCHOOL_CREATED: { icon: '🏫', color: '#2563EB' },
    SUBSCRIPTION_UPDATED: { icon: '💳', color: '#10B981' },
    FEATURE_FLAG_TOGGLED: { icon: '🚩', color: '#F59E0B' },
    ADMIN_CREATED: { icon: '👤', color: '#8B5CF6' },
    SCHOOL_SUSPENDED: { icon: '⛔', color: '#EF4444' },
};

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div style={{ maxWidth: '1400px' }}>

            {/* Greeting */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.375rem',
                    fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px',
                }}>
                    Platform Overview 🛡️
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{today}</p>
            </div>

            {/* Past-due alert banner */}
            {MOCK_STATS.pastDueSchools > 0 && (
                <div style={{
                    background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-500)',
                    borderRadius: '10px', padding: '14px 20px', marginBottom: '24px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <AlertTriangle size={18} color="var(--color-warning-600)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-warning-700)', fontSize: '0.875rem' }}>
                            {MOCK_STATS.pastDueSchools} schools have past-due subscriptions.{' '}
                        </span>
                        <span style={{ color: 'var(--color-warning-600)', fontSize: '0.875rem' }}>
                            Review and follow up to prevent service interruption.
                        </span>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.SUPER_ADMIN.SUBSCRIPTIONS)}
                        style={{
                            padding: '6px 14px', borderRadius: '7px',
                            border: '1px solid var(--color-warning-500)',
                            background: 'white', color: 'var(--color-warning-700)',
                            fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                        }}
                    >
                        View Subscriptions
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="stagger-children" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px', marginBottom: '24px',
            }}>
                <StatCard
                    label="Total Schools"
                    value={loading ? '—' : MOCK_STATS.totalSchools}
                    icon={Building2}
                    color="#2563EB"
                    bg="#EFF6FF"
                    trend="up"
                    trendLabel={`+${MOCK_STATS.schoolsThisMonth} this month`}
                    loading={loading}
                />
                <StatCard
                    label="Total Students"
                    value={loading ? '—' : formatCompact(MOCK_STATS.totalStudents)}
                    icon={GraduationCap}
                    color="#10B981"
                    bg="#ECFDF5"
                    trend="up"
                    trendLabel={`+${formatCompact(MOCK_STATS.studentsThisMonth)} this month`}
                    loading={loading}
                />
                <StatCard
                    label="Active Subscriptions"
                    value={loading ? '—' : MOCK_STATS.activeSubscriptions}
                    icon={CreditCard}
                    color="#8B5CF6"
                    bg="#F5F3FF"
                    trendLabel={`${MOCK_STATS.trialingSchools} trialing`}
                    loading={loading}
                />
                <StatCard
                    label="Monthly Revenue"
                    value={loading ? '—' : `₹${formatCompact(MOCK_STATS.mrrUsd)}`}
                    icon={TrendingUp}
                    color="#F59E0B"
                    bg="#FFFBEB"
                    trend="up"
                    trendLabel="+12% vs last month"
                    loading={loading}
                />
            </div>

            {/* Charts row */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 340px',
                gap: '16px', marginBottom: '24px',
            }}>
                {/* Growth chart */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Platform Growth"
                        subtitle="Schools and students over the last 7 months"
                        actionLabel="All Schools"
                        actionPath={ROUTES.SUPER_ADMIN.ALL_SCHOOLS}
                    />
                    {loading ? <Skeleton h="220px" /> : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={MOCK_GROWTH} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} tickFormatter={v => formatCompact(v)} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area yAxisId="left" type="monotone" dataKey="schools" name="Schools" stroke="#2563EB" strokeWidth={2} fill="url(#schoolGrad)" dot={false} activeDot={{ r: 4, fill: '#2563EB' }} />
                                <Area yAxisId="right" type="monotone" dataKey="students" name="Students" stroke="#10B981" strokeWidth={2} fill="url(#studentGrad)" dot={false} activeDot={{ r: 4, fill: '#10B981' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Subscription donut */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Subscription Status"
                        actionLabel="Manage"
                        actionPath={ROUTES.SUPER_ADMIN.SUBSCRIPTIONS}
                    />
                    {loading ? <Skeleton h="200px" /> : (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={MOCK_SUB_BREAKDOWN}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={72}
                                        paddingAngle={2} dataKey="count" strokeWidth={0}
                                    >
                                        {MOCK_SUB_BREAKDOWN.map(entry => (
                                            <Cell key={entry.status} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, humanizeEnum(name)]}
                                        contentStyle={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                {MOCK_SUB_BREAKDOWN.map(entry => (
                                    <div key={entry.status} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', fontSize: '0.8125rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{humanizeEnum(entry.status)}</span>
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.count}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Recently registered schools */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Recently Registered Schools"
                        subtitle={`${MOCK_STATS.schoolsThisMonth} new schools this month`}
                        actionLabel="View all"
                        actionPath={ROUTES.SUPER_ADMIN.ALL_SCHOOLS}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {MOCK_RECENT_SCHOOLS.map(school => {
                            const s = SUB_STATUS_STYLE[school.status] || SUB_STATUS_STYLE.ACTIVE;
                            return (
                                <div
                                    key={school.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '8px',
                                        cursor: 'pointer', transition: 'background 0.1s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => navigate(`/super/schools/${school.id}`)}
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: '#EFF6FF', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <Building2 size={16} color="#2563EB" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {school.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {school.city} · {formatRelativeTime(school.created_at)}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '9999px',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        background: s.bg, color: s.color, whiteSpace: 'nowrap',
                                    }}>
                                        {humanizeEnum(school.status)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent audit activity */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Recent Admin Activity"
                        subtitle="Latest super-admin actions"
                        actionLabel="Full log"
                        actionPath={ROUTES.SUPER_ADMIN.AUDIT_LOGS}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {MOCK_RECENT_AUDIT.map(log => {
                            const meta = AUDIT_ACTION_META[log.action] || { icon: '📋', color: '#64748B' };
                            return (
                                <div
                                    key={log.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '8px',
                                        transition: 'background 0.1s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '8px',
                                        background: 'var(--color-slate-100)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '16px', flexShrink: 0,
                                    }}>
                                        {meta.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {humanizeEnum(log.action)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {log.entity} · {formatRelativeTime(log.created_at)}
                                        </div>
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