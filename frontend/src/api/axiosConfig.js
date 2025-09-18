import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  // baseURL: "https://real-time-chat-backend-production-6f5c.up.railway.app/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Auto send cookies with requests
});

// Interceptor to handle 401 responses and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const { clearAuth } = useAuthStore.getState(); // نجيب الدالة مباشرة من Zustand store

    // لو 401 والطلب ما اتعملش retry قبل كدا
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // نحاول نعمل refresh token
        await api.post("/auth/refresh");

        // نعيد تنفيذ الطلب الأصلي
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid:", refreshError);

        // نمسح بيانات user من store
        clearAuth();

        // نعمل redirect للـ login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
