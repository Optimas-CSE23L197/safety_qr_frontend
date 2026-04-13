/**
 * REVENUE PAGE — Super Admin Analytics
 * Driven by: Payment + Subscription + School models
 *
 * Covers:
 *  - MRR / ARR over time
 *  - Net Revenue (collected − refunded)
 *  - Plan-wise breakdown (BASIC/PREMIUM/CUSTOM)
 *  - School-wise contribution table
 *  - Churn analysis (CANCELED + EXPIRED subscriptions)
 *  - Refunds and failed payment loss
 */

import { useState, useMemo } from 'react';
import {
    TrendingUp, IndianRupee, BarChart3, Users, ArrowUpRight,
    ArrowDownRight, Building2, ChevronDown, Download, Info,
    Zap, RotateCcw, XCircle, ShieldOff, Award, Minus,
    BadgeCheck, Activity, PieChart as PieIcon, DollarSign,
    Calendar, Target, AlertOctagon, CheckCircle, Clock,
    Landmark, Wallet, Coins, Banknote, Hash
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';

// ─── MOCK DATA (exact schema shape with BASIC/PREMIUM/CUSTOM) ────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International School', code: 'GWI-2024-001', city: 'New Delhi' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA-2024-002', city: 'Bengaluru' },
    { id: 'sch-003', name: 'Delhi Public School', code: 'DPS-2024-003', city: 'New Delhi' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC-2024-004', city: 'Kolkata' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS-2024-005', city: 'Pune' },
    { id: 'sch-006', name: 'The Heritage School', code: 'THS-2024-006', city: 'Chennai' },
];

const SUBSCRIPTIONS = [
    { id: 'sub-001', school_id: 'sch-001', status: 'ACTIVE', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 450, grand_total: 8955000 },
    { id: 'sub-002', school_id: 'sch-002', status: 'ACTIVE', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 320, grand_total: 4768000 },
    { id: 'sub-003', school_id: 'sch-003', status: 'PAST_DUE', plan: 'CUSTOM', unit_price_snapshot: 17500, student_count: 780, grand_total: 13650000 },
    { id: 'sub-004', school_id: 'sch-004', status: 'TRIALING', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 150, grand_total: 2235000 },
    { id: 'sub-005', school_id: 'sch-005', status: 'CANCELED', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 280, grand_total: 5572000 },
    { id: 'sub-006', school_id: 'sch-006', status: 'ACTIVE', plan: 'CUSTOM', unit_price_snapshot: 18900, student_count: 620, grand_total: 11718000 },
];

// amount in paise
const ALL_PAYMENTS = [
    { id: 'p01', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-04-01' },
    { id: 'p02', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'UPI', created_at: '2024-04-05' },
    { id: 'p03', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-04-10' },
    { id: 'p04', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-05-01' },
    { id: 'p05', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'CHEQUE', created_at: '2024-05-05' },
    { id: 'p06', school_id: 'sch-003', subscription_id: 'sub-003', amount: 6825000, currency: 'INR', status: 'FAILED', payment_mode: 'BANK_TRANSFER', created_at: '2024-05-01' },
    { id: 'p07', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'UPI', created_at: '2024-05-10' },
    { id: 'p08', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-06-01' },
    { id: 'p09', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'CASH', created_at: '2024-06-05' },
    { id: 'p10', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-06-10' },
    { id: 'p11', school_id: 'sch-003', subscription_id: 'sub-003', amount: 6825000, currency: 'INR', status: 'FAILED', payment_mode: 'UPI', created_at: '2024-07-01' },
    { id: 'p12', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'CHEQUE', created_at: '2024-07-01' },
    { id: 'p13', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-07-05' },
    { id: 'p14', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-07-10' },
    { id: 'p15', school_id: 'sch-005', subscription_id: 'sub-005', amount: 5572000, currency: 'INR', status: 'REFUNDED', payment_mode: 'BANK_TRANSFER', created_at: '2024-07-15' },
    { id: 'p16', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-08-01' },
    { id: 'p17', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'UPI', created_at: '2024-08-05' },
    { id: 'p18', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-08-10' },
    { id: 'p19', school_id: 'sch-003', subscription_id: 'sub-003', amount: 6825000, currency: 'INR', status: 'FAILED', payment_mode: 'BANK_TRANSFER', created_at: '2024-09-01' },
    { id: 'p20', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-09-01' },
    { id: 'p21', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'CHEQUE', created_at: '2024-09-05' },
    { id: 'p22', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-09-10' },
    { id: 'p23', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'CASH', created_at: '2024-10-01' },
    { id: 'p24', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-10-05' },
    { id: 'p25', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'UPI', created_at: '2024-10-10' },
    { id: 'p26', school_id: 'sch-003', subscription_id: 'sub-003', amount: 6825000, currency: 'INR', status: 'FAILED', payment_mode: 'BANK_TRANSFER', created_at: '2024-10-01' },
    { id: 'p27', school_id: 'sch-001', subscription_id: 'sub-001', amount: 4477500, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-11-01' },
    { id: 'p28', school_id: 'sch-002', subscription_id: 'sub-002', amount: 2384000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-11-05' },
    { id: 'p29', school_id: 'sch-006', subscription_id: 'sub-006', amount: 5859000, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-11-10' },
    { id: 'p30', school_id: 'sch-003', subscription_id: 'sub-003', amount: 6825000, currency: 'INR', status: 'PENDING', payment_mode: 'CHEQUE', created_at: '2024-11-08' },
    { id: 'p31', school_id: 'sch-004', subscription_id: 'sub-004', amount: 0, currency: 'INR', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', created_at: '2024-11-15' },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

// ─── CONFIG (UPDATED FOR BASIC/PREMIUM/CUSTOM) ────────────────────────────────
const PLAN_CFG = {
    BASIC: { label: 'Basic', color: '#10B981', bg: '#ECFDF5', price: 149, unit: 'per card/year' },
    PREMIUM: { label: 'Premium', color: '#6366F1', bg: '#EEF2FF', price: 199, unit: 'per card/year' },
    CUSTOM: { label: 'Custom', color: '#F59E0B', bg: '#FFFBEB', price: null, unit: 'custom pricing' },
};

const PAYMENT_MODE_CFG = {
    BANK_TRANSFER: { label: 'Bank Transfer', icon: Landmark, color: '#2563EB', bg: '#EFF6FF' },
    UPI: { label: 'UPI', icon: Wallet, color: '#7C3AED', bg: '#F5F3FF' },
    CHEQUE: { label: 'Cheque', icon: Coins, color: '#D97706', bg: '#FFFBEB' },
    CASH: { label: 'Cash', icon: Banknote, color: '#059669', bg: '#ECFDF5' },
};

const STATUS_CFG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle },
    TRIALING: { label: 'Trial', color: '#0EA5E9', bg: '#E0F2FE', Icon: Clock },
    PAST_DUE: { label: 'Past Due', color: '#EF4444', bg: '#FEF2F2', Icon: AlertOctagon },
    CANCELED: { label: 'Canceled', color: '#9CA3AF', bg: '#F3F4F6', Icon: XCircle },
    EXPIRED: { label: 'Expired', color: '#6B7280', bg: '#F9FAFB', Icon: XCircle },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtINR = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtCompact = n => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;
const mo = d => d.slice(0, 7);
const moLabel = m => { const [y, mm] = m.split('-'); return MONTHS[+mm - 1] || m; };

// ─── ANALYTICS COMPUTATION ───────────────────────────────────────────────────
function computeAnalytics() {
    const payments = ALL_PAYMENTS.map(p => ({
        ...p,
        amountInr: p.amount / 100,
        school: SCHOOLS.find(s => s.id === p.school_id),
        subscription: SUBSCRIPTIONS.find(s => s.id === p.subscription_id)
    }));

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
    const planMap = { BASIC: 0, PREMIUM: 0, CUSTOM: 0 };
    const planCountMap = { BASIC: 0, PREMIUM: 0, CUSTOM: 0 };
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

    // Payment mode split
    const modeMap = {};
    payments.filter(p => p.status === 'SUCCESS' && p.amountInr > 0).forEach(p => {
        modeMap[p.payment_mode] = (modeMap[p.payment_mode] || 0) + p.amountInr;
    });
    const modeData = Object.entries(modeMap).map(([name, value]) => ({ name, value, ...PAYMENT_MODE_CFG[name] }));

    // Growth metrics
    const growthRate = mrrData.length >= 2 ? (((mrrData[mrrData.length - 1].mrr - mrrData[mrrData.length - 2].mrr) / mrrData[mrrData.length - 2].mrr) * 100).toFixed(1) : 0;

    return { mrrData, currentMRR, mrrDelta, planData, schoolData, churned, churnRate, total, totalCollected, totalRefunded, totalFailed, netRevenue, modeData, growthRate };
}

const DATA = computeAnalytics();
const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#EF4444', '#8B5CF6'];

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#0F172A', borderRadius: 12, padding: '12px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '4px 0', fontSize: '0.82rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ color: p.color || '#fff' }}>{typeof p.value === 'number' && p.value > 100 ? fmtINR(p.value) : p.value}</span>
                </p>
            ))}
        </div>
    );
}

// ─── KPI CARD (Premium) ──────────────────────────────────────────────────────
function KpiCard({ label, value, sub, Icon, color, bg, badge, badgeColor, badgeBg, delta, dir, trend }) {
    return (
        <div style={{ background: '#fff', borderRadius: 20, padding: '22px 24px', border: '1px solid #E5E7EB', flex: 1, minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 100, height: 100, borderRadius: '50%', background: bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 4px', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                    {sub && <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, fontWeight: 500 }}>{sub}</p>}
                    {delta && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                            {dir === 'up' ? <ArrowUpRight size={13} color="#10B981" strokeWidth={2.5} /> : <ArrowDownRight size={13} color="#EF4444" strokeWidth={2.5} />}
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: dir === 'up' ? '#10B981' : '#EF4444' }}>{delta}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>vs prev month</span>
                        </div>
                    )}
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12, position: 'relative', zIndex: 1 }}>
                    <Icon size={24} color={color} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ title, sub, children, action, icon: Icon }) {
    return (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {Icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color="#64748B" /></div>}
                    <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h3>
                        {sub && <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '3px 0 0', fontWeight: 500 }}>{sub}</p>}
                    </div>
                </div>
                {action}
            </div>
            <div style={{ padding: '20px 24px' }}>{children}</div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RevenuePage() {
    const [period, setPeriod] = useState('6m');
    const { mrrData, currentMRR, mrrDelta, planData, schoolData, churned, churnRate, totalCollected, totalRefunded, totalFailed, netRevenue, modeData, growthRate } = DATA;

    const chartMonths = period === '3m' ? mrrData.slice(-3) : period === '6m' ? mrrData.slice(-6) : mrrData;
    const projectedARR = currentMRR * 12;

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1440, margin: '0 auto', fontFamily: "'Inter','IBM Plex Sans',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fup { animation: fadeUp 0.4s ease forwards; }
        .fup:nth-child(1) { animation-delay:0s; }
        .fup:nth-child(2) { animation-delay:0.05s; }
        .fup:nth-child(3) { animation-delay:0.10s; }
        .fup:nth-child(4) { animation-delay:0.15s; }
        .tr-hover:hover { background: #F8FAFC !important; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }} className="fup">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#10B981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
                            <TrendingUp size={24} color="#fff" strokeWidth={2} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Revenue Analytics</h1>
                            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0', fontWeight: 500 }}>Real-time financial metrics, MRR trends, and school-level contribution</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, background: '#F1F5F9', borderRadius: 14, padding: 4 }}>
                    {[
                        { key: '3m', label: '3 Months' },
                        { key: '6m', label: '6 Months' },
                        { key: 'all', label: 'All Time' }
                    ].map(p => (
                        <button
                            key={p.key}
                            onClick={() => setPeriod(p.key)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: 10,
                                border: 'none',
                                cursor: 'pointer',
                                background: period === p.key ? '#fff' : 'transparent',
                                color: period === p.key ? '#0F172A' : '#64748B',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                boxShadow: period === p.key ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.15s'
                            }}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Row - 5 Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 24 }} className="fup">
                <KpiCard
                    label="Monthly Recurring Revenue"
                    value={fmtCompact(currentMRR)}
                    sub="Current month"
                    Icon={DollarSign}
                    color="#10B981"
                    bg="#ECFDF5"
                    delta={`${mrrDelta > 0 ? '+' : ''}${mrrDelta}%`}
                    dir={mrrDelta >= 0 ? 'up' : 'down'}
                />
                <KpiCard
                    label="Annual Run Rate"
                    value={fmtCompact(projectedARR)}
                    sub="Projected annual revenue"
                    Icon={TrendingUp}
                    color="#6366F1"
                    bg="#EEF2FF"
                    delta={`+${growthRate}%`}
                    dir="up"
                />
                <KpiCard
                    label="Net Revenue"
                    value={fmtCompact(netRevenue)}
                    sub="After refunds"
                    Icon={BarChart3}
                    color="#0EA5E9"
                    bg="#E0F2FE"
                />
                <KpiCard
                    label="Refunded Amount"
                    value={fmtCompact(totalRefunded)}
                    sub="Total issued back"
                    Icon={RotateCcw}
                    color="#F59E0B"
                    bg="#FFFBEB"
                />
                <KpiCard
                    label="Churn Rate"
                    value={`${churnRate}%`}
                    sub={`${churned} of ${DATA.total} schools`}
                    Icon={AlertOctagon}
                    color="#EF4444"
                    bg="#FEF2F2"
                />
            </div>

            {/* Secondary Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }} className="fup">
                <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XCircle size={20} color="#EF4444" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', margin: 0 }}>Failed Payments</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#EF4444', margin: '2px 0 0' }}>{fmtCompact(totalFailed)}</p>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} color="#10B981" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', margin: 0 }}>Active Schools</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10B981', margin: '2px 0 0' }}>{SUBSCRIPTIONS.filter(s => s.status === 'ACTIVE').length}</p>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={20} color="#F59E0B" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', margin: 0 }}>Avg. Revenue/School</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F59E0B', margin: '2px 0 0' }}>{fmtCompact(netRevenue / (SUBSCRIPTIONS.filter(s => s.status === 'ACTIVE').length || 1))}</p>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={20} color="#6366F1" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', margin: 0 }}>Avg. Payment Size</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6366F1', margin: '2px 0 0' }}>
                            {fmtCompact(ALL_PAYMENTS.filter(p => p.status === 'SUCCESS' && p.amount > 0).reduce((s, p) => s + p.amount, 0) / ALL_PAYMENTS.filter(p => p.status === 'SUCCESS' && p.amount > 0).length / 100)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }} className="fup">
                <Section title="Revenue Trend" sub="MRR collected vs. net revenue after refunds" icon={TrendingUp}>
                    <ResponsiveContainer width="100%" height={280}>
                        <ComposedChart data={chartMonths} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={50} />
                            <Tooltip content={<DarkTooltip />} />
                            <Area type="monotone" dataKey="mrr" name="Gross MRR" stroke="#6366F1" strokeWidth={3} fill="url(#mrrGrad)" dot={false} activeDot={{ r: 6, fill: '#6366F1', strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="net" name="Net Revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#netGrad)" dot={false} activeDot={{ r: 5, fill: '#10B981', strokeWidth: 0 }} />
                            <Bar dataKey="refunded" name="Refunds" fill="#EF444420" stroke="#EF4444" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                        {[
                            ['#6366F1', 'Gross MRR', 'Total collected revenue'],
                            ['#10B981', 'Net Revenue', 'After refunds'],
                            ['#EF4444', 'Refunds', 'Issued back to schools']
                        ].map(([c, l, desc]) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 12, height: 12, borderRadius: 3, background: c, display: 'inline-block' }} />
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B' }}>{l}</span>
                                    <p style={{ fontSize: '0.65rem', color: '#94A3B8', margin: 0 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Payment Mode Split */}
                <Section title="Payment Methods" sub="Revenue by payment mode" icon={Wallet}>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={modeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="label">
                                {modeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />)}
                            </Pie>
                            <Tooltip formatter={v => fmtINR(v)} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                        {modeData.map((m, i) => {
                            const total = modeData.reduce((s, x) => s + x.value, 0);
                            const pct = ((m.value / total) * 100).toFixed(1);
                            const Icon = m.icon || Wallet;
                            return (
                                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={14} color={m.color} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{m.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{pct}%</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{fmtCompact(m.value)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </div>

            {/* Plan Breakdown + Monthly Collections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="fup">
                <Section title="Plan Performance" sub="Revenue by subscription tier" icon={Award}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {planData.map(p => {
                            const totalRev = planData.reduce((s, x) => s + x.revenue, 0) || 1;
                            const pct = (p.revenue / totalRev * 100).toFixed(1);
                            return (
                                <div key={p.plan}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, color: p.color, background: p.bg, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.label}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{p.txns} transactions</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A' }}>{fmtCompact(p.revenue)}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginLeft: 8 }}>({pct}%)</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 10, borderRadius: 10, background: '#F1F5F9', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 10, background: p.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Per-Card Pricing</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Annual Value</span>
                        </div>
                        {planData.map(p => (
                            <div key={p.plan} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                                <span style={{ fontSize: '0.75rem', color: p.color, fontWeight: 600 }}>{p.label}: {p.price ? `₹${p.price}/card` : p.unit}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E293B' }}>{fmtCompact(p.revenue)}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Monthly Collection Trends" sub="Gross vs. failed payments by month" icon={BarChart3}>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartMonths} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={50} />
                            <Tooltip content={<DarkTooltip />} />
                            <Bar dataKey="mrr" name="Collected" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="failed" name="Failed" fill="#FCA5A5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 12, padding: '12px 16px', background: '#F8FAFC', borderRadius: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Failed Payment Rate</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444' }}>
                                {((DATA.totalFailed / (DATA.totalCollected + DATA.totalFailed)) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div style={{ height: 6, borderRadius: 6, background: '#F1F5F9', marginTop: 8, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 6, background: '#EF4444', width: `${(DATA.totalFailed / (DATA.totalCollected + DATA.totalFailed)) * 100}%` }} />
                        </div>
                    </div>
                </Section>
            </div>

            {/* School Contribution Table */}
            <div className="fup">
                <Section
                    title="School Performance"
                    sub="Ranked by total revenue contribution"
                    icon={Building2}
                    action={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, background: '#F1F5F9', padding: '4px 10px', borderRadius: 20 }}>
                                {schoolData.length} active schools
                            </span>
                        </div>
                    }
                >
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: 900 }}>
                            {/* Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1fr 1fr 1.2fr', gap: 12, paddingBottom: 12, borderBottom: '2px solid #F1F5F9', marginBottom: 8 }}>
                                {['School', 'Plan', 'Status', 'Gross Revenue', 'Refunded', 'Net Revenue'].map(h => (
                                    <div key={h} style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 0' }}>{h}</div>
                                ))}
                            </div>

                            {/* Rows */}
                            {schoolData.map((s, i) => {
                                const sub = s.subscription;
                                const planCfg = PLAN_CFG[sub?.plan] || { label: '—', color: '#9CA3AF', bg: '#F3F4F6' };
                                const statusCfg = STATUS_CFG[sub?.status] || { label: '—', color: '#9CA3AF', bg: '#F3F4F6' };
                                const StatusIcon = statusCfg.Icon;
                                const totalNet = schoolData.reduce((acc, x) => acc + x.net, 0) || 1;
                                const share = (s.net / totalNet * 100).toFixed(1);

                                return (
                                    <div key={s.school?.id} className="tr-hover" style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1fr 1fr 1.2fr', gap: 12, borderBottom: i < schoolData.length - 1 ? '1px solid #F9FAFB' : 'none', padding: '12px 0', transition: 'background 0.15s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: planCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Building2 size={16} color={planCfg.color} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{s.school?.name}</p>
                                                <p style={{ fontSize: '0.65rem', color: '#94A3B8', margin: '2px 0 0', fontWeight: 500 }}><Hash size={9} style={{ display: 'inline' }} /> {s.school?.code} · {s.txns} payments</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800, color: planCfg.color, background: planCfg.bg, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{planCfg.label}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, color: statusCfg.color, background: statusCfg.bg }}>
                                                <StatusIcon size={9} /> {statusCfg.label}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{fmtCompact(s.revenue)}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {s.refunded > 0
                                                ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EF4444' }}>-{fmtCompact(s.refunded)}</span>
                                                : <span style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>—</span>}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#10B981' }}>{fmtCompact(s.net)}</span>
                                            <div style={{ flex: 1, height: 6, borderRadius: 6, background: '#F1F5F9', overflow: 'hidden', minWidth: 50 }}>
                                                <div style={{ height: '100%', borderRadius: 6, background: '#10B981', width: `${share}%` }} />
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, minWidth: 40 }}>{share}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Section>
            </div>

            {/* Footer: Subscription Health + Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }} className="fup">
                <Section title="Subscription Health" sub="Active, trialing, at-risk, and churned schools" icon={Activity}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {Object.entries(STATUS_CFG).map(([status, cfg]) => {
                            const count = SUBSCRIPTIONS.filter(s => s.status === status).length;
                            if (count === 0) return null;
                            const pct = (count / SUBSCRIPTIONS.length * 100).toFixed(0);
                            const Icon = cfg.Icon;
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: cfg.color, fontWeight: 700 }}>
                                            <Icon size={12} /> {cfg.label}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>{count} <span style={{ color: '#94A3B8', fontWeight: 600 }}>({pct}%)</span></span>
                                    </div>
                                    <div style={{ height: 8, borderRadius: 8, background: '#F1F5F9', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 8, background: cfg.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            );
                        }).filter(Boolean)}

                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Churn Rate</p>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{churnRate}%</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Churned / Total</p>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{churned} / {DATA.total}</p>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section title="Financial Summary" sub="Overall P&L snapshot across all schools" icon={DollarSign}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {[
                            { label: 'Gross Revenue', value: totalCollected, color: '#10B981', icon: TrendingUp },
                            { label: 'Refunds Issued', value: -totalRefunded, color: '#EF4444', icon: RotateCcw },
                            { label: 'Failed Payments', value: -totalFailed, color: '#F59E0B', icon: XCircle },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px dashed #F1F5F9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${r.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <r.icon size={14} color={r.color} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{r.label}</span>
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: r.color, letterSpacing: '-0.02em' }}>
                                    {r.value > 0 ? '+' : ''}{fmtCompact(Math.abs(r.value))}
                                </span>
                            </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0 8px', marginTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10B98120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BadgeCheck size={18} color="#10B981" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 800 }}>Net Revenue</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981', letterSpacing: '-0.03em' }}>{fmtCompact(netRevenue)}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, background: '#ECFDF5', color: '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>
                                    <ArrowUpRight size={11} /> +{growthRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
}
