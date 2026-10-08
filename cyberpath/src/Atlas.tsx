import { useState } from 'react';
import { useLS } from './hooks';
import { ATLAS } from './content/atlas';
const GS = ['All', ...new Set(ATLAS.map(a => a[0]))];
export default function Atlas() {
  const [g, setG] = useState('All'); const [q, setQ] = useState(''); const [done, setDone] = useLS<string[]>('at', []); const s = q.toLowerCase();
  const tog = (n: string) => setDone(done.includes(n) ? done.filter(x => x !== n) : [...done, n]);
  const it = ATLAS.filter(a => (g === 'All' || a[0] === g) && a.join(' ').toLowerCase().includes(s));
  return (<><h2>Concept atlas</h2><p className="lead">{ATLAS.length} concepts beyond the basics, each with what it is, how it goes wrong and how defenders respond. Tick the ones you can explain in your own words.</p>
    <div className="mono">Understood {done.length} / {ATLAS.length}</div><div className="bar"><i style={{ width: done.length / ATLAS.length * 100 + '%' }} /></div>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search concepts (e.g. oauth, ransomware, dmarc)" aria-label="Search concepts" />
    <div className="row">{GS.map(x => <button key={x} aria-pressed={g === x} onClick={() => setG(x)}>{x}</button>)}</div>
    <div className="grid">{it.map(a => <div className="card" key={a[1]}><span className="tag">{a[0]}</span><h3>{a[1]}</h3><p>{a[2]}</p><p><b>How it goes wrong:</b> {a[3]}</p><p><b>How defenders respond:</b> {a[4]}</p>
      <label className="chk"><input type="checkbox" checked={done.includes(a[1])} onChange={() => tog(a[1])} />I can explain this (+3 XP)</label></div>)}</div>
    {!it.length && <p>No match. Try another word.</p>}</>);
}
