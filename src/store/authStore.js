import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null,
  token: null,
  login: (data) => set({ user: data.user, token: data.token }),
  logout: () => set({ user: null, token: null }),
}));
