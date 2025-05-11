export const ENDPOINTS = {
  AUTH: {
    LOGIN: "audit/login",
  },
  USER: {
    FETCH_ALL: "user/all",
  },
  STUDENT: {
    FETCH_BY_ID: (id: number) => `student/${id}`,
  },
};
