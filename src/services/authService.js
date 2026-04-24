/**
 * AUTH SERVICE
 * Combines API calls + store updates + routing logic.
 * Components and hooks call service methods — never raw API functions directly.
 */

import {
  loginSuperAdminApi,
  loginSchoolApi,
  logoutApi,
} from "../api/auth.api.js";
import { getSchoolDashboardApi } from "../api/school.api.js";
import useAuthStore from "../store/authStore.js";
import { ROUTES } from "../config/routes.config.js";
import { USER_ROLES } from "../utils/constants.js";

// =============================================================================
// Super Admin Login
// =============================================================================

export const loginSuperAdmin = async (credentials, navigate) => {
  const response = await loginSuperAdminApi(credentials);
  const { access_token, user } = response.data.data;

  useAuthStore.getState().setAuth({ access_token, user });
  navigate(ROUTES.SUPER_ADMIN.DASHBOARD, { replace: true });

  return { access_token, user };
};

// =============================================================================
// School User Login
// =============================================================================

export const loginSchoolUser = async (credentials, navigate) => {
  const response = await loginSchoolApi(credentials);
  const { access_token, user } = response.data.data;

  useAuthStore.getState().setAuth({
    access_token,
    user: {
      ...user,
      schoolId: user.school_id,
    },
  });
  navigate(ROUTES.SCHOOL_ADMIN.DASHBOARD, { replace: true });

  return { access_token, user };
};

// =============================================================================
// Logout
// =============================================================================

export const logout = async (navigate, actorType) => {
  try {
    await logoutApi();
  } catch {
    // Always clear local state regardless of API errors
  } finally {
    useAuthStore.getState().clearAuth();

    const loginRoute =
      actorType === "super_admin"
        ? ROUTES.SUPER_ADMIN.LOGIN
        : ROUTES.AUTH.LOGIN;

    navigate(loginRoute, { replace: true });
  }
};

// =============================================================================
// Hydrate User
//
// Called on app mount (App.jsx) to confirm the stored session is still valid.
//
// Strategy:
//   - /auth/me does not exist → use the dashboard endpoint instead
//   - School users: GET /school/:schoolId/dashboard
//     → if it succeeds, session is valid, we leave the store untouched
//     → if it fails (401/403), session is dead, we clear the store
//   - Super admins: no equivalent endpoint yet → trust the stored session
//     (the first protected API call they make will evict them if expired)
//   - Unauthenticated: skip entirely
// =============================================================================

export const hydrateUser = async () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore.getState();

  // Nothing stored — nothing to hydrate
  if (!isAuthenticated || !user) return null;

  try {
    if (user.role === USER_ROLES.SUPER_ADMIN) {
      // No profile endpoint for super admin yet — trust stored state.
      // axiosClient will handle expiry on the first real request.
      return user;
    }

    // School user — verify session by hitting the dashboard endpoint.
    // school_id comes from the persisted user object in localStorage.
    if (user.school_id) {
      await getSchoolDashboardApi(user.school_id);
      // If the above didn't throw, session is valid — store is already correct
      return user;
    }

    return user;
  } catch (err) {
    const status = err?.response?.status;

    // 401 = token expired/invalid, 403 = session revoked
    // Both mean the stored session is dead — clear it so the user hits login
    if (status === 401 || status === 403) {
      clearAuth();
      return null;
    }

    // 500 / network error — backend is down, don't punish the user by
    // clearing their session. Let them through; the dashboard will show
    // its own error state when it tries to load.
    return user;
  }
};

// =============================================================================
// Role-based redirect helper
// =============================================================================

export const getDefaultRouteForRole = (role) => {
  if (role === USER_ROLES.SUPER_ADMIN) return ROUTES.SUPER_ADMIN.DASHBOARD;
  return ROUTES.SCHOOL_ADMIN.DASHBOARD;
};
