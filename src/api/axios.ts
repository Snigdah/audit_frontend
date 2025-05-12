import axios, { AxiosError } from "axios";
import { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants/config";
import AuthService from "../services/AuthService";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthService.getAccessToken();

    // If token exists, add it to every request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// In your axios interceptor:
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for new token
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await AuthService.refreshToken();
        if (!refreshed) throw new Error("Refresh failed");

        const newToken = AuthService.getAccessToken();
        if (!newToken) throw new Error("No new token");

        // Retry all queued requests with new token
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers = [];

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        AuthService.clearAuthData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
