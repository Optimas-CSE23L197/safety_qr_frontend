/**
 * AUTH API
 * Raw HTTP calls for authentication.
 * No business logic here — that lives in authService.js
 *
 * Refresh token lives in httpOnly cookie — never sent in request body.
 * withCredentials on axiosClient ensures cookie is always attached.
 */

import axiosClient from "./axiosClient.js";

// ── Super Admin ───────────────────────────────────────────────────────────────
export const loginSuperAdminApi = (credentials) =>
  axiosClient.post("/auth/super-admin", credentials);

// ── School User ───────────────────────────────────────────────────────────────
export const loginSchoolApi = (credentials) =>
  axiosClient.post("/auth/school", credentials);

// ── Parent (OTP flow) ─────────────────────────────────────────────────────────
export const sendOtpApi = (phone) =>
  axiosClient.post("/auth/parent/send-otp", { phone });

export const verifyOtpApi = ({ phone, otp }) =>
  axiosClient.post("/auth/parent/verify-otp", { phone, otp });

// ── Shared ────────────────────────────────────────────────────────────────────

/**
 * Refresh access token.
 * No body needed — refresh token is in httpOnly cookie,
 * sent automatically via withCredentials.
 */
export const refreshTokenApi = () => axiosClient.post("/auth/refresh");

/**
 * Logout — blacklists access token + deletes session on backend.
 * Cookie is cleared by backend Set-Cookie response.
 */
export const logoutApi = () => axiosClient.post("/auth/logout");

/**
 * Get current authenticated user profile.
 */
export const getMeApi = () => axiosClient.get("/auth/me");

/**
 * Change password.
 */
export const changePasswordApi = (payload) =>
  axiosClient.post("/auth/change-password", payload);
