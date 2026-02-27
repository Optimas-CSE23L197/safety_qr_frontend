/**
 * AUTH API
 * Raw HTTP calls for authentication.
 * No business logic here — that lives in authService.js
 */

import axiosClient from "./axiosClient.js";

/**
 * Login — works for both SuperAdmin and SchoolUser
 * Backend returns { access_token, refresh_token, user, role }
 */
export const loginApi = (credentials) =>
  axiosClient.post("/auth/login", credentials);

/**
 * Logout — invalidate session on backend
 */
export const logoutApi = () => axiosClient.post("/auth/logout");

/**
 * Refresh access token
 */
export const refreshTokenApi = (refreshToken) =>
  axiosClient.post("/auth/refresh", { refresh_token: refreshToken });

/**
 * Get current authenticated user profile
 */
export const getMeApi = () => axiosClient.get("/auth/me");

/**
 * Change password
 */
export const changePasswordApi = (payload) =>
  axiosClient.post("/auth/change-password", payload);
