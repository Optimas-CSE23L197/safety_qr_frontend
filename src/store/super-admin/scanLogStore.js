import { create } from "zustand";

const useScanLogStore = create((set) => ({
  scanLogs: [],
  stats: {
    total: 0,
    success: 0,
    failed: 0,
    rateLimited: 0,
    emergency: 0,
    successRate: 0,
    avgResponseTimeMs: 0,
  },
  filters: { schools: [], scanResults: [], scanTypes: [], scanPurposes: [] },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  setScanLogs: (scanLogs) => set({ scanLogs }),
  setStats: (stats) => set({ stats }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  clearScanLogs: () =>
    set({
      scanLogs: [],
      stats: {
        total: 0,
        success: 0,
        failed: 0,
        rateLimited: 0,
        emergency: 0,
        successRate: 0,
        avgResponseTimeMs: 0,
      },
      filters: {
        schools: [],
        scanResults: [],
        scanTypes: [],
        scanPurposes: [],
      },
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
}));

export default useScanLogStore;
