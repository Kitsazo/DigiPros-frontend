import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useTilt } from '../hooks/useTilt';
import type { Service } from '../auth/types';
import './Services.css';

const OFFERINGS: { name: string; tagline: string; icon: string }[] = [
  {
    name: 'Brand strategy',
    tagline: 'Positioning, identity, and voice systems.',
    icon: 'strategy',
  },
  {
    name: 'Paid advertising',
    tagline: 'Meta, Google, TikTok — full-funnel.',
    icon: 'ads',
  },
  {
    name: 'Search engine optimization',
    tagline: 'Technical SEO, content, and links.',
    icon: 'seo',
  },
  {
    name: 'Content & video',
    tagline: 'Editorial, long-form, short-form.',
    icon: 'content',
  },
  {
    name: 'Web design & dev',
    tagline: 'Marketing sites and landing pages.',
    icon: 'web',
  },
  {
    name: 'Email & CRM',
    tagline: 'Lifecycle automation that converts.',
    icon: 'email',
  },
  {
    name: 'Analytics & attribution',
    tagline: 'GA4, dashboards, and clean reporting.',
    icon: 'analytics',
  },
  {
    name: 'Social media',
    tagline: 'Always-on presence with engagement.',
    icon: 'social',
  },
];

export const FULL_SERVICE_FALLBACK: Service = {
  slug: 'full-service',
  name: 'Full-service marketing partner',
  tagline: 'One team. Every channel. Every deliverable.',
  description:
    "DigiPros is your end-to-end marketing partner. Strategy, paid media, SEO, content, web, email, analytics, and social — all under one roof, scoped to your business and your goals. One contract, one team, one set of dashboards.",
  starts_at: 'Custom — tailored per engagement',
  deliverables: OFFERINGS.map((o) => `${o.name} — ${o.tagline}`),
  icon: 'bundle',
};

export default function Services() {
  const tilt = useTilt<HTMLDivElement>({ max: 4, lift: 3 });

  return (
    <section id="services" className="services section">
      <div className="services-bg" aria-hidden="true">
        <span className="services-blob services-blob-blue" />
        <span className="services-blob services-blob-yellow" />
      </div>

      <div className="container services-inner">
        <Reveal className="services-head">
          <span className="eyebrow">What we do</span>
          <h2 className="services-title">
            One team. Every channel. <span className="services-title-accent">Built for growth.</span>
          </h2>
          <p className="services-sub">
            DigiPros is a full-stack marketing partner — not a list of menu items.
            You get every discipline under one roof, one contract, and one team
            obsessed with your numbers.
          </p>
        </Reveal>

        <Reveal direction="up" delay={120}>
          <div
            className="service-bundle"
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
          >
            <div className="service-bundle-spotlight" aria-hidden="true" />
            <div className="service-bundle-glow" aria-hidden="true" />

            <div className="service-bundle-head">
              <span className="service-bundle-badge">
                <span className="service-bundle-badge-dot" />
                Full-service partnership
              </span>
              <h3 className="service-bundle-title">
                Everything you need to grow — in one engagement.
              </h3>
              <p className="service-bundle-tagline">
                Strategy, creative, channels, and analytics, scoped together so
                they actually compound month over month.
              </p>
            </div>

            <ul className="service-bundle-grid">
              {OFFERINGS.map((o, i) => (
                <li
                  key={o.name}
                  className="service-bundle-item"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="service-bundle-icon" aria-hidden="true">
                    <ServiceIcon slug={o.icon} />
                  </span>
                  <div>
                    <strong>{o.name}</strong>
                    <span>{o.tagline}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="service-bundle-foot">
              <div className="service-bundle-pricing">
                <span className="service-bundle-pricing-label">Pricing</span>
                <strong>Custom — tailored per engagement</strong>
                <span className="service-bundle-pricing-sub">
                  Engagement scope is built around your goals, budget, and
                  business stage. Most retainers start between $2,500 and
                  $25,000 / mo.
                </span>
              </div>
              <Link
                to={`/quote?service=${FULL_SERVICE_FALLBACK.slug}`}
                className="btn btn-primary service-bundle-cta"
              >
                Get a free quote
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <ul className="services-promises">
            <li>
              <span className="services-promise-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z" />
                </svg>
              </span>
              <div>
                <strong>One team, one contract</strong>
                <span>No agency-of-record juggling. Everything lands in one Slack channel and one dashboard.</span>
              </div>
            </li>
            <li>
              <span className="services-promise-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l5-5 4 4 8-9" />
                  <path d="M14 7h6v6" />
                </svg>
              </span>
              <div>
                <strong>Reported on outcomes</strong>
                <span>We tie every channel back to revenue, ROAS, and pipeline — not vanity metrics.</span>
              </div>
            </li>
            <li>
              <span className="services-promise-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <strong>Move in weeks, not quarters</strong>
                <span>From signed quote to live campaigns in 2–4 weeks for most clients.</span>
              </div>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

interface IconProps {
  slug: string;
}

function ServiceIcon({ slug }: IconProps) {
  const common = {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (slug) {
    case 'strategy':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 'ads':
      return (
        <svg {...common}>
          <path d="M3 17l5-5 4 4 8-9" />
          <path d="M14 7h6v6" />
        </svg>
      );
    case 'seo':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case 'content':
      return (
        <svg {...common}>
          <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
          <path d="M8 9h8M8 13h6M8 17h4" />
        </svg>
      );
    case 'web':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 22h8" />
        </svg>
      );
    case 'email':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case 'analytics':
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <rect x="7" y="11" width="3" height="8" />
          <rect x="12" y="7" width="3" height="12" />
          <rect x="17" y="13" width="3" height="6" />
        </svg>
      );
    case 'social':
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.6 13.5l6.8 3" />
          <path d="M8.6 10.5l6.8-3" />
        </svg>
      );
    default:
      return null;
  }
}
