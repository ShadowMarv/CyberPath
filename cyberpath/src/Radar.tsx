import { useEffect, useRef, useState } from 'react';
const TY = ['DDoS', 'Phishing', 'Ransomware', 'SQL injection', 'Brute force', 'Malware C2'];
type B = { a: number; r: number; t: string; life: number };
const rnd = (n: number) => Math.floor(Math.random() * n);
export default function Radar() {
  const cv = useRef<HTMLCanvasElement>(null); const [log, setLog] = useState<string[]>([]); const [cnt, setCnt] = useState<Record<string, number>>({});
  useEffect(() => {
    const c = cv.current!; const x = c.getContext('2d')!; const S = Math.max(240, c.parentElement!.clientWidth - 16); c.width = c.height = S;
    const cs = getComputedStyle(document.documentElement); const acc = cs.getPropertyValue('--acc').trim(), red = cs.getPropertyValue('--red').trim(), mut = cs.getPropertyValue('--mut').trim();
    let ang = 0, raf = 0, last = 0; const bl: B[] = []; const R = S / 2 - 8;
    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw); x.clearRect(0, 0, S, S); x.lineWidth = 1; x.strokeStyle = mut; x.globalAlpha = 0.35;
      for (let k = 1; k <= 4; k++) { x.beginPath(); x.arc(S / 2, S / 2, R * k / 4, 0, 7); x.stroke(); }
      x.beginPath(); x.moveTo(S / 2 - R, S / 2); x.lineTo(S / 2 + R, S / 2); x.moveTo(S / 2, S / 2 - R); x.lineTo(S / 2, S / 2 + R); x.stroke();
      ang += 0.03; x.strokeStyle = acc;
      for (let k = 0; k < 26; k++) { x.globalAlpha = 0.6 * (1 - k / 26); x.beginPath(); x.moveTo(S / 2, S / 2); x.lineTo(S / 2 + Math.cos(ang - k * 0.03) * R, S / 2 + Math.sin(ang - k * 0.03) * R); x.stroke(); }
      if (ts - last > 1100) { last = ts; const t = TY[rnd(TY.length)]; bl.push({ a: Math.random() * 6.28, r: 0.25 + Math.random() * 0.7, t, life: 1 });
        setCnt(p => ({ ...p, [t]: (p[t] || 0) + 1 })); setLog(p => [`${new Date().toTimeString().slice(0, 8)}  ${t} from ${1 + rnd(222)}.${rnd(256)}.${rnd(256)}.x`, ...p].slice(0, 6)); }
      x.font = '12px ui-monospace,monospace';
      bl.forEach(b => { b.life -= 0.004; if (b.life <= 0) return; const px = S / 2 + Math.cos(b.a) * b.r * R, py = S / 2 + Math.sin(b.a) * b.r * R;
        x.globalAlpha = b.life; x.fillStyle = red; x.beginPath(); x.arc(px, py, 4, 0, 7); x.fill(); x.strokeStyle = red; x.beginPath(); x.arc(px, py, 4 + (1 - b.life) * 22, 0, 7); x.stroke(); x.fillText(b.t, px + 8, py - 6); });
      x.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, []);
  return (<><h2>Threat radar</h2><p className="lead">A simulated live feed (not real data) of common attack types. Each blip is an event a SOC would triage.</p>
    <div className="radar"><canvas ref={cv} role="img" aria-label="Animated radar with simulated attack blips" /></div>
    <div className="row" style={{ marginTop: 14 }}>{TY.map(t => <span className="tag" key={t}>{t}: {cnt[t] || 0}</span>)}</div>
    <div className="cmd mono" style={{ whiteSpace: 'pre-wrap', minHeight: 120 }}>{log.join('\n') || 'Waiting for events...'}</div></>);
}
