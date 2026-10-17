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
  withCredentials: true, // httpOnly admin_session cookie göndərilir
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);
