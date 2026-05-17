export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type OAuthProvider = 'google' | 'apple';
