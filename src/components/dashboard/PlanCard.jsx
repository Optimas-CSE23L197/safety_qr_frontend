// src/components/dashboard/PlanCard.jsx
import { Sparkles, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

/**
 * PlanCard
 * Shows current plan, feature usage, and an upgrade/renewal CTA.
 *
 * Props:
 *   plan           'basic' | 'premium'
 *   isPremium      boolean
 *   subscriptionEnd ISO string | null
 *   featureUsage   { used: number, total: number }
 */
const PlanCard = ({ plan, isPremium, subscriptionEnd, featureUsage = { used: 2, total: 10 } }) => {
    const navigate = useNavigate();
    const pct = Math.min(100, Math.round((featureUsage.used / featureUsage.total) * 100));

    const endLabel = subscriptionEnd
        ? new Date(subscriptionEnd).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : null;

    return (
        <div style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: isPremium
                ? 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4338CA 100%)'
                : 'var(--color-slate-50)',
            border: isPremium
                ? 'none'
                : '1px solid var(--border-default)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative orb for premium */}
            {isPremium && (
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'rgba(167,139,250,0.15)',
                    pointerEvents: 'none',
                }} />
            )}

            {/* Top row: plan label + badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} color={isPremium ? '#A78BFA' : 'var(--color-slate-500)'} />
                    <span style={{
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isPremium ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)',
                    }}>
                        Your Plan
                    </span>
                </div>

                {/* Plan badge */}
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '9999px',
                    fontSize: '0.75rem', fontWeight: 700,
                    background: isPremium
                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                        : 'var(--color-slate-200)',
                    color: isPremium ? 'white' : 'var(--color-slate-600)',
                }}>
                    {isPremium && <Sparkles size={10} />}
                    {isPremium ? 'Premium' : 'Basic'}
                </span>
            </div>

            {isPremium ? (
                /* ── Premium state ───────────────────────────────────── */
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <CheckCircle size={16} color="#34D399" />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'white' }}>
                            Premium active
                        </span>
                    </div>
                    {endLabel && (
                        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginBottom: '14px' }}>
                            Renews on {endLabel}
                        </p>
                    )}

                    {/* Feature usage bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                                Features used
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                                {featureUsage.used}/{featureUsage.total}
                            </span>
                        </div>
                        <div style={{
                            height: '5px', borderRadius: '9999px',
                            background: 'rgba(255,255,255,0.12)',
                        }}>
                            <div style={{
                                height: '100%', borderRadius: '9999px',
                                width: `${pct}%`,
                                background: 'linear-gradient(90deg, #34D399 0%, #10B981 100%)',
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Basic state ─────────────────────────────────────── */
                <div>
                    <p style={{
                        fontSize: '0.9375rem', fontWeight: 600,
                        color: 'var(--text-primary)', marginBottom: '4px',
                    }}>
                        Basic Plan
                    </p>
                    <p style={{
                        fontSize: '0.8125rem', color: 'var(--text-muted)',
                        marginBottom: '14px', lineHeight: 1.5,
                    }}>
                        You're using {featureUsage.used} of {featureUsage.total} features.
                        Unlock everything with Premium.
                    </p>

                    {/* Feature usage bar */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            height: '5px', borderRadius: '9999px',
                            background: 'var(--color-slate-200)',
                        }}>
                            <div style={{
                                height: '100%', borderRadius: '9999px',
                                width: `${pct}%`,
                                background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', marginTop: '5px',
                        }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {featureUsage.used} active
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {featureUsage.total - featureUsage.used} locked
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: 'white', fontWeight: 600, fontSize: '0.8125rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
                            transition: 'transform 0.1s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Sparkles size={13} />
                        Upgrade to Premium
                        <ArrowRight size={13} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlanCard;