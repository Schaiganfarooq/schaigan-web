import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SKILLS = ['User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems', 'Accessibility'];

export default function About() {
  const root = useRef(null);
  const frameRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text + skills reveal (bidirectional, matching the rest of the page)
      gsap.from('.about__reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 30%', toggleActions: 'play reverse play reverse' },
      });

      // Premium portrait unveil: a mask-wipe on the frame + a slow zoom-out on
      // the image. clip-path is on the frame, scale is on an inner wrapper, so
      // neither collides with the image's own hover transform.
      // Skipped for reduced-motion users so the photo is simply shown.
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        const st = { trigger: frameRef.current, start: 'top 82%', toggleActions: 'play none none reverse' };
        gsap.fromTo(
          frameRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: st }
        );
        gsap.fromTo(
          innerRef.current,
          { scale: 1.35, yPercent: 6 },
          { scale: 1, yPercent: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: st }
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={root}>
      <div className="container about__grid">
        <figure className="about__media">
          <div className="about__portrait" ref={frameRef}>
            <div className="about__portrait-inner" ref={innerRef}>
              <img
                src="/portrait.jpg"
                alt="Schaigan Farooq"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className="about__index">(01)</span>
          </div>
          <figcaption className="about__caption">
            <span>Schaigan Farooq</span>
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
