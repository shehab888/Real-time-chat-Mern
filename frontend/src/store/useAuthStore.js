import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, // بيانات المستخدم بعد الـ login

  // set user after login/register or fetching from /auth/me
  setUser: (user) => set({ user }),

  // clear user after logout
  clearAuth: () => set({ user: null }),
}));

export default useAuthStore;
