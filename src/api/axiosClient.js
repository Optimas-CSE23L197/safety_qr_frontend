/**
 * AXIOS CLIENT
 * Configured instance with:
 * - Base URL from env
 * - Auth token injection (request interceptor)
 * - Token refresh on 401 (response interceptor)
 * - Error normalization
 */

import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants.js";

// ── Create Instance ───────────────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request Interceptor: Inject Bearer Token ──────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Track if refresh is in flight ─────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── Response Interceptor: Handle 401, Refresh Token ──────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 — try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token — force logout
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newToken = data.access_token;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        if (data.refresh_token) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
        }

        axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 — forbidden (wrong role)
    if (error.response?.status === 403) {
      console.warn("[API] 403 Forbidden — insufficient permissions");
    }

    // 422 — validation error from backend
    if (error.response?.status === 422) {
      const fieldErrors = error.response.data?.errors;
      if (fieldErrors) {
        error.fieldErrors = fieldErrors; // Attach for form error display
      }
    }

    return Promise.reject(error);
  },
);

// ── Force Logout ──────────────────────────────────────────────────────────────
const handleLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  // Trigger redirect — using window to avoid circular dep with router
  window.location.href = "/login?session=expired";
};

export default axiosClient;
