import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const root = useRef(null);
  const titleRef = useRef(null);
  const hintRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro reveal after the loader
      gsap.from('.hero__word', {
        yPercent: 120,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.15,
      });
      gsap.from([subRef.current, hintRef.current], {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        delay: 0.9,
        stagger: 0.1,
      });

      // Scroll-driven: title flies toward the viewer & fades, hint fades fast
      gsap.to(titleRef.current, {
        scale: 2.4,
        opacity: 0,
        filter: 'blur(14px)',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '75% top',
          scrub: 1,
        },
      });
      gsap.to(hintRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '12% top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__sticky">
        <div className="hero__center" ref={titleRef}>
          <p className="eyebrow hero__eyebrow" ref={subRef}>UI/UX Designer · Portfolio ’26</p>
          <h1 className="display hero__title">
            <span className="hero__line"><span className="hero__word">Schaigan</span></span>
            <span className="hero__line"><span className="hero__word">Farooq</span></span>
          </h1>
        </div>
        <div className="hero__hint" ref={hintRef}>
          <span className="hero__hintline" />
          <span>Scroll to fly</span>
        </div>
      </div>
    </section>
  );
}
