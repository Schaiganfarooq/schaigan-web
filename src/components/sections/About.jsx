import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SKILLS = ['User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems', 'Accessibility'];

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-linked reveal: progress is tied to scroll position, so scrolling
      // up rewinds it in perfect sync (like the scroll-jacked original).
      gsap.from('.about__reveal', {
        y: 55,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 42%', scrub: 1 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={root}>
      <div className="container about__grid">
        <div className="about__left">
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
        </div>
        <div className="about__right">
          <ul className="about__skills">
            {SKILLS.map((s, i) => (
              <li className="about__skill about__reveal" key={s}>
                <span className="about__skill-n">0{i + 1}</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
