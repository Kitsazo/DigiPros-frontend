import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Packages from './components/Packages.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import AuthCallback from './components/AuthCallback.jsx';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  return (
    <div className="app">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main>
        <Hero />
        <About />
        <Packages />
        <Contact />
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
