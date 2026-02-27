/**
 * TOAST UTILITY
 * Wrapper around react-hot-toast (or your preferred toast library).
 * Install: npm install react-hot-toast
 *
 * Usage:
 *   import { toast } from '@/utils/toast';
 *   toast.success('Token assigned successfully');
 *   toast.error('Failed to revoke token');
 *   toast.apiError(error); // Extracts message from API error
 */

import { toast as hotToast } from "react-hot-toast";

// ── Toast Config ──────────────────────────────────────────────────────────────
const BASE_OPTIONS = {
  duration: 4000,
  style: {
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    fontWeight: "500",
    borderRadius: "8px",
    padding: "12px 16px",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    maxWidth: "400px",
  },
};

const SUCCESS_OPTIONS = {
  ...BASE_OPTIONS,
  style: {
    ...BASE_OPTIONS.style,
    background: "#ECFDF5",
    color: "#047857",
    border: "1px solid #10B981",
  },
  iconTheme: { primary: "#10B981", secondary: "#ECFDF5" },
};

const ERROR_OPTIONS = {
  ...BASE_OPTIONS,
  duration: 6000,
  style: {
    ...BASE_OPTIONS.style,
    background: "#FEF2F2",
    color: "#B91C1C",
    border: "1px solid #EF4444",
  },
  iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
};

const WARNING_OPTIONS = {
  ...BASE_OPTIONS,
  style: {
    ...BASE_OPTIONS.style,
    background: "#FFFBEB",
    color: "#B45309",
    border: "1px solid #F59E0B",
  },
  icon: "⚠️",
};

const INFO_OPTIONS = {
  ...BASE_OPTIONS,
  style: {
    ...BASE_OPTIONS.style,
    background: "#F0F9FF",
    color: "#0369A1",
    border: "1px solid #0EA5E9",
  },
  iconTheme: { primary: "#0EA5E9", secondary: "#F0F9FF" },
};

// ── Extract API Error Message ──────────────────────────────────────────────────
const extractApiMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

// ── Toast API ─────────────────────────────────────────────────────────────────
export const toast = {
  success: (message, options = {}) =>
    hotToast.success(message, { ...SUCCESS_OPTIONS, ...options }),

  error: (message, options = {}) =>
    hotToast.error(message, { ...ERROR_OPTIONS, ...options }),

  warning: (message, options = {}) =>
    hotToast(message, { ...WARNING_OPTIONS, ...options }),

  info: (message, options = {}) =>
    hotToast(message, { ...INFO_OPTIONS, ...options }),

  /**
   * Show error toast from an API error object
   */
  apiError: (error, fallback = "Something went wrong.") => {
    const message = extractApiMessage(error) || fallback;
    hotToast.error(message, ERROR_OPTIONS);
  },

  /**
   * Show loading toast that you can update
   * Returns the toast ID
   */
  loading: (message = "Loading...") =>
    hotToast.loading(message, {
      ...BASE_OPTIONS,
      style: {
        ...BASE_OPTIONS.style,
        background: "#F8FAFC",
        color: "#334155",
        border: "1px solid #E2E8F0",
      },
    }),

  /**
   * Dismiss a toast by ID
   */
  dismiss: (toastId) => hotToast.dismiss(toastId),

  /**
   * Update a loading toast to success or error
   */
  resolve: (toastId, { success, error }) => {
    hotToast.dismiss(toastId);
    if (success) toast.success(success);
    if (error) toast.error(error);
  },

  /**
   * Promise-based toast
   * toast.promise(myAsyncFn(), { loading: '...', success: '...', error: '...' })
   */
  promise: (promise, messages) =>
    hotToast.promise(promise, messages, {
      success: SUCCESS_OPTIONS,
      error: ERROR_OPTIONS,
      loading: BASE_OPTIONS,
    }),
};
