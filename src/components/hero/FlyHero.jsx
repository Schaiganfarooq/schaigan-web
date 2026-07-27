import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './flyhero.css';

/**
 * A fixed, full-screen WebGL particle field. Scrolling flies the camera
 * forward through an endless tunnel of stars — a comparable take on the
 * original "scroll to fly" experience (custom shaders, size attenuation,
 * soft round points, mouse parallax).
 */
export default function FlyHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Lighter load on phones: fewer particles, lower pixel ratio, no MSAA.
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const maxDpr = isMobile ? 1.5 : 2;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x121010, 0.0022);

    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 2000);
    camera.position.set(0, 0, 60);

    // --- Particle field: a long tunnel of stars along -Z ---
    const COUNT = isMobile ? 2600 : 5200;
    const DEPTH = 900;      // total length of the tunnel
    const RADIUS = 130;     // tunnel radius
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 0.5) * RADIUS;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = -Math.random() * DEPTH + 80;
      scales[i] = 0.5 + Math.random() * 2.4;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, maxDpr) },
        uColor: { value: new THREE.Color(0xf4f2f0) },
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          // gentle organic drift so the field feels alive
          p.x += sin(uTime * 0.3 + aSeed * 6.28) * 2.0;
          p.y += cos(uTime * 0.25 + aSeed * 6.28) * 2.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 20.0);
          gl_PointSize = aScale * uPixelRatio * (170.0 / -mv.z) * twinkle;
          // fade in from the far plane, fade as it passes the camera
          float dist = -mv.z;
          vAlpha = smoothstep(900.0, 500.0, dist) * smoothstep(0.0, 40.0, dist);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor, soft * vAlpha);
        }
      `,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // --- interaction / scroll state ---
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouse = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    // Self-heal: if the canvas ever ends up at 0x0 (mount timing / tab restore),
    // a ResizeObserver re-sizes it to match its box.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // scroll progress across the first ~2.6 viewports drives the fly-through
    const getProgress = () => {
      const travel = window.innerHeight * 2.6;
      return Math.min(Math.max(window.scrollY / travel, 0), 1);
    };

    const clock = new THREE.Clock();
    let raf;
    let smoothP = 0;
    const posArr = geo.attributes.position.array;

    const tick = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      const target = getProgress();
      smoothP += (target - smoothP) * 0.06;

      // fly forward: base slow cruise + scroll acceleration
      const speed = 18 + smoothP * 220;
      for (let i = 0; i < COUNT; i++) {
        posArr[i * 3 + 2] += (speed * 0.016);
        if (posArr[i * 3 + 2] > 90) {
          posArr[i * 3 + 2] -= DEPTH;      // recycle to the far end -> endless tunnel
        }
      }
      geo.attributes.position.needsUpdate = true;

      // mouse parallax + subtle scroll roll
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 14;
      camera.position.y = -mouse.y * 10;
      camera.rotation.z = mouse.x * 0.05 + smoothP * 0.15;
      camera.lookAt(0, 0, -200);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', resize);
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="flyhero" aria-hidden="true" />;
}
