import axios from "axios";
import useAuthStore from "../store/useAuthStore";
const api = axios.create({
  // baseURL: "https://real-time-chat-backend-production-6f5c.up.railway.app/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Auto send cookies with requests
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { setUser } = useAuthStore.getState();

    // لو 401 ولسه مجربناش ريفريش + مش الريكويست بتاع الريفريش نفسه
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // جرب تعمل ريفريش
        await api.post("/auth/refresh-token");

        const data = JSON.parse(localStorage.getItem("auth-storage"));
        if (data) {
          data.expiry = Date.now() + 1000 * 60 * 15;
          localStorage.setItem("auth-storage", JSON.stringify(data));
        }
        // بعد النجاح عيد تشغيل الريكويست الأصلي
        return api(originalRequest);
      } catch (refreshError) {
        // لو الريفريش نفسه فشل → مسح اليوزر
        setUser(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
