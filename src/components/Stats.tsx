import { useMemo, useRef } from 'react';
import StatVisual from './StatVisual';
import {
  lerp,
  scrollToStageProgress,
  useScrollStage,
} from '../hooks/useScrollStage';
import './Stats.css';

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  decimals?: number;
}

export const STATS: StatItem[] = [
  {
    value: 12,
    prefix: '$',
    suffix: 'M+',
    label: 'Ad spend managed',
    detail: 'Across Meta, Google, and TikTok',
  },
  {
    value: 120,
    suffix: '+',
    label: 'Campaigns launched',
    detail: 'From local shops to regional brands',
  },
  {
    value: 3.6,
    suffix: '×',
    label: 'Average ROAS',
    detail: 'Weighted across active accounts',
    decimals: 1,
  },
  {
    value: 94,
    suffix: '%',
    label: 'Client retention',
    detail: 'Year-over-year partnerships',
  },
  {
    value: 2.4,
    suffix: 'M',
    label: 'Leads generated',
    detail: 'Tracked, attributed, and reported',
    decimals: 1,
  },
  {
    value: 48,
    suffix: '',
    label: 'Markets served',
    detail: 'South Georgia and growing nationwide',
  },
];

const TICKER_ITEMS = [
  'Strategy',
  'Paid media',
  'SEO',
  'Content',
  'Web',
  'Email',
  'Analytics',
  'Social',
  'Brand',
  'Creative',
];

function formatValue(value: number, decimals?: number): string {
  if (decimals && decimals > 0) return value.toFixed(decimals);
  return String(Math.round(value));
}

export default function Stats() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollStage(trackRef);

  const segmentCount = STATS.length;
  const scaled = progress * segmentCount;
  const activeIndex = Math.min(Math.floor(scaled), segmentCount - 1);
  const localT = scaled - activeIndex;

  const current = STATS[activeIndex];
  const next = STATS[Math.min(activeIndex + 1, segmentCount - 1)];

  const displayValue = lerp(current.value, next.value, localT);
  const formattedValue = formatValue(
    displayValue,
    current.decimals ?? next.decimals,
  );

  const scrollHint = useMemo(
    () => `${Math.round(progress * 100)}% explored`,
    [progress],
  );

  const jumpToStat = (index: number) => {
    scrollToStageProgress(trackRef, index / segmentCount);
  };

  return (
    <section id="stats" className="stats section section-dark" aria-labelledby="stats-heading">
      <div className="stats-grid-bg" aria-hidden="true" />
      <div className="stats-glow stats-glow-left" aria-hidden="true" />
      <div className="stats-glow stats-glow-right" aria-hidden="true" />

      <div
        ref={trackRef}
        className="stats-scroll-track"
        style={{ height: `${segmentCount * 100}vh` }}
      >
        <div className="stats-sticky">
          <div className="container stats-inner">
            <header className="stats-head">
              <span className="eyebrow eyebrow-on-dark">By the numbers</span>
              <h2 id="stats-heading" className="stats-title">
                Outcomes you can <em>measure</em> — not just admire.
              </h2>
              <p className="stats-sub">
                Scroll to scrub through each metric. The panel stays fixed while
                the numbers and visuals animate in place.
              </p>
              <p className="stats-scroll-hint" aria-live="polite">
                {scrollHint}
              </p>
            </header>

            <div className="stats-stage">
              <aside className="stats-list" aria-label="Performance statistics">
                {STATS.map((stat, i) => (
                  <button
                    key={stat.label}
                    type="button"
                    className={`stats-list-item ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => jumpToStat(i)}
                  >
                    <span className="stats-list-label">{stat.label}</span>
                    <span className="stats-list-detail">{stat.detail}</span>
                  </button>
                ))}
              </aside>

              <div className="stats-spotlight">
                <div className="stats-spotlight-metric">
                  <p className="stats-kicker">Current focus</p>

                  <div className="stats-label-stack">
                    <h3
                      className="stats-spotlight-label"
                      style={{ opacity: 1 - localT }}
                    >
                      {current.label}
                    </h3>
                    <h3
                      className="stats-spotlight-label stats-spotlight-label-next"
                      style={{ opacity: localT }}
                      aria-hidden={localT < 0.02}
                    >
                      {next.label}
                    </h3>
                  </div>

                  <p className="stats-value">
                    {current.prefix ?? next.prefix ?? ''}
                    <span className="stats-value-num">{formattedValue}</span>
                    {localT < 0.5 ? current.suffix : next.suffix}
                  </p>

                  <div className="stats-progress-rail" aria-hidden="true">
                    <span
                      className="stats-progress-fill"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>

                <StatVisual progress={progress} segmentCount={segmentCount} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-ticker" aria-hidden="true">
        <div className="stats-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={`${item}-${i}`} className="stats-ticker-item">
              {item}
              <span className="stats-ticker-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
