export interface TemplateMetaForm {
  templateName: string;
  description?: string;
  departmentId: number;
  equipmentId: number;
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

