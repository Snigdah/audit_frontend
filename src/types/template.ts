export interface TemplateMetaForm {
  templateName: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  equipmentId: number;
  equipmentName?: string;
}

export type MergeCellDto = {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
};

export type TemplateStructureRequest = {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
};

export type TemplateRequest = {
  templateName: string;
  description?: string;
  departmentId: number;
  equipmentId: number;
  templateStructureRequest: TemplateStructureRequest;
};

export type TemplateStatus = "PENDING" | "APPROVED" | "REJECTED";

export type TemplateRequestList = {
  templateId: number;
  templateName: string;
  description: string;
  departmentId: number;
  departmentName: string;
  equipmentId: number;
  equipmentName: string;
  status: TemplateStatus;
};

export interface TemplateDetailResponse {
  id: number;
  templateName: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  equipmentId: number;
  equipmentName?: string;
  status: TemplateStatus;
  latestSubmissionId?: number;
  latestSubmission?: TemplateStructureRequest;
}

export interface TemplateSubmission {
  submissionId: number;
  status: TemplateStatus;
  reviewComment?: string | null;
  reviewerEmpId?: number | null;
  createdAt: string;
}

export interface ReviewDecisionRequest {
  status: TemplateStatus;
  reviewComment: string;
}