import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type {
  ReportSubmissionDetailResponse,
  ReportSubmissionHistoryResponse,
  ReportSubmissionRequest,
  ReportSubmissionSimpleResponse,
  ReviewDecisionRequest,
  SubmissionStatus,
  UserRole,
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

  async getSubmissionDetail(submissionId: number): Promise<ReportSubmissionDetailResponse | null> {
    try {
      const response = await apiClient.get<
        ApiResponse<ReportSubmissionDetailResponse>
      >(ENDPOINTS.REPORT_SUBMISSION.GET_SUBMISSION_DETAIL(submissionId));

      return response.data.data;
    } catch {
      return null;
    }
  },

  async reviewSubmission(
    reportId: number,
    submissionId: number,
    payload: ReviewDecisionRequest
  ): Promise<void> {
    await apiClient.post(
      ENDPOINTS.REPORT_SUBMISSION.REVIEW_SUBMISSION(reportId, submissionId),
      payload
    );
  },

  async fetchStructureChangeSubmissions(
      reportId: number,
      params?: {
        all?: boolean;
        page?: number;
        size?: number;
      }
    ): Promise<PaginatedData<ReportSubmissionSimpleResponse>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<ReportSubmissionSimpleResponse>>
      >(
        ENDPOINTS.REPORT_SUBMISSION.STRUCTURE_CHANGE_SUBMISSIONS_LIST(
          reportId,
          params
        )
      );

      return response.data.data;
    },

  async approveSupervisorStructureChange(
      reportId: number,
      submissionId: number,
      payload: ReviewDecisionRequest
    ): Promise<void> {
      await apiClient.post(
        ENDPOINTS.REPORT_SUBMISSION.APPROVE_SUPERVISOR_STRUCTURE_CHANGE(
          reportId,
          submissionId
        ),
      payload
    );
  },
  

  async changeSupervisorStructure(reportId: number, payload: ReportSubmissionRequest
    ): Promise<void> {
      await apiClient.post(
        ENDPOINTS.REPORT_SUBMISSION.SUPERVISOR_STRUCTURE_CHANGE(reportId),
        payload
      );
    },

  async fetchSubmissionHistory(
    reportId: number,
    params?: {
      startDate?: string;
      endDate?: string;
      status?: SubmissionStatus;
      late?: boolean;
      role?: UserRole;
      all?: boolean;
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedData<ReportSubmissionHistoryResponse>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedData<ReportSubmissionHistoryResponse>>
    >(
      ENDPOINTS.REPORT_SUBMISSION.FETCH_HISTORY(reportId, params)
    );

    return response.data.data;
  },
};
