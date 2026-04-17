import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type {
  AdminDashboardResponse,
  OperatorDashboardResponse,
  OperatorReportDto,
  SupervisorDashboardResponse,
} from "../types/dashboard";

export const DashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const response = await apiClient.get<ApiResponse<AdminDashboardResponse>>(
      ENDPOINTS.DASHBOARD.ADMIN
    );
    return response.data.data;
  },

  async getSupervisorDashboard(): Promise<SupervisorDashboardResponse> {
    const response = await apiClient.get<
      ApiResponse<SupervisorDashboardResponse>
    >(ENDPOINTS.DASHBOARD.SUPERVISOR);
    return response.data.data;
  },

  async getOperatorDashboard(): Promise<OperatorDashboardResponse> {
    const response = await apiClient.get<
      ApiResponse<OperatorDashboardResponse>
    >(ENDPOINTS.DASHBOARD.OPERATOR);
    return response.data.data;
  },

  async getOperatorDashboardSlots(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedData<OperatorReportDto>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedData<OperatorReportDto>>
    >(ENDPOINTS.DASHBOARD.OPERATOR_SLOTS(params));
    return response.data.data;
  },
};
