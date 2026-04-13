/**
 * useToast Hook
 * Custom hook for accessing toast functions throughout the app.
 * Provides a consistent interface for showing notifications.
 */

import { toast } from "#utils/toast.js";
import { useCallback } from "react";

export const useToast = () => {
  const showToast = useCallback((message, type = "info", options = {}) => {
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
      default:
        toast.info(message, options);
        break;
    }
  }, []);

  const showApiError = useCallback(
    (error, fallback = "Something went wrong") => {
      toast.apiError(error, fallback);
    },
    [],
  );

  const showLoading = useCallback((message = "Loading...") => {
    return toast.loading(message);
  }, []);

  const resolveLoading = useCallback((toastId, { success, error }) => {
    toast.resolve(toastId, { success, error });
  }, []);

  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  const showPromise = useCallback((promise, messages) => {
    return toast.promise(promise, messages);
  }, []);

  return {
    showToast,
    showApiError,
    showLoading,
    resolveLoading,
    dismissToast,
    showPromise,
  };
};

export default useToast;
