import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type {
  ProfileDetail,
  ProfileBasic,
  DepartmentInfo,
} from "../types/profile";

class ProfileService {
  /**
   * Fetch full profile details including departments and role info
   */
  async getFullProfile(): Promise<ProfileDetail> {
    const response = await apiClient.get<ApiResponse<ProfileDetail>>(
      ENDPOINTS.PROFILE.FETCH_FULL
    );
    return response.data.data;
  }

  /**
   * Fetch basic profile details (name, email, designation, etc.)
   */
  async getBasicProfile(): Promise<ProfileBasic> {
    const response = await apiClient.get<ApiResponse<ProfileBasic>>(
      ENDPOINTS.PROFILE.FETCH_BASIC
    );
    return response.data.data;
  }

  /**
   * Fetch only user's departments
   */
  async getDepartments(): Promise<DepartmentInfo[]> {
    const response = await apiClient.get<ApiResponse<DepartmentInfo[]>>(
      ENDPOINTS.PROFILE.FETCH_DEPARTMENT
    );

    // Ensure null-safe response
    return response.data.data ?? [];
  }
}

export default new ProfileService();
