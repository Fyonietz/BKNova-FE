// src/types/index.ts
export interface User {
  email: string;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: T[];
}

export interface PaginatedQuery {
  page: number;
  pageSize: number;
}
