export interface AddReportTimeSlotRequest {
  time: string; // LocalTime -> "HH:mm:ss"
  isAppliedFromToday?: boolean;
}

export interface ReportTimeResponse {
  id: number;
  time: string; // "HH:mm:ss"
}

export type ExpectedSubmissionStatus =
  | "PENDING"
  | "ALL_REJECTED"
  | "NO_SUBMISSION"
  | "APPROVED";

export interface ExpectedSlotStatusResponse {
  expectedSubmissionId: number | null;
  time: string; // HH:mm:ss
  status: ExpectedSubmissionStatus;
}
