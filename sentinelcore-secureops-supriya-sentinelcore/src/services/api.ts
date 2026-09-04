const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sentinel_jwt_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('sentinel_jwt_token');
      localStorage.removeItem('sentinel_user');
      window.location.hash = '#/login';
    }
    const errorData = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
