// src/components/shared/PremiumGate.jsx
/**
 * PremiumGate — full-section lock overlay for Basic users.
 *
 * For single-widget gating (e.g. the Token Status card), inline the
 * isPremium check directly in the parent component — that keeps the
 * card shell always rendered and avoids grid-column collapse.
 *
 * Use PremiumGate when you want to gate an entire row/section and
 * swap it wholesale for a centred lock UI.
 *
 * Usage:
 *   <PremiumGate
 *       isPremium={isPremium}
 *       feature="Advanced Location Tracking"
 *       description="See real-time movement data for every student."
 *       minHeight="260px"
 *   >
 *       <LocationTrackingWidget />
 *   </PremiumGate>
 */

import { Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

const PremiumGate = ({
    isPremium,
    feature = 'This feature',
    description = 'Available on the Premium plan.',
    minHeight = '200px',
    children,
}) => {
    const navigate = useNavigate();

    // Pass-through for premium users — zero extra DOM
    if (isPremium) return children;

    return (
        <div
            className="card"
            style={{
                minHeight,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 24px', textAlign: 'center', gap: '16px',
            }}
        >
            {/* Lock icon */}
            <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--color-slate-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Lock size={24} color="var(--color-slate-400)" />
            </div>

            {/* Copy */}
            <div>
                <p style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700, fontSize: '1rem',
                    color: 'var(--text-primary)', margin: '0 0 6px',
                }}>
                    {feature}
                </p>
                <p style={{
                    fontSize: '0.875rem', color: 'var(--text-muted)',
                    margin: 0, maxWidth: '280px',
                }}>
                    {description}
                </p>
            </div>

            {/* CTA */}
            <button
                onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 20px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: 'white', fontWeight: 600, fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(217,119,6,0.30)',
                    transition: 'transform 0.1s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <Sparkles size={14} /> Upgrade to Premium
            </button>
        </div>
    );
};

export default PremiumGate;