/**
 * AUTH STORE (Zustand)
 * Manages authentication state: user, token, role, school context.
 *
 * Usage:
 *   const { user, role, schoolId, isAuthenticated } = useAuthStore();
 *   const { setAuth, clearAuth } = useAuthStore();
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS, USER_ROLES } from "../utils/constants.js";

// ── Dev seed user ─────────────────────────────────────────────────────────────
// Used when VITE_DEV_BYPASS_AUTH=true. Swap role/school_id in .env as needed.
const DEV_USER =
  import.meta.env.VITE_DEV_BYPASS_AUTH === "true" && import.meta.env.DEV
    ? {
        id: "dev-user-001",
        name: "Dev Admin",
        email: "dev@school.com",
        role: import.meta.env.VITE_DEV_ROLE || "ADMIN",
        school_id: import.meta.env.VITE_DEV_SCHOOL_ID || "dev-school-001",
        school_name: "Dev Test School",
      }
    : null;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: DEV_USER ?? null,
      accessToken: DEV_USER ? "dev-token" : null,
      refreshToken: null,
      isAuthenticated: !!DEV_USER,

      // ── Computed ───────────────────────────────────────────────────────────
      get role() {
        return get().user?.role || null;
      },
      get schoolId() {
        return get().user?.school_id || null;
      },
      get isSuperAdmin() {
        return get().user?.role === USER_ROLES.SUPER_ADMIN;
      },
      get isSchoolAdmin() {
        return get().user?.role === USER_ROLES.SCHOOL_ADMIN;
      },
      get isSchoolStaff() {
        return get().user?.role === USER_ROLES.SCHOOL_STAFF;
      },
      get isViewer() {
        return get().user?.role === USER_ROLES.SCHOOL_VIEWER;
      },

      // ── Actions ────────────────────────────────────────────────────────────

      /**
       * Called after successful login
       * @param {object} payload - { user, access_token, refresh_token }
       */
      setAuth: (payload) => {
        const { user, access_token, refresh_token } = payload;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        if (refresh_token) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        }
        set({
          user,
          accessToken: access_token,
          refreshToken: refresh_token,
          isAuthenticated: true,
        });
      },

      /**
       * Update access token (after refresh)
       */
      updateToken: (accessToken) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        set({ accessToken });
      },

      /**
       * Update user profile data (after edit)
       */
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },

      /**
       * Clear all auth state — called on logout
       */
      clearAuth: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not tokens (tokens live in localStorage directly)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
