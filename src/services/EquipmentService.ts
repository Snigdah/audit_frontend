import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { EquipmentRequest, EquipmentResponse } from "../types/equipment";

class EquipmentService {
  async createEquipment(request: EquipmentRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.EQUIPMENT.CREATE(),
      request
    );
    return response.data;
  }

  async updateEquipment(
    id: number,
    request: EquipmentRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.EQUIPMENT.UPDATE(id),
      request
    );
    return response.data;
  }

  async getAllEquipments(search?: string): Promise<EquipmentResponse[]> {
    const response = await apiClient.get<ApiResponse<EquipmentResponse[]>>(
      ENDPOINTS.EQUIPMENT.FETCH_ALL(search)
    );
    return response.data.data;
  }

  async getEquipmentById(id: number): Promise<EquipmentResponse> {
    const response = await apiClient.get<ApiResponse<EquipmentResponse>>(
      ENDPOINTS.EQUIPMENT.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async deleteEquipment(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.EQUIPMENT.DELETE(id)
    );
    return response.data;
  }
}

export default new EquipmentService();
