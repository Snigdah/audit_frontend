export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
export interface PaginatedData<T> {
  content: T[];
  pagination: Pagination;
}
export interface ApiResponse<T> {
  data: T;
  meta: {
    code: number;
    message: string;
    status: string;
  };
}
