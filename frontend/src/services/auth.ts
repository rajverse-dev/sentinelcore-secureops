import { apiFetch } from './api';

export interface LoginResponse {
  token: string;
  type?: string;
  id?: number;
  email: string;
  fullName?: string;
  roles?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('sentinel_jwt_token', data.token);
      localStorage.setItem('sentinel_user', JSON.stringify(data));
    }
    return data;
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout() {
    localStorage.removeItem('sentinel_jwt_token');
    localStorage.removeItem('sentinel_user');
  },

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('sentinel_user');
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sentinel_jwt_token');
  }
};
