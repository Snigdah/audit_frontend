import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { TemplateReportResponse } from "../types/report";

export const ReportService = {

  async fetchAllReports(): Promise<TemplateReportResponse[]> {
    const response = await apiClient.get<ApiResponse<TemplateReportResponse[]>>(
      ENDPOINTS.REPORT.FETCH_ALL
    );

    return response.data.data;
  },

};
