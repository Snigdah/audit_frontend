import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { PasswordPolicyModel } from "../types/PasswordPolicy";

class PasswordPolicyService {
  async createPasswordPolicy(
    policy: PasswordPolicyModel
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.PASSWORD_POLICY.CREATE,
      policy.toRequest()
    );
    return response.data;
  }

  async getPasswordPolicy(): Promise<ApiResponse<PasswordPolicyModel>> {
    const response = await apiClient.get<ApiResponse<PasswordPolicyModel>>(
      ENDPOINTS.PASSWORD_POLICY.FETCH
    );
    return response.data;
  }
}

export default new PasswordPolicyService();
