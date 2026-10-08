import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { zoomOf } from './hooks';
gsap.registerPlugin(ScrollTrigger);
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Per-page entrance and scroll-reveal animations. */
export function useFx(id: string) {
  useEffect(() => {
    if (calm()) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('.page .card, .page .res, .page .ch, .page .stage, .page .kc button, .page .cta a, .page .globe');
      gsap.set(els, { opacity: 0, y: 28 });
      ScrollTrigger.batch(els, { start: 'top 94%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', overwrite: true }) });
      gsap.fromTo('.page h1, .page h2', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
      gsap.to('.sp', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
      gsap.delayedCall(0.8, () => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, [id]);
}

/** Aurora background, cursor glow, 3D card tilt and magnetic buttons. */
export function useGlobalFx() {
  useEffect(() => {
    if (calm()) return;
    const ctx = gsap.context(() => {
      gsap.to('.aur i:nth-child(1)', { x: 140, y: 80, duration: 14, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.aur i:nth-child(2)', { x: -160, y: -90, duration: 18, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
    let Z = zoomOf(); const fine = window.matchMedia('(pointer: fine)').matches;
    const gx = gsap.quickTo('.glow', 'x', { duration: 0.4 }); const gy = gsap.quickTo('.glow', 'y', { duration: 0.4 });
    const free = (sel: string, keep: Element | null, to: gsap.TweenVars) => document.querySelectorAll<HTMLElement>(sel).forEach(c => { if (c !== keep) { c.classList.remove(sel.slice(1)); gsap.to(c, to); } });
    const mv = (e: PointerEvent) => {
      if (!fine) return;
      gx(e.clientX / Z); gy(e.clientY / Z);
      const t = e.target as HTMLElement | null;
      const card = t?.closest?.('.page .card') as HTMLElement | null;
      free('.tilt', card, { rotationX: 0, rotationY: 0, duration: 0.5 });
      if (card) { card.classList.add('tilt'); const b = card.getBoundingClientRect(); gsap.to(card, { rotationY: ((e.clientX - b.left) / b.width - 0.5) * 8, rotationX: -((e.clientY - b.top) / b.height - 0.5) * 8, transformPerspective: 800, duration: 0.3, overwrite: 'auto' }); }
      const m = t?.closest?.('.cta a, .pager a') as HTMLElement | null;
      free('.mag', m, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      if (m) { m.classList.add('mag'); const b = m.getBoundingClientRect(); gsap.to(m, { x: (e.clientX - b.left - b.width / 2) * 0.25, y: (e.clientY - b.top - b.height / 2) * 0.25, duration: 0.3, overwrite: 'auto' }); }
    };
    window.addEventListener('pointermove', mv); const rz = () => { Z = zoomOf(); }; window.addEventListener('resize', rz);
    return () => { window.removeEventListener('pointermove', mv); window.removeEventListener('resize', rz); ctx.revert(); };
  }, []);
}
