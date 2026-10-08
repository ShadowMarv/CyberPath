import { useEffect, useRef } from 'react';
import gsap from 'gsap';
const far = Array.from({ length: 26 }, (_, i) => ({ x: i * 38 - 40, h: 70 + Math.round(45 * (Math.sin(i * 1.7) + 1)) }));
const near = Array.from({ length: 13 }, (_, i) => ({ x: i * 74 - 20, h: 90 + Math.round(55 * (Math.sin(i * 2.3 + 1) + 1)), w: 56 })).filter(b => b.x + b.w < 385 || b.x > 515);
const stars = Array.from({ length: 28 }, (_, i) => ({ x: (i * 97) % 900, y: ((i * 53) % 100) + 8, r: i % 3 ? 1 : 1.6 }));
const arcs = ['M450 60Q330 -10 150 100', 'M450 70Q360 20 270 70', 'M450 70Q540 20 640 70', 'M450 60Q570 -10 780 100'];
/** Decorative hero illustration: a glowing shield above a connected city, with slow parallax and twinkling stars. */
export default function Skyline() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const q = gsap.utils.selector(r);
    const ctx = gsap.context(() => { gsap.to(q('.st'), { opacity: 0.15, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.15, from: 'random' } }); gsap.to(q('.gr'), { scale: 1.1, svgOrigin: '450 120', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }); }, r);
    const a = gsap.quickTo(q('.l1'), 'x', { duration: 0.8 }), b = gsap.quickTo(q('.l2'), 'x', { duration: 0.8 }), c = gsap.quickTo(q('.l3'), 'x', { duration: 0.8 });
    const mv = (e: PointerEvent) => { const k = e.clientX / window.innerWidth - 0.5; a(-k * 14); b(-k * 28); c(-k * 8); };
    window.addEventListener('pointermove', mv); return () => { window.removeEventListener('pointermove', mv); ctx.revert(); };
  }, []);
  return (<div className="sky" ref={r}><svg viewBox="0 0 900 260" role="img" aria-label="Illustration: a glowing shield protecting a city of connected buildings">
    <defs><radialGradient id="skg"><stop offset="0" style={{ stopColor: 'var(--acc)', stopOpacity: 0.35 }} /><stop offset="1" style={{ stopColor: 'var(--acc)', stopOpacity: 0 }} /></radialGradient></defs>
    <g className="l3">{stars.map((s, i) => <circle key={i} className="st" cx={s.x} cy={s.y} r={s.r} style={{ fill: 'var(--ink)', opacity: 0.5 }} />)}</g>
    <circle className="gr" cx="450" cy="120" r="120" fill="url(#skg)" />
    <g className="l1">{far.map((b, i) => <rect key={i} x={b.x} y={250 - b.h} width="34" height={b.h} style={{ fill: 'var(--line)', opacity: 0.55 }} />)}</g>
    <g className="l2">{near.map((b, i) => <g key={i}><rect x={b.x} y={250 - b.h} width={b.w} height={b.h} style={{ fill: 'var(--bg)', stroke: 'var(--line)' }} />
      {Array.from({ length: Math.floor((b.h - 14) / 18) * 3 }, (_, k) => <rect key={k} x={b.x + 8 + (k % 3) * 16} y={250 - b.h + 10 + Math.floor(k / 3) * 18} width="8" height="9" style={{ fill: (i + k) % 3 ? 'var(--acc)' : 'var(--line)', opacity: (i + k) % 3 ? 0.75 : 0.5 }} />)}</g>)}</g>
    {arcs.map(d => <path key={d} className="fl" d={d} />)}
    <g transform="translate(450 120)"><path d="M0 -70L60 -48V6C60 46 32 70 0 82C-32 70 -60 46 -60 6V-48Z" style={{ fill: 'var(--card)', stroke: 'var(--acc)', strokeWidth: 3 }} /><rect x="-16" y="-8" width="32" height="26" rx="5" style={{ fill: 'var(--acc)' }} /><path d="M-10 -8V-20a10 10 0 0120 0V-8" fill="none" strokeWidth="4" style={{ stroke: 'var(--acc)' }} /></g>
    <rect x="0" y="250" width="900" height="10" style={{ fill: 'var(--line)' }} /></svg></div>);
}
