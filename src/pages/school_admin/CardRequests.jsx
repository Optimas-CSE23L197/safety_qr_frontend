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
                </div>
            </div>

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

// ─── New Request Modal ────────────────────────────────────────────────────────
function NewRequestModal({ isOpen, onClose, onSubmit, schoolId, schoolName }) {
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
            if (!form.card_type) e.card_type = 'Please select a card type';
            if (!form.design_type) e.design_type = 'Please select a design option';
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
        setStep(1);
        setForm({ ...EMPTY_FORM, school_id: schoolId || '' });
    };

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
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

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
    });

    const counts = {
        ALL: myRequests.length,
        PENDING: myRequests.filter(r => r.status === 'PENDING').length,
        APPROVED: myRequests.filter(r => r.status === 'APPROVED').length,
        REJECTED: myRequests.filter(r => r.status === 'REJECTED').length,
    };

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
                        />
                    ))}
                </div>
            )}

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
        </div>
    );
}