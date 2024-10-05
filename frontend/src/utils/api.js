import axios from "axios";
import { getValidToken } from "./auth";

const baseURL = "/api";

// Instance for unauthenticated routes
const api = axios.create({ baseURL });

// Instance for authenticated routes
const authApi = axios.create({ baseURL });

authApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getValidToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting valid token:", error);
      // Optionally, you can redirect to login page here
      // or handle unauthorized access
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api, authApi };
