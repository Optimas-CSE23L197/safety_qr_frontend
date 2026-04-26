// src/components/shared/PremiumRoute.jsx
/**
 * PremiumRoute — route-level hard gate for premium-only pages.
 *
 * Behaviour:
 *   - Premium plan  → renders children as-is.
 *   - Any other plan → silently redirects to /school/dashboard.
 *
 * Intentionally has ZERO upgrade UI, messaging, or upsell text.
 * This is a hard lock — the feature must be invisible to non-premium users.
 *
 * Usage (in AllRoutes.jsx):
 *   <Route
 *     path="tokens/inventory"
 *     element={
 *       <PremiumRoute>
 *         <TokenInventory />
 *       </PremiumRoute>
 *     }
 *   />
 */

import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';

const PremiumRoute = ({ children, fallback }) => {
  const isPremium = usePremiumStatus();

  if (!isPremium) {
    return (
      <Navigate
        to={fallback ?? ROUTES.SCHOOL_ADMIN.DASHBOARD}
        replace
      />
    );
  }

  return children;
};

export default PremiumRoute;