import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './loader.css';

/**
 * Full-screen intro loader with an Unbounded % counter that ticks 0 → 100,
 * then wipes upward to reveal the hero — echoing the original's "100%" intro.
 */
export default function Loader({ onComplete }) {
  const [pct, setPct] = useState(0);
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const state = { v: 0 };
    const tl = gsap.timeline({
      onUpdate: () => setPct(Math.round(state.v)),
    });
    tl.to(state, { v: 100, duration: 2.4, ease: 'power2.inOut' });
    tl.to(barRef.current, { scaleX: 1, duration: 2.4, ease: 'power2.inOut' }, 0);
    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 1.1,
      ease: 'expo.inOut',
      delay: 0.25,
      onStart: () => onComplete && onComplete(),
    });
    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="loader" ref={rootRef}>
      <div className="loader__inner">
        <span className="loader__label eyebrow">Schaigan Farooq</span>
        <div className="loader__count display" ref={countRef}>
          {String(pct).padStart(3, '0')}<span className="loader__pct">%</span>
        </div>
      </div>
      <div className="loader__track">
        <div className="loader__bar" ref={barRef} />
      </div>
    </div>
  );
}
