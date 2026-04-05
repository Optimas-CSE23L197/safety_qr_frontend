import { create } from "zustand";

const useDashboardStore = create((set) => ({
  stats: null,
  growth: null,
  subscriptionBreakdown: null,
  recentSchools: [],
  recentAudit: [],
  systemHealth: null,
  loading: false,
  error: null,

  setStats: (stats) => set({ stats }),
  setGrowth: (growth) => set({ growth }),
  setSubscriptionBreakdown: (data) => set({ subscriptionBreakdown: data }),
  setRecentSchools: (schools) => set({ recentSchools: schools }),
  setRecentAudit: (logs) => set({ recentAudit: logs }),
  setSystemHealth: (health) => set({ systemHealth: health }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearDashboard: () =>
    set({
      stats: null,
      growth: null,
      subscriptionBreakdown: null,
      recentSchools: [],
      recentAudit: [],
      systemHealth: null,
      loading: false,
      error: null,
    }),
}));

export default useDashboardStore;
