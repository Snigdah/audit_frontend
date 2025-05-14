import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
}) => {
  const { authState, isLoading } = useAuth(); // Get isLoading from auth context
  const location = useLocation();

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <div>Loading...</div>; // You can replace with a proper loading component
  }

  // Check if user is authenticated
  if (!authState.isAuthenticated) {
    // Redirect to login page but save current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (
    allowedRoles.length > 0 &&
    authState.role &&
    !allowedRoles.includes(authState.role)
  ) {
    // User doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role (if any)
  return <Outlet />;
};
