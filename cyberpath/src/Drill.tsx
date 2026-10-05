import { useState } from 'react';
import { useLS } from './hooks';
import type { Item } from './drills';
export default function Drill({ title, lead, store, items }: { title: string; lead: string; store: string; items: Item[] }) {
  const [i, setI] = useState(0); const [pick, setPick] = useState<number | null>(null); const [sc, setSc] = useState(0); const [best, setBest] = useLS<number>(store, 0);
  const max = items.reduce((n, t) => n + Math.max(...t.pts), 0);
  if (i >= items.length) return (<><h2>{title}</h2><div className="card"><h3>Score: {sc} / {max}</h3><p>Best so far: {Math.max(best, sc)}</p><button className="btn p" onClick={() => { setI(0); setSc(0); setPick(null); }}>Play again</button></div></>);
  const t = items[i]; const top = Math.max(...t.pts); const done = pick !== null;
  return (<><h2>{title}</h2><p className="lead">{lead}</p><div className="mono">Round {i + 1} / {items.length} · score {sc}</div><div className="bar"><i style={{ width: i / items.length * 100 + '%' }} /></div>
    {t.step && <p><b>{t.step}</b></p>}<div className="ch"><pre>{t.q}</pre></div>
    <div className="opts">{t.opts.map((o, n) => <button key={o} disabled={done} onClick={() => { setPick(n); setSc(sc + t.pts[n]); }} style={done && t.pts[n] === top ? { borderColor: 'var(--grn)', borderWidth: 2 } : pick === n ? { borderColor: 'var(--red)', borderWidth: 2 } : undefined}>{o}</button>)}</div>
    {done && <><p className="msg">{t.why[pick!]}</p><button className="btn p" onClick={() => { if (i + 1 === items.length) setBest(Math.max(best, sc)); setI(i + 1); setPick(null); }}>{i + 1 < items.length ? 'Next' : 'See score'}</button></>}</>);
}
