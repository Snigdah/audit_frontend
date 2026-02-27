import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { OperatorSimple } from "../types/operator";
import type {
  AssignReportOperatorRequest,
  TemplateReportResponse,
} from "../types/report";
import type { ReportStructureResponse } from "../types/reportSubmission";
import OperatorService from "./OperatorService";

export const ReportService = {

  async fetchAllReports(
      params?: {
        status?: string;
        departmentName?: string;
        equipmentName?: string;
        templateName?: string;
        page?: number;
        size?: number;
      }
    ): Promise<PaginatedData<TemplateReportResponse>> {
      const response = await apiClient.get<ApiResponse<PaginatedData<TemplateReportResponse>>>(ENDPOINTS.REPORT.FETCH_ALL(params));
    return response.data.data;
  },


  async assignOperator(
    reportId: number,
    payload: AssignReportOperatorRequest
  ): Promise<void> {
    await apiClient.post(
      ENDPOINTS.REPORT.ASSIGN_OPERATOR(reportId),
      payload
    );
  },

  async removeOperator(
    reportId: number,
    operatorId: number
  ): Promise<void> {
    await apiClient.delete(
      ENDPOINTS.REPORT.REMOVE_OPERATOR(reportId, operatorId)
    );
  },

  async fetchOperatorsByReport(
    reportId: number,
    params?: {
      search?: string;
      page?: number;
      size?: number;
      all?: boolean;
    }
  ): Promise<PaginatedData<OperatorSimple>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedData<OperatorSimple>>
    >(ENDPOINTS.REPORT.FETCH_OPERATORS(reportId, params));

    return response.data.data;
  },

  async fetchReport(reportId: number): Promise<ReportStructureResponse> {
    const response = await apiClient.get<
      ApiResponse<ReportStructureResponse>
    >(ENDPOINTS.REPORT.FETCH_STRUCTURE(reportId));

    return response.data.data;
  },

  async fetchReportDetails(reportId: number): Promise<TemplateReportResponse> {
    const response = await apiClient.get<
      ApiResponse<TemplateReportResponse>
    >(ENDPOINTS.REPORT.FETCH_BY_ID(reportId));

    return response.data.data;
  },

};
