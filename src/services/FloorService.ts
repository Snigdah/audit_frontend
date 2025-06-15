import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { FloorResponse, FloorFormData, FloorModel } from "../types/floor";

class FloorService {
  async getAllFloors(): Promise<FloorResponse[]> {
    const response = await apiClient.get<ApiResponse<FloorResponse[]>>(
      ENDPOINTS.FLOOR.FETCH_ALL
    );
    return response.data.data;
  }

  async getFloorById(id: number): Promise<FloorResponse> {
    const response = await apiClient.get<ApiResponse<FloorResponse>>(
      ENDPOINTS.FLOOR.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async getFloorsByBuildingId(buildingId: number): Promise<FloorResponse[]> {
    const response = await apiClient.get<ApiResponse<FloorResponse[]>>(
      ENDPOINTS.FLOOR.FETCH_BY_BUILDING_ID(buildingId)
    );
    return response.data.data;
  }

  async createFloor(floor: FloorModel): Promise<FloorResponse> {
    const response = await apiClient.post<ApiResponse<FloorResponse>>(
      ENDPOINTS.FLOOR.CREATE,
      floor.toCreatePayload()
    );
    return response.data.data;
  }

  async updateFloor(floor: FloorModel): Promise<FloorResponse> {
    if (!floor.id) {
      throw new Error("Floor ID is required for update");
    }

    const response = await apiClient.put<ApiResponse<FloorResponse>>(
      ENDPOINTS.FLOOR.UPDATE(floor.id),
      floor.toUpdatePayload()
    );
    return response.data.data;
  }

  async deleteFloor(id: number): Promise<void> {
    if (!id) {
      throw new Error("Floor ID is required for deletion");
    }

    await apiClient.delete<ApiResponse<void>>(ENDPOINTS.FLOOR.DELETE(id));
  }
}

export default new FloorService();
