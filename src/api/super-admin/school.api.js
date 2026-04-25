import axiosClient from "../axiosClient.js";

export const schoolApi = {
  list: (params) => axiosClient.get("/super-admin/schools", { params }),
  getById: (id) => axiosClient.get(`/super-admin/schools/${id}`),
  getStats: () => axiosClient.get("/super-admin/schools/stats"),
  getCities: () => axiosClient.get("/super-admin/schools/cities"),
  toggleStatus: (id, is_active) =>
    axiosClient.patch(`/super-admin/schools/${id}/toggle-status`, {
      is_active,
    }),
  register: (data) => axiosClient.post("/super-admin/schools", data),
};
