import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PROJECTS = [
  {
    n: '01',
    title: 'FurniFlex',
    meta: 'E-Commerce · UX/UI',
    desc: 'A clean, modern furniture store. End-to-end UX & UI covering browsing, filtering and checkout, designed to feel effortless.',
    href: 'https://www.figma.com/design/rtJMDLWgzqCXKOn4BOJ12K/Wensite-E-Commerce',
  },
  {
    n: '02',
    title: 'Luxe Balsam Properties',
    meta: 'Real Estate · Web App',
    desc: 'A full property platform: listings, off-plan launches, advanced search and transaction analytics (DLD daily transactions).',
    href: 'https://www.figma.com/design/wFN97RfBTYYEYbK493HjYg/Website',
  },
  {
    n: '03',
    title: 'WIP Fitness',
    meta: 'Fitness · Web Design',
    desc: 'An energetic fitness brand site featuring classes, trainers and memberships, with a bold neon-green-and-black identity.',
    href: 'https://www.figma.com/design/ZWq9YefLOnGqFhK4mkIvAz/WIP-Fitness',
  },
  {
    n: '04',
    title: 'PawPeeps',
    meta: 'Mobile App · Pet Care',
    desc: 'A pet-care app connecting dog owners with services, products and community: adoption, training, healthcare support, shopping and social interaction, designed end-to-end.',
    href: 'https://www.figma.com/design/7Fv4jqADfTqYd9k2sA1loo/Pawpeeps-design',
  },
  {
    n: '05',
    title: 'Hassad · حصاد',
    meta: 'Mobile App · Productivity (RTL)',
    desc: 'A productivity and knowledge-sharing app for Arabic-speaking users. Smooth onboarding and login flows plus searchable content, bookmarking, favorites and interactive notes.',
    href: 'https://www.figma.com/design/DLImYo8sJ8MNgjwBWIKyAn/Hassad',
  },
  {
    n: '06',
    title: 'NextFlow',
    meta: 'Mobile App · Workflow',
    desc: 'A workflow-management app that streamlines client handling and team collaboration: lead & client management, group chat, profile settings and external request tracking.',
    href: 'https://www.figma.com/design/kcv8Ah1avo2dbWrLtELgaf/Next-flow-Design',
  },
  {
    n: '07',
    title: 'CareLite',
    meta: 'Mobile App · Healthcare',
    desc: 'A healthcare app linking users with providers, pharmacies, hospitals and labs: service booking, medicine orders, membership plans, payments, QR access and profiles.',
    href: 'https://www.figma.com/design/W1C0myb6yUCAsrrPKIGa01/Carelie-Design',
  },
  {
    n: '08',
    title: 'On My Way Therapy',
    meta: 'Mobile App · Mental Health',
    desc: 'A mental-health app connecting clients with licensed therapists: registration, session booking, chat, notifications, payments, waitlists and cancellations, simple for both sides.',
    href: 'https://www.figma.com/design/iaAT47SsgLPhEw7i4r9O3t/On-my-way-therapy-service',
  },
  {
    n: '09',
    title: 'Email Response Agent',
    meta: 'AI · Automation',
    desc: 'An AI email agent built with n8n and OpenAI that reads intent and drafts human-like replies with safety filters.',
    href: 'https://github.com/Schaiganfarooq/Email-Response-Agent',
  },
];

const MARQUEE = ['Product Design', 'UX Research', 'Prototyping', 'Design Systems', 'Interaction', 'Figma', 'Webflow', 'Branding'];

export default function Work() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // marquee drift tied to scroll velocity
      gsap.to('.work__marquee-inner', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      // project rows reveal
      gsap.utils.toArray('.proj').forEach((row) => {
        gsap.from(row, {
          yPercent: 18,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 88%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="work" id="work" ref={root}>
      <div className="work__marquee" aria-hidden="true">
        <div className="work__marquee-inner">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span className="work__marquee-item display" key={i}>{m}<i>✦</i></span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="work__head">
          <p className="eyebrow">Selected Work</p>
          <h2 className="work__heading display">Projects</h2>
        </div>

        <ul className="work__list">
          {PROJECTS.map((p) => (
            <li className="proj" key={p.n}>
              <a className="proj__link" href={p.href} target="_blank" rel="noopener noreferrer">
                <span className="proj__n">{p.n}</span>
                <span className="proj__body">
                  <span className="proj__title display">{p.title}</span>
                  <span className="proj__desc">{p.desc}</span>
                </span>
                <span className="proj__meta">{p.meta}</span>
                <span className="proj__arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
