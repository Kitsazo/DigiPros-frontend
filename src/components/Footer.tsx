import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-dot" aria-hidden="true" />
          <span>
            DigiPros Marketing<span className="accent">.</span>
          </span>
        </div>
        <p className="footer-copy">
          © {year} DigiPros Marketing. All rights reserved.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <a href="#about">About</a>
          <a href="#packages">Packages</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
