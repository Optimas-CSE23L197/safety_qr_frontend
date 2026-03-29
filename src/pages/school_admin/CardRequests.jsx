import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Search,
    CreditCard, Plus, MapPin, FileText, Hash, Building2,
    X, Package, ChevronLeft, ChevronRight, Receipt, ClipboardCheck,
    IndianRupee, Truck, Filter, Calendar, Download, Eye
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum, formatDate } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';
import { toast } from '../../utils/toast.js';

// ─── Pricing Config ───────────────────────────────────────────────────────────
const PRICE_PER_CARD = 45;
const GST_RATE = 0.18;
const SHIPPING_FLAT = 150;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CARD_REQUESTS = [
    { id: 'cr1', school_id: 'SCH-2024-001', school_name: 'Delhi Public School, Sector 12', card_count: 250, notes: 'Annual re-issuance for new academic session 2024–25. All Class 9 and 10 students require fresh cards.', delivery_address: { line1: '12, Sector 12, Dwarka', line2: 'Near Metro Station', city: 'New Delhi', state: 'Delhi', pincode: '110075' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'cr2', school_id: 'SCH-2024-007', school_name: "St. Mary's Convent School", card_count: 80, notes: 'Replacement cards for lost/damaged IDs reported in Term 1.', delivery_address: { line1: 'Plot 7, Civil Lines', line2: '', city: 'Nagpur', state: 'Maharashtra', pincode: '440001' }, status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), reviewed_at: new Date(Date.now() - 3600000 * 30).toISOString() },
    { id: 'cr3', school_id: 'SCH-2023-041', school_name: 'Kendriya Vidyalaya No. 3', card_count: 120, notes: 'Bulk order for new admission batch.', delivery_address: { line1: 'AFS Campus, Begumpet', line2: 'Near Air Force Station', city: 'Hyderabad', state: 'Telangana', pincode: '500003' }, status: 'REJECTED', reject_reason: 'Quantity exceeds allowed single-order limit of 300. Please split into two separate requests.', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'cr4', school_id: 'SCH-2024-019', school_name: 'Sunshine International School', card_count: 150, notes: 'Mid-year intake — 150 new students enrolled in January 2025 semester.', delivery_address: { line1: '45, Koramangala 4th Block', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 10).toISOString() },
    { id: 'cr5', school_id: 'SCH-2024-019', school_name: 'Sunshine International School', card_count: 50, notes: 'Additional cards for new staff members', delivery_address: { line1: '45, Koramangala 4th Block', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' }, status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 15).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const STATUS_STYLE = {
    PENDING: { bg: '#FFFBEB', color: '#B45309', label: 'Pending', Icon: Clock },
    APPROVED: { bg: '#ECFDF5', color: '#047857', label: 'Approved', Icon: CheckCircle },
    REJECTED: { bg: '#FEF2F2', color: '#B91C1C', label: 'Rejected', Icon: XCircle },
};

const EMPTY_FORM = { school_id: '', card_count: '', notes: '', line1: '', line2: '', city: '', state: '', pincode: '' };

const STEPS = [
    { id: 1, label: 'Request Details', Icon: CreditCard },
    { id: 2, label: 'Delivery Address', Icon: MapPin },
    { id: 3, label: 'Pricing & GST', Icon: Receipt },
    { id: 4, label: 'Review', Icon: ClipboardCheck },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcPricing = (count) => {
    const subtotal = count * PRICE_PER_CARD;
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst + SHIPPING_FLAT;
    return { subtotal, gst, shipping: SHIPPING_FLAT, total };
};

// ─── Date Range Filter Component ──────────────────────────────────────────────
const DateRangeFilter = ({ dateRange, setDateRange, onApply, onClear }) => {
    const [localStart, setLocalStart] = useState(dateRange.start);
    const [localEnd, setLocalEnd] = useState(dateRange.end);

    const handleApply = () => {
        onApply({ start: localStart, end: localEnd });
    };

    const handleClear = () => {
        setLocalStart('');
        setLocalEnd('');
        onClear();
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            padding: '16px',
            marginBottom: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                            From Date
                        </label>
                        <input
                            type="date"
                            value={localStart}
                            onChange={(e) => setLocalStart(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid var(--border-default)',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                            To Date
                        </label>
                        <input
                            type="date"
                            value={localEnd}
                            onChange={(e) => setLocalEnd(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid var(--border-default)',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <button
                        onClick={handleApply}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--color-brand-600)',
                            color: 'white',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        Apply Filter
                    </button>
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'white',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Status Filter Tabs ───────────────────────────────────────────────────────
const StatusTabs = ({ statusFilter, setStatusFilter, counts }) => {
    const tabs = [
        { key: 'ALL', label: 'All Requests', icon: Package },
        { key: 'PENDING', label: 'Pending', icon: Clock, count: counts.PENDING },
        { key: 'APPROVED', label: 'Approved', icon: CheckCircle, count: counts.APPROVED },
        { key: 'REJECTED', label: 'Rejected', icon: XCircle, count: counts.REJECTED },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: '12px'
        }}>
            {tabs.map(tab => {
                const isActive = statusFilter === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: isActive ? 'var(--color-brand-600)' : 'white',
                            border: isActive ? 'none' : '1px solid var(--border-default)',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span style={{
                                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-slate-100)',
                                borderRadius: '20px',
                                padding: '2px 8px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// ─── Request Card Component ───────────────────────────────────────────────────
const RequestCard = ({ request, isExpanded, onToggleExpand, canApprove, onApprove, onReject }) => {
    const s = STATUS_STYLE[request.status];
    const addr = request.delivery_address;
    const { total } = calcPricing(request.card_count);

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            transition: 'all 0.2s'
        }}>
            <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Status Icon */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${s.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <s.Icon size={24} style={{ color: s.color }} />
                    </div>

                    {/* Main Content */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                {request.school_name}
                            </h3>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                background: 'var(--color-slate-100)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                color: 'var(--text-muted)'
                            }}>
                                {request.school_id}
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: s.bg,
                                color: s.color,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <s.Icon size={12} />
                                {s.label}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            flexWrap: 'wrap',
                            marginBottom: '12px',
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CreditCard size={14} />
                                <strong style={{ color: 'var(--color-brand-600)' }}>{request.card_count}</strong> cards
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <IndianRupee size={14} />
                                <strong style={{ color: '#059669' }}>{fmt(total)}</strong>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={14} />
                                {addr.city}, {addr.state}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} />
                                Submitted {formatRelativeTime(request.created_at)}
                            </span>
                        </div>

                        <div style={{
                            background: 'var(--color-slate-50)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            borderLeft: `3px solid ${s.color}`,
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5
                        }}>
                            {request.notes}
                        </div>

                        {request.status === 'REJECTED' && request.reject_reason && (
                            <div style={{
                                marginTop: '12px',
                                padding: '10px 14px',
                                background: '#FEF2F2',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                color: '#991B1B',
                                borderLeft: '3px solid #EF4444'
                            }}>
                                <strong>Rejection reason:</strong> {request.reject_reason}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                        {request.status === 'PENDING' && canApprove && (
                            <>
                                <button
                                    onClick={() => onApprove(request.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #10B981',
                                        background: '#ECFDF5',
                                        color: '#047857',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button
                                    onClick={() => onReject(request.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #EF4444',
                                        background: '#FEF2F2',
                                        color: '#B91C1C',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <XCircle size={14} /> Reject
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => onToggleExpand(request.id)}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            <ChevronDown size={16} style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s'
                            }} />
                        </button>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div style={{
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--border-default)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '12px'
                            }}>
                                Delivery Address
                            </div>
                            <address style={{
                                fontStyle: 'normal',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                background: 'var(--color-slate-50)',
                                padding: '12px',
                                borderRadius: '8px'
                            }}>
                                {addr.line1}{addr.line2 && <><br />{addr.line2}</>}<br />
                                {addr.city}, {addr.state}<br />
                                PIN: {addr.pincode}
                            </address>
                        </div>

                        <div>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '12px'
                            }}>
                                Order Details
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-slate-50)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Card Price</span>
                                    <span style={{ fontWeight: 600 }}>{fmt(request.card_count * PRICE_PER_CARD)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-slate-50)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>GST (18%)</span>
                                    <span style={{ fontWeight: 600 }}>{fmt((request.card_count * PRICE_PER_CARD) * 0.18)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-slate-50)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Shipping</span>
                                    <span style={{ fontWeight: 600 }}>{fmt(SHIPPING_FLAT)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #10B981' }}>
                                    <span style={{ fontWeight: 700 }}>Total Payable</span>
                                    <span style={{ fontWeight: 800, color: '#047857' }}>{fmt(total)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '12px'
                            }}>
                                Timeline
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-slate-50)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Created</span>
                                    <span style={{ fontSize: '0.8125rem' }}>{formatDate(request.created_at)}</span>
                                </div>
                                {request.reviewed_at && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-slate-50)', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Reviewed</span>
                                        <span style={{ fontSize: '0.8125rem' }}>{formatDate(request.reviewed_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── New Request Modal ────────────────────────────────────────────────────────
const NewRequestModal = ({ isOpen, onClose, onSubmit, schoolId, schoolName }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ ...EMPTY_FORM, school_id: schoolId || '' });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const setField = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => ({ ...e, [key]: '' }));
    };

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!form.card_count || isNaN(form.card_count) || Number(form.card_count) < 1) e.card_count = 'Enter a valid card count (min 1)';
            else if (Number(form.card_count) > 300) e.card_count = 'Maximum 300 cards per request';
            if (!form.notes.trim()) e.notes = 'Please provide a reason for this request';
        }
        if (s === 2) {
            if (!form.line1.trim()) e.line1 = 'Street address is required';
            if (!form.city.trim()) e.city = 'City is required';
            if (!form.state.trim()) e.state = 'State is required';
            if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
        }
        return e;
    };

    const next = () => {
        if (step <= 2) {
            const e = validateStep(step);
            if (Object.keys(e).length) { setErrors(e); return; }
        }
        setStep(s => Math.min(s + 1, 4));
    };

    const back = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
    };

    const StepContent = () => {
        if (step === 1) return <Step1Content form={form} setField={setField} errors={errors} schoolName={schoolName} schoolId={schoolId} />;
        if (step === 2) return <Step2Content form={form} setField={setField} errors={errors} />;
        if (step === 3) return <Step3Content form={form} />;
        return <Step4Content form={form} />;
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}>
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>New Card Request</h2>
                    <button onClick={onClose} style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                <div style={{ padding: '28px' }}>
                    <StepBar current={step} />
                    <StepContent />
                </div>

                <div style={{
                    padding: '16px 28px',
                    borderTop: '1px solid var(--border-default)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: 'var(--color-slate-50)'
                }}>
                    <button onClick={step === 1 ? onClose : back} style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}>
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 4 ? (
                        <button onClick={next} style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            background: 'var(--color-brand-600)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                            Next →
                        </button>
                    ) : (
                        <button onClick={handleSubmit} style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            background: '#059669',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                            Submit Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Step Components (simplified versions - you can reuse from your existing code)
const StepBar = ({ current }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        {STEPS.map((step, idx) => (
            <div key={step.id} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 8px',
                    borderRadius: '50%',
                    background: current >= step.id ? 'var(--color-brand-600)' : 'white',
                    border: `2px solid ${current >= step.id ? 'var(--color-brand-600)' : 'var(--border-default)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {current > step.id ? (
                        <CheckCircle size={18} color="white" />
                    ) : (
                        <step.Icon size={16} color={current >= step.id ? 'white' : 'var(--text-muted)'} />
                    )}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: current >= step.id ? 600 : 400 }}>{step.label}</span>
            </div>
        ))}
    </div>
);

const Step1Content = ({ form, setField, errors, schoolName, schoolId }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>School</label>
            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                <div style={{ fontWeight: 600 }}>{schoolName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{schoolId}</div>
            </div>
        </div>
        <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Number of Cards *</label>
            <input
                type="number"
                min={1}
                max={300}
                value={form.card_count}
                onChange={e => setField('card_count', e.target.value)}
                style={{ width: '100%', padding: '10px', border: `1px solid ${errors.card_count ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px' }}
            />
            {errors.card_count && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px' }}>{errors.card_count}</p>}
        </div>
        <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Reason / Notes *</label>
            <textarea
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '10px', border: `1px solid ${errors.notes ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px', resize: 'vertical' }}
            />
            {errors.notes && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px' }}>{errors.notes}</p>}
        </div>
    </div>
);

const Step2Content = ({ form, setField, errors }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input value={form.line1} onChange={e => setField('line1', e.target.value)} placeholder="Street Address *" style={{ padding: '10px', border: `1px solid ${errors.line1 ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px' }} />
        {errors.line1 && <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>{errors.line1}</p>}
        <input value={form.line2} onChange={e => setField('line2', e.target.value)} placeholder="Landmark / Area (optional)" style={{ padding: '10px', border: '1px solid var(--border-default)', borderRadius: '8px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input value={form.city} onChange={e => setField('city', e.target.value)} placeholder="City *" style={{ padding: '10px', border: `1px solid ${errors.city ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px' }} />
            <input value={form.state} onChange={e => setField('state', e.target.value)} placeholder="State *" style={{ padding: '10px', border: `1px solid ${errors.state ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px' }} />
        </div>
        {(errors.city || errors.state) && <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>City and State are required</p>}
        <input value={form.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/, ''))} placeholder="Pincode *" maxLength={6} style={{ width: '200px', padding: '10px', border: `1px solid ${errors.pincode ? '#EF4444' : 'var(--border-default)'}`, borderRadius: '8px' }} />
        {errors.pincode && <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>{errors.pincode}</p>}
    </div>
);

const Step3Content = ({ form }) => {
    const count = Number(form.card_count) || 0;
    const { subtotal, gst, shipping, total } = calcPricing(count);
    return (
        <div>
            <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <strong>{count} Cards</strong> - {fmt(subtotal)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
                <span>GST (18%)</span>
                <span>{fmt(gst)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
                <span>Shipping</span>
                <span>{fmt(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, fontSize: '1.125rem' }}>
                <span>Total Payable</span>
                <span style={{ color: '#059669' }}>{fmt(total)}</span>
            </div>
        </div>
    );
};

const Step4Content = ({ form }) => {
    const count = Number(form.card_count) || 0;
    const { total } = calcPricing(count);
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <strong>School:</strong> {form.school_id}<br />
                <strong>Cards:</strong> {count}<br />
                <strong>Notes:</strong> {form.notes}
            </div>
            <div>
                <strong>Delivery Address:</strong><br />
                {form.line1}<br />
                {form.line2 && <>{form.line2}<br /></>}
                {form.city}, {form.state} - {form.pincode}
            </div>
            <div style={{ marginTop: '20px', padding: '16px', background: '#ECFDF5', borderRadius: '12px' }}>
                <strong>Total Amount: {fmt(total)}</strong>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CardRequests() {
    const { can, user } = useAuth();
    const currentSchoolId = user?.school_id || user?.schoolId || '';
    const currentSchoolName = user?.school_name || user?.schoolName || currentSchoolId;

    const [requests, setRequests] = useState(MOCK_CARD_REQUESTS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [expandedId, setExpandedId] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // Filter requests
    const myRequests = requests.filter(r => r.school_id === currentSchoolId);

    const filtered = myRequests.filter(req => {
        const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;

        let matchDate = true;
        if (dateRange.start) {
            const reqDate = new Date(req.created_at);
            const startDate = new Date(dateRange.start);
            if (reqDate < startDate) matchDate = false;
        }
        if (dateRange.end && matchDate) {
            const reqDate = new Date(req.created_at);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59);
            if (reqDate > endDate) matchDate = false;
        }

        return matchStatus && matchDate;
    });

    const counts = {
        ALL: myRequests.length,
        PENDING: myRequests.filter(r => r.status === 'PENDING').length,
        APPROVED: myRequests.filter(r => r.status === 'APPROVED').length,
        REJECTED: myRequests.filter(r => r.status === 'REJECTED').length,
    };

    const approve = (id) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));
        toast.success('Request approved successfully');
    };

    const reject = (id) => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: rejectReason, reviewed_at: new Date().toISOString() } : r));
        setRejectingId(null);
        setRejectReason('');
        toast.success('Request rejected');
    };

    const handleNewRequest = (form) => {
        const newReq = {
            id: 'cr' + Date.now(),
            school_id: currentSchoolId,
            school_name: currentSchoolName,
            card_count: Number(form.card_count),
            notes: form.notes.trim(),
            delivery_address: {
                line1: form.line1.trim(),
                line2: form.line2.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                pincode: form.pincode.trim()
            },
            status: 'PENDING',
            created_at: new Date().toISOString(),
        };
        setRequests(prev => [newReq, ...prev]);
        toast.success('Card request submitted successfully');
    };

    const handleClearDateFilter = () => {
        setDateRange({ start: '', end: '' });
    };

    const rejectingReq = myRequests.find(r => r.id === rejectingId);

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        margin: 0,
                        background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Card Requests
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                        Track and manage your school's physical ID card orders
                    </p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700))',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                    }}
                >
                    <Plus size={18} /> New Request
                </button>
            </div>

            {/* Status Tabs */}
            <StatusTabs
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                counts={counts}
            />

            {/* Date Range Filter */}
            <DateRangeFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
                onApply={setDateRange}
                onClear={handleClearDateFilter}
            />

            {/* Request List */}
            {filtered.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default)',
                    padding: '60px',
                    textAlign: 'center'
                }}>
                    <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>No card requests found</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Create your first card request to get started'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filtered.map(req => (
                        <RequestCard
                            key={req.id}
                            request={req}
                            isExpanded={expandedId === req.id}
                            onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                            canApprove={can('cardRequests.approve')}
                            onApprove={approve}
                            onReject={(id) => setRejectingId(id)}
                        />
                    ))}
                </div>
            )}

            {/* New Request Modal */}
            <NewRequestModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSubmit={handleNewRequest}
                schoolId={currentSchoolId}
                schoolName={currentSchoolName}
            />

            {/* Reject Modal */}
            {rejectingReq && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 2100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '28px',
                        maxWidth: '440px',
                        width: '100%'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Reject Request</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            Provide a reason for rejecting {rejectingReq.school_name}'s request
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border-default)',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                                marginBottom: '20px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setRejectingId(null);
                                    setRejectReason('');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-default)',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => reject(rejectingReq.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: '#DC2626',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}