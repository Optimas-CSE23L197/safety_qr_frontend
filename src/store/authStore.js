/**
 * AUTH STORE (Zustand)
 * Single source of truth for auth state.
 *
 * Token strategy:
 *   Access token  → memory only (Zustand, lost on page refresh — re-fetched via /auth/refresh)
 *   Refresh token → httpOnly cookie (set by backend, NEVER readable by JS)
 *   User data     → localStorage via Zustand persist (safe — no tokens here)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "../utils/constants.js";

const isDev =
  import.meta.env.VITE_DEV_BYPASS_AUTH === "true" && import.meta.env.DEV;

const useAuthStore = create(
  persist(
    (set) => ({
      // ── State ─────────────────────────────────────────────────────────────
      user: null,
      accessToken: null, // memory only — never persisted
      isAuthenticated: false,
      // refreshToken ← intentionally absent — lives in httpOnly cookie only

      // ── Actions ───────────────────────────────────────────────────────────

      /**
       * Called after successful login.
       * Receives access_token + user from API response body.
       * Refresh token is set automatically by backend via Set-Cookie.
       */
      setAuth: ({ user, access_token }) => {
        set({
          user,
          accessToken: access_token,
          isAuthenticated: true,
        });
      },

      /**
       * Called by axiosClient after silent token refresh.
       * Updates access token in memory only.
       */
      updateToken: (access_token) => {
        set({ accessToken: access_token });
      },

      /**
       * Partial user update — used by hydrateUser after /auth/me
       */
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : updates,
        }));
      },

      /**
       * Called on logout or session expiry.
       * Clears all in-memory state. Cookie is cleared by backend.
       */
      clearAuth: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),

    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => localStorage),

      // Only persist user + isAuthenticated — never tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      // On rehydration: accessToken is always null (page was refreshed)
      // axiosClient interceptor will call /auth/refresh on first 401
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.accessToken = null;
        }
      },
    },
  ),
);

// ── Dev bypass — applied AFTER store creation ─────────────────────────────────
if (isDev) {
  useAuthStore.setState({
    user: {
      id: "dev-user-001",
      name: "Dev Admin",
      email: "dev@resqid.com",
      role: import.meta.env.VITE_DEV_ROLE || "ADMIN",
      school_id: import.meta.env.VITE_DEV_SCHOOL_ID || "dev-school-001",
      school_name: "Dev Test School",
    },
    accessToken: "dev-token",
    isAuthenticated: true,
  });
}

export default useAuthStore;
