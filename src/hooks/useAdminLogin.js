/**
 * useAdminLogin Hook
 * Handles login form submission, loading state, error handling.
 * Used by Login.jsx page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginDefaults } from "../validation/auth.schema.js";
import { login } from "../services/authService.js";
import { toast } from "../utils/toast.js";

const useAdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onBlur", // Validate on blur, not on every keystroke
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await login(values, navigate);
      // Navigation handled by authService based on role
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.response?.status === 401
          ? "Invalid email or password"
          : "Login failed. Please try again.";
      toast.error(message);
      form.setError("root", { message });
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
