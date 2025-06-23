import {
  FaCartPlus,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaChartBar,
  FaClipboardList,
  FaBoxOpen,
  FaKey,
  FaUserCog,
} from "react-icons/fa";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { IoIosPaper, IoMdPeople, IoMdHelpCircle } from "react-icons/io";
import {
  FaBuilding,
  FaTools,
  FaUsersCog,
  FaShieldAlt,
  FaCogs,
  FaUserShield,
} from "react-icons/fa";
import { MdAttachMoney, MdInventory, MdApartment } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import type { SidebarItem } from "../types/sidebar";
import { GiToolbox } from "react-icons/gi";

const sidebarData: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiFillHome className="text-xl" />,
    cName: "nav-text",
  },
  {
    title: "Infrastructure",
    path: "/infrastructure",
    icon: <FaBuilding className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Building",
        path: "/infrastructure/building",
        icon: <FaBuilding />,
      },
      {
        title: "Department",
        path: "/infrastructure/department",
        icon: <MdApartment />,
      },
      {
        title: "Equipment",
        path: "/infrastructure/equipment",
        icon: <GiToolbox />,
      },
    ],
  },
  {
    title: "Resource",
    path: "/resource",
    icon: <FaUsersCog className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Equipment",
        path: "/resource/equipment",
        icon: <FaBoxOpen />,
      },
      {
        title: "Operator",
        path: "/resource/operator",
        icon: <FaUserFriends />,
      },
      {
        title: "Supervisor",
        path: "/resource/supervisor",
        icon: <FaUserFriends />,
      },
    ],
  },
  {
    title: "Settings",
    path: "/system",
    icon: <FaCogs className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Password Policy",
        path: "/system/password-policy",
        icon: <FaKey />,
      },
      {
        title: "Designation",
        path: "/system/designation",
        icon: <FaUserCog />,
      },
    ],
  },
  {
    title: "Administration",
    path: "/admin",
    icon: <FaShieldAlt className="text-xl" />,
    cName: "nav-text",
    access: ["SUPERVISOR"], // Based on your Role enum
    subMenu: [
      {
        title: "System Settings",
        path: "/admin/settings",
        icon: <FaCogs />,
      },
      {
        title: "User Management",
        path: "/admin/users",
        icon: <FaUserShield />,
      },
    ],
  },
  {
    title: "People",
    path: "/people",
    icon: <FaUsersCog className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "User",
        path: "/people/user",
        icon: <FaUserFriends />,
      },
      {
        title: "Department",
        path: "/people/department",
        icon: <FaClipboardList />,
      },
    ],
  },
  {
    title: "Sales",
    path: "/sales",
    icon: <MdAttachMoney className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Orders",
        path: "/sales/orders",
        icon: <FaClipboardList />,
      },
      {
        title: "Invoices",
        path: "/sales/invoices",
        icon: <IoIosPaper />,
      },
      {
        title: "Customers",
        path: "/sales/customers",
        icon: <FaUserFriends />,
      },
    ],
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: <MdInventory className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Products",
        path: "/inventory/products",
        icon: <FaCartPlus />,
      },
      {
        title: "Stock",
        path: "/inventory/stock",
        icon: <FaBoxOpen />,
      },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <FaChartBar className="text-xl" />,
    cName: "nav-text",
  },
  {
    title: "HR",
    path: "/hr",
    icon: <IoMdPeople className="text-xl" />,
    cName: "nav-text",
    subMenu: [
      {
        title: "Employees",
        path: "/hr/employees",
        icon: <IoMdPeople />,
      },
      {
        title: "Attendance",
        path: "/hr/attendance",
        icon: <BsFillCalendarCheckFill />,
      },
    ],
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <FaEnvelopeOpenText className="text-xl" />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoMdHelpCircle className="text-xl" />,
    cName: "nav-text",
  },
];

export default sidebarData;
