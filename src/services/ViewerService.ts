import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { ViewerSimple } from "../types/viewer";

class ViewerService {
      
    async getAllViewers(
        params?: {
          search?: string;
          page?: number;
          size?: number;
          all?: boolean;
        }
      ): Promise<PaginatedData<ViewerSimple>> {
        const response = await apiClient.get<
          ApiResponse<PaginatedData<ViewerSimple>>
        >(ENDPOINTS.VIEWER.FETCH_ALL(params));
    
        return response.data.data;
      }
}

export default new ViewerService();