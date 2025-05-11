export interface ApiResponse<T> {
  data: T;
  meta: {
    code: number;
    message: string;
    status: string;
  };
}
