export type SubmissionStatus =
  | "REJECTED"
  | "APPROVED"
  | "PENDING"
  | "NO_APPROVAL";

export interface ReportSubmissionSimpleResponse {
  reportId: number;
  submissionId: number;
  status: SubmissionStatus;
  reviewComment?: string | null;
  reviewerName?: string | null;
  creatorName: string;
  submittedAt: string;
  lateMinutes?: number | null;
  expectedSubmissionId: number;
}

export interface MergeCellDto {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
}

export interface TemplateStructureRequest {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
}

// Response shape for report structure fetch API
export interface ReportStructureResponse {
  structure: TemplateStructureRequest;
  versionId: number;
}

export interface CellChangeRequest {
  rowIndex: number;
  colIndex: number;
  cellAddress: string;

  oldValue: unknown;
  newValue: unknown;

  changedBy: string;
  changedAt: string; // ISO datetime
}

export interface ReportSubmissionRequest {
  templateStructure: TemplateStructureRequest;
  changes: CellChangeRequest[];
}

/** Response for GET submission detail (structure for create/resubmit). */
export interface ReportSubmissionDetailResponse {
  submissionId: number;
  status: SubmissionStatus;

  creatorId: number;
  creatorName: string;

  reviewerId?: number | null;
  reviewerName?: string | null;

  departmentId: number;
  departmentName: string;

  equipmentId: number;
  equipmentName: string;

  reviewComments?: string | null;

  data: TemplateStructureRequest;

  changes: CellChangeRequest[];

  submittedAt: string;
  lateMinutes?: number | null;

  expectedSubmissionId: number;
}

export interface ReviewDecisionRequest {
  status: "APPROVED" | "REJECTED";
  reviewComment?: string;
}

export type UserRole =
  | "ADMIN"
  | "SUPERVISOR"
  | "OPERATOR";

export interface ReportSubmissionHistoryResponse {
  reportId: number;
  versionId: number;
  submissionId: number;
  status: SubmissionStatus;
  reviewComment?: string | null;
  reviewerName?: string | null;
  creatorName: string;
  submittedAt: string;
  lateMinutes?: number | null;
  expectedSubmissionId: number;
}