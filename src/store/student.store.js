/**
 * STUDENT STORE
 * Zustand store for student state management.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchStudents,
  fetchStudentById,
  exportStudents,
} from "../services/studentService.js";

const useStudentStore = create(
  devtools(
    (set, get) => ({
      students: [],
      currentStudent: null,
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      filters: {
        schoolId: null,
        search: "",
        class: null,
        section: null,
        tokenStatus: null,
        sortField: "first_name",
        sortDir: "asc",
      },
      loading: {
        list: false,
        detail: false,
        export: false,
      },
      error: null,

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          meta: { ...state.meta, page: 1 },
        }));
        get().fetchStudents();
      },

      setPage: (page) => {
        set((state) => ({
          meta: { ...state.meta, page },
        }));
        get().fetchStudents();
      },

      fetchStudents: async () => {
        const { filters, meta } = get();
        if (!filters.schoolId) return;

        set({ loading: { ...get().loading, list: true }, error: null });

        try {
          const result = await fetchStudents(filters.schoolId, {
            page: meta.page,
            limit: meta.limit,
            search: filters.search || undefined,
            class: filters.class,
            section: filters.section,
            tokenStatus: filters.tokenStatus,
            sortField: filters.sortField,
            sortDir: filters.sortDir,
          });

          set({
            students: result.students,
            meta: result.meta,
            loading: { ...get().loading, list: false },
          });
        } catch (error) {
          set({
            error: error.message,
            loading: { ...get().loading, list: false },
          });
        }
      },

      fetchStudentById: async (schoolId, studentId) => {
        set({ loading: { ...get().loading, detail: true }, error: null });

        try {
          const student = await fetchStudentById(schoolId, studentId);
          set({
            currentStudent: student,
            loading: { ...get().loading, detail: false },
          });
          return student;
        } catch (error) {
          set({
            error: error.message,
            loading: { ...get().loading, detail: false },
          });
          throw error;
        }
      },

      exportStudents: async (schoolId, filters = {}) => {
        set({ loading: { ...get().loading, export: true }, error: null });

        try {
          const blob = await exportStudents(schoolId, filters);
          set({ loading: { ...get().loading, export: false } });
          return blob;
        } catch (error) {
          set({
            error: error.message,
            loading: { ...get().loading, export: false },
          });
          throw error;
        }
      },

      clearCurrentStudent: () => {
        set({ currentStudent: null });
      },

      resetFilters: () => {
        set({
          filters: {
            ...get().filters,
            search: "",
            class: null,
            section: null,
            tokenStatus: null,
            sortField: "first_name",
            sortDir: "asc",
          },
          meta: { ...get().meta, page: 1 },
        });
        get().fetchStudents();
      },
    }),
    { name: "student-store" },
  ),
);

export default useStudentStore;
