/**
 * ROLE BASED ROUTE
 * Renders children only if user has the required role or permission.
 * Shows 403 fallback or redirects if access is denied.
 *
 * Usage:
 *   <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
 *     <SuperAdminPage />
 *   </RoleBasedRoute>
 *
 *   <RoleBasedRoute requiredPermission="tokens.revoke">
 *     <RevokeButton />
 *   </RoleBasedRoute>
 */

import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { hasPermission } from '../utils/rbac.js';
import { ROUTES } from '../config/routes.config.js';

const RoleBasedRoute = ({
    children,
    allowedRoles = [],
    requiredPermission = null,
    fallback = null, // Custom fallback component
}) => {
    const user = useAuthStore((state) => state.user);
    const role = user?.role;

    let hasAccess = false;

    if (allowedRoles.length > 0) {
        hasAccess = allowedRoles.includes(role);
    } else if (requiredPermission) {
        hasAccess = hasPermission(role, requiredPermission);
    } else {
        hasAccess = true; // No restriction defined
    }

    if (!hasAccess) {
        if (fallback) return fallback;
        // Redirect to their appropriate dashboard root
        const redirectTo =
            role === 'SUPER_ADMIN'
                ? ROUTES.SUPER_ADMIN.DASHBOARD
                : ROUTES.SCHOOL_ADMIN.DASHBOARD;
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default RoleBasedRoute;