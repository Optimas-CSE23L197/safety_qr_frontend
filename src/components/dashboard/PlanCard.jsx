// src/components/dashboard/PlanCard.jsx
/**
 * PlanCard — shows current plan, feature usage, and locked state.
 *
 * Modified:
 *  - Removed "Upgrade to Premium" button
 *  - Replaced with lock icon + "Premium features locked" indicator
 */

import { Lock, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

const PlanCard = ({
    plan,
    isPremium,
    subscriptionEnd,
    featureUsage,
    hideUpgradeButton = false, // kept for backward compat but no longer renders a button
}) => {
    const navigate = useNavigate();

    // Feature usage defaults
    const active = featureUsage?.active ?? 2;
    const total  = featureUsage?.total  ?? 10;
    const locked = total - active;
    const progressPct = Math.min((active / total) * 100, 100);

    return (
        <div className="card" style={{ padding: '24px' }}>

            {/* ── Header ───────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="var(--color-warning-500)" />
                    <span style={{
                        fontSize: '0.6875rem', fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                    }}>
                        Your Plan
                    </span>
                </div>

                {/* Plan badge */}
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '9999px',
                    fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    background: isPremium
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : 'var(--color-slate-200)',
                    color: isPremium ? 'white' : 'var(--color-slate-500)',
                }}>
                    {isPremium && <Sparkles size={9} />}
                    {isPremium ? 'Premium' : 'Basic'}
                </span>
            </div>

            {/* ── Plan name ────────────────────────────────────────── */}
            <p style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                fontWeight: 700, color: 'var(--text-primary)',
                margin: '0 0 4px',
            }}>
                {isPremium ? 'Premium Plan' : 'Basic Plan'}
            </p>

            {/* ── Subtitle ─────────────────────────────────────────── */}
            <p style={{
                fontSize: '0.8125rem', color: 'var(--text-muted)',
                margin: '0 0 16px', lineHeight: 1.5,
            }}>
                {isPremium
                    ? subscriptionEnd
                        ? `Renews ${new Date(subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : 'All features unlocked.'
                    : `You're using ${active} of ${total} features. Unlock everything with Premium.`
                }
            </p>

            {/* ── Progress bar ─────────────────────────────────────── */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{
                    height: '6px', borderRadius: '9999px',
                    background: 'var(--color-slate-200)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progressPct}%`,
                        borderRadius: '9999px',
                        background: isPremium
                            ? 'linear-gradient(90deg, #10B981, #059669)'
                            : 'linear-gradient(90deg, #F59E0B, #D97706)',
                        transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>

            {/* ── Usage labels ─────────────────────────────────────── */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.75rem', color: 'var(--text-muted)',
                marginBottom: '20px',
            }}>
                <span>{active} active</span>
                {!isPremium && <span>{locked} locked</span>}
                {isPremium  && <span>{total} unlocked</span>}
            </div>

            {/* ── CTA ──────────────────────────────────────────────── */}
            {isPremium ? (
                // Premium: show a green "Active" pill
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', padding: '10px 16px', borderRadius: '8px',
                    background: 'var(--color-success-50)',
                    border: '1px solid var(--color-success-200)',
                }}>
                    <Sparkles size={14} color="var(--color-success-600)" />
                    <span style={{
                        fontSize: '0.8125rem', fontWeight: 600,
                        color: 'var(--color-success-700)',
                    }}>
                        Premium Active
                    </span>
                </div>
            ) : (
                // ✅ MODIFIED: "Upgrade to Premium" button REMOVED
                // Replaced with lock icon + "Premium features locked" label
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: '8px',
                    background: 'var(--color-slate-100)',
                    border: '1px solid var(--color-slate-200)',
                }}>
                    {/* Lock icon in a small circle */}
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'var(--color-slate-200)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                    }}>
                        <Lock size={13} color="var(--color-slate-500)" />
                    </div>
                    <div>
                        <p style={{
                            fontSize: '0.8125rem', fontWeight: 600,
                            color: 'var(--color-slate-600)', margin: '0 0 1px',
                        }}>
                            Premium features locked
                        </p>
                        <p style={{
                            fontSize: '0.75rem', color: 'var(--color-slate-400)',
                            margin: 0,
                        }}>
                            {locked} feature{locked !== 1 ? 's' : ''} unavailable
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanCard;