import { useCallback, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';
import ThemeToggle from './components/ThemeToggle';
import ScrollProgress from './components/ScrollProgress';
import Landing from './pages/Landing';
import QuotePage from './pages/QuotePage';
import PortalLayout from './pages/Portal';
import PortalOverview from './pages/PortalOverview';
import PortalQuotes from './pages/PortalQuotes';
import PortalSettings from './pages/PortalSettings';
import { useAuth } from './auth/AuthContext';

type AuthMode = 'login' | 'signup';

export default function App() {
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  return (
    <div className="app">
      <ScrollProgress />
      <Navbar onOpenAuth={openAuth} />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/quote"
            element={<QuotePage onRequireAuth={openAuth} />}
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/portal"
            element={
              <RequireAuth onRequireAuth={openAuth}>
                <PortalLayout />
              </RequireAuth>
            }
          >
            <Route index element={<PortalOverview />} />
            <Route path="quotes" element={<PortalQuotes />} />
            <Route path="settings" element={<PortalSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={closeAuth} defaultMode={authMode} />
      <ThemeToggle />
    </div>
  );
}

interface RequireAuthProps {
  children: React.ReactNode;
  onRequireAuth: (mode?: AuthMode) => void;
}

function RequireAuth({ children, onRequireAuth }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loader" aria-live="polite">
        <span className="route-loader-spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <RouteAuthPrompt
        onLogin={() => onRequireAuth('login')}
        onSignup={() => onRequireAuth('signup')}
        path={location.pathname}
      />
    );
  }

  return <>{children}</>;
}

interface RouteAuthPromptProps {
  onLogin: () => void;
  onSignup: () => void;
  path: string;
}

function RouteAuthPrompt({ onLogin, onSignup, path }: RouteAuthPromptProps) {
  const target = path.includes('portal') ? 'client portal' : 'this page';
  return (
    <section className="route-auth-wall section">
      <div className="container route-auth-wall-inner">
        <span className="eyebrow">Sign in required</span>
        <h1>You need an account to access {target}.</h1>
        <p>
          Sign up in 30 seconds or log in with your existing DigiPros account
          to continue.
        </p>
        <div className="route-auth-actions">
          <button className="btn btn-primary" onClick={onSignup}>
            Create account
          </button>
          <button className="btn btn-ghost" onClick={onLogin}>
            Log in
          </button>
        </div>
      </div>
    </section>
  );
}
