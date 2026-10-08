import { useEffect, useRef } from 'react';
type P = { x: number; y: number; vx: number; vy: number };
/** One lightweight canvas: drifting network nodes, an occasional packet, faint binary streams and a rare scan line.
 *  ~30 fps, paused in hidden tabs, fewer nodes on small screens, disabled for reduced motion or when switched off. */
export default function Background({ on }: { on: boolean }) {
  const c = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = c.current!; const x = cv.getContext('2d')!; let W = 0, H = 0, raf = 0, f = 0, sweep = -300;
    const small = window.innerWidth < 700; const N = small ? 16 : 34; const COLS = small ? 0 : 10;
    const size = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }; size();
    const ps: P[] = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    const cols = Array.from({ length: COLS }, (_, i) => ({ x: (i + 0.5) * W / COLS, y: Math.random() * H, s: 0.4 + Math.random() * 0.5 }));
    let acc = '', grn = '', red = ''; const read = () => { const cs = getComputedStyle(document.documentElement); acc = cs.getPropertyValue('--acc').trim(); grn = cs.getPropertyValue('--grn').trim(); red = cs.getPropertyValue('--red').trim(); }; read();
    let pk = { a: 0, b: 1, t: 0 };
    const rs = () => { size(); cols.forEach((cl, i) => { cl.x = (i + 0.5) * W / COLS; }); }; window.addEventListener('resize', rs);
    const draw = () => {
      raf = requestAnimationFrame(draw); if (document.hidden || ++f % 2) return; if (f % 240 === 0) read();
      x.clearRect(0, 0, W, H); x.lineWidth = 1; x.strokeStyle = acc;
      for (let i = 0; i < N; i++) { const p = ps[i]; p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        for (let j = i + 1; j < N; j++) { const q = ps[j]; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 150) { x.globalAlpha = 0.16 * (1 - d / 150); x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } } }
      x.globalAlpha = 0.5; x.fillStyle = acc; ps.forEach(p => { x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill(); });
      const a = ps[pk.a], b = ps[pk.b]; pk.t += 0.03; if (pk.t >= 1) pk = { a: Math.floor(Math.random() * N), b: Math.floor(Math.random() * N), t: 0 };
      x.globalAlpha = 0.8; x.fillStyle = red; x.beginPath(); x.arc(a.x + (b.x - a.x) * pk.t, a.y + (b.y - a.y) * pk.t, 2.5, 0, 7); x.fill();
      x.fillStyle = grn; x.font = '12px ui-monospace,monospace';
      cols.forEach(cl => { cl.y += cl.s; if (cl.y > H + 220) cl.y = -220; for (let k = 0; k < 14; k++) { x.globalAlpha = 0.13 * (1 - k / 14); x.fillText(Math.sin(cl.x * 12.9 + k * 4.1 + Math.floor(cl.y / 14)) > 0 ? '1' : '0', cl.x, cl.y - k * 14); } });
      sweep += 3; if (sweep > H) sweep = -H * 2; if (sweep > 0) { x.fillStyle = acc; x.globalAlpha = 0.13; x.fillRect(0, sweep, W, 1); x.globalAlpha = 0.04; x.fillRect(0, sweep - 30, W, 30); }
      x.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', rs); x.clearRect(0, 0, W, H); };
  }, [on]);
  return <canvas ref={c} className="fx" aria-hidden="true" />;
}
