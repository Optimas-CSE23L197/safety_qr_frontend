import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolApi } from "#api/super-admin/school.api.js";
import {
  transformSchoolList,
  transformSchoolStats,
  transformRegisterSchool,
} from "#services/super-admin/schoolService.js";
import useSchoolStore from "#store/super-admin/schoolStore.js";

export const useSchools = (filters = {}) => {
  const queryClient = useQueryClient();
  const {
    setSchools,
    setStats,
    setCities,
    setLoading,
    setError,
    setPagination,
    updateSchoolStatus,
  } = useSchoolStore();

  const {
    page = 1,
    limit = 10,
    search = "",
    city = "",
    subscription_status = "",
    status = "",
    sort_field = "created_at",
    sort_dir = "desc",
  } = filters;

  const listQuery = useQuery({
    queryKey: [
      "schools",
      {
        page,
        limit,
        search,
        city,
        subscription_status,
        status,
        sort_field,
        sort_dir,
      },
    ],
    queryFn: () =>
      schoolApi
        .list({
          page,
          limit,
          search,
          city,
          subscription_status,
          status,
          sort_field,
          sort_dir,
        })
        .then((res) => ({
          data: res.data.data.map(transformSchoolList),
          meta: res.data.meta,
        })),
  });

  const statsQuery = useQuery({
    queryKey: ["schoolStats"],
    queryFn: () =>
      schoolApi.getStats().then((res) => transformSchoolStats(res.data.data)),
  });

  const citiesQuery = useQuery({
    queryKey: ["schoolCities"],
    queryFn: () => schoolApi.getCities().then((res) => res.data.data.cities),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }) => schoolApi.toggleStatus(id, is_active),
    onSuccess: (_, { id, is_active }) => {
      updateSchoolStatus(id, is_active);
      queryClient.invalidateQueries({ queryKey: ["schoolStats"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload) =>
      schoolApi.register(transformRegisterSchool(payload)),
  });

  useEffect(() => {
    setLoading(
      listQuery.isLoading || statsQuery.isLoading || citiesQuery.isLoading,
    );
  }, [
    listQuery.isLoading,
    statsQuery.isLoading,
    citiesQuery.isLoading,
    setLoading,
  ]);

  useEffect(() => {
    if (listQuery.data) {
      setSchools(listQuery.data.data);
      setPagination(listQuery.data.meta);
    }
    if (listQuery.error) setError(listQuery.error.message);
  }, [listQuery.data, listQuery.error, setSchools, setPagination, setError]);

  useEffect(() => {
    if (statsQuery.data) setStats(statsQuery.data);
    if (citiesQuery.data) setCities(citiesQuery.data);
  }, [statsQuery.data, citiesQuery.data, setStats, setCities]);

  const refetch = useCallback(() => {
    listQuery.refetch();
    statsQuery.refetch();
    citiesQuery.refetch();
  }, [listQuery, statsQuery, citiesQuery]);

  return {
    schools: useSchoolStore((state) => state.schools),
    stats: useSchoolStore((state) => state.stats),
    cities: useSchoolStore((state) => state.cities),
    pagination: useSchoolStore((state) => state.pagination),
    loading: listQuery.isLoading || statsQuery.isLoading,
    error: listQuery.error || statsQuery.error,
    refetch,
    toggleStatus: toggleStatusMutation.mutate,
    isToggling: toggleStatusMutation.isPending,
    registerSchool: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
  };
};
