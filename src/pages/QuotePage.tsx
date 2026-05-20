import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../auth/api';
import type { Quote, Service } from '../auth/types';
import { FULL_SERVICE_FALLBACK } from '../components/Services';
import './QuotePage.css';

const BUDGETS = [
  'Under $1,000 / mo',
  '$1,000 – $2,500 / mo',
  '$2,500 – $5,000 / mo',
  '$5,000 – $10,000 / mo',
  '$10,000 – $25,000 / mo',
  '$25,000+ / mo',
];

const EMPLOYEE_RANGES = [
  'Self-employed',
  '1–5 employees',
  '5–10 employees',
  '10–15 employees',
  '20–30 employees',
  '50+ employees',
];

const REVENUE_RANGES = [
  '$1,000 – $10,000 / year',
  '$10,000 – $50,000 / year',
  '$50,000 – $100,000 / year',
  '$100,000 – $200,000 / year',
  '$200,000+ / year',
];

const REFERRAL_SOURCES = [
  'Google search',
  'Social media',
  'Friend or colleague',
  'Existing client',
  'Newsletter',
  'Conference / event',
  'Other',
];

interface QuoteForm {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  industry: string;
  employee_count: string;
  yearly_revenue: string;
  monthly_budget: string;
  goals: string;
  referral_source: string;
}

const EMPTY_FORM: QuoteForm = {
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  company_name: '',
  industry: '',
  employee_count: '',
  yearly_revenue: '',
  monthly_budget: '',
  goals: '',
  referral_source: '',
};

function quoteToForm(quote: Quote): QuoteForm {
  return {
    contact_name: quote.contact_name,
    contact_email: quote.contact_email,
    contact_phone: quote.contact_phone ?? '',
    company_name: quote.company_name,
    industry: quote.industry ?? '',
    employee_count: quote.employee_count ?? '',
    yearly_revenue: quote.yearly_revenue ?? '',
    monthly_budget: quote.monthly_budget ?? '',
    goals: quote.goals ?? '',
    referral_source: quote.referral_source ?? '',
  };
}

interface QuotePageProps {
  editing?: boolean;
}

export default function QuotePage({ editing = false }: QuotePageProps) {
  const navigate = useNavigate();
  const { user, token, updateProfile } = useAuth();

  const [service] = useState<Service>(FULL_SERVICE_FALLBACK);
  const [form, setForm] = useState<QuoteForm>(EMPTY_FORM);
  const [existingQuoteId, setExistingQuoteId] = useState<number | null>(null);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(editing);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing || !token) {
      setLoadingQuote(false);
      return;
    }

    let cancelled = false;
    api
      .listQuotes(token)
      .then((quotes) => {
        if (cancelled || quotes.length === 0) return;
        setExistingQuoteId(quotes[0].id);
        setForm(quoteToForm(quotes[0]));
      })
      .finally(() => {
        if (!cancelled) setLoadingQuote(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editing, token]);

  useEffect(() => {
    if (!user || editing) return;
    setForm((f) => ({
      ...f,
      contact_name: f.contact_name || user.contact_name || '',
      contact_email: f.contact_email || user.email,
      contact_phone: f.contact_phone || user.phone || user.business_phone || '',
      company_name: f.company_name || user.company_name,
      industry: f.industry || user.industry || '',
      employee_count:
        f.employee_count ||
        (user.employee_count != null ? String(user.employee_count) : ''),
      yearly_revenue:
        f.yearly_revenue ||
        (user.yearly_revenue != null ? String(user.yearly_revenue) : ''),
    }));
  }, [user, editing]);

  const onChange =
    (k: keyof QuoteForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildPayload = () => ({
    service_slug: service.slug,
    service_name: service.name,
    contact_name: form.contact_name,
    contact_email: form.contact_email,
    contact_phone: form.contact_phone || null,
    company_name: form.company_name,
    industry: form.industry || null,
    employee_count: form.employee_count || null,
    yearly_revenue: form.yearly_revenue || null,
    monthly_budget: form.monthly_budget || null,
    timeline: null,
    goals: form.goals || null,
    notes: null,
    referral_source: form.referral_source || null,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = buildPayload();

      if (editing && existingQuoteId) {
        await api.updateQuote(token, existingQuoteId, payload);
      } else {
        await api.createQuote(token, payload);
      }

      await updateProfile({
        company_name: form.company_name.trim(),
        industry: form.industry.trim() || null,
        employee_count: form.employee_count || null,
        yearly_revenue: form.yearly_revenue || null,
        contact_name: form.contact_name.trim() || null,
        phone: form.contact_phone.trim() || null,
      });

      if (editing) {
        navigate('/portal/quotes', { replace: true });
        return;
      }

      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuote) {
    return (
      <div className="route-loader" aria-live="polite">
        <span className="route-loader-spinner" />
        <span>Loading your quote…</span>
      </div>
    );
  }

  if (done) {
    return (
      <section className="quote-page section">
        <div className="container quote-success">
          <div className="quote-success-card">
            <span className="quote-success-check" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <h1>Quote request received.</h1>
            <p>
              Thanks{form.contact_name ? `, ${form.contact_name.split(' ')[0]}` : ''} —
              we'll review your details for {form.company_name || 'your company'} and
              send a tailored proposal within two business days. You can track
              the status from your client portal.
            </p>
            <div className="quote-success-actions">
              <Link to="/portal" className="btn btn-primary">
                Open client portal
              </Link>
              <Link to="/#services" className="btn btn-ghost">
                Back to services
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const submitLabel = editing
    ? submitting
      ? 'Saving…'
      : 'Save changes'
    : submitting
    ? 'Sending…'
    : 'Submit quote request';

  return (
    <section className="quote-page section">
      <div className="container quote-layout">
        <aside className="quote-aside">
          <div className="quote-aside-card">
            <Link to={editing ? '/portal' : '/#services'} className="quote-back">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M11 5l-7 7 7 7" />
              </svg>
              {editing ? 'Back to portal' : 'Back to services'}
            </Link>
            <span className="eyebrow">
              {editing ? 'Edit your quote' : 'Get a free quote'}
            </span>
            <h1 className="quote-title">{service.name}</h1>
            <p className="quote-tagline">{service.tagline}</p>
            {service.starts_at && (
              <p className="quote-price">{service.starts_at}</p>
            )}
            {service.description && (
              <p className="quote-description">{service.description}</p>
            )}

            {service.deliverables?.length ? (
              <ul className="quote-deliverables">
                {service.deliverables.map((d) => (
                  <li key={d}>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="quote-trust">
              <strong>Why submit a quote?</strong>
              <p>
                Quotes are scoped to your company so the proposal you get back
                is something you can actually action — pricing, deliverables,
                and timeline all included.
              </p>
            </div>
          </div>
        </aside>

        <form className="quote-form" onSubmit={onSubmit}>
          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">1</span>
              <div>
                <h2>About you</h2>
                <p>How we'll reach you with the proposal.</p>
              </div>
            </div>
            <div className="quote-grid">
              <label className="quote-field">
                <span>Full name</span>
                <input
                  type="text"
                  required
                  value={form.contact_name}
                  onChange={onChange('contact_name')}
                />
              </label>
              <label className="quote-field">
                <span>Work email</span>
                <input
                  type="email"
                  required
                  value={form.contact_email}
                  onChange={onChange('contact_email')}
                />
              </label>
              <label className="quote-field">
                <span>Phone <span className="quote-opt">(optional)</span></span>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={onChange('contact_phone')}
                />
              </label>
              <label className="quote-field">
                <span>How did you hear about us?</span>
                <select
                  value={form.referral_source}
                  onChange={onChange('referral_source')}
                >
                  <option value="">Select…</option>
                  {REFERRAL_SOURCES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">2</span>
              <div>
                <h2>About your company</h2>
                <p>The more detail you share, the sharper the quote.</p>
              </div>
            </div>

            <div className="quote-grid">
              <label className="quote-field">
                <span>Company name</span>
                <input
                  type="text"
                  required
                  value={form.company_name}
                  onChange={onChange('company_name')}
                />
              </label>
              <label className="quote-field">
                <span>Industry</span>
                <input
                  type="text"
                  placeholder="e.g. restaurant, retail, construction…"
                  value={form.industry}
                  onChange={onChange('industry')}
                />
              </label>
              <label className="quote-field">
                <span>Number of employees</span>
                <select
                  value={form.employee_count}
                  onChange={onChange('employee_count')}
                >
                  <option value="">Select…</option>
                  {EMPLOYEE_RANGES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="quote-field">
                <span>Yearly revenue</span>
                <select
                  value={form.yearly_revenue}
                  onChange={onChange('yearly_revenue')}
                >
                  <option value="">Select…</option>
                  {REVENUE_RANGES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">3</span>
              <div>
                <h2>Budget</h2>
                <p>Helps us match the right team and scope.</p>
              </div>
            </div>
            <div className="quote-grid">
              <label className="quote-field">
                <span>Monthly budget</span>
                <select
                  value={form.monthly_budget}
                  onChange={onChange('monthly_budget')}
                >
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">4</span>
              <div>
                <h2>Your goals</h2>
                <p>What does success look like in the next 6 months?</p>
              </div>
            </div>
            <label className="quote-field">
              <span>Primary goals</span>
              <textarea
                rows={4}
                placeholder="e.g. get more customers, grow my online presence, increase sales…"
                value={form.goals}
                onChange={onChange('goals')}
              />
            </label>
          </div>

          {error && <p className="quote-error">{error}</p>}

          <div className="quote-submit-row">
            <Link
              to={editing ? '/portal' : '/#services'}
              className="btn btn-ghost"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary quote-submit"
              disabled={submitting}
            >
              {submitLabel}
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
          </div>
        </form>
      </div>
    </section>
  );
}
