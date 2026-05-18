import type {
  LoginPayload,
  OAuthProvider,
  SignupPayload,
  TokenResponse,
  User,
} from './types';

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const TOKEN_KEY = 'digipros.token';

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (t: string): void => localStorage.setItem(TOKEN_KEY, t),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = opts;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'detail' in data
        ? String((data as { detail: unknown }).detail)
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export const api = {
  signup: (payload: SignupPayload) =>
    request<TokenResponse>('/auth/signup', { method: 'POST', body: payload }),
  login: (payload: LoginPayload) =>
    request<TokenResponse>('/auth/login', { method: 'POST', body: payload }),
  me: (token: string) => request<User>('/auth/me', { token }),
  providers: () =>
    request<{ providers: OAuthProvider[] }>('/auth/providers').catch(
      () => ({ providers: [] as OAuthProvider[] })
    ),
  googleToken: (accessToken: string) =>
    request<TokenResponse>('/auth/google/token', {
      method: 'POST',
      body: { access_token: accessToken },
    }),
};

export const oauthUrl = (provider: OAuthProvider): string =>
  `${API_URL}/auth/${provider}/login`;
