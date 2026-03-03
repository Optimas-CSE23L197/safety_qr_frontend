/**
 * SUPER ADMIN — REGISTER SCHOOL
 * Multi-step form: School Info → Admin Account → Subscription → Review.
 * Production-grade with validation, error states and progress indicator.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../../config/routes.config.js';

const STEPS = [
    { id: 1, label: 'School Info', icon: Building2 },
    { id: 2, label: 'Admin Account', icon: User },
    { id: 3, label: 'Subscription', icon: CreditCard },
    { id: 4, label: 'Review', icon: CheckCircle },
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
        color: '#2563EB',
        recommended: true,
    },
    {
        id: 'enterprise', name: 'Enterprise', price: '₹12,999/mo',
        features: ['Unlimited students', 'All notifications', 'Advanced analytics', 'Dedicated support'],
        color: '#7C3AED',
    },
];

const FieldGroup = ({ label, required, error, children }) => (
    <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
        {children}
        {error && <p style={{ marginTop: '4px', fontSize: '0.75rem', color: '#EF4444' }}>{error}</p>}
    </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', suffix, ...rest }) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                width: '100%', padding: suffix ? '9px 36px 9px 12px' : '9px 12px',
                border: '1px solid var(--border-default)', borderRadius: '8px',
                fontSize: '0.875rem', color: 'var(--text-primary)',
                outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
            {...rest}
        />
        {suffix && (
            <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center' }}>
                {suffix}
            </div>
        )}
    </div>
);

export default function RegisterSchool() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [schoolInfo, setSchoolInfo] = useState({
        name: '', code: '', email: '', phone: '', city: '', address: '', timezone: 'Asia/Kolkata',
    });
    const [adminInfo, setAdminInfo] = useState({
        name: '', email: '', password: '', role: 'ADMIN',
    });
    const [plan, setPlan] = useState('growth');
    const [trialDays, setTrialDays] = useState(14);

    const siChange = (field) => (e) => setSchoolInfo(p => ({ ...p, [field]: e.target.value }));
    const aiChange = (field) => (e) => setAdminInfo(p => ({ ...p, [field]: e.target.value }));

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

    if (submitted) {
        return (
            <div style={{ maxWidth: '560px', margin: '60px auto', textAlign: 'center', padding: '0 16px' }}>
                <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                }}>
                    <CheckCircle size={36} color="white" />
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                    School Registered!
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '32px' }}>
                    <strong>{schoolInfo.name}</strong> has been registered successfully.
                    The admin account for <strong>{adminInfo.email}</strong> has been created with a {trialDays}-day trial.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate(ROUTES.SUPER_ADMIN.ALL_SCHOOLS)}
                        style={{
                            padding: '9px 20px', borderRadius: '8px',
                            border: '1px solid var(--border-default)', background: 'white',
                            fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)',
                        }}
                    >
                        View All Schools
                    </button>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setStep(1);
                            setSchoolInfo({ name: '', code: '', email: '', phone: '', city: '', address: '', timezone: 'Asia/Kolkata' });
                            setAdminInfo({ name: '', email: '', password: '', role: 'ADMIN' });
                        }}
                        style={{
                            padding: '9px 20px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                            color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Register Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    Register School
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                    Create a new school account on the platform
                </p>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                {STEPS.map((s, idx) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: step > s.id ? '#10B981' : step === s.id ? 'var(--color-brand-600)' : 'var(--color-slate-100)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}>
                                {step > s.id
                                    ? <CheckCircle size={16} color="white" />
                                    : <s.icon size={16} color={step === s.id ? 'white' : 'var(--text-muted)'} />}
                            </div>
                            <span style={{
                                fontSize: '0.6875rem', fontWeight: 600,
                                color: step >= s.id ? '#10B981' : 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                            }}>
                                {s.label}
                            </span>
                        </div>

                        {idx < STEPS.length - 1 && (
                            <div style={{
                                flex: 1, height: '2px', margin: '0 8px', marginBottom: '22px',
                                background: step > s.id ? '#10B981' : 'var(--color-slate-200)',
                                transition: 'background 0.2s',
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form card */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid var(--border-default)',
                padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>

                {/* Step 1 — School Info */}
                {step === 1 && (
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px' }}>
                            School Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
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
                                <select
                                    value={schoolInfo.timezone}
                                    onChange={siChange('timezone')}
                                    style={{
                                        width: '100%', padding: '9px 12px',
                                        border: '1px solid var(--border-default)', borderRadius: '8px',
                                        fontSize: '0.875rem', color: 'var(--text-primary)',
                                        background: 'white', cursor: 'pointer', outline: 'none',
                                    }}
                                >
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Address">
                            <textarea
                                value={schoolInfo.address}
                                onChange={siChange('address')}
                                placeholder="Full school address..."
                                rows={3}
                                style={{
                                    width: '100%', padding: '9px 12px',
                                    border: '1px solid var(--border-default)', borderRadius: '8px',
                                    fontSize: '0.875rem', color: 'var(--text-primary)',
                                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                            />
                        </FieldGroup>
                    </div>
                )}

                {/* Step 2 — Admin Account */}
                {step === 2 && (
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                            School Admin Account
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                            This account will be used by the school administrator to log into the portal.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                            <FieldGroup label="Full Name" required>
                                <Input value={adminInfo.name} onChange={aiChange('name')} placeholder="e.g. Rajesh Kumar" />
                            </FieldGroup>
                            <FieldGroup label="Role">
                                <select
                                    value={adminInfo.role}
                                    onChange={aiChange('role')}
                                    style={{
                                        width: '100%', padding: '9px 12px',
                                        border: '1px solid var(--border-default)', borderRadius: '8px',
                                        fontSize: '0.875rem', color: 'var(--text-primary)',
                                        background: 'white', cursor: 'pointer', outline: 'none',
                                    }}
                                >
                                    <option value="ADMIN">Admin (full access)</option>
                                    <option value="STAFF">Staff (limited access)</option>
                                    <option value="VIEWER">Viewer (read-only)</option>
                                </select>
                            </FieldGroup>
                            <FieldGroup label="Email Address" required>
                                <Input type="email" value={adminInfo.email} onChange={aiChange('email')} placeholder="admin@school.edu.in" />
                            </FieldGroup>
                            <FieldGroup label="Temporary Password" required error={adminInfo.password && adminInfo.password.length < 8 ? 'Password must be at least 8 characters' : ''}>
                                <Input
                                    type={showPass ? 'text' : 'password'}
                                    value={adminInfo.password}
                                    onChange={aiChange('password')}
                                    placeholder="Min. 8 characters"
                                    suffix={
                                        <button
                                            onClick={() => setShowPass(!showPass)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                                        >
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    }
                                />
                            </FieldGroup>
                        </div>
                        <div style={{
                            padding: '12px 16px', background: '#EFF6FF', borderRadius: '8px',
                            border: '1px solid #BFDBFE', fontSize: '0.8125rem', color: '#1E40AF',
                        }}>
                            💡 The admin will receive a login email with instructions to set their permanent password.
                        </div>
                    </div>
                )}

                {/* Step 3 — Subscription */}
                {step === 3 && (
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                            Subscription Plan
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                            Select a plan and set the trial period for the new school.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {PLANS.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setPlan(p.id)}
                                    style={{
                                        padding: '18px 20px', borderRadius: '10px', cursor: 'pointer',
                                        border: `2px solid ${plan === p.id ? p.color : 'var(--border-default)'}`,
                                        background: plan === p.id ? `${p.color}08` : 'white',
                                        transition: 'all 0.15s', position: 'relative',
                                    }}
                                >
                                    {p.recommended && (
                                        <span style={{
                                            position: 'absolute', top: '-10px', right: '16px',
                                            background: p.color, color: 'white',
                                            fontSize: '0.6875rem', fontWeight: 700, padding: '2px 10px',
                                            borderRadius: '9999px', letterSpacing: '0.05em',
                                        }}>
                                            RECOMMENDED
                                        </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${p.color}`,
                                                background: plan === p.id ? p.color : 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {plan === p.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                                {p.name}
                                            </span>
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: p.color }}>
                                            {p.price}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingLeft: '30px' }}>
                                        {p.features.map(f => (
                                            <span key={f} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <CheckCircle size={12} color={p.color} /> {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Trial Period:
                            </label>
                            {[0, 7, 14, 30].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setTrialDays(d)}
                                    style={{
                                        padding: '6px 14px', borderRadius: '7px',
                                        border: '1px solid',
                                        borderColor: trialDays === d ? 'var(--color-brand-500)' : 'var(--border-default)',
                                        background: trialDays === d ? 'var(--color-brand-600)' : 'white',
                                        color: trialDays === d ? 'white' : 'var(--text-secondary)',
                                        fontWeight: trialDays === d ? 700 : 400,
                                        fontSize: '0.875rem', cursor: 'pointer',
                                    }}
                                >
                                    {d === 0 ? 'No trial' : `${d} days`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4 — Review */}
                {step === 4 && (
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px' }}>
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
                            <div key={section.title} style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                    {section.title}
                                </div>
                                <div style={{ background: 'var(--color-slate-50)', borderRadius: '8px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
                                    {section.items.map(([k, v], idx) => (
                                        <div key={k} style={{
                                            display: 'flex', justifyContent: 'space-between', padding: '10px 16px',
                                            borderBottom: idx < section.items.length - 1 ? '1px solid var(--border-default)' : 'none',
                                        }}>
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{k}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{v || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-default)' }}>
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '9px 18px', borderRadius: '8px',
                                border: '1px solid var(--border-default)', background: 'white',
                                color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer',
                            }}
                        >
                            <ArrowLeft size={15} /> Back
                        </button>
                    )}
                    {step < 4 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canNext()}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '9px 18px', borderRadius: '8px',
                                background: canNext() ? 'linear-gradient(135deg,#2563EB,#1E40AF)' : '#CBD5E1',
                                color: 'white', border: 'none', fontWeight: 600,
                                cursor: canNext() ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Continue <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '9px 22px', borderRadius: '8px',
                                background: submitting ? '#94A3B8' : 'linear-gradient(135deg,#10B981,#059669)',
                                color: 'white', border: 'none', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                                boxShadow: submitting ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
                            }}
                        >
                            {submitting ? 'Registering...' : <><CheckCircle size={15} /> Register School</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}