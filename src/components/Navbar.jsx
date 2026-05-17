import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import './Navbar.css';

const links = [
  { href: '#about', label: 'About' },
  { href: '#packages', label: 'Packages' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ onOpenAuth }) {
  const { user, logout, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#top" className="navbar-brand" aria-label="DigiPros Marketing home">
          <span className="navbar-logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="28" height="28">
              <rect width="64" height="64" rx="14" fill="var(--color-blue)" />
              <path
                d="M16 44 V20 h12 a10 10 0 0 1 0 20 h-6"
                stroke="var(--color-yellow)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="46" cy="44" r="4" fill="var(--color-yellow)" />
            </svg>
          </span>
          <span className="navbar-wordmark">
            DigiPros<span className="accent">.</span>
          </span>
        </a>

        <nav className="navbar-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          {loading ? (
            <span className="navbar-loading" aria-hidden="true" />
          ) : user ? (
            <>
              <span className="navbar-user" title={user.email}>
                {user.name || user.email.split('@')[0]}
              </span>
              <button className="btn btn-ghost navbar-cta" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="navbar-link-btn" onClick={onOpenAuth}>
                Log in
              </button>
              <button className="btn btn-primary navbar-cta" onClick={onOpenAuth}>
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
