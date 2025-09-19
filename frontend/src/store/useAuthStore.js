import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearAuth: (full = false) => {
        set({ user: null });
        if (full) {
          localStorage.removeItem("auth-storage"); // 🛑 امسح كل الداتا
        }
      },
    }),
    {
      name: "auth-storage", // المفتاح بتاع localStorage
    }
  )
);

export default useAuthStore;
