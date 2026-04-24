/**
 * useSchoolLogin Hook
 * Handles School User (admin/staff/viewer) login form state,
 * validation, submission, and errors.
 *
 * Calls loginSchoolUser() from authService — never touches API directly.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginDefaults } from "../validation/auth.schema.js";
import { loginSchoolUser } from "../services/authService.js";
import { toast } from "../utils/toast.js";

const useSchoolLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await loginSchoolUser(values, navigate);
      toast.success("Welcome back!");
    } catch (error) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      const message =
        status === 401
          ? "Invalid email or password."
          : status === 403
            ? "Your account has been disabled. Contact your administrator."
            : status === 429
              ? "Too many login attempts. Please wait a moment."
              : serverMessage
                ? serverMessage
                : "Login failed. Please try again.";

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

export default useSchoolLogin;
