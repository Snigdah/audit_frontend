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
import SuperVisorDetails from "./pages/resource/SupervisorDetailsPage";
import OperatorPage from "./pages/resource/OperatorPage";
import OperatorDetailsPage from "./pages/resource/OperatorDetailsPage";
import EquipmentTopPage from "./pages/infrastructure/EquipmentTopPage";
import EquipmentDetailsPage from "./pages/infrastructure/EquipmentDetailsPage";
import DepartmentDetailsPage from "./pages/infrastructure/DepartmentDetailsPage";
import ProfilePage from "./pages/user/ProfilePage";

// ADD THESE
import { WebSocketProvider } from "./context/WebSocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationsPage from "./pages/notification/NotificationsPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import EmailSettingsPage from "./pages/settings/EmailSettingsPage";
import ViewerPage from "./pages/resource/ViewerPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import TemplatePage from "./pages/templet/TemplateRequestPage";
import CreateTemplate from "./components/templets/CreateTemplate";
import TemplateRequestPage from "./pages/templet/TemplateRequestPage";
import TemplatRequestDetails from "./pages/templet/TemplatRequestDetails";
import TemplateSubmissionDetailsPage from "./pages/templet/TemplateSubmissionDetailsPage";
import ReportPage from "./pages/templet/ReportsPage";
import ReportDetails from "./pages/templet/ReportDetails";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <NotificationProvider>
          <WebSocketProvider>
            <ToastContainer />
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authenticated user routes */}
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
                    path="/infrastructure/department/:departmentId"
                    element={<DepartmentDetailsPage />}
                  />
                  <Route
                    path="/infrastructure/equipment"
                    element={<EquipmentTopPage />}
                  />
                  <Route
                    path="/infrastructure/equipment/:equipmentId"
                    element={<EquipmentDetailsPage />}
                  />
                  <Route
                    path="/infrastructure/building/:buildingId"
                    element={<FloorsPage />}
                  />
                  <Route
                    path="/infrastructure/building/:buildingId/floor/:floorId"
                    element={<DepartmentsPage />}
                  />

                  {/* ======================= Resource ======================== */}
                  <Route
                    path="/resource/supervisor"
                    element={<SupervisorPage />}
                  />
                  <Route
                    path="/resource/supervisor/:supervisorId"
                    element={<SuperVisorDetails />}
                  />

                  <Route path="/resource/operator" element={<OperatorPage />} />
                  <Route
                    path="/resource/operator/:operatorId"
                    element={<OperatorDetailsPage />}
                  />

                  <Route
                    path="/resource/viewer"
                    element={<ViewerPage />}
                  />

                  <Route
                    path="/user/notifications"
                    element={<NotificationsPage />}
                  />

                  {/* ======================= Templet ======================== */}
                  <Route path="/report/template" element={<TemplateRequestPage />} />
                  <Route path="/report/reports" element={<ReportPage />} />
                  <Route
                    path="/report/reports/:reportId"
                    element={<ReportDetails />}
                  />

                  <Route
                    path="/report/template/:templateRequestId"
                    element={<TemplatRequestDetails />}
                  />
                  <Route
                    path="/report/template/:templateRequestId/submissions/:submissionId"
                    element={<TemplateSubmissionDetailsPage />}
                  />
                  <Route path="/report/template/create" element={<CreateTemplate />} />

                  {/* ======================= Settings ======================== */}
                  <Route path="/user/profile" element={<ProfilePage />} />

                  <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                    <Route
                      path="/system/password-policy"
                      element={<PasswordPolicyPage />}
                    />

                    <Route
                      path="/system/email-settings"
                      element={<EmailSettingsPage />}
                    />

                    <Route
                      path="/system/designation"
                      element={<DesignationPage />}
                    />

                    <Route
                      path="/user/profiles"
                      element={<UserProfilePage />}
                    />
                  </Route>

                  {/* Routes that require specific roles */}
                  <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
                    {/* Future MANAGER-only routes */}
                  </Route>
                </Route>
              </Routes>
            </Layout>
          </WebSocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
