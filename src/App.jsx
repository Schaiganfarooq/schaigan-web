import { useState, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import useSmoothScroll from './hooks/useSmoothScroll.js';
import Grain from './components/Grain.jsx';
import Loader from './components/Loader.jsx';
import Nav from './components/Nav.jsx';
import FlyHero from './components/hero/FlyHero.jsx';
import Hero from './components/sections/Hero.jsx';
import Intro from './components/sections/Intro.jsx';
import Work from './components/sections/Work.jsx';
import About from './components/sections/About.jsx';
import Contact from './components/sections/Contact.jsx';
import './components/sections/sections.css';

export default function App() {
  const [ready, setReady] = useState(false);

  // Lock scroll until the loader hands off
  useSmoothScroll(true);

  const handleLoaded = useCallback(() => {
    setReady(true);
    if (window.__lenis) window.__lenis.start();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Grain />
      <Loader onComplete={handleLoaded} />
      <FlyHero />
      <Nav />
      <main className={`app ${ready ? 'is-ready' : ''}`}>
        <Hero />
        <Intro />
        <Work />
        <About />
        <Contact />
      </main>
      <Analytics />
    </>
  );
}
