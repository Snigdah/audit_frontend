export interface LoginRequest {
  employeeId: string;
  password: string;
  screenResolution: string;
}

export interface LoginResponse {
  accessToken: string;
  employeeId: string;
  role: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  employeeId: string | null;
  role: string | null;
}
