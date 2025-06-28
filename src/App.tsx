import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import BuildingsPage from "./pages/infrastructure/BuildingPage";
import FloorsPage from "./pages/infrastructure/FloorsPage ";
import { AuthProvider } from "./context/AuthContext";
import Unauthorized from "./components/Unauthorized";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PasswordPolicyPage from "./pages/settings/PasswordPolicyPage";
import DesignationPage from "./pages/settings/DesignationPage";
import DepartmentsPage from "./pages/infrastructure/DepartmentPage";
import ScrollToTop from "./components/common/ScrollToTop";
import DepartmentTopPage from "./pages/infrastructure/DepartmentTopPage";
import { ToastContainer } from "./components/common/Toast";
import SupervisorPage from "./pages/resource/SupervisorPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastContainer />
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* ======================= Infrastructure ======================== */}
              <Route
                path="/infrastructure/building"
                element={<BuildingsPage />}
              />
              <Route
                path="/infrastructure/department"
                element={<DepartmentTopPage />}
              />
              <Route
                path="/infrastructure/building/:buildingId"
                element={<FloorsPage />}
              />
              <Route
                path="/infrastructure/building/:buildingId/floor/:floorId"
                element={<DepartmentsPage />}
              />

              {/* ======================= Settings ======================== */}
              <Route path="/resource/supervisor" element={<SupervisorPage />} />

              {/* ======================= Settings ======================== */}
              <Route
                path="/system/password-policy"
                element={<PasswordPolicyPage />}
              />

              <Route path="/system/designation" element={<DesignationPage />} />

              {/* Routes that require specific roles */}
              <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
                {/* <Route path="/infrastructure/floor" element={<FloorsPage />} /> */}
              </Route>

              {/* Add more routes as needed */}
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
