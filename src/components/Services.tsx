import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import type { Service } from '../auth/types';
import './Services.css';

export const OFFERINGS: { name: string; tagline: string; benefit: string }[] = [
  {
    name: 'Brand strategy',
    tagline: 'Your identity, built to last.',
    benefit: 'We create your company\'s look, feel, and message so customers recognize and trust you right away — even before they\'ve done business with you.',
  },
  {
    name: 'Paid advertising',
    tagline: 'Ads that bring buyers, not browsers.',
    benefit: 'We run ads on Facebook, Google, and more to put your business in front of people who are already looking for what you offer — and ready to spend.',
  },
  {
    name: 'Search engine optimization',
    tagline: 'Show up when locals search.',
    benefit: 'We get your business to the top of Google so when someone nearby searches for what you do, they find you first — not your competition.',
  },
  {
    name: 'Content & video',
    tagline: 'Your story, told well.',
    benefit: 'We create posts, videos, and articles that show off what makes your business special and keep customers coming back for more.',
  },
  {
    name: 'Web design & development',
    tagline: 'A website that works as hard as you do.',
    benefit: 'We build you a fast, professional website that makes a great first impression and turns visitors into paying customers.',
  },
  {
    name: 'Email & follow-up',
    tagline: 'Stay top of mind automatically.',
    benefit: 'We set up automatic emails that follow up with new leads and bring back past customers — so you never miss a sale while you\'re busy running your business.',
  },
  {
    name: 'Results tracking',
    tagline: 'Know exactly what\'s working.',
    benefit: 'We track every dollar spent and show you the results in plain language — more customers, more revenue, no guessing, no tech talk.',
  },
  {
    name: 'Social media',
    tagline: 'Keep your community engaged.',
    benefit: 'We keep your social pages active, consistent, and engaging so your business stays top-of-mind in your community every single day.',
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

const INTERVAL_MS = 5000;

export default function Services() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number, dir: 'next' | 'prev' = 'next') => {
    setAnimDir(dir);
    setActive(index);
  };

  const goNext = () => goTo((active + 1) % OFFERINGS.length, 'next');
  const goPrev = () => goTo((active - 1 + OFFERINGS.length) % OFFERINGS.length, 'prev');

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  });

  const offering = OFFERINGS[active];

  return (
    <section id="services" className="services section">
      <div className="services-bg" aria-hidden="true">
        <span className="services-blob services-blob-blue" />
        <span className="services-blob services-blob-yellow" />
      </div>

      <div className="container services-inner">
        <div className="services-layout">
          {/* Left panel */}
          <Reveal className="services-left">
            <span className="eyebrow">What we do</span>
            <h2 className="services-title">
              Everything you need to grow —{' '}
              <span className="services-title-accent">in one engagement.</span>
            </h2>
            <p className="services-sub">
              DigiPros is your full-service marketing partner. Strategy, ads,
              SEO, content, web, email, and social — one team, one contract,
              one set of results. Built for businesses right here in South
              Georgia that want real growth, not confusing tech-speak.
            </p>
            <p className="services-pricing">
              <span className="services-pricing-label">Pricing</span>
              <strong>Custom — tailored per engagement</strong>
              <span>Retainers typically start between $2,500 and $25,000 / mo based on your goals and scope.</span>
            </p>
            <Link
              to={`/quote?service=${FULL_SERVICE_FALLBACK.slug}`}
              className="btn btn-primary services-cta"
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
          </Reveal>

          {/* Right panel — cycling card */}
          <Reveal direction="up" delay={120} className="services-right">
            <div
              className="service-card"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Glow */}
              <div className="service-card-glow" aria-hidden="true" />

              {/* Progress dots */}
              <div className="service-card-dots" role="tablist" aria-label="Services">
                {OFFERINGS.map((o, i) => (
                  <button
                    key={o.name}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={o.name}
                    className={`service-card-dot ${i === active ? 'is-active' : ''}`}
                    onClick={() => goTo(i, i > active ? 'next' : 'prev')}
                  />
                ))}
              </div>

              {/* Card content */}
              <div
                key={active}
                className={`service-card-body service-card-body--${animDir}`}
              >
                {/* Illustration */}
                <div className="service-card-illustration" aria-hidden="true">
                  <ServiceIllustration index={active} />
                </div>

                <div className="service-card-text">
                  <p className="service-card-num">
                    {String(active + 1).padStart(2, '0')} / {String(OFFERINGS.length).padStart(2, '0')}
                  </p>
                  <h3 className="service-card-name">{offering.name}</h3>
                  <p className="service-card-tagline">{offering.tagline}</p>
                  <p className="service-card-benefit">{offering.benefit}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="service-card-nav">
                <button
                  className="service-card-btn"
                  onClick={goPrev}
                  aria-label="Previous service"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" /><path d="M11 5l-7 7 7 7" />
                  </svg>
                  Prev
                </button>
                <button
                  className="service-card-btn service-card-btn--next"
                  onClick={goNext}
                  aria-label="Next service"
                >
                  Next
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Promises row */}
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
                <span>No agency juggling. Everything lands in one place, with one team who knows your business.</span>
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
                <strong>Real results, plain language</strong>
                <span>We report on what matters — more customers and more revenue — not confusing numbers.</span>
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
                <strong>Up and running fast</strong>
                <span>From your first call to live campaigns in 2–4 weeks. No months of back-and-forth.</span>
              </div>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceIllustration({ index }: { index: number }) {
  switch (index) {
    case 0: // Brand strategy — concentric rings
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <circle className="svc-ring svc-ring-1" cx="60" cy="60" r="48" />
          <circle className="svc-ring svc-ring-2" cx="60" cy="60" r="32" />
          <circle className="svc-ring svc-ring-3" cx="60" cy="60" r="16" />
          <circle className="svc-dot" cx="60" cy="60" r="6" />
        </svg>
      );
    case 1: // Paid advertising — bar chart growing
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <line x1="16" y1="100" x2="104" y2="100" className="svc-axis" />
          <rect className="svc-bar svc-bar-1" x="24" y="70" width="16" height="30" rx="3" />
          <rect className="svc-bar svc-bar-2" x="52" y="45" width="16" height="55" rx="3" />
          <rect className="svc-bar svc-bar-3" x="80" y="20" width="16" height="80" rx="3" />
          <polyline className="svc-trend" points="32,65 60,40 88,15" />
        </svg>
      );
    case 2: // SEO — magnifying glass sweeping
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <g className="svc-glass">
            <circle cx="50" cy="50" r="26" className="svc-ring svc-ring-2" />
            <line x1="70" y1="70" x2="90" y2="90" className="svc-axis" strokeWidth="8" strokeLinecap="round" />
          </g>
          <line className="svc-result svc-result-1" x1="22" y1="88" x2="60" y2="88" />
          <line className="svc-result svc-result-2" x1="22" y1="96" x2="50" y2="96" />
          <line className="svc-result svc-result-3" x1="22" y1="104" x2="55" y2="104" />
        </svg>
      );
    case 3: // Content & video — play button with ripples
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <circle className="svc-ring svc-ring-1 svc-ripple-1" cx="60" cy="60" r="50" />
          <circle className="svc-ring svc-ring-2 svc-ripple-2" cx="60" cy="60" r="36" />
          <circle className="svc-dot" cx="60" cy="60" r="26" />
          <polygon className="svc-play" points="52,46 52,74 78,60" />
        </svg>
      );
    case 4: // Web design — browser with blinking cursor
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <rect className="svc-browser" x="12" y="22" width="96" height="72" rx="6" />
          <line x1="12" y1="38" x2="108" y2="38" className="svc-axis" />
          <circle cx="24" cy="30" r="3" className="svc-dot-sm svc-dot-r" />
          <circle cx="34" cy="30" r="3" className="svc-dot-sm svc-dot-y" />
          <circle cx="44" cy="30" r="3" className="svc-dot-sm svc-dot-g" />
          <line className="svc-content svc-line-1" x1="24" y1="52" x2="72" y2="52" />
          <line className="svc-content svc-line-2" x1="24" y1="62" x2="88" y2="62" />
          <line className="svc-content svc-line-3" x1="24" y1="72" x2="60" y2="72" />
          <line className="svc-cursor" x1="63" y1="68" x2="63" y2="76" />
        </svg>
      );
    case 5: // Email & follow-up — envelope with checkmark
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <rect className="svc-browser" x="16" y="32" width="88" height="60" rx="6" />
          <polyline className="svc-axis svc-flap" points="16,38 60,68 104,38" />
          <g className="svc-check-badge">
            <circle cx="84" cy="36" r="18" className="svc-dot" />
            <polyline className="svc-check-mark" points="74,36 81,43 94,29" />
          </g>
        </svg>
      );
    case 6: // Results tracking — line chart drawing
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <line x1="16" y1="100" x2="104" y2="100" className="svc-axis" />
          <line x1="16" y1="20" x2="16" y2="100" className="svc-axis" />
          <polyline className="svc-chart-line" points="16,90 36,75 56,60 76,42 96,22" />
          <circle className="svc-chart-dot svc-chart-dot-1" cx="16" cy="90" r="4" />
          <circle className="svc-chart-dot svc-chart-dot-2" cx="36" cy="75" r="4" />
          <circle className="svc-chart-dot svc-chart-dot-3" cx="56" cy="60" r="4" />
          <circle className="svc-chart-dot svc-chart-dot-4" cx="76" cy="42" r="4" />
          <circle className="svc-chart-dot svc-chart-dot-5" cx="96" cy="22" r="4" />
        </svg>
      );
    case 7: // Social media — network nodes
    default:
      return (
        <svg className="svc-illus" viewBox="0 0 120 120">
          <line className="svc-edge svc-edge-1" x1="60" y1="20" x2="20" y2="80" />
          <line className="svc-edge svc-edge-2" x1="60" y1="20" x2="100" y2="80" />
          <line className="svc-edge svc-edge-3" x1="20" y1="80" x2="100" y2="80" />
          <line className="svc-edge svc-edge-4" x1="60" y1="20" x2="60" y2="80" />
          <circle className="svc-node svc-node-top" cx="60" cy="20" r="12" />
          <circle className="svc-node svc-node-bl" cx="20" cy="80" r="9" />
          <circle className="svc-node svc-node-br" cx="100" cy="80" r="9" />
          <circle className="svc-node svc-node-mid" cx="60" cy="80" r="7" />
        </svg>
      );
  }
}
