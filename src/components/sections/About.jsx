import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SKILLS = ['User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems', 'Accessibility'];

export default function About() {
  const root = useRef(null);
  const mediaRef = useRef(null);
  const avatarRef = useRef(null);
  const tiltRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about__reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 30%', toggleActions: 'play reverse play reverse' },
      });

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        gsap.from(mediaRef.current, {
          opacity: 0,
          y: 64,
          scale: 0.9,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: mediaRef.current, start: 'top 84%', toggleActions: 'play none none reverse' },
        });
      }
    }, root);

    // Interactive 3D tilt toward the cursor (fine pointers only).
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let cleanupTilt;
    if (finePointer) {
      const el = avatarRef.current;
      const tilt = tiltRef.current;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(tilt, { rotateY: px * 18, rotateX: -py * 18, duration: 0.6, ease: 'power3.out', transformPerspective: 900, transformOrigin: 'center' });
      };
      const onLeave = () => gsap.to(tilt, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'power3.out' });
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanupTilt = () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }

    return () => { ctx.revert(); if (cleanupTilt) cleanupTilt(); };
  }, []);

  return (
    <section className="about" id="about" ref={root}>
      <div className="container about__grid">
        <figure className="about__media" ref={mediaRef}>
          <div className="about__avatar" ref={avatarRef}>
            <div className="about__avatar-tilt" ref={tiltRef}>
              <span className="about__avatar-ring" aria-hidden="true" />
              <div className="about__avatar-img" role="img" aria-label="Schaigan Farooq" />
            </div>
          </div>
          <figcaption className="about__caption">
            <span className="about__caption-name">Schaigan Farooq</span>
            <span className="about__caption-role">UI/UX Designer</span>
          </figcaption>
        </figure>

        <div className="about__content">
          <p className="eyebrow about__reveal">About</p>
          <h2 className="about__lead display about__reveal">
            Design that gets out of the way.
          </h2>
          <p className="about__body about__reveal">
            I'm Schaigan Farooq, a UI/UX designer who turns complex problems into simple,
            intuitive interfaces. My process is grounded in empathy and research: understanding
            real users, mapping journeys, and validating ideas before a pixel is polished.
          </p>
          <p className="about__body about__reveal">
            I work across the full design lifecycle, collaborating closely with developers to ship
            products that feel effortless.
          </p>
          <ul className="about__skills about__reveal">
            {SKILLS.map((s, i) => (
              <li className="about__skill" key={s}>
                <span className="about__skill-n">0{i + 1}</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
