import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Packages from './components/Packages';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';

export default function App() {
  const [authOpen, setAuthOpen] = useState<boolean>(false);

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
