import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, PaginatedData } from "../types/api";
import type {
  Department,
  DepartmentDetail,
  DepartmentEquipmentRequest,
  DepartmentModel,
  DepartmentSupervisorRequest,
} from "../types/department";
import type { EquipmentResponse } from "../types/equipment";
import type { SupervisorSimple } from "../types/supervisor";

class DepartmentService {
  // async getDepartments(search?: string): Promise<Department[]> {
  //   const url = search
  //     ? ENDPOINTS.DEPARTMENT.SEARCH(search)
  //     : ENDPOINTS.DEPARTMENT.FETCH_ALL;

  //   const response = await apiClient.get<ApiResponse<Department[]>>(url);
  //   return response.data.data;
  // }

  async getDepartments(
      params?: {
        search?: string;
        page?: number;
        size?: number;
        all?: boolean;
      }
    ): Promise<PaginatedData<Department>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<Department>>
      >(ENDPOINTS.DEPARTMENT.FETCH_ALL(params));
  
      return response.data.data;
    }

  async searchDepartments(query: string): Promise<Department[]> {
    const response = await apiClient.get<ApiResponse<Department[]>>(
      ENDPOINTS.DEPARTMENT.SEARCH_DROP_DOWN(query)
    );
    return response.data.data;
  }

  async getDepartmentsByFloorId(
      floorId: number,
      params?: {
        search?: string;
        page?: number;
        size?: number;
        all?: boolean;
      }
    ): Promise<PaginatedData<Department>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<Department>>
      >(
        ENDPOINTS.DEPARTMENT.FETCH_BY_FLOOR_ID(floorId, params)
      );

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

  // ✅ Assign Supervisor
  async assignSupervisor(
    request: DepartmentSupervisorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.DEPARTMENT.ASSIGN_SUPERVISOR,
      request
    );
    return response.data;
  }

  // ✅ Remove Supervisor
  async removeSupervisor(
    request: DepartmentSupervisorRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.DEPARTMENT.REMOVE_SUPERVISOR,
      request
    );
    return response.data;
  }

  // Fetch Supervisor by Department
    async getSupervisorsByDepartment(
      departmentId: number,
      params?: {
        search?: string;
        page?: number;
        size?: number;
        all?: boolean;
      }
    ): Promise<PaginatedData<SupervisorSimple>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<SupervisorSimple>>
      >(ENDPOINTS.DEPARTMENT.GET_SUPERVISORS({ departmentId, ...params }));

      return response.data.data; 
    }



  // ✅ Assign Equipment
  async assignEquipment(
    request: DepartmentEquipmentRequest
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.DEPARTMENT.ASSIGN_EQUIPMENT,
      request
    );
    return response.data;
  }

  // ✅ Remove Equipment
  async removeEquipment(equipmentId: number): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.DEPARTMENT.REMOVE_EQUIPMENT(equipmentId)
    );
    return response.data;
  }

  // ✅ Fetch Equipment by Department
  async getEquipmentsByDepartment(
    departmentId: number,
      params?: {
        search?: string;
        page?: number;
        size?: number;
        all?: boolean;
      }
    ): Promise<PaginatedData<EquipmentResponse>> {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<EquipmentResponse>>
      >(
        ENDPOINTS.DEPARTMENT.GET_EQUIPMENTS(departmentId, params)
      );

      return response.data.data;
  }

   async getEquipmentsByDepartmentDropdown(
    departmentId: number,
    search?: string
  ): Promise<EquipmentResponse[]> {
    const url = `${ENDPOINTS.DEPARTMENT.DROPDOWN_EQUIPMENTS(departmentId)}${
      search ? `?search=${encodeURIComponent(search)}` : ""
    }`;
    const response = await apiClient.get<ApiResponse<EquipmentResponse[]>>(url);
    return response.data.data;
  }
}

export default new DepartmentService();
