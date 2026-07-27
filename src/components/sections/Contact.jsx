import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Contact() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__big .hero__word, .contact__big span', {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="container">
        <p className="eyebrow contact__eyebrow">✦ Let's work together</p>
        <a className="contact__big display" href="mailto:shagifarooq@gmail.com">
          <span className="contact__line">Get in</span>
          <span className="contact__line">touch <i className="contact__arrow">↗</i></span>
        </a>

        <div className="contact__row">
          <a href="mailto:shagifarooq@gmail.com" className="contact__mail">shagifarooq@gmail.com</a>
          <div className="contact__socials">
            <a href="https://github.com/Schaiganfarooq" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://schaiganfarooq.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          </div>
        </div>

        <footer className="contact__footer">
          <span>© {year} Schaigan Farooq</span>
          <span>Designed &amp; built with care</span>
        </footer>
      </div>
    </section>
  );
}
