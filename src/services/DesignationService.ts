import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { Designation, DesignationModel } from "../types/designation";

class DesignationService {
  async getDesignations(search?: string): Promise<Designation[]> {
    const url = search
      ? ENDPOINTS.DESIGNATION.SEARCH(search)
      : ENDPOINTS.DESIGNATION.FETCH_ALL;

    const response = await apiClient.get<ApiResponse<Designation[]>>(url);
    return response.data.data;
  }

  async createDesignation(designation: DesignationModel): Promise<void> {
    await apiClient.post<ApiResponse<void>>(ENDPOINTS.DESIGNATION.CREATE, {
      designationName: designation.designationName,
    });
  }

  async updateDesignation(designation: DesignationModel): Promise<void> {
    if (!designation.id) {
      throw new Error("Designation ID is required for update");
    }

    await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.DESIGNATION.UPDATE(designation.id),
      { designationName: designation.designationName }
    );
  }
}

export default new DesignationService();
