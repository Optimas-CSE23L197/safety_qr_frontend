/**
 * StatCard — metric card for dashboard/overview sections.
 *
 * Props:
 *   label      string
 *   value      string|number
 *   icon       Lucide component
 *   iconColor  string   — icon background accent color (hex)
 *   trend      number   — e.g. +12 or -3 (shows green/red pill)
 *   trendLabel string   — e.g. 'vs last month'
 *   loading    bool
 *
 * Usage:
 *   <StatCard label="Total Schools" value={42} icon={Building2} iconColor="#2563EB" trend={5} trendLabel="this month" />
 *   <StatCard label="Active Admins" value={38} icon={Users} iconColor="#10B981" />
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
    label,
    value,
    icon: Icon,
    iconColor = '#2563EB',
    trend,
    trendLabel,
    loading = false,
}) {
    const hasTrend = trend !== undefined && trend !== null;
    const positive = hasTrend && trend >= 0;

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{
                    fontSize: '0.8125rem', fontWeight: 600,
                    color: 'var(--text-muted)', letterSpacing: '0.02em',
                }}>
                    {label}
                </span>
                {Icon && (
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '9px',
                        background: `${iconColor}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Icon size={17} color={iconColor} />
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{
                    height: '28px', width: '60%', borderRadius: '6px',
                    background: 'linear-gradient(90deg, var(--color-slate-100) 25%, var(--color-slate-200) 50%, var(--color-slate-100) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                }} />
            ) : (
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                }}>
                    {value ?? '—'}
                </div>
            )}

            {hasTrend && !loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        padding: '2px 7px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                        background: positive ? '#ECFDF5' : '#FEF2F2',
                        color: positive ? '#047857' : '#B91C1C',
                    }}>
                        {positive
                            ? <TrendingUp size={11} />
                            : <TrendingDown size={11} />
                        }
                        {positive ? '+' : ''}{trend}
                    </span>
                    {trendLabel && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {trendLabel}
                        </span>
                    )}
                </div>
            )}

            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
