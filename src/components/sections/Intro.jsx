import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LINE = 'I design clean, human-centered digital experiences, from research to pixel-perfect prototypes.';

export default function Intro() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro__w', {
        opacity: 0.12,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="intro" id="intro" ref={root}>
      <div className="container">
        <p className="eyebrow intro__tag">✦ Approach</p>
        <p className="intro__text">
          {LINE.split(' ').map((w, i) => (
            <span className="intro__w" key={i}>{w} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
