import {
  FaEnvelopeOpenText,
  FaChartBar,
  FaUserCog,
  FaUserTie,
  FaCity,
  FaIdBadge,
} from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import {
  FaBuilding,
  FaUsersCog,
  FaShieldAlt,
  FaCogs,
  FaUserShield,
} from "react-icons/fa";
import type { SidebarItem } from "../types/sidebar";
import { GiMechanicalArm } from "react-icons/gi";
import { HiEye } from "react-icons/hi";
import { BiBuildingHouse } from "react-icons/bi";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { IoMdHelpCircle } from "react-icons/io";

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
    icon: <FaCity className="text-xl" />,
    cName: "nav-text group",
    subMenu: [
      {
        title: "Buildings",
        path: "/infrastructure/building",
        icon: <FaBuilding className="text-blue-500" />,
      },
      {
        title: "Departments",
        path: "/infrastructure/department",
        icon: <BiBuildingHouse className="text-green-500" />,
      },
      {
        title: "Equipment",
        path: "/infrastructure/equipment",
        icon: <GiMechanicalArm className="text-orange-500" />,
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
        title: "Supervisor",
        path: "/resource/supervisor",
        icon: <FaUserTie className="text-blue-500" />,
      },
      {
        title: "Operator",
        path: "/resource/operator",
        icon: <FaUserCog className="text-green-500" />, // User with cog for operator
      },
      {
        title: "Viewer",
        path: "/resource/viewer",
        icon: <HiEye className="text-purple-500" />, // Eye icon for read-only viewer
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
        icon: <FaUnlockKeyhole className="text-red-500" />,
      },
      {
        title: "Designation",
        path: "/system/designation",
        icon: <FaIdBadge className="text-blue-500" />,
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
    title: "Reports",
    path: "/reports",
    icon: <FaChartBar className="text-xl" />,
    cName: "nav-text",
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
