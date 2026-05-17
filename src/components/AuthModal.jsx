import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import './AuthModal.css';

const tabs = [
  { id: 'login', label: 'Log in' },
  { id: 'signup', label: 'Sign up' },
];

export default function AuthModal({ open, onClose }) {
  const { login, signup, oauthLogin, providers } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    setError(null);
  }, [mode]);

  if (!open) return null;

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await signup({
          email: form.email,
          password: form.password,
          name: form.name || null,
        });
      } else {
        await login({ email: form.email, password: form.password });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <h2 className="auth-title">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="auth-sub">Access proposals, reports, and your DigiPros dashboard.</p>

        <div className="auth-providers">
          {providers.includes('google') && (
            <button
              type="button"
              className="auth-provider"
              onClick={() => oauthLogin('google')}
            >
              <GoogleIcon /> Continue with Google
            </button>
          )}
          {providers.includes('apple') && (
            <button
              type="button"
              className="auth-provider auth-provider-apple"
              onClick={() => oauthLogin('apple')}
            >
              <AppleIcon /> Continue with Apple
            </button>
          )}
          {providers.length === 0 && (
            <p className="auth-providers-empty">
              Social sign-in isn't configured yet — use email below.
            </p>
          )}
        </div>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={mode === t.id}
              className={`auth-tab ${mode === t.id ? 'is-active' : ''}`}
              onClick={() => setMode(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <label>
              <span>Name (optional)</span>
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={onChange('name')}
              />
            </label>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={onChange('email')}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={onChange('password')}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.99-2.34z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.36 12.83c.02-2.42 1.98-3.58 2.07-3.64-1.13-1.66-2.89-1.88-3.51-1.91-1.49-.15-2.92.88-3.68.88-.76 0-1.94-.86-3.19-.84-1.64.02-3.16.96-4.01 2.43-1.72 2.98-.44 7.39 1.23 9.81.82 1.18 1.79 2.51 3.06 2.46 1.23-.05 1.69-.79 3.18-.79 1.48 0 1.9.79 3.19.77 1.32-.02 2.16-1.19 2.97-2.38.93-1.36 1.31-2.69 1.33-2.76-.03-.01-2.56-.98-2.58-3.89zM13.78 5.69c.67-.81 1.13-1.95.99-3.07-.96.04-2.13.64-2.83 1.45-.62.72-1.17 1.86-1.02 2.96 1.07.08 2.18-.54 2.86-1.34z"/>
    </svg>
  );
}
