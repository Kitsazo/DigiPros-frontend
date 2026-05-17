import './About.css';

const features = [
  {
    title: 'Strategy first',
    body: 'Every campaign starts with research, positioning, and a clear plan — not guesswork.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    title: 'Performance ads',
    body: 'Meta, Google, and TikTok campaigns optimized weekly to drive measurable ROAS.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l5-5 4 4 8-9" />
        <path d="M14 7h6v6" />
      </svg>
    ),
  },
  {
    title: 'Creative that converts',
    body: 'Scroll-stopping content built for the platform — from short-form video to landing pages.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" />
        <path d="M2 2l7.5 7.5" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container about-inner">
        <div className="about-head">
          <span className="eyebrow">Why DigiPros</span>
          <h2 className="about-title">
            A small team, obsessed with your <em>numbers</em>.
          </h2>
          <p className="about-sub">
            We blend strategy, design, and analytics into one tight loop — so
            your marketing actually compounds month over month.
          </p>
        </div>

        <ul className="about-grid">
          {features.map((f) => (
            <li key={f.title} className="about-card">
              <span className="about-card-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
