import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../auth/AuthContext';
import './AuthModal.css';

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: Mode;
}

type Mode = 'login' | 'signup';
type SignupStep = 'company' | 'account';

const COMPANY_SIZES = [
  'Solo founder',
  '2 – 10 employees',
  '11 – 50 employees',
  '51 – 200 employees',
  '201 – 1,000 employees',
  '1,000+ employees',
];

interface AccountForm {
  email: string;
  password: string;
  contact_name: string;
  phone: string;
}

interface CompanyForm {
  company_name: string;
  industry: string;
  company_size: string;
  employee_count: string;
  yearly_revenue: string;
  website: string;
  business_phone: string;
}

const EMPTY_ACCOUNT: AccountForm = {
  email: '',
  password: '',
  contact_name: '',
  phone: '',
};

const EMPTY_COMPANY: CompanyForm = {
  company_name: '',
  industry: '',
  company_size: '',
  employee_count: '',
  yearly_revenue: '',
  website: '',
  business_phone: '',
};

export default function AuthModal({
  open,
  onClose,
  defaultMode = 'login',
}: AuthModalProps) {
  const { login, signup, loginWithGoogle, oauthLogin, providers } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [step, setStep] = useState<SignupStep>('company');
  const [account, setAccount] = useState<AccountForm>(EMPTY_ACCOUNT);
  const [company, setCompany] = useState<CompanyForm>(EMPTY_COMPANY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const googleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      setError(null);
      setSubmitting(true);
      try {
        await loginWithGoogle(response.access_token);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Google sign-in failed');
      } finally {
        setSubmitting(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    setError(null);
    setStep('company');
  }, [mode, open]);

  useEffect(() => {
    if (open) setMode(defaultMode);
  }, [open, defaultMode]);

  if (!open) return null;

  const onAccountChange =
    (k: keyof AccountForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setAccount((f) => ({ ...f, [k]: e.target.value }));

  const onCompanyChange =
    (k: keyof CompanyForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCompany((f) => ({ ...f, [k]: e.target.value }));

  const goToAccountStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!company.company_name.trim()) {
      setError('Your company name is required.');
      return;
    }
    setStep('account');
  };

  const submitSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (account.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signup({
        email: account.email,
        password: account.password,
        contact_name: account.contact_name || null,
        phone: account.phone || null,
        company_name: company.company_name.trim(),
        industry: company.industry.trim() || null,
        company_size: company.company_size || null,
        employee_count: company.employee_count
          ? Number(company.employee_count)
          : null,
        yearly_revenue: company.yearly_revenue
          ? Number(company.yearly_revenue)
          : null,
        website: company.website.trim() || null,
        business_phone: company.business_phone.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: account.email, password: account.password });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToCompany = () => {
    setStep('company');
    setError(null);
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <h2 className="auth-title">
          {mode === 'signup'
            ? step === 'company'
              ? 'Create your company account'
              : 'Almost there'
            : 'Welcome back'}
        </h2>
        <p className="auth-sub">
          {mode === 'signup'
            ? step === 'company'
              ? 'Accounts are company-based — one company, one account. Start with your business details.'
              : 'Set up the login credentials for the person managing this account.'
            : 'Access proposals, reports, and your DigiPros client portal.'}
        </p>

        {!(mode === 'signup' && step === 'account') && (
          <>
            <div className="auth-providers">
              {GOOGLE_ENABLED && (
                <button
                  type="button"
                  className="auth-provider"
                  onClick={() => googleSignIn()}
                  disabled={submitting}
                >
                  <GoogleIcon /> Continue with Google
                </button>
              )}
              {providers.includes('apple') && (
                <button
                  type="button"
                  className="auth-provider auth-provider-apple"
                  onClick={() => oauthLogin('apple')}
                  disabled={submitting}
                >
                  <AppleIcon /> Continue with Apple
                </button>
              )}
              {!GOOGLE_ENABLED && !providers.includes('apple') && (
                <p className="auth-providers-empty">
                  Social sign-in isn't configured yet — use email below.
                </p>
              )}
            </div>

            <div className="auth-divider"><span>or</span></div>

            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`}
                onClick={() => setMode('login')}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-tab ${mode === 'signup' ? 'is-active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <div className="auth-stepper" role="list" aria-label="Signup progress">
            <span
              className={`auth-step ${step === 'company' ? 'is-active' : 'is-complete'}`}
            >
              <span className="auth-step-num">1</span> Company
            </span>
            <span className="auth-step-line" aria-hidden="true" />
            <span
              className={`auth-step ${step === 'account' ? 'is-active' : ''}`}
            >
              <span className="auth-step-num">2</span> Login
            </span>
          </div>
        )}

        {mode === 'login' && (
          <form className="auth-form" onSubmit={submitLogin}>
            <label>
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={account.email}
                onChange={onAccountChange('email')}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={account.password}
                onChange={onAccountChange('password')}
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={submitting}
            >
              {submitting ? 'Please wait…' : 'Log in'}
            </button>
          </form>
        )}

        {mode === 'signup' && step === 'company' && (
          <form className="auth-form" onSubmit={goToAccountStep}>
            <label>
              <span>Company name</span>
              <input
                type="text"
                required
                placeholder="e.g. Kitsazo Productions LLC"
                value={company.company_name}
                onChange={onCompanyChange('company_name')}
              />
            </label>
            <div className="auth-row">
              <label>
                <span>Industry</span>
                <input
                  type="text"
                  placeholder="SaaS, e-commerce, agency…"
                  value={company.industry}
                  onChange={onCompanyChange('industry')}
                />
              </label>
              <label>
                <span>Company size</span>
                <select
                  value={company.company_size}
                  onChange={onCompanyChange('company_size')}
                >
                  <option value="">Select…</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="auth-row">
              <label>
                <span>Employees</span>
                <input
                  type="number"
                  min={0}
                  value={company.employee_count}
                  onChange={onCompanyChange('employee_count')}
                />
              </label>
              <label>
                <span>Yearly revenue (USD)</span>
                <input
                  type="number"
                  min={0}
                  value={company.yearly_revenue}
                  onChange={onCompanyChange('yearly_revenue')}
                />
              </label>
            </div>
            <label>
              <span>Website <span className="auth-opt">(optional)</span></span>
              <input
                type="url"
                placeholder="https://"
                value={company.website}
                onChange={onCompanyChange('website')}
              />
            </label>
            <label>
              <span>Business phone <span className="auth-opt">(optional)</span></span>
              <input
                type="tel"
                value={company.business_phone}
                onChange={onCompanyChange('business_phone')}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={submitting}
            >
              Continue
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        )}

        {mode === 'signup' && step === 'account' && (
          <form className="auth-form" onSubmit={submitSignup}>
            <label>
              <span>Your name <span className="auth-opt">(account manager)</span></span>
              <input
                type="text"
                autoComplete="name"
                value={account.contact_name}
                onChange={onAccountChange('contact_name')}
              />
            </label>
            <label>
              <span>Work email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={account.email}
                onChange={onAccountChange('email')}
              />
            </label>
            <label>
              <span>Phone <span className="auth-opt">(optional)</span></span>
              <input
                type="tel"
                autoComplete="tel"
                value={account.phone}
                onChange={onAccountChange('phone')}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={account.password}
                onChange={onAccountChange('password')}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="auth-actions">
              <button
                type="button"
                className="btn btn-ghost auth-back"
                onClick={goBackToCompany}
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary auth-submit auth-submit-inline"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
        )}
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
      <path d="M16.36 12.83c.02-2.42 1.98-3.58 2.07-3.64-1.13-1.66-2.89-1.88-3.51-1.91-1.49-.15-2.92.88-3.68.88-.76 0-1.94-.86-3.19-.84-1.64.02-3.16.96-4.01 2.43-1.72 2.98-.44 7.39 1.23 9.81.82 1.18 1.79 2.51 3.06 2.46 1.23-.05 1.69-.79 3.18-.79 1.48 0 1.9.79 3.19.77 1.32-.02 2.16-1.19 2.97-2.38.93-1.36 1.31-2.69 1.33-2.76-.03-.01-2.56-.98-2.58-3.89z"/>
    </svg>
  );
}
