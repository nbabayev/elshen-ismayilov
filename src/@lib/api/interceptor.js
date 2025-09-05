// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // dəyiş
  timeout: 10000,
});

// 🔐 Request interceptor (Token əlavə et)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response interceptor (Error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token outdated? logout logic yaza bilərsən
      console.warn("Unauthorized – Token expired?");
    }

    return Promise.reject(error);
  }
);
