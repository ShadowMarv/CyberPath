import { useEffect, useRef } from 'react';
import gsap from 'gsap';
const P: Record<string, string[]> = {
  home: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'], road: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14', 'M15 6v14'],
  book: ['M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z', 'M4 19V5', 'M8 7h7'], team: ['M9 11a3 3 0 100-6 3 3 0 000 6z', 'M3 20a6 6 0 0112 0', 'M17 8a3 3 0 010 6', 'M21 20a5 5 0 00-4-5'],
  key: ['M12 15a4 4 0 11-8 0 4 4 0 018 0z', 'M11 12l9-9', 'M16 7l3 3'], bug: ['M9 9a3 3 0 016 0v6a3 3 0 01-6 0z', 'M12 9v9', 'M5 12h4', 'M15 12h4', 'M6 7l3 2', 'M18 7l-3 2', 'M6 18l3-2', 'M18 18l-3-2'],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-8', 'M22 20H2'], eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  award: ['M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.5 7.1 18.2l1-5.5-4-3.9 5.5-.8z'], tools: ['M3 8h18v12H3z', 'M8 8V5h8v3', 'M3 13h18'],
  radar: ['M3 12a9 9 0 1018 0 9 9 0 10-18 0', 'M7.5 12a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0', 'M12 12l6-6'], terminal: ['M3 5h18v14H3z', 'M7 10l3 2-3 2', 'M12 15h5'],
  net: ['M10 5a2 2 0 104 0 2 2 0 10-4 0', 'M3 19a2 2 0 104 0 2 2 0 10-4 0', 'M17 19a2 2 0 104 0 2 2 0 10-4 0', 'M12 7v4', 'M12 11l-6 6', 'M12 11l6 6'],
  flask: ['M9 3h6', 'M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3', 'M7.5 15h9'], shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'], bell: ['M6 16v-5a6 6 0 0112 0v5l2 2H4z', 'M10 20a2 2 0 004 0'], lock: ['M6 11h12v9H6z', 'M8.5 11V8a3.5 3.5 0 017 0v3'] };
export const ICON: Record<string, string> = { home: 'home', road: 'road', planner: 'chart', careers: 'team', teams: 'team', crypto: 'key', kill: 'bug', risk: 'chart', atlas: 'eye', certs: 'award', quiz: 'book', arsenal: 'tools', radar: 'radar', res: 'book', about: 'shield', analyze: 'eye', finder: 'award', ctf: 'award', packets: 'net', cryptolab: 'key', soccase: 'eye', deflab: 'flask', drills: 'bell', safety: 'shield', soc: 'radar', netmap: 'net', sims: 'bug', intel: 'eye', progress: 'chart', tools: 'terminal', gloss: 'book', homelab: 'net', lab: 'flask', firewall: 'shield', phish: 'mail', ir: 'bell', netlab: 'net', terminal: 'terminal', toolbox: 'tools' };
const len = (p: SVGPathElement) => { try { return p.getTotalLength() || 60; } catch { return 60; } };
/** Stroke icon that draws itself with GSAP: on first view (intro) and whenever its link or card is hovered. */
export default function Icon({ n, size = 24, delay = 0, intro = false, className = '' }: { n: string; size?: number; delay?: number; intro?: boolean; className?: string }) {
  const r = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = r.current; if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ps = el.querySelectorAll('path');
    const draw = () => { gsap.killTweensOf(ps); ps.forEach(p => { const L = len(p); p.style.strokeDasharray = String(L); p.style.strokeDashoffset = String(L); });
      return gsap.to(ps, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08, onComplete: () => ps.forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }) }); };
    if (intro) draw().delay(delay);
    const host = el.closest('a,.card,button'); const on = () => { draw(); }; host?.addEventListener('pointerenter', on);
    return () => { host?.removeEventListener('pointerenter', on); gsap.killTweensOf(ps); ps.forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); };
  }, [n, intro, delay]);
  return <svg ref={r} className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{(P[n] || P.book).map(d => <path key={d} d={d} />)}</svg>;
}
