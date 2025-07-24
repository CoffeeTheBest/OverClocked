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
      // If we're not already on the login page, redirect to login
      if (window.location.pathname !== '/login') {
        console.log('Unauthorized access detected, redirecting to login');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
