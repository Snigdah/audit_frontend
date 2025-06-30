// Supervisor Detail Response
export interface SupervisorDetail {
  supervisorId: number;
  supervisorName: string;
  employeeId: string;
  role: string;
  designationId: number;
  designationName: string;
}

// Supervisor Simple Response
export interface SupervisorSimple {
  id: number;
  employeeId: string;
  name: string;
}

export interface UpdateSupervisorRequest {
  employeeId: string;
  designationId: number;
  supervisorName: string;
}
