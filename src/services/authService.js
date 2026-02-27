/**
 * AUTH SERVICE
 * Combines API calls + store updates + routing logic.
 * Components call service methods, not raw API functions.
 */

import { loginApi, logoutApi, getMeApi } from "../api/auth.api.js";
import useAuthStore from "../store/authStore.js";
import { ROUTES } from "../config/routes.config.js";
import { USER_ROLES } from "../utils/constants.js";
import { toast } from "../utils/toast.js";

/**
 * Login and redirect to role-appropriate dashboard
 * @param {{ email: string, password: string }} credentials
 * @param {Function} navigate - react-router navigate function
 */
export const login = async (credentials, navigate) => {
  const { data } = await loginApi(credentials);
  const { setAuth } = useAuthStore.getState();

  setAuth({
    user: data.user,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  // Route based on role
  const role = data.user?.role;

  if (role === USER_ROLES.SUPER_ADMIN) {
    navigate(ROUTES.SUPER_ADMIN.DASHBOARD, { replace: true });
  } else if (
    role === USER_ROLES.SCHOOL_ADMIN ||
    role === USER_ROLES.SCHOOL_STAFF ||
    role === USER_ROLES.SCHOOL_VIEWER
  ) {
    navigate(ROUTES.SCHOOL_ADMIN.DASHBOARD, { replace: true });
  } else {
    toast.error("Unknown role. Please contact support.");
    throw new Error(`Unknown role: ${role}`);
  }

  return data;
};

/**
 * Logout and redirect to login
 * @param {Function} navigate
 */
export const logout = async (navigate) => {
  try {
    await logoutApi();
  } catch {
    // Ignore API error — still clear local state
  } finally {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  }
};

/**
 * Hydrate user from /auth/me on app load
 * Call this in App.jsx on mount to restore session
 */
export const hydrateUser = async () => {
  const { isAuthenticated, updateUser } = useAuthStore.getState();
  if (!isAuthenticated) return null;

  try {
    const { data } = await getMeApi();
    updateUser(data.user || data);
    return data;
  } catch {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    return null;
  }
};

/**
 * Get the default route for a given role
 */
export const getDefaultRoute = (role) => {
  if (role === USER_ROLES.SUPER_ADMIN) return ROUTES.SUPER_ADMIN.DASHBOARD;
  return ROUTES.SCHOOL_ADMIN.DASHBOARD;
};
