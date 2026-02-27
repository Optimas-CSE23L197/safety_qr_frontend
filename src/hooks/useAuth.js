/**
 * useAuth Hook
 * Convenience hook to access auth state and trigger actions.
 *
 * Usage:
 *   const { user, role, schoolId, isAuthenticated, isSuperAdmin } = useAuth();
 */

import useAuthStore from "../store/authStore.js";
import { hasPermission, hasAnyPermission } from "../utils/rbac.js";
import { USER_ROLES } from "../utils/constants.js";

const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    role: store.user?.role ?? null,
    schoolId: store.user?.school_id ?? null,
    name: store.user?.name ?? "",
    email: store.user?.email ?? "",

    // Role helpers
    isSuperAdmin: store.user?.role === USER_ROLES.SUPER_ADMIN,
    isSchoolAdmin: store.user?.role === USER_ROLES.SCHOOL_ADMIN,
    isSchoolStaff: store.user?.role === USER_ROLES.SCHOOL_STAFF,
    isViewer: store.user?.role === USER_ROLES.SCHOOL_VIEWER,

    // Permission check
    can: (permission) => hasPermission(store.user?.role, permission),
    canAny: (permissions) => hasAnyPermission(store.user?.role, permissions),

    // Store actions
    setAuth: store.setAuth,
    updateUser: store.updateUser,
    clearAuth: store.clearAuth,
  };
};

export default useAuth;
