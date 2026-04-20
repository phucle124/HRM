export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
function buildHeaders(options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function fetchApiRaw(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: buildHeaders(options),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw {
        response: { status: response.status, data },
        status: response.status,
        message: typeof data === 'object' && data?.message ? data.message : `HTTP ${response.status}`,
      };
    }

    return { data, status: response.status };
  } catch (error: any) {
    if (error?.response) throw error;
    throw {
      isNetworkError: true,
      message: 'API chưa kết nối',
    };
  }
}

export async function fetchApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchApiRaw(path, options);
  const payload = response?.data;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export const api = {
  get: (path: string) => fetchApiRaw(path),
  post: (path: string, body?: unknown) => fetchApiRaw(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: unknown) => fetchApiRaw(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: (path: string, body?: unknown) => fetchApiRaw(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: (path: string) => fetchApiRaw(path, { method: 'DELETE' }),
};

export function getPayload<T = any>(response: any): T {
  if (response?.data?.data !== undefined) return response.data.data as T;
  if (response?.data !== undefined) return response.data as T;
  return response as T;
}

export function formatApiError(error: any, fallback = 'Có lỗi xảy ra khi gọi API') {
  if (error?.isNetworkError) return 'API chưa kết nối';
  if (error?.status === 404) return error?.response?.data?.message || 'API chưa hỗ trợ dữ liệu này';
  return error?.response?.data?.message || error?.message || fallback;
}
