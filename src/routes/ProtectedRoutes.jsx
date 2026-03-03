/**
 * PROTECTED ROUTE
 * Redirects to appropriate login if user is not authenticated.
 * Super Admin routes → /super-admin
 * School Admin routes → /login
 */

import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import { ROUTES } from "../config/routes.config.js";

// ── Dev bypass ────────────────────────────────────────────────────────────────
const DEV_BYPASS =
    import.meta.env.VITE_DEV_BYPASS_AUTH === "true" && import.meta.env.DEV;

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Skip auth check entirely in dev bypass mode
    if (DEV_BYPASS) return children;

    // Decide which login page based on which section they're trying to access
    const isSuperAdminRoute = location.pathname.startsWith(ROUTES.SUPER_ADMIN.ROOT);
    const loginRoute = isSuperAdminRoute
        ? ROUTES.SUPER_ADMIN.LOGIN
        : ROUTES.AUTH.LOGIN;

    if (!isAuthenticated) {
        return (
            <Navigate
                to={loginRoute}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;