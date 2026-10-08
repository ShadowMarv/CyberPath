import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { LESSONS } from './content/lessons';
import { ATLAS } from './content/atlas';
import { KW } from './content/keywords';
import { AR } from './arsenalData';
import { G, certs } from './data';
function Stat({ v, l }: { v: number; l: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(v); return; }
    const o = { n: 0 }; const t = gsap.to(o, { n: v, duration: 1.4, ease: 'power2.out', onUpdate: () => setN(Math.round(o.n)) });
    return () => { t.kill(); };
  }, [v]);
  return <div className="card"><div style={{ font: '800 40px/1 system-ui', color: 'var(--acc)' }}>{n}</div><p>{l}</p></div>;
}
const PR: string[][] = [['Free and private', 'No sign-up, no tracking, no network calls. Progress is stored only in your browser.'], ['Safe by design', 'Offensive topics are taught only in labs, fictional systems and intentionally vulnerable targets, always next to how defenders detect and fix them.'], ['Open standards first', 'Lessons point to NIST, OWASP, MITRE, IETF RFCs and official documentation instead of folklore.'], ['Honest about limits', 'Content is written for learning and should be checked against official sources. Unfinished areas are listed below, not faked.']];
export default function About() {
  return (<><h2>About CyberPath</h2><p className="lead">A free, structured path from zero to a cybersecurity career: learn the idea, see it, practice it safely, test yourself, then apply it.</p>
    <div className="grid"><Stat v={LESSONS.length} l="guided lessons" /><Stat v={ATLAS.length} l="advanced concepts" /><Stat v={AR.reduce((n, c) => n + c[2].length, 0)} l="tools and techniques" /><Stat v={G.length + KW.length} l="glossary terms" /><Stat v={certs.length} l="certificates with links" /><Stat v={12} l="lab challenges plus games" /></div>
    <h3 style={{ marginTop: 32 }}>Principles</h3><div className="grid">{PR.map(p => <div className="card" key={p[0]}><h3>{p[0]}</h3><p>{p[1]}</p></div>)}</div>
    <h3 style={{ marginTop: 32 }}>Shortcuts</h3><p className="mono">/ or Ctrl+K: search and jump anywhere · Esc: close menus · Hint: classic gamers may find a hidden surprise · Tab: move through every control</p>
    <h3 style={{ marginTop: 32 }}>Built with</h3><p>React, TypeScript, Three.js, GSAP and Vite, bundled into one static file. No server is required. Each library is used under its own license.</p>
    <h3 style={{ marginTop: 32 }}>Coming later</h3><ul><li>User accounts and sync across devices (needs a secure backend)</li><li>More Linux, Windows and programming lessons</li><li>More labs and CTF challenges</li><li>Per-certificate study plans</li></ul></>);
}
