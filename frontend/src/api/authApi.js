import api from "./axiosConfig";

export const login = (credentials) =>
  api.post("/auth/login", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Register
export const register = (data) =>
  api.post("/auth/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
// Verify Email
export const verifyEmail = (token) =>
  api.post(`/auth/verify-email/${token}`, { withCredentials: true });

// Resend verification email
export const resendVerificationEmail = (email) =>
  api.post("/auth/resend-verification", { email }, { withCredentials: true });

export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/authَ/logout");
export const refreshToken = () => api.get("/auth/refresh");
