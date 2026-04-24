import axiosClient from "../axiosClient.js";

export const dashboardApi = {
  getStats: (params) =>
    axiosClient.get("/super-admin/dashboard/stats", { params }),

  getGrowth: (params) =>
    axiosClient.get("/super-admin/dashboard/growth", { params }),

  getSubscriptionBreakdown: (params) =>
    axiosClient.get("/super-admin/dashboard/subscription-breakdown", {
      params,
    }),

  getRecentSchools: (params) =>
    axiosClient.get("/super-admin/dashboard/recent-schools", { params }),

  getRecentAudit: (params) =>
    axiosClient.get("/super-admin/dashboard/recent-audit", { params }),

  getSystemHealth: () =>
    axiosClient.get("/super-admin/dashboard/system-health"),

  getCompleteDashboard: (params) =>
    axiosClient.get("/super-admin/dashboard/complete", { params }),
};
