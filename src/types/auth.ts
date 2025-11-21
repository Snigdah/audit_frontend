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

export interface RegisterRequest {
  employeeId: string;
  userName: string;
  password: string;
  designation: number;
  role: string;
}

export interface ChangePassword{
  employeeId: string;
  oldPassword: string;
  newPassword: string;
}

export interface DeleteUser{
  id: number;
  role: string;
}
