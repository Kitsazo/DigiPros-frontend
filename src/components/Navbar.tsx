import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Navbar.css';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

const sectionLinks: { hash: string; label: string }[] = [
  { hash: '#about', label: 'About' },
  { hash: '#stats', label: 'Results' },
  { hash: '#services', label: 'Services' },
  { hash: '#contact', label: 'Contact' },
];

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { user, logout, loading } = useAuth();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const scrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = window.scrollY / scrollable;
      setScrolled(progress >= 0.05);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const onLanding = pathname === '/';

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="DigiPros Marketing home">
          <span className="navbar-logo" aria-hidden="true">
            <img src="/main%20logo.svg" alt="" width="28" height="28" style={{ display: 'block' }} />
          </span>
          <span className="navbar-wordmark">
            DigiPros<span className="accent">.</span>
          </span>
        </Link>

        <nav
          className={`navbar-links ${menuOpen ? 'is-open' : ''}`}
          aria-label="Primary"
        >
          {sectionLinks.map((l) =>
            onLanding ? (
              <a key={l.hash} href={l.hash}>{l.label}</a>
            ) : (
              <Link key={l.hash} to={`/${l.hash}`}>{l.label}</Link>
            ),
          )}
          {user && (
            <NavLink
              to="/portal"
              className={({ isActive }) =>
                isActive ? 'navbar-portal-link is-active' : 'navbar-portal-link'
              }
            >
              Portal
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {loading ? (
            <span className="navbar-loading" aria-hidden="true" />
          ) : user ? (
            <>
              <Link to="/portal" className="navbar-user-pill">
                <span className="navbar-user-dot" aria-hidden="true">
                  {(user.company_name || user.email)[0]?.toUpperCase()}
                </span>
                <span className="navbar-user">{user.company_name}</span>
              </Link>
              <button type="button" className="navbar-logout-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                className="navbar-link-btn"
                onClick={() => onOpenAuth('login')}
              >
                Log in
              </button>
              <button
                className="btn btn-primary navbar-cta"
                onClick={() => onOpenAuth('signup')}
              >
                Sign up
              </button>
            </>
          )}
          <button
            type="button"
            className={`navbar-burger ${menuOpen ? 'is-open' : ''}`}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
