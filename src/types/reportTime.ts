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

/** Display-only status for upcoming slots (derived on frontend) */
export type SlotDisplayStatus = ExpectedSubmissionStatus | "INCOMING";

export interface ExpectedSlotStatusResponse {
  expectedSubmissionId: number | null;
  time: string; // HH:mm:ss
  status: ExpectedSubmissionStatus;
}
