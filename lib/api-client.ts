/**
 * Type-safe API client for frontend HTTP requests
 * Provides automatic error handling and type inference
 */

export class APIClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Erro ao processar resposta',
    }));

    throw new APIClientError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      errorData.code,
      errorData.details
    );
  }

  return response.json();
}

/**
 * Typed API client methods
 */
export const api = {
  get: <T>(url: string, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(url, { ...options, method: 'GET' });
  },

  post: <T>(url: string, data: unknown, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: <T>(url: string, data: unknown, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: <T>(url: string, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(url, { ...options, method: 'DELETE' });
  },

  patch: <T>(url: string, data: unknown, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Export for backwards compatibility
export const apiGet = api.get;
export const apiPost = api.post;
export const apiPut = api.put;
export const apiDelete = api.delete;
