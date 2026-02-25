import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export const loginService = async (payload) => {
  const res = await loginApi(payload);

  const { accessToken, admin } = res.data.data;

  if (!accessToken) {
    throw new Error("Access token missing");
  }

  useAuthStore.getState().setAuth({ accessToken, admin });

  return res.data.data;
};
