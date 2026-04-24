<<<<<<< HEAD
import { useState, useRef } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Plus, MapPin,
    CreditCard, X, Package, Receipt, ClipboardCheck,
    IndianRupee, Calendar, Upload, FileText, Palette,
    ChevronRight, Building2, Hash, Layers, Image, AlertCircle
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import { toast } from '../../utils/toast.js';

// ─── Pricing Config ───────────────────────────────────────────────────────────
const PRICE_PER_CARD = 45;
const GST_RATE = 0.18;
const SHIPPING_FLAT = 150;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CARD_REQUESTS = [
    { id: 'cr1', school_id: 'SCH-2024-001', school_name: 'Delhi Public School, Sector 12', card_count: 250, card_type: 'predetailed', design_type: 'customized', notes: 'Annual re-issuance for new academic session 2024–25.', delivery_address: { line1: '12, Sector 12, Dwarka', line2: 'Near Metro Station', city: 'New Delhi', state: 'Delhi', pincode: '110075' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'cr2', school_id: 'SCH-2024-007', school_name: "St. Mary's Convent School", card_count: 80, card_type: 'blank', design_type: 'default', notes: 'Replacement cards for lost/damaged IDs.', delivery_address: { line1: 'Plot 7, Civil Lines', line2: '', city: 'Nagpur', state: 'Maharashtra', pincode: '440001' }, status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), reviewed_at: new Date(Date.now() - 3600000 * 30).toISOString() },
    { id: 'cr3', school_id: 'SCH-2023-041', school_name: 'Kendriya Vidyalaya No. 3', card_count: 120, card_type: 'predetailed', design_type: 'customized', notes: 'Bulk order for new admission batch.', delivery_address: { line1: 'AFS Campus, Begumpet', line2: 'Near Air Force Station', city: 'Hyderabad', state: 'Telangana', pincode: '500003' }, status: 'REJECTED', reject_reason: 'Quantity exceeds allowed single-order limit.', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'cr4', school_id: 'SCH-2024-019', school_name: 'Sunshine International School', card_count: 150, card_type: 'blank', design_type: 'default', notes: 'Mid-year intake — 150 new students enrolled.', delivery_address: { line1: '45, Koramangala 4th Block', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 10).toISOString() },
];

const STATUS_STYLE = {
    PENDING:  { bg: '#FFFBEB', color: '#B45309', label: 'Pending',  Icon: Clock },
    APPROVED: { bg: '#ECFDF5', color: '#047857', label: 'Approved', Icon: CheckCircle },
    REJECTED: { bg: '#FEF2F2', color: '#B91C1C', label: 'Rejected', Icon: XCircle },
};

const STEPS = [
    { id: 1, label: 'Card Details',      Icon: CreditCard },
    { id: 2, label: 'Delivery Address',  Icon: MapPin },
    { id: 3, label: 'Pricing & GST',     Icon: Receipt },
    { id: 4, label: 'Review',            Icon: ClipboardCheck },
];

const EMPTY_FORM = {
    school_id: '', card_count: '', card_type: '', design_type: '',
    card_file: null, design_file: null, notes: '',
    line1: '', line2: '', city: '', state: '', pincode: ''
};

const fmt = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcPricing = (count) => {
    const subtotal = count * PRICE_PER_CARD;
    const gst = subtotal * GST_RATE;
    return { subtotal, gst, shipping: SHIPPING_FLAT, total: subtotal + gst + SHIPPING_FLAT };
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = {
    page: { maxWidth: '1080px', margin: '0 auto', padding: '0 24px', fontFamily: "'DM Sans', sans-serif" },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modal: { background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '760px', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 32px 64px rgba(0,0,0,0.22)' },
};

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepBar({ current }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '28px 32px 0', gap: 0 }}>
            {STEPS.map((step, idx) => {
                const done = current > step.id;
                const active = current === step.id;
                const clr = done || active ? '#2563EB' : '#CBD5E1';
                return (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: done ? '#2563EB' : active ? '#EFF6FF' : '#F8FAFC',
                                border: `2px solid ${clr}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s'
                            }}>
                                {done
                                    ? <CheckCircle size={18} color="#fff" />
                                    : <step.Icon size={16} color={active ? '#2563EB' : '#94A3B8'} />
                                }
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: active ? 700 : 500, color: active ? '#1E40AF' : '#64748B', whiteSpace: 'nowrap' }}>
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: done ? '#2563EB' : '#E2E8F0', margin: '0 8px', marginBottom: 24, transition: 'background 0.3s' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Option Card (for card type / design type) ────────────────────────────────
function OptionCard({ icon: Icon, title, desc, selected, onClick, color = '#2563EB' }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1, minWidth: 140, padding: '18px 16px', borderRadius: 14,
                border: `2px solid ${selected ? color : '#E2E8F0'}`,
                background: selected ? `${color}08` : '#fff',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', outline: 'none'
            }}
        >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: selected ? `${color}15` : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={18} color={selected ? color : '#64748B'} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: selected ? color : '#1E293B', marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>{desc}</div>
            {selected && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={12} color={color} />
                    <span style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>Selected</span>
                </div>
            )}
        </button>
    );
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────
function FileUploadZone({ label, file, onChange, accept = '*' }) {
    const ref = useRef();
    return (
        <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
            <div
                onClick={() => ref.current.click()}
                style={{
                    border: `2px dashed ${file ? '#10B981' : '#CBD5E1'}`,
                    borderRadius: 12, padding: '16px 20px',
                    background: file ? '#F0FDF4' : '#F8FAFC',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: file ? '#D1FAE5' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {file ? <CheckCircle size={18} color="#059669" /> : <Upload size={18} color="#64748B" />}
                </div>
                <div style={{ flex: 1 }}>
                    {file
                        ? <><div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#065F46' }}>{file.name}</div><div style={{ fontSize: '0.72rem', color: '#64748B' }}>{(file.size / 1024).toFixed(1)} KB</div></>
                        : <><div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>Click to upload file</div><div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>PDF, PNG, JPG up to 10MB</div></>
                    }
                </div>
                {file && <button onClick={(e) => { e.stopPropagation(); onChange(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={14} /></button>}
            </div>
            <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={e => onChange(e.target.files[0] || null)} />
        </div>
    );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function Label({ children, required }) {
    return (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            {children}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
        </label>
    );
}

function FieldError({ msg }) {
    if (!msg) return null;
    return <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{msg}</div>;
}

function InputBox({ value, onChange, type = 'text', placeholder, error, ...rest }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                width: '100%', padding: '10px 14px',
                border: `1.5px solid ${error ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: 10, fontSize: '0.875rem', outline: 'none',
                background: '#fff', boxSizing: 'border-box',
                fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 0.2s'
            }}
            {...rest}
        />
    );
}

// ─── STEP 1: Card Details (new design per sketch) ─────────────────────────────
function Step1({ form, setField, errors, schoolName, schoolId }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* School ID */}
            <div>
                <Label>School</Label>
                <div style={{ padding: '12px 16px', background: '#F1F5F9', borderRadius: 10, border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Building2 size={16} color="#64748B" />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E293B' }}>{schoolName || 'Your School'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>{schoolId || 'SCH-XXXX'}</div>
                    </div>
=======
/**
 * SCHOOL ADMIN — CARD REQUESTS (Physical ID Card Orders)
 * Aligned with CardOrder model from schema:
 * - order_number, order_type (BLANK/PRE_DETAILS), status, payment_status
 * - student_count, unit_price, advance_amount, balance_amount, grand_total
 * - delivery_name, delivery_phone, delivery_address, delivery_city, delivery_state, delivery_pincode
 * - order_channel (DASHBOARD/CALL), notes
 */

import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Search,
    CreditCard, Plus, MapPin, FileText, Hash, Building2,
    X, Package, ChevronLeft, ChevronRight, Receipt, ClipboardCheck,
    IndianRupee, Truck, Filter, Calendar, Download, Eye,
    Phone, User, Mail, AlertCircle, Check, Loader2,
    TrendingUp, Shield, AlertTriangle, RotateCcw
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum, formatDate, formatDateTime } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';
import { toast } from '#utils/Toast.js';

// ─── Constants (Matches CardOrder Schema) ─────────────────────────────────────
const ORDER_TYPES = {
    BLANK: { label: 'Blank Cards', icon: CreditCard, description: 'Generic cards without student details' },
    PRE_DETAILS: { label: 'Pre-filled Cards', icon: FileText, description: 'Cards with student name, class, photo' },
};

const ORDER_STATUS = {
    PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', Icon: Clock, order: 1 },
    CONFIRMED: { label: 'Confirmed', color: '#3B82F6', bg: '#EFF6FF', Icon: CheckCircle, order: 2 },
    PROCESSING: { label: 'Processing', color: '#8B5CF6', bg: '#F5F3FF', Icon: Loader2, order: 3 },
    SHIPPED: { label: 'Shipped', color: '#0EA5E9', bg: '#E0F2FE', Icon: Truck, order: 4 },
    DELIVERED: { label: 'Delivered', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle, order: 5 },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle, order: 99 },
};

const PAYMENT_STATUS = {
    UNPAID: { label: 'Unpaid', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle },
    PARTIALLY_PAID: { label: 'Partial', color: '#F59E0B', bg: '#FFFBEB', Icon: Clock },
    FULLY_PAID: { label: 'Fully Paid', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle },
    REFUNDED: { label: 'Refunded', color: '#6B7280', bg: '#F3F4F6', Icon: RotateCcw },
};

// ─── Pricing Constants ────────────────────────────────────────────────────────
const PRICE_PER_CARD = 14900; // ₹149 in paise
const GST_RATE = 18; // 18%
const SHIPPING_FLAT = 15000; // ₹150 in paise

// ─── Mock Data (Matches CardOrder Schema) ─────────────────────────────────────
const MOCK_ORDERS = [
    {
        id: 'ord_001',
        order_number: 'ORD-2024-001',
        order_type: 'PRE_DETAILS',
        status: 'DELIVERED',
        payment_status: 'FULLY_PAID',
        school_id: 'sch_001',
        student_count: 250,
        unit_price: 14900,
        advance_amount: 1862500,
        balance_amount: 1862500,
        grand_total: 3725000,
        delivery_name: 'Principal Office',
        delivery_phone: '+91-98765-43210',
        delivery_address: '12, Sector 12, Dwarka',
        delivery_city: 'New Delhi',
        delivery_state: 'Delhi',
        delivery_pincode: '110075',
        order_channel: 'DASHBOARD',
        notes: 'Annual re-issuance for new academic session 2024–25. All Class 9 and 10 students require fresh cards.',
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        confirmed_at: new Date(Date.now() - 86400000 * 14).toISOString(),
        shipped_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        delivered_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: 'ord_002',
        order_number: 'ORD-2024-002',
        order_type: 'BLANK',
        status: 'SHIPPED',
        payment_status: 'FULLY_PAID',
        school_id: 'sch_001',
        student_count: 80,
        unit_price: 14900,
        advance_amount: 596000,
        balance_amount: 596000,
        grand_total: 1192000,
        delivery_name: 'Admin Office',
        delivery_phone: '+91-98765-43211',
        delivery_address: '7 Park Street',
        delivery_city: 'Kolkata',
        delivery_state: 'West Bengal',
        delivery_pincode: '700016',
        order_channel: 'CALL',
        notes: 'Replacement cards for lost/damaged IDs reported in Term 1.',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        confirmed_at: new Date(Date.now() - 86400000 * 28).toISOString(),
        shipped_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        id: 'ord_003',
        order_number: 'ORD-2024-003',
        order_type: 'PRE_DETAILS',
        status: 'CONFIRMED',
        payment_status: 'PARTIALLY_PAID',
        school_id: 'sch_001',
        student_count: 120,
        unit_price: 14900,
        advance_amount: 894000,
        balance_amount: 894000,
        grand_total: 1788000,
        delivery_name: 'Principal Office',
        delivery_phone: '+91-98765-43212',
        delivery_address: 'AFS Campus, Begumpet',
        delivery_city: 'Hyderabad',
        delivery_state: 'Telangana',
        delivery_pincode: '500003',
        order_channel: 'DASHBOARD',
        notes: 'Bulk order for new admission batch.',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        confirmed_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
        id: 'ord_004',
        order_number: 'ORD-2024-004',
        order_type: 'PRE_DETAILS',
        status: 'PENDING',
        payment_status: 'UNPAID',
        school_id: 'sch_001',
        student_count: 150,
        unit_price: 14900,
        advance_amount: null,
        balance_amount: 2235000,
        grand_total: 2235000,
        delivery_name: 'Admin Block',
        delivery_phone: '+91-98765-43213',
        delivery_address: '45, Koramangala 4th Block',
        delivery_city: 'Bengaluru',
        delivery_state: 'Karnataka',
        delivery_pincode: '560034',
        order_channel: 'DASHBOARD',
        notes: 'Mid-year intake — 150 new students enrolled in January 2025 semester.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: 'ord_005',
        order_number: 'ORD-2024-005',
        order_type: 'BLANK',
        status: 'CANCELLED',
        payment_status: 'REFUNDED',
        school_id: 'sch_001',
        student_count: 50,
        unit_price: 14900,
        advance_amount: 372500,
        balance_amount: 372500,
        grand_total: 745000,
        delivery_name: 'Admin Office',
        delivery_phone: '+91-98765-43214',
        delivery_address: '45, Koramangala 4th Block',
        delivery_city: 'Bengaluru',
        delivery_state: 'Karnataka',
        delivery_pincode: '560034',
        order_channel: 'CALL',
        notes: 'Order cancelled due to duplicate request',
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 40).toISOString(),
        cancelled_at: new Date(Date.now() - 86400000 * 40).toISOString(),
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => `₹${(amount / 100).toLocaleString('en-IN')}`;
const fmt = formatCurrency;

const calcPricing = (count) => {
    const subtotal = count * PRICE_PER_CARD;
    const gst = Math.round(subtotal * GST_RATE / 100);
    const total = subtotal + gst + SHIPPING_FLAT;
    return { subtotal, gst, shipping: SHIPPING_FLAT, total };
};

// ─── Status Badge Components ──────────────────────────────────────────────────
const OrderStatusBadge = ({ status }) => {
    const cfg = ORDER_STATUS[status] || ORDER_STATUS.PENDING;
    const Icon = cfg.Icon;
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}20` }}>
            <Icon size={11} /> {cfg.label}
        </span>
    );
};

const PaymentStatusBadge = ({ status }) => {
    const cfg = PAYMENT_STATUS[status] || PAYMENT_STATUS.UNPAID;
    const Icon = cfg.Icon;
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
            <Icon size={10} /> {cfg.label}
        </span>
    );
};

// ─── Order Card Component ─────────────────────────────────────────────────────
const OrderCard = ({ order, isExpanded, onToggleExpand }) => {
    const statusCfg = ORDER_STATUS[order.status] || ORDER_STATUS.PENDING;
    const StatusIcon = statusCfg.Icon;
    const orderTypeCfg = ORDER_TYPES[order.order_type] || ORDER_TYPES.PRE_DETAILS;
    const TypeIcon = orderTypeCfg.icon;

    const getTimelineStep = (stepStatus, stepLabel, stepDate) => {
        if (!stepDate) return null;
        return (
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepStatus === 'completed' ? 'bg-emerald-500' : stepStatus === 'current' ? 'bg-brand-500' : 'bg-slate-200'}`}>
                    {stepStatus === 'completed' ? <Check size={14} className="text-white" /> : <div className={`w-2 h-2 rounded-full ${stepStatus === 'current' ? 'bg-white' : 'bg-slate-400'}`} />}
                </div>
                <div>
                    <p className="text-sm font-medium">{stepLabel}</p>
                    <p className="text-xs text-[var(--text-muted)]">{stepDate ? formatDate(stepDate) : 'Pending'}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Order Type Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${statusCfg.color}10` }}>
                        <TypeIcon size={22} color={statusCfg.color} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                            <code className="font-mono font-bold text-sm bg-slate-100 px-2 py-1 rounded">{order.order_number}</code>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusCfg.color}15`, color: statusCfg.color }}>
                                {orderTypeCfg.label}
                            </span>
                            <OrderStatusBadge status={order.status} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div>
                                <p className="text-xs text-[var(--text-muted)]">Cards</p>
                                <p className="font-semibold">{order.student_count.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-muted)]">Total Amount</p>
                                <p className="font-bold text-brand-600">{formatCurrency(order.grand_total)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-muted)]">Payment</p>
                                <PaymentStatusBadge status={order.payment_status} />
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-muted)]">Ordered On</p>
                                <p className="text-sm">{formatDate(order.created_at)}</p>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="p-2.5 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-sm text-amber-800">
                                {order.notes}
                            </div>
                        )}
                    </div>

                    {/* Expand Button */}
                    <button
                        onClick={() => onToggleExpand(order.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <ChevronDown size={18} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
                </div>
            </div>

<<<<<<< HEAD
            {/* Number of Cards */}
            <div>
                <Label required>Number of Cards</Label>
                <InputBox
                    type="number" min={1} max={300}
                    value={form.card_count}
                    onChange={e => setField('card_count', e.target.value)}
                    placeholder="e.g. 150"
                    error={errors.card_count}
                />
                {form.card_count > 0 && !errors.card_count && (
                    <div style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: 4, fontWeight: 500 }}>
                        Estimated: {fmt(calcPricing(Number(form.card_count)).total)} (incl. GST + Shipping)
                    </div>
                )}
                <FieldError msg={errors.card_count} />
            </div>

            {/* Card Type Dropdown Section */}
            <div style={{ background: '#F8FAFC', borderRadius: 14, border: '1.5px solid #E2E8F0', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layers size={14} color="#2563EB" />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>Card Type</span>
                    <span style={{ fontSize: '0.72rem', color: '#EF4444', marginLeft: 2 }}>*</span>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <OptionCard
                        icon={Hash} title="Blank"
                        desc="Empty card — data printed separately"
                        selected={form.card_type === 'blank'}
                        onClick={() => setField('card_type', 'blank')}
                    />
                    <OptionCard
                        icon={FileText} title="Pre-detailed"
                        desc="Card pre-filled with student info"
                        selected={form.card_type === 'predetailed'}
                        onClick={() => setField('card_type', 'predetailed')}
                    />
                </div>
                <FieldError msg={errors.card_type} />

                {/* File upload appears when predetailed selected */}
                {form.card_type === 'predetailed' && (
                    <div style={{ marginTop: 16 }}>
                        <FileUploadZone
                            label="Upload Student Data File (CSV / Excel)"
                            file={form.card_file}
                            onChange={f => setField('card_file', f)}
                            accept=".csv,.xlsx,.xls"
                        />
=======
                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-[var(--border-default)]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Delivery Address */}
                            <div className="p-3 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin size={14} className="text-[var(--text-muted)]" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Delivery Address</span>
                                </div>
                                <p className="text-sm font-medium">{order.delivery_name}</p>
                                <p className="text-sm text-[var(--text-muted)]">{order.delivery_phone}</p>
                                <address className="text-sm text-[var(--text-secondary)] not-italic mt-1">
                                    {order.delivery_address}<br />
                                    {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                </address>
                            </div>

                            {/* Financial Details */}
                            <div className="p-3 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Receipt size={14} className="text-[var(--text-muted)]" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Financial Summary</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Unit Price:</span>
                                        <span>{formatCurrency(order.unit_price)}/card</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Subtotal:</span>
                                        <span>{formatCurrency(order.student_count * order.unit_price)}</span>
                                    </div>
                                    {order.advance_amount && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Advance Paid:</span>
                                            <span className="text-emerald-600">{formatCurrency(order.advance_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-1 border-t border-[var(--border-default)] font-semibold">
                                        <span>Balance Due:</span>
                                        <span className="text-amber-600">{formatCurrency(order.balance_amount || order.grand_total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-3 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={14} className="text-[var(--text-muted)]" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Order Timeline</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Created:</span>
                                        <span>{formatDateTime(order.created_at)}</span>
                                    </div>
                                    {order.confirmed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Confirmed:</span>
                                            <span>{formatDateTime(order.confirmed_at)}</span>
                                        </div>
                                    )}
                                    {order.shipped_at && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Shipped:</span>
                                            <span>{formatDateTime(order.shipped_at)}</span>
                                        </div>
                                    )}
                                    {order.delivered_at && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Delivered:</span>
                                            <span>{formatDateTime(order.delivered_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Channel */}
                        <div className="mt-3 pt-3 text-right">
                            <span className="text-xs text-[var(--text-muted)]">Order via: {order.order_channel === 'DASHBOARD' ? 'Dashboard' : 'Phone Call'}</span>
                        </div>
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
                    </div>
                )}
            </div>

            {/* Design Menu Section */}
            <div style={{ background: '#F8FAFC', borderRadius: 14, border: '1.5px solid #E2E8F0', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Palette size={14} color="#9333EA" />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>Design Menu</span>
                    <span style={{ fontSize: '0.72rem', color: '#EF4444', marginLeft: 2 }}>*</span>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <OptionCard
                        icon={CreditCard} title="Default"
                        desc="Use standard school card template"
                        selected={form.design_type === 'default'}
                        onClick={() => setField('design_type', 'default')}
                        color="#9333EA"
                    />
                    <OptionCard
                        icon={Image} title="Customized"
                        desc="Upload your own card design"
                        selected={form.design_type === 'customized'}
                        onClick={() => setField('design_type', 'customized')}
                        color="#9333EA"
                    />
                </div>
                <FieldError msg={errors.design_type} />

                {/* File upload appears when customized selected */}
                {form.design_type === 'customized' && (
                    <div style={{ marginTop: 16 }}>
                        <FileUploadZone
                            label="Upload Custom Design File (PNG, PDF, AI)"
                            file={form.design_file}
                            onChange={f => setField('design_file', f)}
                            accept=".png,.jpg,.jpeg,.pdf,.ai,.svg"
                        />
                    </div>
                )}
            </div>

            {/* Notes */}
            <div>
                <Label required>Reason / Notes</Label>
                <textarea
                    value={form.notes}
                    onChange={e => setField('notes', e.target.value)}
                    rows={3}
                    placeholder="Describe the purpose of this card request..."
                    style={{
                        width: '100%', padding: '10px 14px',
                        border: `1.5px solid ${errors.notes ? '#EF4444' : '#E2E8F0'}`,
                        borderRadius: 10, fontSize: '0.875rem', resize: 'vertical',
                        fontFamily: 'inherit', color: '#1E293B', boxSizing: 'border-box'
                    }}
                />
                <FieldError msg={errors.notes} />
            </div>
        </div>
    );
}

// ─── STEP 2: Delivery Address ─────────────────────────────────────────────────
function Step2({ form, setField, errors }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <MapPin size={16} color="#2563EB" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>Delivery Address</span>
            </div>
            <div>
                <Label required>Street Address</Label>
                <InputBox value={form.line1} onChange={e => setField('line1', e.target.value)} placeholder="Building / Plot No, Street Name" error={errors.line1} />
                <FieldError msg={errors.line1} />
            </div>
            <div>
                <Label>Landmark / Area (optional)</Label>
                <InputBox value={form.line2} onChange={e => setField('line2', e.target.value)} placeholder="Near landmark, area name" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                    <Label required>City</Label>
                    <InputBox value={form.city} onChange={e => setField('city', e.target.value)} placeholder="City" error={errors.city} />
                    <FieldError msg={errors.city} />
                </div>
                <div>
                    <Label required>State</Label>
                    <InputBox value={form.state} onChange={e => setField('state', e.target.value)} placeholder="State" error={errors.state} />
                    <FieldError msg={errors.state} />
                </div>
            </div>
            <div style={{ maxWidth: 200 }}>
                <Label required>Pincode</Label>
                <InputBox value={form.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/, ''))} placeholder="6-digit PIN" maxLength={6} error={errors.pincode} />
                <FieldError msg={errors.pincode} />
            </div>
        </div>
    );
}

// ─── STEP 3: Pricing ──────────────────────────────────────────────────────────
function Step3({ form }) {
    const count = Number(form.card_count) || 0;
    const { subtotal, gst, shipping, total } = calcPricing(count);

    const rows = [
        { label: `Cards (${count} × ₹${PRICE_PER_CARD})`, value: fmt(subtotal), icon: CreditCard },
        { label: 'GST @ 18%', value: fmt(gst), icon: Receipt },
        { label: 'Shipping (Flat)', value: fmt(shipping), icon: Package },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Receipt size={16} color="#2563EB" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>Order Summary</span>
            </div>
            <div style={{ background: '#EFF6FF', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                <CreditCard size={20} color="#2563EB" />
                <div>
                    <div style={{ fontWeight: 700, color: '#1E40AF' }}>{count} Cards Ordered</div>
                    <div style={{ fontSize: '0.75rem', color: '#3B82F6' }}>
                        {form.card_type === 'predetailed' ? 'Pre-detailed' : 'Blank'} · {form.design_type === 'customized' ? 'Custom Design' : 'Default Design'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <r.icon size={14} color="#64748B" />
                            <span style={{ fontSize: '0.8125rem', color: '#475569' }}>{r.label}</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.value}</span>
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#ECFDF5', borderRadius: 12, border: '1.5px solid #10B981', marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IndianRupee size={16} color="#059669" />
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#065F46' }}>Total Payable</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#059669' }}>{fmt(total)}</span>
                </div>
            </div>
        </div>
    );
}

// ─── STEP 4: Review ───────────────────────────────────────────────────────────
function Step4({ form }) {
    const count = Number(form.card_count) || 0;
    const { total } = calcPricing(count);

    const sections = [
        {
            title: 'Card Details', icon: CreditCard, color: '#2563EB',
            rows: [
                { label: 'Card Count', value: `${count} cards` },
                { label: 'Card Type', value: form.card_type === 'predetailed' ? 'Pre-detailed' : 'Blank' },
                { label: 'Design', value: form.design_type === 'customized' ? 'Customized' : 'Default' },
                { label: 'Notes', value: form.notes },
            ]
        },
        {
            title: 'Delivery Address', icon: MapPin, color: '#059669',
            rows: [
                { label: 'Address', value: [form.line1, form.line2].filter(Boolean).join(', ') },
                { label: 'City / State', value: `${form.city}, ${form.state}` },
                { label: 'Pincode', value: form.pincode },
            ]
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sections.map(sec => (
                <div key={sec.title} style={{ border: '1.5px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #E2E8F0' }}>
                        <sec.icon size={14} color={sec.color} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>{sec.title}</span>
                    </div>
                    <div style={{ padding: '4px 0' }}>
                        {sec.rows.map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderBottom: '1px solid #F1F5F9', gap: 12 }}>
                                <span style={{ fontSize: '0.8125rem', color: '#64748B', minWidth: 100 }}>{row.label}</span>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', textAlign: 'right' }}>{row.value || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div style={{ padding: '14px 18px', background: '#ECFDF5', borderRadius: 12, border: '1.5px solid #10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#065F46' }}>Total Amount</span>
                <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#059669' }}>{fmt(total)}</span>
            </div>
        </div>
    );
}

<<<<<<< HEAD
// ─── New Request Modal ────────────────────────────────────────────────────────
function NewRequestModal({ isOpen, onClose, onSubmit, schoolId, schoolName }) {
=======
// ─── Create Order Modal ───────────────────────────────────────────────────────
const CreateOrderModal = ({ isOpen, onClose, onSubmit, schoolId, schoolName }) => {
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        order_type: 'PRE_DETAILS',
        student_count: '',
        delivery_name: '',
        delivery_phone: '',
        delivery_address: '',
        delivery_city: '',
        delivery_state: '',
        delivery_pincode: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const setField = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => ({ ...e, [key]: '' }));
    };

    const validateStep1 = () => {
        const e = {};
<<<<<<< HEAD
        if (s === 1) {
            if (!form.card_count || isNaN(form.card_count) || Number(form.card_count) < 1) e.card_count = 'Enter a valid card count (min 1)';
            else if (Number(form.card_count) > 300) e.card_count = 'Maximum 300 cards per request';
            if (!form.card_type) e.card_type = 'Please select a card type';
            if (!form.design_type) e.design_type = 'Please select a design option';
            if (!form.notes.trim()) e.notes = 'Please provide a reason for this request';
=======
        if (!form.student_count || isNaN(form.student_count) || Number(form.student_count) < 1) {
            e.student_count = 'Enter valid card count (min 1)';
        } else if (Number(form.student_count) > 500) {
            e.student_count = 'Maximum 500 cards per order. For bulk orders, contact support.';
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
        }
        return e;
    };

    const validateStep2 = () => {
        const e = {};
        if (!form.delivery_name.trim()) e.delivery_name = 'Contact name required';
        if (!form.delivery_phone.trim()) e.delivery_phone = 'Phone number required';
        if (!form.delivery_address.trim()) e.delivery_address = 'Address required';
        if (!form.delivery_city.trim()) e.delivery_city = 'City required';
        if (!form.delivery_state.trim()) e.delivery_state = 'State required';
        if (!form.delivery_pincode.trim() || !/^\d{6}$/.test(form.delivery_pincode)) {
            e.delivery_pincode = 'Enter valid 6-digit pincode';
        }
        return e;
    };

    const next = () => {
        if (step === 1) {
            const e = validateStep1();
            if (Object.keys(e).length) { setErrors(e); return; }
        }
        if (step === 2) {
            const e = validateStep2();
            if (Object.keys(e).length) { setErrors(e); return; }
        }
        setStep(s => Math.min(s + 1, 4));
    };

    const back = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));

        const count = Number(form.student_count);
        const unitPrice = PRICE_PER_CARD;
        const grandTotal = count * unitPrice + Math.round(count * unitPrice * GST_RATE / 100) + SHIPPING_FLAT;

        const newOrder = {
            id: `ord_${Date.now()}`,
            order_number: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
            order_type: form.order_type,
            status: 'PENDING',
            payment_status: 'UNPAID',
            school_id: schoolId,
            student_count: count,
            unit_price: unitPrice,
            advance_amount: form.order_type === 'PRE_DETAILS' ? Math.floor(grandTotal * 0.5) : null,
            balance_amount: grandTotal,
            grand_total: grandTotal,
            delivery_name: form.delivery_name,
            delivery_phone: form.delivery_phone,
            delivery_address: form.delivery_address,
            delivery_city: form.delivery_city,
            delivery_state: form.delivery_state,
            delivery_pincode: form.delivery_pincode,
            order_channel: 'DASHBOARD',
            notes: form.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onSubmit(newOrder);
        setSubmitting(false);
        onClose();
        setStep(1);
        setForm({ ...EMPTY_FORM, school_id: schoolId || '' });
    };

<<<<<<< HEAD
    const stepTitles = ['Card Details', 'Delivery Address', 'Pricing & GST', 'Review & Submit'];

    return (
        <div style={css.overlay}>
            <div style={css.modal}>
                {/* Header */}
                <div style={{ padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>New Card Request</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748B' }}>Step {step} of 4 — {stepTitles[step - 1]}</p>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <X size={15} />
                    </button>
                </div>

                <StepBar current={step} />

                {/* Content */}
                <div style={{ padding: '24px 32px' }}>
                    {step === 1 && <Step1 form={form} setField={setField} errors={errors} schoolName={schoolName} schoolId={schoolId} />}
                    {step === 2 && <Step2 form={form} setField={setField} errors={errors} />}
                    {step === 3 && <Step3 form={form} />}
                    {step === 4 && <Step4 form={form} />}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 32px 24px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
                    <button
                        onClick={step === 1 ? onClose : back}
                        style={{ padding: '10px 22px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#374151', fontFamily: 'inherit' }}
                    >
                        {step === 1 ? 'Cancel' : '← Back'}
                    </button>
                    {step < 4 ? (
                        <button
                            onClick={next}
                            style={{ padding: '10px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            Next <ChevronRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            style={{ padding: '10px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <CheckCircle size={15} /> Submit Request
=======
    const count = Number(form.student_count) || 0;
    const { subtotal, gst, shipping, total } = calcPricing(count);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">New Card Order</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">Request physical ID cards for students</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="px-6 pt-5">
                    <div className="flex justify-between">
                        {[
                            { id: 1, label: 'Order Details', icon: CreditCard },
                            { id: 2, label: 'Delivery', icon: MapPin },
                            { id: 3, label: 'Pricing', icon: Receipt },
                            { id: 4, label: 'Review', icon: ClipboardCheck },
                        ].map((s, idx) => (
                            <div key={s.id} className="flex-1 text-center">
                                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= s.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                                </div>
                                <p className={`text-xs mt-1 ${step >= s.id ? 'font-semibold text-brand-600' : 'text-slate-400'}`}>{s.label}</p>
                                {idx < 3 && <div className={`h-0.5 mt-[-20px] mx-2 ${step > s.id ? 'bg-brand-600' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Step 1: Order Details */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Card Type</label>
                                <div className="flex gap-3">
                                    {Object.entries(ORDER_TYPES).map(([key, cfg]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setField('order_type', key)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all ${form.order_type === key
                                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50'
                                                }`}
                                        >
                                            <cfg.icon size={18} className="mx-auto mb-1" />
                                            <div className="font-medium text-sm">{cfg.label}</div>
                                            <div className="text-xs opacity-75">{cfg.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Number of Cards <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={form.student_count}
                                    onChange={e => setField('student_count', e.target.value)}
                                    className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.student_count ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                    placeholder="e.g., 250"
                                />
                                {errors.student_count && <p className="text-xs text-red-500 mt-1">{errors.student_count}</p>}
                                <p className="text-xs text-[var(--text-muted)] mt-2">Unit price: {formatCurrency(PRICE_PER_CARD)} per card + GST</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Notes / Reason <span className="text-red-500">*</span></label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setField('notes', e.target.value)}
                                    rows={3}
                                    className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 resize-none"
                                    placeholder="e.g., New admission batch, Replacement cards, Annual re-issuance..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Delivery Address */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_name}
                                        onChange={e => setField('delivery_name', e.target.value)}
                                        className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_name ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                        placeholder="e.g., Principal Office"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">Contact Phone <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_phone}
                                        onChange={e => setField('delivery_phone', e.target.value)}
                                        className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_phone ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                        placeholder="+91-XXXXX-XXXXX"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Street Address <span className="text-red-500">*</span></label>
                                <textarea
                                    value={form.delivery_address}
                                    onChange={e => setField('delivery_address', e.target.value)}
                                    rows={2}
                                    className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_address ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                    placeholder="Building name, street, landmark"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">City <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_city}
                                        onChange={e => setField('delivery_city', e.target.value)}
                                        className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_city ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">State <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_state}
                                        onChange={e => setField('delivery_state', e.target.value)}
                                        className={`w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_state ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Pincode <span className="text-red-500">*</span></label>
                                <input
                                    value={form.delivery_pincode}
                                    onChange={e => setField('delivery_pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    className={`w-48 py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 ${errors.delivery_pincode ? 'border-red-500' : 'border-[var(--border-default)]'}`}
                                    placeholder="110001"
                                />
                                {errors.delivery_pincode && <p className="text-xs text-red-500 mt-1">{errors.delivery_pincode}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pricing Summary */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-50">
                                <div className="flex justify-between py-2">
                                    <span>Cards ({count} x {formatCurrency(PRICE_PER_CARD)})</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>GST ({GST_RATE}%)</span>
                                    <span>{formatCurrency(gst)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Shipping Charges</span>
                                    <span>{formatCurrency(shipping)}</span>
                                </div>
                                <div className="flex justify-between pt-3 mt-2 border-t border-[var(--border-default)] font-bold text-lg">
                                    <span>Total Payable</span>
                                    <span className="text-emerald-600">{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-800">
                                <p className="font-semibold mb-1">Payment Terms</p>
                                <p>• Advance payment: 50% for pre-filled cards</p>
                                <p>• Balance payment: 50% after delivery</p>
                                <p>• Payment via bank transfer or UPI</p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-50">
                                <p className="font-semibold mb-2">Order Summary</p>
                                <div className="space-y-1 text-sm">
                                    <div><span className="text-[var(--text-muted)]">School:</span> {schoolName}</div>
                                    <div><span className="text-[var(--text-muted)]">Card Type:</span> {ORDER_TYPES[form.order_type]?.label}</div>
                                    <div><span className="text-[var(--text-muted)]">Quantity:</span> {count} cards</div>
                                    <div><span className="text-[var(--text-muted)]">Total Amount:</span> <strong>{formatCurrency(total)}</strong></div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50">
                                <p className="font-semibold mb-2">Delivery Address</p>
                                <div className="text-sm">
                                    <p>{form.delivery_name}</p>
                                    <p>{form.delivery_phone}</p>
                                    <p>{form.delivery_address}</p>
                                    <p>{form.delivery_city}, {form.delivery_state} - {form.delivery_pincode}</p>
                                </div>
                            </div>
                            {form.notes && (
                                <div className="p-4 rounded-xl bg-amber-50">
                                    <p className="font-semibold mb-1">Notes</p>
                                    <p className="text-sm">{form.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-between">
                    <button onClick={step === 1 ? onClose : back} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 4 ? (
                        <button onClick={next} className="px-5 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700">
                            Continue →
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50">
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Submit Order
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

<<<<<<< HEAD
// ─── Request List Card ────────────────────────────────────────────────────────
function RequestCard({ request, isExpanded, onToggle, canApprove, onApprove, onReject }) {
    const s = STATUS_STYLE[request.status];
    const addr = request.delivery_address;
    const { total } = calcPricing(request.card_count);

    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <s.Icon size={22} style={{ color: s.color }} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A' }}>{request.school_name}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', background: '#F1F5F9', padding: '2px 7px', borderRadius: 5, color: '#64748B' }}>{request.school_id}</span>
                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <s.Icon size={10} /> {s.label}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: '0.78rem', color: '#64748B', marginBottom: 10 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><CreditCard size={13} /><strong style={{ color: '#2563EB' }}>{request.card_count}</strong> cards</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><IndianRupee size={13} /><strong style={{ color: '#059669' }}>{fmt(total)}</strong></span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Layers size={13} />{request.card_type === 'predetailed' ? 'Pre-detailed' : 'Blank'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Palette size={13} />{request.design_type === 'customized' ? 'Custom Design' : 'Default'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} />{addr.city}, {addr.state}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} />{formatRelativeTime(request.created_at)}</span>
                        </div>

                        <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 13px', borderLeft: `3px solid ${s.color}`, fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                            {request.notes}
                        </div>

                        {request.status === 'REJECTED' && request.reject_reason && (
                            <div style={{ marginTop: 10, padding: '9px 13px', background: '#FEF2F2', borderRadius: 8, fontSize: '0.78rem', color: '#991B1B', borderLeft: '3px solid #EF4444' }}>
                                <strong>Rejection reason:</strong> {request.reject_reason}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                        {request.status === 'PENDING' && canApprove && (
                            <>
                                <button onClick={() => onApprove(request.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid #10B981', background: '#ECFDF5', color: '#047857', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                                    <CheckCircle size={13} /> Approve
                                </button>
                                <button onClick={() => onReject(request.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid #EF4444', background: '#FEF2F2', color: '#B91C1C', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                                    <XCircle size={13} /> Reject
                                </button>
                            </>
                        )}
                        <button onClick={() => onToggle(request.id)} style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                            <ChevronDown size={15} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid #F1F5F9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                        <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Delivery Address</div>
                            <address style={{ fontStyle: 'normal', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6, background: '#F8FAFC', padding: '10px 12px', borderRadius: 8 }}>
                                {addr.line1}{addr.line2 && <><br />{addr.line2}</>}<br />
                                {addr.city}, {addr.state}<br />PIN: {addr.pincode}
                            </address>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Order Breakdown</div>
                            {[
                                ['Cards', fmt(request.card_count * PRICE_PER_CARD)],
                                ['GST (18%)', fmt(request.card_count * PRICE_PER_CARD * 0.18)],
                                ['Shipping', fmt(SHIPPING_FLAT)],
                            ].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: '#F8FAFC', borderRadius: 7, marginBottom: 5 }}>
                                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{l}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 10px', background: '#ECFDF5', borderRadius: 8, border: '1px solid #10B981', marginTop: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>Total</span>
                                <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#059669' }}>{fmt(calcPricing(request.card_count).total)}</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Timeline</div>
                            <div style={{ padding: '7px 10px', background: '#F8FAFC', borderRadius: 7, marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Submitted</span>
                                <span style={{ fontSize: '0.78rem' }}>{formatDate(request.created_at)}</span>
                            </div>
                            {request.reviewed_at && (
                                <div style={{ padding: '7px 10px', background: '#F8FAFC', borderRadius: 7, display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Reviewed</span>
                                    <span style={{ fontSize: '0.78rem' }}>{formatDate(request.reviewed_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Status Tabs ──────────────────────────────────────────────────────────────
function StatusTabs({ statusFilter, setStatusFilter, counts }) {
    const tabs = [
        { key: 'ALL', label: 'All', icon: Package, count: counts.ALL },
        { key: 'PENDING', label: 'Pending', icon: Clock, count: counts.PENDING },
        { key: 'APPROVED', label: 'Approved', icon: CheckCircle, count: counts.APPROVED },
        { key: 'REJECTED', label: 'Rejected', icon: XCircle, count: counts.REJECTED },
    ];
    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1.5px solid #F1F5F9', paddingBottom: 14 }}>
            {tabs.map(tab => {
                const active = statusFilter === tab.key;
                return (
                    <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{
                        display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
                        borderRadius: 10, background: active ? '#2563EB' : '#fff',
                        border: active ? 'none' : '1.5px solid #E2E8F0',
                        color: active ? '#fff' : '#64748B', fontWeight: active ? 700 : 500,
                        fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                    }}>
                        <tab.icon size={14} />
                        {tab.label}
                        {tab.count > 0 && (
                            <span style={{ background: active ? 'rgba(255,255,255,0.25)' : '#F1F5F9', borderRadius: 20, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
=======
// ─── Main Component ───────────────────────────────────────────────────────────
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
export default function CardRequests() {
    const { user } = useAuth();
    const currentSchoolId = user?.school_id || user?.schoolId || 'sch_001';
    const currentSchoolName = user?.school_name || user?.schoolName || 'Green Valley School';

    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [expandedId, setExpandedId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

<<<<<<< HEAD
    const myRequests = requests.filter(r => r.school_id === currentSchoolId);
    const filtered = myRequests.filter(req => {
        const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;
        let matchDate = true;
        if (dateRange.start) { if (new Date(req.created_at) < new Date(dateRange.start)) matchDate = false; }
        if (dateRange.end && matchDate) {
            const end = new Date(dateRange.end); end.setHours(23, 59, 59);
            if (new Date(req.created_at) > end) matchDate = false;
        }
        return matchStatus && matchDate;
=======
    const myOrders = orders.filter(o => o.school_id === currentSchoolId);

    const filtered = myOrders.filter(o => {
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchStatus;
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
    });

    const counts = {
        ALL: myOrders.length,
        PENDING: myOrders.filter(o => o.status === 'PENDING').length,
        PROCESSING: myOrders.filter(o => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length,
        SHIPPED: myOrders.filter(o => o.status === 'SHIPPED').length,
        DELIVERED: myOrders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: myOrders.filter(o => o.status === 'CANCELLED').length,
    };

<<<<<<< HEAD
    const approve = (id) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));
        toast?.success?.('Request approved successfully');
    };

    const reject = (id) => {
        if (!rejectReason.trim()) { toast?.error?.('Please provide a rejection reason'); return; }
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: rejectReason, reviewed_at: new Date().toISOString() } : r));
        setRejectingId(null); setRejectReason('');
        toast?.success?.('Request rejected');
    };

    const handleNewRequest = (form) => {
        const newReq = {
            id: 'cr' + Date.now(), school_id: currentSchoolId, school_name: currentSchoolName,
            card_count: Number(form.card_count), card_type: form.card_type, design_type: form.design_type,
            notes: form.notes.trim(),
            delivery_address: { line1: form.line1.trim(), line2: form.line2.trim(), city: form.city.trim(), state: form.state.trim(), pincode: form.pincode.trim() },
            status: 'PENDING', created_at: new Date().toISOString(),
        };
        setRequests(prev => [newReq, ...prev]);
        toast?.success?.('Card request submitted successfully');
    };

    const rejectingReq = myRequests.find(r => r.id === rejectingId);

    return (
        <div style={css.page}>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
                <div>
                    <h1 style={{ fontSize: '1.625rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Card Requests
                    </h1>
                    <p style={{ color: '#64748B', marginTop: 3, fontSize: '0.875rem' }}>
                        Track and manage your school's physical ID card orders
                    </p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', fontFamily: 'inherit', fontSize: '0.875rem' }}
                >
                    <Plus size={16} /> New Request
                </button>
            </div>

            {/* Date Filter */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
                <Calendar size={16} style={{ color: '#64748B', marginBottom: 2 }} />
                {[['start', 'From Date'], ['end', 'To Date']].map(([key, lbl]) => (
                    <div key={key} style={{ flex: 1, minWidth: 170 }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 5 }}>{lbl}</label>
                        <input type="date" value={dateRange[key]} onChange={e => setDateRange(d => ({ ...d, [key]: e.target.value }))}
                            style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                ))}
                <button onClick={() => setDateRange({ start: '', end: '' })} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit', color: '#64748B', fontWeight: 600 }}>
                    Clear
                </button>
            </div>

            <StatusTabs statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />

            {filtered.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '56px 40px', textAlign: 'center' }}>
                    <Package size={44} style={{ color: '#CBD5E1', marginBottom: 14 }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>No card requests found</h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>
                        {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Click "New Request" to place your first card order'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.map(req => (
                        <RequestCard
                            key={req.id} request={req}
                            isExpanded={expandedId === req.id}
                            onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
                            canApprove={can?.('cardRequests.approve')}
                            onApprove={approve}
                            onReject={(id) => setRejectingId(id)}
=======
    const handleCreateOrder = (newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
        toast.success('Card order submitted successfully');
    };

    const totalSpent = myOrders
        .filter(o => o.status === 'DELIVERED' || o.status === 'SHIPPED')
        .reduce((sum, o) => sum + o.grand_total, 0);

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-6">
            {showCreateModal && (
                <CreateOrderModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateOrder}
                    schoolId={currentSchoolId}
                    schoolName={currentSchoolName}
                />
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                            <CreditCard size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Card Orders</h1>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">Request and track physical ID cards for your school</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg hover:opacity-90"
                >
                    <Plus size={16} /> New Order
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-brand-600">{myOrders.length}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Orders</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{counts.PENDING}</div>
                    <div className="text-xs text-[var(--text-muted)]">Pending</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{counts.DELIVERED}</div>
                    <div className="text-xs text-[var(--text-muted)]">Delivered</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalSpent)}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Spent</div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap mb-6 border-b border-[var(--border-default)] pb-3">
                {[
                    { key: 'ALL', label: 'All Orders', count: counts.ALL },
                    { key: 'PENDING', label: 'Pending', count: counts.PENDING, color: '#F59E0B' },
                    { key: 'PROCESSING', label: 'Processing', count: counts.PROCESSING, color: '#8B5CF6' },
                    { key: 'SHIPPED', label: 'Shipped', count: counts.SHIPPED, color: '#0EA5E9' },
                    { key: 'DELIVERED', label: 'Delivered', count: counts.DELIVERED, color: '#10B981' },
                    { key: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED, color: '#EF4444' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === tab.key
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-white border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-slate-50'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center">
                    <Package size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">No orders found</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                        {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Create your first card order to get started'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isExpanded={expandedId === order.id}
                            onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
                        />
                    ))}
                </div>
            )}
<<<<<<< HEAD

            <NewRequestModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSubmit={handleNewRequest}
                schoolId={currentSchoolId}
                schoolName={currentSchoolName}
            />

            {/* Reject Modal */}
            {rejectingReq && (
                <div style={css.overlay}>
                    <div style={{ background: '#fff', borderRadius: 20, padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.18)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 6, color: '#0F172A' }}>Reject Request</h3>
                        <p style={{ color: '#64748B', marginBottom: 18, fontSize: '0.875rem' }}>
                            Provide a reason for rejecting <strong>{rejectingReq.school_name}'s</strong> request
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            style={{ width: '100%', padding: '12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: '0.875rem', resize: 'vertical', marginBottom: 20, fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setRejectingId(null); setRejectReason(''); }} style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button onClick={() => reject(rejectingReq.id)} style={{ padding: '10px 20px', borderRadius: 9, background: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <XCircle size={14} /> Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
=======
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
        </div>
    );
}
