import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type {
  OperatorDetail,
  OperatorSimple,
  UpdateOperatorRequest,
} from "../types/operator";

class OperatorService {
  async getOperatorById(id: number): Promise<OperatorDetail> {
    const response = await apiClient.get<ApiResponse<OperatorDetail>>(
      ENDPOINTS.OPERATOR.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async getAllOperators(search?: string): Promise<OperatorSimple[]> {
    const response = await apiClient.get<ApiResponse<OperatorSimple[]>>(
      ENDPOINTS.OPERATOR.FETCH_ALL(search)
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

  async deleteOperator(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.OPERATOR.DELETE(id)
    );
    return response.data;
  }
}

export default new OperatorService();
