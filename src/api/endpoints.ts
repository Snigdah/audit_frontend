const BASE = {
  AUTH: "audit",
  USER: "user",
  STUDENT: "student",
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE.AUTH}/login`,
    REFRESH_TOKEN: `${BASE.AUTH}/refreshtoken`,
    LOGOUT: `${BASE.AUTH}/logout`,
  },
  USER: {
    FETCH_ALL: "user/all",
  },
  STUDENT: {
    FETCH_BY_ID: (id: number) => `student/${id}`,
  },
};
