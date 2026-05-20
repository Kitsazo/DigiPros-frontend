import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../auth/api';
import QuotePage from './QuotePage';

interface QuoteGateProps {
  onRequireAuth: (mode?: 'login' | 'signup') => void;
}

export default function QuoteGate({ onRequireAuth }: QuoteGateProps) {
  const [searchParams] = useSearchParams();
  const editing = searchParams.get('edit') === '1';
  const { user, token, loading } = useAuth();
  const [quotesLoading, setQuotesLoading] = useState<boolean>(Boolean(token));
  const [hasQuote, setHasQuote] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token || !user) {
      setQuotesLoading(false);
      setHasQuote(null);
      return;
    }

    let cancelled = false;
    setQuotesLoading(true);
    api
      .listQuotes(token)
      .then((quotes) => {
        if (!cancelled) setHasQuote(quotes.length > 0);
      })
      .catch(() => {
        if (!cancelled) setHasQuote(false);
      })
      .finally(() => {
        if (!cancelled) setQuotesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  useEffect(() => {
    if (!loading && !user) {
      onRequireAuth('signup');
    }
  }, [loading, user, onRequireAuth]);

  if (loading || (user && quotesLoading)) {
    return (
      <div className="route-loader" aria-live="polite">
        <span className="route-loader-spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="route-auth-wall section quote-auth-wall">
        <div className="container route-auth-wall-inner">
          <span className="eyebrow">Get a free quote</span>
          <h1>Sign in or create your company account</h1>
          <p>
            Use Google or your work email to continue. New accounts go straight
            to the quote form; returning clients are taken to their portal.
          </p>
        </div>
      </section>
    );
  }

  if (hasQuote && !editing) {
    return <Navigate to="/portal" replace />;
  }

  return <QuotePage editing={editing && hasQuote === true} />;
}
