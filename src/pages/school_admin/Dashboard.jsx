/**
 * SCHOOL ADMIN DASHBOARD
 * Professional data dashboard with:
 * - 4 KPI stat cards
 * - Scan activity chart (recharts)
 * - Token status donut
 * - Recent anomalies table
 * - Pending parent requests
 * - Subscription status
 */

import { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
    GraduationCap, Cpu, AlertTriangle, ScanLine,
    TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, ArrowRight,
    CreditCard, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getSchoolDashboardApi } from '../../api/school.api.js';
import { formatDate, formatRelativeTime, humanizeEnum, formatCompact } from '../../utils/formatters.js';
import { ROUTES } from '../../config/routes.config.js';
import { TOKEN_STATUS_COLORS, SCAN_RESULT_COLORS } from '../../config/theme.config.js';

// ── Skeleton loader ────────────────────────────────────────────────────────────
const Skeleton = ({ w = '100%', h = '16px', radius = '6px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, trend, trendLabel, loading }) => (
    <div className="card animate-fadeIn" style={{ padding: '24px', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                }}>
                    {label}
                </p>
                {loading ? (
                    <Skeleton h="32px" w="80px" />
                ) : (
                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                    }}>
                        {value}
                    </div>
                )}
                {!loading && trendLabel && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px',
                    }}>
                        {trend === 'up' ? (
                            <TrendingUp size={13} color="var(--color-success-600)" />
                        ) : trend === 'down' ? (
                            <TrendingDown size={13} color="var(--color-danger-600)" />
                        ) : null}
                        <span style={{
                            fontSize: '0.75rem',
                            color: trend === 'up' ? 'var(--color-success-600)' : 'var(--color-danger-600)',
                            fontWeight: 500,
                        }}>
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
            <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: '16px',
            }}>
                <Icon size={22} color={color} />
            </div>
        </div>
    </div>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
const Badge = ({ status, colorMap }) => {
    const colors = colorMap?.[status] || { bg: '#F1F5F9', text: '#475569' };
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: colors.bg,
            color: colors.text,
            whiteSpace: 'nowrap',
        }}>
            {humanizeEnum(status)}
        </span>
    );
};

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, actionLabel, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '20px',
        }}>
            <div>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                        background: 'transparent',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--color-brand-600)',
                        cursor: 'pointer',
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

// ── Custom Tooltip for chart ──────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--color-slate-900)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 14px',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '6px' }}>{label}</p>
            {payload.map((entry) => (
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

// ── DONUT COLORS ──────────────────────────────────────────────────────────────
const TOKEN_DONUT_COLORS = {
    ACTIVE: '#10B981',
    UNASSIGNED: '#94A3B8',
    ISSUED: '#0EA5E9',
    EXPIRED: '#F59E0B',
    REVOKED: '#EF4444',
    INACTIVE: '#CBD5E1',
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const SchoolAdminDashboard = () => {
    const { schoolId } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!schoolId) return;
            try {
                const res = await getSchoolDashboardApi(schoolId);
                setData(res.data);
            } catch {
                // Data will remain null — components handle gracefully
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [schoolId]);

    // ── Derived data ───────────────────────────────────────────────────────────
    const stats = data?.stats || {};
    const scanTrend = data?.scanTrend || [];
    const tokenBreakdown = data?.tokenBreakdown || [];
    const recentAnomalies = data?.recentAnomalies || [];
    const pendingRequests = data?.pendingRequests || [];
    const subscription = data?.subscription;

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div style={{ maxWidth: '1400px' }}>

            {/* ── Page greeting ──────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                }}>
                    Good morning 👋
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{today}</p>
            </div>

            {/* ── Subscription warning banner ────────────────────────────────────── */}
            {subscription?.status === 'PAST_DUE' && (
                <div style={{
                    background: 'var(--color-warning-50)',
                    border: '1px solid var(--color-warning-500)',
                    borderRadius: '10px',
                    padding: '14px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
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

            {/* ── KPI Stat Cards ─────────────────────────────────────────────────── */}
            <div className="stagger-children" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px',
            }}>
                <StatCard
                    label="Total Students"
                    value={formatCompact(stats.totalStudents ?? 0)}
                    icon={GraduationCap}
                    color="var(--color-brand-600)"
                    trend="up"
                    trendLabel={stats.newStudentsThisMonth ? `+${stats.newStudentsThisMonth} this month` : null}
                    loading={loading}
                />
                <StatCard
                    label="Active Tokens"
                    value={formatCompact(stats.activeTokens ?? 0)}
                    icon={Cpu}
                    color="var(--color-success-600)"
                    trendLabel={stats.totalTokens ? `${stats.totalTokens} total issued` : null}
                    loading={loading}
                />
                <StatCard
                    label="Expiring Soon"
                    value={formatCompact(stats.expiringTokens ?? 0)}
                    icon={Clock}
                    color="var(--color-warning-600)"
                    trendLabel="Within 30 days"
                    loading={loading}
                />
                <StatCard
                    label="Today's Scans"
                    value={formatCompact(stats.todayScans ?? 0)}
                    icon={ScanLine}
                    color="var(--color-info-600)"
                    trend={stats.scanTrendUp ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={loading}
                />
            </div>

            {/* ── Charts Row ─────────────────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: '16px',
                marginBottom: '24px',
            }}>

                {/* Scan Activity Chart */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Scan Activity"
                        subtitle="Last 7 days — success vs failed scans"
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.SCAN_LOGS}
                    />
                    {loading ? (
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
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="success"
                                    name="Success"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fill="url(#successGrad)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#10B981' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failed"
                                    name="Failed"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    fill="url(#failGrad)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#EF4444' }}
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
                    {loading ? (
                        <Skeleton h="200px" radius="50%" w="200px" />
                    ) : tokenBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={tokenBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={72}
                                        paddingAngle={2}
                                        dataKey="count"
                                        strokeWidth={0}
                                    >
                                        {tokenBreakdown.map((entry) => (
                                            <Cell key={entry.status} fill={TOKEN_DONUT_COLORS[entry.status] || '#94A3B8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, humanizeEnum(name)]}
                                        contentStyle={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.8125rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-default)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                {tokenBreakdown.map((entry) => (
                                    <div key={entry.status} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '0.8125rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: TOKEN_DONUT_COLORS[entry.status] || '#94A3B8', flexShrink: 0,
                                            }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{humanizeEnum(entry.status)}</span>
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {entry.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.875rem' }}>
                            No token data available
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom Row ─────────────────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
            }}>

                {/* Recent Anomalies */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Recent Anomalies"
                        subtitle={recentAnomalies.length > 0 ? `${recentAnomalies.length} flagged scans` : 'No active anomalies'}
                        actionLabel="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN.ANOMALIES}
                    />
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '32px 0',
                            color: 'var(--text-muted)',
                        }}>
                            <CheckCircle size={32} color="var(--color-success-500)" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No anomalies detected</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {recentAnomalies.slice(0, 5).map((anomaly) => (
                                <div
                                    key={anomaly.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: 'var(--color-danger-50)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <AlertTriangle size={15} color="var(--color-danger-600)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {humanizeEnum(anomaly.type)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {anomaly.student_name} · {formatRelativeTime(anomaly.created_at)}
                                        </div>
                                    </div>
                                    <Badge status={anomaly.severity || 'HIGH'} colorMap={{
                                        HIGH: { bg: 'var(--color-danger-50)', text: 'var(--color-danger-700)' },
                                        MEDIUM: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)' },
                                        LOW: { bg: 'var(--color-info-50)', text: 'var(--color-info-700)' },
                                    }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Parent Requests */}
                <div className="card" style={{ padding: '24px' }}>
                    <SectionHeader
                        title="Parent Requests"
                        subtitle={
                            pendingRequests.length > 0
                                ? `${pendingRequests.length} awaiting review`
                                : 'All caught up'
                        }
                        actionLabel="Review all"
                        actionPath={ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS}
                    />
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} h="52px" />)}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '32px 0',
                            color: 'var(--text-muted)',
                        }}>
                            <CheckCircle size={32} color="var(--color-success-500)" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No pending requests</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {pendingRequests.slice(0, 5).map((req) => (
                                <div
                                    key={req.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => navigate(ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS)}
                                >
                                    <div style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: 'var(--color-brand-50)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Users size={15} color="var(--color-brand-600)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {req.student_name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {req.parent_name} · {formatRelativeTime(req.created_at)}
                                        </div>
                                    </div>
                                    <Badge status="PENDING" colorMap={{
                                        PENDING: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)' },
                                    }} />
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