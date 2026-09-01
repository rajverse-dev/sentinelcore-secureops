const TOKEN_KEY = 'sentinelcore_token';
const USER_KEY = 'sentinelcore_user';

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: unknown | null) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
