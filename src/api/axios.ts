import axios from "axios";
import { API_BASE_URL } from "../constants/config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request/response interceptors here
apiClient.interceptors.request.use((config) => {
  // Add auth tokens here if needed
  return config;
});

export default apiClient;
