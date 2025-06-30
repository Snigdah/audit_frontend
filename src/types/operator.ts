// Operator Detail Response
export interface OperatorDetail {
  operatorId: number;
  operatorName: string;
  employeeId: string;
  role: string;
  designationId: number;
  designationName: string;
}

// Operator Simple Response
export interface OperatorSimple {
  id: number;
  employeeId: string;
  name: string;
}

export interface UpdateOperatorRequest {
  employeeId: string;
  designationId: number;
  operatorName: string;
}
