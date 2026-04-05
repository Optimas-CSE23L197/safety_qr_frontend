import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { anomalyApi } from "#api/super-admin/anomaly.api.js";
import {
  transformAnomalyList,
  transformAnomalyStats,
  transformAnomalyFilters,
} from "#services/super-admin/anomalyService.js";
import useAnomalyStore from "#store/super-admin/anomalyStore.js";

export const useAnomalies = (filters = {}) => {
  const queryClient = useQueryClient();
  const {
    setAnomalies,
    setStats,
    setFilters,
    setLoading,
    setError,
    setPagination,
    updateAnomaly,
  } = useAnomalyStore();

  const {
    page = 1,
    limit = 10,
    search = "",
    resolved = "",
    anomaly_type = "",
    severity = "",
    from_date = "",
    to_date = "",
    sort_field = "created_at",
    sort_dir = "desc",
  } = filters;

  const listQuery = useQuery({
    queryKey: [
      "anomalies",
      {
        page,
        limit,
        search,
        resolved,
        anomaly_type,
        severity,
        from_date,
        to_date,
        sort_field,
        sort_dir,
      },
    ],
    queryFn: () =>
      anomalyApi
        .list({
          page,
          limit,
          search,
          resolved,
          anomaly_type,
          severity,
          from_date,
          to_date,
          sort_field,
          sort_dir,
        })
        .then((res) => ({
          data: res.data.data.map(transformAnomalyList),
          meta: res.data.meta,
        })),
  });

  const statsQuery = useQuery({
    queryKey: ["anomalyStats", { from_date, to_date }],
    queryFn: () =>
      anomalyApi
        .getStats({ from_date, to_date })
        .then((res) => transformAnomalyStats(res.data.data)),
  });

  const filtersQuery = useQuery({
    queryKey: ["anomalyFilters"],
    queryFn: () =>
      anomalyApi
        .getFilters()
        .then((res) => transformAnomalyFilters(res.data.data)),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolved_by }) => anomalyApi.resolve(id, resolved_by),
    onSuccess: (_, { id }) => {
      updateAnomaly(id, {
        resolved: true,
        resolved_at: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ["anomalyStats"] });
    },
  });

  useEffect(() => {
    setLoading(
      listQuery.isLoading || statsQuery.isLoading || filtersQuery.isLoading,
    );
  }, [
    listQuery.isLoading,
    statsQuery.isLoading,
    filtersQuery.isLoading,
    setLoading,
  ]);

  useEffect(() => {
    if (listQuery.data) {
      setAnomalies(listQuery.data.data);
      setPagination(listQuery.data.meta);
    }
    if (listQuery.error) setError(listQuery.error.message);
  }, [listQuery.data, listQuery.error, setAnomalies, setPagination, setError]);

  useEffect(() => {
    if (statsQuery.data) setStats(statsQuery.data);
    if (filtersQuery.data) setFilters(filtersQuery.data);
  }, [statsQuery.data, filtersQuery.data, setStats, setFilters]);

  const refetch = useCallback(() => {
    listQuery.refetch();
    statsQuery.refetch();
    filtersQuery.refetch();
  }, [listQuery, statsQuery, filtersQuery]);

  return {
    anomalies: useAnomalyStore((state) => state.anomalies),
    stats: useAnomalyStore((state) => state.stats),
    filters: useAnomalyStore((state) => state.filters),
    pagination: useAnomalyStore((state) => state.pagination),
    loading: listQuery.isLoading,
    error: listQuery.error,
    refetch,
    resolveAnomaly: resolveMutation.mutate,
    isResolving: resolveMutation.isPending,
  };
};
