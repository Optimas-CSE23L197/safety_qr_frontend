/**
 * SUPER ADMIN — REPORTS
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, BarChart3, TrendingUp, Building2, GraduationCap, CreditCard } from 'lucide-react';
import { formatCompact } from '../../utils/formatters.js';

const MONTHLY_REVENUE = [
    { month: 'Aug', revenue: 312000 }, { month: 'Sep', revenue: 348000 },
    { month: 'Oct', revenue: 376000 }, { month: 'Nov', revenue: 402000 },
    { month: 'Dec', revenue: 419000 }, { month: 'Jan', revenue: 451000 }, { month: 'Feb', revenue: 478000 },
];

const SCHOOL_GROWTH = [
    { month: 'Aug', schools: 108 }, { month: 'Sep', schools: 114 },
    { month: 'Oct', schools: 119 }, { month: 'Nov', schools: 124 },
    { month: 'Dec', schools: 128 }, { month: 'Jan', schools: 135 }, { month: 'Feb', schools: 142 },
];

const SCAN_VOLUME = [
    { month: 'Aug', scans: 142000 }, { month: 'Sep', scans: 168000 },
    { month: 'Oct', scans: 182000 }, { month: 'Nov', scans: 195000 },
    { month: 'Dec', scans: 201000 }, { month: 'Jan', scans: 223000 }, { month: 'Feb', scans: 241000 },
];

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
            {payload.map(e => (
                <div key={e.name} style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {typeof e.value === 'number' && e.value > 999 ? `₹${formatCompact(e.value)}` : e.value.toLocaleString('en-IN')}
                </div>
            ))}
        </div>
    );
};

export default function Reports() {
    const EXPORT_REPORTS = [
        { label: 'Monthly Revenue Report', description: 'MRR, ARR, churn, new revenue', icon: CreditCard, period: 'Last 12 months' },
        { label: 'School Activity Report', description: 'Scan volumes, active students, anomalies per school', icon: Building2, period: 'This month' },
        { label: 'Platform Growth Report', description: 'New schools, student growth, retention', icon: TrendingUp, period: 'Last 6 months' },
        { label: 'Subscription Cohort', description: 'Trial-to-paid conversion, churn rates', icon: BarChart3, period: 'Last quarter' },
    ];

    return (
        <div style={{ maxWidth: '1100px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Reports</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Platform-wide analytics and exportable reports</p>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, margin: '0 0 4px' }}>Monthly Revenue</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '20px' }}>Total subscription revenue (₹)</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${formatCompact(v)}`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, margin: '0 0 4px' }}>Platform Scans</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '20px' }}>Total QR scan volume per month</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={SCAN_VOLUME} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => formatCompact(v)} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="scans" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Export reports */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Export Reports</h3>
                </div>
                <div style={{ padding: '8px' }}>
                    {EXPORT_REPORTS.map((report, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 12px', borderRadius: '8px', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <report.icon size={18} color="#2563EB" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{report.label}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{report.description} · {report.period}</div>
                            </div>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--color-brand-600)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
                                <Download size={13} /> Export CSV
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}