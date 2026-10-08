import { useEffect, useRef } from 'react';
export default function Rain({ onDone }: { onDone: () => void }) {
  const c = useRef<HTMLCanvasElement>(null); const cb = useRef(onDone); cb.current = onDone;
  useEffect(() => {
    const cv = c.current!; const x = cv.getContext('2d')!; const W = (cv.width = window.innerWidth); const H = (cv.height = window.innerHeight);
    const y: number[] = Array.from({ length: Math.floor(W / 16) }, () => Math.random() * H / 16); const acc = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#a495ff'; let raf = 0;
    const draw = () => { x.fillStyle = 'rgba(8,10,25,0.12)'; x.fillRect(0, 0, W, H); x.fillStyle = acc; x.font = '14px ui-monospace,monospace';
      y.forEach((v, i) => { x.fillText(Math.random() < 0.5 ? '0' : '1', i * 16, v * 16); y[i] = v * 16 > H && Math.random() > 0.975 ? 0 : v + 1; }); raf = requestAnimationFrame(draw); };
    draw(); const t = setTimeout(() => cb.current(), 6000); return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);
  return <><canvas ref={c} className="rain" aria-hidden="true" onClick={onDone} /><div className="rainmsg" role="status">Nice find. Now go practice input validation. (Click to close)</div></>;
}
