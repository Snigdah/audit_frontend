import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import sidebarData from "../data/sidebarData";
import type { SidebarItem, SubMenuItem, Role } from "../types/sidebar";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { authState, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    if (onCollapseChange) {
      onCollapseChange(newValue);
    }
  };

  const toggleSidebar = () => setSidebar(!sidebar);

  const toggleSubMenu = (title: string) => {
    if (openSubMenu === title) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(title);
    }
  };

  const handleSubMenuClick = (
    e: React.MouseEvent<HTMLDivElement>,
    item: SidebarItem
  ) => {
    if (item.subMenu) {
      e.preventDefault();
      toggleSubMenu(item.title);
    }
  };

  const handleSubMenuItemClick = () => {
    if (isMobile) {
      setSidebar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (isMobile) {
        setSidebar(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check if user has access to a menu item based on roles
  const hasAccess = (requiredRoles?: Role[]) => {
    // If no roles are required, everyone can access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // If authentication is required but user is not authenticated
    if (!authState.isAuthenticated || !authState.role) {
      return false;
    }

    // Check if user's role is in the required roles list
    return requiredRoles.includes(authState.role as Role);
  };

  // Filter sidebar data based on user role
  const filteredSidebarData = sidebarData.filter((item) =>
    hasAccess(item.access)
  );

  const renderSubMenu = (subMenu: SubMenuItem[], itemTitle: string) => {
    if (openSubMenu !== itemTitle || collapsed) return null;

    // Filter submenu items based on user role
    const filteredSubMenu = subMenu.filter((subItem) =>
      hasAccess(subItem.access)
    );

    return (
      <ul className="pl-4 py-1 bg-gray-800">
        {filteredSubMenu.map((subItem, index) => (
          <li key={index} className="py-2">
            <Link
              to={subItem.path}
              className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
              onClick={handleSubMenuItemClick}
            >
              {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
              <span className="text-sm">{subItem.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sidebar-container">
      {/* Main sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out ${
          sidebar
            ? "translate-x-0"
            : isMobile
            ? "-translate-x-full"
            : "translate-x-0"
        } ${
          collapsed && !isMobile ? "w-16" : "w-64"
        } bg-gray-900 shadow-lg overflow-hidden`}
      >
        {/* Collapse toggle button - only visible on desktop */}
        <div
          className={`absolute top-4 -right-[-6px] z-50 ${
            isMobile ? "hidden" : "block"
          }`}
        >
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 shadow-md hover:bg-white transition-all"
          >
            {collapsed ? (
              <MdChevronRight size={16} />
            ) : (
              <MdChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* Logo/Name header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-800">
          {!collapsed && (
            <span className="text-white font-semibold text-lg">ERP System</span>
          )}
          {isMobile && (
            <button
              className="text-gray-300 hover:text-white"
              onClick={toggleSidebar}
            >
              <FaTimes className="text-xl" />
            </button>
          )}
        </div>

        <div className="flex flex-col h-full justify-between overflow-y-auto">
          <nav className="py-4 flex-1">
            <ul className="space-y-1">
              {filteredSidebarData.map((item, index) => {
                // Skip rendering items that the user doesn't have access to
                if (!hasAccess(item.access)) return null;

                // Check if the item has submenu and if user has access to any submenu item
                const hasAccessibleSubmenu = item.subMenu
                  ? item.subMenu.some((subItem) => hasAccess(subItem.access))
                  : true;

                // Skip items with submenu if the user doesn't have access to any submenu item
                if (item.subMenu && !hasAccessibleSubmenu) return null;

                return (
                  <li key={index}>
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleSubMenuClick(e, item)}
                    >
                      <Link
                        to={item.subMenu ? "#" : item.path}
                        className={`flex items-center justify-between text-gray-300 hover:text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-all ${
                          collapsed ? "justify-center px-3" : ""
                        }`}
                        onClick={() => {
                          if (!item.subMenu && isMobile) {
                            setSidebar(false);
                          }
                        }}
                      >
                        <div
                          className={`flex items-center ${
                            collapsed ? "justify-center" : ""
                          }`}
                        >
                          <span className={collapsed ? "" : "mr-3"}>
                            {item.icon}
                          </span>
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                        {item.subMenu && !collapsed && (
                          <span>
                            {openSubMenu === item.title ? (
                              <MdKeyboardArrowDown className="text-lg" />
                            ) : (
                              <MdKeyboardArrowRight className="text-lg" />
                            )}
                          </span>
                        )}
                      </Link>
                    </div>
                    {item.subMenu && renderSubMenu(item.subMenu, item.title)}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section with logout and info */}
          <div className="border-t border-gray-800">
            {/* Logout Button */}
            {authState.isAuthenticated && (
              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center text-gray-300 hover:text-white hover:bg-red-600 px-4 py-3 rounded-md transition-all duration-200 group ${
                    collapsed ? "justify-center px-3" : "justify-start"
                  }`}
                  title={collapsed ? "Logout" : ""}
                >
                  <FaSignOutAlt
                    className={`${
                      collapsed ? "text-lg" : "mr-3 text-base"
                    } group-hover:text-white`}
                  />
                  {!collapsed && <span className="font-medium">Logout</span>}
                </button>
              </div>
            )}

            {/* Footer Info */}
            <div
              className={`p-4 text-gray-400 text-xs ${
                collapsed ? "text-center" : ""
              }`}
            >
              {!collapsed && (
                <div>
                  <p className="font-medium">© 2025 ERP System v1.0</p>
                  {authState.isAuthenticated && authState.role && (
                    <p className="mt-1 text-gray-500">
                      Role:{" "}
                      <span className="text-gray-300 font-medium">
                        {authState.role}
                      </span>
                    </p>
                  )}
                </div>
              )}
              {collapsed && authState.isAuthenticated && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 transform rotate-90 origin-center whitespace-nowrap">
                    v1.0
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay - semi-transparent */}
      <div
        className={`fixed inset-0  bg-opacity-30 z-30 md:hidden ${
          sidebar ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-20 md:hidden text-gray-400 hover:text-gray-200 p-1 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <FaBars className="text-lg" />
      </button>
    </div>
  );
};

export default Sidebar;
