import { useEffect, useRef } from 'react';
import './cursor.css';

/**
 * Custom cursor: a precise dot that tracks 1:1 and a ring that trails with
 * easing. The ring grows over interactive elements and shrinks on press.
 * Uses mix-blend-mode: difference so it reads over both the dark background
 * and the bright particle field. Also wires a subtle magnetic pull to any
 * element marked [data-magnetic]. Fine-pointer devices only.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    let raf;

    const onMove = (e) => { pos.x = e.clientX; pos.y = e.clientY; };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const onEnter = () => { dot.style.opacity = ''; ring.style.opacity = ''; };

    const SEL = 'a, button, [data-cursor-hover]';
    const onOver = (e) => { if (e.target.closest && e.target.closest(SEL)) ring.classList.add('is-hover'); };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(SEL)) {
        const to = e.relatedTarget;
        if (!to || !(to.closest && to.closest(SEL))) ring.classList.remove('is-hover');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const render = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.2;
      ringPos.y += (pos.y - ringPos.y) * 0.2;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(render);
    };
    render();

    /* ---- Magnetic pull for [data-magnetic] elements ---- */
    const magnets = Array.from(document.querySelectorAll('[data-magnetic]'));
    const cleanups = magnets.map((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      };
      const reset = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', reset);
      return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', reset); };
    });

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true"><span className="cursor__ring" /></div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
