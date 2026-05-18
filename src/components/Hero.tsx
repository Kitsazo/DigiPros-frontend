import './Hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero section">
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob-blue" />
        <div className="blob blob-yellow" />
        <div className="grid" />
      </div>

      <div className="container hero-inner">
        <span className="eyebrow">DigiPros Marketing</span>
        <h1 className="hero-title">
          <span className="hero-title-text">
            Marketing that <span className="highlight">moves the needle.</span>
          </span>

          <svg
            className="hero-title-snakes"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <defs>
              <filter
                id="hero-snake-blur"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="1.4" />
              </filter>
            </defs>
            <g filter="url(#hero-snake-blur)">
              {[1, 2, 3].map((i) => (
                <g key={i} className={`hero-snake hero-snake-${i}`}>
                  <text x="50%" y="0.86em" textAnchor="middle">
                    Marketing that
                  </text>
                  <text x="50%" y="1.96em" textAnchor="middle">
                    moves the needle.
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </h1>
        <p className="hero-sub">
          We help ambitious brands grow with sharp strategy, performance ads,
          and content that actually converts. Less noise, more numbers.
        </p>

        <div className="hero-cta">
          <a href="#contact" className="btn btn-primary">
            Book a free consult
          </a>
          <a href="#packages" className="btn btn-ghost">
            View packages
          </a>
        </div>

        <ul className="hero-stats" aria-label="At a glance">
          <li>
            <strong>120+</strong>
            <span>Campaigns launched</span>
          </li>
          <li>
            <strong>4.9★</strong>
            <span>Average client rating</span>
          </li>
          <li>
            <strong>3.6×</strong>
            <span>Avg. return on ad spend</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
