import axiosClient from "../axiosClient.js";

export const anomalyApi = {
  list: (params) => axiosClient.get("/admin/scan-anomalies", { params }),
  getById: (id) => axiosClient.get(`/admin/scan-anomalies/${id}`),
  getStats: (params) =>
    axiosClient.get("/admin/scan-anomalies/stats", { params }),
  getFilters: () => axiosClient.get("/admin/scan-anomalies/filters"),
  resolve: (id, resolved_by) =>
    axiosClient.patch(`/admin/scan-anomalies/${id}/resolve`, { resolved_by }),
};
