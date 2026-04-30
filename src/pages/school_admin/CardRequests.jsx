/**
 * SCHOOL ADMIN — CARD REQUESTS (Physical ID Card Orders)
 *
 * Professional redesign with refined spacing, typography, and interaction details.
 * All business logic and mock data remain unchanged.
 */

import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Search,
    CreditCard, Plus, MapPin, Building2, FileText,
    X, Package, ChevronLeft, ChevronRight, Receipt, ClipboardCheck,
    IndianRupee, Truck, Filter, Calendar, Download, Eye,
    Phone, User, Mail, AlertCircle, Check, Loader2,
    TrendingUp, Shield, AlertTriangle, RotateCcw,
    Users, Hash, PhoneCall, MapPinHouse
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum, formatDate, formatDateTime } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';
import { toast } from '#utils/Toast.js';

// ─── Design Tokens (use CSS variables where possible) ────────────────────────
const COLORS = {
    brand: {
        50: 'var(--color-brand-50, #EFF6FF)',
        100: 'var(--color-brand-100, #DBEAFE)',
        500: 'var(--color-brand-500, #3B82F6)',
        600: 'var(--color-brand-600, #2563EB)',
        700: 'var(--color-brand-700, #1D4ED8)',
    },
    slate: {
        50: 'var(--color-slate-50, #F8FAFC)',
        100: 'var(--color-slate-100, #F1F5F9)',
        200: 'var(--color-slate-200, #E2E8F0)',
        300: 'var(--color-slate-300, #CBD5E1)',
        400: 'var(--color-slate-400, #94A3B8)',
        500: 'var(--color-slate-500, #64748B)',
        600: 'var(--color-slate-600, #475569)',
        700: 'var(--color-slate-700, #334155)',
    },
    border: 'var(--border-default, #E2E8F0)',
    text: {
        primary: 'var(--text-primary, #0F172A)',
        secondary: 'var(--text-secondary, #475569)',
        muted: 'var(--text-muted, #94A3B8)',
    },
    success: { bg: '#ECFDF5', text: '#065F46', light: '#D1FAE5' },
    warning: { bg: '#FFFBEB', text: '#92400E', light: '#FEF3C7' },
    danger: { bg: '#FEF2F2', text: '#991B1B', light: '#FEE2E2' },
    info: { bg: '#F0F9FF', text: '#075985', light: '#E0F2FE' },
};

// ─── Constants (unchanged) ────────────────────────────────────────────────────
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

const PRICE_PER_CARD = 14900; // paise
const GST_RATE = 18;
const SHIPPING_FLAT = 15000;

// ─── Mock Data (unchanged) ─────────────────────────────────────────────────────
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
const calcPricing = (count) => {
    const subtotal = count * PRICE_PER_CARD;
    const gst = Math.round(subtotal * GST_RATE / 100);
    const total = subtotal + gst + SHIPPING_FLAT;
    return { subtotal, gst, shipping: SHIPPING_FLAT, total };
};

// ─── Badge Components (refined) ───────────────────────────────────────────────
const OrderStatusBadge = ({ status }) => {
    const cfg = ORDER_STATUS[status] || ORDER_STATUS.PENDING;
    const Icon = cfg.Icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{
                background: cfg.bg,
                color: cfg.color,
                borderColor: `${cfg.color}30`,
                boxShadow: `0 1px 2px ${cfg.color}10`,
            }}
        >
            <Icon size={12} /> {cfg.label}
        </span>
    );
};

const PaymentStatusBadge = ({ status }) => {
    const cfg = PAYMENT_STATUS[status] || PAYMENT_STATUS.UNPAID;
    const Icon = cfg.Icon;
    return (
        <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}
        >
            <Icon size={12} /> {cfg.label}
        </span>
    );
};

// ─── Order Card (redesigned) ──────────────────────────────────────────────────
const OrderCard = ({ order, isExpanded, onToggleExpand }) => {
    const statusCfg = ORDER_STATUS[order.status] || ORDER_STATUS.PENDING;
    const orderTypeCfg = ORDER_TYPES[order.order_type] || ORDER_TYPES.PRE_DETAILS;
    const TypeIcon = orderTypeCfg.icon;

    return (
        <div
            className="bg-white rounded-xl border overflow-hidden transition-all duration-200"
            style={{
                borderColor: COLORS.border,
                boxShadow: isExpanded
                    ? '0 8px 30px rgba(0,0,0,0.08)'
                    : '0 2px 10px rgba(0,0,0,0.03)',
            }}
        >
            {/* Main row */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${statusCfg.color}15` }}
                    >
                        <TypeIcon size={22} color={statusCfg.color} />
                    </div>

                    {/* Core info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <code className="font-mono font-bold text-sm bg-slate-100 px-2 py-1 rounded-lg">
                                {order.order_number}
                            </code>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ background: `${statusCfg.color}15`, color: statusCfg.color }}
                            >
                                {orderTypeCfg.label}
                            </span>
                            <OrderStatusBadge status={order.status} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                            <div>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cards</div>
                                <div className="font-semibold text-slate-800 mt-1 flex items-center gap-1">
                                    <Hash size={14} className="text-slate-400" />
                                    {order.student_count.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Amount</div>
                                <div className="font-bold text-brand-600 mt-1">
                                    {formatCurrency(order.grand_total)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Payment</div>
                                <div className="mt-1">
                                    <PaymentStatusBadge status={order.payment_status} />
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ordered On</div>
                                <div className="font-medium text-slate-700 mt-1">
                                    {formatDate(order.created_at)}
                                </div>
                            </div>
                        </div>

                        {order.notes && (
                            <div
                                className="mt-4 p-3 rounded-lg border-l-4 text-sm leading-relaxed"
                                style={{
                                    background: COLORS.warning.bg,
                                    borderColor: COLORS.warning.text + '40',
                                    color: COLORS.warning.text,
                                }}
                            >
                                {order.notes}
                            </div>
                        )}
                    </div>

                    {/* Expand button */}
                    <button
                        onClick={() => onToggleExpand(order.id)}
                        className="p-2 rounded-lg hover:bg-slate-50 transition-colors flex-shrink-0"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                    <div className="mt-6 pt-5 border-t" style={{ borderColor: COLORS.border }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Delivery address */}
                            <div
                                className="p-4 rounded-xl"
                                style={{ background: COLORS.slate[50] }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPinHouse size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Delivery
                                    </span>
                                </div>
                                <p className="font-semibold text-slate-800">{order.delivery_name}</p>
                                <p className="text-sm text-slate-500">{order.delivery_phone}</p>
                                <address className="text-sm text-slate-600 not-italic mt-2 leading-relaxed">
                                    {order.delivery_address}<br />
                                    {order.delivery_city}, {order.delivery_state} – {order.delivery_pincode}
                                </address>
                            </div>

                            {/* Financial summary */}
                            <div
                                className="p-4 rounded-xl"
                                style={{ background: COLORS.slate[50] }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Receipt size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Financial Summary
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Unit Price:</span>
                                        <span className="font-medium">{formatCurrency(order.unit_price)}/card</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Subtotal:</span>
                                        <span>{formatCurrency(order.student_count * order.unit_price)}</span>
                                    </div>
                                    {order.advance_amount && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Advance Paid:</span>
                                            <span className="text-green-600 font-medium">
                                                {formatCurrency(order.advance_amount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t font-semibold" style={{ borderColor: COLORS.border }}>
                                        <span>Balance Due:</span>
                                        <span className="text-amber-600">
                                            {formatCurrency(order.balance_amount || order.grand_total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div
                                className="p-4 rounded-xl"
                                style={{ background: COLORS.slate[50] }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Timeline
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Created:</span>
                                        <span className="font-medium">{formatDateTime(order.created_at)}</span>
                                    </div>
                                    {order.confirmed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Confirmed:</span>
                                            <span>{formatDateTime(order.confirmed_at)}</span>
                                        </div>
                                    )}
                                    {order.shipped_at && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Shipped:</span>
                                            <span>{formatDateTime(order.shipped_at)}</span>
                                        </div>
                                    )}
                                    {order.delivered_at && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Delivered:</span>
                                            <span>{formatDateTime(order.delivered_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 text-right border-t" style={{ borderColor: COLORS.border }}>
                            <span className="text-xs text-slate-400">
                                Ordered via: {order.order_channel === 'DASHBOARD' ? 'Dashboard' : 'Phone Call'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Create Order Modal (redesigned) ──────────────────────────────────────────
const CreateOrderModal = ({ isOpen, onClose, onSubmit, schoolId, schoolName }) => {
    // ... (state and validation unchanged)
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

    const setField = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => ({ ...e, [key]: '' }));
    };

    // Validation functions unchanged...
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

    const steps = [
        { id: 1, label: 'Order Details', icon: FileText },
        { id: 2, label: 'Delivery', icon: MapPin },
        { id: 3, label: 'Pricing', icon: IndianRupee },
        { id: 4, label: 'Review', icon: ClipboardCheck },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4 backdrop-blur-sm"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.2s ease' }}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'slideUp 0.25s ease' }}
            >
                {/* Header */}
                <div
                    className="sticky top-0 bg-white px-6 py-5 border-b z-10"
                    style={{ borderColor: COLORS.border }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-xl font-bold text-slate-900 m-0">New Card Order</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Request physical ID cards for your students</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Step indicator with connecting lines */}
                    <div className="mt-6 flex justify-between items-start">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex-1 flex flex-col items-center relative">
                                {idx > 0 && (
                                    <div
                                        className="absolute top-5 left-0 right-1/2 h-0.5 transition-colors duration-300"
                                        style={{
                                            background: step > s.id ? COLORS.brand[600] : COLORS.slate[200],
                                            width: 'calc(100% - 2.5rem)',
                                            left: 'calc(-50% + 1.25rem)',
                                        }}
                                    />
                                )}
                                <div
                                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                                        step >= s.id
                                            ? 'bg-brand-600 text-white shadow-md'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                                </div>
                                <p
                                    className={`text-xs mt-2 font-semibold ${
                                        step >= s.id ? 'text-brand-600' : 'text-slate-400'
                                    }`}
                                >
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Step 1: Order Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    Card Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(ORDER_TYPES).map(([key, cfg]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setField('order_type', key)}
                                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                                form.order_type === key
                                                    ? 'border-brand-500 bg-brand-50 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <cfg.icon
                                                size={22}
                                                className={`mb-2 ${
                                                    form.order_type === key ? 'text-brand-600' : 'text-slate-400'
                                                }`}
                                            />
                                            <div className="font-semibold text-sm">{cfg.label}</div>
                                            <div className="text-xs text-slate-500 mt-1">{cfg.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    Number of Cards <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={form.student_count}
                                    onChange={e => setField('student_count', e.target.value)}
                                    className={`w-full py-3 px-4 border rounded-xl text-sm outline-none transition-all focus:ring-4 focus:ring-brand-100 ${
                                        errors.student_count
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-slate-200 focus:border-brand-500'
                                    }`}
                                    placeholder="e.g., 250"
                                />
                                {errors.student_count && (
                                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.student_count}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-2">
                                    Unit price: {formatCurrency(PRICE_PER_CARD)} per card + GST
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    Notes / Reason
                                </label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setField('notes', e.target.value)}
                                    rows={3}
                                    className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 resize-none transition-all"
                                    placeholder="e.g., New admission batch, Replacement cards, Annual re-issuance..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Delivery (similar refinement) */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                        Contact Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={form.delivery_name}
                                        onChange={e => setField('delivery_name', e.target.value)}
                                        className={`w-full py-2.5 px-4 border rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 ${
                                            errors.delivery_name ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                        placeholder="e.g., Principal Office"
                                    />
                                    {errors.delivery_name && <p className="text-xs text-red-500 mt-1">{errors.delivery_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                        Contact Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={form.delivery_phone}
                                        onChange={e => setField('delivery_phone', e.target.value)}
                                        className={`w-full py-2.5 px-4 border rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 ${
                                            errors.delivery_phone ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                        placeholder="+91-XXXXX-XXXXX"
                                    />
                                    {errors.delivery_phone && <p className="text-xs text-red-500 mt-1">{errors.delivery_phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={form.delivery_address}
                                    onChange={e => setField('delivery_address', e.target.value)}
                                    rows={2}
                                    className={`w-full py-2.5 px-4 border rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 resize-none ${
                                        errors.delivery_address ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-500'
                                    }`}
                                    placeholder="Building name, street, landmark"
                                />
                                {errors.delivery_address && <p className="text-xs text-red-500 mt-1">{errors.delivery_address}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">City <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_city}
                                        onChange={e => setField('delivery_city', e.target.value)}
                                        className={`w-full py-2.5 px-4 border rounded-xl text-sm outline-none ${
                                            errors.delivery_city ? 'border-red-500 bg-red-50' : 'border-slate-200'
                                        } focus:ring-4 focus:ring-brand-100 focus:border-brand-500`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">State <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.delivery_state}
                                        onChange={e => setField('delivery_state', e.target.value)}
                                        className={`w-full py-2.5 px-4 border rounded-xl text-sm outline-none ${
                                            errors.delivery_state ? 'border-red-500 bg-red-50' : 'border-slate-200'
                                        } focus:ring-4 focus:ring-brand-100 focus:border-brand-500`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Pincode <span className="text-red-500">*</span></label>
                                <input
                                    value={form.delivery_pincode}
                                    onChange={e => setField('delivery_pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    className={`w-48 py-2.5 px-4 border rounded-xl text-sm outline-none ${
                                        errors.delivery_pincode ? 'border-red-500 bg-red-50' : 'border-slate-200'
                                    } focus:ring-4 focus:ring-brand-100 focus:border-brand-500`}
                                    placeholder="110001"
                                />
                                {errors.delivery_pincode && <p className="text-xs text-red-500 mt-1">{errors.delivery_pincode}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pricing */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div
                                className="p-5 rounded-xl"
                                style={{ background: COLORS.slate[50] }}
                            >
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-slate-600">Cards ({count} × {formatCurrency(PRICE_PER_CARD)})</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-slate-600">GST ({GST_RATE}%)</span>
                                    <span className="font-medium">{formatCurrency(gst)}</span>
                                </div>
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-slate-600">Shipping Charges</span>
                                    <span className="font-medium">{formatCurrency(shipping)}</span>
                                </div>
                                <div
                                    className="flex justify-between pt-4 mt-3 font-bold text-lg"
                                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                                >
                                    <span>Total Payable</span>
                                    <span className="text-green-600">{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <div
                                className="p-4 rounded-xl text-sm leading-relaxed"
                                style={{ background: COLORS.info.bg, color: COLORS.info.text }}
                            >
                                <p className="font-semibold mb-1">Payment Terms</p>
                                <p>• 50% advance required for pre-filled cards</p>
                                <p>• Balance payment after delivery</p>
                                <p>• Pay via bank transfer or UPI</p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <div className="p-5 rounded-xl" style={{ background: COLORS.slate[50] }}>
                                <p className="font-semibold mb-3 text-slate-800">Order Summary</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">School:</span>
                                        <span className="font-medium">{schoolName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Card Type:</span>
                                        <span className="font-medium">{ORDER_TYPES[form.order_type]?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Quantity:</span>
                                        <span className="font-medium">{count} cards</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: COLORS.border }}>
                                        <span className="text-slate-700 font-semibold">Total Amount:</span>
                                        <span className="font-bold text-brand-600">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl" style={{ background: COLORS.slate[50] }}>
                                <p className="font-semibold mb-3 text-slate-800">Delivery Address</p>
                                <div className="text-sm text-slate-600">
                                    <p>{form.delivery_name}</p>
                                    <p>{form.delivery_phone}</p>
                                    <p className="mt-1">{form.delivery_address}</p>
                                    <p>{form.delivery_city}, {form.delivery_state} – {form.delivery_pincode}</p>
                                </div>
                            </div>
                            {form.notes && (
                                <div
                                    className="p-4 rounded-xl border-l-4"
                                    style={{
                                        background: COLORS.warning.bg,
                                        borderColor: COLORS.warning.text + '40',
                                        color: COLORS.warning.text,
                                    }}
                                >
                                    <p className="font-semibold mb-1">Notes</p>
                                    <p className="text-sm">{form.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-between"
                    style={{ borderColor: COLORS.border }}
                >
                    <button
                        onClick={step === 1 ? onClose : back}
                        className="px-5 py-2.5 rounded-xl border font-medium transition-colors"
                        style={{
                            borderColor: COLORS.border,
                            color: COLORS.text.secondary,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = COLORS.slate[50]}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 4 ? (
                        <button
                            onClick={next}
                            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-md hover:bg-brand-700 transition-colors"
                        >
                            Continue →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-md flex items-center gap-2 disabled:opacity-70 hover:bg-emerald-700 transition-colors"
                        >
                            {submitting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            Submit Order
                        </button>
                    )}
                </div>
            </div>

            {/* Animation keyframes */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
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

    const tabItems = [
        { key: 'ALL', label: 'All Orders', count: counts.ALL },
        { key: 'PENDING', label: 'Pending', count: counts.PENDING, color: '#F59E0B' },
        { key: 'PROCESSING', label: 'Processing', count: counts.PROCESSING, color: '#8B5CF6' },
        { key: 'SHIPPED', label: 'Shipped', count: counts.SHIPPED, color: '#0EA5E9' },
        { key: 'DELIVERED', label: 'Delivered', count: counts.DELIVERED, color: '#10B981' },
        { key: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED, color: '#EF4444' },
    ];

    return (
        <div className="max-w-[1060px] mx-auto px-4 py-8">
            {showCreateModal && (
                <CreateOrderModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateOrder}
                    schoolId={currentSchoolId}
                    schoolName={currentSchoolName}
                />
            )}

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <CreditCard size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-slate-900 m-0">Card Orders</h1>
                        <p className="text-slate-500 mt-1">Request and track physical ID cards for your school</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                    <Plus size={18} /> New Order
                </button>
            </div>

            {/* ── Stats Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <Hash size={18} className="text-brand-500 mb-2" />
                    <div className="text-2xl font-bold text-brand-600">{myOrders.length}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Orders</div>
                </div>
                <div className="bg-white rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <Clock size={18} className="text-amber-500 mb-2" />
                    <div className="text-2xl font-bold text-amber-600">{counts.PENDING}</div>
                    <div className="text-xs text-slate-500 mt-1">Pending</div>
                </div>
                <div className="bg-white rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle size={18} className="text-emerald-500 mb-2" />
                    <div className="text-2xl font-bold text-emerald-600">{counts.DELIVERED}</div>
                    <div className="text-xs text-slate-500 mt-1">Delivered</div>
                </div>
                <div className="bg-white rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <IndianRupee size={18} className="text-purple-500 mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalSpent)}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Spent</div>
                </div>
            </div>

            {/* ── Status Tabs ──────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-3" style={{ borderColor: COLORS.border }}>
                {tabItems.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            statusFilter === tab.key
                                ? 'bg-brand-600 text-white shadow-md'
                                : 'bg-white border text-slate-600 hover:bg-slate-50'
                        }`}
                        style={statusFilter !== tab.key ? { borderColor: COLORS.border } : {}}
                    >
                        {tab.label}
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                                statusFilter === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Orders List ──────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border py-16 text-center shadow-sm">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="font-semibold text-slate-700 mb-1">No orders found</h3>
                    <p className="text-sm text-slate-500">
                        {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Create your first card order to get started'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
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