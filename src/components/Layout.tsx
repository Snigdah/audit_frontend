import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onCollapseChange={setCollapsed} />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header with app name, only shown when sidebar is collapsed on desktop */}
        {/* {collapsed && !isMobile && (
          <header className="bg-white shadow-sm py-4 px-6">
            <h1 className="text-xl font-semibold text-gray-800">ERP System</h1>
          </header>
        )} */}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
