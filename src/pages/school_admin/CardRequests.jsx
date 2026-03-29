import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, ChevronDown, Search,
    CreditCard, Plus, MapPin, Building2,
    X, Package, ChevronLeft, ChevronRight, Receipt, ClipboardCheck,
    IndianRupee, Truck,
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';

// ─── Config ───────────────────────────────────────────────────────────────────
const PRICE_PER_CARD = 45;
const GST_RATE       = 0.18;
const SHIPPING_FLAT  = 150;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CARD_REQUESTS = [
    { id: 'cr1', school_id: 'SCH-2024-001', school_name: 'Delhi Public School, Sector 12',  card_count: 250, notes: 'Annual re-issuance for new academic session 2024–25. All Class 9 and 10 students require fresh cards.', delivery_address: { line1: '12, Sector 12, Dwarka', line2: 'Near Metro Station', city: 'New Delhi', state: 'Delhi', pincode: '110075' },           status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'cr2', school_id: 'SCH-2024-007', school_name: "St. Mary's Convent School",       card_count: 80,  notes: 'Replacement cards for lost/damaged IDs reported in Term 1.',                                          delivery_address: { line1: 'Plot 7, Civil Lines',   line2: '',                  city: 'Nagpur',   state: 'Maharashtra', pincode: '440001' }, status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), reviewed_at: new Date(Date.now() - 3600000 * 30).toISOString() },
    { id: 'cr3', school_id: 'SCH-2023-041', school_name: 'Kendriya Vidyalaya No. 3',        card_count: 120, notes: 'Bulk order for new admission batch.',                                                                  delivery_address: { line1: 'AFS Campus, Begumpet', line2: 'Near Air Force Station', city: 'Hyderabad', state: 'Telangana', pincode: '500003' },      status: 'REJECTED', reject_reason: 'Quantity exceeds allowed single-order limit of 300. Please split into two separate requests.', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'cr4', school_id: 'SCH-2024-019', school_name: 'Sunshine International School',  card_count: 150, notes: 'Mid-year intake — 150 new students enrolled in January 2025 semester.',                               delivery_address: { line1: '45, Koramangala 4th Block', line2: '',             city: 'Bengaluru', state: 'Karnataka', pincode: '560034' },           status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 10).toISOString() },
];

const STATUS_STYLE = {
    PENDING:  { bgClass: 'bg-amber-50',  colorClass: 'text-amber-700', label: 'Pending',  Icon: Clock },
    APPROVED: { bgClass: 'bg-emerald-50',colorClass: 'text-emerald-700',label: 'Approved', Icon: CheckCircle },
    REJECTED: { bgClass: 'bg-red-50',    colorClass: 'text-red-700',   label: 'Rejected', Icon: XCircle },
};

const EMPTY_FORM = { school_id: '', card_count: '', notes: '', line1: '', line2: '', city: '', state: '', pincode: '' };

const STEPS = [
    { id: 1, label: 'Request Details', Icon: CreditCard },
    { id: 2, label: 'Delivery Address', Icon: MapPin },
    { id: 3, label: 'Pricing & GST',    Icon: Receipt },
    { id: 4, label: 'Review',           Icon: ClipboardCheck },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcPricing = (count) => {
    const subtotal = count * PRICE_PER_CARD;
    const gst      = subtotal * GST_RATE;
    return { subtotal, gst, shipping: SHIPPING_FLAT, total: subtotal + gst + SHIPPING_FLAT };
};

// ─── Reusable field styles (still tiny inline pieces for dynamic error state) ─
const inputCls = (hasErr) =>
    `w-full px-3 py-2.5 border-[1.5px] rounded-[9px] text-sm outline-none font-body text-slate-900 bg-white transition-colors
    ${hasErr ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'}`;

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const StepBar = ({ current }) => (
    <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, idx) => {
            const done   = current > step.id;
            const active = current === step.id;
            return (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className={[
                            'w-[42px] h-[42px] rounded-full flex items-center justify-center border-2 transition-all',
                            done || active ? 'bg-blue-700 border-blue-700' : 'bg-white border-slate-200',
                        ].join(' ')}>
                            {done
                                ? <CheckCircle size={18} className="text-white" />
                                : <step.Icon size={17} className={active ? 'text-white' : 'text-slate-400'} />
                            }
                        </div>
                        <span className={`text-xs whitespace-nowrap ${active || done ? 'font-bold text-blue-700' : 'font-medium text-slate-400'}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`w-20 h-0.5 mx-1 mb-[26px] transition-colors ${current > step.id ? 'bg-blue-500' : 'bg-slate-200'}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── Step 1 ───────────────────────────────────────────────────────────────────
const Step1 = ({ form, setField, errors, schoolId, schoolName }) => (
    <div className="flex flex-col gap-5">
        {/* School — locked */}
        <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">School</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-[9px] bg-slate-50">
                <Building2 size={14} className="text-slate-400 shrink-0" />
                <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{schoolName}</div>
                    <div className="text-xs text-slate-400 font-mono">{schoolId}</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 tracking-wide">AUTO</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Your school ID is automatically linked to this request.</p>
        </div>

        {/* Card count */}
        <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
                Number of Cards Required <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                    type="number" min={1} max={300}
                    value={form.card_count}
                    onChange={e => setField('card_count', e.target.value)}
                    placeholder="e.g. 150"
                    className={inputCls(errors.card_count) + ' pl-8'}
                />
            </div>
            {errors.card_count && <p className="text-xs text-red-600 mt-1">{errors.card_count}</p>}
            {Number(form.card_count) > 0 && !errors.card_count && (
                <p className="text-xs text-blue-700 font-semibold mt-1">
                    Estimated base cost: {fmt(Number(form.card_count) * PRICE_PER_CARD)} — full breakdown on step 3
                </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Maximum 300 cards per request · ₹{PRICE_PER_CARD}/card</p>
        </div>

        {/* Notes */}
        <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
                Reason / Notes <span className="text-red-500">*</span>
            </label>
            <textarea
                rows={4}
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                placeholder="e.g. Annual re-issuance for new academic session. All Class 9 students require fresh cards..."
                className={inputCls(errors.notes) + ' resize-y leading-relaxed'}
            />
            {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes}</p>}
            <p className="text-xs text-slate-400 mt-1">Explain why cards are needed — helps admins review faster.</p>
        </div>
    </div>
);

// ─── Step 2 ───────────────────────────────────────────────────────────────────
const Step2 = ({ form, setField, errors }) => (
    <div className="flex flex-col gap-4.5">
        <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Street Address <span className="text-red-500">*</span></label>
            <input value={form.line1} onChange={e => setField('line1', e.target.value)} placeholder="Building / Plot No., Street Name" className={inputCls(errors.line1)} />
            {errors.line1 && <p className="text-xs text-red-600 mt-1">{errors.line1}</p>}
        </div>
        <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Landmark / Area <span className="text-xs text-slate-400 font-normal">(optional)</span></label>
            <input value={form.line2} onChange={e => setField('line2', e.target.value)} placeholder="e.g. Near Metro Station" className={inputCls(false)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">City <span className="text-red-500">*</span></label>
                <input value={form.city} onChange={e => setField('city', e.target.value)} placeholder="e.g. New Delhi" className={inputCls(errors.city)} />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">State <span className="text-red-500">*</span></label>
                <input value={form.state} onChange={e => setField('state', e.target.value)} placeholder="e.g. Delhi" className={inputCls(errors.state)} />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
            </div>
        </div>
        <div className="max-w-[200px]">
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Pincode <span className="text-red-500">*</span></label>
            <input value={form.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/, ''))} placeholder="6-digit pincode" maxLength={6} className={inputCls(errors.pincode)} />
            {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
        </div>
        {form.line1 && form.city && form.state && form.pincode && (
            <div className="flex items-start gap-2.5 px-4 py-3.5 bg-slate-50 rounded-[10px] border border-dashed border-slate-200">
                <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Delivery Preview</div>
                    <address className="not-italic text-sm text-slate-600 leading-relaxed">
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
        <div className={`flex justify-between items-center py-3.5 ${topBorder ? 'border-t border-slate-200' : ''}`}>
            <div>
                <div className={`${bold ? 'text-[15px] font-bold text-slate-900' : 'text-sm font-medium text-slate-600'}`}>{label}</div>
                {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
            </div>
            <span className={`${bold ? 'text-lg font-extrabold font-display' : 'text-[15px] font-semibold'} ${accent ? 'text-blue-700' : bold ? 'text-slate-900' : 'text-slate-600'}`}>
                {value}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 p-5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CreditCard size={22} className="text-blue-700" />
                </div>
                <div>
                    <div className="text-[13px] font-semibold text-blue-700">Order Summary</div>
                    <div className="text-[22px] font-extrabold font-display text-blue-800">{count} ID Cards</div>
                    <div className="text-[13px] text-blue-600">School: <strong>{form.school_id.toUpperCase()}</strong></div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 px-5">
                <Row label="Card Price"           sub={`${count} cards × ₹${PRICE_PER_CARD} per card`} value={fmt(subtotal)} />
                <Row label={`GST (${GST_RATE * 100}%)`} sub="Goods and Services Tax"               value={fmt(gst)}      topBorder />
                <Row label="Shipping & Handling"  sub="Flat rate · delivered to address"             value={fmt(shipping)} topBorder />
                <Row label="Total Payable"        sub="Inclusive of all taxes"                       value={fmt(total)}    bold accent topBorder />
            </div>

            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 rounded-[9px] border border-amber-200 text-[13px] text-amber-800 leading-relaxed">
                <Receipt size={14} className="shrink-0 mt-0.5" />
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-1.5 px-[18px] py-3 border-b border-slate-200 bg-slate-50">
                <Icon size={13} className="text-blue-700" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</span>
            </div>
            <div className="px-[18px] py-4">{children}</div>
        </div>
    );

    return (
        <div className="flex flex-col gap-3.5">
            <Section icon={Building2} title="Request Details">
                <div className="flex flex-col gap-2">
                    {[['School ID', form.school_id.toUpperCase()], ['Cards Requested', `${count} cards`]].map(([k, v]) => (
                        <div key={k} className="flex justify-between pb-2 border-b border-slate-100">
                            <span className="text-[13px] text-slate-400 font-medium">{k}</span>
                            <span className="text-[13px] text-slate-900 font-bold">{v}</span>
                        </div>
                    ))}
                    <div>
                        <div className="text-xs text-slate-400 font-semibold mb-1.5">Notes</div>
                        <p className="m-0 text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg px-3 py-2.5">{form.notes}</p>
                    </div>
                </div>
            </Section>

            <Section icon={Truck} title="Delivery Address">
                <address className="not-italic text-sm text-slate-600 leading-relaxed">
                    {form.line1}{form.line2 ? ', ' + form.line2 : ''}<br />
                    {form.city}, {form.state} – {form.pincode}
                </address>
            </Section>

            <Section icon={Receipt} title="Amount Payable">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total (incl. 18% GST + shipping)</span>
                    <span className="text-[22px] font-extrabold font-display text-blue-700">{fmt(total)}</span>
                </div>
            </Section>

            <div className="flex items-start gap-2 px-4 py-3 bg-emerald-50 rounded-[9px] border border-emerald-200 text-[13px] text-emerald-800 leading-relaxed">
                <CheckCircle size={14} className="shrink-0 mt-0.5" />
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
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-5">
            <style>{`
                @keyframes popIn { from { opacity:0; transform:scale(0.85) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }
                @keyframes shrinkBar { from { width:100% } to { width:0% } }
            `}</style>
            <div className="bg-white rounded-[20px] px-8 pt-9 pb-7 max-w-[430px] w-full shadow-[0_30px_70px_rgba(0,0,0,0.25)] text-center relative overflow-hidden"
                 style={{ animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-blue-100">
                    <div className="h-full bg-blue-500" style={{ animation: 'shrinkBar 7s linear forwards' }} />
                </div>
                <button onClick={onClose} className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-50">
                    <X size={14} />
                </button>
                <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-display text-[22px] font-extrabold text-slate-900 mb-2">Request Submitted!</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Your request is now <strong className="text-amber-700">pending admin review</strong>. You'll be notified once it's approved.
                </p>
                <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 text-left">
                    {[
                        ['School ID',        submission.school_id.toUpperCase()],
                        ['Cards Requested',  `${submission.card_count} cards`],
                        ['Amount Payable',   fmt(total)],
                        ['Deliver To',       `${submission.city}, ${submission.state} – ${submission.pincode}`],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-2.5 border-b border-slate-200">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{k}</span>
                            <span className="text-sm font-bold text-slate-900">{v}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="mt-5 w-full py-3 rounded-[10px] border-none bg-blue-700 text-white font-bold text-[15px] cursor-pointer hover:bg-blue-800 transition-colors">
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
        <div className="fixed inset-0 bg-black/45 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 max-w-[440px] w-full shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Reject Card Request</h3>
                <p className="text-slate-400 text-sm mb-5">Provide a reason for rejecting the request from <strong className="text-slate-700">{request.school_name}</strong>.</p>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Quantity exceeds allowed limit..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-y outline-none font-body focus:border-blue-500 box-border"
                />
                <div className="flex gap-2.5 mt-5 justify-end">
                    <button onClick={onClose} className="px-[18px] py-2 rounded-lg border border-slate-200 bg-white text-slate-600 cursor-pointer font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()}
                        className={`px-[18px] py-2 rounded-lg border-none text-white font-semibold transition-colors ${reason.trim() ? 'bg-red-600 cursor-pointer hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}>
                        Reject Request
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── New Request Multi-Step ───────────────────────────────────────────────────
const NewRequestPage = ({ onCancel, onSubmit, schoolId, schoolName }) => {
    const [step,   setStep]   = useState(1);
    const [form,   setForm]   = useState({ ...EMPTY_FORM, school_id: schoolId || '' });
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
            if (!form.city.trim())  e.city  = 'City is required';
            if (!form.state.trim()) e.state = 'State is required';
            if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
        }
        return e;
    };

    const next = () => {
        if (step <= 2) { const e = validateStep(step); if (Object.keys(e).length) { setErrors(e); return; } }
        setStep(s => Math.min(s + 1, 4));
    };
    const back = () => setStep(s => Math.max(s - 1, 1));

    const STEP_META = [
        { title: 'Request Details',  sub: 'Enter the school ID, number of cards needed, and the reason for the request.' },
        { title: 'Delivery Address', sub: 'Where should the cards be delivered?' },
        { title: 'Pricing & GST',    sub: 'Review the cost breakdown before proceeding.' },
        { title: 'Review & Submit',  sub: 'Confirm all details before submitting your request.' },
    ];

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[680px]">
                <button onClick={onCancel}
                    className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-slate-400 text-sm font-medium p-0 mb-6 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={16} /> Back to Card Requests
                </button>

                <div className="mb-7">
                    <h2 className="font-display text-[22px] font-bold text-slate-900 m-0">New Card Request</h2>
                    <p className="text-slate-400 text-sm mt-1">Submit a request for physical ID cards for your school</p>
                </div>

                <StepBar current={step} />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Card header */}
                    <div className="px-7 py-5 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-display text-[17px] font-bold text-slate-900 m-0">
                            Step {step} of 4 — {STEP_META[step - 1].title}
                        </h3>
                        <p className="m-0 mt-1 text-[13px] text-slate-400">{STEP_META[step - 1].sub}</p>
                    </div>

                    {/* Card body */}
                    <div className="p-7">
                        {step === 1 && <Step1 form={form} setField={setField} errors={errors} schoolId={schoolId} schoolName={schoolName} />}
                        {step === 2 && <Step2 form={form} setField={setField} errors={errors} />}
                        {step === 3 && <Step3 form={form} />}
                        {step === 4 && <Step4 form={form} />}
                    </div>

                    {/* Footer */}
                    <div className="px-7 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                        <button onClick={step === 1 ? onCancel : back}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] border border-slate-200 bg-white text-slate-600 cursor-pointer font-semibold text-sm hover:bg-slate-50 transition-colors">
                            <ChevronLeft size={15} /> {step === 1 ? 'Cancel' : 'Previous'}
                        </button>
                        {step < 4
                            ? <button onClick={next}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] border-none bg-blue-700 text-white cursor-pointer font-bold text-sm hover:bg-blue-800 transition-colors">
                                Next <ChevronRight size={15} />
                              </button>
                            : <button onClick={() => onSubmit(form)}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] border-none bg-emerald-600 text-white cursor-pointer font-bold text-sm hover:bg-emerald-700 transition-colors">
                                <CheckCircle size={15} /> Submit Request
                              </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CardRequests() {
    const { can, user } = useAuth();

    const currentSchoolId   = user?.school_id   || user?.schoolId   || '';
    const currentSchoolName = user?.school_name || user?.schoolName || currentSchoolId;

    const [requests,     setRequests]     = useState(MOCK_CARD_REQUESTS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search,       setSearch]       = useState('');
    const [rejectingId,  setRejectingId]  = useState(null);
    const [expandedId,   setExpandedId]   = useState(null);
    const [view,         setView]         = useState('list');
    const [successData,  setSuccessData]  = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    const myRequests = requests.filter(r => r.school_id === currentSchoolId);
    const filtered   = myRequests.filter(r => {
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        const matchSearch = !debouncedSearch || r.school_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        ALL:      myRequests.length,
        PENDING:  myRequests.filter(r => r.status === 'PENDING').length,
        APPROVED: myRequests.filter(r => r.status === 'APPROVED').length,
        REJECTED: myRequests.filter(r => r.status === 'REJECTED').length,
    };

    const approve = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));
    const reject  = (id, reason) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: reason, reviewed_at: new Date().toISOString() } : r));
        setRejectingId(null);
    };

    const handleSubmit = (form) => {
        const newReq = {
            id: 'cr' + Date.now(),
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

    if (view === 'new') {
        return <NewRequestPage onCancel={() => setView('list')} onSubmit={handleSubmit} schoolId={currentSchoolId} schoolName={currentSchoolName} />;
    }

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[860px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {rejectingReq && <RejectModal request={rejectingReq} onClose={() => setRejectingId(null)} onConfirm={(reason) => reject(rejectingId, reason)} />}
                {successData  && <SuccessPopup submission={successData} onClose={() => setSuccessData(null)} />}

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-4 flex-wrap px-7 pt-6 pb-5 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h2 className="font-display text-xl font-bold text-slate-900 m-0">Card Requests</h2>
                        <p className="text-slate-400 text-sm mt-1 mb-0">Manage physical ID card requests submitted by schools</p>
                    </div>
                    <button onClick={() => setView('new')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] border-none bg-blue-700 text-white font-semibold text-sm cursor-pointer shrink-0 hover:bg-blue-800 transition-colors">
                        <Plus size={15} /> New Request
                    </button>
                </div>

                {/* ── Filters ────────────────────────────────────────────── */}
                <div className="flex gap-2 flex-wrap items-center px-7 py-4 border-b border-slate-200">
                    {Object.entries(counts).map(([key, count]) => {
                        const active = statusFilter === key;
                        return (
                            <button key={key} onClick={() => setStatusFilter(key)}
                                className={[
                                    'flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors',
                                    active ? 'border-blue-500 bg-blue-700 text-white font-bold' : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50',
                                ].join(' ')}>
                                {key === 'ALL' ? 'All' : humanizeEnum(key)}
                                <span className={`rounded-full px-1.5 text-xs font-bold ${active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400'}`}>{count}</span>
                            </button>
                        );
                    })}
                    <div className="ml-auto relative">
                        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school or ID..."
                            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none w-[220px] font-body focus:border-blue-500 transition-colors" />
                    </div>
                </div>

                {/* ── Request list ───────────────────────────────────────── */}
                <div className="flex flex-col gap-3 px-7 py-5">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-slate-400">
                            <Package size={36} className="opacity-30 mx-auto mb-3" />
                            <div className="font-medium">No card requests found</div>
                        </div>
                    ) : filtered.map(req => {
                        const s          = STATUS_STYLE[req.status];
                        const isExpanded = expandedId === req.id;
                        const addr       = req.delivery_address;
                        const { total }  = calcPricing(req.card_count);

                        return (
                            <div key={req.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-start gap-3.5">
                                        {/* Icon */}
                                        <div className="w-[42px] h-[42px] rounded-[10px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                                            <CreditCard size={18} className="text-blue-700" />
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="font-bold text-[15px] text-slate-900">{req.school_name}</span>
                                                <span className="font-mono text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded">{req.school_id}</span>
                                                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bgClass} ${s.colorClass}`}>
                                                    <s.Icon size={11} /> {s.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3.5 flex-wrap mt-1.5 text-[13px] text-slate-400">
                                                <span className="flex items-center gap-1 font-semibold text-blue-700"><CreditCard size={12} /> {req.card_count} cards</span>
                                                <span className="flex items-center gap-1 font-semibold text-emerald-600"><IndianRupee size={11} />{fmt(total).replace('₹', '')}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {addr.city}, {addr.state}</span>
                                                <span>Submitted {formatRelativeTime(req.created_at)}</span>
                                            </div>
                                            <div className="mt-2 text-[13px] text-slate-600 bg-white rounded-lg px-2.5 py-1.5 border-l-[3px] border-blue-200 line-clamp-2">
                                                {req.notes}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 shrink-0 items-start flex-wrap justify-end">
                                            {req.status === 'PENDING' && can('cardRequests.approve') && <>
                                                <button onClick={() => approve(req.id)}
                                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold text-[13px] cursor-pointer hover:bg-emerald-100 transition-colors">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button onClick={() => setRejectingId(req.id)}
                                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-400 bg-red-50 text-red-700 font-semibold text-[13px] cursor-pointer hover:bg-red-100 transition-colors">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>}
                                            {req.status !== 'PENDING' && req.reviewed_at && (
                                                <span className="text-xs text-slate-400 self-center">Reviewed {formatRelativeTime(req.reviewed_at)}</span>
                                            )}
                                            <button onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-100 transition-colors">
                                                <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {req.status === 'REJECTED' && req.reject_reason && (
                                        <div className="mt-3 px-3.5 py-2.5 bg-red-50 rounded-lg text-[13px] text-red-800 border-l-[3px] border-red-500">
                                            <strong>Rejection reason:</strong> {req.reject_reason}
                                        </div>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-slate-200 px-5 py-4 bg-white grid grid-cols-2 gap-5">
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Notes</div>
                                            <p className="m-0 text-[13.4px] text-slate-600 leading-relaxed">{req.notes}</p>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Delivery Address</div>
                                            <address className="not-italic text-[13.4px] text-slate-600 leading-relaxed">
                                                {addr.line1}{addr.line2 && <><br />{addr.line2}</>}<br />
                                                {addr.city}, {addr.state} – {addr.pincode}
                                            </address>
                                        </div>
                                        <div className="col-span-2 pt-3.5 border-t border-dashed border-slate-200 flex gap-8 flex-wrap">
                                            {[
                                                ['Cards',     String(req.card_count), 'text-blue-700',   'text-[22px]'],
                                                ['Amount',    fmt(total),             'text-emerald-600','text-lg'],
                                                ['School ID', req.school_id,          'text-slate-900',  'text-base'],
                                            ].map(([label, val, colorCls, sizeCls]) => (
                                                <div key={label}>
                                                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</div>
                                                    <div className={`font-display font-extrabold ${colorCls} ${sizeCls}`}>{val}</div>
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
        </div>
    );
}