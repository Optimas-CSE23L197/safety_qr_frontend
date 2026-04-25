// src/components/shared/PremiumGate.jsx
import { Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

/**
 * PremiumGate
 * Wraps any section and either:
 *   • renders children as-is (premium)
 *   • renders a blurred preview + lock overlay (basic)
 *
 * Props:
 *   isPremium   boolean
 *   feature     string – friendly feature name shown in the CTA
 *   children    ReactNode – the premium content to gate
 *   minHeight   string – min height of locked container (default '200px')
 *   blurPreview boolean – if true, renders blurred children behind lock (default false)
 */
const PremiumGate = ({
    isPremium,
    feature = 'This feature',
    children,
    minHeight = '200px',
    blurPreview = false,
}) => {
    const navigate = useNavigate();

    if (isPremium) return <>{children}</>;

    return (
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
            {/* Blurred ghost of the real content */}
            {blurPreview && (
                <div style={{
                    filter: 'blur(4px)',
                    opacity: 0.25,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}>
                    {children}
                </div>
            )}

            {/* Lock overlay */}
            <div style={{
                position: blurPreview ? 'absolute' : 'relative',
                inset: 0,
                minHeight: blurPreview ? undefined : minHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                background: blurPreview
                    ? 'rgba(255,255,255,0.88)'
                    : 'linear-gradient(135deg, var(--color-slate-50) 0%, #FEF9EC 100%)',
                border: blurPreview ? 'none' : '1px dashed var(--color-warning-300)',
                borderRadius: '10px',
                padding: '32px 24px',
                textAlign: 'center',
            }}>
                {/* Lock icon with gold ring */}
                <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                }}>
                    <Lock size={22} color="white" />
                </div>

                <div>
                    <p style={{
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                    }}>
                        {feature}
                    </p>
                    <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        maxWidth: '260px',
                    }}>
                        Available on the Premium plan. Upgrade to unlock advanced analytics,
                        richer reports, and more.
                    </p>
                </div>

                <button
                    onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(217,119,6,0.35)',
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(217,119,6,0.45)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(217,119,6,0.35)';
                    }}
                >
                    <Sparkles size={14} />
                    Upgrade to Premium
                </button>
            </div>
        </div>
    );
};

export default PremiumGate;