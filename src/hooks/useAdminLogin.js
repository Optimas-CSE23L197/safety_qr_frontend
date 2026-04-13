/**
 * useAdminLogin Hook
 * Handles Super Admin login form state, validation, submission, and errors.
 * Used exclusively by SuperAdminLogin.jsx
 *
 * Calls loginSuperAdmin() from authService — never touches API directly.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginDefaults } from "../validation/auth.schema.js";
import { loginSuperAdmin } from "../services/authService.js";
import { toast } from "#utils/Toast.js";

const useAdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onBlur", // validate on blur — not on every keystroke
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await loginSuperAdmin(values, navigate);
      // Navigation is handled inside loginSuperAdmin — no redirect needed here
      toast.success("Welcome back!");
    } catch (error) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      const message =
        status === 401
          ? "Invalid email or password."
          : status === 403
            ? "Your account has been disabled. Contact support."
            : status === 429
              ? "Too many login attempts. Please wait a moment."
              : serverMessage
                ? serverMessage
                : "Login failed. Please try again.";

      // Show error inline in form (root error) AND as a toast
      form.setError("root", { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
  };
};

export default useAdminLogin;
