// =============================================================================
// src/hooks/useDashboard.js — RESQID
// TanStack Query hook for school admin dashboard data.
//
// WHY TANSTACK QUERY (not useState + useEffect):
// ─────────────────────────────────────────────────────────────────────────────
//   ✅ Automatic background refetch (staleTime handles caching)
//   ✅ Request deduplication — multiple components can call useDashboard()
//      safely; only one network request fires
//   ✅ isLoading / isError / data states — no boilerplate
//   ✅ refetch() exposed — "Refresh" button wires up in one line
//   ✅ retry on failure — built-in
//
// CACHE CONFIG:
//   staleTime: 2min — matches backend Redis TTL (dashboard:schoolId, 120s)
//   gcTime:    5min — keep in memory after component unmounts
//   refetchOnWindowFocus: false — dashboard is a summary view, not real-time
//   retry: 1 — one auto-retry on network error, then show error state
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { getSchoolDashboardApi } from "../api/school.api.js";

export const DASHBOARD_QUERY_KEY = (schoolId) => ["dashboard", schoolId];

/**
 * useDashboard(schoolId)
 *
 * Returns TanStack Query result:
 * {
 *   data:      { stats, scanTrend, tokenBreakdown, recentAnomalies, pendingRequests, subscription }
 *   isLoading: boolean
 *   isError:   boolean
 *   error:     Error | null
 *   refetch:   () => void
 * }
 *
 * data is undefined on first load — components should guard with ?? defaults.
 */
export function useDashboard(schoolId) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY(schoolId),
    queryFn: async () => {
      const res = await getSchoolDashboardApi(schoolId);
      // res = { success: true, data: { ... } }
      return res.data;
    },
    enabled: !!schoolId, // don't fire if schoolId is not yet available
    staleTime: 2 * 60 * 1000, // 2 min — matches backend cache TTL
    gcTime: 5 * 60 * 1000, // 5 min in memory after unmount
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
