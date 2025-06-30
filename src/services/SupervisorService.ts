import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type {
  SupervisorDetail,
  SupervisorSimple,
  UpdateSupervisorRequest,
} from "../types/supervisor";

class SupervisorService {
  async getSupervisorById(id: number): Promise<SupervisorDetail> {
    const response = await apiClient.get<ApiResponse<SupervisorDetail>>(
      ENDPOINTS.SUPERVISOR.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async getAllSupervisors(search?: string): Promise<SupervisorSimple[]> {
    const response = await apiClient.get<ApiResponse<SupervisorSimple[]>>(
      ENDPOINTS.SUPERVISOR.FETCH_ALL(search)
    );
    return response.data.data;
  }

  async updateSupervisor(
    id: number,
    request: UpdateSupervisorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.SUPERVISOR.UPDATE(id),
      request
    );
    return response.data;
  }
}

export default new SupervisorService();
