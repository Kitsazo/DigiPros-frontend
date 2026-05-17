import './Contact.css';

const channels = [
  {
    label: 'Email us',
    value: 'hello@digipros.marketing',
    href: 'mailto:hello@digipros.marketing',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'Call us',
    value: '+1 (555) 010-1234',
    href: 'tel:+15550101234',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Book a call',
    value: 'Pick a 30-min slot',
    href: 'https://cal.com/',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-card">
          <div className="contact-card-bg" aria-hidden="true" />

          <div className="contact-text">
            <span className="eyebrow">Let's talk</span>
            <h2 className="contact-title">
              Ready to grow with <span className="accent">DigiPros</span>?
            </h2>
            <p className="contact-sub">
              Tell us about your business — we'll send back a tailored proposal
              within two business days. No hard sells, ever.
            </p>
          </div>

          <div className="contact-actions">
            {channels.map((c) => (
              <a key={c.label} href={c.href} className="contact-chip">
                <span className="contact-chip-icon">{c.icon}</span>
                <span className="contact-chip-text">
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
