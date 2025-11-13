import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { TOKEN_KEY, USER_ID_KEY, USER_ROLE_KEY } from "../constants/config";
import type { ApiResponse } from "../types/api";
import type {
  ChangePassword,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshResponse,
} from "../types/auth";

class AuthService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );

    const data = response.data.data;

    // Store auth data in localStorage
    this.setAccessToken(data.accessToken);
    this.setUserRole(data.role);
    this.setEmployeeId(data.employeeId);

    return data;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<TokenRefreshResponse>>(
        ENDPOINTS.AUTH.REFRESH_TOKEN
      );

      const { accessToken } = response.data.data;
      this.setAccessToken(accessToken);

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.get(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage and cookies on logout
      this.clearAuthData();
    }
  }

  async register(payload: RegisterRequest): Promise<void> {
    await apiClient.post<ApiResponse<void>>(ENDPOINTS.AUTH.REGISTER, payload);
  }

  async changePassword(payload: ChangePassword): Promise<void>{
    await apiClient.put<ApiResponse<void>>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserRole(): string | null {
    return localStorage.getItem(USER_ROLE_KEY);
  }

  getEmployeeId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private setUserRole(role: string): void {
    localStorage.setItem(USER_ROLE_KEY, role);
  }

  private setEmployeeId(id: string): void {
    localStorage.setItem(USER_ID_KEY, id);
  }

  clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);

    // Clear the HTTP-only refresh token cookie
    // Even though we can't directly manipulate HTTP-only cookies from JS,
    // the backend will clear it when the logout endpoint is called
  }
}

export default new AuthService();
