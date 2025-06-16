const BASE = {
  AUTH: "audit",
  STUDENT: "student",
  BUILDING: "building",
  FLOOR: "floor",
  PASSWORD_POLICY: "password-policy",
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE.AUTH}/login`,
    REFRESH_TOKEN: `${BASE.AUTH}/refreshtoken`,
    LOGOUT: `${BASE.AUTH}/logout`,
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
  PASSWORD_POLICY: {
    CREATE: `${BASE.PASSWORD_POLICY}`,
    FETCH: `${BASE.PASSWORD_POLICY}`,
  },
  STUDENT: {
    FETCH_BY_ID: (id: number) => `student/${id}`,
  },
};
