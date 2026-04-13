// =============================================================================
// useSchools.js - React Query hook for school management
// =============================================================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService } from "#services/super-admin/school.service.js";
import { useToast } from "#hooks/useToast.js";

export const SCHOOLS_QUERY_KEY = ["super-admin", "schools"];
export const SCHOOL_DETAILS_QUERY_KEY = ["super-admin", "school", "details"];

export const useSchools = () => {
  const queryClient = useQueryClient();
  const { showPromise, showToast } = useToast();

  // Query: Get paginated schools list
  const useSchoolsList = (params = {}) => {
    return useQuery({
      queryKey: [...SCHOOLS_QUERY_KEY, params],
      queryFn: () => schoolService.getSchools(params),
      staleTime: 30000,
      keepPreviousData: true,
    });
  };

  // Query: Get school by ID
  const useSchoolDetails = (id, options = {}) => {
    return useQuery({
      queryKey: [...SCHOOL_DETAILS_QUERY_KEY, id],
      queryFn: () => schoolService.getSchoolById(id),
      enabled: !!id,
      staleTime: 60000,
      ...options,
    });
  };

  // Query: Get dashboard stats
  const useSchoolsStats = () => {
    return useQuery({
      queryKey: [...SCHOOLS_QUERY_KEY, "stats"],
      queryFn: () => schoolService.getStats(),
      staleTime: 120000,
    });
  };

  // Query: Get cities for filter
  const useCities = () => {
    return useQuery({
      queryKey: [...SCHOOLS_QUERY_KEY, "cities"],
      queryFn: () => schoolService.getCities(),
      staleTime: 300000,
    });
  };

  // Mutation: Register new school
  const useRegisterSchool = () => {
    return useMutation({
      mutationFn: (payload) => schoolService.registerSchool(payload),
      onSuccess: (data) => {
        showToast(data.message || "School registered successfully", "success");
        queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: [...SCHOOLS_QUERY_KEY, "stats"],
        });
      },
      onError: (error) => {
        if (error.type === "RATE_LIMITED") {
          showToast(error.message, "warning");
        } else if (error.type === "DUPLICATE") {
          showToast(error.message, "warning");
        } else if (error.type === "VALIDATION") {
          showToast(error.message, "error");
        } else {
          showToast(error.message || "Registration failed", "error");
        }
      },
    });
  };

  // Mutation: Toggle school status
  const useToggleSchoolStatus = () => {
    return useMutation({
      mutationFn: ({ id, isActive }) =>
        schoolService.toggleStatus(id, isActive),
      onSuccess: (data, variables) => {
        const message = variables.isActive
          ? "School activated"
          : "School deactivated";
        showToast(message, "success");
        queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: SCHOOL_DETAILS_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: [...SCHOOLS_QUERY_KEY, "stats"],
        });
      },
      onError: (error) => {
        showToast(error.message || "Failed to update school status", "error");
      },
    });
  };

  // Legacy: Direct register function (for RegisterSchool component)
  const registerSchool = async (payload) => {
    return showPromise(schoolService.registerSchool(payload), {
      loading: "Registering school...",
      success: "School registered successfully!",
      error: (err) => err.message || "Registration failed",
    });
  };

  return {
    // Queries
    useSchoolsList,
    useSchoolDetails,
    useSchoolsStats,
    useCities,
    // Mutations
    useRegisterSchool,
    useToggleSchoolStatus,
    // Legacy function
    registerSchool,
    isRegistering: false, // Kept for compatibility, use mutation instead
  };
};

export default useSchools;
