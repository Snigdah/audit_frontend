export const ReportStatusEnum = {
  Active: "Active",
  Inactive: "Inactive",
} as const;

export type ReportStatusEnum =
  (typeof ReportStatusEnum)[keyof typeof ReportStatusEnum];

export interface TemplateReportResponse {
  templateId: number;
  templateName: string;
  templateVersionId?: number;
  description: string;
  departmentName: string;
  equipmentName: string;
  status: ReportStatusEnum;
}

export interface AssignReportOperatorRequest {
  operatorId: number;
}

export interface MergeCellDto {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
}

export interface TemplateStructure {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
}

export interface ReportStructureResponse {
  structure: TemplateStructure;
  versionId: number;
}

/** Response for GET report details (report detail page / overview). */
export interface ReportDetailResponse {
  reportId: number;
  reportName: string;
  reportVersionId: number;
  description?: string | null;
  departmentId: number;
  departmentName: string;
  equipmentId: number;
  equipmentName: string;
  supervisorId: number;
  supervisorName: string;
  data: TemplateStructure;
  createdAt: string;
}