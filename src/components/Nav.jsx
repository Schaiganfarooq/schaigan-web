import { useEffect, useState } from 'react';
import './nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Activate the glassy bar once the page scrolls away from the hero.
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a href="#top" className="nav__brand" onClick={go('top')}>
        <span className="nav__star">✦</span>
        <span>Schaigan</span>
      </a>

      <button
        className="nav__burger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span></span><span></span><span></span>
      </button>

      <div className="nav__menu">
        <nav className="nav__links">
          <a href="#about" onClick={go('about')}>About</a>
          <a href="#work" onClick={go('work')}>Work</a>
          <a href="#contact" onClick={go('contact')}>Contact</a>
        </nav>
        <a href="mailto:shagifarooq@gmail.com" className="nav__cta" onClick={() => setOpen(false)}>
          Let's talk
        </a>
      </div>
    </header>
  );
}
