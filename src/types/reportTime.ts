export interface AddReportTimeSlotRequest {
  time: string; // LocalTime -> "HH:mm:ss"
  isAppliedFromToday?: boolean;
}

export interface ReportTimeResponse {
  id: number;
  time: string; // "HH:mm:ss"
}
