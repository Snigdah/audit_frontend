export interface DepartmentInfo {
  id: number;
  name: string;
}

export interface ProfileBasic {
  id: number;
  employeeId: string;
  name: string;
  designation: string;
  role: string;
  isActive: boolean;
}

export interface ProfileDetail extends ProfileBasic {
  departments: DepartmentInfo[] | null;
}
