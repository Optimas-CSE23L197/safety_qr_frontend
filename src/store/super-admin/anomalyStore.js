import { create } from "zustand";

const useAnomalyStore = create((set) => ({
  anomalies: [],
  stats: { total: 0, resolved: 0, unresolved: 0, by_severity: {}, by_type: {} },
  filters: { anomalyTypes: [], severities: [], resolvedStatuses: [] },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  setAnomalies: (anomalies) => set({ anomalies }),
  setStats: (stats) => set({ stats }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  updateAnomaly: (id, updates) =>
    set((state) => ({
      anomalies: state.anomalies.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
      stats: {
        ...state.stats,
        resolved: updates.resolved
          ? state.stats.resolved + 1
          : state.stats.resolved,
        unresolved: updates.resolved
          ? state.stats.unresolved - 1
          : state.stats.unresolved,
      },
    })),

  clearAnomalies: () =>
    set({
      anomalies: [],
      stats: {
        total: 0,
        resolved: 0,
        unresolved: 0,
        by_severity: {},
        by_type: {},
      },
      filters: { anomalyTypes: [], severities: [], resolvedStatuses: [] },
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
}));

export default useAnomalyStore;
