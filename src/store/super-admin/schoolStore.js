import { create } from "zustand";

const useSchoolStore = create((set) => ({
  schools: [],
  stats: { total: 0, active: 0, inactive: 0 },
  cities: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  setSchools: (schools) => set({ schools }),
  setStats: (stats) => set({ stats }),
  setCities: (cities) => set({ cities }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  updateSchoolStatus: (id, is_active) =>
    set((state) => ({
      schools: state.schools.map((s) =>
        s.id === id ? { ...s, is_active } : s,
      ),
      stats: {
        ...state.stats,
        active: is_active ? state.stats.active + 1 : state.stats.active - 1,
        inactive: is_active
          ? state.stats.inactive - 1
          : state.stats.inactive + 1,
      },
    })),

  clearSchools: () =>
    set({
      schools: [],
      stats: { total: 0, active: 0, inactive: 0 },
      cities: [],
      loading: false,
      error: null,
    }),
}));

export default useSchoolStore;
