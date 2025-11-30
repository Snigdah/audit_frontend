const BASE = {
  AUTH: "audit",
  PROFILE: "profile",
  BUILDING: "building",
  FLOOR: "floor",
  DEPARTMENT: "department",
  PASSWORD_POLICY: "password-policy",
  DESIGNATION: "designation",
  SUPERVISOR: "supervisor",
  OPERATOR: "operator",
  VIEWER: "viewer",
  EQUIPMENT: "equipment",
  NOTIFICATION: "notification",
  EMAIL: "mail"
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE.AUTH}/login`,
    ADMIN_FORGOT_PASSWORD: `${BASE.AUTH}/forget-password`,
    ADMIN_VERIFY_OTP: `${BASE.AUTH}/verify-otp`,
    REFRESH_TOKEN: `${BASE.AUTH}/refreshtoken`,
    LOGOUT: `${BASE.AUTH}/logout`,
    REGISTER: `${BASE.AUTH}/register`,
    CHANGE_PASSWORD: `${BASE.AUTH}/change-password`,
    DELETE_USER: `${BASE.AUTH}/user`
  },
  BUILDING: {
    CREATE: `${BASE.BUILDING}`,
    FETCH_ALL: `${BASE.BUILDING}`,
    UPDATE: (id: number) => `${BASE.BUILDING}/${id}`,
    FETCH_BY_ID: (id: number) => `${BASE.BUILDING}/${id}`,
    DELETE_BY_ID: (id: number) => `${BASE.BUILDING}/${id}`,
  },
  FLOOR: {
    CREATE: `${BASE.FLOOR}`,
    FETCH_ALL: `${BASE.FLOOR}`,
    FETCH_BY_ID: (id: number) => `${BASE.FLOOR}/${id}`,
    FETCH_BY_BUILDING_ID: (buildingId: number) =>
      `${BASE.FLOOR}/building/${buildingId}`,
    UPDATE: (id: number) => `${BASE.FLOOR}/${id}`,
    DELETE: (id: number) => `${BASE.FLOOR}/${id}`,
  },
  DEPARTMENT: {
    CREATE: `${BASE.DEPARTMENT}`,
    FETCH_ALL: `${BASE.DEPARTMENT}`,
    FETCH_BY_ID: (id: number) => `${BASE.DEPARTMENT}/${id}`,
    FETCH_BY_FLOOR_ID: (floorId: number) =>
      `${BASE.DEPARTMENT}/floor/${floorId}`,
    SEARCH: (query: string) => `${BASE.DEPARTMENT}?search=${query}`,
    UPDATE: (id: number) => `${BASE.DEPARTMENT}/${id}`,
    DELETE: (id: number) => `${BASE.DEPARTMENT}/${id}`,
    DROPDOWN: `${BASE.DEPARTMENT}/dropdown`,

    ASSIGN_SUPERVISOR: `${BASE.DEPARTMENT}/assign-supervisor`,
    REMOVE_SUPERVISOR: `${BASE.DEPARTMENT}/remove-supervisor`,
    GET_SUPERVISORS: (departmentId: number) =>
      `${BASE.DEPARTMENT}/${departmentId}/supervisors`,

    ASSIGN_EQUIPMENT: `${BASE.DEPARTMENT}/assign-equipment`,
    REMOVE_EQUIPMENT: (equipmentId: number) =>
      `${BASE.DEPARTMENT}/remove-equipment/${equipmentId}`,
    GET_EQUIPMENTS: (departmentId: number) =>
      `${BASE.DEPARTMENT}/${departmentId}/equipments`,
  },
  PASSWORD_POLICY: {
    CREATE: `${BASE.PASSWORD_POLICY}`,
    FETCH: `${BASE.PASSWORD_POLICY}`,
  },
  DESIGNATION: {
    CREATE: `${BASE.DESIGNATION}`,
    FETCH_ALL: `${BASE.DESIGNATION}`,
    SEARCH: (query: string) => `${BASE.DESIGNATION}?search=${query}`,
    UPDATE: (id: number) => `${BASE.DESIGNATION}/${id}`,
  },
  SUPERVISOR: {
    FETCH_BY_ID: (id: number) => `${BASE.SUPERVISOR}/${id}`,
    FETCH_ALL: (search?: string) =>
      search ? `${BASE.SUPERVISOR}?search=${search}` : `${BASE.SUPERVISOR}`,
    UPDATE: (id: number) => `${BASE.SUPERVISOR}/${id}`,

    ASSIGN_OPERATOR: `${BASE.SUPERVISOR}/assign-operator`,
    REMOVE_OPERATOR: `${BASE.SUPERVISOR}/remove-operator`,
    GET_OPERATORS: (supervisorId: number) =>
      `${BASE.SUPERVISOR}/${supervisorId}/operators`,
    GET_DEPARTMENT: (supervisorId: number) =>  `${BASE.SUPERVISOR}/${supervisorId}/departments`,
  },
  OPERATOR: {
    FETCH_BY_ID: (id: number) => `${BASE.OPERATOR}/${id}`,
    FETCH_ALL: (search?: string) =>
      search ? `${BASE.OPERATOR}?search=${search}` : `${BASE.OPERATOR}`,
    UPDATE: (id: number) => `${BASE.OPERATOR}/${id}`,
    GET_SUPERVISOR: (operatorId: number) => `${BASE.OPERATOR}/${operatorId}/supervisors`,
    GET_EQUIPMENTS: (operatorId: number) => `${BASE.OPERATOR}/${operatorId}/equipments`,
  },
  VIEWER: {
    FETCH_ALL: (search?: string) =>
      search ? `${BASE.VIEWER}?search=${search}` : `${BASE.VIEWER}`,
  },
  EQUIPMENT: {
    FETCH_BY_ID: (id: number) => `${BASE.EQUIPMENT}/${id}`,
    FETCH_ALL: (search?: string) =>
      search ? `${BASE.EQUIPMENT}?search=${search}` : `${BASE.EQUIPMENT}`,
    CREATE: () => `${BASE.EQUIPMENT}`,
    UPDATE: (id: number) => `${BASE.EQUIPMENT}/${id}`,
    DELETE: (id: number) => `${BASE.EQUIPMENT}/${id}`,
    ASSIGN_OPERATOR: () => `${BASE.EQUIPMENT}/assign-operator`,
    REMOVE_OPERATOR: () => `${BASE.EQUIPMENT}/remove-operator`,
    FETCH_OPERATORS: (id: number) => `${BASE.EQUIPMENT}/${id}/operators`,
  },
  PROFILE: {
    FETCH_FULL: `${BASE.PROFILE}/details`,
    FETCH_BASIC: `${BASE.PROFILE}/basic`,
    FETCH_DEPARTMENT: `${BASE.PROFILE}/departments`,
    FETCH_USRER_PROFILE: (employeeId: number)=> `${BASE.PROFILE}/${employeeId}`,
  },
  NOTIFICATION: {
    FETCH_ALL: `${BASE.NOTIFICATION}`,
    UPDATE: (id: number)=> `${BASE.NOTIFICATION}/${id}`,
    DELETE: (id: number)=> `${BASE.NOTIFICATION}/${id}`,
  },
  EMAIL: {
    CONFIGURE_EMAIL: `${BASE.EMAIL}/configure`,
    GET_EMAIL_CONFIG: `${BASE.EMAIL}/configure`,
    TEST_EMAIL: `${BASE.EMAIL}/test`,
  }
};
