import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, User, CreditCard, CheckCircle,
    ArrowLeft, ArrowRight, Eye, EyeOff,
} from 'lucide-react';
import { useSchools } from '#hooks/super-admin/useSchools.js';

const STEPS = [
    { id: 1, label: 'School Info', icon: Building2 },
    { id: 2, label: 'Admin Account', icon: User },
    { id: 3, label: 'Subscription', icon: CreditCard },
    { id: 4, label: 'Review', icon: CheckCircle },
];

const PLANS = [
    { id: 'BASIC', name: 'Basic', price_per_card: '₹149/year', features: ['Email notifications', 'Basic scan logs', 'Standard support'], color: '#64748B' },
    { id: 'PREMIUM', name: 'Premium', price_per_card: '₹199/year', features: ['SMS + Email alerts', 'Anomaly detection', 'Priority support'], color: '#2563EB', recommended: true },
    { id: 'CUSTOM', name: 'Custom', price_per_card: 'Manual pricing', features: ['Custom per-card price', 'Custom renewal price', 'Dedicated support'], color: '#7C3AED' },
];

const FieldGroup = ({ label, required, error, children }) => (
    <div className="mb-4">
        <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
            {label} {required && <span className="text-danger-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', suffix, ...rest }) => (
    <div className="relative flex items-center">
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] outline-none transition-colors box-border ${suffix ? 'py-[9px] pl-3 pr-9' : 'py-[9px] px-3'
                } focus:border-brand-500`}
            {...rest}
        />
        {suffix && <div className="absolute right-2.5 flex items-center">{suffix}</div>}
    </div>
);

const Select = ({ value, onChange, children }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none focus:border-brand-500 transition-colors"
    >
        {children}
    </select>
);

export default function RegisterSchool() {
    const navigate = useNavigate();
    const { registerSchool, isRegistering } = useSchools();
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [registeredSchool, setRegisteredSchool] = useState(null);
    const [error, setError] = useState('');

    const [schoolInfo, setSchoolInfo] = useState({
        name: '', email: '', phone: '', city: '', state: '', pincode: '', address: '', timezone: 'Asia/Kolkata', school_type: 'PRIVATE',
    });
    const [adminInfo, setAdminInfo] = useState({ name: '', email: '', password: '' });
    const [subscription, setSubscription] = useState({
        plan: 'PREMIUM', student_count: '', custom_unit_price: '', custom_renewal_price: '', is_pilot: false,
    });
    const [agreed, setAgreed] = useState(false);

    const siChange = (f) => (e) => setSchoolInfo(p => ({ ...p, [f]: e.target.value }));
    const aiChange = (f) => (e) => setAdminInfo(p => ({ ...p, [f]: e.target.value }));
    const subChange = (f) => (e) => setSubscription(p => ({ ...p, [f]: e.target.value }));

    const canNext = () => {
        if (step === 1) return schoolInfo.name && schoolInfo.email;
        if (step === 2) return adminInfo.name && adminInfo.email && adminInfo.password.length >= 8;
        if (step === 3) {
            if (!subscription.plan) return false;
            if (subscription.plan === 'CUSTOM' && (!subscription.custom_unit_price || !subscription.custom_renewal_price)) return false;
            if (!subscription.student_count || parseInt(subscription.student_count) < 1) return false;
            if (!agreed) return false;
            return true;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const result = await registerSchool({
                school: schoolInfo,
                admin: adminInfo,
                subscription: {
                    plan: subscription.plan,
                    student_count: parseInt(subscription.student_count),
                    custom_unit_price: subscription.custom_unit_price ? parseInt(subscription.custom_unit_price) : undefined,
                    custom_renewal_price: subscription.custom_renewal_price ? parseInt(subscription.custom_renewal_price) : undefined,
                    is_pilot: subscription.is_pilot,
                },
                agreement: { agreed_via: 'DASHBOARD' },
            });
            setRegisteredSchool(result.data.data);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    if (submitted && registeredSchool) {
        return (
            <div className="max-w-[560px] mx-auto mt-[60px] text-center px-4">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(16,185,129,0.3)]">
                    <CheckCircle size={36} className="text-white" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] m-0 mb-3">School Registered!</h2>
                <p className="text-[var(--text-secondary)] text-[0.9375rem] leading-relaxed mb-6">
                    <strong>{registeredSchool.school?.name || schoolInfo.name}</strong> has been registered successfully.
                </p>
                <div className="bg-slate-50 rounded-lg border border-[var(--border-default)] p-4 mb-6 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">School Code:</span>
                        <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">{registeredSchool.school?.code || 'Generated'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">Serial Number:</span>
                        <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">{registeredSchool.school?.serial_number || '—'}</span>
                    </div>
                </div>
                <p className="text-[var(--text-secondary)] text-[0.875rem] mb-8">
                    Admin credentials sent to <strong>{adminInfo.email}</strong>
                </p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate('/super/schools')} className="py-[9px] px-5 rounded-lg border border-[var(--border-default)] bg-white font-medium cursor-pointer text-[var(--text-secondary)] hover:bg-slate-50 transition-colors">
                        View All Schools
                    </button>
                    <button onClick={() => { setSubmitted(false); setStep(1); setSchoolInfo({ name: '', email: '', phone: '', city: '', state: '', pincode: '', address: '', timezone: 'Asia/Kolkata', school_type: 'PRIVATE' }); setAdminInfo({ name: '', email: '', password: '' }); setSubscription({ plan: 'PREMIUM', student_count: '', custom_unit_price: '', custom_renewal_price: '', is_pilot: false }); setAgreed(false); }} className="py-[9px] px-5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                        Register Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[680px] mx-auto py-8 px-4">
            <div className="mb-7">
                <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] m-0 mb-1">Register School</h2>
                <p className="text-[var(--text-muted)] text-[0.9375rem] m-0">Create a new school account on the platform</p>
            </div>

            <div className="flex items-center mb-8">
                {STEPS.map((s, idx) => {
                    const StepIcon = s.icon;
                    const done = step > s.id;
                    const active = step === s.id;
                    return (
                        <div key={s.id} className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${done ? 'bg-success-500' : ''} ${active ? 'bg-brand-600' : ''} ${!done && !active ? 'bg-slate-100' : ''}`}>
                                    {done ? <CheckCircle size={16} className="text-white" /> : <StepIcon size={16} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />}
                                </div>
                                <span className={`text-[0.6875rem] font-semibold whitespace-nowrap ${step >= s.id ? 'text-success-500' : 'text-[var(--text-muted)]'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-[22px] transition-colors ${done ? 'bg-success-500' : 'bg-slate-200'}`} />}
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl border border-[var(--border-default)] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {error && <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">{error}</div>}

                {step === 1 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-6">School Information</h3>
                        <div className="grid grid-cols-2 gap-x-5">
                            <FieldGroup label="School Name" required><Input value={schoolInfo.name} onChange={siChange('name')} placeholder="e.g. Delhi Public School" /></FieldGroup>
                            <FieldGroup label="School Type" required><Select value={schoolInfo.school_type} onChange={siChange('school_type')}><option value="PRIVATE">Private</option><option value="GOVERNMENT">Government</option><option value="INTERNATIONAL">International</option><option value="NGO">NGO</option></Select></FieldGroup>
                            <FieldGroup label="Email Address" required><Input type="email" value={schoolInfo.email} onChange={siChange('email')} placeholder="info@school.edu.in" /></FieldGroup>
                            <FieldGroup label="Phone Number"><Input type="tel" value={schoolInfo.phone} onChange={siChange('phone')} placeholder="+91 98765 43210" /></FieldGroup>
                            <FieldGroup label="City"><Input value={schoolInfo.city} onChange={siChange('city')} placeholder="e.g. New Delhi" /></FieldGroup>
                            <FieldGroup label="State"><Input value={schoolInfo.state} onChange={siChange('state')} placeholder="e.g. Delhi" /></FieldGroup>
                            <FieldGroup label="Pincode"><Input value={schoolInfo.pincode} onChange={siChange('pincode')} placeholder="110001" /></FieldGroup>
                            <FieldGroup label="Timezone"><Select value={schoolInfo.timezone} onChange={siChange('timezone')}><option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option><option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option><option value="UTC">UTC</option></Select></FieldGroup>
                        </div>
                        <FieldGroup label="Address"><textarea value={schoolInfo.address} onChange={siChange('address')} placeholder="Full school address..." rows={3} className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] outline-none resize-y box-border focus:border-brand-500 transition-colors" /></FieldGroup>
                        <div className="mt-4 px-4 py-3 bg-slate-50 rounded-lg border border-[var(--border-default)] text-[0.75rem] text-[var(--text-muted)]">ℹ️ School code and serial number will be auto-generated after registration.</div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-2">School Admin Account</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6">This account will be used by the school administrator to log into the portal.</p>
                        <div className="grid grid-cols-2 gap-x-5">
                            <FieldGroup label="Full Name" required><Input value={adminInfo.name} onChange={aiChange('name')} placeholder="e.g. Rajesh Kumar" /></FieldGroup>
                            <FieldGroup label="Email Address" required><Input type="email" value={adminInfo.email} onChange={aiChange('email')} placeholder="admin@school.edu.in" /></FieldGroup>
                            <FieldGroup label="Temporary Password" required error={adminInfo.password && adminInfo.password.length < 8 ? 'Password must be at least 8 characters' : ''}>
                                <Input type={showPass ? 'text' : 'password'} value={adminInfo.password} onChange={aiChange('password')} placeholder="Min. 8 characters" suffix={<button onClick={() => setShowPass(!showPass)} className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] p-0 hover:text-[var(--text-secondary)] transition-colors">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
                            </FieldGroup>
                        </div>
                        <div className="px-4 py-3 bg-brand-50 rounded-lg border border-brand-200 text-[0.8125rem] text-brand-700">💡 The admin will receive a login email with instructions to set their permanent password.</div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-2">Subscription Plan</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6">Select a plan. Price is per card per year.</p>

                        <div className="flex flex-col gap-3 mb-6">
                            {PLANS.map(p => (
                                <div key={p.id} onClick={() => setSubscription(s => ({ ...s, plan: p.id }))} className="px-5 py-[18px] rounded-[10px] cursor-pointer relative transition-all" style={{ border: `2px solid ${subscription.plan === p.id ? p.color : 'var(--border-default)'}`, background: subscription.plan === p.id ? `${p.color}08` : 'white' }}>
                                    {p.recommended && <span className="absolute -top-[10px] right-4 text-white text-[0.6875rem] font-bold px-2.5 py-0.5 rounded-full tracking-[0.05em]" style={{ background: p.color }}>RECOMMENDED</span>}
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: p.color, background: subscription.plan === p.id ? p.color : 'white' }}>{subscription.plan === p.id && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                                            <span className="font-display font-bold text-base text-[var(--text-primary)]">{p.name}</span>
                                        </div>
                                        <span className="font-display font-bold text-base" style={{ color: p.color }}>{p.price_per_card}</span>
                                    </div>
                                    <div className="flex gap-4 flex-wrap pl-[30px]">{p.features.map(f => <span key={f} className="text-[0.8125rem] text-[var(--text-secondary)] flex items-center gap-1.5"><CheckCircle size={12} style={{ color: p.color }} /> {f}</span>)}</div>
                                </div>
                            ))}
                        </div>

                        <FieldGroup label="Estimated Student Count" required><Input type="number" value={subscription.student_count} onChange={subChange('student_count')} placeholder="e.g. 500" /></FieldGroup>

                        {subscription.plan === 'CUSTOM' && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <FieldGroup label="Per Card Price (₹)" required><Input type="number" value={subscription.custom_unit_price} onChange={subChange('custom_unit_price')} placeholder="e.g. 175" /></FieldGroup>
                                <FieldGroup label="Renewal Price (₹)" required><Input type="number" value={subscription.custom_renewal_price} onChange={subChange('custom_renewal_price')} placeholder="e.g. 165" /></FieldGroup>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-6">
                            <input type="checkbox" id="pilot" checked={subscription.is_pilot} onChange={(e) => setSubscription(s => ({ ...s, is_pilot: e.target.checked }))} className="w-4 h-4" />
                            <label htmlFor="pilot" className="text-[0.8125rem] text-[var(--text-secondary)]">Mark as pilot school (free trial)</label>
                        </div>

                        <div className="flex items-start gap-3 pt-4 border-t border-[var(--border-default)]">
                            <input type="checkbox" id="agreement" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5" />
                            <label htmlFor="agreement" className="text-[0.8125rem] text-[var(--text-secondary)]">I confirm that I have legal agreement with this school and approve the subscription terms.</label>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-6">Review & Confirm</h3>
                        {[
                            { title: 'School Information', items: [['Name', schoolInfo.name], ['Type', schoolInfo.school_type], ['Email', schoolInfo.email], ['City', schoolInfo.city || '—'], ['State', schoolInfo.state || '—']] },
                            { title: 'Admin Account', items: [['Name', adminInfo.name], ['Email', adminInfo.email]] },
                            { title: 'Subscription', items: [['Plan', PLANS.find(p => p.id === subscription.plan)?.name], ['Student Count', subscription.student_count], ...(subscription.plan === 'CUSTOM' ? [['Per Card Price', `₹${subscription.custom_unit_price}/year`], ['Renewal Price', `₹${subscription.custom_renewal_price}/year`]] : []), ['Pilot', subscription.is_pilot ? 'Yes' : 'No']] },
                        ].map(section => (
                            <div key={section.title} className="mb-5">
                                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em] mb-2">{section.title}</div>
                                <div className="bg-slate-50 rounded-lg border border-[var(--border-default)] overflow-hidden">
                                    {section.items.map(([k, v], idx) => (
                                        <div key={k} className={`flex justify-between px-4 py-2.5 ${idx < section.items.length - 1 ? 'border-b border-[var(--border-default)]' : ''}`}>
                                            <span className="text-[0.8125rem] text-[var(--text-muted)]">{k}</span>
                                            <span className="text-sm text-[var(--text-primary)] font-semibold">{v || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2.5 justify-end mt-7 pt-5 border-t border-[var(--border-default)]">
                    {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 py-[9px] px-[18px] rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-medium cursor-pointer hover:bg-slate-50 transition-colors"><ArrowLeft size={15} /> Back</button>}
                    {step < 4 ? (
                        <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className={`flex items-center gap-1.5 py-[9px] px-[18px] rounded-lg text-white border-none font-semibold transition-opacity ${canNext() ? 'bg-gradient-to-br from-brand-500 to-brand-600 cursor-pointer hover:opacity-90' : 'bg-slate-300 cursor-not-allowed'}`}>Continue <ArrowRight size={15} /></button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isRegistering} className={`flex items-center gap-1.5 py-[9px] px-[22px] rounded-lg text-white border-none font-semibold transition-all ${isRegistering ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-br from-success-500 to-success-600 cursor-pointer hover:opacity-90 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'}`}>{isRegistering ? 'Registering...' : <><CheckCircle size={15} /> Register School</>}</button>
                    )}
                </div>
            </div>
        </div>
    );
}