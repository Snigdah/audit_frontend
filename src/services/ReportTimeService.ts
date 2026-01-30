import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type {
  AddReportTimeSlotRequest,
  ReportTimeResponse,
} from "../types/reportTime";

export const ReportTimeService = {

  async addTimeSlot(
    reportId: number,
    payload: AddReportTimeSlotRequest
  ): Promise<void> {
    await apiClient.post(
      ENDPOINTS.REPORT_TIME.ADD_TIME_SLOT(reportId),
      payload
    );
  },

  async fetchTimeSlots(
    reportId: number
  ): Promise<ReportTimeResponse[]> {
    const response = await apiClient.get<ApiResponse<ReportTimeResponse[]>>(
      ENDPOINTS.REPORT_TIME.FETCH_TIME_SLOTS(reportId)
    );

    return response.data.data;
  },

  async deleteTimeSlot(
    reportId: number,
    timeSlotId: number,
    isAppliedFromToday?: boolean
  ): Promise<void> {
    await apiClient.delete(
      ENDPOINTS.REPORT_TIME.DELETE_TIME_SLOT(
        reportId,
        timeSlotId,
        isAppliedFromToday
      )
    );
  },
};
