// =============================================================================
// src/api/school.api.js — FIXED
// =============================================================================

import axiosClient from "./axiosClient.js";

/**
 * GET /api/v1/school-admin/:schoolId/dashboard
 *
 * Returns full dashboard payload:
 * {
 *   stats, scanTrend, tokenBreakdown,
 *   recentAnomalies, pendingRequests, subscription
 * }
 */
export async function getSchoolDashboardApi(schoolId) {
  const { data } = await axiosClient.get(`/school-admin/${schoolId}/dashboard`);

  return data; // { success: true, data: { ... } }
}
