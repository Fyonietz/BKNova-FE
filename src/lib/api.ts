import type { PaginatedQuery, PaginatedResponse } from '@/types/index';

// Hapus variabel VITE_API_URL di .env, atau biarkan kosong agar selalu memakai dynamic host
const BASE_URL = import.meta.env.VITE_API_URL || `http://localhost:3000`;

interface ApiOptions extends RequestInit {
  auth?: boolean; // attach Bearer token, default true
}

function buildQueryString(params: Record<string, string | number | boolean | undefined | null>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  const contentType = res.headers.get('content-type');
  const body = contentType?.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.message || res.statusText, body);
  }

  return body as T;
}

export const fetchPaginated = <T>(
  path: string,
  query?: Partial<PaginatedQuery>,
  options?: ApiOptions
): Promise<PaginatedResponse<T>> => {
  const page = query?.page ?? 1;
  const pageSize = query?.pageSize ?? 10;

  return request<PaginatedResponse<T>>(
    `${path}${buildQueryString({ page, pageSize })}`,
    { ...options, method: 'GET' }
  );
};

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  getPaged: <T>(path: string, query?: Partial<PaginatedQuery>, options?: ApiOptions) =>
    fetchPaginated<T>(path, query, options),

  post: <T>(path: string, data?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(data) }),

  put: <T>(path: string, data?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(data) }),

  patch: <T>(path: string, data?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

  delete: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export { ApiError };
