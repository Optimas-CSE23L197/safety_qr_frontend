/**
 * UI STORE (Zustand)
 * Manages UI state: sidebar, global loading, badge counts for nav items.
 *
 * Usage:
 *   const { sidebarCollapsed, toggleSidebar } = useUiStore();
 *   const { badges } = useUiStore();
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUiStore = create(
  persist(
    (set, get) => ({
      // ── Sidebar ────────────────────────────────────────────────────────────
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // ── Global Loading (full-page overlay) ────────────────────────────────
      globalLoading: false,
      globalLoadingMessage: "",

      setGlobalLoading: (loading, message = "") =>
        set({ globalLoading: loading, globalLoadingMessage: message }),

      // ── Nav Badge Counts ─────────────────────────────────────────────────
      // These are keyed to match badgeKey in sidebar.config.js
      badges: {
        pendingRequests: 0,
        unresolvedAnomalies: 0,
        unreadNotifications: 0,
      },

      setBadge: (key, count) =>
        set((state) => ({
          badges: { ...state.badges, [key]: count },
        })),

      clearBadge: (key) =>
        set((state) => ({
          badges: { ...state.badges, [key]: 0 },
        })),

      setBadges: (badgeMap) =>
        set((state) => ({
          badges: { ...state.badges, ...badgeMap },
        })),

      // ── Active Modal ──────────────────────────────────────────────────────
      activeModal: null, // string identifier of open modal
      modalData: null, // data passed to modal

      openModal: (modalId, data = null) =>
        set({ activeModal: modalId, modalData: data }),

      closeModal: () => set({ activeModal: null, modalData: null }),

      // ── Confirm Dialog ────────────────────────────────────────────────────
      confirmDialog: {
        open: false,
        title: "",
        message: "",
        confirmLabel: "Confirm",
        variant: "danger", // 'danger' | 'warning' | 'info'
        onConfirm: null,
      },

      openConfirm: ({
        title,
        message,
        confirmLabel = "Confirm",
        variant = "danger",
        onConfirm,
      }) =>
        set({
          confirmDialog: {
            open: true,
            title,
            message,
            confirmLabel,
            variant,
            onConfirm,
          },
        }),

      closeConfirm: () =>
        set((state) => ({
          confirmDialog: {
            ...state.confirmDialog,
            open: false,
            onConfirm: null,
          },
        })),
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist sidebar state — rest is ephemeral
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

export default useUiStore;
