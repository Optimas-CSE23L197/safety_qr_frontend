/**
 * PROTECTED ROUTE
 * Redirects to /login if user is not authenticated.
 * Wrap any route that requires auth.
 *
 * DEV BYPASS: Set VITE_DEV_BYPASS_AUTH=true in .env to skip login.
 */

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { ROUTES } from '../config/routes.config.js';

// ── Dev bypass ────────────────────────────────────────────────────────────────
// Set VITE_DEV_BYPASS_AUTH=true in your .env file to skip login entirely.
// This is automatically disabled in production builds.
const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'
    && import.meta.env.DEV; // Only works in `vite dev`, never in `vite build`

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    // Skip auth check entirely in dev bypass mode
    if (DEV_BYPASS) return children;

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.AUTH.LOGIN}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;