/**
 * AXIOS CLIENT (Production Ready)
 * - Uses ESM dynamic import instead of require
 * - Safe refresh queue
 * - Single axios instance for refresh
 * - No header mutation race conditions
 */

import axios from "axios";

// ── Lazy accessors (avoid circular deps in ESM) ──────────────────────────────
const getAuthStore = async () => {
  const module = await import("../store/authStore.js");
  return module.default;
};

const getAccessToken = async () => {
  try {
    const store = await getAuthStore();
    return store.getState().accessToken;
  } catch {
    return null;
  }
};

const updateTokenInStore = async (token) => {
  try {
    const store = await getAuthStore();
    store.getState().updateToken(token);
  } catch {}
};

const clearAuthState = async () => {
  try {
    const store = await getAuthStore();
    store.getState().clearAuth();
  } catch {}
};

// ── Axios Instance ───────────────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Refresh Queue ────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

// ── Response Interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ── Handle 401 (token expired) ───────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // FIX: pass {} so axios sends Content-Type: application/json
        // Without this, backend enforceContentType middleware rejects with 400
        const { data } = await axiosClient.post("/auth/refresh", {});

        const newAccessToken = data?.data?.access_token;
        if (!newAccessToken) throw new Error("No access token returned");

        await updateTokenInStore(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── 403 Forbidden ────────────────────────────────────────────────────
    if (error.response?.status === 403) {
      console.warn("[API] Forbidden — insufficient permissions");
    }

    // ── 422 Validation ───────────────────────────────────────────────────
    if (error.response?.status === 422) {
      error.fieldErrors = error.response.data?.errors || null;
    }

    return Promise.reject(error);
  },
);

// ── Logout Handler ───────────────────────────────────────────────────────────
const handleLogout = async () => {
  await clearAuthState();
  window.location.href = "/login?session=expired";
};

export default axiosClient;
