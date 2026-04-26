/**
 * PlanGate — generic plan-gating wrapper
 * src/components/shared/PlanGate.jsx
 *
 * Usage:
 *   <PlanGate plan={plan} feature="AI Anomaly Detection" upgradeLabel="Catch unusual patterns automatically.">
 *     <AnomalyChart />
 *   </PlanGate>
 *
 * Basic plan  → blurred children + star overlay with upgrade CTA
 * Premium plan → children rendered as-is, no overhead
 */

import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

const PlanGate = ({ plan, feature, upgradeLabel, minHeight = '160px', children }) => {
  const navigate = useNavigate();

  if (plan === 'premium') return <>{children}</>;

  return (
    <div style={{ position: 'relative', minHeight }}>
      {/* Blurred preview of gated content */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.55 }}>
        {children}
      </div>

      {/* Upgrade overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          background: 'rgba(255, 255, 255, 0.88)',
          borderRadius: '10px',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: '#FFF8E7', border: '1.5px solid #F0C060',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Star size={22} color="#C97C10" fill="#C97C10" />
        </div>

        {/* Copy */}
        <div style={{ textAlign: 'center', maxWidth: '240px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '5px' }}>
            {feature}
          </p>
          {upgradeLabel && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {upgradeLabel}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            background: '#C97C10', color: '#fff',
            fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          <Star size={13} fill="currentColor" />
          Upgrade to Premium
        </button>

        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default PlanGate;