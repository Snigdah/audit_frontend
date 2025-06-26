// AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { AuthState } from "../types/auth";
import AuthService from "../services/AuthService";
import { toast } from "../components/common/Toast";

interface AuthContextProps {
  authState: AuthState;
  isLoading: boolean; // Add loading state
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    employeeId: null,
    role: null,
  });

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getAccessToken();
        const employeeId = AuthService.getEmployeeId();
        const role = AuthService.getUserRole();

        setAuthState({
          isAuthenticated: !!token,
          employeeId: employeeId,
          role: role,
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    initializeAuth();
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

      toast.success("Login successful!");

      // Navigate to the saved location or default to home
      const origin = "/dashboard";
      navigate(origin, { replace: true });
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Failed to load buildings"
      );
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
    <AuthContext.Provider value={{ authState, isLoading, login, logout }}>
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
