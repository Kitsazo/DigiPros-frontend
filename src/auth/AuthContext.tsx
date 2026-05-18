import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, oauthUrl, tokenStore } from './api';
import type {
  LoginPayload,
  OAuthProvider,
  SignupPayload,
  User,
} from './types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  providers: OAuthProvider[];
  signup: (payload: SignupPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (googleAccessToken: string) => Promise<void>;
  logout: () => void;
  oauthLogin: (provider: OAuthProvider) => void;
  applyToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [user, setUser] = useState<User | null>(null);
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(tokenStore.get()));

  const applyToken = useCallback((nextToken: string | null) => {
    if (nextToken) {
      tokenStore.set(nextToken);
    } else {
      tokenStore.clear();
    }
    setToken(nextToken);
  }, []);

  useEffect(() => {
    api.providers().then((p) => setProviders(p.providers ?? []));
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    api
      .me(token)
      .then((u) => {
        if (alive) setUser(u);
      })
      .catch(() => {
        if (alive) applyToken(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token, applyToken]);

  const signup = async (payload: SignupPayload) => {
    const { access_token } = await api.signup(payload);
    applyToken(access_token);
  };

  const login = async (payload: LoginPayload) => {
    const { access_token } = await api.login(payload);
    applyToken(access_token);
  };

  const loginWithGoogle = async (googleAccessToken: string) => {
    const { access_token } = await api.googleToken(googleAccessToken);
    applyToken(access_token);
  };

  const logout = () => applyToken(null);

  const oauthLogin = (provider: OAuthProvider) => {
    window.location.href = oauthUrl(provider);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        providers,
        signup,
        login,
        loginWithGoogle,
        logout,
        oauthLogin,
        applyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
