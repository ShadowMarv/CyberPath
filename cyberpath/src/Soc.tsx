import { useEffect, useState } from 'react';
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');
const hms = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
/** Status chips built from real browser state: connectivity, secure context and local time. */
export function Hud() {
  const [t, setT] = useState(new Date()); const [on, setOn] = useState(navigator.onLine);
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); const f = () => setOn(navigator.onLine); window.addEventListener('online', f); window.addEventListener('offline', f); return () => { clearInterval(i); window.removeEventListener('online', f); window.removeEventListener('offline', f); }; }, []);
  return <div className="hud" aria-label="Browser status"><span>{on ? '● ONLINE' : '○ OFFLINE'}</span><span>CONNECTION: {window.isSecureContext ? 'SECURE (HTTPS)' : 'NOT SECURE'}</span><span>LOCAL TIME {hms(t)}</span><span>MODE: LEARNING</span></div>;
}
const EV: [string, string][] = [['INFO', 'Authentication request detected'], ['INFO', 'TLS connection established'], ['INFO', 'Firewall rule evaluated: allow 443/tcp'], ['INFO', 'DNS query resolved'], ['WARN', 'Multiple failed login attempts'], ['WARN', 'Certificate expires in 14 days'], ['ALERT', 'Suspicious request pattern detected'], ['ALERT', 'Possible port scan from an external address']];
const LV = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const pl = (v: number[]) => v.map((y, i) => `${i * 10},${100 - y}`).join(' ');
const walk = (p: number[], lo: number, hi: number, s: number) => [...p.slice(1), Math.max(lo, Math.min(hi, p[p.length - 1] + (Math.random() - 0.5) * s))];
export default function Soc() {
  const [ev, setEv] = useState<string[][]>([]); const [a, setA] = useState<number[]>(() => Array(40).fill(40)); const [b, setB] = useState<number[]>(() => Array(40).fill(25));
  useEffect(() => {
    const step = () => { if (document.hidden) return; setA(p => walk(p, 10, 95, 24)); setB(p => walk(p, 5, 70, 16));
      if (Math.random() < 0.6) { const r = Math.random(); const lv = r < 0.7 ? 'INFO' : r < 0.92 ? 'WARN' : 'ALERT'; const pool = EV.filter(e => e[0] === lv); const e = pool[Math.floor(Math.random() * pool.length)]; setEv(p => [[e[0], hms(new Date()), e[1], String(Math.random())], ...p].slice(0, 9)); } };
    step(); const i = setInterval(step, calm() ? 4000 : 1200); return () => clearInterval(i);
  }, []);
  const lv = Math.min(3, ev.slice(0, 8).filter(e => e[0] === 'ALERT').length);
  return (<><h2>SOC dashboard</h2><p className="lead">A security operations center watches threat level, traffic and events. Everything below is a <b>SIMULATION</b> made in your browser for learning. It is not real data.</p><Hud />
    <h3>Threat level (simulated)</h3><div className="lv" role="status" aria-label={'Simulated threat level ' + LV[lv]}>{LV.map((l, i) => <span key={l} aria-current={i === lv ? 'true' : undefined}>{i === lv ? '▶ ' : ''}{l}</span>)}</div>
    <p className="msg">Rule used here: the level rises with the number of ALERT events in the last eight.</p>
    <h3>Network activity (SIMULATION)</h3><svg className="gr" viewBox="0 0 390 100" role="img" aria-label="Simulated incoming and outgoing traffic">
      <polyline points={pl(a)} fill="none" stroke="var(--acc)" strokeWidth="2" /><polyline points={pl(b)} fill="none" stroke="var(--grn)" strokeWidth="2" strokeDasharray="4 3" />{a.map((y, i) => y > 85 && <circle key={i} cx={i * 10} cy={100 - y} r="3" style={{ fill: 'var(--red)' }} />)}</svg>
    <p className="msg">Incoming: solid line. Outgoing: dashed line. Red dots: simulated suspicious spikes.</p>
    <h3>Security events (SIMULATED)</h3><div className="feed" role="log" aria-live="off">{ev.length ? ev.map((e, i) => <div key={e[3]} className={e[0] === 'WARN' ? 'w' : e[0] === 'ALERT' ? 'al' : ''}>[{e[0]}] {e[1]} {e[2]}</div>) : 'Waiting for events...'}</div>
    <h3>How an analyst reads this</h3><ul><li>INFO is normal background activity. WARN deserves a look. ALERT must be triaged.</li><li>One failed login is noise. Many failed logins followed by a success is a pattern worth escalating.</li><li>A traffic spike alone proves nothing: check source, time and what else changed.</li></ul></>);
}
