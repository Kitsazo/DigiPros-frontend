import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../auth/api';
import type { Business, Service } from '../auth/types';
import { findService, getFallbackServices } from '../components/Services';
import './QuotePage.css';

const BUSINESS_SIZES = [
  'Solo founder',
  '2 – 10 employees',
  '11 – 50 employees',
  '51 – 200 employees',
  '201 – 1,000 employees',
  '1,000+ employees',
];

const BUDGETS = [
  'Under $1,000 / mo',
  '$1,000 – $2,500 / mo',
  '$2,500 – $5,000 / mo',
  '$5,000 – $10,000 / mo',
  '$10,000 – $25,000 / mo',
  '$25,000+ / mo',
];

const TIMELINES = [
  'ASAP — within 2 weeks',
  'Next month',
  '1 – 3 months out',
  'Just exploring',
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
  business_name: string;
  industry: string;
  business_size: string;
  employee_count: string;
  yearly_revenue: string;
  monthly_budget: string;
  timeline: string;
  goals: string;
  notes: string;
  referral_source: string;
  business_id: string;
}

const EMPTY_FORM: QuoteForm = {
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  business_name: '',
  industry: '',
  business_size: '',
  employee_count: '',
  yearly_revenue: '',
  monthly_budget: '',
  timeline: '',
  goals: '',
  notes: '',
  referral_source: '',
  business_id: '',
};

interface QuotePageProps {
  onRequireAuth: (mode?: 'login' | 'signup') => void;
}

export default function QuotePage({ onRequireAuth }: QuotePageProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const serviceSlug = params.get('service') ?? 'paid-advertising';
  const [service, setService] = useState<Service | undefined>(() =>
    findService(serviceSlug),
  );

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [form, setForm] = useState<QuoteForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api.getService(serviceSlug).then(
      (s) => {
        if (alive && s) setService(s);
      },
      () => {
        const fallback = findService(serviceSlug);
        if (alive && fallback) setService(fallback);
      },
    );
    return () => {
      alive = false;
    };
  }, [serviceSlug]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .listBusinesses(token)
      .then((list) => {
        if (!alive) return;
        setBusinesses(list);
        const active =
          list.find((b) => b.id === user?.active_business_id) ?? list[0];
        if (active) {
          setForm((f) => ({
            ...f,
            business_id: String(active.id),
            business_name: active.name,
            industry: active.industry ?? '',
            business_size: active.size ?? '',
            employee_count:
              active.employee_count != null ? String(active.employee_count) : '',
            yearly_revenue:
              active.yearly_revenue != null ? String(active.yearly_revenue) : '',
          }));
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [token, user?.active_business_id]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      contact_name: f.contact_name || user.name || '',
      contact_email: f.contact_email || user.email,
      contact_phone: f.contact_phone || user.phone || '',
    }));
  }, [user]);

  const services = useMemo(() => getFallbackServices(), []);

  const onChange =
    (k: keyof QuoteForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPickBusiness = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === '') {
      setForm((f) => ({
        ...f,
        business_id: '',
      }));
      return;
    }
    const b = businesses.find((b) => String(b.id) === id);
    if (!b) return;
    setForm((f) => ({
      ...f,
      business_id: id,
      business_name: b.name,
      industry: b.industry ?? f.industry,
      business_size: b.size ?? f.business_size,
      employee_count:
        b.employee_count != null ? String(b.employee_count) : f.employee_count,
      yearly_revenue:
        b.yearly_revenue != null ? String(b.yearly_revenue) : f.yearly_revenue,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      onRequireAuth('signup');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.createQuote(token, {
        service_slug: service?.slug ?? serviceSlug,
        service_name: service?.name ?? serviceSlug,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || null,
        business_name: form.business_name,
        industry: form.industry || null,
        business_size: form.business_size || null,
        employee_count: form.employee_count ? Number(form.employee_count) : null,
        yearly_revenue: form.yearly_revenue ? Number(form.yearly_revenue) : null,
        monthly_budget: form.monthly_budget || null,
        timeline: form.timeline || null,
        goals: form.goals || null,
        notes: form.notes || null,
        referral_source: form.referral_source || null,
        business_id: form.business_id ? Number(form.business_id) : null,
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

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
              we'll review your details and send a tailored proposal within
              two business days. You can track the status from your client
              portal.
            </p>
            <div className="quote-success-actions">
              <Link to="/portal" className="btn btn-primary">
                Open client portal
              </Link>
              <Link to="/#services" className="btn btn-ghost">
                Browse more services
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="quote-page section">
      <div className="container quote-layout">
        <aside className="quote-aside">
          <div className="quote-aside-card">
            <Link to="/#services" className="quote-back">
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
              All services
            </Link>
            <span className="eyebrow">Get a quote</span>
            <h1 className="quote-title">{service?.name ?? 'Custom engagement'}</h1>
            <p className="quote-tagline">
              {service?.tagline ?? 'Tell us about your business and goals.'}
            </p>
            {service?.starts_at && (
              <p className="quote-price">{service.starts_at}</p>
            )}
            {service?.description && (
              <p className="quote-description">{service.description}</p>
            )}

            {service?.deliverables?.length ? (
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
                Quotes are scoped to your business so the proposal you get back
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
                <h2>Service</h2>
                <p>Which service is this quote for?</p>
              </div>
            </div>
            <label className="quote-field">
              <span>Selected service</span>
              <select
                value={service?.slug ?? serviceSlug}
                onChange={(e) =>
                  navigate(`/quote?service=${encodeURIComponent(e.target.value)}`)
                }
              >
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">2</span>
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
              <span className="quote-section-num">3</span>
              <div>
                <h2>About your business</h2>
                <p>The more detail you share, the sharper the quote.</p>
              </div>
            </div>

            {token && businesses.length > 0 && (
              <label className="quote-field">
                <span>Use a saved business</span>
                <select
                  value={form.business_id}
                  onChange={onPickBusiness}
                >
                  <option value="">Enter manually</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </label>
            )}

            <div className="quote-grid">
              <label className="quote-field">
                <span>Business name</span>
                <input
                  type="text"
                  required
                  value={form.business_name}
                  onChange={onChange('business_name')}
                />
              </label>
              <label className="quote-field">
                <span>Industry</span>
                <input
                  type="text"
                  placeholder="SaaS, e-commerce, agency…"
                  value={form.industry}
                  onChange={onChange('industry')}
                />
              </label>
              <label className="quote-field">
                <span>Company size</span>
                <select
                  value={form.business_size}
                  onChange={onChange('business_size')}
                >
                  <option value="">Select…</option>
                  {BUSINESS_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="quote-field">
                <span>Employees</span>
                <input
                  type="number"
                  min={0}
                  value={form.employee_count}
                  onChange={onChange('employee_count')}
                />
              </label>
              <label className="quote-field">
                <span>Yearly revenue (USD)</span>
                <input
                  type="number"
                  min={0}
                  value={form.yearly_revenue}
                  onChange={onChange('yearly_revenue')}
                />
              </label>
            </div>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">4</span>
              <div>
                <h2>Budget &amp; timeline</h2>
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
              <label className="quote-field">
                <span>Timeline</span>
                <select
                  value={form.timeline}
                  onChange={onChange('timeline')}
                >
                  <option value="">Select…</option>
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="quote-form-section">
            <div className="quote-form-section-head">
              <span className="quote-section-num">5</span>
              <div>
                <h2>Your goals</h2>
                <p>What does success look like in the next 6 months?</p>
              </div>
            </div>
            <label className="quote-field">
              <span>Primary goals</span>
              <textarea
                rows={4}
                placeholder="e.g. 3× monthly demo requests, hit $500K MRR, launch into the UK market…"
                value={form.goals}
                onChange={onChange('goals')}
              />
            </label>
            <label className="quote-field">
              <span>Anything else we should know? <span className="quote-opt">(optional)</span></span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={onChange('notes')}
              />
            </label>
          </div>

          {error && <p className="quote-error">{error}</p>}

          {!token && (
            <p className="quote-auth-hint">
              You'll be asked to create an account to submit — it takes 30
              seconds and gives you access to your client portal.
            </p>
          )}

          <div className="quote-submit-row">
            <Link to="/#services" className="btn btn-ghost">Cancel</Link>
            <button
              type="submit"
              className="btn btn-primary quote-submit"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : token ? 'Submit quote request' : 'Continue & submit'}
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
