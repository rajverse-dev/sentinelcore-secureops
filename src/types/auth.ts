export interface User {
  id?: number | string;
  fullName?: string;
  name?: string;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: unknown;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  refreshToken?: string;
  user?: User;
  data?: {
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: User;
  };
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
