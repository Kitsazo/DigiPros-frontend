import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { PortalContextLike } from './Portal';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function PortalOverview() {
  const { user } = useAuth();
  const { analytics, quotes, loading } = useOutletContext<PortalContextLike>();

  const companyName = user?.company_name ?? 'your company';

  if (loading || !analytics) {
    return (
      <div className="portal-loading">
        <div className="portal-spinner" />
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  const conversionRate =
    analytics.clicks > 0
      ? ((analytics.conversions / analytics.clicks) * 100).toFixed(2)
      : '0.00';

  const ctr =
    analytics.impressions > 0
      ? ((analytics.clicks / analytics.impressions) * 100).toFixed(2)
      : '0.00';

  const cards = [
    {
      label: 'Total spent',
      value: formatCurrency(analytics.total_spent),
      delta: '+12.4% MoM',
      kind: 'spent',
    },
    {
      label: 'Total returned',
      value: formatCurrency(analytics.total_returned),
      delta: '+28.9% MoM',
      kind: 'returned',
    },
    {
      label: 'Return on ad spend',
      value: `${analytics.roas.toFixed(2)}×`,
      delta: 'Healthy',
      kind: 'roas',
    },
    {
      label: 'Active campaigns',
      value: formatNumber(analytics.active_campaigns),
      delta: `${analytics.leads_this_month} leads this month`,
      kind: 'campaigns',
    },
  ];

  const maxBar = Math.max(...analytics.history.map((p) => p.returned)) || 1;

  return (
    <>
      <header className="portal-page-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Welcome back, {companyName}.</h1>
          <p>Here's how things are tracking across your campaigns.</p>
        </div>
        <Link to="/quote" className="btn btn-primary portal-cta">
          Request a quote
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </Link>
      </header>

      <div className="portal-stats">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className={`portal-stat portal-stat-${c.kind}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="portal-stat-label">{c.label}</span>
            <strong className="portal-stat-value">{c.value}</strong>
            <span className="portal-stat-delta">{c.delta}</span>
          </div>
        ))}
      </div>

      <div className="portal-grid">
        <section className="portal-card portal-chart-card">
          <header className="portal-card-head">
            <div>
              <h2>Spend vs. revenue</h2>
              <p>Last 6 months • placeholder data</p>
            </div>
            <span className="portal-pill">
              <span className="portal-pill-dot dot-spent" /> Spent
              <span className="portal-pill-dot dot-returned" /> Returned
            </span>
          </header>
          <div className="portal-chart" aria-hidden="true">
            {analytics.history.map((p) => {
              const spentH = Math.max(6, (p.spent / maxBar) * 100);
              const returnedH = Math.max(6, (p.returned / maxBar) * 100);
              return (
                <div key={p.label} className="portal-chart-col">
                  <div className="portal-chart-bars">
                    <span
                      className="portal-chart-bar bar-spent"
                      style={{ height: `${spentH}%` }}
                      title={`Spent ${formatCurrency(p.spent)}`}
                    />
                    <span
                      className="portal-chart-bar bar-returned"
                      style={{ height: `${returnedH}%` }}
                      title={`Returned ${formatCurrency(p.returned)}`}
                    />
                  </div>
                  <span className="portal-chart-label">{p.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="portal-card">
          <header className="portal-card-head">
            <div>
              <h2>Funnel snapshot</h2>
              <p>Across all live channels</p>
            </div>
          </header>
          <ul className="portal-funnel">
            <li>
              <span>Impressions</span>
              <strong>{formatNumber(analytics.impressions)}</strong>
            </li>
            <li>
              <span>Clicks</span>
              <strong>{formatNumber(analytics.clicks)}</strong>
              <em>{ctr}% CTR</em>
            </li>
            <li>
              <span>Conversions</span>
              <strong>{formatNumber(analytics.conversions)}</strong>
              <em>{conversionRate}% CVR</em>
            </li>
            <li>
              <span>Qualified leads</span>
              <strong>{formatNumber(analytics.leads_this_month)}</strong>
              <em>this month</em>
            </li>
          </ul>
        </section>

        <section className="portal-card portal-quotes-card">
          <header className="portal-card-head">
            <div>
              <h2>Recent quote requests</h2>
              <p>{quotes.length === 0 ? 'No quote requests yet.' : `${quotes.length} total`}</p>
            </div>
            <Link to="/portal/quotes" className="portal-link-pill">View all →</Link>
          </header>
          {quotes.length === 0 ? (
            <div className="portal-empty-state">
              <p>
                When you submit a quote it'll show up here so you can track
                its status.
              </p>
              <Link to="/quote" className="btn btn-primary">Request a quote</Link>
            </div>
          ) : (
            <ul className="portal-quotes-list">
              {quotes.slice(0, 4).map((q) => (
                <li key={q.id}>
                  <div className="portal-quote-meta">
                    <strong>{q.service_name}</strong>
                    <span>
                      {new Date(q.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`portal-status status-${q.status}`}>
                    {q.status.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
