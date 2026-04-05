import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "#api/super-admin/session.api.js";
import {
  transformSessionList,
  transformSessionStats,
} from "#services/super-admin/sessionService.js";
import useSessionStore from "#store/super-admin/sessionStore.js";

export const useSessions = (filters = {}) => {
  const queryClient = useQueryClient();
  const {
    setSessions,
    setStats,
    setLoading,
    setError,
    setPagination,
    removeSession,
  } = useSessionStore();

  const {
    page = 1,
    limit = 7,
    search = "",
    user_type = "",
    platform = "",
    last_active = "",
    status = "",
    sort_field = "last_active_at",
    sort_dir = "desc",
  } = filters;

  const listQuery = useQuery({
    queryKey: [
      "sessions",
      {
        page,
        limit,
        search,
        user_type,
        platform,
        last_active,
        status,
        sort_field,
        sort_dir,
      },
    ],
    queryFn: () =>
      sessionApi
        .list({
          page,
          limit,
          search,
          user_type,
          platform,
          last_active,
          status,
          sort_field,
          sort_dir,
        })
        .then((res) => ({
          data: res.data.data.map(transformSessionList),
          meta: res.data.meta,
        })),
  });

  const statsQuery = useQuery({
    queryKey: ["sessionStats"],
    queryFn: () =>
      sessionApi.getStats().then((res) => transformSessionStats(res.data.data)),
  });

  const revokeMutation = useMutation({
    mutationFn: ({ id, reason }) => sessionApi.revoke(id, reason),
    onSuccess: (_, { id }) => {
      removeSession(id);
      queryClient.invalidateQueries({ queryKey: ["sessionStats"] });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: ({ reason }) => sessionApi.revokeAll(reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessionStats"] });
    },
  });

  useEffect(() => {
    setLoading(listQuery.isLoading || statsQuery.isLoading);
  }, [listQuery.isLoading, statsQuery.isLoading, setLoading]);

  useEffect(() => {
    if (listQuery.data) {
      setSessions(listQuery.data.data);
      setPagination(listQuery.data.meta);
    }
    if (listQuery.error) setError(listQuery.error.message);
  }, [listQuery.data, listQuery.error, setSessions, setPagination, setError]);

  useEffect(() => {
    if (statsQuery.data) setStats(statsQuery.data);
  }, [statsQuery.data, setStats]);

  const refetch = useCallback(() => {
    listQuery.refetch();
    statsQuery.refetch();
  }, [listQuery, statsQuery]);

  return {
    sessions: useSessionStore((state) => state.sessions),
    stats: useSessionStore((state) => state.stats),
    pagination: useSessionStore((state) => state.pagination),
    loading: listQuery.isLoading,
    error: listQuery.error,
    refetch,
    revokeSession: revokeMutation.mutate,
    isRevoking: revokeMutation.isPending,
    revokeAllSessions: revokeAllMutation.mutate,
    isRevokingAll: revokeAllMutation.isPending,
  };
};
