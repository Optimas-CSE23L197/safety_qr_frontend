/**
 * SUPER ADMIN — REGISTER SCHOOL
 * Multi-step form: School Info → Admin Account → Subscription → Review.
 * Production-grade with validation, error states and progress indicator.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, User, CreditCard, CheckCircle,
    ArrowLeft, ArrowRight, Eye, EyeOff,
} from 'lucide-react';
import { ROUTES } from '../../config/routes.config.js';

const STEPS = [
    { id: 1, label: 'School Info',   icon: Building2    },
    { id: 2, label: 'Admin Account', icon: User         },
    { id: 3, label: 'Subscription',  icon: CreditCard   },
    { id: 4, label: 'Review',        icon: CheckCircle  },
];

const PLANS = [
    {
        id: 'starter', name: 'Starter', price: '₹2,499/mo',
        features: ['Up to 200 students', 'Email notifications', 'Basic scan logs', 'Standard support'],
        color: '#64748B',
    },
    {
        id: 'growth', name: 'Growth', price: '₹5,999/mo',
        features: ['Up to 1,000 students', 'SMS + Email alerts', 'Anomaly detection', 'Priority support'],
        color: '#2563EB', recommended: true,
    },
    {
        id: 'enterprise', name: 'Enterprise', price: '₹12,999/mo',
        features: ['Unlimited students', 'All notifications', 'Advanced analytics', 'Dedicated support'],
        color: '#7C3AED',
    },
];

// ─── Shared field wrapper ─────────────────────────────────────────────────────
const FieldGroup = ({ label, required, error, children }) => (
    <div className="mb-4">
        <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
            {label} {required && <span className="text-danger-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
);

// ─── Shared text input ────────────────────────────────────────────────────────
const Input = ({ value, onChange, placeholder, type = 'text', suffix, ...rest }) => (
    <div className="relative flex items-center">
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={[
                'w-full border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] outline-none transition-colors box-border',
                suffix ? 'py-[9px] pl-3 pr-9' : 'py-[9px] px-3',
                'focus:border-brand-500',
            ].join(' ')}
            {...rest}
        />
        {suffix && (
            <div className="absolute right-2.5 flex items-center">
                {suffix}
            </div>
        )}
    </div>
);

// ─── Shared select ────────────────────────────────────────────────────────────
const Select = ({ value, onChange, children }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none focus:border-brand-500 transition-colors"
    >
        {children}
    </select>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterSchool() {
    const navigate = useNavigate();
    const [step,       setStep]       = useState(1);
    const [showPass,   setShowPass]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted,  setSubmitted]  = useState(false);

    const [schoolInfo, setSchoolInfo] = useState({
        name: '', code: '', email: '', phone: '', city: '', address: '', timezone: 'Asia/Kolkata',
    });
    const [adminInfo, setAdminInfo] = useState({
        name: '', email: '', password: '', role: 'ADMIN',
    });
    const [plan,       setPlan]       = useState('growth');
    const [trialDays,  setTrialDays]  = useState(14);

    const siChange = (f) => (e) => setSchoolInfo(p => ({ ...p, [f]: e.target.value }));
    const aiChange = (f) => (e) => setAdminInfo(p => ({ ...p, [f]: e.target.value }));

    const canNext = () => {
        if (step === 1) return schoolInfo.name && schoolInfo.code && schoolInfo.email;
        if (step === 2) return adminInfo.name && adminInfo.email && adminInfo.password.length >= 8;
        if (step === 3) return !!plan;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    /* ── Success screen ──────────────────────────────────────────────────── */
    if (submitted) {
        return (
            <div className="max-w-[560px] mx-auto mt-[60px] text-center px-4">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(16,185,129,0.3)]">
                    <CheckCircle size={36} className="text-white" />
                </div>

                <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] m-0 mb-3">
                    School Registered!
                </h2>
                <p className="text-[var(--text-secondary)] text-[0.9375rem] leading-relaxed mb-8">
                    <strong>{schoolInfo.name}</strong> has been registered successfully.
                    The admin account for <strong>{adminInfo.email}</strong> has been created with a {trialDays}-day trial.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(ROUTES.SUPER_ADMIN.ALL_SCHOOLS)}
                        className="py-[9px] px-5 rounded-lg border border-[var(--border-default)] bg-white font-medium cursor-pointer text-[var(--text-secondary)] hover:bg-slate-50 transition-colors"
                    >
                        View All Schools
                    </button>
                    <button
                        onClick={() => {
                            setSubmitted(false); setStep(1);
                            setSchoolInfo({ name: '', code: '', email: '', phone: '', city: '', address: '', timezone: 'Asia/Kolkata' });
                            setAdminInfo({ name: '', email: '', password: '', role: 'ADMIN' });
                        }}
                        className="py-[9px] px-5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Register Another
                    </button>
                </div>
            </div>
        );
    }

    /* ── Main form ───────────────────────────────────────────────────────── */
    return (
        <div className="max-w-[680px] mx-auto py-8 px-4">

            {/* Header */}
            <div className="mb-7">
                <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] m-0 mb-1">
                    Register School
                </h2>
                <p className="text-[var(--text-muted)] text-[0.9375rem] m-0">
                    Create a new school account on the platform
                </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center mb-8">
                {STEPS.map((s, idx) => {
                    const StepIcon = s.icon;
                    const done    = step > s.id;
                    const active  = step === s.id;
                    return (
                        <div
                            key={s.id}
                            className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}
                        >
                            <div className="flex flex-col items-center gap-1.5">
                                {/* Circle */}
                                <div className={[
                                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                                    done   ? 'bg-success-500'  : '',
                                    active ? 'bg-brand-600'    : '',
                                    !done && !active ? 'bg-slate-100' : '',
                                ].join(' ')}>
                                    {done
                                        ? <CheckCircle size={16} className="text-white" />
                                        : <StepIcon size={16} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />}
                                </div>
                                {/* Label */}
                                <span className={[
                                    'text-[0.6875rem] font-semibold whitespace-nowrap',
                                    step >= s.id ? 'text-success-500' : 'text-[var(--text-muted)]',
                                ].join(' ')}>
                                    {s.label}
                                </span>
                            </div>

                            {/* Connector line */}
                            {idx < STEPS.length - 1 && (
                                <div className={[
                                    'flex-1 h-0.5 mx-2 mb-[22px] transition-colors',
                                    done ? 'bg-success-500' : 'bg-slate-200',
                                ].join(' ')} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Form card */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">

                {/* ── Step 1: School Info ─────────────────────────────────── */}
                {step === 1 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-6">
                            School Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-5">
                            <FieldGroup label="School Name" required>
                                <Input value={schoolInfo.name} onChange={siChange('name')} placeholder="e.g. Delhi Public School" />
                            </FieldGroup>
                            <FieldGroup label="School Code" required>
                                <Input value={schoolInfo.code} onChange={siChange('code')} placeholder="e.g. DPS-001" />
                            </FieldGroup>
                            <FieldGroup label="Email Address" required>
                                <Input type="email" value={schoolInfo.email} onChange={siChange('email')} placeholder="info@school.edu.in" />
                            </FieldGroup>
                            <FieldGroup label="Phone Number">
                                <Input type="tel" value={schoolInfo.phone} onChange={siChange('phone')} placeholder="+91 98765 43210" />
                            </FieldGroup>
                            <FieldGroup label="City">
                                <Input value={schoolInfo.city} onChange={siChange('city')} placeholder="e.g. New Delhi" />
                            </FieldGroup>
                            <FieldGroup label="Timezone">
                                <Select value={schoolInfo.timezone} onChange={siChange('timezone')}>
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                                    <option value="UTC">UTC</option>
                                </Select>
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Address">
                            <textarea
                                value={schoolInfo.address}
                                onChange={siChange('address')}
                                placeholder="Full school address..."
                                rows={3}
                                className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] outline-none resize-y box-border focus:border-brand-500 transition-colors"
                            />
                        </FieldGroup>
                    </div>
                )}

                {/* ── Step 2: Admin Account ───────────────────────────────── */}
                {step === 2 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-2">
                            School Admin Account
                        </h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6">
                            This account will be used by the school administrator to log into the portal.
                        </p>
                        <div className="grid grid-cols-2 gap-x-5">
                            <FieldGroup label="Full Name" required>
                                <Input value={adminInfo.name} onChange={aiChange('name')} placeholder="e.g. Rajesh Kumar" />
                            </FieldGroup>
                            <FieldGroup label="Role">
                                <Select value={adminInfo.role} onChange={aiChange('role')}>
                                    <option value="ADMIN">Admin (full access)</option>
                                    <option value="STAFF">Staff (limited access)</option>
                                    <option value="VIEWER">Viewer (read-only)</option>
                                </Select>
                            </FieldGroup>
                            <FieldGroup label="Email Address" required>
                                <Input type="email" value={adminInfo.email} onChange={aiChange('email')} placeholder="admin@school.edu.in" />
                            </FieldGroup>
                            <FieldGroup
                                label="Temporary Password"
                                required
                                error={adminInfo.password && adminInfo.password.length < 8 ? 'Password must be at least 8 characters' : ''}
                            >
                                <Input
                                    type={showPass ? 'text' : 'password'}
                                    value={adminInfo.password}
                                    onChange={aiChange('password')}
                                    placeholder="Min. 8 characters"
                                    suffix={
                                        <button
                                            onClick={() => setShowPass(!showPass)}
                                            className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] p-0 hover:text-[var(--text-secondary)] transition-colors"
                                        >
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    }
                                />
                            </FieldGroup>
                        </div>

                        <div className="px-4 py-3 bg-brand-50 rounded-lg border border-brand-200 text-[0.8125rem] text-brand-700">
                            💡 The admin will receive a login email with instructions to set their permanent password.
                        </div>
                    </div>
                )}

                {/* ── Step 3: Subscription ────────────────────────────────── */}
                {step === 3 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-2">
                            Subscription Plan
                        </h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6">
                            Select a plan and set the trial period for the new school.
                        </p>

                        {/* Plan cards — color border/bg driven by plan.color (not in Tailwind palette) */}
                        <div className="flex flex-col gap-3 mb-6">
                            {PLANS.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setPlan(p.id)}
                                    className="px-5 py-[18px] rounded-[10px] cursor-pointer relative transition-all"
                                    style={{
                                        border: `2px solid ${plan === p.id ? p.color : 'var(--border-default)'}`,
                                        background: plan === p.id ? `${p.color}08` : 'white',
                                    }}
                                >
                                    {/* Recommended badge */}
                                    {p.recommended && (
                                        <span
                                            className="absolute -top-[10px] right-4 text-white text-[0.6875rem] font-bold px-2.5 py-0.5 rounded-full tracking-[0.05em]"
                                            style={{ background: p.color }}
                                        >
                                            RECOMMENDED
                                        </span>
                                    )}

                                    {/* Plan header */}
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2.5">
                                            {/* Radio dot */}
                                            <div
                                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                                style={{
                                                    borderColor: p.color,
                                                    background: plan === p.id ? p.color : 'white',
                                                }}
                                            >
                                                {plan === p.id && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                            <span className="font-display font-bold text-base text-[var(--text-primary)]">
                                                {p.name}
                                            </span>
                                        </div>
                                        <span className="font-display font-bold text-base" style={{ color: p.color }}>
                                            {p.price}
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <div className="flex gap-4 flex-wrap pl-[30px]">
                                        {p.features.map(f => (
                                            <span key={f} className="text-[0.8125rem] text-[var(--text-secondary)] flex items-center gap-1.5">
                                                <CheckCircle size={12} style={{ color: p.color }} /> {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trial period */}
                        <div className="flex items-center gap-4">
                            <label className="text-[0.8125rem] font-semibold text-[var(--text-secondary)]">
                                Trial Period:
                            </label>
                            {[0, 7, 14, 30].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setTrialDays(d)}
                                    className={[
                                        'py-1.5 px-3.5 rounded-[7px] border text-sm cursor-pointer transition-colors',
                                        trialDays === d
                                            ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                                    ].join(' ')}
                                >
                                    {d === 0 ? 'No trial' : `${d} days`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Step 4: Review ──────────────────────────────────────── */}
                {step === 4 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-6">
                            Review & Confirm
                        </h3>

                        {[
                            {
                                title: 'School Information',
                                items: [
                                    ['Name', schoolInfo.name], ['Code', schoolInfo.code],
                                    ['Email', schoolInfo.email], ['City', schoolInfo.city],
                                ],
                            },
                            {
                                title: 'Admin Account',
                                items: [
                                    ['Name', adminInfo.name], ['Email', adminInfo.email], ['Role', adminInfo.role],
                                ],
                            },
                            {
                                title: 'Subscription',
                                items: [
                                    ['Plan', PLANS.find(p => p.id === plan)?.name],
                                    ['Trial', trialDays === 0 ? 'None' : `${trialDays} days`],
                                ],
                            },
                        ].map(section => (
                            <div key={section.title} className="mb-5">
                                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em] mb-2">
                                    {section.title}
                                </div>
                                <div className="bg-slate-50 rounded-lg border border-[var(--border-default)] overflow-hidden">
                                    {section.items.map(([k, v], idx) => (
                                        <div
                                            key={k}
                                            className={[
                                                'flex justify-between px-4 py-2.5',
                                                idx < section.items.length - 1 ? 'border-b border-[var(--border-default)]' : '',
                                            ].join(' ')}
                                        >
                                            <span className="text-[0.8125rem] text-[var(--text-muted)]">{k}</span>
                                            <span className="text-sm text-[var(--text-primary)] font-semibold">{v || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Navigation ─────────────────────────────────────────── */}
                <div className="flex gap-2.5 justify-end mt-7 pt-5 border-t border-[var(--border-default)]">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="flex items-center gap-1.5 py-[9px] px-[18px] rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft size={15} /> Back
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canNext()}
                            className={[
                                'flex items-center gap-1.5 py-[9px] px-[18px] rounded-lg text-white border-none font-semibold transition-opacity',
                                canNext()
                                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 cursor-pointer hover:opacity-90'
                                    : 'bg-slate-300 cursor-not-allowed',
                            ].join(' ')}
                        >
                            Continue <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={[
                                'flex items-center gap-1.5 py-[9px] px-[22px] rounded-lg text-white border-none font-semibold transition-all',
                                submitting
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-success-500 to-success-600 cursor-pointer hover:opacity-90 shadow-[0_4px_12px_rgba(16,185,129,0.3)]',
                            ].join(' ')}
                        >
                            {submitting
                                ? 'Registering...'
                                : <><CheckCircle size={15} /> Register School</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}