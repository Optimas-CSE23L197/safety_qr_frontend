/**
 * PAYMENTS PAGE — Super Admin
 * Full transaction log mapped to Payment + Subscription + School models
 *
 * Payment fields used:
 *   id, school_id, subscription_id, amount (paise), currency, status,
 *   provider, provider_ref, failure_reason, metadata, created_at
 *
 * PaymentStatus enum: PENDING | SUCCESS | FAILED | REFUNDED
 * SubscriptionStatus: TRIALING | ACTIVE | PAST_DUE | CANCELED | EXPIRED
 */

import { useState, useMemo, useRef } from 'react';
import {
    CreditCard, Search, SlidersHorizontal, Download, Eye,
    RefreshCw, X, ChevronDown, Building2, Calendar,
    CheckCircle2, XCircle, Clock, RotateCcw, AlertTriangle,
    Receipt, IndianRupee, Copy, Check, ArrowUpRight,
    ArrowDownRight, Zap, FileText, MoreHorizontal, Filter,
    ChevronLeft, ChevronRight, BadgeAlert, Loader2, Send,
    ShieldCheck, Ban
} from 'lucide-react';

// ─── MOCK DATA (mirrors Prisma schema exactly) ──────────────────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International School', code: 'GWI', city: 'New Delhi', email: 'admin@greenwood.edu', phone: '+91-98100-11111' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA', city: 'Bengaluru', email: 'admin@sunrise.edu', phone: '+91-98200-22222' },
    { id: 'sch-003', name: 'Delhi Public School R3', code: 'DPS', city: 'New Delhi', email: 'admin@dpsr3.edu', phone: '+91-98300-33333' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC', city: 'Kolkata', email: 'admin@stmarys.edu', phone: '+91-98400-44444' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS', city: 'Pune', email: 'admin@modern.edu', phone: '+91-98500-55555' },
    { id: 'sch-006', name: 'The Heritage School', code: 'THS', city: 'Chennai', email: 'admin@heritage.edu', phone: '+91-98600-66666' },
];

const SUBSCRIPTIONS = [
    { id: 'sub-001', school_id: 'sch-001', status: 'ACTIVE', plan: 'growth', provider: 'razorpay', provider_sub_id: 'sub_Rz001', current_period_start: '2024-11-01', current_period_end: '2024-12-01' },
    { id: 'sub-002', school_id: 'sch-002', status: 'ACTIVE', plan: 'starter', provider: 'razorpay', provider_sub_id: 'sub_Rz002', current_period_start: '2024-11-05', current_period_end: '2024-12-05' },
    { id: 'sub-003', school_id: 'sch-003', status: 'PAST_DUE', plan: 'enterprise', provider: 'razorpay', provider_sub_id: 'sub_Rz003', current_period_start: '2024-10-01', current_period_end: '2024-11-01' },
    { id: 'sub-004', school_id: 'sch-004', status: 'TRIALING', plan: 'starter', provider: 'razorpay', provider_sub_id: 'sub_Rz004', current_period_start: '2024-11-15', current_period_end: '2024-12-15' },
    { id: 'sub-005', school_id: 'sch-005', status: 'CANCELED', plan: 'growth', provider: 'razorpay', provider_sub_id: 'sub_Rz005', current_period_start: '2024-09-01', current_period_end: '2024-10-01' },
    { id: 'sub-006', school_id: 'sch-006', status: 'ACTIVE', plan: 'enterprise', provider: 'stripe', provider_sub_id: 'sub_St006', current_period_start: '2024-11-10', current_period_end: '2024-12-10' },
];

const RAW_PAYMENTS = [
    { id: 'pay-001', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA001', failure_reason: null, created_at: '2024-11-01T10:23:00Z', metadata: { invoice: 'INV-2024-001', notes: 'Auto-debit' } },
    { id: 'pay-002', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA002', failure_reason: null, created_at: '2024-11-05T09:14:00Z', metadata: { invoice: 'INV-2024-002' } },
    { id: 'pay-003', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', provider_ref: 'pay_RzA003', failure_reason: 'Insufficient funds', created_at: '2024-11-01T11:00:00Z', metadata: null },
    { id: 'pay-004', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'PENDING', provider: 'razorpay', provider_ref: 'pay_RzA004', failure_reason: null, created_at: '2024-11-08T08:30:00Z', metadata: null },
    { id: 'pay-005', school_id: 'sch-004', subscription_id: 'sub-004', amount: 0, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA005', failure_reason: null, created_at: '2024-11-15T14:00:00Z', metadata: { notes: 'Trial period – no charge' } },
    { id: 'pay-006', school_id: 'sch-005', subscription_id: 'sub-005', amount: 499900, currency: 'INR', status: 'REFUNDED', provider: 'razorpay', provider_ref: 'pay_RzA006', failure_reason: null, created_at: '2024-10-01T12:00:00Z', metadata: { refund_reason: 'School closed operations', refund_ref: 'rfnd_001' } },
    { id: 'pay-007', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', provider_ref: 'ch_St3kP007', failure_reason: null, created_at: '2024-11-10T16:45:00Z', metadata: { invoice: 'INV-2024-007' } },
    { id: 'pay-008', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA008', failure_reason: null, created_at: '2024-10-01T10:20:00Z', metadata: { invoice: 'INV-2024-008' } },
    { id: 'pay-009', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA009', failure_reason: null, created_at: '2024-10-05T09:10:00Z', metadata: { invoice: 'INV-2024-009' } },
    { id: 'pay-010', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', provider_ref: 'ch_St3kP010', failure_reason: null, created_at: '2024-10-10T16:40:00Z', metadata: { invoice: 'INV-2024-010' } },
    { id: 'pay-011', school_id: 'sch-001', subscription_id: 'sub-001', amount: 499900, currency: 'INR', status: 'SUCCESS', provider: 'razorpay', provider_ref: 'pay_RzA011', failure_reason: null, created_at: '2024-09-01T10:18:00Z', metadata: { invoice: 'INV-2024-011' } },
    { id: 'pay-012', school_id: 'sch-003', subscription_id: 'sub-003', amount: 999900, currency: 'INR', status: 'FAILED', provider: 'razorpay', provider_ref: 'pay_RzA012', failure_reason: 'Card declined', created_at: '2024-10-01T11:30:00Z', metadata: { bank_error_code: 'CARD_DECLINED' } },
    { id: 'pay-013', school_id: 'sch-006', subscription_id: 'sub-006', amount: 1499900, currency: 'INR', status: 'SUCCESS', provider: 'stripe', provider_ref: 'ch_St3kP013', failure_reason: null, created_at: '2024-09-10T16:00:00Z', metadata: { invoice: 'INV-2024-013' } },
    { id: 'pay-014', school_id: 'sch-002', subscription_id: 'sub-002', amount: 199900, currency: 'INR', status: 'FAILED', provider: 'razorpay', provider_ref: 'pay_RzA014', failure_reason: 'UPI timeout', created_at: '2024-09-05T09:55:00Z', metadata: null },
    { id: 'pay-015', school_id: 'sch-004', subscription_id: 'sub-004', amount: 199900, currency: 'INR', status: 'PENDING', provider: 'razorpay', provider_ref: 'pay_RzA015', failure_reason: null, created_at: '2024-11-20T07:00:00Z', metadata: null },
];

// Enrich
const PAYMENTS = RAW_PAYMENTS.map(p => ({
    ...p,
    amountInr: p.amount / 100,
    school: SCHOOLS.find(s => s.id === p.school_id),
    subscription: SUBSCRIPTIONS.find(s => s.id === p.subscription_id),
})).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const PLAN_CFG = {
    starter: { label: 'Starter', color: '#10B981', bg: '#ECFDF5' },
    growth: { label: 'Growth', color: '#6366F1', bg: '#EEF2FF' },
    enterprise: { label: 'Enterprise', color: '#F59E0B', bg: '#FFFBEB' },
};
const PAY_STATUS = {
    SUCCESS: { label: 'Success', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle2 },
    FAILED: { label: 'Failed', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle },
    PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', Icon: Clock },
    REFUNDED: { label: 'Refunded', color: '#6366F1', bg: '#EEF2FF', Icon: RotateCcw },
};
const SUB_STATUS = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5' },
    TRIALING: { label: 'Trial', color: '#0EA5E9', bg: '#E0F2FE' },
    PAST_DUE: { label: 'Past Due', color: '#EF4444', bg: '#FEF2F2' },
    CANCELED: { label: 'Canceled', color: '#9CA3AF', bg: '#F3F4F6' },
    EXPIRED: { label: 'Expired', color: '#6B7280', bg: '#F9FAFB' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtINR = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = d => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const PAGE_SIZE = 8;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function StatusPill({ status, type = 'pay' }) {
    const cfg = type === 'pay' ? PAY_STATUS[status] : SUB_STATUS[status];
    if (!cfg) return null;
    const Icon = cfg.Icon;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.02em', color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}20`, whiteSpace: 'nowrap' }}>
            {Icon && <Icon size={10} strokeWidth={2.5} />}
            {cfg.label}
        </span>
    );
}

function PlanPill({ plan }) {
    const cfg = PLAN_CFG[plan] || { label: plan, color: '#6B7280', bg: '#F3F4F6' };
    return (
        <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800, color: cfg.color, background: cfg.bg, textTransform: 'uppercase', letterSpacing: '0.06em', border: `1px solid ${cfg.color}20` }}>
            {cfg.label}
        </span>
    );
}

function KpiTile({ label, value, sub, Icon, color, bg, delta, deltaDir }) {
    return (
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #E5E7EB', flex: 1, minWidth: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '1.55rem', fontWeight: 900, color: '#111827', margin: '7px 0 0', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                    {sub && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '5px 0 0', fontWeight: 500 }}>{sub}</p>}
                    {delta && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 7 }}>
                            {deltaDir === 'up' ? <ArrowUpRight size={12} color="#10B981" strokeWidth={3} /> : <ArrowDownRight size={12} color="#EF4444" strokeWidth={3} />}
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: deltaDir === 'up' ? '#10B981' : '#EF4444' }}>{delta}</span>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>vs last mo.</span>
                        </div>
                    )}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}>
                    <Icon size={20} color={color} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
}

// ─── DRAWER ──────────────────────────────────────────────────────────────────
function PaymentDrawer({ payment, onClose, onRetry, onRefund }) {
    const [copied, setCopied] = useState(null);
    const [actionState, setActionState] = useState(null); // 'retrying' | 'refunding' | null
    const [actionDone, setActionDone] = useState(null); // 'retried' | 'refunded' | null

    if (!payment) return null;
    const { school, subscription: sub } = payment;

    const copy = (text, key) => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
    };

    const doAction = async (type) => {
        setActionState(type);
        await new Promise(r => setTimeout(r, 1200));
        setActionState(null);
        setActionDone(type);
        if (type === 'retry') onRetry(payment.id);
        if (type === 'refund') onRefund(payment.id);
        setTimeout(() => setActionDone(null), 2000);
    };

    const subCfg = SUB_STATUS[sub?.status] || {};
    const planCfg = PLAN_CFG[sub?.plan] || {};

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 200, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ width: '100%', maxWidth: 480, background: '#fff', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}>

                {/* Dark header */}
                <div style={{ background: 'linear-gradient(160deg,#0F172A 0%,#1E293B 100%)', padding: '28px 28px 24px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Transaction Receipt</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                <code style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{payment.provider_ref}</code>
                                <button onClick={() => copy(payment.provider_ref, 'ref')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 2 }}>
                                    {copied === 'ref' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                                </button>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                            <X size={15} color="rgba(255,255,255,0.6)" />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            {payment.amountInr === 0 ? '—' : fmtINR(payment.amountInr)}
                        </span>
                        <StatusPill status={payment.status} />
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Date</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0' }}>{fmtDate(payment.created_at)} at {fmtTime(payment.created_at)}</p>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Gateway</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0', textTransform: 'capitalize' }}>{payment.provider}</p>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Currency</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0' }}>{payment.currency}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>

                    {/* School */}
                    <DrawerSection title="School">
                        <DrawerRow label="Name" value={school?.name} />
                        <DrawerRow label="Code" value={<code style={{ fontSize: '0.82rem', color: '#6366F1', fontWeight: 700 }}>{school?.code}</code>} />
                        <DrawerRow label="City" value={school?.city} />
                        <DrawerRow label="Email" value={school?.email} copyKey="email" copyVal={school?.email} copied={copied} onCopy={copy} />
                        <DrawerRow label="Phone" value={school?.phone} />
                    </DrawerSection>

                    {/* Subscription */}
                    <DrawerSection title="Subscription">
                        <DrawerRow label="Plan" value={<PlanPill plan={sub?.plan} />} />
                        <DrawerRow label="Status" value={<StatusPill status={sub?.status} type="sub" />} />
                        <DrawerRow label="Period" value={`${fmtDate(sub?.current_period_start)} → ${fmtDate(sub?.current_period_end)}`} />
                        <DrawerRow label="Sub ID" value={<code style={{ fontSize: '0.78rem', color: '#6366F1' }}>{sub?.provider_sub_id}</code>} copyKey="subid" copyVal={sub?.provider_sub_id} copied={copied} onCopy={copy} />
                    </DrawerSection>

                    {/* Failure */}
                    {payment.failure_reason && (
                        <div style={{ background: '#FEF2F2', borderRadius: 12, padding: '14px 16px', border: '1px solid #FCA5A5', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Failure Reason</p>
                                <p style={{ fontSize: '0.85rem', color: '#B91C1C', fontWeight: 600, margin: '4px 0 0' }}>{payment.failure_reason}</p>
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                        <DrawerSection title="Metadata">
                            {Object.entries(payment.metadata).map(([k, v]) => (
                                <DrawerRow key={k} label={k.replace(/_/g, ' ')} value={String(v)} />
                            ))}
                        </DrawerSection>
                    )}
                </div>

                {/* Actions */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Retry — only for FAILED */}
                    {payment.status === 'FAILED' && (
                        <ActionBtn
                            icon={actionDone === 'retry' ? Check : RefreshCw}
                            label={actionState === 'retrying' ? 'Retrying…' : actionDone === 'retry' ? 'Retry Queued!' : 'Retry Payment'}
                            color="#6366F1" bg="#EEF2FF"
                            loading={actionState === 'retrying'} done={actionDone === 'retry'}
                            onClick={() => doAction('retry')}
                        />
                    )}
                    {/* Refund — only for SUCCESS */}
                    {payment.status === 'SUCCESS' && payment.amountInr > 0 && (
                        <ActionBtn
                            icon={actionDone === 'refund' ? Check : RotateCcw}
                            label={actionState === 'refunding' ? 'Processing…' : actionDone === 'refund' ? 'Refund Initiated!' : 'Issue Refund'}
                            color="#F59E0B" bg="#FFFBEB"
                            loading={actionState === 'refunding'} done={actionDone === 'refund'}
                            onClick={() => doAction('refund')}
                        />
                    )}
                    {/* Download invoice — if metadata.invoice present */}
                    {payment.metadata?.invoice && (
                        <ActionBtn icon={Receipt} label={`Download ${payment.metadata.invoice}`} color="#10B981" bg="#ECFDF5" onClick={() => { }} />
                    )}
                    <button onClick={onClose} style={{ padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function DrawerSection({ title, children }) {
    return (
        <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px', paddingBottom: 8, borderBottom: '1px solid #F1F5F9' }}>{title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
        </div>
    );
}

function DrawerRow({ label, value, copyKey, copyVal, copied, onCopy }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0, textTransform: 'capitalize' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
                {copyKey && onCopy && (
                    <button onClick={() => onCopy(copyVal, copyKey)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#CBD5E1', display: 'flex', padding: 2 }}>
                        {copied === copyKey ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                )}
            </div>
        </div>
    );
}

function ActionBtn({ icon: Icon, label, color, bg, loading, done, onClick }) {
    return (
        <button onClick={onClick} disabled={loading || done} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px',
            borderRadius: 10, border: `1.5px solid ${color}30`, background: bg, color: color,
            fontSize: '0.83rem', fontWeight: 700, cursor: loading || done ? 'not-allowed' : 'pointer',
            opacity: loading || done ? 0.75 : 1, transition: 'all 0.15s'
        }}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Icon size={14} />}
            {label}
        </button>
    );
}

// ─── INVOICE EXPORT (CSV-like) ────────────────────────────────────────────────
function exportCSV(payments) {
    const header = ['ID', 'School', 'Plan', 'Amount (INR)', 'Status', 'Gateway', 'Provider Ref', 'Date'];
    const rows = payments.map(p => [
        p.id, p.school?.name || '', p.subscription?.plan || '',
        p.amountInr, p.status, p.provider, p.provider_ref,
        new Date(p.created_at).toISOString().slice(0, 10)
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'payments_export.csv'; a.click();
    URL.revokeObjectURL(url);
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('ALL');
    const [schoolF, setSchoolF] = useState('ALL');
    const [providerF, setProviderF] = useState('ALL');
    const [planF, setPlanF] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [payments, setPayments] = useState(PAYMENTS);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRetry = id => { setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'PENDING' } : p)); showToast('Payment queued for retry'); };
    const handleRefund = id => { setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'REFUNDED' } : p)); showToast('Refund initiated successfully'); };

    // KPIs
    const kpis = useMemo(() => {
        const s = payments.filter(p => p.status === 'SUCCESS');
        const f = payments.filter(p => p.status === 'FAILED');
        const r = payments.filter(p => p.status === 'REFUNDED');
        const pend = payments.filter(p => p.status === 'PENDING');
        return {
            totalCollected: s.reduce((a, p) => a + p.amountInr, 0),
            successCount: s.length,
            failedCount: f.length,
            refundedAmt: r.reduce((a, p) => a + p.amountInr, 0),
            pendingCount: pend.length,
        };
    }, [payments]);

    // Filter
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return payments.filter(p => {
            if (statusF !== 'ALL' && p.status !== statusF) return false;
            if (schoolF !== 'ALL' && p.school_id !== schoolF) return false;
            if (providerF !== 'ALL' && p.provider !== providerF) return false;
            if (planF !== 'ALL' && p.subscription?.plan !== planF) return false;
            if (q && !p.school?.name.toLowerCase().includes(q) &&
                !p.provider_ref?.toLowerCase().includes(q) &&
                !p.id.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [payments, search, statusF, schoolF, providerF, planF]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const activeFilters = [statusF !== 'ALL', schoolF !== 'ALL', providerF !== 'ALL', planF !== 'ALL'].filter(Boolean).length;
    const clearFilters = () => { setStatusF('ALL'); setSchoolF('ALL'); setProviderF('ALL'); setPlanF('ALL'); setPage(1); };

    const COLS = ['Ref ID', 'School', 'Plan', 'Amount', 'Status', 'Gateway', 'Date & Time', ''];
    const GRID = '1.4fr 1.7fr 0.8fr 1fr 0.9fr 0.8fr 1.1fr 0.4fr';

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto', fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
        @keyframes slideIn  { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes toastIn  { from { opacity:0; transform:translateY(16px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        .fade-up { animation: fadeUp 0.3s ease both; }
        .tr:hover { background:#F8FAFC !important; }
        input:focus, select:focus { border-color:#6366F1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.1) !important; }
      `}</style>

            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: toast.type === 'error' ? '#1E293B' : '#0F172A', color: '#fff', padding: '12px 22px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700, zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 9, animation: 'toastIn 0.25s ease', border: `1px solid ${toast.type === 'error' ? '#EF4444' : '#10B981'}40` }}>
                    {toast.type === 'error' ? <AlertTriangle size={14} color="#EF4444" /> : <CheckCircle2 size={14} color="#10B981" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26 }} className="fade-up">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                            <CreditCard size={18} color="#fff" strokeWidth={2} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>Payments</h1>
                            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>All transactions across every school subscription</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => exportCSV(filtered)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#fff', color: '#374151', border: '1.5px solid #E2E8F0', borderRadius: 11, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}>
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 22 }} className="fade-up">
                <KpiTile label="Total Collected" value={`₹${(kpis.totalCollected / 1000).toFixed(1)}k`} sub="Successful payments" Icon={IndianRupee} color="#10B981" bg="#ECFDF5" delta="+12%" deltaDir="up" />
                <KpiTile label="Transactions" value={kpis.successCount} sub="Successful" Icon={CheckCircle2} color="#6366F1" bg="#EEF2FF" delta="+3" deltaDir="up" />
                <KpiTile label="Failed" value={kpis.failedCount} sub="Need attention" Icon={XCircle} color="#EF4444" bg="#FEF2F2" />
                <KpiTile label="Pending" value={kpis.pendingCount} sub="Awaiting gateway" Icon={Clock} color="#F59E0B" bg="#FFFBEB" />
                <KpiTile label="Refunds Issued" value={fmtINR(kpis.refundedAmt)} sub="Total refunded" Icon={RotateCcw} color="#0EA5E9" bg="#E0F2FE" />
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '13px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fade-up">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search school name, provider ref, payment ID…"
                            style={{ width: '100%', padding: '9px 12px 9px 33px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'inherit', transition: 'all 0.15s' }} />
                    </div>

                    <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${showFilters || activeFilters ? '#6366F1' : '#E2E8F0'}`, background: showFilters || activeFilters ? '#EEF2FF' : '#F8FAFC', color: showFilters || activeFilters ? '#6366F1' : '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <SlidersHorizontal size={13} /> Filters
                        {activeFilters > 0 && <span style={{ background: '#6366F1', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: '0.66rem', fontWeight: 900 }}>{activeFilters}</span>}
                    </button>

                    <span style={{ fontSize: '0.77rem', color: '#94A3B8', fontWeight: 600, marginLeft: 'auto', flexShrink: 0 }}>
                        {filtered.length} records · {fmtINR(filtered.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amountInr, 0))} collected
                    </span>
                </div>

                {showFilters && (
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 12, paddingTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FG label="Status">
                            {['ALL', 'SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'].map(s => {
                                const cfg = s !== 'ALL' ? PAY_STATUS[s] : null;
                                return <FPill key={s} active={statusF === s} color={cfg?.color} bg={cfg?.bg} onClick={() => { setStatusF(s); setPage(1); }}>{s === 'ALL' ? 'All' : cfg.label}</FPill>;
                            })}
                        </FG>
                        <FG label="Plan">
                            {['ALL', 'starter', 'growth', 'enterprise'].map(p => {
                                const cfg = PLAN_CFG[p];
                                return <FPill key={p} active={planF === p} color={cfg?.color} bg={cfg?.bg} onClick={() => { setPlanF(p); setPage(1); }}>{p === 'ALL' ? 'All Plans' : cfg.label}</FPill>;
                            })}
                        </FG>
                        <FG label="School">
                            <FSel value={schoolF} onChange={e => { setSchoolF(e.target.value); setPage(1); }} active={schoolF !== 'ALL'}>
                                <option value="ALL">All Schools</option>
                                {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </FSel>
                        </FG>
                        <FG label="Gateway">
                            {['ALL', 'razorpay', 'stripe'].map(p => <FPill key={p} active={providerF === p} onClick={() => { setProviderF(p); setPage(1); }}>{p === 'ALL' ? 'All' : <span style={{ textTransform: 'capitalize' }}>{p}</span>}</FPill>)}
                        </FG>
                        {activeFilters > 0 && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', marginLeft: 'auto' }}><X size={10} />Clear All</button>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }} className="fade-up">
                {/* Head */}
                <div style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                    {COLS.map(c => <div key={c} style={{ padding: '11px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>)}
                </div>

                {paginated.length === 0
                    ? <Empty />
                    : paginated.map((p, i) => (
                        <div key={p.id} className="tr" style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', borderBottom: i < paginated.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                            onClick={() => setSelected(p)}>
                            <div style={{ padding: '13px 8px' }}>
                                <code style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366F1' }}>{p.provider_ref}</code>
                            </div>
                            <div style={{ padding: '13px 8px' }}>
                                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.school?.name}</p>
                                <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0', fontWeight: 500 }}>{p.school?.code} · {p.school?.city}</p>
                            </div>
                            <div style={{ padding: '13px 8px' }}><PlanPill plan={p.subscription?.plan} /></div>
                            <div style={{ padding: '13px 8px' }}>
                                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: p.status === 'FAILED' ? '#EF4444' : p.status === 'REFUNDED' ? '#6366F1' : '#0F172A', letterSpacing: '-0.02em' }}>
                                    {p.amountInr === 0 ? <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 600 }}>Trial</span> : fmtINR(p.amountInr)}
                                </span>
                            </div>
                            <div style={{ padding: '13px 8px' }}><StatusPill status={p.status} /></div>
                            <div style={{ padding: '13px 8px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'capitalize' }}>{p.provider}</span>
                            </div>
                            <div style={{ padding: '13px 8px' }}>
                                <p style={{ fontSize: '0.78rem', color: '#374151', margin: 0, fontWeight: 600 }}>{fmtDate(p.created_at)}</p>
                                <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0' }}>{fmtTime(p.created_at)}</p>
                            </div>
                            <div style={{ padding: '13px 8px', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={e => { e.stopPropagation(); setSelected(p); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 7px', cursor: 'pointer', display: 'flex', color: '#64748B', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6366F1'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                                    <Eye size={13} />
                                </button>
                            </div>
                        </div>
                    ))}

                {/* Pagination */}
                {filtered.length > PAGE_SIZE && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></PageBtn>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <PageBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PageBtn>
                            ))}
                            <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></PageBtn>
                        </div>
                    </div>
                )}
            </div>

            {selected && (
                <PaymentDrawer
                    payment={payments.find(p => p.id === selected.id) || selected}
                    onClose={() => setSelected(null)}
                    onRetry={handleRetry}
                    onRefund={handleRefund}
                />
            )}
        </div>
    );
}

// ─── Mini helpers ─────────────────────────────────────────────────────────────
function Empty() {
    return (
        <div style={{ padding: '56px 20px', textAlign: 'center', color: '#94A3B8' }}>
            <Receipt size={36} strokeWidth={1} style={{ marginBottom: 10, opacity: 0.35 }} />
            <p style={{ fontWeight: 800, fontSize: '0.9rem', margin: 0, color: '#64748B' }}>No transactions found</p>
            <p style={{ fontSize: '0.8rem', margin: '5px 0 0' }}>Adjust your filters or search.</p>
        </div>
    );
}
function FG({ label, children }) {
    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 2 }}>{label}:</span>
            {children}
        </div>
    );
}
function FPill({ active, color = '#6366F1', bg = '#EEF2FF', onClick, children }) {
    return <button onClick={onClick} style={{ padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${active ? color : '#E2E8F0'}`, background: active ? bg : '#fff', color: active ? color : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}>{children}</button>;
}
function FSel({ value, onChange, active, children }) {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value} onChange={onChange} style={{ padding: '4px 24px 4px 12px', borderRadius: 20, border: `1.5px solid ${active ? '#6366F1' : '#E2E8F0'}`, background: active ? '#EEF2FF' : '#fff', color: active ? '#6366F1' : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', appearance: 'none', outline: 'none', fontFamily: 'inherit' }}>{children}</select>
            <ChevronDown size={10} color={active ? '#6366F1' : '#94A3B8'} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
    );
}
function PageBtn({ onClick, disabled, active, children }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1.5px solid ${active ? '#6366F1' : '#E2E8F0'}`, background: active ? '#6366F1' : '#fff', color: active ? '#fff' : '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
            {children}
        </button>
    );
}