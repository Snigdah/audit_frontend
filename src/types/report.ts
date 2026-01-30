export const ReportStatusEnum = {
  Active: "Active",
  Inactive: "Inactive",
} as const;

export type ReportStatusEnum =
  (typeof ReportStatusEnum)[keyof typeof ReportStatusEnum];

export interface TemplateReportResponse {
  templateId: number;
  templateName: string;
  description: string;
  departmentName: string;
  equipmentName: string;
  status: ReportStatusEnum;
}