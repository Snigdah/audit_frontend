// Layout.tsx with authentication-aware sidebar and footer
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { authState, isLoading } = useAuth();
  const location = useLocation();

  // Determine if we're on an auth page (login, register, etc.)
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/unauthorized";

  // Detect dashboard page for special coloring
  const isDashboard = location.pathname === "/dashboard";
  const login = location.pathname === "/login";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if we should show the sidebar
  const showSidebar = authState.isAuthenticated && !isAuthPage && !isLoading;
  
  // Determine if we should show the footer
  const showFooter = !isAuthPage;

  return (
    <div
      className={`flex h-screen transition-colors duration-300 
      ${isDashboard || login ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Only render sidebar if authenticated and not on an auth page */}
      {showSidebar && <Sidebar onCollapseChange={setCollapsed} />}

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobile || !showSidebar ? "ml-0" : collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <main className="flex-1 overflow-y-auto p-2 sm:p-2 lg:p-2">
          {children}
        </main>

        {/* Only render footer if not on auth pages */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;