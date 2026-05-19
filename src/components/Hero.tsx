import { Link } from 'react-router-dom';
import { useTypewriter } from '../hooks/useTypewriter';
import HeroDashboard from './HeroDashboard';
import './Hero.css';

const ROTATING_WORDS = [
  'converts.',
  'scales.',
  'ranks.',
  'drives leads.',
  'grows revenue.',
  'compounds.',
];

export default function Hero() {
  const word = useTypewriter(ROTATING_WORDS, {
    typeSpeed: 65,
    eraseSpeed: 34,
    holdMs: 1700,
    pauseMs: 280,
  });

  return (
    <section id="top" className="hero section">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-blob hero-blob-blue" />
        <div className="hero-blob hero-blob-yellow" />
        <div className="hero-blob hero-blob-violet" />
        <div className="hero-glow" />
        <div className="hero-particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: `${(i * 5.5) % 100}%`,
                animationDelay: `${(i % 6) * 0.6}s`,
                animationDuration: `${10 + (i % 5) * 1.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            DigiPros Marketing
          </span>

          <h1 className="hero-title">
            Marketing that{' '}
            <span className="hero-rotator">
              <span className="hero-rotator-text">{word}</span>
              <span className="hero-cursor" aria-hidden="true" />
            </span>
          </h1>

          <p className="hero-sub">
            We're your full-stack marketing team — strategy, performance ads,
            content, SEO, and analytics — under one contract, with one
            dashboard, and one team obsessed with your numbers.
          </p>

          <div className="hero-cta">
            <Link to="/quote" className="btn btn-primary hero-cta-primary">
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
            <a href="#services" className="btn btn-ghost hero-cta-ghost">
              See what we do
            </a>
          </div>

          <ul className="hero-trust" aria-label="At a glance">
            <li>
              <strong>120+</strong>
              <span>Campaigns launched</span>
            </li>
            <li>
              <strong>3.6×</strong>
              <span>Average ROAS</span>
            </li>
            <li>
              <strong>4.9★</strong>
              <span>Client rating</span>
            </li>
          </ul>
        </div>

        <div className="hero-visual">
          <HeroDashboard />
        </div>
      </div>

      <a className="hero-scroll-hint" href="#about" aria-label="Scroll to next section">
        <span className="hero-scroll-mouse">
          <span className="hero-scroll-wheel" />
        </span>
        <span className="hero-scroll-label">Scroll</span>
      </a>
    </section>
  );
}
