import { useState } from 'react';
import { useLS } from './hooks';
import { AR } from './arsenalData';
export default function Arsenal() {
  const [cat, setCat] = useState('All'); const [q, setQ] = useState(''); const [done, setDone] = useLS<string[]>('ar', []);
  const s = q.toLowerCase(); const total = AR.reduce((n, c) => n + c[2].length, 0);
  const tog = (n: string) => setDone(done.includes(n) ? done.filter(x => x !== n) : [...done, n]);
  return (<><h2>The arsenal</h2><p className="lead">{total} tools and the techniques behind them, grouped by field. Tick a tool once you have used it in a lab: each one earns XP. Use them only on systems you own or are authorized to test.</p>
    <div className="mono">Practiced {done.length} / {total}</div><div className="bar"><i style={{ width: done.length / total * 100 + '%' }} /></div>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools (e.g. burp, memory, cloud)" aria-label="Search tools" />
    <div className="row">{['All', ...AR.map(c => c[0])].map(l => <button key={l} aria-pressed={cat === l} onClick={() => setCat(l)}>{l}</button>)}</div>
    {AR.filter(c => cat === 'All' || c[0] === cat).map(c => { const it = c[2].filter(t => (t[0] + t[1] + c[0]).toLowerCase().includes(s));
      return it.length ? <div key={c[0]}><h3 style={{ marginTop: 28 }}>{c[0]}</h3><p className="lead" style={{ margin: '4px 0 12px' }}><b>Techniques to learn:</b> {c[1]}</p>
        <div className="grid">{it.map(t => <div className="card" key={t[0]}><label className="chk"><input type="checkbox" checked={done.includes(t[0])} onChange={() => tog(t[0])} /><b>{t[0]}</b></label><p>{t[1]}</p><a href={t[2]} target="_blank" rel="noopener noreferrer">Open site</a></div>)}</div></div> : null; })}</>);
}
