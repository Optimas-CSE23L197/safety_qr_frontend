// =============================================================================
// endpoints.js - API route constants
// =============================================================================

const API_VERSION = "/api/v1";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    ME: `${API_VERSION}/auth/me`,
  },

  // Super Admin - Schools
  SUPER_ADMIN: {
    SCHOOLS: {
      BASE: `${API_VERSION}/super-admin/schools`,
      LIST: `${API_VERSION}/super-admin/schools`,
      REGISTER: `${API_VERSION}/super-admin/schools`,
      DETAILS: (id) => `${API_VERSION}/super-admin/schools/${id}`,
      TOGGLE_STATUS: (id) =>
        `${API_VERSION}/super-admin/schools/${id}/toggle-status`,
      STATS: `${API_VERSION}/super-admin/schools/stats`,
      CITIES: `${API_VERSION}/super-admin/schools/cities`,
    },

    SUBSCRIPTIONS: {
      BASE: `${API_VERSION}/super-admin/subscriptions`,
      LIST: `${API_VERSION}/super-admin/subscriptions`,
      DETAILS: (id) => `${API_VERSION}/super-admin/subscriptions/${id}`,
      UPDATE: (id) => `${API_VERSION}/super-admin/subscriptions/${id}`,
      CANCEL: (id) => `${API_VERSION}/super-admin/subscriptions/${id}/cancel`,
      RENEW: (id) => `${API_VERSION}/super-admin/subscriptions/${id}/renew`,
    },

    ORDERS: {
      BASE: `${API_VERSION}/super-admin/orders`,
      LIST: `${API_VERSION}/super-admin/orders`,
      DETAILS: (id) => `${API_VERSION}/super-admin/orders/${id}`,
      UPDATE_STATUS: (id) => `${API_VERSION}/super-admin/orders/${id}/status`,
    },

    PAYMENTS: {
      BASE: `${API_VERSION}/super-admin/payments`,
      LIST: `${API_VERSION}/super-admin/payments`,
      RECORD: `${API_VERSION}/super-admin/payments/record`,
      DETAILS: (id) => `${API_VERSION}/super-admin/payments/${id}`,
    },

    SCANS: {
      BASE: `${API_VERSION}/super-admin/scans`,
      LIST: `${API_VERSION}/super-admin/scans`,
      STATS: `${API_VERSION}/super-admin/scans/stats`,
      ANOMALIES: `${API_VERSION}/super-admin/scans/anomalies`,
    },

    TOKENS: {
      BASE: `${API_VERSION}/super-admin/tokens`,
      LIST: `${API_VERSION}/super-admin/tokens`,
      GENERATE: `${API_VERSION}/super-admin/tokens/generate`,
      REVOKE: (id) => `${API_VERSION}/super-admin/tokens/${id}/revoke`,
    },

    DASHBOARD: {
      STATS: `${API_VERSION}/super-admin/dashboard/stats`,
      RECENT_ACTIVITY: `${API_VERSION}/super-admin/dashboard/recent`,
    },
  },
};
