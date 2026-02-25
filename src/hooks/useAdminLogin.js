import { useState } from "react";
import { loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export function useAdminLogin(from) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const login = async (values) => {
    if (loading) return;

    try {
      setLoading(true);
      setApiError("");

      const data = await loginService(values);
      const role = data.admin.role;

      navigate(role === "SUPER_ADMIN" ? "/token" : from, {
        replace: true,
      });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, apiError };
}
