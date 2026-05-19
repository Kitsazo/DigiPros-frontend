import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import type { PortalContextLike } from './Portal';

interface ProfileForm {
  name: string;
  phone: string;
  avatar_url: string;
}

export default function PortalSettings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { businesses } = useOutletContext<PortalContextLike>();

  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    avatar_url: user?.avatar_url ?? '',
  });
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [savedProfile, setSavedProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name ?? '',
      phone: user.phone ?? '',
      avatar_url: user.avatar_url ?? '',
    });
  }, [user]);

  const onChange =
    (k: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setSavedProfile(false);
    try {
      await updateProfile({
        name: form.name.trim() || null,
        phone: form.phone.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
      });
      setSavedProfile(true);
      window.setTimeout(() => setSavedProfile(false), 2200);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPickActiveBusiness = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    try {
      await updateProfile({
        active_business_id: value === '' ? null : Number(value),
      });
    } catch {
      /* ignored */
    }
  };

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Account settings</h1>
          <p>Manage how you appear in the portal and how you reach us.</p>
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

      <form className="portal-card portal-form" onSubmit={onSaveProfile}>
        <header className="portal-card-head">
          <div>
            <h2>Contact information</h2>
            <p>Used on quotes and reports we send back to you.</p>
          </div>
        </header>
        <div className="portal-form-grid">
          <label>
            <span>Full name</span>
            <input type="text" value={form.name} onChange={onChange('name')} />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              title="Email is managed by your sign-in method."
            />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" value={form.phone} onChange={onChange('phone')} />
          </label>
          <label>
            <span>Avatar URL</span>
            <input
              type="url"
              placeholder="https://"
              value={form.avatar_url}
              onChange={onChange('avatar_url')}
            />
          </label>
        </div>
        {profileError && <p className="quote-error">{profileError}</p>}
        <div className="portal-form-actions">
          {savedProfile && <span className="portal-saved">Saved ✓</span>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
          >
            {savingProfile ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <div className="portal-card">
        <header className="portal-card-head">
          <div>
            <h2>Active business</h2>
            <p>Pick the business this account should default to.</p>
          </div>
        </header>
        <label className="portal-inline-label">
          <span>Default business</span>
          <select
            value={user?.active_business_id ?? ''}
            onChange={onPickActiveBusiness}
            disabled={businesses.length === 0}
          >
            <option value="">None selected</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
