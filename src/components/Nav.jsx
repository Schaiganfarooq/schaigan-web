import { useEffect, useState } from 'react';
import './nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Activate the glassy bar once the page scrolls away from the hero.
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="nav__brand" onClick={go('top')}>
        <span className="nav__star">✦</span>
        <span>Schaigan</span>
      </a>
      <nav className="nav__links">
        <a href="#work" onClick={go('work')}>Work</a>
        <a href="#about" onClick={go('about')}>About</a>
        <a href="#contact" onClick={go('contact')}>Contact</a>
      </nav>
      <a href="mailto:shagifarooq@gmail.com" className="nav__cta">Let's talk</a>
    </header>
  );
}
