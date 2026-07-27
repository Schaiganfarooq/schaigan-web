# Schaigan Farooq — Immersive Portfolio

A React + Three.js portfolio with a scroll-driven WebGL "fly-through" hero, smooth
scrolling, and GSAP scroll animations. Dark, grain-textured, type-led design using
**Unbounded** (display) and **Space Grotesk** (body).

## Tech

- **React 18 + Vite**
- **Three.js** — custom-shader particle field, scroll-driven camera fly-through
- **GSAP + ScrollTrigger** — scroll choreography & reveals
- **Lenis** — smooth scrolling
- Self-hosted fonts via `@fontsource`
- `@vercel/analytics`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Structure

```
src/
├── App.jsx
├── main.jsx
├── hooks/useSmoothScroll.js        # Lenis + ScrollTrigger
├── components/
│   ├── Grain.jsx / Loader.jsx / Nav.jsx
│   ├── hero/FlyHero.jsx            # Three.js WebGL scroll-to-fly
│   └── sections/                   # Hero, Intro, Work, About, Contact
└── styles/globals.css
```

## Deploy

Optimized for **Vercel** — import the repo and deploy (framework auto-detected as Vite).
