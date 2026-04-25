/**
 * SUPER ADMIN — REPORTS
 */

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { Download, BarChart3, TrendingUp, Building2, CreditCard } from 'lucide-react';
import { formatCompact } from '../../utils/formatters.js';

const MONTHLY_REVENUE = [
    { month: 'Aug', revenue: 312000 }, { month: 'Sep', revenue: 348000 },
    { month: 'Oct', revenue: 376000 }, { month: 'Nov', revenue: 402000 },
    { month: 'Dec', revenue: 419000 }, { month: 'Jan', revenue: 451000 },
    { month: 'Feb', revenue: 478000 },
];

const SCAN_VOLUME = [
    { month: 'Aug', scans: 142000 }, { month: 'Sep', scans: 168000 },
    { month: 'Oct', scans: 182000 }, { month: 'Nov', scans: 195000 },
    { month: 'Dec', scans: 201000 }, { month: 'Jan', scans: 223000 },
    { month: 'Feb', scans: 241000 },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
// Recharts renders tooltips outside normal React DOM flow — Tailwind classes
// are stripped, so inline styles are the correct and only approach here.
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 14px',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px' }}>
                {label}
            </p>
            {payload.map(e => (
                <div key={e.name} style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {typeof e.value === 'number' && e.value > 999
                        ? `₹${formatCompact(e.value)}`
                        : e.value.toLocaleString('en-IN')}
                </div>
            ))}
        </div>
    );
};

// Shared axis tick config — passed as props to Recharts (not rendered by React)
const TICK = { fontSize: 11, fill: 'var(--text-muted)' };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Reports() {
    const EXPORT_REPORTS = [
        { label: 'Monthly Revenue Report', description: 'MRR, ARR, churn, new revenue',                        icon: CreditCard, period: 'Last 12 months' },
        { label: 'School Activity Report', description: 'Scan volumes, active students, anomalies per school', icon: Building2,  period: 'This month'     },
        { label: 'Platform Growth Report', description: 'New schools, student growth, retention',              icon: TrendingUp, period: 'Last 6 months'  },
        { label: 'Subscription Cohort',    description: 'Trial-to-paid conversion, churn rates',               icon: BarChart3,  period: 'Last quarter'   },
    ];

    return (
        <div className="max-w-[1100px]">

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Reports
                </h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                    Platform-wide analytics and exportable reports
                </p>
            </div>

            {/* ── Charts row ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 mb-6">

                {/* Monthly Revenue */}
                <div className="card p-6">
                    <h3 className="font-display text-[0.9375rem] font-bold text-[var(--text-primary)] m-0 mb-1">
                        Monthly Revenue
                    </h3>
                    <p className="text-[var(--text-muted)] text-[0.8125rem] m-0 mb-5">
                        Total subscription revenue (₹)
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={v => `₹${formatCompact(v)}`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Platform Scans */}
                <div className="card p-6">
                    <h3 className="font-display text-[0.9375rem] font-bold text-[var(--text-primary)] m-0 mb-1">
                        Platform Scans
                    </h3>
                    <p className="text-[var(--text-muted)] text-[0.8125rem] m-0 mb-5">
                        Total QR scan volume per month
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={SCAN_VOLUME} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={v => formatCompact(v)} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="scans" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Export reports ─────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">

                {/* Card header */}
                <div className="px-5 py-[18px] border-b border-[var(--border-default)] bg-slate-50">
                    <h3 className="font-display text-[0.9375rem] font-bold text-[var(--text-primary)] m-0">
                        Export Reports
                    </h3>
                </div>

                {/* Report rows */}
                <div className="p-2">
                    {EXPORT_REPORTS.map((report, idx) => {
                        const ReportIcon = report.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3.5 px-3 py-3.5 rounded-lg transition-colors hover:bg-slate-50"
                            >
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-[10px] bg-brand-50 flex items-center justify-center shrink-0">
                                    <ReportIcon size={18} className="text-brand-600" />
                                </div>

                                {/* Label + description */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-[var(--text-primary)] mb-0.5">
                                        {report.label}
                                    </div>
                                    <div className="text-[0.8125rem] text-[var(--text-muted)]">
                                        {report.description} · {report.period}
                                    </div>
                                </div>

                                {/* Export button */}
                                <button className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-[7px] border border-[var(--border-default)] bg-white text-brand-600 font-semibold text-[0.8125rem] cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors">
                                    <Download size={13} /> Export CSV
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
