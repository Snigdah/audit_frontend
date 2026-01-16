import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { TemplateRequest, TemplateRequestList } from "../types/template";

export const TemplateService = {

  async createTemplateRequest(request: TemplateRequest): Promise<ApiResponse<void>>{
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.TEMPLATE.CREATET_REQUEST,
      request
    );
    return response.data;
  },
  
  async fetchTemplateRequests(): Promise<
    ApiResponse<TemplateRequestList[]>
  > {
    const response = await apiClient.get<ApiResponse<TemplateRequestList[]>>(
      ENDPOINTS.TEMPLATE.FETCH_REQUEST_TEMPLET
    );

    return response.data;
  },
  
};
