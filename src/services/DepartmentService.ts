import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type {
  Department,
  DepartmentDetail,
  DepartmentModel,
} from "../types/department";

class DepartmentService {
  async getDepartments(search?: string): Promise<Department[]> {
    const url = search
      ? ENDPOINTS.DEPARTMENT.SEARCH(search)
      : ENDPOINTS.DEPARTMENT.FETCH_ALL;

    const response = await apiClient.get<ApiResponse<Department[]>>(url);
    return response.data.data;
  }

  async getDepartmentsByFloorId(floorId: number): Promise<Department[]> {
    const url = ENDPOINTS.DEPARTMENT.FETCH_BY_FLOOR_ID(floorId);
    const response = await apiClient.get<ApiResponse<Department[]>>(url);
    return response.data.data;
  }

  async getDepartmentById(id: number): Promise<DepartmentDetail> {
    const url = ENDPOINTS.DEPARTMENT.FETCH_BY_ID(id);
    const response = await apiClient.get<ApiResponse<DepartmentDetail>>(url);
    return response.data.data;
  }

  async createDepartment(department: DepartmentModel): Promise<void> {
    await apiClient.post<ApiResponse<void>>(ENDPOINTS.DEPARTMENT.CREATE, {
      deptName: department.deptName,
      floorId: department.floorId,
    });
  }

  async updateDepartment(department: DepartmentModel): Promise<void> {
    if (!department.id) {
      throw new Error("Department ID is required for update");
    }

    await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.DEPARTMENT.UPDATE(department.id),
      { deptName: department.deptName }
    );
  }

  async deleteDepartment(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(ENDPOINTS.DEPARTMENT.DELETE(id));
  }

  async getAllForDropdown(): Promise<Department[]> {
    const response = await apiClient.get<ApiResponse<Department[]>>(
      ENDPOINTS.DEPARTMENT.DROPDOWN
    );
    return response.data.data;
  }
}

export default new DepartmentService();
