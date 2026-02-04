import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type {
  ReportSubmissionDetailResponse,
  ReportSubmissionRequest,
  ReportSubmissionSimpleResponse,
} from "../types/reportSubmission";

export const ReportSubmissionService = {

    
  async fetchByExpectedSubmission(
    expectedSubmissionId: number,
    params?: {
      all?: boolean;
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedData<ReportSubmissionSimpleResponse>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedData<ReportSubmissionSimpleResponse>>
    >(
      ENDPOINTS.REPORT_SUBMISSION.FETCH_SUBMISSION(
        expectedSubmissionId,
        params
      )
    );

    return response.data.data;
  },

  async createSubmission(
    reportId: number,
    versionId: number,
    expectedSubmissionId: number,
    payload: ReportSubmissionRequest
  ): Promise<number> {
    const response = await apiClient.post<ApiResponse<number>>(
      ENDPOINTS.REPORT_SUBMISSION.CREATE_SUBMISSION(
        reportId,
        versionId,
        expectedSubmissionId
      ),
      payload
    );

    return response.data.data;
  },

  async getSubmissionDetail(
    expectedSubmissionId: number,
    submissionId: number
  ): Promise<ReportSubmissionDetailResponse | null> {
    try {
      const response = await apiClient.get<
        ApiResponse<ReportSubmissionDetailResponse>
      >(
        ENDPOINTS.REPORT_SUBMISSION.GET_SUBMISSION_DETAIL(
          expectedSubmissionId,
          submissionId
        )
      );
      return response.data.data;
    } catch {
      return null;
    }
  },
};
