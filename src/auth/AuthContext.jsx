import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, oauthUrl, tokenStore } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  const applyToken = useCallback((nextToken) => {
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
      .then((u) => alive && setUser(u))
      .catch(() => alive && applyToken(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [token, applyToken]);

  const signup = async (payload) => {
    const { access_token } = await api.signup(payload);
    applyToken(access_token);
  };

  const login = async (payload) => {
    const { access_token } = await api.login(payload);
    applyToken(access_token);
  };

  const logout = () => applyToken(null);

  const oauthLogin = (provider) => {
    window.location.href = oauthUrl(provider);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, providers, signup, login, logout, oauthLogin, applyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
