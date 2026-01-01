import axios from "axios";

const API = axios.create({
  // baseURL: "https://evergreen-backend-kgck.onrender.com",
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const BASE_URL = "http://localhost:5000";
// export const BASE_URL = "https://evergreen-backend-kgck.onrender.com";

export default API;

