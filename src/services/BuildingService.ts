import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { BuildingResponse } from "../types/building";

class BuildingService {
  async getAllBuildings(): Promise<BuildingResponse[]> {
    const response = await apiClient.get<ApiResponse<BuildingResponse[]>>(
      ENDPOINTS.BUILDING.FETCH_ALL
    );
    return response.data.data;
  }
}

export default new BuildingService();
