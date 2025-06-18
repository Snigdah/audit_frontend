import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { BuildingModel, BuildingResponse } from "../types/building";

class BuildingService {
  async getAllBuildings(): Promise<BuildingResponse[]> {
    const response = await apiClient.get<ApiResponse<BuildingResponse[]>>(
      ENDPOINTS.BUILDING.FETCH_ALL
    );
    return response.data.data;
  }

  async getBuildingById(id: number): Promise<BuildingResponse> {
    const response = await apiClient.get<ApiResponse<BuildingResponse>>(
      ENDPOINTS.BUILDING.FETCH_BY_ID(id)
    );
    return response.data.data;
  }

  async createBuilding(building: BuildingModel): Promise<BuildingResponse> {
    const response = await apiClient.post<ApiResponse<BuildingResponse>>(
      ENDPOINTS.BUILDING.CREATE,
      { buildingName: building.name }
    );
    return response.data.data;
  }

  async updateBuilding(building: BuildingModel): Promise<BuildingResponse> {
    if (!building.id) {
      throw new Error("Building ID is required for update");
    }

    const response = await apiClient.put<ApiResponse<BuildingResponse>>(
      ENDPOINTS.BUILDING.UPDATE(building.id),
      { buildingName: building.name }
    );
    return response.data.data;
  }

  async deleteBuilding(id: number): Promise<void> {
    if (!id) {
      throw new Error("Building ID is required for deletion");
    }

    await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.BUILDING.DELETE_BY_ID(id)
    );
  }
}

export default new BuildingService();
