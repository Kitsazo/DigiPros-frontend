import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../auth/api';
import type { Service } from '../auth/types';
import './Services.css';

const FALLBACK_SERVICES: Service[] = [
  {
    slug: 'brand-strategy',
    name: 'Brand Strategy & Identity',
    tagline: 'Sharpen positioning, voice, and visual identity.',
    description:
      'Workshops, market research, and identity systems that give your brand a confident, recognizable voice.',
    starts_at: 'from $3,500',
    deliverables: [
      'Brand audit & competitive analysis',
      'Positioning + messaging framework',
      'Logo, color, and type system',
      'Brand guidelines document',
    ],
    icon: 'strategy',
  },
  {
    slug: 'paid-advertising',
    name: 'Paid Advertising',
    tagline: 'Performance ads across Meta, Google, and TikTok.',
    description:
      'Full-funnel campaign management with creative testing, audience research, and weekly optimization.',
    starts_at: 'from $1,500 / mo',
    deliverables: [
      'Channel strategy & account setup',
      'Creative production & testing',
      'Weekly optimization sprints',
      'Live performance dashboards',
    ],
    icon: 'ads',
  },
  {
    slug: 'seo',
    name: 'Search Engine Optimization',
    tagline: 'Rank for the queries that grow your pipeline.',
    description:
      'Technical SEO audits, content roadmaps, and link building to compound organic traffic month over month.',
    starts_at: 'from $1,200 / mo',
    deliverables: [
      'Technical audit & fixes',
      'Keyword + content strategy',
      'On-page optimization',
      'Authority + link building',
    ],
    icon: 'seo',
  },
  {
    slug: 'content-marketing',
    name: 'Content Marketing',
    tagline: 'Editorial, video, and social that actually converts.',
    description:
      'Editorial calendars, long-form content, and short-form video built around what your audience is searching for.',
    starts_at: 'from $2,000 / mo',
    deliverables: [
      'Editorial calendar',
      'Long-form articles & guides',
      'Short-form video production',
      'Distribution & repurposing',
    ],
    icon: 'content',
  },
  {
    slug: 'web-design',
    name: 'Web Design & Development',
    tagline: 'Marketing sites and landing pages that close.',
    description:
      'High-converting marketing sites and landing pages designed and built to support your growth motion.',
    starts_at: 'from $5,000',
    deliverables: [
      'UX research & wireframes',
      'High-fidelity visual design',
      'Build on Webflow / React / Next',
      'A/B testing harness',
    ],
    icon: 'web',
  },
  {
    slug: 'email-crm',
    name: 'Email & CRM Automation',
    tagline: 'Nurture sequences and lifecycle marketing.',
    description:
      'Lifecycle email programs that convert leads and re-activate customers — without spamming your list.',
    starts_at: 'from $1,000 / mo',
    deliverables: [
      'Lifecycle journey mapping',
      'Template & flow build-out',
      'Segmentation & deliverability',
      'Monthly performance review',
    ],
    icon: 'email',
  },
  {
    slug: 'analytics',
    name: 'Analytics & Attribution',
    tagline: "See what's actually working — across channels.",
    description:
      'GA4, server-side tagging, dashboards, and attribution modeling so you can make confident decisions.',
    starts_at: 'from $2,500',
    deliverables: [
      'Tagging & event plan',
      'GA4 + server-side setup',
      'Dashboard build-out',
      'Quarterly attribution review',
    ],
    icon: 'analytics',
  },
  {
    slug: 'social-media',
    name: 'Social Media Management',
    tagline: 'Always-on social presence with bite.',
    description:
      'Strategy, content production, community management, and reporting for the platforms that matter.',
    starts_at: 'from $1,800 / mo',
    deliverables: [
      'Content pillars & calendar',
      'Daily publishing & engagement',
      'Community management',
      'Monthly insights report',
    ],
    icon: 'social',
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    let alive = true;
    api
      .listServices()
      .then((data) => {
        if (alive && data?.length) setServices(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="services" className="services section">
      <div className="container services-inner">
        <div className="services-head">
          <span className="eyebrow">Services</span>
          <h2 className="services-title">Pick the service. We'll tailor the quote.</h2>
          <p className="services-sub">
            Every engagement is custom-scoped to your business stage, goals,
            and budget. Tell us what you need and we'll send a tailored
            proposal within two business days.
          </p>
        </div>

        <ul className="services-grid">
          {services.map((s, i) => (
            <li
              key={s.slug}
              className="service-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="service-card-head">
                <span className="service-icon" aria-hidden="true">
                  <ServiceIcon slug={s.icon || s.slug} />
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p className="service-tagline">{s.tagline}</p>
                </div>
              </div>

              <p className="service-description">{s.description}</p>

              <ul className="service-deliverables">
                {s.deliverables.map((d) => (
                  <li key={d}>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="service-foot">
                <span className="service-price">{s.starts_at}</span>
                <Link
                  to={`/quote?service=${encodeURIComponent(s.slug)}`}
                  className="btn btn-primary service-cta"
                >
                  Get a quote
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
              </div>
            </li>
          ))}
        </ul>
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
    width: 22,
    height: 22,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (slug) {
    case 'strategy':
    case 'brand-strategy':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 'ads':
    case 'paid-advertising':
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
    case 'content-marketing':
      return (
        <svg {...common}>
          <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
          <path d="M8 9h8M8 13h6M8 17h4" />
        </svg>
      );
    case 'web':
    case 'web-design':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 22h8" />
        </svg>
      );
    case 'email':
    case 'email-crm':
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
    case 'social-media':
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

export function getFallbackServices(): Service[] {
  return FALLBACK_SERVICES;
}

export function findService(slug: string): Service | undefined {
  return FALLBACK_SERVICES.find((s) => s.slug === slug);
}

interface ServiceContentRenderProps {
  children: ReactNode;
}

// Wrapper kept for type compatibility if you ever want to compose services.
export function ServicesContent({ children }: ServiceContentRenderProps) {
  return <>{children}</>;
}
