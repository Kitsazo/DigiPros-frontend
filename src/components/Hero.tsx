import { useRef, useState } from 'react';
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

/** Longest phrase — invisible sizer keeps layout from jumping while words cycle. */
const ROTATOR_MEASURE = 'grows revenue.';

export default function Hero() {
  const primaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const isTransitioningRef = useRef(false);
  const [activeLayer, setActiveLayer] = useState<'primary' | 'secondary'>('primary');

  const word = useTypewriter(ROTATING_WORDS, {
    typeSpeed: 65,
    eraseSpeed: 34,
    holdMs: 1700,
    pauseMs: 280,
  });

  const handleVideoTimeUpdate = () => {
    if (isTransitioningRef.current) return;

    const currentVideo =
      activeLayer === 'primary' ? primaryVideoRef.current : secondaryVideoRef.current;
    const nextVideo =
      activeLayer === 'primary' ? secondaryVideoRef.current : primaryVideoRef.current;

    if (!currentVideo || !nextVideo || !Number.isFinite(currentVideo.duration)) return;

    const crossfadeMs = 700;
    const secondsRemaining = currentVideo.duration - currentVideo.currentTime;
    if (secondsRemaining > crossfadeMs / 1000 + 0.06) return;

    isTransitioningRef.current = true;
    nextVideo.currentTime = 0;
    void nextVideo.play();
    setActiveLayer((prev) => (prev === 'primary' ? 'secondary' : 'primary'));

    window.setTimeout(() => {
      currentVideo.pause();
      currentVideo.currentTime = 0;
      isTransitioningRef.current = false;
    }, crossfadeMs + 60);
  };

  return (
    <section id="top" className="hero section">
      <div className="hero-bg" aria-hidden="true">
        <video
          ref={primaryVideoRef}
          className={`hero-video hero-video-primary${
            activeLayer === 'primary' ? ' hero-video-active' : ''
          }`}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={activeLayer === 'primary' ? handleVideoTimeUpdate : undefined}
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <video
          ref={secondaryVideoRef}
          className={`hero-video hero-video-secondary${
            activeLayer === 'secondary' ? ' hero-video-active' : ''
          }`}
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={activeLayer === 'secondary' ? handleVideoTimeUpdate : undefined}
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-edge-glow hero-video-edge-glow-left" />
        <div className="hero-video-edge-glow hero-video-edge-glow-right" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            DigiPros Marketing
          </span>

          <h1 className="hero-title">
            <span className="hero-title-static">Marketing that</span>
            <span className="hero-rotator-slot" aria-live="polite">
              <span className="hero-rotator-measure" aria-hidden="true">
                {ROTATOR_MEASURE}
              </span>
              <span className="hero-rotator">
                <span className="hero-rotator-text">{word}</span>
                <span className="hero-cursor" aria-hidden="true" />
              </span>
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
