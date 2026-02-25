import api from "./axiosClient";

export const loginApi = (payload) => api.post("/auth/admin", payload);
export const logoutApi = () => api.post("/auth/logout");
export const getProfileApi = () => api.get("/auth/me");
