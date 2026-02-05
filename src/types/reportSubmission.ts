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
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
  versionId?: number;
}