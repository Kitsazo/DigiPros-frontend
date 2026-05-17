import { useState } from 'react';
import './Packages.css';

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For new brands finding their footing.',
    price: '$750',
    cadence: '/mo',
    features: [
      'Brand & audience audit',
      '1 paid ad channel managed',
      'Weekly performance report',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For teams ready to scale revenue.',
    price: '$1,950',
    cadence: '/mo',
    featured: true,
    features: [
      'Everything in Starter',
      'Up to 3 paid channels',
      'Landing pages & A/B testing',
      'Bi-weekly strategy calls',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Full-stack marketing on retainer.',
    price: '$4,200',
    cadence: '/mo',
    features: [
      'Everything in Growth',
      'Dedicated strategist',
      'Creative production studio',
      'Slack-channel support',
    ],
  },
];

export default function Packages() {
  const [selected, setSelected] = useState('growth');

  return (
    <section id="packages" className="packages section">
      <div className="container packages-inner">
        <div className="packages-head">
          <span className="eyebrow">Packages</span>
          <h2 className="packages-title">Pick the plan that fits your stage.</h2>
          <p className="packages-sub">
            Hover to explore. Click to select the package you want to chat
            about — we'll tailor it to your goals before kickoff.
          </p>
        </div>

        <div className="packages-grid" role="radiogroup" aria-label="Packages">
          {packages.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(p.id)}
                className={[
                  'package-card',
                  p.featured ? 'is-featured' : '',
                  isSelected ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {p.featured && <span className="package-badge">Most popular</span>}
                <div className="package-head">
                  <h3>{p.name}</h3>
                  <p className="package-tagline">{p.tagline}</p>
                </div>

                <div className="package-price">
                  <span className="amount">{p.price}</span>
                  <span className="cadence">{p.cadence}</span>
                </div>

                <ul className="package-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <span className="package-select">
                  {isSelected ? 'Selected' : 'Select plan'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="packages-foot">
          <a href="#contact" className="btn btn-primary">
            Continue with{' '}
            {packages.find((p) => p.id === selected)?.name ?? 'this plan'}
          </a>
        </div>
      </div>
    </section>
  );
}
