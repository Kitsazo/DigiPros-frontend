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
  UserUpdatePayload,
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
  updateProfile: (payload: UserUpdatePayload) => Promise<User>;
  refresh: () => Promise<void>;
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

  const loadMe = useCallback(
    async (activeToken: string) => {
      try {
        const u = await api.me(activeToken);
        setUser(u);
      } catch {
        applyToken(null);
      } finally {
        setLoading(false);
      }
    },
    [applyToken],
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadMe(token);
  }, [token, loadMe]);

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

  const updateProfile = async (payload: UserUpdatePayload): Promise<User> => {
    if (!token) throw new Error('Not authenticated');
    const updated = await api.updateMe(token, payload);
    setUser(updated);
    return updated;
  };

  const refresh = async () => {
    if (!token) return;
    await loadMe(token);
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
        updateProfile,
        refresh,
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
