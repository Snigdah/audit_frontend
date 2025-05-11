export type Role = "ADMIN" | "SUPERVISOR" | "OPERATOR" | "READ_ONLY_USER";

export interface SubMenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  access?: Role[];
}

export interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  cName: string;
  subMenu?: SubMenuItem[];
  access?: Role[];
}
