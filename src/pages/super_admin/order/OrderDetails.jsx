/**
 * SUPER ADMIN — ORDER DETAILS
 * 10-phase progressive stepper for RESQID order management.
 * Production-grade with full phase implementations, dev mode, and smooth transitions.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, Lock, Unlock, Download,
    CreditCard, QrCode, Palette, Truck, Printer, PackageCheck,
    Building2, Users, FileText, Send, AlertCircle, Clock,
    ChevronRight, IndianRupee, MapPin, Phone, Mail, Hash,
    Layers, ExternalLink, RefreshCw, BarChart3, ShieldCheck,
    Circle
} from 'lucide-react';

// ─── Formatters ────────────────────────────────────────────────────────────────
const formatCurrency = (paise) => {
    if (paise == null) return '—';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(paise / 100);
};
const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_ORDER = {
    id: 'ord-123',
    order_number: 'ORD-2026-0123',
    school: {
        id: 'sch-001',
        name: 'Delhi Public School, Noida',
        code: 'SCH0042',
        serial_number: 42,
        email: 'principal@dpsnoida.edu.in',
        phone: '+91 9876543210',
        address: '123 School Lane, Sector 62, Noida, UP - 201301',
    },
    order_type: 'PRE_DETAILS',
    card_count: 100,
    channel: 'DASHBOARD',
    created_at: '2026-03-20T10:30:00Z',
    created_by: 'Principal Ravi Kumar',
    delivery_address: {
        name: 'Principal Ravi Kumar',
        phone: '+91 9876543210',
        address: '123 School Lane, Sector 62, Noida, UP - 201301',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
    },
    subscription: {
        plan: 'PRIVATE_STANDARD',
        unit_price: 19900,
        grand_total: 2348200,
        advance_amount: 1174100,
        balance_amount: 1174100,
    },
    phases: {
        1: { status: 'completed', completed_at: '2026-03-20T10:35:00Z', data: { confirmed: true, notes: 'Order approved by super admin.' } },
        2: { status: 'current', data: { amount: 1174100, due_days: 7, invoice_number: null, sent: false } },
        3: { status: 'locked', data: {} },
        4: { status: 'locked', data: {} },
        5: { status: 'locked', data: {} },
        6: { status: 'locked', data: {} },
        7: { status: 'locked', data: {} },
        8: { status: 'locked', data: {} },
        9: { status: 'locked', data: {} },
        10: { status: 'locked', data: {} },
    },
};

// ─── Phase Definitions ─────────────────────────────────────────────────────────
const PHASES = [
    { id: 1, icon: Building2, name: 'Order Confirmation', short: 'Confirm', description: 'Review order details and confirm or reject the request' },
    { id: 2, icon: FileText, name: 'Advance Invoice', short: 'Invoice', description: 'Generate and send the 50% advance invoice to school' },
    { id: 3, icon: CreditCard, name: 'Payment Tracking', short: 'Payment', description: 'Record advance payment received from the school' },
    { id: 4, icon: QrCode, name: 'Token Generation', short: 'Tokens', description: 'Generate secure QR tokens and card identifiers' },
    { id: 5, icon: Palette, name: 'Card Design', short: 'Design', description: 'Compose card designs using student data and template' },
    { id: 6, icon: Users, name: 'Vendor Assignment', short: 'Vendor', description: 'Select print vendor and share design files' },
    { id: 7, icon: Printer, name: 'Printing', short: 'Print', description: 'Track print job status with the vendor' },
    { id: 8, icon: Truck, name: 'Shipment', short: 'Ship', description: 'Create shipment and share tracking details' },
    { id: 9, icon: PackageCheck, name: 'Delivery & Balance', short: 'Delivery', description: 'Confirm delivery and auto-generate balance invoice' },
    { id: 10, icon: ShieldCheck, name: 'Completion', short: 'Done', description: 'Record balance payment and close the order' },
];

// ─── Shared UI Primitives ──────────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
    <label className="block text-[0.8rem] font-semibold text-[var(--text-secondary)] mb-1.5">
        {children}{required && <span className="text-[var(--color-danger-500)] ml-0.5">*</span>}
    </label>
);

const StyledInput = ({ value, onChange, placeholder, type = 'text', disabled, ...rest }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full py-2.5 px-3.5 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-white outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)] transition-all disabled:bg-[var(--color-slate-50)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
        {...rest}
    />
);

const StyledSelect = ({ value, onChange, children, disabled }) => (
    <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full py-2.5 px-3.5 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-white outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
    >
        {children}
    </select>
);

const StyledTextarea = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full py-2.5 px-3.5 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-white outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)] transition-all resize-none"
    />
);

const PrimaryBtn = ({ onClick, disabled, loading, children, icon: Icon }) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full py-3 px-5 rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-600)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-[var(--shadow-brand)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
    >
        {loading ? <RefreshCw size={15} className="animate-spin-fast" /> : Icon ? <Icon size={15} /> : null}
        {children}
    </button>
);

const SecondaryBtn = ({ onClick, children, icon: Icon }) => (
    <button
        onClick={onClick}
        className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-slate-50)] active:scale-[0.98] transition-all"
    >
        {Icon && <Icon size={15} />}
        {children}
    </button>
);

const InfoBadge = ({ color, children }) => {
    const styles = {
        success: 'bg-[var(--color-success-50)] border-[var(--color-success-100)] text-[var(--color-success-700)]',
        warning: 'bg-[var(--color-warning-50)] border-[var(--color-warning-100)] text-[var(--color-warning-700)]',
        danger: 'bg-[var(--color-danger-50)]  border-[var(--color-danger-100)]  text-[var(--color-danger-700)]',
        info: 'bg-[var(--color-info-50)]    border-[var(--color-info-100)]    text-[var(--color-info-700)]',
        brand: 'bg-[var(--color-brand-50)]   border-[var(--color-brand-100)]   text-[var(--color-brand-700)]',
        slate: 'bg-[var(--color-slate-50)]   border-[var(--color-slate-200)]   text-[var(--color-slate-700)]',
    };
    return (
        <div className={`rounded-xl px-4 py-3 border text-sm ${styles[color] || styles.slate}`}>
            {children}
        </div>
    );
};

const SuccessState = ({ title, subtitle, children }) => (
    <div className="flex flex-col items-center text-center py-6 gap-3">
        <div className="w-14 h-14 rounded-full bg-[var(--color-success-500)] flex items-center justify-center shadow-[0_6px_20px_rgba(16,185,129,0.3)]">
            <CheckCircle size={28} className="text-white" />
        </div>
        <div>
            <h4 className="font-bold text-[var(--color-success-700)] text-base">{title}</h4>
            {subtitle && <p className="text-sm text-[var(--color-success-600)] mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
);

const DataRow = ({ label, value, mono }) => (
    <div className="flex justify-between items-center py-1.5">
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
        <span className={`text-sm font-medium text-[var(--text-primary)] ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
);

// ─── Phase 1: Order Confirmation ───────────────────────────────────────────────
function Phase1Confirm({ order, data, onUpdate, onComplete }) {
    const [notes, setNotes] = useState(data?.notes || '');
    const [loading, setLoading] = useState(false);
    const [rejected, setRejected] = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            onUpdate({ confirmed: true, rejected: false, notes, confirmed_at: new Date().toISOString() });
            onComplete();
            setLoading(false);
        }, 800);
    };

    const handleReject = () => {
        setRejected(true);
        onUpdate({ confirmed: false, rejected: true, notes, rejected_at: new Date().toISOString() });
    };

    if (rejected) {
        return (
            <div className="flex flex-col items-center text-center py-6 gap-3">
                <div className="w-14 h-14 rounded-full bg-[var(--color-danger-500)] flex items-center justify-center">
                    <AlertCircle size={28} className="text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-[var(--color-danger-700)] text-base">Order Rejected</h4>
                    <p className="text-sm text-[var(--color-danger-600)] mt-0.5">This order has been rejected and the school will be notified.</p>
                </div>
            </div>
        );
    }

    if (data?.confirmed) {
        return <SuccessState title="Order Confirmed" subtitle={`Confirmed on ${formatDate(data.confirmed_at)}`} />;
    }

    return (
        <div className="space-y-5">
            {/* School Info */}
            <div className="bg-[var(--color-slate-50)] rounded-xl p-5 border border-[var(--border-default)] space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">School Details</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <DataRow label="School" value={order.school.name} />
                    <DataRow label="Code" value={order.school.code} mono />
                    <DataRow label="Email" value={order.school.email} />
                    <DataRow label="Phone" value={order.school.phone} />
                </div>
            </div>

            {/* Order Info */}
            <div className="bg-[var(--color-slate-50)] rounded-xl p-5 border border-[var(--border-default)] space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Order Details</p>
                <DataRow label="Order Number" value={order.order_number} mono />
                <DataRow label="Card Count" value={`${order.card_count.toLocaleString('en-IN')} cards`} />
                <DataRow label="Type" value={order.order_type} />
                <DataRow label="Channel" value={order.channel} />
                <DataRow label="Requested By" value={order.created_by} />
                <DataRow label="Placed On" value={formatDate(order.created_at)} />
            </div>

            {/* Delivery */}
            <div className="bg-[var(--color-slate-50)] rounded-xl p-5 border border-[var(--border-default)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Delivery Address</p>
                <p className="text-sm text-[var(--text-primary)] font-medium">{order.delivery_address.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {order.delivery_address.address}, {order.delivery_address.city}, {order.delivery_address.state} – {order.delivery_address.pincode}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{order.delivery_address.phone}</p>
            </div>

            {/* Notes */}
            <div>
                <FieldLabel>Internal Notes (optional)</FieldLabel>
                <StyledTextarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any confirmation notes..." rows={2} />
            </div>

            <div className="flex gap-3 pt-1">
                <button
                    onClick={handleReject}
                    className="flex-1 py-3 rounded-xl border border-[var(--color-danger-500)] text-[var(--color-danger-600)] bg-white font-semibold text-sm hover:bg-[var(--color-danger-50)] active:scale-[0.98] transition-all"
                >
                    Reject Order
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-600)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-[var(--shadow-brand)] disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={15} className="animate-spin-fast" /> : <CheckCircle size={15} />}
                    Confirm Order
                </button>
            </div>
        </div>
    );
}

// ─── Phase 2: Advance Invoice ──────────────────────────────────────────────────
function Phase2Invoice({ order, data, onUpdate, onComplete }) {
    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);
    const [invoiceData, setInvoiceData] = useState(data?.invoice_number ? data : {
        amount: order.subscription.advance_amount,
        due_days: 7,
        invoice_number: null,
        sent: false,
    });

    const sub = order.subscription;
    const subtotal = sub.unit_price * order.card_count;
    const gst = Math.round(subtotal * 0.18);

    const generateInvoice = () => {
        setGenerating(true);
        setTimeout(() => {
            const inv = {
                ...invoiceData,
                invoice_number: `INV-ADV-${Date.now()}`,
                generated_at: new Date().toISOString(),
                sent: false,
            };
            setInvoiceData(inv);
            setGenerating(false);
        }, 1200);
    };

    const sendInvoice = () => {
        setSending(true);
        setTimeout(() => {
            const updated = { ...invoiceData, sent: true, sent_at: new Date().toISOString() };
            setInvoiceData(updated);
            onUpdate(updated);
            onComplete();
            setSending(false);
        }, 800);
    };

    if (invoiceData.sent) {
        return (
            <SuccessState title="Invoice Sent" subtitle={`${invoiceData.invoice_number} sent to ${order.school.email}`}>
                <SecondaryBtn icon={Download}>Download PDF Copy</SecondaryBtn>
            </SuccessState>
        );
    }

    return (
        <div className="space-y-5">
            {/* Pricing Breakdown */}
            <div className="bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-slate-50)] rounded-xl p-5 border border-[var(--color-brand-100)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-600)] mb-3 flex items-center gap-1.5">
                    <IndianRupee size={12} /> Pricing Breakdown
                </p>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Unit Price</span><span>{formatCurrency(sub.unit_price)} / card</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Card Count</span><span>{order.card_count.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">GST (18%)</span><span>{formatCurrency(gst)}</span></div>
                    <div className="border-t border-[var(--color-brand-200)] pt-2 mt-1 flex justify-between font-bold text-sm">
                        <span>Grand Total</span><span>{formatCurrency(sub.grand_total)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[var(--color-brand-600)]">
                        <span>Advance (50%)</span><span>{formatCurrency(sub.advance_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                        <span>Balance Due Later</span><span>{formatCurrency(sub.balance_amount)}</span>
                    </div>
                </div>
            </div>

            {!invoiceData.invoice_number ? (
                <PrimaryBtn onClick={generateInvoice} loading={generating} icon={FileText}>
                    {generating ? 'Generating Invoice…' : 'Generate Advance Invoice'}
                </PrimaryBtn>
            ) : (
                <div className="space-y-4">
                    <InfoBadge color="success">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Invoice Number</p>
                                <p className="font-mono font-bold text-sm">{invoiceData.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Amount</p>
                                <p className="font-bold text-sm">{formatCurrency(invoiceData.amount)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Due In</p>
                                <p className="font-bold text-sm">{invoiceData.due_days} days</p>
                            </div>
                        </div>
                    </InfoBadge>

                    <div className="flex gap-3">
                        <SecondaryBtn icon={Download}>Download PDF</SecondaryBtn>
                        <button
                            onClick={sendInvoice}
                            disabled={sending}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-600)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {sending ? <RefreshCw size={15} className="animate-spin-fast" /> : <Send size={15} />}
                            Send to School
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Phase 3: Payment Tracking ─────────────────────────────────────────────────
function Phase3Payment({ order, data, onUpdate, onComplete }) {
    const [amount, setAmount] = useState(data?.amount ? String(data.amount) : '');
    const [mode, setMode] = useState(data?.mode || 'UPI');
    const [reference, setReference] = useState(data?.reference || '');
    const [notes, setNotes] = useState(data?.notes || '');
    const [loading, setLoading] = useState(false);

    if (data?.recorded) {
        return (
            <SuccessState title="Payment Recorded" subtitle={`${formatCurrency(data.amount)} via ${data.mode}`}>
                <p className="text-xs font-mono text-[var(--color-success-600)] bg-[var(--color-success-50)] px-3 py-1.5 rounded-lg border border-[var(--color-success-200)]">
                    Ref: {data.reference}
                </p>
            </SuccessState>
        );
    }

    const handleRecord = () => {
        setLoading(true);
        setTimeout(() => {
            const pd = { recorded: true, amount: parseInt(amount), mode, reference, notes, recorded_at: new Date().toISOString() };
            onUpdate(pd);
            onComplete();
            setLoading(false);
        }, 600);
    };

    return (
        <div className="space-y-4">
            <InfoBadge color="warning">
                <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[var(--color-warning-500)] shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Expected Payment: {formatCurrency(order.subscription.advance_amount)}</p>
                        <p className="text-xs mt-0.5 opacity-80">Awaiting advance payment from school — due 7 days from invoice</p>
                    </div>
                </div>
            </InfoBadge>

            <div>
                <FieldLabel required>Amount Received (₹)</FieldLabel>
                <StyledInput type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount in paise (e.g. 1174100)" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <FieldLabel required>Payment Mode</FieldLabel>
                    <StyledSelect value={mode} onChange={e => setMode(e.target.value)}>
                        <option>UPI</option>
                        <option>BANK_TRANSFER</option>
                        <option>CHEQUE</option>
                        <option>CASH</option>
                    </StyledSelect>
                </div>
                <div>
                    <FieldLabel>Reference / UTR</FieldLabel>
                    <StyledInput value={reference} onChange={e => setReference(e.target.value)} placeholder="Transaction ID / UTR" />
                </div>
            </div>

            <div>
                <FieldLabel>Notes</FieldLabel>
                <StyledTextarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional payment notes…" rows={2} />
            </div>

            <PrimaryBtn onClick={handleRecord} disabled={!amount || !reference} loading={loading} icon={CheckCircle}>
                Record Payment
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase 4: Token Generation ─────────────────────────────────────────────────
function Phase4Tokens({ order, data, onUpdate, onComplete }) {
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(data?.generated || 0);
    const [progress, setProgress] = useState(data?.generated ? 100 : 0);
    const total = order.card_count;
    const intervalRef = useRef(null);

    const start = () => {
        setGenerating(true);
        let current = 0;
        intervalRef.current = setInterval(() => {
            current += Math.floor(Math.random() * 8) + 4;
            if (current >= total) {
                clearInterval(intervalRef.current);
                setGenerating(false);
                setGenerated(total);
                setProgress(100);
                onUpdate({ generated: total, failed: 0, completed_at: new Date().toISOString() });
                onComplete();
            } else {
                setGenerated(current);
                setProgress(Math.floor((current / total) * 100));
            }
        }, 180);
    };

    if (generated === total && !generating) {
        return (
            <SuccessState title="Token Generation Complete" subtitle={`${total} tokens, QR codes & card IDs created`}>
                <div className="flex gap-3 w-full mt-1">
                    <SecondaryBtn icon={Download}>Download QR Codes (ZIP)</SecondaryBtn>
                    <SecondaryBtn icon={ExternalLink}>View All Tokens</SecondaryBtn>
                </div>
            </SuccessState>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total', value: total, color: 'brand' },
                    { label: 'Generated', value: generated, color: 'success' },
                    { label: 'Remaining', value: total - generated, color: 'warning' },
                ].map(stat => (
                    <div key={stat.label} className="bg-[var(--color-slate-50)] rounded-xl p-4 border border-[var(--border-default)] text-center">
                        <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex justify-between mb-2 text-sm">
                    <span className="font-semibold text-[var(--text-secondary)]">Generation Progress</span>
                    <span className="font-bold text-[var(--color-brand-600)]">{progress}%</span>
                </div>
                <div className="h-3 bg-[var(--color-slate-100)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-400)] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {generating && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 animate-pulse-soft">
                        Generating AES-SIV encrypted tokens with nonce deduplication…
                    </p>
                )}
            </div>

            {!generating && generated === 0 && (
                <PrimaryBtn onClick={start} icon={QrCode}>Start Token Generation</PrimaryBtn>
            )}
        </div>
    );
}

// ─── Phase 5: Card Design ──────────────────────────────────────────────────────
function Phase5Design({ order, data, onUpdate, onComplete }) {
    const [designing, setDesigning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(data?.designed === order.card_count);
    const intervalRef = useRef(null);

    const start = () => {
        setDesigning(true);
        let p = 0;
        intervalRef.current = setInterval(() => {
            p += Math.floor(Math.random() * 15) + 5;
            if (p >= 100) {
                clearInterval(intervalRef.current);
                setDesigning(false);
                setProgress(100);
                setDone(true);
                onUpdate({ designed: order.card_count, completed_at: new Date().toISOString() });
                onComplete();
            } else {
                setProgress(p);
            }
        }, 200);
    };

    if (done) {
        return (
            <SuccessState title="Card Designs Ready" subtitle={`${order.card_count} cards composed with student data`}>
                <div className="flex gap-3 w-full mt-1">
                    <SecondaryBtn icon={Download}>Download Designs (ZIP)</SecondaryBtn>
                    <SecondaryBtn icon={ExternalLink}>Preview Sample Card</SecondaryBtn>
                </div>
            </SuccessState>
        );
    }

    return (
        <div className="space-y-5">
            <InfoBadge color="brand">
                <div className="flex items-center gap-3">
                    <Palette size={20} className="text-[var(--color-brand-500)] shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Template: Default School Card (CR80)</p>
                        <p className="text-xs mt-0.5 opacity-80">School name, student photo, QR code, emergency contact</p>
                    </div>
                </div>
            </InfoBadge>

            {designing && (
                <div>
                    <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium text-[var(--text-secondary)]">Compositing Cards…</span>
                        <span className="font-bold text-[var(--color-brand-600)]">{progress}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-slate-100)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-400)] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <SecondaryBtn icon={ExternalLink}>Preview Sample</SecondaryBtn>
                <button
                    onClick={start}
                    disabled={designing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-600)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-[var(--shadow-brand)] disabled:opacity-50"
                >
                    {designing ? <RefreshCw size={15} className="animate-spin-fast" /> : <Palette size={15} />}
                    {designing ? 'Generating…' : 'Generate Card Designs'}
                </button>
            </div>
        </div>
    );
}

// ─── Phase 6: Vendor Assignment ────────────────────────────────────────────────
function Phase6Vendor({ data, onUpdate, onComplete }) {
    const [vendor, setVendor] = useState(data?.vendor_id || '');
    const [loading, setLoading] = useState(false);

    const VENDORS = [
        { id: 'v1', name: 'PrintMaster Noida', eta: '2 days', rating: 4.9 },
        { id: 'v2', name: 'ABC Printers Delhi', eta: '3 days', rating: 4.6 },
        { id: 'v3', name: 'XYZ Cards Pune', eta: '5 days', rating: 4.3 },
    ];

    if (data?.vendor_id) {
        const v = VENDORS.find(x => x.id === data.vendor_id);
        return <SuccessState title="Vendor Assigned" subtitle={`${v?.name || data.vendor_id} · Files shared`} />;
    }

    const handleAssign = () => {
        setLoading(true);
        setTimeout(() => {
            onUpdate({ vendor_id: vendor, assigned_at: new Date().toISOString(), files_shared: true });
            onComplete();
            setLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {VENDORS.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setVendor(v.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${vendor === v.id
                            ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]'
                            : 'border-[var(--border-default)] bg-white hover:border-[var(--color-slate-300)]'}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className={`font-semibold text-sm ${vendor === v.id ? 'text-[var(--color-brand-700)]' : 'text-[var(--text-primary)]'}`}>{v.name}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">ETA: {v.eta} · Rating: {v.rating} ★</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${vendor === v.id ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-slate-300)]'}`}>
                                {vendor === v.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <PrimaryBtn onClick={handleAssign} disabled={!vendor} loading={loading} icon={Users}>
                Assign Vendor & Share Files
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase 7: Printing ─────────────────────────────────────────────────────────
function Phase7Printing({ data, onUpdate, onComplete }) {
    const [status, setStatus] = useState(data?.print_status || 'pending');
    const [notes, setNotes] = useState(data?.notes || '');
    const [loading, setLoading] = useState(false);

    const STATUS_OPTIONS = [
        { id: 'pending', label: 'Not Started', color: 'text-[var(--text-muted)]' },
        { id: 'in_progress', label: 'In Progress', color: 'text-[var(--color-warning-600)]' },
        { id: 'complete', label: 'Complete', color: 'text-[var(--color-success-600)]' },
    ];

    if (data?.print_status === 'complete') {
        return <SuccessState title="Printing Complete" subtitle="All cards printed and quality-checked" />;
    }

    const handleUpdate = () => {
        setLoading(true);
        setTimeout(() => {
            onUpdate({ print_status: status, notes, updated_at: new Date().toISOString() });
            if (status === 'complete') onComplete();
            setLoading(false);
        }, 500);
    };

    return (
        <div className="space-y-4">
            <div>
                <FieldLabel>Print Status</FieldLabel>
                <div className="flex gap-2">
                    {STATUS_OPTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setStatus(s.id)}
                            className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${status === s.id
                                ? 'bg-[var(--color-brand-500)] text-white border-[var(--color-brand-500)]'
                                : 'bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--color-slate-300)]'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <FieldLabel>Vendor Notes</FieldLabel>
                <StyledTextarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Print progress notes from vendor…" rows={2} />
            </div>

            <PrimaryBtn onClick={handleUpdate} loading={loading} icon={Printer}>
                {status === 'complete' ? 'Mark Printing Complete' : 'Update Print Status'}
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase 8: Shipment ─────────────────────────────────────────────────────────
function Phase8Shipment({ data, onUpdate, onComplete }) {
    const [courier, setCourier] = useState(data?.courier || '');
    const [awb, setAwb] = useState(data?.awb || '');
    const [trackingUrl, setTrackingUrl] = useState(data?.tracking_url || '');
    const [loading, setLoading] = useState(false);

    if (data?.awb) {
        return (
            <SuccessState title="Shipment Created" subtitle={`${data.courier} · AWB: ${data.awb}`}>
                {data.tracking_url && (
                    <a href={data.tracking_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-600)] font-medium hover:underline">
                        <ExternalLink size={14} /> Track Shipment
                    </a>
                )}
            </SuccessState>
        );
    }

    const handleCreate = () => {
        setLoading(true);
        setTimeout(() => {
            onUpdate({ courier, awb, tracking_url: trackingUrl, created_at: new Date().toISOString() });
            onComplete();
            setLoading(false);
        }, 700);
    };

    return (
        <div className="space-y-4">
            <div>
                <FieldLabel required>Courier / Logistics Partner</FieldLabel>
                <StyledSelect value={courier} onChange={e => setCourier(e.target.value)}>
                    <option value="">Select courier…</option>
                    <option>Delhivery</option>
                    <option>Blue Dart</option>
                    <option>Ekart</option>
                    <option>DTDC</option>
                    <option>India Post</option>
                    <option>Other</option>
                </StyledSelect>
            </div>

            <div>
                <FieldLabel required>AWB / Tracking Number</FieldLabel>
                <StyledInput value={awb} onChange={e => setAwb(e.target.value)} placeholder="e.g. 1234567890123" />
            </div>

            <div>
                <FieldLabel>Tracking URL</FieldLabel>
                <StyledInput value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://track.delhivery.com/..." />
            </div>

            <PrimaryBtn onClick={handleCreate} disabled={!awb || !courier} loading={loading} icon={Truck}>
                Create Shipment
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase 9: Delivery & Balance ───────────────────────────────────────────────
function Phase9Delivery({ order, data, onUpdate, onComplete }) {
    const [notes, setNotes] = useState(data?.notes || '');
    const [loading, setLoading] = useState(false);

    if (data?.confirmed) {
        return (
            <SuccessState title="Delivery Confirmed" subtitle="Balance invoice auto-generated and sent to school">
                <p className="text-xs font-mono text-[var(--color-success-600)] bg-[var(--color-success-50)] px-3 py-1.5 rounded-lg border border-[var(--color-success-200)]">
                    {data.balance_invoice?.invoice_number}
                </p>
            </SuccessState>
        );
    }

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            const balanceInvoice = {
                invoice_number: `INV-BAL-${Date.now()}`,
                amount: order.subscription.balance_amount,
                due_days: 7,
                generated_at: new Date().toISOString(),
                sent: true,
            };
            onUpdate({ confirmed: true, notes, balance_invoice: balanceInvoice, confirmed_at: new Date().toISOString() });
            onComplete();
            setLoading(false);
        }, 900);
    };

    return (
        <div className="space-y-5">
            <InfoBadge color="info">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-sm">Confirm Delivery</p>
                        <p className="text-xs mt-0.5 opacity-80">This will auto-generate the balance invoice and send to school</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-70">Balance Due</p>
                        <p className="font-bold">{formatCurrency(order.subscription.balance_amount)}</p>
                    </div>
                </div>
            </InfoBadge>

            <div>
                <FieldLabel>Delivery Notes</FieldLabel>
                <StyledTextarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery confirmation details, recipient name, date…" rows={3} />
            </div>

            <PrimaryBtn onClick={handleConfirm} loading={loading} icon={PackageCheck}>
                Confirm Delivery & Generate Balance Invoice
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase 10: Completion ──────────────────────────────────────────────────────
function Phase10Complete({ order, data, onUpdate, onComplete }) {
    const [amount, setAmount] = useState(data?.balance_amount ? String(data.balance_amount) : '');
    const [reference, setReference] = useState(data?.reference || '');
    const [loading, setLoading] = useState(false);

    if (data?.completed) {
        return (
            <div className="flex flex-col items-center text-center py-6 gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                    <ShieldCheck size={32} className="text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-lg">Order Completed!</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Balance payment recorded and order closed successfully.</p>
                    <p className="text-xs font-mono mt-2 text-[var(--text-muted)]">Ref: {data.reference}</p>
                </div>
            </div>
        );
    }

    const handleComplete = () => {
        setLoading(true);
        setTimeout(() => {
            onUpdate({ completed: true, balance_amount: parseInt(amount), reference, completed_at: new Date().toISOString() });
            onComplete();
            setLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-4">
            <InfoBadge color="brand">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">Balance Payment Due</p>
                    <p className="font-bold text-sm">{formatCurrency(order.subscription.balance_amount)}</p>
                </div>
            </InfoBadge>

            <div>
                <FieldLabel required>Amount Received (paise)</FieldLabel>
                <StyledInput type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1174100" />
            </div>
            <div>
                <FieldLabel required>Payment Reference / UTR</FieldLabel>
                <StyledInput value={reference} onChange={e => setReference(e.target.value)} placeholder="Transaction ID / UTR number" />
            </div>

            <PrimaryBtn onClick={handleComplete} disabled={!amount || !reference} loading={loading} icon={ShieldCheck}>
                Complete Order
            </PrimaryBtn>
        </div>
    );
}

// ─── Phase Component Map ───────────────────────────────────────────────────────
const PHASE_COMPONENTS = {
    1: Phase1Confirm,
    2: Phase2Invoice,
    3: Phase3Payment,
    4: Phase4Tokens,
    5: Phase5Design,
    6: Phase6Vendor,
    7: Phase7Printing,
    8: Phase8Shipment,
    9: Phase9Delivery,
    10: Phase10Complete,
};

// ─── Stepper Bar ───────────────────────────────────────────────────────────────
function StepperBar({ phases, order, activePhase, devMode, onStepClick }) {
    return (
        <div className="relative overflow-x-auto">
            <div className="flex items-start min-w-max px-5 py-5 gap-0">
                {PHASES.map((phase, idx) => {
                    const status = order.phases[phase.id].status;
                    const PhaseIcon = phase.icon;
                    const isActive = activePhase === phase.id;
                    const isCompleted = status === 'completed';
                    const isLocked = status === 'locked' && !devMode;
                    const isCurrent = status === 'current';
                    const isLast = idx === PHASES.length - 1;
                    const canClick = isCompleted || isCurrent || devMode;

                    return (
                        <div key={phase.id} className={`flex items-center ${!isLast ? 'flex-1 min-w-[100px]' : ''}`}>
                            {/* Step node */}
                            <button
                                onClick={() => canClick && onStepClick(phase.id)}
                                disabled={!canClick}
                                className="flex flex-col items-center gap-1.5 group flex-shrink-0"
                                title={isLocked ? 'Complete previous steps first' : phase.name}
                            >
                                {/* Circle */}
                                <div className={[
                                    'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border-2',
                                    isCompleted
                                        ? 'bg-[var(--color-success-500)] border-[var(--color-success-500)] shadow-[0_0_0_3px_var(--color-success-100)]'
                                        : isActive
                                            ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] shadow-[0_0_0_3px_var(--color-brand-100)]'
                                            : isLocked
                                                ? 'bg-white border-[var(--color-slate-200)] cursor-not-allowed'
                                                : 'bg-white border-[var(--color-slate-300)] group-hover:border-[var(--color-brand-400)]',
                                ].join(' ')}>
                                    {isCompleted
                                        ? <CheckCircle size={16} className="text-white" />
                                        : isLocked
                                            ? <Lock size={13} className="text-[var(--color-slate-400)]" />
                                            : <PhaseIcon size={15} className={isActive ? 'text-white' : 'text-[var(--color-slate-500)]'} />}
                                </div>

                                {/* Label */}
                                <span className={[
                                    'text-[0.65rem] font-semibold whitespace-nowrap transition-colors',
                                    isActive
                                        ? 'text-[var(--color-brand-600)]'
                                        : isCompleted
                                            ? 'text-[var(--color-success-600)]'
                                            : 'text-[var(--text-muted)]',
                                ].join(' ')}>
                                    {phase.short}
                                </span>
                            </button>

                            {/* Connector line */}
                            {!isLast && (
                                <div className="flex-1 mx-2 mb-5">
                                    <div className={`h-0.5 w-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-[var(--color-success-400)]' : 'bg-[var(--color-slate-200)]'}`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Order Summary Card ────────────────────────────────────────────────────────
function OrderSummaryCard({ order }) {
    const completedCount = Object.values(order.phases).filter(p => p.status === 'completed').length;
    const progressPct = Math.round((completedCount / 10) * 100);

    return (
        <div className="card p-5 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left */}
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                        <Layers size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-[var(--text-primary)]">{order.school.name}</h3>
                            <span className="text-xs font-mono bg-[var(--color-slate-100)] text-[var(--text-muted)] px-2 py-0.5 rounded-md">{order.school.code}</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{order.order_number}</p>
                        <div className="flex gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-[var(--text-secondary)]"><span className="font-semibold">{order.card_count}</span> cards</span>
                            <span className="text-xs text-[var(--text-secondary)]">{order.order_type}</span>
                            <span className="text-xs text-[var(--text-secondary)]">{order.channel}</span>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6 text-right flex-wrap">
                    <div>
                        <p className="text-xs text-[var(--text-muted)]">Grand Total</p>
                        <p className="font-bold text-[var(--text-primary)]">{formatCurrency(order.subscription.grand_total)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)]">Advance</p>
                        <p className="font-bold text-[var(--color-brand-600)]">{formatCurrency(order.subscription.advance_amount)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Progress ({completedCount}/10)</p>
                        <div className="w-28 h-1.5 bg-[var(--color-slate-100)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-400)] rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main OrderDetails Page ────────────────────────────────────────────────────
export default function OrderDetails() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [devMode, setDevMode] = useState(true);
    const [order, setOrder] = useState(MOCK_ORDER);
    const [activePhase, setActivePhase] = useState(() => {
        for (let i = 1; i <= 10; i++) {
            if (order.phases[i].status !== 'completed') return i;
        }
        return 1;
    });

    const updatePhaseData = (phaseId, data) => {
        setOrder(prev => ({
            ...prev,
            phases: {
                ...prev.phases,
                [phaseId]: {
                    ...prev.phases[phaseId],
                    data: { ...prev.phases[phaseId].data, ...data },
                },
            },
        }));
    };

    const completePhase = (phaseId) => {
        setOrder(prev => {
            const updated = {
                ...prev,
                phases: {
                    ...prev.phases,
                    [phaseId]: {
                        ...prev.phases[phaseId],
                        status: 'completed',
                        completed_at: new Date().toISOString(),
                    },
                },
            };
            if (phaseId < 10) {
                updated.phases[phaseId + 1] = {
                    ...updated.phases[phaseId + 1],
                    status: 'current',
                };
            }
            return updated;
        });
        if (phaseId < 10) setActivePhase(phaseId + 1);
    };

    const handleStepClick = (phaseId) => {
        const status = order.phases[phaseId].status;
        if (status === 'completed' || status === 'current') {
            setActivePhase(phaseId);
        } else if (devMode) {
            // Dev mode: skip to any phase
            setOrder(prev => {
                const updated = { ...prev, phases: { ...prev.phases } };
                for (let i = 1; i < phaseId; i++) {
                    if (updated.phases[i].status !== 'completed') {
                        updated.phases[i] = { ...updated.phases[i], status: 'completed', data: { ...updated.phases[i].data, skipped: true } };
                    }
                }
                updated.phases[phaseId] = { ...updated.phases[phaseId], status: 'current' };
                return updated;
            });
            setActivePhase(phaseId);
        }
    };

    const currentPhaseStatus = order.phases[activePhase]?.status;
    const isReadOnly = currentPhaseStatus === 'completed';
    const activePhaseDef = PHASES.find(p => p.id === activePhase);
    const ActivePhaseComponent = PHASE_COMPONENTS[activePhase] || (() => <p>Phase not implemented</p>);
    const completedCount = Object.values(order.phases).filter(p => p.status === 'completed').length;
    const allDone = completedCount === 10;

    return (
        <div className="max-w-[1400px] mx-auto py-6 px-6 animate-fade-in">
            {/* Breadcrumb + header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-[var(--color-slate-100)] transition-colors text-[var(--text-secondary)]"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
                            <span>Orders</span>
                            <ChevronRight size={12} />
                            <span className="font-mono text-[var(--text-secondary)]">{order.order_number}</span>
                        </div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)] leading-tight">{order.school.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Order status chip */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${allDone
                        ? 'bg-[var(--color-success-100)] text-[var(--color-success-700)]'
                        : 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)]'
                        }`}>
                        {allDone ? '✓ Completed' : `Phase ${completedCount + 1} of 10`}
                    </span>

                    {/* Dev Mode toggle */}
                    <button
                        onClick={() => setDevMode(d => !d)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${devMode
                            ? 'bg-[var(--color-warning-50)] border-[var(--color-warning-200)] text-[var(--color-warning-700)]'
                            : 'bg-[var(--color-slate-100)] border-[var(--border-default)] text-[var(--text-muted)]'
                            }`}
                    >
                        {devMode ? <Unlock size={11} /> : <Lock size={11} />}
                        Dev Mode {devMode ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Order summary */}
            <OrderSummaryCard order={order} />

            {/* Main stepper card */}
            <div className="card overflow-hidden">
                {/* Stepper header */}
                <div className="border-b border-[var(--border-default)] bg-[var(--color-slate-50)]">
                    <StepperBar
                        order={order}
                        activePhase={activePhase}
                        devMode={devMode}
                        onStepClick={handleStepClick}
                    />
                </div>

                {/* Phase content */}
                <div className="flex divide-x divide-[var(--border-default)]">
                    {/* Left: Phase form (max 560px) */}
                    <div className="flex-1 max-w-[560px] p-7">
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${isReadOnly
                                    ? 'bg-[var(--color-success-500)]'
                                    : 'bg-[var(--color-brand-600)]'
                                    }`}>
                                    {isReadOnly
                                        ? <CheckCircle size={14} />
                                        : activePhaseDef?.icon && <activePhaseDef.icon size={14} />}
                                </div>
                                <h3 className="font-bold text-[var(--text-primary)]">
                                    Phase {activePhase}: {activePhaseDef?.name}
                                </h3>
                                {isReadOnly && (
                                    <span className="text-xs font-semibold bg-[var(--color-success-100)] text-[var(--color-success-700)] px-2 py-0.5 rounded-full">Completed</span>
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] ml-9">{activePhaseDef?.description}</p>
                        </div>

                        <div className={`transition-opacity duration-200 ${isReadOnly ? 'opacity-80' : 'opacity-100'}`}>
                            <ActivePhaseComponent
                                order={order}
                                data={order.phases[activePhase]?.data}
                                onUpdate={(data) => updatePhaseData(activePhase, data)}
                                onComplete={() => completePhase(activePhase)}
                                devMode={devMode}
                            />
                        </div>

                        {/* Read-only notice */}
                        {isReadOnly && (
                            <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--color-slate-50)] rounded-lg px-3 py-2 border border-[var(--border-default)]">
                                <CheckCircle size={12} className="text-[var(--color-success-500)]" />
                                Completed on {formatDate(order.phases[activePhase]?.completed_at)} — read-only
                            </div>
                        )}
                    </div>

                    {/* Right: Phase log / nav panel */}
                    <div className="hidden xl:block w-[280px] p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">All Phases</p>
                        <div className="space-y-1">
                            {PHASES.map(phase => {
                                const status = order.phases[phase.id].status;
                                const isActive = phase.id === activePhase;
                                const isCompleted = status === 'completed';
                                const isLocked = status === 'locked' && !devMode;
                                const PhaseIcon = phase.icon;

                                return (
                                    <button
                                        key={phase.id}
                                        onClick={() => !isLocked && handleStepClick(phase.id)}
                                        disabled={isLocked}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive
                                            ? 'bg-[var(--color-brand-50)] border border-[var(--color-brand-200)]'
                                            : isCompleted
                                                ? 'hover:bg-[var(--color-success-50)] border border-transparent hover:border-[var(--color-success-200)]'
                                                : isLocked
                                                    ? 'opacity-40 cursor-not-allowed border border-transparent'
                                                    : 'hover:bg-[var(--color-slate-50)] border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? 'bg-[var(--color-success-100)]' : isActive ? 'bg-[var(--color-brand-100)]' : 'bg-[var(--color-slate-100)]'
                                            }`}>
                                            {isCompleted
                                                ? <CheckCircle size={13} className="text-[var(--color-success-600)]" />
                                                : isLocked
                                                    ? <Lock size={13} className="text-[var(--color-slate-400)]" />
                                                    : <PhaseIcon size={13} className={isActive ? 'text-[var(--color-brand-600)]' : 'text-[var(--color-slate-500)]'} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-semibold truncate ${isActive ? 'text-[var(--color-brand-700)]' : isCompleted ? 'text-[var(--color-success-700)]' : 'text-[var(--text-secondary)]'
                                                }`}>
                                                {phase.name}
                                            </p>
                                            {isCompleted && (
                                                <p className="text-[0.6rem] text-[var(--text-muted)] truncate">{formatDate(order.phases[phase.id].completed_at)}</p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}