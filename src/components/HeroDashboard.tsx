import { useEffect, useState } from 'react';
import { useTilt } from '../hooks/useTilt';
import './HeroDashboard.css';

// Two paired datasets so the chart smoothly morphs between them.
const SERIES_A: number[] = [12, 18, 22, 19, 28, 33, 38, 44, 52, 49, 58, 64];
const SERIES_B: number[] = [14, 20, 17, 25, 30, 28, 36, 40, 47, 55, 60, 70];
const LABELS: string[] = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface AreaPath {
  area: string;
  line: string;
}

function buildPath(values: number[]): AreaPath {
  const width = 320;
  const height = 110;
  const padX = 6;
  const innerW = width - padX * 2;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = height - 6 - ((v - min) / range) * (height - 16);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const area = `${line} L ${points.at(-1)?.[0].toFixed(1)} ${height} L ${points[0][0].toFixed(1)} ${height} Z`;

  return { area, line };
}

export default function HeroDashboard() {
  const tilt = useTilt<HTMLDivElement>({ max: 5, lift: 4 });
  const [phase, setPhase] = useState<0 | 1>(0);
  const [revenue, setRevenue] = useState<number>(48230);
  const [leads, setLeads] = useState<number>(142);
  const [roas, setRoas] = useState<number>(3.6);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((p) => (p === 0 ? 1 : 0));
      setRevenue((r) => Math.round(r + 230 + Math.random() * 480));
      setLeads((l) => l + 1 + Math.floor(Math.random() * 3));
      setRoas((r) => +(r + (Math.random() - 0.4) * 0.08).toFixed(2));
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const path = buildPath(phase === 0 ? SERIES_A : SERIES_B);

  return (
    <div
      className="hero-dash"
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className="hero-dash-glow" aria-hidden="true" />

      <div className="hero-dash-card hero-dash-main">
        <header className="hero-dash-head">
          <div>
            <span className="hero-dash-label">Live performance</span>
            <strong className="hero-dash-title">DigiPros Console</strong>
          </div>
          <span className="hero-dash-pill">
            <span className="hero-dash-dot" /> Live
          </span>
        </header>

        <div className="hero-dash-stats">
          <div className="hero-dash-stat">
            <span>Revenue</span>
            <strong>
              ${revenue.toLocaleString()}
              <em>↑</em>
            </strong>
          </div>
          <div className="hero-dash-stat">
            <span>Leads</span>
            <strong>
              {leads}
              <em>↑</em>
            </strong>
          </div>
          <div className="hero-dash-stat">
            <span>ROAS</span>
            <strong>
              {roas.toFixed(2)}×<em className={roas >= 3.5 ? 'pos' : 'neg'}>
                {roas >= 3.5 ? '↑' : '↓'}
              </em>
            </strong>
          </div>
        </div>

        <div className="hero-dash-chart" aria-hidden="true">
          <svg
            viewBox="0 0 320 120"
            preserveAspectRatio="none"
            className="hero-dash-svg"
          >
            <defs>
              <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-blue-bright)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-blue-bright)" />
                <stop offset="100%" stopColor="var(--color-yellow)" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="0"
                x2="320"
                y1={120 * p}
                y2={120 * p}
                stroke="currentColor"
                strokeOpacity="0.07"
                strokeDasharray="3 5"
              />
            ))}

            <path d={path.area} fill="url(#heroAreaGrad)">
              <animate
                attributeName="d"
                dur="2.8s"
                fill="freeze"
                to={path.area}
                begin="indefinite"
              />
            </path>
            <path
              d={path.line}
              fill="none"
              stroke="url(#heroLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-dash-line"
            />
          </svg>
          <div className="hero-dash-xaxis">
            {LABELS.map((l, i) => (
              <span key={`${l}-${i}`}>{l}</span>
            ))}
          </div>
        </div>

        <ul className="hero-dash-channels">
          {[
            { name: 'Meta Ads', value: '+24%', kind: 'pos' },
            { name: 'Google', value: '+18%', kind: 'pos' },
            { name: 'Organic', value: '+9%', kind: 'pos' },
            { name: 'Email', value: '+12%', kind: 'pos' },
          ].map((c) => (
            <li key={c.name}>
              <span className="hero-dash-channel-name">{c.name}</span>
              <span className={`hero-dash-channel-value ${c.kind}`}>{c.value}</span>
              <span className="hero-dash-channel-bar" aria-hidden="true">
                <span style={{ width: `${parseInt(c.value, 10) * 3}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-dash-float hero-dash-float-1" aria-hidden="true">
        <span className="hero-dash-float-label">New conversion</span>
        <strong>+$1,420</strong>
        <span className="hero-dash-float-meta">Meta · Now</span>
      </div>

      <div className="hero-dash-float hero-dash-float-2" aria-hidden="true">
        <span className="hero-dash-float-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l5-5 4 4 8-9" />
            <path d="M14 7h6v6" />
          </svg>
        </span>
        <div>
          <strong>CTR up 36%</strong>
          <span>last 7 days</span>
        </div>
      </div>

      <div className="hero-dash-float hero-dash-float-3" aria-hidden="true">
        <div className="hero-dash-float-avatars">
          <span style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)' }}>K</span>
          <span style={{ background: 'linear-gradient(135deg,#facc15,#f59e0b)' }}>D</span>
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>+</span>
        </div>
        <div>
          <strong>Strategy team</strong>
          <span>Online · 3 active</span>
        </div>
      </div>
    </div>
  );
}
