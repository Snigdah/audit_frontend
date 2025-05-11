import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { LoginRequest, LoginResponse } from "../types/auth";

class AuthService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return response.data.data;
  }
}

export default new AuthService();
