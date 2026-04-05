import axiosClient from "../axiosClient.js";

export const sessionApi = {
  list: (params) => axiosClient.get("/super-admin/sessions", { params }),
  getStats: () => axiosClient.get("/super-admin/sessions/stats"),
  revoke: (id, reason) =>
    axiosClient.delete(`/super-admin/sessions/${id}/revoke`, {
      data: { reason },
    }),
  revokeAll: (reason) =>
    axiosClient.post("/super-admin/sessions/revoke-all", { reason }),
};
