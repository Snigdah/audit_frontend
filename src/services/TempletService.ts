import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { ReviewDecisionRequest, TemplateDetailResponse, TemplateRequest, TemplateRequestList, TemplateSubmission, TemplateSubmissionDetailResponse, TemplateSubmissionRequest } from "../types/template";

export const TemplateService = {

  async createTemplateRequest(request: TemplateRequest): Promise<ApiResponse<void>>{
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.TEMPLATE.CREATET_REQUEST,
      request
    );
    return response.data;
  },
  
  async fetchTemplateRequests(
  params?: {
      status?: string;
      departmentName?: string;
      equipmentName?: string;
      templateName?: string;
      page?: number;
      size?: number;
    }
    ): Promise<PaginatedData<TemplateRequestList>> {
      const response = await apiClient.get<ApiResponse<PaginatedData<TemplateRequestList>>
      >(ENDPOINTS.TEMPLATE.FETCH_REQUEST_TEMPLET(params));
      return response.data.data;
    },
  
  async fetchTemplateDetails(templateId: number): Promise<
    ApiResponse<TemplateDetailResponse>
  > {
    const response = await apiClient.get<ApiResponse<TemplateDetailResponse>>(
      ENDPOINTS.TEMPLATE.DETAILS(templateId)
    );
    return response.data;
  },

  async fetchTemplateSubmissions(
    templateId: number,
    params?: {
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedData<TemplateSubmission>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedData<TemplateSubmission>>
    >(
      ENDPOINTS.TEMPLATE.FETCH_SUBMISSIONS(templateId, params)
    );

    return response.data.data;
  },

   async reviewTemplateSubmission(
    templateId: number,
    submissionId: number,
    payload: ReviewDecisionRequest
    ): Promise<void> {
      await apiClient.post(
        ENDPOINTS.TEMPLATE.REVIEW_SUBMISSION(templateId, submissionId),
        payload
      );
    },
   
    // ✅ NEW: submit / resubmit template
  async submitTemplate(
      templateId: number,
      payload: TemplateSubmissionRequest
    ): Promise<void> {
      await apiClient.post(
        ENDPOINTS.TEMPLATE.SUBMIT_TEMPLATE(templateId),
        payload
      );
    },
    
  async fetchTemplateSubmissionDetail(
    templateId: number,
    submissionId: number
    ): Promise<TemplateSubmissionDetailResponse> {
      const response = await apiClient.get<
        ApiResponse<TemplateSubmissionDetailResponse>
      >(
        ENDPOINTS.TEMPLATE.SUBMISSION_DETAIL(templateId, submissionId)
      );

      return response.data.data;
    },
};
