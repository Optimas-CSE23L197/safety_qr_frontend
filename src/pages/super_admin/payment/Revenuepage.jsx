/**
 * REVENUE PAGE — Super Admin Analytics
 * Driven by: Payment + Subscription + School models
 *
 * Covers:
 *  - MRR / ARR over time
 *  - Net Revenue (collected − refunded)
 *  - Plan-wise breakdown (starter/growth/enterprise)
 *  - School-wise contribution table
 *  - Churn analysis (CANCELED + EXPIRED subscriptions)
 *  - Refunds and failed payment loss
 */

import { useState, useMemo } from 'react';
import {
    TrendingUp, IndianRupee, BarChart3, Users, ArrowUpRight,
    ArrowDownRight, Building2, ChevronDown, Download, Info,
    Zap, RotateCcw, XCircle, ShieldOff, Award, Minus,
    BadgeCheck, Activity, PieChart as PieIcon
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';

// ─── MOCK DATA (exact schema shape) ──────────────────────────────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International School', code: 'GWI', city: 'New Delhi' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA', city: 'Bengaluru' },
    { id: 'sch-003', name: 'Delhi Public School R3', code: 'DPS', city: 'New Delhi' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC', city: 'Kolkata' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS', city: 'Pune' },
    { id: 'sch-006', name: 'The Heritage School', code: 'THS', city: 'Chennai' },
];

const SUBSCRIPTIONS = [
    { id: 'sub-001', school_id: 'sch-001', status: 'ACTIVE', plan: 'growth', provider: 'razorpay' },
    { id: 'sub-002', school_id: 'sch-002', status: 'ACTIVE', plan: 'starter', provider: 'razorpay' },
    { id: 'sub-003', school_id: 'sch-003', status: 'PAST_DUE', plan: 'enterprise', provider: 'razorpay' },
    { id: 'sub-004', school_id: 'sch-004', status: 'TRIALING', plan: 'starter', provider: 'razorpay' },
    { id: 'sub-005', school_id: 'sch-005', status: 'CANCELED', plan: 'growth', provider: 'razorpay' },
    { id: 'sub-006', school_id: 'sch-006', status: 'ACTIVE', plan: 'enterprise', provider: 'stripe' },
];

// amount in paise
const ALL_PAYMENTS = [
    { id: 'p01', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-04-01' },
    { id: 'p02', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-04-05' },
    { id: 'p03', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-04-10' },
    { id: 'p04', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-05-01' },
    { id: 'p05', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-05-05' },
    { id: 'p06', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', created_at: '2024-05-01' },
    { id: 'p07', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-05-10' },
    { id: 'p08', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-06-01' },
    { id: 'p09', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-06-05' },
    { id: 'p10', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-06-10' },
    { id: 'p11', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', created_at: '2024-07-01' },
    { id: 'p12', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-07-01' },
    { id: 'p13', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-07-05' },
    { id: 'p14', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-07-10' },
    { id: 'p15', school_id: 'sch-005', subscription_id: 'sub-005', amount: 499900, currency: 'INR', status: 'REFUNDED', provider: 'razorpay', created_at: '2024-07-15' },
    { id: 'p16', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-08-01' },
    { id: 'p17', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-08-05' },
    { id: 'p18', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-08-10' },
    { id: 'p19', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', created_at: '2024-09-01' },
    { id: 'p20', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-09-01' },
    { id: 'p21', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-09-05' },
    { id: 'p22', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-09-10' },
    { id: 'p23', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-10-01' },
    { id: 'p24', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-10-05' },
    { id: 'p25', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-10-10' },
    { id: 'p26', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', created_at: '2024-10-01' },
    { id: 'p27', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-11-01' },
    { id: 'p28', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-11-05' },
    { id: 'p29', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', created_at: '2024-11-10' },
    { id: 'p30', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'PENDING', provider: 'razorpay', created_at: '2024-11-08' },
    { id: 'p31', school_id: 'sch-004', subscription_id: 'sub-004', amount: 0, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', created_at: '2024-11-15' },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PLAN_CFG = {
    starter: { label: 'Starter', color: '#10B981', bg: '#ECFDF5', price: 1999 },
    growth: { label: 'Growth', color: '#6366F1', bg: '#EEF2FF', price: 4999 },
    enterprise: { label: 'Enterprise', color: '#F59E0B', bg: '#FFFBEB', price: 14999 },
};
const STATUS_CFG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5' },
    TRIALING: { label: 'Trial', color: '#0EA5E9', bg: '#E0F2FE' },
    PAST_DUE: { label: 'Past Due', color: '#EF4444', bg: '#FEF2F2' },
    CANCELED: { label: 'Canceled', color: '#9CA3AF', bg: '#F3F4F6' },
    EXPIRED: { label: 'Expired', color: '#6B7280', bg: '#F9FAFB' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtINR = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtCom = n => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;
const mo = d => d.slice(0, 7); // "2024-11"
const moLabel = m => { const [y, mm] = m.split('-'); return MONTHS[+mm - 1] || m; };

// ─── ANALYTICS COMPUTATION ───────────────────────────────────────────────────
function computeAnalytics() {
    const payments = ALL_PAYMENTS.map(p => ({ ...p, amountInr: p.amount / 100, school: SCHOOLS.find(s => s.id === p.school_id), subscription: SUBSCRIPTIONS.find(s => s.id === p.subscription_id) }));

    // Monthly MRR (SUCCESS only, amount > 0)
    const monthlyMap = {};
    payments.forEach(p => {
        const m = mo(p.created_at);
        if (!monthlyMap[m]) monthlyMap[m] = { collected: 0, refunded: 0, failed: 0 };
        if (p.status === 'SUCCESS' && p.amountInr > 0) monthlyMap[m].collected += p.amountInr;
        if (p.status === 'REFUNDED') monthlyMap[m].refunded += p.amountInr;
        if (p.status === 'FAILED') monthlyMap[m].failed += p.amountInr;
    });
    const months = Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b));
    const mrrData = months.map(([m, v]) => ({
        month: moLabel(m),
        mrr: v.collected,
        net: v.collected - v.refunded,
        refunded: v.refunded,
        failed: v.failed,
        arr: v.collected * 12,
    }));

    // Current MRR = last full month
    const lastMo = mrrData[mrrData.length - 1];
    const prevMo = mrrData[mrrData.length - 2];
    const currentMRR = lastMo?.mrr || 0;
    const mrrDelta = prevMo ? ((currentMRR - prevMo.mrr) / prevMo.mrr * 100).toFixed(1) : 0;

    // Plan breakdown
    const planMap = { starter: 0, growth: 0, enterprise: 0 };
    const planCountMap = { starter: 0, growth: 0, enterprise: 0 };
    payments.filter(p => p.status === 'SUCCESS' && p.amountInr > 0).forEach(p => {
        const plan = p.subscription?.plan;
        if (plan && planMap[plan] !== undefined) {
            planMap[plan] += p.amountInr;
            planCountMap[plan] += 1;
        }
    });
    const planData = Object.entries(planMap).map(([plan, revenue]) => ({
        plan, revenue, txns: planCountMap[plan],
        ...PLAN_CFG[plan],
    }));

    // School contribution
    const schoolMap = {};
    payments.filter(p => p.status === 'SUCCESS' && p.amountInr > 0).forEach(p => {
        if (!schoolMap[p.school_id]) schoolMap[p.school_id] = { school: p.school, revenue: 0, txns: 0, refunded: 0 };
        schoolMap[p.school_id].revenue += p.amountInr;
        schoolMap[p.school_id].txns += 1;
    });
    payments.filter(p => p.status === 'REFUNDED').forEach(p => {
        if (schoolMap[p.school_id]) schoolMap[p.school_id].refunded += p.amountInr;
    });
    const schoolData = Object.values(schoolMap).sort((a, b) => b.revenue - a.revenue).map(s => ({
        ...s,
        net: s.revenue - s.refunded,
        subscription: SUBSCRIPTIONS.find(sub => sub.school_id === s.school?.id),
    }));

    // Churn
    const churned = SUBSCRIPTIONS.filter(s => s.status === 'CANCELED' || s.status === 'EXPIRED').length;
    const total = SUBSCRIPTIONS.length;
    const churnRate = ((churned / total) * 100).toFixed(1);

    // Totals
    const totalCollected = payments.filter(p => p.status === 'SUCCESS' && p.amountInr > 0).reduce((s, p) => s + p.amountInr, 0);
    const totalRefunded = payments.filter(p => p.status === 'REFUNDED').reduce((s, p) => s + p.amountInr, 0);
    const totalFailed = payments.filter(p => p.status === 'FAILED').reduce((s, p) => s + p.amountInr, 0);
    const netRevenue = totalCollected - totalRefunded;

    // Gateway split
    const gwMap = {};
    payments.filter(p => p.status === 'SUCCESS' && p.amountInr > 0).forEach(p => {
        gwMap[p.provider] = (gwMap[p.provider] || 0) + p.amountInr;
    });
    const gwData = Object.entries(gwMap).map(([name, value]) => ({ name, value }));

    return { mrrData, currentMRR, mrrDelta, planData, schoolData, churned, churnRate, total, totalCollected, totalRefunded, totalFailed, netRevenue, gwData };
}

const DATA = computeAnalytics();
const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#EF4444', '#8B5CF6'];

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#0F172A', borderRadius: 10, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '3px 0', fontSize: '0.82rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ color: p.color || '#fff' }}>{typeof p.value === 'number' && p.value > 100 ? fmtINR(p.value) : p.value}</span>
                </p>
            ))}
        </div>
    );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, Icon, color, bg, badge, badgeColor, badgeBg, delta, dir }) {
    return (
        <div style={{ background: '#fff', borderRadius: 16, padding: '22px', border: '1px solid #E5E7EB', flex: 1, minWidth: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            {/* Subtle bg blob */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: bg, opacity: 0.7 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0F172A', margin: '7px 0 0', letterSpacing: '-0.035em', lineHeight: 1 }}>{value}</p>
                    {sub && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '5px 0 0', fontWeight: 500 }}>{sub}</p>}
                    {delta && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 8 }}>
                            {dir === 'up' ? <ArrowUpRight size={12} color="#10B981" strokeWidth={3} /> : <ArrowDownRight size={12} color="#EF4444" strokeWidth={3} />}
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: dir === 'up' ? '#10B981' : '#EF4444' }}>{delta}</span>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>vs prev. month</span>
                        </div>
                    )}
                </div>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12, position: 'relative', zIndex: 1 }}>
                    <Icon size={21} color={color} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ title, sub, children, action }) {
    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h3>
                    {sub && <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>{sub}</p>}
                </div>
                {action}
            </div>
            <div style={{ padding: '20px 22px' }}>{children}</div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RevenuePage() {
    const [period, setPeriod] = useState('6m');
    const { mrrData, currentMRR, mrrDelta, planData, schoolData, churned, churnRate, totalCollected, totalRefunded, totalFailed, netRevenue, gwData } = DATA;

    const chartMonths = period === '3m' ? mrrData.slice(-3) : period === '6m' ? mrrData.slice(-6) : mrrData;

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto', fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fup { animation: fadeUp 0.35s ease both; }
        .fup:nth-child(2) { animation-delay:0.05s; }
        .fup:nth-child(3) { animation-delay:0.10s; }
        .fup:nth-child(4) { animation-delay:0.15s; }
        .tr2:hover { background:#F8FAFC !important; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }} className="fup">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#10B981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
                            <TrendingUp size={19} color="#fff" strokeWidth={2.2} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>Revenue</h1>
                            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>MRR, ARR, churn, plan breakdown & school-level contribution</p>
                        </div>
                    </div>
                </div>
                {/* Period selector */}
                <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 11, padding: 3 }}>
                    {['3m', '6m', 'all'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: period === p ? '#fff' : 'transparent', color: period === p ? '#0F172A' : '#64748B', fontSize: '0.8rem', fontWeight: 800, boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }} className="fup">
                <KpiCard label="Current MRR" value={fmtCom(currentMRR)} sub="Monthly recurring" Icon={IndianRupee} color="#10B981" bg="#ECFDF5" delta={`${mrrDelta > 0 ? '+' : ''}${mrrDelta}%`} dir={mrrDelta >= 0 ? 'up' : 'down'} />
                <KpiCard label="ARR (projected)" value={fmtCom(currentMRR * 12)} sub="Annual run-rate" Icon={TrendingUp} color="#6366F1" bg="#EEF2FF" />
                <KpiCard label="Net Revenue" value={fmtCom(netRevenue)} sub="After refunds" Icon={BarChart3} color="#0EA5E9" bg="#E0F2FE" delta="+8.2%" dir="up" />
                <KpiCard label="Refunded" value={fmtINR(totalRefunded)} sub="Total issued back" Icon={RotateCcw} color="#F59E0B" bg="#FFFBEB" />
                <KpiCard label="Churn Rate" value={`${churnRate}%`} sub={`${churned} of ${DATA.total} schools`} Icon={ShieldOff} color="#EF4444" bg="#FEF2F2" delta="-1.2%" dir="up" />
            </div>

            {/* MRR/Net Revenue area chart + Gateway pie */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 20 }} className="fup">
                <Section title="Revenue Trend" sub="MRR collected vs. net revenue after refunds">
                    <ResponsiveContainer width="100%" height={230}>
                        <ComposedChart data={chartMonths} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={46} />
                            <Tooltip content={<DarkTooltip />} />
                            <Area type="monotone" dataKey="mrr" name="MRR" stroke="#6366F1" strokeWidth={2.5} fill="url(#mrrGrad)" dot={false} activeDot={{ r: 5, fill: '#6366F1', strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="net" name="Net" stroke="#10B981" strokeWidth={2} fill="url(#netGrad)" dot={false} activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} />
                            <Bar dataKey="refunded" name="Refunded" fill="#EF444420" stroke="#EF4444" strokeWidth={1} radius={[2, 2, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 18, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                        {[['#6366F1', 'MRR Collected'], ['#10B981', 'Net Revenue'], ['#EF4444', 'Refunds']].map(([c, l]) => (
                            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
                                {l}
                            </span>
                        ))}
                    </div>
                </Section>

                {/* Gateway split */}
                <Section title="Gateway Split" sub="Revenue by payment provider">
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={gwData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={4} dataKey="value" nameKey="name">
                                {gwData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} strokeWidth={0} />)}
                            </Pie>
                            <Tooltip formatter={v => fmtINR(v)} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 8 }}>
                        {gwData.map((g, i) => {
                            const total = gwData.reduce((s, x) => s + x.value, 0);
                            const pct = ((g.value / total) * 100).toFixed(1);
                            return (
                                <div key={g.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS[i], display: 'inline-block', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700, textTransform: 'capitalize' }}>{g.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>{pct}%</span>
                                        <span style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 800 }}>{fmtCom(g.value)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </div>

            {/* Plan breakdown + monthly bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="fup">

                {/* Plan breakdown */}
                <Section title="Plan-wise Breakdown" sub="Revenue contribution by subscription tier">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {planData.map(p => {
                            const totalRev = planData.reduce((s, x) => s + x.revenue, 0) || 1;
                            const pct = (p.revenue / totalRev * 100).toFixed(1);
                            return (
                                <div key={p.plan}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                            <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800, color: p.color, background: p.bg, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.label}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{p.txns} txns</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>{fmtINR(p.revenue)}</span>
                                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: 6 }}>{pct}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 8, borderRadius: 8, background: '#F1F5F9', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 8, background: p.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Plan pie */}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                        <ResponsiveContainer width="100%" height={130}>
                            <BarChart data={planData} layout="vertical" margin={{ top: 0, right: 12, left: 60, bottom: 0 }}>
                                <XAxis type="number" tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<DarkTooltip />} />
                                <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
                                    {planData.map((p, i) => <Cell key={i} fill={p.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Section>

                {/* Monthly bar chart */}
                <Section title="Monthly Collections" sub="Gross collected vs. failed revenue by month">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartMonths} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={3}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={46} />
                            <Tooltip content={<DarkTooltip />} />
                            <Bar dataKey="mrr" name="Collected" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                            <Bar dataKey="failed" name="Failed" fill="#FCA5A5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        </BarChart>
                    </ResponsiveContainer>
                </Section>
            </div>

            {/* School contribution table */}
            <div className="fup">
                <Section
                    title="School-wise Revenue Contribution"
                    sub="Ranked by total revenue collected"
                    action={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{schoolData.length} schools</span>
                        </div>
                    }
                >
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 1fr', gap: 0, paddingBottom: 10, borderBottom: '2px solid #F1F5F9', marginBottom: 4 }}>
                        {['School', 'Plan', 'Subscription', 'Gross Revenue', 'Refunded', 'Net Revenue'].map(h => (
                            <div key={h} style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px' }}>{h}</div>
                        ))}
                    </div>

                    {schoolData.map((s, i) => {
                        const sub = s.subscription;
                        const planCfg = PLAN_CFG[sub?.plan] || { label: '—', color: '#9CA3AF', bg: '#F3F4F6' };
                        const subCfg = STATUS_CFG[sub?.status] || {};
                        const totalNet = schoolData.reduce((acc, x) => acc + x.net, 0) || 1;
                        const share = (s.net / totalNet * 100).toFixed(1);

                        return (
                            <div key={s.school?.id} className="tr2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 1fr', gap: 0, borderBottom: i < schoolData.length - 1 ? '1px solid #F9FAFB' : 'none', transition: 'background 0.1s' }}>
                                {/* School */}
                                <div style={{ padding: '13px 8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: planCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: 800, color: planCfg.color }}>
                                            {s.school?.code}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{s.school?.name}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0', fontWeight: 500 }}>{s.school?.city} · {s.txns} txns</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan */}
                                <div style={{ padding: '13px 8px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800, color: planCfg.color, background: planCfg.bg, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{planCfg.label}</span>
                                </div>

                                {/* Sub status */}
                                <div style={{ padding: '13px 8px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, color: subCfg.color, background: subCfg.bg, border: `1px solid ${subCfg.color}20` }}>
                                        {subCfg.label}
                                    </span>
                                </div>

                                {/* Gross */}
                                <div style={{ padding: '13px 8px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>{fmtINR(s.revenue)}</span>
                                </div>

                                {/* Refunded */}
                                <div style={{ padding: '13px 8px', display: 'flex', alignItems: 'center' }}>
                                    {s.refunded > 0
                                        ? <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EF4444' }}>-{fmtINR(s.refunded)}</span>
                                        : <Minus size={14} color="#CBD5E1" />}
                                </div>

                                {/* Net + bar */}
                                <div style={{ padding: '13px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em' }}>{fmtINR(s.net)}</span>
                                    <div style={{ flex: 1, height: 6, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden', minWidth: 40 }}>
                                        <div style={{ height: '100%', borderRadius: 4, background: '#10B981', width: `${share}%` }} />
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{share}%</span>
                                </div>
                            </div>
                        );
                    })}
                </Section>
            </div>

            {/* Churn + Financial summary bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }} className="fup">

                {/* Churn */}
                <Section title="Subscription Health" sub="Active, trialing, at-risk, and churned schools">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {Object.entries(STATUS_CFG).map(([status, cfg]) => {
                            const count = SUBSCRIPTIONS.filter(s => s.status === status).length;
                            if (count === 0) return null;
                            const pct = (count / SUBSCRIPTIONS.length * 100).toFixed(0);
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: cfg.color, fontWeight: 700 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: 2, background: cfg.color, display: 'inline-block' }} />
                                            {cfg.label}
                                        </span>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>{count} school{count !== 1 ? 's' : ''} <span style={{ color: '#94A3B8', fontWeight: 600 }}>({pct}%)</span></span>
                                    </div>
                                    <div style={{ height: 8, borderRadius: 8, background: '#F1F5F9', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 8, background: cfg.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            );
                        }).filter(Boolean)}

                        <div style={{ marginTop: 12, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Churn Rate</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EF4444', margin: '4px 0 0', letterSpacing: '-0.03em' }}>{churnRate}%</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Churned / Total</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 0', letterSpacing: '-0.03em' }}>{churned} / {DATA.total}</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Financial summary */}
                <Section title="Financial Summary" sub="Overall P&L snapshot across all schools">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {[
                            { label: 'Gross Collected', value: totalCollected, color: '#10B981', sign: '+' },
                            { label: 'Refunds Issued', value: -totalRefunded, color: '#EF4444', sign: '-' },
                            { label: 'Failed (lost opp)', value: -totalFailed, color: '#F59E0B', sign: '↯' },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px dashed #F1F5F9' }}>
                                <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>{r.label}</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: r.color, letterSpacing: '-0.02em' }}>
                                    {r.sign === '+' ? '+' : ''}{fmtINR(Math.abs(r.value))}
                                </span>
                            </div>
                        ))}

                        {/* Net */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0', marginTop: 4 }}>
                            <span style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 800 }}>Net Revenue</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10B981', letterSpacing: '-0.03em' }}>{fmtINR(netRevenue)}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 9px', borderRadius: 20, background: '#ECFDF5', color: '#10B981', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #10B98120' }}>
                                    <ArrowUpRight size={11} strokeWidth={2.5} /> +8.2%
                                </span>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
}