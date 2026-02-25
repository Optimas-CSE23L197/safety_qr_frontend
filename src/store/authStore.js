import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: ({ accessToken, admin }) =>
    set({
      accessToken,
      user: admin,
      role: admin?.role,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      role: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
