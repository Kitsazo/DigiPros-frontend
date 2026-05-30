import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrandLogo height={28} />
        </div>
        <p className="footer-copy">
          © {year} DigiPros Marketing. All rights reserved.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/#about">About</Link>
          <Link to="/#stats">Results</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#contact">Contact</Link>
          <Link to="/portal">Portal</Link>
        </nav>
      </div>
    </footer>
  );
}
