import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPIRY_TIME = 1000 * 60 * 15;

const storageWithExpiry = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    const data = JSON.parse(str);
    const now = Date.now();

    if (data.expiry && now > data.expiry) {
      localStorage.removeItem(name);
      return null; // انتهت الصلاحية
    }
    return data.state; // دي اللي بيحتاجها persist
  },
  setItem: (name, value) => {
    const data = {
      state: value,
      expiry: Date.now() + EXPIRY_TIME,
    };
    localStorage.setItem(name, JSON.stringify(data));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearAuth: (full = false) => {
        set({ user: null });
        if (full) {
          localStorage.clear();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: storageWithExpiry,
    }
  )
);

export default useAuthStore;
