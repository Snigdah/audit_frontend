import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { TemplateRequest } from "../types/template";

export const TemplateService = {

  async createTemplateRequest(request: TemplateRequest): Promise<ApiResponse<void>>{
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.TEMPLET.CREATET_REQUEST,
      request
    );
    return response.data;
  },
  
};
