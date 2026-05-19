import { Link, useOutletContext } from 'react-router-dom';
import type { PortalContextLike } from './Portal';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PortalQuotes() {
  const { quotes, loading } = useOutletContext<PortalContextLike>();

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Quotes</span>
          <h1>Your quote requests</h1>
          <p>Everything you've asked us to scope, in one place.</p>
        </div>
        <Link to="/quote" className="btn btn-primary portal-cta">
          New quote
        </Link>
      </header>

      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner" />
          <span>Loading quotes…</span>
        </div>
      ) : quotes.length === 0 ? (
        <div className="portal-card portal-empty-state-card">
          <h2>No quotes yet</h2>
          <p>When you request a quote it shows up here with its status.</p>
          <Link to="/quote" className="btn btn-primary">Request a quote</Link>
        </div>
      ) : (
        <div className="portal-card">
          <ul className="portal-quotes-table">
            {quotes.map((q) => (
              <li key={q.id}>
                <div className="quote-row-main">
                  <div>
                    <strong>{q.service_name}</strong>
                    <span className="quote-row-meta">
                      {q.company_name}
                      {q.monthly_budget ? ` · ${q.monthly_budget}` : ''}
                      {q.timeline ? ` · ${q.timeline}` : ''}
                    </span>
                  </div>
                  <span className={`portal-status status-${q.status}`}>
                    {q.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="quote-row-foot">
                  <span>Submitted {formatDate(q.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
