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

export default API;
