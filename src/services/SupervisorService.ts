import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { OperatorSimple } from "../types/operator";
import type {
  SupervisorDetail,
  SupervisorOperatorRequest,
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

  // ✅ Assign Operator
  async assignOperator(
    request: SupervisorOperatorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.SUPERVISOR.ASSIGN_OPERATOR,
      request
    );
    return response.data;
  }

  // ✅ Remove Operator
  async removeOperator(
    request: SupervisorOperatorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.SUPERVISOR.REMOVE_OPERATOR,
      request
    );
    return response.data;
  }

  // ✅ Fetch Operators by Supervisor
  async getOperatorsBySupervisor(
    supervisorId: number
  ): Promise<OperatorSimple[]> {
    const response = await apiClient.get<ApiResponse<OperatorSimple[]>>(
      ENDPOINTS.SUPERVISOR.GET_OPERATORS(supervisorId)
    );
    return response.data.data;
  }
}

export default new SupervisorService();
