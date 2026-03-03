/**
 * LOGIN PAGE — Professional, clean login form
 */

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import useAdminLogin from '../../../hooks/useAdminLogin.js';

const Login = () => {
    const { form, isLoading, onSubmit, errors } = useAdminLogin();
    const [showPassword, setShowPassword] = useState(false);
    const { register } = form;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.625rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '6px',
                }}>
                    Sign in to your account
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Enter your credentials to access the dashboard
                </p>
            </div>

            {/* Root error */}
            {errors.root && (
                <div style={{
                    background: 'var(--color-danger-50)',
                    border: '1px solid var(--color-danger-500)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '20px',
                    fontSize: '0.875rem',
                    color: 'var(--color-danger-700)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <span>⚠</span> {errors.root.message}
                </div>
            )}

            <form onSubmit={onSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Email address</label>
                    <div style={{ position: 'relative' }}>
                        <div style={inputIconStyle}>
                            <Mail size={16} color="var(--text-muted)" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="admin@school.com"
                            autoComplete="email"
                            style={{
                                ...inputStyle,
                                paddingLeft: '40px',
                                borderColor: errors.email ? 'var(--color-danger-500)' : 'var(--border-default)',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-brand-500)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.email ? 'var(--color-danger-500)' : 'var(--border-default)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <div style={inputIconStyle}>
                            <Lock size={16} color="var(--text-muted)" />
                        </div>
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            style={{
                                ...inputStyle,
                                paddingLeft: '40px',
                                paddingRight: '44px',
                                borderColor: errors.password ? 'var(--color-danger-500)' : 'var(--border-default)',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-brand-500)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.password ? 'var(--color-danger-500)' : 'var(--border-default)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '11px 24px',
                        borderRadius: '8px',
                        background: isLoading
                            ? 'var(--color-brand-300)'
                            : 'linear-gradient(135deg, #2563EB, #1E40AF)',
                        color: 'white',
                        border: 'none',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: isLoading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)';
                    }}
                >
                    {isLoading ? (
                        <>
                            <span style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255,255,255,0.4)',
                                borderTopColor: 'white',
                                borderRadius: '50%',
                                display: 'inline-block',
                                animation: 'spin 0.7s linear infinite',
                            }} />
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>

            <p style={{
                marginTop: '24px',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
            }}>
                Trouble signing in? Contact your system administrator.
            </p>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: 'var(--text-primary)',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    background: 'var(--bg-card)',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    fontFamily: 'var(--font-body)',
};

const inputIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
};

const errorStyle = {
    marginTop: '5px',
    fontSize: '0.8125rem',
    color: 'var(--color-danger-600)',
};

export default Login;