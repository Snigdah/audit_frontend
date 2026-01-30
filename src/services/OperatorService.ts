import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { EquipmentResponse } from "../types/equipment";
import type {
  OperatorDetail,
  OperatorSimple,
  UpdateOperatorRequest,
} from "../types/operator";
import type { SupervisorSimple } from "../types/supervisor";

class OperatorService {
  async getOperatorById(id: number): Promise<OperatorDetail> {
    const response = await apiClient.get<ApiResponse<OperatorDetail>>(
      ENDPOINTS.OPERATOR.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async getAllOperators(
      params?: {
        search?: string;
        page?: number;
        size?: number;
        all?: boolean;
      }
    ): Promise<PaginatedData<OperatorSimple>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<OperatorSimple>>
      >(ENDPOINTS.OPERATOR.FETCH_ALL(params));
  
      return response.data.data;
    }
  
  async getAllOperatorsDropdown(query: string): Promise<OperatorSimple[]> {
      const response = await apiClient.get<ApiResponse<OperatorSimple[]>>(
        ENDPOINTS.OPERATOR.SEARCH_OPERATOR_DOWN(query)
      );

    return response.data.data;
  }

  async updateOperator(
    id: number,
    request: UpdateOperatorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.OPERATOR.UPDATE(id),
      request
    );
    return response.data;
  }

  // Fetch Supervisor by Operator
   async getSupervisorByOperator(
    operatorId: number
  ): Promise<SupervisorSimple[]> {
    const response = await apiClient.get<ApiResponse<SupervisorSimple[]>>(
      ENDPOINTS.OPERATOR.GET_SUPERVISOR(operatorId)
    );
    return response.data.data;
  }

  // Fetch Equipments by Operator
   async getEquipmentsByOperator(
    operatorId: number
  ): Promise<EquipmentResponse[]> {
    const response = await apiClient.get<ApiResponse<EquipmentResponse[]>>(
      ENDPOINTS.OPERATOR.GET_EQUIPMENTS(operatorId)
    );
    return response.data.data;
  }

}

export default new OperatorService();
