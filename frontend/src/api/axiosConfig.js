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
    const { clearAuth } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 🟢 جرب تعمل refresh
        await api.post("/auth/refresh-token");

        // 🟢 بعد ما تعمل refresh ارجع جيب بيانات اليوزر من /auth/me
        const me = await api.get("/auth/me");
        if (me.data) {
          useAuthStore.getState().setUser(me.data);
        }

        // 🟢 رجع الطلب الأصلي
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid:", refreshError);

        // 🛑 امسح كل حاجة من store + localStorage
        clearAuth(true);

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;