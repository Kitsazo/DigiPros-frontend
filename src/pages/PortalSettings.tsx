import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

interface ContactForm {
  contact_name: string;
  phone: string;
  avatar_url: string;
}

interface CompanyForm {
  company_name: string;
  industry: string;
  employee_count: string;
  yearly_revenue: string;
  website: string;
  business_phone: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes: string;
}

function emptyContact(): ContactForm {
  return { contact_name: '', phone: '', avatar_url: '' };
}

function emptyCompany(): CompanyForm {
  return {
    company_name: '',
    industry: '',
    employee_count: '',
    yearly_revenue: '',
    website: '',
    business_phone: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    notes: '',
  };
}

export default function PortalSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const { theme, setTheme } = useTheme();

  const [contact, setContact] = useState<ContactForm>(emptyContact);
  const [company, setCompany] = useState<CompanyForm>(emptyCompany);

  const [contactSaving, setContactSaving] = useState<boolean>(false);
  const [contactSaved, setContactSaved] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const [companySaving, setCompanySaving] = useState<boolean>(false);
  const [companySaved, setCompanySaved] = useState<boolean>(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setContact({
      contact_name: user.contact_name ?? '',
      phone: user.phone ?? '',
      avatar_url: user.avatar_url ?? '',
    });
    setCompany({
      company_name: user.company_name ?? '',
      industry: user.industry ?? '',
      employee_count:
        user.employee_count != null ? String(user.employee_count) : '',
      yearly_revenue:
        user.yearly_revenue != null ? String(user.yearly_revenue) : '',
      website: user.website ?? '',
      business_phone: user.business_phone ?? '',
      address_line1: user.address_line1 ?? '',
      city: user.city ?? '',
      state: user.state ?? '',
      postal_code: user.postal_code ?? '',
      country: user.country ?? '',
      notes: user.notes ?? '',
    });
  }, [user]);

  const onContactChange =
    (k: keyof ContactForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setContact((f) => ({ ...f, [k]: e.target.value }));

  const onCompanyChange =
    (k: keyof CompanyForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setCompany((f) => ({ ...f, [k]: e.target.value }));

  const onSaveContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSaving(true);
    setContactError(null);
    setContactSaved(false);
    try {
      await updateProfile({
        contact_name: contact.contact_name.trim() || null,
        phone: contact.phone.trim() || null,
        avatar_url: contact.avatar_url.trim() || null,
      });
      setContactSaved(true);
      window.setTimeout(() => setContactSaved(false), 2200);
    } catch (err) {
      setContactError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setContactSaving(false);
    }
  };

  const onChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSaved(false);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
      window.setTimeout(() => setPasswordSaved(false), 2200);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const onSaveCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company.company_name.trim()) {
      setCompanyError('Company name is required.');
      return;
    }
    setCompanySaving(true);
    setCompanyError(null);
    setCompanySaved(false);
    try {
      await updateProfile({
        company_name: company.company_name.trim(),
        industry: company.industry.trim() || null,
        employee_count: company.employee_count.trim() || null,
        yearly_revenue: company.yearly_revenue.trim() || null,
        website: company.website.trim() || null,
        business_phone: company.business_phone.trim() || null,
        address_line1: company.address_line1.trim() || null,
        city: company.city.trim() || null,
        state: company.state.trim() || null,
        postal_code: company.postal_code.trim() || null,
        country: company.country.trim() || null,
        notes: company.notes.trim() || null,
      });
      setCompanySaved(true);
      window.setTimeout(() => setCompanySaved(false), 2200);
    } catch (err) {
      setCompanyError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setCompanySaving(false);
    }
  };

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Account settings</h1>
          <p>Manage your company info, contact details, and appearance.</p>
        </div>
      </header>

      <div className="portal-card">
        <header className="portal-card-head">
          <div>
            <h2>Appearance</h2>
            <p>Pick the theme that's easiest on your eyes.</p>
          </div>
        </header>
        <div className="theme-picker" role="radiogroup" aria-label="Theme">
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'light'}
            className={`theme-option ${theme === 'light' ? 'is-active' : ''}`}
            onClick={() => setTheme('light', { persistRemote: true })}
          >
            <span className="theme-preview theme-preview-light" aria-hidden="true">
              <span className="theme-preview-bar" />
              <span className="theme-preview-dot" />
            </span>
            <strong>Light</strong>
            <small>Crisp, bright UI for daytime work.</small>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'dark'}
            className={`theme-option ${theme === 'dark' ? 'is-active' : ''}`}
            onClick={() => setTheme('dark', { persistRemote: true })}
          >
            <span className="theme-preview theme-preview-dark" aria-hidden="true">
              <span className="theme-preview-bar" />
              <span className="theme-preview-dot" />
            </span>
            <strong>Dark</strong>
            <small>Easy on the eyes after sundown.</small>
          </button>
        </div>
      </div>

      <form className="portal-card portal-form" onSubmit={onSaveCompany}>
        <header className="portal-card-head">
          <div>
            <h2>Company information</h2>
            <p>This is the company this account represents.</p>
          </div>
        </header>
        <div className="portal-form-grid">
          <label className="span-2">
            <span>Company name</span>
            <input
              type="text"
              required
              value={company.company_name}
              onChange={onCompanyChange('company_name')}
            />
          </label>
          <label>
            <span>Industry</span>
            <input
              type="text"
              value={company.industry}
              onChange={onCompanyChange('industry')}
            />
          </label>
          <label>
            <span>Number of employees</span>
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
          <label>
            <span>Website</span>
            <input
              type="url"
              value={company.website}
              onChange={onCompanyChange('website')}
            />
          </label>
          <label>
            <span>Business phone</span>
            <input
              type="tel"
              value={company.business_phone}
              onChange={onCompanyChange('business_phone')}
            />
          </label>
          <label className="span-2">
            <span>Address</span>
            <input
              type="text"
              value={company.address_line1}
              onChange={onCompanyChange('address_line1')}
            />
          </label>
          <label>
            <span>City</span>
            <input
              type="text"
              value={company.city}
              onChange={onCompanyChange('city')}
            />
          </label>
          <label>
            <span>State / region</span>
            <input
              type="text"
              value={company.state}
              onChange={onCompanyChange('state')}
            />
          </label>
          <label>
            <span>Postal code</span>
            <input
              type="text"
              value={company.postal_code}
              onChange={onCompanyChange('postal_code')}
            />
          </label>
          <label>
            <span>Country</span>
            <input
              type="text"
              value={company.country}
              onChange={onCompanyChange('country')}
            />
          </label>
          <label className="span-2">
            <span>Internal notes</span>
            <textarea
              rows={3}
              value={company.notes}
              onChange={onCompanyChange('notes')}
            />
          </label>
        </div>
        {companyError && <p className="quote-error">{companyError}</p>}
        <div className="portal-form-actions">
          {companySaved && <span className="portal-saved">Saved ✓</span>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={companySaving}
          >
            {companySaving ? 'Saving…' : 'Save company info'}
          </button>
        </div>
      </form>

      {user?.has_password && (
        <form className="portal-card portal-form" onSubmit={onChangePassword}>
          <header className="portal-card-head">
            <div>
              <h2>Password</h2>
              <p>Update the password you use to sign in with email.</p>
            </div>
          </header>
          <div className="portal-form-grid">
            <label className="span-2">
              <span>Current password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            <label>
              <span>New password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>
          {passwordError && <p className="quote-error">{passwordError}</p>}
          <div className="portal-form-actions">
            {passwordSaved && <span className="portal-saved">Password updated ✓</span>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordSaving}
            >
              {passwordSaving ? 'Updating…' : 'Change password'}
            </button>
          </div>
        </form>
      )}

      <form className="portal-card portal-form" onSubmit={onSaveContact}>
        <header className="portal-card-head">
          <div>
            <h2>Account manager</h2>
            <p>Who handles communications for this account.</p>
          </div>
        </header>
        <div className="portal-form-grid">
          <label>
            <span>Your name</span>
            <input
              type="text"
              value={contact.contact_name}
              onChange={onContactChange('contact_name')}
            />
          </label>
          <label>
            <span>Login email</span>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              title="Email is managed by your sign-in method."
            />
          </label>
          <label>
            <span>Personal phone</span>
            <input
              type="tel"
              value={contact.phone}
              onChange={onContactChange('phone')}
            />
          </label>
          <label>
            <span>Avatar URL</span>
            <input
              type="url"
              placeholder="https://"
              value={contact.avatar_url}
              onChange={onContactChange('avatar_url')}
            />
          </label>
        </div>
        {contactError && <p className="quote-error">{contactError}</p>}
        <div className="portal-form-actions">
          {contactSaved && <span className="portal-saved">Saved ✓</span>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={contactSaving}
          >
            {contactSaving ? 'Saving…' : 'Save contact info'}
          </button>
        </div>
      </form>
    </>
  );
}
