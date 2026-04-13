/**
 * PAYMENTS PAGE — Super Admin
 * Full transaction log mapped to Payment + Invoice + Subscription + School models
 *
 * Payment fields from schema:
 *   id, school_id, invoice_id, order_id, subscription_id, amount (paise),
 *   payment_ref, status, payment_mode, recorded_by, notes, metadata, created_at, updated_at
 *
 * PaymentStatus: PENDING | SUCCESS | FAILED | REFUNDED
 * PaymentMode: BANK_TRANSFER | UPI | CHEQUE | CASH
 * SubscriptionStatus: TRIALING | ACTIVE | PAST_DUE | CANCELED | EXPIRED
 * PlanType: BASIC | PREMIUM | CUSTOM
 */

import { useState, useMemo, useRef } from 'react';
import {
    CreditCard, Search, SlidersHorizontal, Download, Eye,
    RefreshCw, X, ChevronDown, Building2, Calendar,
    CheckCircle2, XCircle, Clock, RotateCcw, AlertTriangle,
    Receipt, IndianRupee, Copy, Check, ArrowUpRight,
    ArrowDownRight, Zap, FileText, MoreHorizontal, Filter,
    ChevronLeft, ChevronRight, BadgeAlert, Loader2, Send,
    ShieldCheck, Ban, Banknote, Landmark, Wallet, Coins,
    Hash, UserCheck
} from 'lucide-react';

// ─── MOCK DATA (mirrors Prisma schema exactly) ──────────────────────────────
const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International School', code: 'GWI-2024-001', city: 'New Delhi', email: 'admin@greenwood.edu', phone: '+91-98100-11111' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA-2024-002', city: 'Bengaluru', email: 'admin@sunrise.edu', phone: '+91-98200-22222' },
    { id: 'sch-003', name: 'Delhi Public School', code: 'DPS-2024-003', city: 'New Delhi', email: 'admin@dps.edu', phone: '+91-98300-33333' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC-2024-004', city: 'Kolkata', email: 'admin@stmarys.edu', phone: '+91-98400-44444' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS-2024-005', city: 'Pune', email: 'admin@modern.edu', phone: '+91-98500-55555' },
    { id: 'sch-006', name: 'The Heritage School', code: 'THS-2024-006', city: 'Chennai', email: 'admin@heritage.edu', phone: '+91-98600-66666' },
];

const SUBSCRIPTIONS = [
    { id: 'sub-001', school_id: 'sch-001', status: 'ACTIVE', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 450, grand_total: 8955000, current_period_end: '2025-11-01' },
    { id: 'sub-002', school_id: 'sch-002', status: 'ACTIVE', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 320, grand_total: 4768000, current_period_end: '2025-11-05' },
    { id: 'sub-003', school_id: 'sch-003', status: 'PAST_DUE', plan: 'CUSTOM', unit_price_snapshot: 17500, student_count: 780, grand_total: 13650000, current_period_end: '2024-11-01' },
    { id: 'sub-004', school_id: 'sch-004', status: 'TRIALING', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 150, grand_total: 2235000, current_period_end: '2024-12-15' },
    { id: 'sub-005', school_id: 'sch-005', status: 'CANCELED', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 280, grand_total: 5572000, current_period_end: '2024-10-01' },
    { id: 'sub-006', school_id: 'sch-006', status: 'ACTIVE', plan: 'CUSTOM', unit_price_snapshot: 18900, student_count: 620, grand_total: 11718000, current_period_end: '2025-11-10' },
];

const INVOICES = [
    { id: 'inv-001', invoice_number: 'INV-2024-001', invoice_type: 'ORDER_ADVANCE', total_amount: 2499500, status: 'PAID' },
    { id: 'inv-002', invoice_number: 'INV-2024-002', invoice_type: 'ORDER_ADVANCE', total_amount: 1192000, status: 'PAID' },
    { id: 'inv-003', invoice_number: 'INV-2024-003', invoice_type: 'ORDER_ADVANCE', total_amount: 6825000, status: 'ISSUED' },
    { id: 'inv-004', invoice_number: 'INV-2024-004', invoice_type: 'ORDER_ADVANCE', total_amount: 0, status: 'PAID' },
    { id: 'inv-005', invoice_number: 'INV-2024-005', invoice_type: 'RENEWAL', total_amount: 5572000, status: 'REFUNDED' },
    { id: 'inv-006', invoice_number: 'INV-2024-006', invoice_type: 'ORDER_ADVANCE', total_amount: 5859000, status: 'PAID' },
    { id: 'inv-007', invoice_number: 'INV-2024-007', invoice_type: 'ORDER_FINAL', total_amount: 2499500, status: 'PAID' },
    { id: 'inv-008', invoice_number: 'INV-2024-008', invoice_type: 'ORDER_ADVANCE', total_amount: 2499500, status: 'PAID' },
    { id: 'inv-009', invoice_number: 'INV-2024-009', invoice_type: 'ORDER_ADVANCE', total_amount: 1192000, status: 'PAID' },
    { id: 'inv-010', invoice_number: 'INV-2024-010', invoice_type: 'ORDER_FINAL', total_amount: 5859000, status: 'PAID' },
    { id: 'inv-011', invoice_number: 'INV-2024-011', invoice_type: 'ORDER_ADVANCE', total_amount: 2499500, status: 'PAID' },
    { id: 'inv-012', invoice_number: 'INV-2024-012', invoice_type: 'ORDER_ADVANCE', total_amount: 6825000, status: 'FAILED' },
    { id: 'inv-013', invoice_number: 'INV-2024-013', invoice_type: 'ORDER_FINAL', total_amount: 5859000, status: 'PAID' },
    { id: 'inv-014', invoice_number: 'INV-2024-014', invoice_type: 'ORDER_ADVANCE', total_amount: 1192000, status: 'FAILED' },
    { id: 'inv-015', invoice_number: 'INV-2024-015', invoice_type: 'RENEWAL', total_amount: 2235000, status: 'PENDING' },
];

const SUPER_ADMINS = [
    { id: 'sa-001', name: 'Rajesh Kumar', email: 'rajesh@resqid.com' },
    { id: 'sa-002', name: 'Priya Sharma', email: 'priya@resqid.com' },
];

const RAW_PAYMENTS = [
    { id: 'pay-001', school_id: 'sch-001', invoice_id: 'inv-001', order_id: 'ord-001', subscription_id: 'sub-001', amount: 2499500, payment_ref: 'RZP-20241101-001', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-001', notes: 'Advance payment for card order', metadata: { bank: 'HDFC', transaction_id: 'HDFC123456' }, created_at: '2024-11-01T10:23:00Z' },
    { id: 'pay-002', school_id: 'sch-002', invoice_id: 'inv-002', order_id: 'ord-002', subscription_id: 'sub-002', amount: 1192000, payment_ref: 'RZP-20241105-002', status: 'SUCCESS', payment_mode: 'UPI', recorded_by: 'sa-002', notes: null, metadata: { upi_id: 'school@icici' }, created_at: '2024-11-05T09:14:00Z' },
    { id: 'pay-003', school_id: 'sch-003', invoice_id: 'inv-003', order_id: 'ord-003', subscription_id: 'sub-003', amount: 6825000, payment_ref: 'RZP-20241101-003', status: 'FAILED', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-001', notes: 'Insufficient funds', metadata: { bank_error: 'INSUFFICIENT_BALANCE' }, created_at: '2024-11-01T11:00:00Z' },
    { id: 'pay-004', school_id: 'sch-003', invoice_id: 'inv-003', order_id: 'ord-003', subscription_id: 'sub-003', amount: 6825000, payment_ref: 'RZP-20241108-004', status: 'PENDING', payment_mode: 'CHEQUE', recorded_by: 'sa-001', notes: 'Cheque submitted, awaiting clearance', metadata: { cheque_number: '123456', bank: 'SBI' }, created_at: '2024-11-08T08:30:00Z' },
    { id: 'pay-005', school_id: 'sch-004', invoice_id: 'inv-004', order_id: null, subscription_id: 'sub-004', amount: 0, payment_ref: null, status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-002', notes: 'Trial period - no charge', metadata: null, created_at: '2024-11-15T14:00:00Z' },
    { id: 'pay-006', school_id: 'sch-005', invoice_id: 'inv-005', order_id: null, subscription_id: 'sub-005', amount: 5572000, payment_ref: 'RZP-20241001-006', status: 'REFUNDED', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-001', notes: 'School closed operations', metadata: { refund_ref: 'RFND-001', refund_reason: 'School closure' }, created_at: '2024-10-01T12:00:00Z' },
    { id: 'pay-007', school_id: 'sch-006', invoice_id: 'inv-006', order_id: 'ord-006', subscription_id: 'sub-006', amount: 5859000, payment_ref: 'STRIPE-20241110-007', status: 'SUCCESS', payment_mode: 'UPI', recorded_by: 'sa-002', notes: null, metadata: { gateway: 'stripe', payment_intent: 'pi_123456' }, created_at: '2024-11-10T16:45:00Z' },
    { id: 'pay-008', school_id: 'sch-001', invoice_id: 'inv-007', order_id: 'ord-001', subscription_id: 'sub-001', amount: 2499500, payment_ref: 'RZP-20241001-008', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-001', notes: 'Final payment', metadata: null, created_at: '2024-10-01T10:20:00Z' },
    { id: 'pay-009', school_id: 'sch-002', invoice_id: 'inv-008', order_id: 'ord-002', subscription_id: 'sub-002', amount: 1192000, payment_ref: 'RZP-20241005-009', status: 'SUCCESS', payment_mode: 'CASH', recorded_by: 'sa-002', notes: 'Cash deposit', metadata: { receipt_no: 'CASH-001' }, created_at: '2024-10-05T09:10:00Z' },
    { id: 'pay-010', school_id: 'sch-006', invoice_id: 'inv-009', order_id: 'ord-006', subscription_id: 'sub-006', amount: 5859000, payment_ref: 'STRIPE-20241010-010', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-001', notes: null, metadata: null, created_at: '2024-10-10T16:40:00Z' },
    { id: 'pay-011', school_id: 'sch-001', invoice_id: 'inv-010', order_id: 'ord-001', subscription_id: 'sub-001', amount: 2499500, payment_ref: 'RZP-20240901-011', status: 'SUCCESS', payment_mode: 'CHEQUE', recorded_by: 'sa-002', notes: 'Cheque cleared', metadata: { cheque_number: '789012' }, created_at: '2024-09-01T10:18:00Z' },
    { id: 'pay-012', school_id: 'sch-003', invoice_id: 'inv-011', order_id: 'ord-003', subscription_id: 'sub-003', amount: 6825000, payment_ref: 'RZP-20241001-012', status: 'FAILED', payment_mode: 'UPI', recorded_by: 'sa-001', notes: 'UPI payment declined', metadata: { upi_error: 'LIMIT_EXCEEDED' }, created_at: '2024-10-01T11:30:00Z' },
    { id: 'pay-013', school_id: 'sch-006', invoice_id: 'inv-012', order_id: 'ord-006', subscription_id: 'sub-006', amount: 5859000, payment_ref: 'STRIPE-20240910-013', status: 'SUCCESS', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-002', notes: null, metadata: null, created_at: '2024-09-10T16:00:00Z' },
    { id: 'pay-014', school_id: 'sch-002', invoice_id: 'inv-013', order_id: 'ord-002', subscription_id: 'sub-002', amount: 1192000, payment_ref: 'RZP-20240905-014', status: 'FAILED', payment_mode: 'UPI', recorded_by: 'sa-001', notes: 'UPI timeout', metadata: null, created_at: '2024-09-05T09:55:00Z' },
    { id: 'pay-015', school_id: 'sch-004', invoice_id: 'inv-014', order_id: null, subscription_id: 'sub-004', amount: 2235000, payment_ref: 'RZP-20241120-015', status: 'PENDING', payment_mode: 'BANK_TRANSFER', recorded_by: 'sa-002', notes: 'Awaiting confirmation', metadata: null, created_at: '2024-11-20T07:00:00Z' },
];

// Enrich payments with relations
const PAYMENTS = RAW_PAYMENTS.map(p => ({
    ...p,
    amountInr: p.amount / 100,
    school: SCHOOLS.find(s => s.id === p.school_id),
    subscription: SUBSCRIPTIONS.find(s => s.id === p.subscription_id),
    invoice: INVOICES.find(i => i.id === p.invoice_id),
    recordedBy: SUPER_ADMINS.find(sa => sa.id === p.recorded_by),
})).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const PLAN_CFG = {
    BASIC: { label: 'Basic', color: '#10B981', bg: '#ECFDF5' },
    PREMIUM: { label: 'Premium', color: '#6366F1', bg: '#EEF2FF' },
    CUSTOM: { label: 'Custom', color: '#F59E0B', bg: '#FFFBEB' },
};

const PAY_STATUS = {
    SUCCESS: { label: 'Success', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle2 },
    FAILED: { label: 'Failed', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle },
    PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', Icon: Clock },
    REFUNDED: { label: 'Refunded', color: '#6366F1', bg: '#EEF2FF', Icon: RotateCcw },
};

const PAYMENT_MODE_CFG = {
    BANK_TRANSFER: { label: 'Bank Transfer', icon: Landmark, color: '#2563EB', bg: '#EFF6FF' },
    UPI: { label: 'UPI', icon: Wallet, color: '#7C3AED', bg: '#F5F3FF' },
    CHEQUE: { label: 'Cheque', icon: Coins, color: '#D97706', bg: '#FFFBEB' },
    CASH: { label: 'Cash', icon: Banknote, color: '#059669', bg: '#ECFDF5' },
};

const SUB_STATUS = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5' },
    TRIALING: { label: 'Trial', color: '#0EA5E9', bg: '#E0F2FE' },
    PAST_DUE: { label: 'Past Due', color: '#EF4444', bg: '#FEF2F2' },
    CANCELED: { label: 'Canceled', color: '#9CA3AF', bg: '#F3F4F6' },
    EXPIRED: { label: 'Expired', color: '#6B7280', bg: '#F9FAFB' },
};

const INVOICE_TYPE = {
    ORDER_ADVANCE: { label: 'Advance', color: '#6366F1' },
    ORDER_FINAL: { label: 'Final', color: '#10B981' },
    RENEWAL: { label: 'Renewal', color: '#F59E0B' },
    CUSTOM: { label: 'Custom', color: '#8B5CF6' },
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

function PaymentModePill({ mode }) {
    const cfg = PAYMENT_MODE_CFG[mode] || { label: mode, icon: CreditCard, color: '#6B7280', bg: '#F3F4F6' };
    const Icon = cfg.icon;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, color: cfg.color, background: cfg.bg, whiteSpace: 'nowrap' }}>
            <Icon size={10} /> {cfg.label}
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
    const [actionState, setActionState] = useState(null);
    const [actionDone, setActionDone] = useState(null);

    if (!payment) return null;
    const { school, subscription: sub, invoice, recordedBy } = payment;

    const copy = (text, key) => {
        navigator.clipboard.writeText(text);
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
    const modeCfg = PAYMENT_MODE_CFG[payment.payment_mode] || {};
    const ModeIcon = modeCfg.icon;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 200, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ width: '100%', maxWidth: 480, background: '#fff', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}>

                {/* Dark header */}
                <div style={{ background: 'linear-gradient(160deg,#0F172A 0%,#1E293B 100%)', padding: '28px 28px 24px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Payment Receipt</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                <code style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{payment.payment_ref || payment.id}</code>
                                {payment.payment_ref && (
                                    <button onClick={() => copy(payment.payment_ref, 'ref')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 2 }}>
                                        {copied === 'ref' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                                    </button>
                                )}
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

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Date</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0' }}>{fmtDate(payment.created_at)} at {fmtTime(payment.created_at)}</p>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Mode</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0', textTransform: 'capitalize' }}>{modeCfg.label}</p>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recorded By</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '3px 0 0' }}>{recordedBy?.name || 'System'}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>

                    {/* School */}
                    <DrawerSection title="School">
                        <DrawerRow label="Name" value={school?.name} />
                        <DrawerRow label="Code" value={<code style={{ fontSize: '0.82rem', color: '#6366F1', fontWeight: 700 }}>{school?.code}</code>} copyKey="code" copyVal={school?.code} copied={copied} onCopy={copy} />
                        <DrawerRow label="City" value={school?.city} />
                        <DrawerRow label="Email" value={school?.email} copyKey="email" copyVal={school?.email} copied={copied} onCopy={copy} />
                        <DrawerRow label="Phone" value={school?.phone} />
                    </DrawerSection>

                    {/* Subscription */}
                    <DrawerSection title="Subscription">
                        <DrawerRow label="Plan" value={<PlanPill plan={sub?.plan} />} />
                        <DrawerRow label="Status" value={<StatusPill status={sub?.status} type="sub" />} />
                        <DrawerRow label="Unit Price" value={sub ? fmtINR(sub.unit_price_snapshot) + '/year' : '—'} />
                        <DrawerRow label="Student Count" value={sub?.student_count?.toLocaleString()} />
                        <DrawerRow label="Renewal Date" value={sub ? fmtDate(sub.current_period_end) : '—'} />
                    </DrawerSection>

                    {/* Invoice */}
                    {invoice && (
                        <DrawerSection title="Invoice">
                            <DrawerRow label="Number" value={invoice.invoice_number} copyKey="inv" copyVal={invoice.invoice_number} copied={copied} onCopy={copy} />
                            <DrawerRow label="Type" value={INVOICE_TYPE[invoice.invoice_type]?.label || invoice.invoice_type} />
                            <DrawerRow label="Total Amount" value={fmtINR(invoice.total_amount)} />
                            <DrawerRow label="Status" value={invoice.status} />
                        </DrawerSection>
                    )}

                    {/* Notes */}
                    {payment.notes && (
                        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Notes</p>
                            <p style={{ fontSize: '0.85rem', color: '#1E293B', margin: '6px 0 0' }}>{payment.notes}</p>
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
                    {payment.status === 'FAILED' && (
                        <ActionBtn
                            icon={actionDone === 'retry' ? Check : RefreshCw}
                            label={actionState === 'retrying' ? 'Retrying…' : actionDone === 'retry' ? 'Retry Queued!' : 'Retry Payment'}
                            color="#6366F1" bg="#EEF2FF"
                            loading={actionState === 'retrying'} done={actionDone === 'retry'}
                            onClick={() => doAction('retry')}
                        />
                    )}
                    {payment.status === 'SUCCESS' && payment.amountInr > 0 && (
                        <ActionBtn
                            icon={actionDone === 'refund' ? Check : RotateCcw}
                            label={actionState === 'refunding' ? 'Processing…' : actionDone === 'refund' ? 'Refund Initiated!' : 'Issue Refund'}
                            color="#F59E0B" bg="#FFFBEB"
                            loading={actionState === 'refunding'} done={actionDone === 'refund'}
                            onClick={() => doAction('refund')}
                        />
                    )}
                    {invoice && (
                        <ActionBtn icon={Receipt} label={`Download ${invoice.invoice_number}`} color="#10B981" bg="#ECFDF5" onClick={() => { }} />
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

// ─── EXPORT ────────────────────────────────────────────────────────────────
function exportCSV(payments) {
    const header = ['Payment ID', 'School', 'School Code', 'Plan', 'Amount (INR)', 'Status', 'Payment Mode', 'Invoice Number', 'Recorded By', 'Date'];
    const rows = payments.map(p => [
        p.payment_ref || p.id,
        p.school?.name || '',
        p.school?.code || '',
        p.subscription?.plan || '',
        p.amountInr,
        p.status,
        p.payment_mode,
        p.invoice?.invoice_number || '',
        p.recordedBy?.name || 'System',
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
    const [modeF, setModeF] = useState('ALL');
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
            if (modeF !== 'ALL' && p.payment_mode !== modeF) return false;
            if (planF !== 'ALL' && p.subscription?.plan !== planF) return false;
            if (q && !p.school?.name.toLowerCase().includes(q) &&
                !p.school?.code.toLowerCase().includes(q) &&
                !(p.payment_ref || '').toLowerCase().includes(q) &&
                !p.id.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [payments, search, statusF, schoolF, modeF, planF]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const activeFilters = [statusF !== 'ALL', schoolF !== 'ALL', modeF !== 'ALL', planF !== 'ALL'].filter(Boolean).length;
    const clearFilters = () => { setStatusF('ALL'); setSchoolF('ALL'); setModeF('ALL'); setPlanF('ALL'); setPage(1); };

    const COLS = ['Payment Ref', 'School', 'Plan', 'Amount', 'Status', 'Mode', 'Date & Time', ''];
    const GRID = '1.4fr 1.7fr 0.8fr 1fr 0.9fr 0.9fr 1.1fr 0.4fr';

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
                <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#0F172A', color: '#fff', padding: '12px 22px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700, zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 9, animation: 'toastIn 0.25s ease', border: `1px solid ${toast.type === 'error' ? '#EF4444' : '#10B981'}40` }}>
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
                <KpiTile label="Pending" value={kpis.pendingCount} sub="Awaiting confirmation" Icon={Clock} color="#F59E0B" bg="#FFFBEB" />
                <KpiTile label="Refunds Issued" value={fmtINR(kpis.refundedAmt)} sub="Total refunded" Icon={RotateCcw} color="#0EA5E9" bg="#E0F2FE" />
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '13px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fade-up">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search school name, code, payment ref…"
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
                            {['ALL', 'BASIC', 'PREMIUM', 'CUSTOM'].map(p => {
                                const cfg = PLAN_CFG[p];
                                return <FPill key={p} active={planF === p} color={cfg?.color} bg={cfg?.bg} onClick={() => { setPlanF(p); setPage(1); }}>{p === 'ALL' ? 'All Plans' : cfg.label}</FPill>;
                            })}
                        </FG>
                        <FG label="Payment Mode">
                            {['ALL', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CASH'].map(m => {
                                const cfg = PAYMENT_MODE_CFG[m];
                                return <FPill key={m} active={modeF === m} color={cfg?.color} bg={cfg?.bg} onClick={() => { setModeF(m); setPage(1); }}>{m === 'ALL' ? 'All' : cfg.label}</FPill>;
                            })}
                        </FG>
                        <FG label="School">
                            <FSel value={schoolF} onChange={e => { setSchoolF(e.target.value); setPage(1); }} active={schoolF !== 'ALL'}>
                                <option value="ALL">All Schools</option>
                                {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                            </FSel>
                        </FG>
                        {activeFilters > 0 && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', marginLeft: 'auto' }}><X size={10} />Clear All</button>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }} className="fade-up">
                <div style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                    {COLS.map(c => <div key={c} style={{ padding: '11px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>)}
                </div>

                {paginated.length === 0
                    ? <Empty />
                    : paginated.map((p, i) => (
                        <div key={p.id} className="tr" style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', borderBottom: i < paginated.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                            onClick={() => setSelected(p)}>
                            <div style={{ padding: '13px 8px' }}>
                                <code style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366F1' }}>{p.payment_ref || p.id.slice(0, 8)}</code>
                            </div>
                            <div style={{ padding: '13px 8px' }}>
                                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.school?.name}</p>
                                <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '1px 0 0', fontWeight: 500 }}><Hash size={9} style={{ display: 'inline', marginRight: 2 }} /> {p.school?.code}</p>
                            </div>
                            <div style={{ padding: '13px 8px' }}><PlanPill plan={p.subscription?.plan} /></div>
                            <div style={{ padding: '13px 8px' }}>
                                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: p.status === 'FAILED' ? '#EF4444' : p.status === 'REFUNDED' ? '#6366F1' : '#0F172A', letterSpacing: '-0.02em' }}>
                                    {p.amountInr === 0 ? <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 600 }}>Trial</span> : fmtINR(p.amountInr)}
                                </span>
                            </div>
                            <div style={{ padding: '13px 8px' }}><StatusPill status={p.status} /></div>
                            <div style={{ padding: '13px 8px' }}><PaymentModePill mode={p.payment_mode} /></div>
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
