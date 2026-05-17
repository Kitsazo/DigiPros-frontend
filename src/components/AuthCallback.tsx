import { useEffect, useState, type CSSProperties } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function AuthCallback() {
  const { applyToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const err = params.get('error');

    if (err) {
      setError(err);
      return;
    }
    if (token) {
      applyToken(token);
    }
    const t = window.setTimeout(() => {
      window.history.replaceState({}, '', '/');
      window.location.reload();
    }, 350);
    return () => window.clearTimeout(t);
  }, [applyToken]);

  return (
    <div style={callbackStyle}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22 }}>
          {error ? 'Sign-in failed' : 'Signing you in…'}
        </h1>
        <p style={{ marginTop: 8, color: '#475569' }}>
          {error ?? 'One moment, redirecting back to the site.'}
        </p>
      </div>
    </div>
  );
}

const callbackStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: 24,
};
