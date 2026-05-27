import { useCallback, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';
import ScrollProgress from './components/ScrollProgress';
import Landing from './pages/Landing';
import QuoteGate from './pages/QuoteGate';
import PortalLayout from './pages/Portal';
import PortalOverview from './pages/PortalOverview';
import PortalQuotes from './pages/PortalQuotes';
import PortalSettings from './pages/PortalSettings';
import { useAuth } from './auth/AuthContext';

type AuthMode = 'login' | 'signup';
type AuthIntent = 'default' | 'quote';

export default function App() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authIntent, setAuthIntent] = useState<AuthIntent>('default');

  const openAuth = useCallback(
    (mode: AuthMode = 'login', intent: AuthIntent = 'default') => {
      setAuthIntent(intent);
      setAuthMode(mode);
      setAuthOpen(true);
    },
    [],
  );

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthIntent('default');
  }, []);

  const handleAuthSuccess = useCallback(
    ({ isNew }: { isNew: boolean }) => {
      const goToPortal = authIntent === 'quote' && !isNew;
      closeAuth();
      if (goToPortal) {
        navigate('/portal', { replace: true });
      }
    },
    [authIntent, closeAuth, navigate],
  );

  const openAuthForQuote = useCallback(
    (mode: AuthMode = 'signup') => openAuth(mode, 'quote'),
    [openAuth],
  );

  return (
    <div className="app">
      <ScrollProgress />
      <Navbar onOpenAuth={openAuth} />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/quote"
            element={<QuoteGate onRequireAuth={openAuthForQuote} />}
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
      <AuthModal
        open={authOpen}
        onClose={closeAuth}
        defaultMode={authMode}
        intent={authIntent}
        onAuthSuccess={handleAuthSuccess}
      />
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
    return <RouteLoader />;
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

function RouteLoader() {
  return (
    <div className="route-loader" aria-live="polite">
      <span className="route-loader-spinner" />
      <span>Loading…</span>
    </div>
  );
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
          <button className="btn btn-primary" onClick={onSignup} type="button">
            Create account
          </button>
          <button className="btn btn-ghost" onClick={onLogin} type="button">
            Log in
          </button>
        </div>
      </div>
    </section>
  );
}
