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
import { toast } from '#utils/toast.js';

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
                </div>

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
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Create Order Modal ───────────────────────────────────────────────────────
const CreateOrderModal = ({ isOpen, onClose, onSubmit, schoolId, schoolName }) => {
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
        if (!form.student_count || isNaN(form.student_count) || Number(form.student_count) < 1) {
            e.student_count = 'Enter valid card count (min 1)';
        } else if (Number(form.student_count) > 500) {
            e.student_count = 'Maximum 500 cards per order. For bulk orders, contact support.';
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
    };

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
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CardRequests() {
    const { user } = useAuth();
    const currentSchoolId = user?.school_id || user?.schoolId || 'sch_001';
    const currentSchoolName = user?.school_name || user?.schoolName || 'Green Valley School';

    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [expandedId, setExpandedId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const myOrders = orders.filter(o => o.school_id === currentSchoolId);

    const filtered = myOrders.filter(o => {
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchStatus;
    });

    const counts = {
        ALL: myOrders.length,
        PENDING: myOrders.filter(o => o.status === 'PENDING').length,
        PROCESSING: myOrders.filter(o => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length,
        SHIPPED: myOrders.filter(o => o.status === 'SHIPPED').length,
        DELIVERED: myOrders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: myOrders.filter(o => o.status === 'CANCELLED').length,
    };

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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
