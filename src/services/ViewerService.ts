import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { ViewerSimple } from "../types/viewer";

class ViewerService {

    async getAllViewers(search?: string): Promise<ViewerSimple[]> {
        const response = await apiClient.get<ApiResponse<ViewerSimple[]>>(
          ENDPOINTS.VIEWER.FETCH_ALL(search)
        );
        return response.data.data;
      }
}

export default new ViewerService();