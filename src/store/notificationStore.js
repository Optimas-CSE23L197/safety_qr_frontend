/**
 * NOTIFICATION STORE (Zustand)
 * Manages in-app notification state for the current school session.
 *
 * Usage:
 *   const { notifications, unreadCount } = useNotificationStore();
 */

import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,
  page: 1,

  // ── Actions ────────────────────────────────────────────────────────────────

  setNotifications: (notifications, unreadCount) =>
    set({ notifications, unreadCount }),

  prependNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, status: "SENT" } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, status: "SENT" })),
      unreadCount: 0,
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setLoading: (loading) => set({ isLoading: loading }),

  appendPage: (newNotifications, hasMore) =>
    set((state) => ({
      notifications: [...state.notifications, ...newNotifications],
      hasMore,
      page: state.page + 1,
      isLoading: false,
    })),

  reset: () =>
    set({ notifications: [], unreadCount: 0, page: 1, hasMore: true }),
}));

export default useNotificationStore;
