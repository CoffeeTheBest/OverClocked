// src/api/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,// 🍪 this sends cookies!
});

// No need to manually attach token from cookie; backend will read HttpOnly cookie
API.interceptors.request.use((config) => {
  return config;
});

// Add response interceptor to handle unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Only redirect if we're not on login/signup pages and not checking auth status
      const isAuthPage = ['/login', '/signup'].includes(window.location.pathname);
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      
      if (!isAuthPage && !isAuthCheck) {
        console.log('Unauthorized access detected, redirecting to login');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
