/**
 * TOKEN ORDER PAGE - Super Admin
 * Manages physical card orders (CardOrder model from schema)
 * 
 * CardOrder fields from schema:
 * - order_number, order_type (BLANK/PRE_DETAILS), status, payment_status
 * - advance_amount, balance_amount, student_count
 * - delivery_address, delivery_city, delivery_state, delivery_pincode
 * - order_channel (DASHBOARD/CALL), confirmed_by, confirmed_at
 * - tokens_generated_at, card_design_at, print_complete_at
 * - vendor_id, grand_total, unit_price
 * - subscription_id relation
 */

import { useState, useEffect } from 'react';
import {
    CreditCard, Plus, Search, Filter, ChevronDown, X,
    Building2, MapPin, FileText, Hash, Clock, CheckCircle2,
    XCircle, Truck, AlertCircle, Eye, MoreHorizontal,
    ArrowUpDown, Package, TrendingUp, Loader2, SlidersHorizontal,
    CalendarDays, BadgeCheck, Phone, DollarSign, Users,
    Printer, Send, Check, AlertTriangle, RefreshCw,
    UserCheck, Building, FileCheck, Zap, Shield, RotateCcw, Monitor
} from 'lucide-react';

// ── Mock Data (Matches CardOrder Schema) ──────────────────────────────────────
const MOCK_SCHOOLS = [
    { id: 'SCH001', name: 'Greenwood International School', code: 'GWI-2024-001', city: 'New Delhi', state: 'Delhi', pincode: '110075' },
    { id: 'SCH002', name: 'Sunrise Academy', code: 'SRA-2024-002', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    { id: 'SCH003', name: 'Delhi Public School - R3', code: 'DPS-2024-003', city: 'New Delhi', state: 'Delhi', pincode: '110022' },
    { id: 'SCH004', name: 'St. Mary\'s Convent', code: 'SMC-2024-004', city: 'Kolkata', state: 'West Bengal', pincode: '700016' },
    { id: 'SCH005', name: 'Modern High School', code: 'MHS-2024-005', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
];

const SUBSCRIPTIONS = [
    { id: 'sub-001', school_id: 'SCH001', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 450 },
    { id: 'sub-002', school_id: 'SCH002', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 320 },
    { id: 'sub-003', school_id: 'SCH003', plan: 'CUSTOM', unit_price_snapshot: 17500, student_count: 780 },
    { id: 'sub-004', school_id: 'SCH004', plan: 'BASIC', unit_price_snapshot: 14900, student_count: 150 },
    { id: 'sub-005', school_id: 'SCH005', plan: 'PREMIUM', unit_price_snapshot: 19900, student_count: 280 },
];

const ORDER_STATUSES = {
    PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', icon: Clock, order: 1 },
    CONFIRMED: { label: 'Confirmed', color: '#6366F1', bg: '#EEF2FF', icon: CheckCircle2, order: 2 },
    PAYMENT_PENDING: { label: 'Payment Pending', color: '#F97316', bg: '#FFF7ED', icon: DollarSign, order: 3 },
    ADVANCE_RECEIVED: { label: 'Advance Received', color: '#8B5CF6', bg: '#F5F3FF', icon: BadgeCheck, order: 4 },
    TOKEN_GENERATED: { label: 'Tokens Generated', color: '#0EA5E9', bg: '#E0F2FE', icon: Hash, order: 5 },
    CARD_DESIGN: { label: 'Card Design', color: '#EC4899', bg: '#FDF2F8', icon: Printer, order: 6 },
    DESIGN_APPROVED: { label: 'Design Approved', color: '#10B981', bg: '#ECFDF5', icon: Check, order: 7 },
    SENT_TO_VENDOR: { label: 'Sent to Vendor', color: '#14B8A6', bg: '#F0FDFA', icon: Send, order: 8 },
    PRINTING: { label: 'Printing', color: '#F59E0B', bg: '#FFFBEB', icon: Printer, order: 9 },
    PRINT_COMPLETE: { label: 'Print Complete', color: '#8B5CF6', bg: '#F5F3FF', icon: CheckCircle2, order: 10 },
    SHIPPED: { label: 'Shipped', color: '#0EA5E9', bg: '#E0F2FE', icon: Truck, order: 11 },
    DELIVERED: { label: 'Delivered', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2, order: 12 },
    COMPLETED: { label: 'Completed', color: '#059669', bg: '#ECFDF5', icon: BadgeCheck, order: 13 },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: XCircle, order: 99 },
    REFUNDED: { label: 'Refunded', color: '#6B7280', bg: '#F3F4F6', icon: RotateCcw, order: 100 },
};

const ORDER_TYPES = {
    BLANK: { label: 'Blank Cards', icon: CreditCard, description: 'Generic cards without student details' },
    PRE_DETAILS: { label: 'Pre-filled Cards', icon: FileText, description: 'Cards with student name, class, photo' },
};

const ORDER_CHANNELS = {
    DASHBOARD: { label: 'Dashboard', icon: Monitor, color: '#6366F1' },
    CALL: { label: 'Phone Call', icon: Phone, color: '#10B981' },
};

const PAYMENT_STATUS = {
    UNPAID: { label: 'Unpaid', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
    PARTIALLY_PAID: { label: 'Partial', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
    FULLY_PAID: { label: 'Fully Paid', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
    REFUNDED: { label: 'Refunded', color: '#6B7280', bg: '#F3F4F6', icon: RotateCcw },
};

const MOCK_ORDERS = [
    {
        id: 'ORD-2024-001',
        order_number: 'ORD-2024-001',
        order_type: 'PRE_DETAILS',
        status: 'DELIVERED',
        payment_status: 'FULLY_PAID',
        school_id: 'SCH001',
        school_name: 'Greenwood International School',
        school_code: 'GWI-2024-001',
        subscription_id: 'sub-001',
        student_count: 450,
        unit_price: 19900,
        advance_amount: 4477500,
        balance_amount: 4477500,
        grand_total: 8955000,
        delivery_name: 'Principal Office',
        delivery_phone: '+91-98765-43210',
        delivery_address: '14, Sector 21, Dwarka',
        delivery_city: 'New Delhi',
        delivery_state: 'Delhi',
        delivery_pincode: '110075',
        order_channel: 'DASHBOARD',
        confirmed_by: 'Rajesh Kumar',
        confirmed_at: '2024-11-12T10:30:00Z',
        tokens_generated_at: '2024-11-13T14:20:00Z',
        card_design_at: '2024-11-14T11:00:00Z',
        print_complete_at: '2024-11-16T16:30:00Z',
        notes: 'Deliver before semester start. Contact principal office.',
        created_at: '2024-11-10T09:15:00Z',
        updated_at: '2024-11-18T10:00:00Z',
    },
    {
        id: 'ORD-2024-002',
        order_number: 'ORD-2024-002',
        order_type: 'BLANK',
        status: 'SHIPPED',
        payment_status: 'PARTIALLY_PAID',
        school_id: 'SCH002',
        school_name: 'Sunrise Academy',
        school_code: 'SRA-2024-002',
        subscription_id: 'sub-002',
        student_count: 200,
        unit_price: 14900,
        advance_amount: 1490000,
        balance_amount: 1490000,
        grand_total: 2980000,
        delivery_name: 'Admin Block',
        delivery_phone: '+91-98765-43211',
        delivery_address: '45 MG Road',
        delivery_city: 'Bengaluru',
        delivery_state: 'Karnataka',
        delivery_pincode: '560001',
        order_channel: 'CALL',
        confirmed_by: 'Priya Sharma',
        confirmed_at: '2024-11-15T15:45:00Z',
        tokens_generated_at: '2024-11-16T09:30:00Z',
        card_design_at: null,
        print_complete_at: null,
        notes: 'Fragile - handle with care.',
        created_at: '2024-11-14T11:20:00Z',
        updated_at: '2024-11-20T08:00:00Z',
    },
    {
        id: 'ORD-2024-003',
        order_number: 'ORD-2024-003',
        order_type: 'PRE_DETAILS',
        status: 'TOKEN_GENERATED',
        payment_status: 'UNPAID',
        school_id: 'SCH003',
        school_name: 'Delhi Public School - R3',
        school_code: 'DPS-2024-003',
        subscription_id: 'sub-003',
        student_count: 780,
        unit_price: 17500,
        advance_amount: null,
        balance_amount: 13650000,
        grand_total: 13650000,
        delivery_name: 'Principal Office',
        delivery_phone: '+91-98765-43212',
        delivery_address: 'Sector 23, R.K. Puram',
        delivery_city: 'New Delhi',
        delivery_state: 'Delhi',
        delivery_pincode: '110022',
        order_channel: 'DASHBOARD',
        confirmed_by: 'Amit Verma',
        confirmed_at: '2024-11-19T12:00:00Z',
        tokens_generated_at: '2024-11-20T10:15:00Z',
        card_design_at: null,
        print_complete_at: null,
        notes: '',
        created_at: '2024-11-18T16:30:00Z',
        updated_at: '2024-11-20T10:15:00Z',
    },
    {
        id: 'ORD-2024-004',
        order_number: 'ORD-2024-004',
        order_type: 'PRE_DETAILS',
        status: 'PENDING',
        payment_status: 'UNPAID',
        school_id: 'SCH004',
        school_name: 'St. Mary\'s Convent',
        school_code: 'SMC-2024-004',
        subscription_id: 'sub-004',
        student_count: 150,
        unit_price: 14900,
        advance_amount: null,
        balance_amount: 2235000,
        grand_total: 2235000,
        delivery_name: 'Admin Office',
        delivery_phone: '+91-98765-43213',
        delivery_address: '7 Park Street',
        delivery_city: 'Kolkata',
        delivery_state: 'West Bengal',
        delivery_pincode: '700016',
        order_channel: 'CALL',
        confirmed_by: null,
        confirmed_at: null,
        tokens_generated_at: null,
        card_design_at: null,
        print_complete_at: null,
        notes: 'Call before delivery: 9830012345',
        created_at: '2024-11-20T09:00:00Z',
        updated_at: '2024-11-20T09:00:00Z',
    },
    {
        id: 'ORD-2024-005',
        order_number: 'ORD-2024-005',
        order_type: 'BLANK',
        status: 'CANCELLED',
        payment_status: 'REFUNDED',
        school_id: 'SCH005',
        school_name: 'Modern High School',
        school_code: 'MHS-2024-005',
        subscription_id: 'sub-005',
        student_count: 150,
        unit_price: 19900,
        advance_amount: 1492500,
        balance_amount: 1492500,
        grand_total: 2985000,
        delivery_name: 'Admin Block',
        delivery_phone: '+91-98765-43214',
        delivery_address: '23 FC Road',
        delivery_city: 'Pune',
        delivery_state: 'Maharashtra',
        delivery_pincode: '411005',
        order_channel: 'DASHBOARD',
        confirmed_by: 'Neha Gupta',
        confirmed_at: '2024-11-09T14:20:00Z',
        tokens_generated_at: '2024-11-10T11:00:00Z',
        card_design_at: null,
        print_complete_at: null,
        notes: 'School requested cancellation',
        created_at: '2024-11-08T10:00:00Z',
        updated_at: '2024-11-09T16:00:00Z',
    },
    {
        id: 'ORD-2024-006',
        order_number: 'ORD-2024-006',
        order_type: 'PRE_DETAILS',
        status: 'PENDING',
        payment_status: 'UNPAID',
        school_id: 'SCH001',
        school_name: 'Greenwood International School',
        school_code: 'GWI-2024-001',
        subscription_id: 'sub-001',
        student_count: 300,
        unit_price: 19900,
        advance_amount: null,
        balance_amount: 5970000,
        grand_total: 5970000,
        delivery_name: 'Principal Office',
        delivery_phone: '+91-98765-43210',
        delivery_address: '14, Sector 21, Dwarka',
        delivery_city: 'New Delhi',
        delivery_state: 'Delhi',
        delivery_pincode: '110075',
        order_channel: 'CALL',
        confirmed_by: null,
        confirmed_at: null,
        tokens_generated_at: null,
        card_design_at: null,
        print_complete_at: null,
        notes: 'Urgent reorder for new batch.',
        created_at: '2024-11-21T08:30:00Z',
        updated_at: '2024-11-21T08:30:00Z',
    },
];

const formatCurrency = (amount) => `₹${(amount / 100).toLocaleString('en-IN')}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatDateTime = (date) => new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = ORDER_STATUSES[status];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}20` }}>
            <Icon size={11} strokeWidth={2.5} />
            {cfg.label}
        </span>
    );
};

const PaymentStatusBadge = ({ status }) => {
    const cfg = PAYMENT_STATUS[status];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
            <Icon size={10} />
            {cfg.label}
        </span>
    );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
    const [selectedStatus, setSelectedStatus] = useState(order?.status);
    const [updating, setUpdating] = useState(false);

    useEffect(() => { setSelectedStatus(order?.status); }, [order]);

    const handleUpdate = async () => {
        if (selectedStatus === order.status) return;
        setUpdating(true);
        await new Promise(r => setTimeout(r, 800));
        onStatusUpdate(order.id, selectedStatus);
        setUpdating(false);
        onClose();
    };

    if (!order) return null;

    const progressSteps = Object.values(ORDER_STATUSES)
        .filter(s => s.order < 90)
        .sort((a, b) => a.order - b.order);

    const currentStepIndex = progressSteps.findIndex(s => s.label === ORDER_STATUSES[order.status]?.label);
    const orderType = ORDER_TYPES[order.order_type];
    const orderChannel = ORDER_CHANNELS[order.order_channel];
    const TypeIcon = orderType?.icon;
    const ChannelIcon = orderChannel?.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Order Details</span>
                                <span className="text-xs text-[var(--text-muted)]">•</span>
                                <span className="text-xs font-mono text-brand-600">{order.order_number}</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">{order.school_name}</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{order.school_code}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Progress Timeline */}
                    <div className="p-4 rounded-xl bg-slate-50">
                        <p className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">Order Progress</p>
                        <div className="relative">
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
                            <div className="relative flex justify-between">
                                {progressSteps.slice(0, 6).map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.label} className="text-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${isCompleted ? 'bg-brand-600' : 'bg-slate-200'}`}>
                                                <Icon size={14} className={isCompleted ? 'text-white' : 'text-slate-500'} />
                                            </div>
                                            <p className="text-[0.6rem] font-medium text-[var(--text-muted)]">{step.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-slate-50">
                            <p className="text-xs text-[var(--text-muted)] mb-1">Order Type</p>
                            <div className="flex items-center gap-2">
                                {TypeIcon && <TypeIcon size={14} className="text-brand-600" />}
                                <span className="font-medium">{orderType?.label}</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50">
                            <p className="text-xs text-[var(--text-muted)] mb-1">Channel</p>
                            <div className="flex items-center gap-2">
                                {ChannelIcon && <ChannelIcon size={14} className="text-brand-600" />}
                                <span className="font-medium">{orderChannel?.label}</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50">
                            <p className="text-xs text-[var(--text-muted)] mb-1">Student Count</p>
                            <p className="font-bold text-lg">{order.student_count.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50">
                            <p className="text-xs text-[var(--text-muted)] mb-1">Unit Price</p>
                            <p className="font-bold text-lg">{formatCurrency(order.unit_price)}</p>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50">
                        <p className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">Financial Summary</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Grand Total:</span>
                                <span className="font-bold">{formatCurrency(order.grand_total)}</span>
                            </div>
                            {order.advance_amount && (
                                <div className="flex justify-between">
                                    <span className="text-sm">Advance Paid:</span>
                                    <span className="font-semibold text-emerald-600">{formatCurrency(order.advance_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-sm">Balance Due:</span>
                                <span className="font-bold text-amber-600">{formatCurrency(order.balance_amount || order.grand_total)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-purple-200">
                                <span className="text-sm">Payment Status:</span>
                                <PaymentStatusBadge status={order.payment_status} />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="p-4 rounded-xl bg-slate-50">
                        <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">Delivery Address</p>
                        <p className="text-sm font-medium">{order.delivery_name} • {order.delivery_phone}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{order.delivery_address}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}</p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Order Timeline</p>
                        <div className="space-y-2 text-sm">
                            {order.created_at && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Created:</span><span>{formatDateTime(order.created_at)}</span></div>}
                            {order.confirmed_at && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Confirmed by {order.confirmed_by}:</span><span>{formatDateTime(order.confirmed_at)}</span></div>}
                            {order.tokens_generated_at && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Tokens Generated:</span><span>{formatDateTime(order.tokens_generated_at)}</span></div>}
                            {order.card_design_at && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Card Design:</span><span>{formatDateTime(order.card_design_at)}</span></div>}
                            {order.print_complete_at && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Print Complete:</span><span>{formatDateTime(order.print_complete_at)}</span></div>}
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="p-3 rounded-xl bg-amber-50 border-l-4 border-amber-400">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Notes</p>
                            <p className="text-sm text-amber-800">{order.notes}</p>
                        </div>
                    )}

                    {/* Status Update */}
                    <div className="pt-4 border-t border-[var(--border-default)]">
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Update Order Status</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(ORDER_STATUSES).filter(([_, s]) => s.order < 90).map(([key, cfg]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedStatus(key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedStatus === key ? 'ring-2 ring-offset-1 ring-brand-500' : ''}`}
                                    style={{ background: cfg.bg, color: cfg.color }}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">Cancel</button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating || selectedStatus === order.status}
                                className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {updating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Create Order Modal ───────────────────────────────────────────────────────
const CreateOrderModal = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState({
        school_id: '',
        order_type: 'PRE_DETAILS',
        student_count: '',
        order_channel: 'DASHBOARD',
        delivery_name: '',
        delivery_phone: '',
        delivery_address: '',
        delivery_city: '',
        delivery_state: '',
        delivery_pincode: '',
        notes: '',
    });
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSchoolSelect = (schoolId) => {
        const school = MOCK_SCHOOLS.find(s => s.id === schoolId);
        const sub = SUBSCRIPTIONS.find(s => s.school_id === schoolId);
        setSelectedSchool(school);
        setSubscription(sub);
        setForm(prev => ({
            ...prev,
            school_id: schoolId,
            delivery_city: school?.city || '',
            delivery_state: school?.state || '',
            delivery_pincode: school?.pincode || '',
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.school_id) e.school_id = 'Select a school';
        if (!form.student_count || form.student_count < 1) e.student_count = 'Enter valid student count';
        if (!form.delivery_name) e.delivery_name = 'Delivery contact name required';
        if (!form.delivery_phone) e.delivery_phone = 'Delivery phone required';
        if (!form.delivery_address) e.delivery_address = 'Delivery address required';
        if (!form.delivery_city) e.delivery_city = 'City required';
        if (!form.delivery_state) e.delivery_state = 'State required';
        if (!form.delivery_pincode) e.delivery_pincode = 'Pincode required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));

        const unitPrice = subscription?.unit_price_snapshot || 14900;
        const studentCount = parseInt(form.student_count);
        const grandTotal = unitPrice * studentCount;
        const advanceAmount = form.order_type === 'PRE_DETAILS' ? Math.floor(grandTotal * 0.5) : null;

        const newOrder = {
            id: `ORD-2024-00${Math.floor(Math.random() * 90 + 10)}`,
            order_number: `ORD-2024-${Math.floor(Math.random() * 900 + 100)}`,
            order_type: form.order_type,
            status: 'PENDING',
            payment_status: 'UNPAID',
            school_id: form.school_id,
            school_name: selectedSchool?.name,
            school_code: selectedSchool?.code,
            subscription_id: subscription?.id,
            student_count: studentCount,
            unit_price: unitPrice,
            advance_amount: advanceAmount,
            balance_amount: grandTotal,
            grand_total: grandTotal,
            delivery_name: form.delivery_name,
            delivery_phone: form.delivery_phone,
            delivery_address: form.delivery_address,
            delivery_city: form.delivery_city,
            delivery_state: form.delivery_state,
            delivery_pincode: form.delivery_pincode,
            order_channel: form.order_channel,
            confirmed_by: null,
            confirmed_at: null,
            tokens_generated_at: null,
            card_design_at: null,
            print_complete_at: null,
            notes: form.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onSubmit(newOrder);
        setSubmitting(false);
        onClose();
    };

    const inputClass = (err) => `w-full py-2.5 px-3 border rounded-lg text-sm outline-none focus:border-brand-500 transition-colors ${err ? 'border-red-500' : 'border-[var(--border-default)]'}`;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">Create Token Order</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">Request physical cards for a school</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* School Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">School <span className="text-red-500">*</span></label>
                        <select value={form.school_id} onChange={e => handleSchoolSelect(e.target.value)} className={inputClass(errors.school_id)}>
                            <option value="">Select school...</option>
                            {MOCK_SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                        {errors.school_id && <p className="text-xs text-red-500 mt-1">{errors.school_id}</p>}
                    </div>

                    {/* Order Type & Channel */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Order Type</label>
                            <div className="flex gap-2">
                                {Object.entries(ORDER_TYPES).map(([key, cfg]) => (
                                    <button key={key} type="button" onClick={() => setForm(f => ({ ...f, order_type: key }))}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${form.order_type === key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]'}`}>
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Order Channel</label>
                            <div className="flex gap-2">
                                {Object.entries(ORDER_CHANNELS).map(([key, cfg]) => (
                                    <button key={key} type="button" onClick={() => setForm(f => ({ ...f, order_channel: key }))}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${form.order_channel === key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]'}`}>
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Student Count */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Number of Students/Cards <span className="text-red-500">*</span></label>
                        <input type="number" min={1} placeholder="e.g., 500" value={form.student_count} onChange={e => setForm(f => ({ ...f, student_count: e.target.value }))} className={inputClass(errors.student_count)} />
                        {subscription && <p className="text-xs text-[var(--text-muted)] mt-1">Unit price: {formatCurrency(subscription.unit_price_snapshot)} per card</p>}
                        {errors.student_count && <p className="text-xs text-red-500 mt-1">{errors.student_count}</p>}
                    </div>

                    {/* Delivery Contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="e.g., Principal Office" value={form.delivery_name} onChange={e => setForm(f => ({ ...f, delivery_name: e.target.value }))} className={inputClass(errors.delivery_name)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Contact Phone <span className="text-red-500">*</span></label>
                            <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.delivery_phone} onChange={e => setForm(f => ({ ...f, delivery_phone: e.target.value }))} className={inputClass(errors.delivery_phone)} />
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Address <span className="text-red-500">*</span></label>
                        <textarea rows={2} placeholder="Street address, landmark" value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))} className={inputClass(errors.delivery_address)} />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">City <span className="text-red-500">*</span></label>
                            <input type="text" value={form.delivery_city} onChange={e => setForm(f => ({ ...f, delivery_city: e.target.value }))} className={inputClass(errors.delivery_city)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">State <span className="text-red-500">*</span></label>
                            <input type="text" value={form.delivery_state} onChange={e => setForm(f => ({ ...f, delivery_state: e.target.value }))} className={inputClass(errors.delivery_state)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Pincode <span className="text-red-500">*</span></label>
                            <input type="text" value={form.delivery_pincode} onChange={e => setForm(f => ({ ...f, delivery_pincode: e.target.value }))} className={inputClass(errors.delivery_pincode)} />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Notes (Optional)</label>
                        <textarea rows={2} placeholder="Special instructions or remarks..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputClass(false)} />
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50">
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />}
                        Create Order
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TokenOrderPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const handleStatusUpdate = (id, newStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o));
    };

    const handleCreateOrder = (newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
    };

    const filtered = orders.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.school_name.toLowerCase().includes(q) || o.school_code.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        const matchType = typeFilter === 'all' || o.order_type === typeFilter;
        const matchPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;
        return matchSearch && matchStatus && matchType && matchPayment;
    }).sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'date_asc') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'qty_desc') return b.student_count - a.student_count;
        if (sortBy === 'qty_asc') return a.student_count - b.student_count;
        return 0;
    });

    const stats = {
        total: orders.length,
        totalCards: orders.reduce((s, o) => s + o.student_count, 0),
        pending: orders.filter(o => o.status === 'PENDING').length,
        processing: orders.filter(o => ['CONFIRMED', 'TOKEN_GENERATED', 'CARD_DESIGN', 'PRINTING'].includes(o.status)).length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        totalValue: orders.reduce((s, o) => s + o.grand_total, 0),
    };

    const activeFilterCount = [statusFilter !== 'all', typeFilter !== 'all', paymentFilter !== 'all'].filter(Boolean).length;

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} />}
            {showCreateModal && <CreateOrderModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateOrder} />}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                            <Package size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Token Orders</h1>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage physical card orders from schools</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg hover:opacity-90">
                    <Plus size={16} /> New Order
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Orders</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-brand-600">{stats.totalCards.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Cards</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                    <div className="text-xs text-[var(--text-muted)]">Pending</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                    <div className="text-xs text-[var(--text-muted)]">Processing</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalValue)}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Value</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-4">
                <div className="flex gap-3 items-center flex-wrap">
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, school name, or code..." className="w-full py-2 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium ${showFilters || activeFilterCount ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]'}`}>
                        <Filter size={13} /> Filters {activeFilterCount > 0 && <span className="bg-brand-600 text-white rounded-full px-1.5 text-xs">{activeFilterCount}</span>}
                    </button>
                    <div className="relative">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="py-2 pl-3 pr-8 border border-[var(--border-default)] rounded-lg text-sm bg-white appearance-none cursor-pointer">
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="qty_desc">Most Cards</option>
                            <option value="qty_asc">Least Cards</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                {showFilters && (
                    <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--border-default)] flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-muted)]">Status:</span>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="py-1.5 px-2 border rounded-md text-sm bg-white">
                                <option value="all">All</option>
                                {Object.keys(ORDER_STATUSES).filter(s => ORDER_STATUSES[s].order < 90).map(s => <option key={s} value={s}>{ORDER_STATUSES[s].label}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-muted)]">Type:</span>
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="py-1.5 px-2 border rounded-md text-sm bg-white">
                                <option value="all">All</option>
                                <option value="BLANK">Blank Cards</option>
                                <option value="PRE_DETAILS">Pre-filled Cards</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-muted)]">Payment:</span>
                            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="py-1.5 px-2 border rounded-md text-sm bg-white">
                                <option value="all">All</option>
                                {Object.keys(PAYMENT_STATUS).map(s => <option key={s} value={s}>{PAYMENT_STATUS[s].label}</option>)}
                            </select>
                        </div>
                        {activeFilterCount > 0 && (
                            <button onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setPaymentFilter('all'); }} className="text-xs text-red-600 font-medium">Clear all</button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-[var(--border-default)]">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">School</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Cards</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={9} className="py-16 text-center text-[var(--text-muted)]">No orders found</td></tr>
                            ) : (
                                filtered.map((order, idx) => (
                                    <tr key={order.id} className={`border-b border-[var(--border-default)] hover:bg-slate-50 cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`} onClick={() => setSelectedOrder(order)}>
                                        <td className="px-4 py-3"><code className="text-sm font-mono text-brand-600">{order.order_number}</code></td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-sm">{order.school_name}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{order.school_code}</div>
                                        </td>
                                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{ORDER_TYPES[order.order_type]?.label}</span></td>
                                        <td className="px-4 py-3 font-semibold">{order.student_count.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-semibold">{formatCurrency(order.grand_total)}</td>
                                        <td className="px-4 py-3"><PaymentStatusBadge status={order.payment_status} /></td>
                                        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                        <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={e => { e.stopPropagation(); setSelectedOrder(order); }} className="p-1.5 rounded-md hover:bg-slate-100">
                                                <Eye size={14} className="text-brand-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}