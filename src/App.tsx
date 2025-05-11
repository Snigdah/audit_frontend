import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Stock from "./pages/inventory/Stock";
import { LoginPage } from "./pages/auth/LoginPage";
import BuildingsPage from "./pages/infrastructure/BuildingsPage";
import FloorsPage from "./pages/infrastructure/FloorsPage ";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory/stock" element={<Stock />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/infrastructure/building" element={<BuildingsPage />} />
          <Route
            path="/buildings/:buildingId/floors"
            element={<FloorsPage />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
