import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from '../components/About';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import Services from '../components/Services';

export default function Landing() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    const id = hash.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Contact />
    </>
  );
}
