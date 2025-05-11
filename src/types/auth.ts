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
