/**
 * TOKEN ORDER PAGE
 * Schools submit physical card requests → hits backend → stored in DB
 * Super admin sees all orders with filters and status management.
 */

import { useState, useEffect } from 'react';
import {
    CreditCard, Plus, Search, Filter, ChevronDown, X,
    Building2, MapPin, FileText, Hash, Clock, CheckCircle2,
    XCircle, Truck, AlertCircle, Eye, MoreHorizontal,
    ArrowUpDown, Package, TrendingUp, Loader2, SlidersHorizontal,
    CalendarDays, BadgeCheck
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_SCHOOLS = [
    { id: 'SCH001', name: 'Greenwood International School' },
    { id: 'SCH002', name: 'Sunrise Academy' },
    { id: 'SCH003', name: 'Delhi Public School - R3' },
    { id: 'SCH004', name: 'St. Mary\'s Convent' },
    { id: 'SCH005', name: 'Modern High School' },
];

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
    processing: { label: 'Processing', color: '#6366F1', bg: '#EEF2FF', icon: Loader2 },
    shipped: { label: 'Shipped', color: '#0EA5E9', bg: '#E0F2FE', icon: Truck },
    delivered: { label: 'Delivered', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

const MOCK_ORDERS = [
    { id: 'ORD-2024-001', schoolId: 'SCH001', schoolName: 'Greenwood International School', quantity: 500, address: '14, Sector 21, Dwarka, New Delhi - 110075', notes: 'Deliver before semester start. Contact principal office.', status: 'delivered', createdAt: '2024-11-10', updatedAt: '2024-11-18' },
    { id: 'ORD-2024-002', schoolId: 'SCH002', schoolName: 'Sunrise Academy', quantity: 200, address: '45 MG Road, Bengaluru, Karnataka - 560001', notes: 'Fragile - handle with care.', status: 'shipped', createdAt: '2024-11-14', updatedAt: '2024-11-20' },
    { id: 'ORD-2024-003', schoolId: 'SCH003', schoolName: 'Delhi Public School - R3', quantity: 1200, address: 'Sector 23, R.K. Puram, New Delhi - 110022', notes: '', status: 'processing', createdAt: '2024-11-18', updatedAt: '2024-11-19' },
    { id: 'ORD-2024-004', schoolId: 'SCH004', schoolName: 'St. Mary\'s Convent', quantity: 350, address: '7 Park Street, Kolkata - 700016', notes: 'Call before delivery: 9830012345', status: 'pending', createdAt: '2024-11-20', updatedAt: '2024-11-20' },
    { id: 'ORD-2024-005', schoolId: 'SCH005', schoolName: 'Modern High School', quantity: 150, address: '23 FC Road, Pune, Maharashtra - 411005', notes: 'Deliver to admin block only.', status: 'cancelled', createdAt: '2024-11-08', updatedAt: '2024-11-09' },
    { id: 'ORD-2024-006', schoolId: 'SCH001', schoolName: 'Greenwood International School', quantity: 300, address: '14, Sector 21, Dwarka, New Delhi - 110075', notes: 'Urgent reorder for new batch.', status: 'pending', createdAt: '2024-11-21', updatedAt: '2024-11-21' },
    { id: 'ORD-2024-007', schoolId: 'SCH002', schoolName: 'Sunrise Academy', quantity: 800, address: '45 MG Road, Bengaluru, Karnataka - 560001', notes: '', status: 'processing', createdAt: '2024-11-19', updatedAt: '2024-11-21' },
];

const SUMMARY_STATS = {
    totalOrders: MOCK_ORDERS.length,
    totalCards: MOCK_ORDERS.reduce((s, o) => s + o.quantity, 0),
    pendingOrders: MOCK_ORDERS.filter(o => o.status === 'pending').length,
    deliveredOrders: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtNum = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

// ── Components ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem',
            fontWeight: 600, letterSpacing: '0.02em',
            color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}22`
        }}>
            <Icon size={11} strokeWidth={2.5} />
            {cfg.label}
        </span>
    );
}

function SummaryCard({ label, value, icon: Icon, color, bg }) {
    return (
        <div style={{
            background: '#fff', borderRadius: '14px', padding: '20px 22px',
            border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px',
            flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
        >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} strokeWidth={2} />
            </div>
            <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
            </div>
        </div>
    );
}

function OrderModal({ order, onClose, onStatusChange }) {
    const [status, setStatus] = useState(order?.status);
    const [saving, setSaving] = useState(false);

    useEffect(() => { setStatus(order?.status); }, [order]);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        onStatusChange(order.id, status);
        setSaving(false);
        onClose();
    };

    if (!order) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', margin: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
                {/* Header */}
                <div style={{ padding: '22px 26px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Order Details</p>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '3px 0 0' }}>{order.id}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} color="#6B7280" />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <InfoRow icon={Building2} label="School" value={`${order.schoolName} (${order.schoolId})`} color="#6366F1" />
                    <InfoRow icon={Hash} label="Cards Requested" value={`${order.quantity.toLocaleString()} physical cards`} color="#10B981" />
                    <InfoRow icon={MapPin} label="Delivery Address" value={order.address} color="#F59E0B" />
                    {order.notes && <InfoRow icon={FileText} label="Notes" value={order.notes} color="#0EA5E9" />}
                    <InfoRow icon={CalendarDays} label="Ordered On" value={fmtDate(order.createdAt)} color="#8B5CF6" />

                    {/* Status changer */}
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '18px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Update Status</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {STATUSES.map(s => {
                                const cfg = STATUS_CONFIG[s];
                                const active = status === s;
                                return (
                                    <button key={s} onClick={() => setStatus(s)} style={{
                                        padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${active ? cfg.color : '#E5E7EB'}`,
                                        background: active ? cfg.bg : '#fff', color: active ? cfg.color : '#6B7280',
                                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.02em'
                                    }}>
                                        {cfg.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 26px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: '9px 22px', borderRadius: '10px', border: 'none',
                        background: saving ? '#A5B4FC' : '#6366F1', color: '#fff',
                        fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s'
                    }}>
                        {saving ? <><Loader2 size={14} className="spin" />Saving…</> : <><BadgeCheck size={14} />Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <Icon size={15} color={color} strokeWidth={2} />
            </div>
            <div>
                <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: '0.87rem', color: '#111827', margin: '2px 0 0', fontWeight: 500, lineHeight: 1.4 }}>{value}</p>
            </div>
        </div>
    );
}

function NewOrderModal({ onClose, onSubmit }) {
    const [form, setForm] = useState({ schoolId: '', quantity: '', address: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.schoolId) e.schoolId = 'Select a school';
        if (!form.quantity || isNaN(form.quantity) || +form.quantity < 1) e.quantity = 'Enter valid quantity';
        if (!form.address.trim()) e.address = 'Address is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        const school = MOCK_SCHOOLS.find(s => s.id === form.schoolId);
        onSubmit({
            id: `ORD-2024-00${Math.floor(Math.random() * 90 + 10)}`,
            schoolId: form.schoolId,
            schoolName: school.name,
            quantity: +form.quantity,
            address: form.address,
            notes: form.notes,
            status: 'pending',
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
        });
        setSubmitting(false);
        onClose();
    };

    const inputStyle = (err) => ({
        width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.875rem',
        border: `1.5px solid ${err ? '#EF4444' : '#E5E7EB'}`, outline: 'none',
        color: '#111827', background: '#fff', boxSizing: 'border-box',
        fontFamily: 'inherit', transition: 'border-color 0.15s',
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px', margin: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
                {/* Header */}
                <div style={{ padding: '22px 26px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg,#6366F1 0%,#818CF8 100%)' }}>
                    <div>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>New Token Order</p>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '3px 0 0' }}>Request Physical Cards</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '8px', display: 'flex' }}>
                        <X size={16} color="#fff" />
                    </button>
                </div>

                <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* School */}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>School <span style={{ color: '#EF4444' }}>*</span></label>
                        <select value={form.schoolId} onChange={e => setForm(f => ({ ...f, schoolId: e.target.value }))}
                            style={{ ...inputStyle(errors.schoolId), appearance: 'none' }}>
                            <option value="">Select school…</option>
                            {MOCK_SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                        </select>
                        {errors.schoolId && <p style={{ fontSize: '0.72rem', color: '#EF4444', margin: '4px 0 0' }}>{errors.schoolId}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Number of Cards <span style={{ color: '#EF4444' }}>*</span></label>
                        <input type="number" min={1} placeholder="e.g. 500" value={form.quantity}
                            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                            style={inputStyle(errors.quantity)} />
                        {errors.quantity && <p style={{ fontSize: '0.72rem', color: '#EF4444', margin: '4px 0 0' }}>{errors.quantity}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Delivery Address <span style={{ color: '#EF4444' }}>*</span></label>
                        <textarea rows={3} placeholder="Full address with pincode…" value={form.address}
                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                            style={{ ...inputStyle(errors.address), resize: 'vertical' }} />
                        {errors.address && <p style={{ fontSize: '0.72rem', color: '#EF4444', margin: '4px 0 0' }}>{errors.address}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Notes <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
                        <textarea rows={2} placeholder="Any special delivery instructions…" value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            style={{ ...inputStyle(false), resize: 'vertical' }} />
                    </div>
                </div>

                <div style={{ padding: '16px 26px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting} style={{
                        padding: '9px 22px', borderRadius: '10px', border: 'none',
                        background: submitting ? '#A5B4FC' : '#6366F1', color: '#fff',
                        fontSize: '0.85rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s'
                    }}>
                        {submitting ? <><Loader2 size={14} />Submitting…</> : <><Package size={14} />Submit Order</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TokenOrderPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSchool, setFilterSchool] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showNewOrder, setShowNewOrder] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const handleStatusChange = (id, status) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString().slice(0, 10) } : o));
    };

    const handleNewOrder = (order) => {
        setOrders(prev => [order, ...prev]);
    };

    // Filter + sort
    const filtered = orders
        .filter(o => {
            const q = search.toLowerCase();
            const matchSearch = !q || o.id.toLowerCase().includes(q) || o.schoolName.toLowerCase().includes(q) || o.schoolId.toLowerCase().includes(q);
            const matchStatus = filterStatus === 'all' || o.status === filterStatus;
            const matchSchool = filterSchool === 'all' || o.schoolId === filterSchool;
            return matchSearch && matchStatus && matchSchool;
        })
        .sort((a, b) => {
            if (sortBy === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'qty_desc') return b.quantity - a.quantity;
            if (sortBy === 'qty_asc') return a.quantity - b.quantity;
            return 0;
        });

    const activeFilterCount = [filterStatus !== 'all', filterSchool !== 'all'].filter(Boolean).length;

    return (
        <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>

            {/* Spinner keyframe via style tag */}
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}`}</style>

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', borderRadius: '10px', width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard size={18} color="#fff" strokeWidth={2.2} />
                        </span>
                        Token Orders
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '5px 0 0' }}>Manage physical card requests from schools across the platform.</p>
                </div>
                <button onClick={() => setShowNewOrder(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    background: '#6366F1', color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.2s'
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6366F1'}
                >
                    <Plus size={16} strokeWidth={2.5} /> New Order
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                <SummaryCard label="Total Orders" value={orders.length} icon={Package} color="#6366F1" bg="#EEF2FF" />
                <SummaryCard label="Total Cards Ordered" value={fmtNum(orders.reduce((s, o) => s + o.quantity, 0))} icon={CreditCard} color="#10B981" bg="#ECFDF5" />
                <SummaryCard label="Pending Approval" value={orders.filter(o => o.status === 'pending').length} icon={Clock} color="#F59E0B" bg="#FFFBEB" />
                <SummaryCard label="Delivered" value={orders.filter(o => o.status === 'delivered').length} icon={TrendingUp} color="#0EA5E9" bg="#E0F2FE" />
            </div>

            {/* Filter Bar */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '14px 18px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>

                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                        <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            placeholder="Search by order ID, school name…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.85rem', color: '#111827', outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                        />
                    </div>

                    {/* Toggle filters */}
                    <button onClick={() => setShowFilters(f => !f)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                        borderRadius: '10px', border: `1.5px solid ${showFilters || activeFilterCount ? '#6366F1' : '#E5E7EB'}`,
                        background: showFilters || activeFilterCount ? '#EEF2FF' : '#F9FAFB',
                        color: showFilters || activeFilterCount ? '#6366F1' : '#374151',
                        fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap'
                    }}>
                        <SlidersHorizontal size={14} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span style={{ background: '#6366F1', color: '#fff', borderRadius: '20px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{activeFilterCount}</span>
                        )}
                    </button>

                    {/* Sort */}
                    <div style={{ position: 'relative' }}>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                            padding: '9px 32px 9px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB',
                            fontSize: '0.85rem', color: '#374151', background: '#F9FAFB', outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500
                        }}>
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="qty_desc">Quantity ↓</option>
                            <option value="qty_asc">Quantity ↑</option>
                        </select>
                        <ChevronDown size={13} color="#9CA3AF" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>

                    {/* Result count */}
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        {filtered.length} of {orders.length} orders
                    </span>
                </div>

                {/* Expanded filters */}
                {showFilters && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
                        {/* Status pills */}
                        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', marginRight: '2px' }}>Status:</span>
                            {['all', ...STATUSES].map(s => {
                                const cfg = s === 'all' ? null : STATUS_CONFIG[s];
                                const active = filterStatus === s;
                                return (
                                    <button key={s} onClick={() => setFilterStatus(s)} style={{
                                        padding: '5px 13px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                        border: `1.5px solid ${active ? (cfg?.color || '#6366F1') : '#E5E7EB'}`,
                                        background: active ? (cfg?.bg || '#EEF2FF') : '#fff',
                                        color: active ? (cfg?.color || '#6366F1') : '#6B7280',
                                    }}>
                                        {s === 'all' ? 'All' : cfg.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ width: '1px', background: '#E5E7EB', margin: '0 4px' }} />

                        {/* School filter */}
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', marginRight: '2px' }}>School:</span>
                            <div style={{ position: 'relative' }}>
                                <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)} style={{
                                    padding: '5px 28px 5px 12px', borderRadius: '20px', border: `1.5px solid ${filterSchool !== 'all' ? '#6366F1' : '#E5E7EB'}`,
                                    fontSize: '0.75rem', color: filterSchool !== 'all' ? '#6366F1' : '#6B7280',
                                    background: filterSchool !== 'all' ? '#EEF2FF' : '#fff', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit'
                                }}>
                                    <option value="all">All Schools</option>
                                    {MOCK_SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <ChevronDown size={11} color={filterSchool !== 'all' ? '#6366F1' : '#9CA3AF'} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <button onClick={() => { setFilterStatus('all'); setFilterSchool('all'); }} style={{
                                display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px',
                                border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444',
                                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                            }}>
                                <X size={11} />Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 0.8fr 1.8fr 0.9fr 0.8fr 0.6fr', gap: '0', padding: '0 20px', borderBottom: '2px solid #F3F4F6', background: '#F9FAFB' }}>
                    {['Order ID', 'School', 'Cards', 'Address', 'Status', 'Date', ''].map((h, i) => (
                        <div key={i} style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                    ))}
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
                        <Package size={40} strokeWidth={1.2} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>No orders found</p>
                        <p style={{ fontSize: '0.82rem', margin: '6px 0 0' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : filtered.map((order, idx) => (
                    <div key={order.id}
                        style={{
                            display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 0.8fr 1.8fr 0.9fr 0.8fr 0.6fr',
                            gap: '0', padding: '0 20px', borderBottom: idx < filtered.length - 1 ? '1px solid #F9FAFB' : 'none',
                            transition: 'background 0.1s', cursor: 'pointer', alignItems: 'center',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div style={{ padding: '14px 8px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6366F1', fontFamily: 'monospace' }}>{order.id}</span>
                        </div>
                        <div style={{ padding: '14px 8px' }}>
                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.schoolName}</p>
                            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '2px 0 0' }}>{order.schoolId}</p>
                        </div>
                        <div style={{ padding: '14px 8px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{order.quantity.toLocaleString()}</span>
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', marginLeft: '3px' }}>cards</span>
                        </div>
                        <div style={{ padding: '14px 8px' }}>
                            <p style={{ fontSize: '0.78rem', color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>{order.address}</p>
                        </div>
                        <div style={{ padding: '14px 8px' }}>
                            <StatusBadge status={order.status} />
                        </div>
                        <div style={{ padding: '14px 8px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{fmtDate(order.createdAt)}</span>
                        </div>
                        <div style={{ padding: '14px 8px', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={e => { e.stopPropagation(); setSelectedOrder(order); }} style={{
                                background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '6px 8px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280', transition: 'all 0.15s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6366F1'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#6B7280'; }}
                            >
                                <Eye size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
            {showNewOrder && (
                <NewOrderModal
                    onClose={() => setShowNewOrder(false)}
                    onSubmit={handleNewOrder}
                />
            )}
        </div>
    );
}