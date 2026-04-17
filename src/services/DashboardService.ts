import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { AdminDashboardResponse } from "../types/dashboard";

export const DashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const response = await apiClient.get<ApiResponse<AdminDashboardResponse>>(
      ENDPOINTS.DASHBOARD.ADMIN
    );
    return response.data.data;
  },
};
