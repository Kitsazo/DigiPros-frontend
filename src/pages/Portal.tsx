import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../auth/api';
import type { Analytics, Quote } from '../auth/types';
import './Portal.css';

interface PortalContextLike {
  analytics: Analytics | null;
  quotes: Quote[];
  reloadQuotes: () => Promise<void>;
  loading: boolean;
}

export default function PortalLayout() {
  const { user, token, logout } = useAuth();
  const { pathname } = useLocation();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadQuotes = async () => {
    if (!token) return;
    const list = await api.listQuotes(token);
    setQuotes(list);
  };

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    Promise.all([api.analytics(token), api.listQuotes(token)])
      .then(([a, q]) => {
        if (!alive) return;
        setAnalytics(a);
        setQuotes(q);
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  if (!user) {
    return (
      <section className="portal section">
        <div className="container portal-empty">
          <h1>Sign in to access your portal.</h1>
          <Link to="/" className="btn btn-primary">Back home</Link>
        </div>
      </section>
    );
  }

  const ctx: PortalContextLike = {
    analytics,
    quotes,
    reloadQuotes,
    loading,
  };

  const initial = user.company_name?.[0]?.toUpperCase() ?? 'D';

  return (
    <section className="portal section">
      <div className="container portal-layout">
        <aside className="portal-side">
          <div className="portal-side-head">
            <div className="portal-avatar" aria-hidden="true">
              {initial}
            </div>
            <div className="portal-side-id">
              <strong>{user.company_name}</strong>
              <span>
                {user.contact_name ? `${user.contact_name} · ` : ''}
                {user.email}
              </span>
            </div>
          </div>
          <nav className="portal-nav" aria-label="Portal">
            <PortalLink to="/portal" label="Overview" icon="grid" end />
            <PortalLink to="/portal/quotes" label="Quotes" icon="quote" />
            <PortalLink to="/portal/settings" label="Settings" icon="settings" />
          </nav>
          <button
            type="button"
            className="portal-logout"
            onClick={() => {
              logout();
            }}
          >
            Log out
          </button>
        </aside>

        <main className="portal-main" key={pathname}>
          <Outlet context={ctx} />
        </main>
      </div>
    </section>
  );
}

interface PortalLinkProps {
  to: string;
  label: string;
  icon: 'grid' | 'quote' | 'settings';
  end?: boolean;
}

function PortalLink({ to, label, icon, end }: PortalLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `portal-link ${isActive ? 'is-active' : ''}`
      }
    >
      <NavIcon icon={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

interface NavIconProps {
  icon: 'grid' | 'quote' | 'settings';
}

function NavIcon({ icon }: NavIconProps) {
  const common = {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (icon) {
    case 'grid':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'quote':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 7h16" />
          <path d="M4 12h10" />
          <path d="M4 17h16" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0c.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z" />
        </svg>
      );
  }
}

export type { PortalContextLike };
