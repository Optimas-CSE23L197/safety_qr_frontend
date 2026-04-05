import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "#api/super-admin/dashboard.api.js";
import {
  transformStats,
  transformGrowth,
  transformSubscriptionBreakdown,
  transformRecentSchools,
  transformRecentAudit,
  transformSystemHealth,
} from "#services/super-admin/dashboardService.js";
import useDashboardStore from "#store/super-admin/dashboardStore.js";

export const useDashboard = (filters = {}) => {
  const {
    setStats,
    setGrowth,
    setSubscriptionBreakdown,
    setRecentSchools,
    setRecentAudit,
    setSystemHealth,
    setLoading,
    setError,
  } = useDashboardStore();

  const statsQuery = useQuery({
    queryKey: ["dashboardStats", filters],
    queryFn: () =>
      dashboardApi
        .getStats(filters)
        .then((res) => transformStats(res.data.data)),
  });

  const growthQuery = useQuery({
    queryKey: ["dashboardGrowth", filters.months, filters.school_id],
    queryFn: () =>
      dashboardApi
        .getGrowth({ months: filters.months, school_id: filters.school_id })
        .then((res) => transformGrowth(res.data.data)),
  });

  const subscriptionQuery = useQuery({
    queryKey: ["subscriptionBreakdown", filters.school_id],
    queryFn: () =>
      dashboardApi
        .getSubscriptionBreakdown({ school_id: filters.school_id })
        .then((res) => transformSubscriptionBreakdown(res.data.data)),
  });

  const schoolsQuery = useQuery({
    queryKey: ["recentSchools", filters.recentSchoolsLimit],
    queryFn: () =>
      dashboardApi
        .getRecentSchools({ limit: filters.recentSchoolsLimit || 10 })
        .then((res) => transformRecentSchools(res.data.data)),
  });

  const auditQuery = useQuery({
    queryKey: ["recentAudit", filters.auditLimit, filters.actor_type],
    queryFn: () =>
      dashboardApi
        .getRecentAudit({
          limit: filters.auditLimit || 20,
          actor_type: filters.actor_type,
        })
        .then((res) => transformRecentAudit(res.data.data)),
  });

  const healthQuery = useQuery({
    queryKey: ["systemHealth"],
    queryFn: () =>
      dashboardApi
        .getSystemHealth()
        .then((res) => transformSystemHealth(res.data.data)),
  });

  useEffect(() => {
    const loading =
      statsQuery.isLoading ||
      growthQuery.isLoading ||
      subscriptionQuery.isLoading ||
      schoolsQuery.isLoading ||
      auditQuery.isLoading ||
      healthQuery.isLoading;
    setLoading(loading);

    const error =
      statsQuery.error ||
      growthQuery.error ||
      subscriptionQuery.error ||
      schoolsQuery.error ||
      auditQuery.error ||
      healthQuery.error;
    if (error) setError(error.message);

    if (statsQuery.data) setStats(statsQuery.data);
    if (growthQuery.data) setGrowth(growthQuery.data);
    if (subscriptionQuery.data)
      setSubscriptionBreakdown(subscriptionQuery.data);
    if (schoolsQuery.data) setRecentSchools(schoolsQuery.data);
    if (auditQuery.data) setRecentAudit(auditQuery.data);
    if (healthQuery.data) setSystemHealth(healthQuery.data);
  }, [
    statsQuery.data,
    statsQuery.isLoading,
    statsQuery.error,
    growthQuery.data,
    growthQuery.isLoading,
    growthQuery.error,
    subscriptionQuery.data,
    subscriptionQuery.isLoading,
    subscriptionQuery.error,
    schoolsQuery.data,
    schoolsQuery.isLoading,
    schoolsQuery.error,
    auditQuery.data,
    auditQuery.isLoading,
    auditQuery.error,
    healthQuery.data,
    healthQuery.isLoading,
    healthQuery.error,
  ]);

  return {
    refetchAll: () => {
      statsQuery.refetch();
      growthQuery.refetch();
      subscriptionQuery.refetch();
      schoolsQuery.refetch();
      auditQuery.refetch();
      healthQuery.refetch();
    },
    isLoading: statsQuery.isLoading || growthQuery.isLoading,
  };
};
