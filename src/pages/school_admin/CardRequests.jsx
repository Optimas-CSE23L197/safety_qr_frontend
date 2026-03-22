import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Search,
    CreditCard, Plus, MapPin, FileText, Hash, Building2,
    X, Package, ChevronLeft, ChevronRight, Receipt, ClipboardCheck,
    IndianRupee, Truck
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';

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

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inp = (hasErr) => ({
    width: '100%', padding: '10px 13px',
    border: `1.5px solid ${hasErr ? '#EF4444' : 'var(--border-default)'}`,
    borderRadius: '9px', fontSize: '0.875rem', outline: 'none',
    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
    color: 'var(--text-primary)', background: 'white', transition: 'border-color 0.15s',
});
const lbl = { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' };
const errTxt = { fontSize: '0.75rem', color: '#DC2626', marginTop: '4px' };

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const StepBar = ({ current }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        {STEPS.map((step, idx) => {
            const done = current > step.id;
            const active = current === step.id;
            return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: done || active ? 'var(--color-brand-600)' : 'white',
                            border: `2px solid ${done || active ? 'var(--color-brand-600)' : 'var(--border-default)'}`,
                            transition: 'all 0.25s',
                        }}>
                            {done
                                ? <CheckCircle size={18} color="white" />
                                : <step.Icon size={17} color={active ? 'white' : 'var(--text-muted)'} />
                            }
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: active || done ? 700 : 500, color: active || done ? 'var(--color-brand-600)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {step.label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div style={{ width: '80px', height: '2px', background: current > step.id ? 'var(--color-brand-500)' : 'var(--border-default)', margin: '0 4px', marginBottom: '26px', transition: 'background 0.25s' }} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── Step 1 ───────────────────────────────────────────────────────────────────
const Step1 = ({ form, setField, errors, schoolId, schoolName }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* School ID — auto-filled & locked to the logged-in school */}
        <div>
            <label style={lbl}>School</label>
            <div style={{ padding: '10px 13px', border: '1.5px solid var(--border-default)', borderRadius: '9px', background: 'var(--color-slate-50,#F8FAFC)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{schoolName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{schoolId}</div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '5px', padding: '2px 7px', letterSpacing: '0.04em' }}>AUTO</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Your school ID is automatically linked to this request.</p>
        </div>
        <div>
            <label style={lbl}>Number of Cards Required <span style={{ color: '#EF4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
                <CreditCard size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="number" min={1} max={300} value={form.card_count} onChange={e => setField('card_count', e.target.value)} placeholder="e.g. 150"
                    style={{ ...inp(errors.card_count), paddingLeft: '34px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = errors.card_count ? '#EF4444' : 'var(--border-default)'} />
            </div>
            {errors.card_count && <p style={errTxt}>{errors.card_count}</p>}
            {Number(form.card_count) > 0 && !errors.card_count && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-brand-600)', marginTop: '5px', fontWeight: 600 }}>
                    Estimated base cost: {fmt(Number(form.card_count) * PRICE_PER_CARD)} — full breakdown on step 3
                </p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Maximum 300 cards per request · ₹{PRICE_PER_CARD}/card</p>
        </div>
        <div>
            <label style={lbl}>Reason / Notes <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea value={form.notes} onChange={e => setField('notes', e.target.value)} rows={4}
                placeholder="e.g. Annual re-issuance for new academic session. All Class 9 students require fresh cards..."
                style={{ ...inp(errors.notes), resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = errors.notes ? '#EF4444' : 'var(--border-default)'} />
            {errors.notes && <p style={errTxt}>{errors.notes}</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Explain why cards are needed — helps admins review faster.</p>
        </div>
    </div>
);

// ─── Step 2 ───────────────────────────────────────────────────────────────────
const Step2 = ({ form, setField, errors }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
            <label style={lbl}>Street Address <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={form.line1} onChange={e => setField('line1', e.target.value)} placeholder="Building / Plot No., Street Name"
                style={inp(errors.line1)}
                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = errors.line1 ? '#EF4444' : 'var(--border-default)'} />
            {errors.line1 && <p style={errTxt}>{errors.line1}</p>}
        </div>
        <div>
            <label style={lbl}>Landmark / Area <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <input value={form.line2} onChange={e => setField('line2', e.target.value)} placeholder="e.g. Near Metro Station"
                style={inp(false)}
                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
                <label style={lbl}>City <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={form.city} onChange={e => setField('city', e.target.value)} placeholder="e.g. New Delhi"
                    style={inp(errors.city)}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = errors.city ? '#EF4444' : 'var(--border-default)'} />
                {errors.city && <p style={errTxt}>{errors.city}</p>}
            </div>
            <div>
                <label style={lbl}>State <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={form.state} onChange={e => setField('state', e.target.value)} placeholder="e.g. Delhi"
                    style={inp(errors.state)}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = errors.state ? '#EF4444' : 'var(--border-default)'} />
                {errors.state && <p style={errTxt}>{errors.state}</p>}
            </div>
        </div>
        <div style={{ maxWidth: '200px' }}>
            <label style={lbl}>Pincode <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={form.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/, ''))} placeholder="6-digit pincode" maxLength={6}
                style={inp(errors.pincode)}
                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = errors.pincode ? '#EF4444' : 'var(--border-default)'} />
            {errors.pincode && <p style={errTxt}>{errors.pincode}</p>}
        </div>
        {form.line1 && form.city && form.state && form.pincode && (
            <div style={{ padding: '14px 16px', background: 'var(--color-slate-50,#F8FAFC)', borderRadius: '10px', border: '1px dashed var(--border-default)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--color-brand-500)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Delivery Preview</div>
                    <address style={{ fontStyle: 'normal', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {form.line1}{form.line2 ? ', ' + form.line2 : ''}<br />
                        {form.city}, {form.state} – {form.pincode}
                    </address>
                </div>
            </div>
        )}
    </div>
);

// ─── Step 3 ───────────────────────────────────────────────────────────────────
const Step3 = ({ form }) => {
    const count = Number(form.card_count) || 0;
    const { subtotal, gst, shipping, total } = calcPricing(count);
    const Row = ({ label, sub, value, bold, accent, topBorder }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: topBorder ? '1px solid var(--border-default)' : 'none' }}>
            <div>
                <div style={{ fontSize: bold ? '0.9375rem' : '0.875rem', fontWeight: bold ? 700 : 500, color: bold ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</div>
                {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
            </div>
            <span style={{ fontSize: bold ? '1.125rem' : '0.9375rem', fontWeight: bold ? 800 : 600, color: accent ? 'var(--color-brand-700)' : bold ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: bold ? 'var(--font-display)' : 'inherit' }}>{value}</span>
        </div>
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #BFDBFE' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.15)' }}>
                    <CreditCard size={22} style={{ color: 'var(--color-brand-600)' }} />
                </div>
                <div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-brand-700)', fontWeight: 600 }}>Order Summary</div>
                    <div style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#1E40AF' }}>{count} ID Cards</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-brand-600)' }}>School: <strong>{form.school_id.toUpperCase()}</strong></div>
                </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '0 20px' }}>
                <Row label="Card Price" sub={`${count} cards × ₹${PRICE_PER_CARD} per card`} value={fmt(subtotal)} />
                <Row label={`GST (${GST_RATE * 100}%)`} sub="Goods and Services Tax" value={fmt(gst)} topBorder />
                <Row label="Shipping & Handling" sub="Flat rate · delivered to address" value={fmt(shipping)} topBorder />
                <Row label="Total Payable" sub="Inclusive of all taxes" value={fmt(total)} bold accent topBorder />
            </div>
            <div style={{ padding: '12px 16px', background: '#FFFBEB', borderRadius: '9px', border: '1px solid #FDE68A', fontSize: '0.8125rem', color: '#92400E', lineHeight: 1.6, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Receipt size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Payment will be collected after the admin <strong>approves</strong> this request. A formal invoice will be sent to the registered school email.</span>
            </div>
        </div>
    );
};

// ─── Step 4 ───────────────────────────────────────────────────────────────────
const Step4 = ({ form }) => {
    const count = Number(form.card_count) || 0;
    const { total } = calcPricing(count);
    const Section = ({ icon: Icon, title, children }) => (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
            <div style={{ padding: '11px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--color-slate-50,#F8FAFC)' }}>
                <Icon size={13} style={{ color: 'var(--color-brand-600)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
            </div>
            <div style={{ padding: '16px 18px' }}>{children}</div>
        </div>
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Section icon={Building2} title="Request Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[['School ID', form.school_id.toUpperCase()], ['Cards Requested', `${count} cards`]].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-slate-100,#F1F5F9)' }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{k}</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 700 }}>{v}</span>
                        </div>
                    ))}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Notes</div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--color-slate-50,#F8FAFC)', borderRadius: '7px', padding: '10px 12px' }}>{form.notes}</p>
                    </div>
                </div>
            </Section>
            <Section icon={Truck} title="Delivery Address">
                <address style={{ fontStyle: 'normal', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {form.line1}{form.line2 ? ', ' + form.line2 : ''}<br />
                    {form.city}, {form.state} – {form.pincode}
                </address>
            </Section>
            <Section icon={Receipt} title="Amount Payable">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total (incl. 18% GST + shipping)</span>
                    <span style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-brand-700)' }}>{fmt(total)}</span>
                </div>
            </Section>
            <div style={{ padding: '12px 16px', background: '#F0FDF4', borderRadius: '9px', border: '1px solid #BBF7D0', fontSize: '0.8125rem', color: '#166534', lineHeight: 1.6, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>By submitting, you confirm all details are correct. The request will be sent to the admin team for review.</span>
            </div>
        </div>
    );
};

// ─── Success Popup ────────────────────────────────────────────────────────────
const SuccessPopup = ({ submission, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 7000); return () => clearTimeout(t); }, [onClose]);
    const { total } = calcPricing(Number(submission.card_count));
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <style>{`
                @keyframes popIn { from { opacity:0; transform:scale(0.85) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }
                @keyframes shrinkBar { from { width:100% } to { width:0% } }
            `}</style>
            <div style={{ background: 'white', borderRadius: '20px', padding: '36px 32px 28px', maxWidth: '430px', width: '100%', boxShadow: '0 30px 70px rgba(0,0,0,0.25)', animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: '#DBEAFE', width: '100%' }}>
                    <div style={{ height: '100%', background: 'var(--color-brand-500)', animation: 'shrinkBar 7s linear forwards' }} />
                </div>
                <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px', borderRadius: '7px', border: '1px solid var(--border-default)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <CheckCircle size={32} style={{ color: '#059669' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>Request Submitted!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 24px', lineHeight: 1.6 }}>
                    Your request is now <strong style={{ color: '#B45309' }}>pending admin review</strong>. You'll be notified once it's approved.
                </p>
                <div style={{ background: 'var(--color-slate-50,#F8FAFC)', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '4px 16px', textAlign: 'left' }}>
                    {[
                        ['School ID', submission.school_id.toUpperCase()],
                        ['Cards Requested', `${submission.card_count} cards`],
                        ['Amount Payable', fmt(total)],
                        ['Deliver To', `${submission.city}, ${submission.state} – ${submission.pincode}`],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border-default)' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} style={{ marginTop: '20px', width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: 'var(--color-brand-600)', color: 'white', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-700)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-600)'}>
                    Done
                </button>
            </div>
        </div>
    );
};

// ─── Reject Modal ─────────────────────────────────────────────────────────────
const RejectModal = ({ request, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px' }}>Reject Card Request</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>Provide a reason for rejecting the request from <strong>{request.school_name}</strong>.</p>
                <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Quantity exceeds allowed limit..." rows={3}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: reason.trim() ? '#DC2626' : '#FCA5A5', color: 'white', cursor: reason.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Reject Request</button>
                </div>
            </div>
        </div>
    );
};

// ─── New Request Multi-Step Page ──────────────────────────────────────────────
const NewRequestPage = ({ onCancel, onSubmit, schoolId, schoolName }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ ...EMPTY_FORM, school_id: schoolId || '' });
    const [errors, setErrors] = useState({});

    const setField = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); };

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

    const STEP_META = [
        { title: 'Request Details', sub: 'Enter the school ID, number of cards needed, and the reason for the request.' },
        { title: 'Delivery Address', sub: 'Where should the cards be delivered?' },
        { title: 'Pricing & GST', sub: 'Review the cost breakdown before proceeding.' },
        { title: 'Review & Submit', sub: 'Confirm all details before submitting your request.' },
    ];

    return (
        <div style={{ maxWidth: '680px' }}>
            <button onClick={onCancel}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, padding: 0, marginBottom: '24px' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Card Requests
            </button>

            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>New Card Request</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Submit a request for physical ID cards for your school</p>
            </div>

            <StepBar current={step} />

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50,#F8FAFC)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Step {step} of 4 — {STEP_META[step - 1].title}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{STEP_META[step - 1].sub}</p>
                </div>

                {/* Card body */}
                <div style={{ padding: '28px' }}>
                    {step === 1 && <Step1 form={form} setField={setField} errors={errors} schoolId={schoolId} schoolName={schoolName} />}
                    {step === 2 && <Step2 form={form} setField={setField} errors={errors} />}
                    {step === 3 && <Step3 form={form} />}
                    {step === 4 && <Step4 form={form} />}
                </div>

                {/* Footer nav */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-slate-50,#F8FAFC)' }}>
                    <button onClick={step === 1 ? onCancel : back}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '9px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50,#F8FAFC)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <ChevronLeft size={15} /> {step === 1 ? 'Cancel' : 'Previous'}
                    </button>
                    {step < 4
                        ? <button onClick={next}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 22px', borderRadius: '9px', border: 'none', background: 'var(--color-brand-600)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-700)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-600)'}>
                            Next <ChevronRight size={15} />
                        </button>
                        : <button onClick={() => onSubmit(form)}
                            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 22px', borderRadius: '9px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                            onMouseLeave={e => e.currentTarget.style.background = '#059669'}>
                            <CheckCircle size={15} /> Submit Request
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CardRequests() {
    const { can, user } = useAuth();

    // Scoped to the currently logged-in school — other schools' requests are invisible
    const currentSchoolId = user?.school_id || user?.schoolId || '';
    const currentSchoolName = user?.school_name || user?.schoolName || currentSchoolId;

    const [requests, setRequests] = useState(MOCK_CARD_REQUESTS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [view, setView] = useState('list');
    const [successData, setSuccessData] = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    // Only this school's requests
    const myRequests = requests.filter(r => r.school_id === currentSchoolId);

    const filtered = myRequests.filter(r => {
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        const matchSearch = !debouncedSearch ||
            r.school_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        ALL: myRequests.length,
        PENDING: myRequests.filter(r => r.status === 'PENDING').length,
        APPROVED: myRequests.filter(r => r.status === 'APPROVED').length,
        REJECTED: myRequests.filter(r => r.status === 'REJECTED').length,
    };

    const approve = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));
    const reject = (id, reason) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: reason, reviewed_at: new Date().toISOString() } : r));
        setRejectingId(null);
    };

    const handleSubmit = (form) => {
        const newReq = {
            id: 'cr' + Date.now(),
            // Always bind to the logged-in school — never trust form input for this
            school_id: currentSchoolId,
            school_name: currentSchoolName,
            card_count: Number(form.card_count),
            notes: form.notes.trim(),
            delivery_address: { line1: form.line1.trim(), line2: form.line2.trim(), city: form.city.trim(), state: form.state.trim(), pincode: form.pincode.trim() },
            status: 'PENDING',
            created_at: new Date().toISOString(),
        };
        setRequests(prev => [newReq, ...prev]);
        setView('list');
        setSuccessData({ ...form, school_id: currentSchoolId, card_count: Number(form.card_count) });
    };

    const rejectingReq = myRequests.find(r => r.id === rejectingId);

    // ── New Request full-page view ─────────────────────────────────────────────
    if (view === 'new') {
        return (
            <NewRequestPage
                onCancel={() => setView('list')}
                onSubmit={handleSubmit}
                schoolId={currentSchoolId}
                schoolName={currentSchoolName}
            />
        );
    }

    // ── List view ──────────────────────────────────────────────────────────────
    return (
        <div style={{ maxWidth: '980px' }}>
            {rejectingReq && <RejectModal request={rejectingReq} onClose={() => setRejectingId(null)} onConfirm={(reason) => reject(rejectingId, reason)} />}
            {successData && <SuccessPopup submission={successData} onClose={() => setSuccessData(null)} />}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Card Requests</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Manage physical ID card requests submitted by schools</p>
                </div>
                <button onClick={() => setView('new')}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '9px', border: 'none', background: 'var(--color-brand-600)', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-700)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-600)'}>
                    <Plus size={15} /> New Request
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                {Object.entries(counts).map(([key, count]) => (
                    <button key={key} onClick={() => setStatusFilter(key)}
                        style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid', borderColor: statusFilter === key ? 'var(--color-brand-500)' : 'var(--border-default)', background: statusFilter === key ? 'var(--color-brand-600)' : 'white', color: statusFilter === key ? 'white' : 'var(--text-secondary)', fontWeight: statusFilter === key ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {key === 'ALL' ? 'All' : humanizeEnum(key)}
                        <span style={{ background: statusFilter === key ? 'rgba(255,255,255,0.25)' : 'var(--color-slate-100)', color: statusFilter === key ? 'white' : 'var(--text-muted)', borderRadius: '9999px', padding: '0 7px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school or ID..."
                        style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px', fontFamily: 'var(--font-body)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Package size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <div style={{ fontWeight: 500 }}>No card requests found</div>
                    </div>
                ) : filtered.map(req => {
                    const s = STATUS_STYLE[req.status];
                    const isExpanded = expandedId === req.id;
                    const addr = req.delivery_address;
                    const { total } = calcPricing(req.card_count);
                    return (
                        <div key={req.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                            <div style={{ padding: '18px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <CreditCard size={18} style={{ color: 'var(--color-brand-700)' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{req.school_name}</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--color-slate-100)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '5px' }}>{req.school_id}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <s.Icon size={11} /> {s.label}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '5px', fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--color-brand-700)' }}><CreditCard size={12} /> {req.card_count} cards</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#059669' }}><IndianRupee size={11} />{fmt(total).replace('₹', '')}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} /> {addr.city}, {addr.state}</span>
                                            <span>Submitted {formatRelativeTime(req.created_at)}</span>
                                        </div>
                                        <div style={{ marginTop: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'var(--color-slate-50,#F8FAFC)', borderRadius: '7px', padding: '7px 10px', borderLeft: '3px solid var(--color-brand-200,#BFDBFE)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {req.notes}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        {req.status === 'PENDING' && can('cardRequests.approve') && <>
                                            <button onClick={() => approve(req.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', border: '1px solid #10B981', background: '#ECFDF5', color: '#047857', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#D1FAE5'} onMouseLeave={e => e.currentTarget.style.background = '#ECFDF5'}>
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button onClick={() => setRejectingId(req.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', border: '1px solid #EF4444', background: '#FEF2F2', color: '#B91C1C', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}>
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </>}
                                        {req.status !== 'PENDING' && req.reviewed_at && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Reviewed {formatRelativeTime(req.reviewed_at)}</span>
                                        )}
                                        <button onClick={() => setExpandedId(isExpanded ? null : req.id)} style={{ width: '32px', height: '32px', borderRadius: '7px', border: '1px solid var(--border-default)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <ChevronDown size={15} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                                        </button>
                                    </div>
                                </div>
                                {req.status === 'REJECTED' && req.reject_reason && (
                                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FEF2F2', borderRadius: '8px', fontSize: '0.8125rem', color: '#991B1B', borderLeft: '3px solid #EF4444' }}>
                                        <strong>Rejection reason:</strong> {req.reject_reason}
                                    </div>
                                )}
                            </div>
                            {isExpanded && (
                                <div style={{ borderTop: '1px solid var(--border-default)', padding: '18px 20px', background: 'var(--color-slate-50,#F8FAFC)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Notes</div>
                                        <p style={{ margin: 0, fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{req.notes}</p>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Delivery Address</div>
                                        <address style={{ fontStyle: 'normal', fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                            {addr.line1}{addr.line2 && <><br />{addr.line2}</>}<br />
                                            {addr.city}, {addr.state} – {addr.pincode}
                                        </address>
                                    </div>
                                    <div style={{ gridColumn: '1/-1', paddingTop: '14px', borderTop: '1px dashed var(--border-default)', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                                        {[['Cards', String(req.card_count), 'var(--color-brand-700)', '1.375rem'], ['Amount', fmt(total), '#059669', '1.125rem'], ['School ID', req.school_id, 'var(--text-primary)', '1rem']].map(([label, val, color, size]) => (
                                            <div key={label}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                                                <div style={{ fontSize: size, fontFamily: 'var(--font-display)', fontWeight: 800, color }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}