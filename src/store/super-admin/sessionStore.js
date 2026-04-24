import { create } from "zustand";

const useSessionStore = create((set) => ({
  sessions: [],
  stats: { total_active: 0, expiring_soon_24h: 0, most_active_platform: null },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 7,
    total: 0,
    totalPages: 0,
  },

  setSessions: (sessions) => set({ sessions }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      stats: {
        ...state.stats,
        total_active: Math.max(0, state.stats.total_active - 1),
      },
    })),

  clearSessions: () =>
    set({
      sessions: [],
      stats: {
        total_active: 0,
        expiring_soon_24h: 0,
        most_active_platform: null,
      },
      loading: false,
      error: null,
      pagination: { page: 1, limit: 7, total: 0, totalPages: 0 },
    }),
}));

export default useSessionStore;
