import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../auth/api';
import type { Business, BusinessPayload } from '../auth/types';
import type { PortalContextLike } from './Portal';

const BUSINESS_SIZES = [
  'Solo founder',
  '2 – 10 employees',
  '11 – 50 employees',
  '51 – 200 employees',
  '201 – 1,000 employees',
  '1,000+ employees',
];

interface BusinessForm {
  name: string;
  industry: string;
  size: string;
  employee_count: string;
  yearly_revenue: string;
  website: string;
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes: string;
}

const EMPTY: BusinessForm = {
  name: '',
  industry: '',
  size: '',
  employee_count: '',
  yearly_revenue: '',
  website: '',
  phone: '',
  address_line1: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  notes: '',
};

function fromBusiness(b: Business): BusinessForm {
  return {
    name: b.name,
    industry: b.industry ?? '',
    size: b.size ?? '',
    employee_count: b.employee_count != null ? String(b.employee_count) : '',
    yearly_revenue: b.yearly_revenue != null ? String(b.yearly_revenue) : '',
    website: b.website ?? '',
    phone: b.phone ?? '',
    address_line1: b.address_line1 ?? '',
    city: b.city ?? '',
    state: b.state ?? '',
    postal_code: b.postal_code ?? '',
    country: b.country ?? '',
    notes: b.notes ?? '',
  };
}

function toPayload(f: BusinessForm): BusinessPayload {
  return {
    name: f.name.trim(),
    industry: f.industry.trim() || null,
    size: f.size || null,
    employee_count: f.employee_count ? Number(f.employee_count) : null,
    yearly_revenue: f.yearly_revenue ? Number(f.yearly_revenue) : null,
    website: f.website.trim() || null,
    phone: f.phone.trim() || null,
    address_line1: f.address_line1.trim() || null,
    city: f.city.trim() || null,
    state: f.state.trim() || null,
    postal_code: f.postal_code.trim() || null,
    country: f.country.trim() || null,
    notes: f.notes.trim() || null,
  };
}

export default function PortalBusinesses() {
  const { businesses, reloadBusinesses, loading } =
    useOutletContext<PortalContextLike>();
  const { token, user, updateProfile } = useAuth();

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<BusinessForm>(EMPTY);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingId == null) return;
    if (editingId === 'new') {
      setForm(EMPTY);
      return;
    }
    const b = businesses.find((x) => x.id === editingId);
    if (b) setForm(fromBusiness(b));
  }, [editingId, businesses]);

  const onChange =
    (k: keyof BusinessForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await api.createBusiness(token, toPayload(form));
      } else if (typeof editingId === 'number') {
        await api.updateBusiness(token, editingId, toPayload(form));
      }
      await reloadBusinesses();
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm('Delete this business? This can\'t be undone.')) return;
    setBusy(true);
    try {
      await api.deleteBusiness(token, id);
      await reloadBusinesses();
      if (user?.active_business_id === id) {
        await updateProfile({ active_business_id: null });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete');
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (id: number) => {
    setBusy(true);
    try {
      await updateProfile({ active_business_id: id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set active');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Businesses</span>
          <h1>Your businesses</h1>
          <p>Add and manage every business under your account.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary portal-cta"
          onClick={() => setEditingId('new')}
          disabled={busy}
        >
          + Add business
        </button>
      </header>

      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner" />
          <span>Loading…</span>
        </div>
      ) : null}

      {editingId !== null && (
        <form className="portal-card portal-form" onSubmit={onSubmit}>
          <div className="portal-form-head">
            <h2>{editingId === 'new' ? 'Add a business' : 'Edit business'}</h2>
            <button
              type="button"
              className="portal-link-pill"
              onClick={() => setEditingId(null)}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
          <div className="portal-form-grid">
            <label>
              <span>Business name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={onChange('name')}
              />
            </label>
            <label>
              <span>Industry</span>
              <input
                type="text"
                value={form.industry}
                onChange={onChange('industry')}
              />
            </label>
            <label>
              <span>Company size</span>
              <select value={form.size} onChange={onChange('size')}>
                <option value="">Select…</option>
                {BUSINESS_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Employees</span>
              <input
                type="number"
                min={0}
                value={form.employee_count}
                onChange={onChange('employee_count')}
              />
            </label>
            <label>
              <span>Yearly revenue (USD)</span>
              <input
                type="number"
                min={0}
                value={form.yearly_revenue}
                onChange={onChange('yearly_revenue')}
              />
            </label>
            <label>
              <span>Website</span>
              <input
                type="url"
                value={form.website}
                onChange={onChange('website')}
              />
            </label>
            <label>
              <span>Business phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={onChange('phone')}
              />
            </label>
            <label className="span-2">
              <span>Address</span>
              <input
                type="text"
                value={form.address_line1}
                onChange={onChange('address_line1')}
              />
            </label>
            <label>
              <span>City</span>
              <input
                type="text"
                value={form.city}
                onChange={onChange('city')}
              />
            </label>
            <label>
              <span>State / region</span>
              <input
                type="text"
                value={form.state}
                onChange={onChange('state')}
              />
            </label>
            <label>
              <span>Postal code</span>
              <input
                type="text"
                value={form.postal_code}
                onChange={onChange('postal_code')}
              />
            </label>
            <label>
              <span>Country</span>
              <input
                type="text"
                value={form.country}
                onChange={onChange('country')}
              />
            </label>
            <label className="span-2">
              <span>Internal notes</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={onChange('notes')}
              />
            </label>
          </div>
          {error && <p className="quote-error">{error}</p>}
          <div className="portal-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save business'}
            </button>
          </div>
        </form>
      )}

      {businesses.length === 0 && editingId === null && !loading ? (
        <div className="portal-card portal-empty-state-card">
          <h2>No businesses yet</h2>
          <p>
            Add your first business so we can tailor quotes and dashboards.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setEditingId('new')}
          >
            Add a business
          </button>
        </div>
      ) : (
        <ul className="portal-business-list">
          {businesses.map((b) => (
            <li key={b.id} className="portal-business-card">
              <div className="portal-business-head">
                <div>
                  <h3>{b.name}</h3>
                  <span className="portal-business-meta">
                    {b.industry || 'Industry —'}
                    {b.size ? ` · ${b.size}` : ''}
                  </span>
                </div>
                {user?.active_business_id === b.id ? (
                  <span className="portal-badge">Active</span>
                ) : (
                  <button
                    type="button"
                    className="portal-link-pill"
                    onClick={() => setActive(b.id)}
                    disabled={busy}
                  >
                    Set active
                  </button>
                )}
              </div>
              <dl className="portal-business-grid">
                {b.yearly_revenue != null && (
                  <div>
                    <dt>Yearly revenue</dt>
                    <dd>${Number(b.yearly_revenue).toLocaleString()}</dd>
                  </div>
                )}
                {b.employee_count != null && (
                  <div>
                    <dt>Employees</dt>
                    <dd>{b.employee_count}</dd>
                  </div>
                )}
                {b.website && (
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <a href={b.website} target="_blank" rel="noreferrer">
                        {b.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </div>
                )}
                {b.phone && (
                  <div>
                    <dt>Phone</dt>
                    <dd>{b.phone}</dd>
                  </div>
                )}
              </dl>
              <div className="portal-business-actions">
                <button
                  type="button"
                  className="portal-link-pill"
                  onClick={() => setEditingId(b.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="portal-link-pill is-danger"
                  onClick={() => onDelete(b.id)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
