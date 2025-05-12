const BASE = {
  AUTH: "audit",
  USER: "user",
  STUDENT: "student",
  BUILDING: "building",
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
    FETCH_BY_ID: (id: number) => `${BASE.BUILDING}/${id}`,
    DELETE_BY_ID: (id: number) => `${BASE.BUILDING}/${id}`,
  },
  USER: {
    FETCH_ALL: "user/all",
  },
  STUDENT: {
    FETCH_BY_ID: (id: number) => `student/${id}`,
  },
};
