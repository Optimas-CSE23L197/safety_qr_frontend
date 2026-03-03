/**
 * AUTH SERVICE
 * Combines API calls + store updates + routing logic.
 * Components and hooks call service methods — never raw API functions directly.
 *
 * Separation of concerns:
 *   auth.api.js     → raw HTTP
 *   authService.js  → orchestration (API + store + navigate)
 *   authStore.js    → state
 */

import {
  loginSuperAdminApi,
  loginSchoolApi,
  logoutApi,
  getMeApi,
} from "../api/auth.api.js";
import useAuthStore from "../store/authStore.js";
import { ROUTES } from "../config/routes.config.js";
import { USER_ROLES } from "../utils/constants.js";

// =============================================================================
// Super Admin Login
// =============================================================================

/**
 * Authenticates a super admin and navigates to the super admin dashboard.
 * @param {{ email: string, password: string }} credentials
 * @param {Function} navigate - react-router navigate function
 */
export const loginSuperAdmin = async (credentials, navigate) => {
  const response = await loginSuperAdminApi(credentials);
  // Backend shape: { success: true, data: { access_token, user } }
  const { access_token, user } = response.data.data;

  useAuthStore.getState().setAuth({ access_token, user });
  navigate(ROUTES.SUPER_ADMIN.DASHBOARD, { replace: true });

  return { access_token, user };
};

// =============================================================================
// School User Login
// =============================================================================

/**
 * Authenticates a school user (ADMIN | STAFF | VIEWER) and navigates
 * to the school admin dashboard.
 * @param {{ email: string, password: string }} credentials
 * @param {Function} navigate
 */
export const loginSchoolUser = async (credentials, navigate) => {
  const response = await loginSchoolApi(credentials);
  const { access_token, user } = response.data.data;

  useAuthStore.getState().setAuth({ access_token, user });
  navigate(ROUTES.SCHOOL_ADMIN.DASHBOARD, { replace: true });

  return { access_token, user };
};

// =============================================================================
// Logout — shared by all actors
// =============================================================================

/**
 * Calls backend logout (blacklists token + clears cookie),
 * clears local state, redirects to the appropriate login page.
 * @param {Function} navigate
 * @param {'super_admin' | 'school' | 'parent'} [actorType]
 */
export const logout = async (navigate, actorType) => {
  try {
    await logoutApi();
  } catch {
    // Ignore API errors — always clear local state regardless
  } finally {
    useAuthStore.getState().clearAuth();

    // Redirect to the correct login page for this actor
    const loginRoute =
      actorType === "super_admin"
        ? ROUTES.SUPER_ADMIN.LOGIN
        : ROUTES.AUTH.LOGIN;

    navigate(loginRoute, { replace: true });
  }
};

// =============================================================================
// Hydrate User — call on app mount to restore session
// =============================================================================

/**
 * Fetches fresh user data from /auth/me on app load.
 * If the access token is gone (page refresh), axiosClient will
 * automatically call /auth/refresh first using the httpOnly cookie.
 *
 * Call this in App.jsx on mount.
 */
export const hydrateUser = async () => {
  const { isAuthenticated, updateUser, clearAuth } = useAuthStore.getState();
  if (!isAuthenticated) return null;

  try {
    const response = await getMeApi();
    const user = response.data.data?.user || response.data.data;
    updateUser(user);
    return user;
  } catch {
    // /auth/refresh failed inside axiosClient — session truly expired
    clearAuth();
    return null;
  }
};

// =============================================================================
// Role-based redirect helper
// =============================================================================

/**
 * Returns the default dashboard route for a given role.
 * @param {string} role
 */
export const getDefaultRouteForRole = (role) => {
  if (role === USER_ROLES.SUPER_ADMIN) return ROUTES.SUPER_ADMIN.DASHBOARD;
  return ROUTES.SCHOOL_ADMIN.DASHBOARD;
};
