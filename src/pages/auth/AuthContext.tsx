import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { AuthState } from "../../types/auth";
import AuthService from "../../services/AuthService";
interface AuthContextProps {
  authState: AuthState;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    employeeId: null,
    role: null,
  });

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const token = AuthService.getAccessToken();
    const employeeId = AuthService.getEmployeeId();
    const role = AuthService.getUserRole();

    setAuthState({
      isAuthenticated: !!token,
      employeeId: employeeId,
      role: role,
    });
  }, []);

  const login = async (employeeId: string, password: string): Promise<void> => {
    try {
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const response = await AuthService.login({
        employeeId,
        password,
        screenResolution,
      });

      setAuthState({
        isAuthenticated: true,
        employeeId: response.employeeId,
        role: response.role,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always reset auth state and redirect to login
      setAuthState({
        isAuthenticated: false,
        employeeId: null,
        role: null,
      });
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
