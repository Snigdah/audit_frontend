import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { AuthState } from "../types/auth";
import AuthService from "../services/AuthService";
import { toast } from "../components/common/Toast";

interface AuthContextProps {
  authState: AuthState;
  isLoading: boolean;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: () => Promise<void>; // admin OTP send
  verifyOtp: (otp: string) => Promise<void>; // verify OTP and login
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    employeeId: null,
    role: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getAccessToken();
        const employeeId = AuthService.getEmployeeId();
        const role = AuthService.getUserRole();

        setAuthState({
          isAuthenticated: !!token,
          employeeId,
          role,
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Normal login
  const login = async (employeeId: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const response = await AuthService.login({ employeeId, password, screenResolution });

      setAuthState({
        isAuthenticated: true,
        employeeId: response.employeeId,
        role: response.role,
      });

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.devMessage || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } finally {
      setAuthState({ isAuthenticated: false, employeeId: null, role: null });
      navigate("/login");
    }
  };

  // Forgot password (admin only)
  const forgotPassword = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.sendAdminOtp(); // new API call
      toast.success("OTP sent to admin email");
    } catch (error: any) {
      toast.error(error.response?.data?.devMessage || "Failed to send OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and login admin automatically
  const verifyOtp = async (otp: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.verifyAdminOtp(otp);

      // Set auth state same as normal login
      setAuthState({
        isAuthenticated: true,
        employeeId: response.employeeId,
        role: response.role,
      });

      toast.success("OTP verified, logged in!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.devMessage || "Invalid OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, isLoading, login, logout, forgotPassword, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
