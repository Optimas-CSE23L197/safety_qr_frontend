import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { scanLogApi } from "#api/super-admin/scanLog.api.js";
import {
  transformScanLogList,
  transformScanLogStats,
  transformScanLogFilters,
} from "#services/super-admin/scanLogService.js";
import useScanLogStore from "#store/super-admin/scanLogStore.js";

export const useScanLogs = (filters = {}) => {
  const {
    setScanLogs,
    setStats,
    setFilters,
    setLoading,
    setError,
    setPagination,
  } = useScanLogStore();

  const {
    page = 1,
    limit = 10,
    search = "",
    school_id = "",
    result = "",
    scan_type = "",
    scan_purpose = "",
    from_date = "",
    to_date = "",
    sort_field = "created_at",
    sort_dir = "desc",
  } = filters;

  const listQuery = useQuery({
    queryKey: [
      "scanLogs",
      {
        page,
        limit,
        search,
        school_id,
        result,
        scan_type,
        scan_purpose,
        from_date,
        to_date,
        sort_field,
        sort_dir,
      },
    ],
    queryFn: () =>
      scanLogApi
        .list({
          page,
          limit,
          search,
          school_id,
          result,
          scan_type,
          scan_purpose,
          from_date,
          to_date,
          sort_field,
          sort_dir,
        })
        .then((res) => ({
          data: res.data.data.map(transformScanLogList),
          meta: res.data.meta,
        })),
  });

  const statsQuery = useQuery({
    queryKey: ["scanLogStats", { from_date, to_date }],
    queryFn: () =>
      scanLogApi
        .getStats({ from_date, to_date })
        .then((res) => transformScanLogStats(res.data.data)),
  });

  const filtersQuery = useQuery({
    queryKey: ["scanLogFilters"],
    queryFn: () =>
      scanLogApi
        .getFilters()
        .then((res) => transformScanLogFilters(res.data.data)),
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
      setScanLogs(listQuery.data.data);
      setPagination(listQuery.data.meta);
    }
    if (listQuery.error) setError(listQuery.error.message);
  }, [listQuery.data, listQuery.error, setScanLogs, setPagination, setError]);

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
    scanLogs: useScanLogStore((state) => state.scanLogs),
    stats: useScanLogStore((state) => state.stats),
    filters: useScanLogStore((state) => state.filters),
    pagination: useScanLogStore((state) => state.pagination),
    loading: listQuery.isLoading,
    error: listQuery.error,
    refetch,
  };
};
