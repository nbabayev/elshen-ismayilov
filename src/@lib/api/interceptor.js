// src/lib/api.ts
import axios from "axios";

// Server-side işləyərkən mütləq (absolute) URL, client-side işləyərkən isə
// görəli (relative) URL istifadə etmək üçün funksiya.
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side, /api kifayətdir.
    return "/api";
  }
  // Server-side, tam URL lazımdır. Bunu .env faylından götürmək daha yaxşıdır.
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

// 🔐 Request interceptor (Token əlavə et)
api.interceptors.request.use(
  (config) => {
    // Yalnız client-side (brauzer) mühitində localStorage-ə müraciət et
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
