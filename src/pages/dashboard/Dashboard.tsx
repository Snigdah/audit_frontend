import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../types/sidebar";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import SupervisorDashboard from "../../components/dashboard/SupervisorDashboard";
import OperatorDashboard from "../../components/dashboard/OperatorDashboard";
import ReadOnlyUserDashboard from "../../components/dashboard/ReadOnlyUserDashboard";

const Dashboard = () => {
  const { authState } = useAuth();
  const role = authState.role as Role | null;

  const content = (() => {
    switch (role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "SUPERVISOR":
        return <SupervisorDashboard />;
      case "OPERATOR":
        return <OperatorDashboard />;
      case "READ_ONLY_USER":
        return <ReadOnlyUserDashboard />;
      default:
        return <h1>here is dashboard</h1>;
    }
  })();

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm p-4">
      {content}
    </div>
  );
};

export default Dashboard;
