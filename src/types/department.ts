// API Response - Simple list
export interface Department {
  id: number;
  name: string;
}

// API Response - Detailed view
export interface DepartmentDetail {
  departmentId: number;
  departmentName: string;
  totalSupervisors: number;
  totalEquipments: number;
}

// For form submission
export interface DepartmentFormData {
  deptName: string;
  floorId: number;
}

export interface DepartmentEquipmentRequest {
  departmentId: number;
  equipmentId: number;
}

export interface DepartmentSupervisorRequest {
  departmentId: number;
  supervisorId: number;
}

// For handling in component/service layer
export class DepartmentModel {
  deptName: string;
  floorId: number;
  id?: number;

  constructor(deptName: string, floorId: number, id?: number) {
    this.deptName = deptName;
    this.floorId = floorId;
    this.id = id;
  }
}
