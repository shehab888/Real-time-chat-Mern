import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  // baseURL: "https://real-time-chat-backend-production-6f5c.up.railway.app/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Auto send cookies with requests
});

// Interceptor to handle 401 responses and refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { setUser } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 🟢 لو فيه refresh شغال → استنى
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🟢 جرب تعمل refresh
        await api.post("/auth/refresh-token");

        // 🟢 هات بيانات اليوزر
        const me = await api.get("/auth/me");
        if (me.data) {
          setUser(me.data);
        }

        processQueue(null); // ✅ فك الانتظار
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // 🛑 بدل clearAuth → نحط user = null في localStorage
        setUser(null);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
