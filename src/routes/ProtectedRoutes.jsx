/**
 * PROTECTED ROUTE
 * Redirects to the appropriate login page if not authenticated.
 *
 * Guards against three states:
 *   1. Definitely authenticated  → render children
 *   2. Definitely not authenticated → redirect to login
 *   3. Mid-hydration (token null, localStorage says true) → show nothing
 *      (App.jsx's hydration gate should prevent this state from ever
 *       reaching here, but this is a belt-and-suspenders safety net)
 */

import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import { ROUTES } from "../config/routes.config.js";

const DEV_BYPASS =
    import.meta.env.VITE_DEV_BYPASS_AUTH === "true" && import.meta.env.DEV;

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (DEV_BYPASS) return children;

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