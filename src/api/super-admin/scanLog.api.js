import axiosClient from "../axiosClient.js";

export const scanLogApi = {
  list: (params) => axiosClient.get("/admin/scan-logs", { params }),
  getById: (id) => axiosClient.get(`/admin/scan-logs/${id}`),
  getStats: (params) => axiosClient.get("/admin/scan-logs/stats", { params }),
  getFilters: () => axiosClient.get("/admin/scan-logs/filters"),
};
