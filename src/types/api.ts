/**
 * API Response Interfaces & Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
