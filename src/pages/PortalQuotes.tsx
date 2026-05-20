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
  const quote = quotes[0] ?? null;

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Quote</span>
          <h1>Your quote request</h1>
          <p>
            You have one active quote for our full-service marketing package.
            Update it anytime as your needs change.
          </p>
        </div>
        {quote && (
          <Link to="/quote?edit=1" className="btn btn-primary portal-cta">
            Edit quote
          </Link>
        )}
      </header>

      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner" />
          <span>Loading quote…</span>
        </div>
      ) : !quote ? (
        <div className="portal-card portal-empty-state-card">
          <h2>No quote yet</h2>
          <p>Complete your quote request to get a tailored proposal.</p>
          <Link to="/quote" className="btn btn-primary">
            Get a quote
          </Link>
        </div>
      ) : (
        <div className="portal-card">
          <ul className="portal-quotes-table">
            <li>
              <div className="quote-row-main">
                <div>
                  <strong>{quote.service_name}</strong>
                  <span className="quote-row-meta">
                    {quote.company_name}
                    {quote.monthly_budget ? ` · ${quote.monthly_budget}` : ''}
                    {quote.timeline ? ` · ${quote.timeline}` : ''}
                  </span>
                </div>
                <span className={`portal-status status-${quote.status}`}>
                  {quote.status.replace('_', ' ')}
                </span>
              </div>
              <div className="quote-row-foot">
                <span>Submitted {formatDate(quote.created_at)}</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
