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
          Marketing that <span className="highlight">moves the needle.</span>
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
