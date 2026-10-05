import { useState } from 'react';
const EX: [string, number, number][] = [['Phishing leads to stolen credentials', 4, 4], ['Lost laptop with disk encryption', 3, 2], ['Zero-day in an internet-facing server', 2, 5], ['Unpatched office printer', 3, 1], ['Ransomware on a flat network', 3, 5]];
const col = (s: number) => s <= 4 ? 'var(--grn)' : s <= 9 ? 'var(--amb)' : s <= 15 ? 'var(--red)' : 'var(--pur)';
export default function Risk() {
  const [l, setL] = useState(3); const [m, setM] = useState(3); const s = l * m;
  const lvl = s <= 4 ? ['Low', 'Accept and monitor.'] : s <= 9 ? ['Medium', 'Mitigate with controls, or transfer (insurance).'] : s <= 15 ? ['High', 'Mitigate soon: fix, segment or add detection.'] : ['Critical', 'Act now. Reduce the risk or avoid the activity.'];
  return (<><h2>Risk matrix</h2><p className="lead">Risk = likelihood x impact. Click a cell, or load an example, to see the rating and the usual response.</p>
    <div className="rm" role="group" aria-label="Risk matrix: rows are impact, columns are likelihood">{[5, 4, 3, 2, 1].flatMap(im => [1, 2, 3, 4, 5].map(li => <button key={im + '-' + li} aria-pressed={l === li && m === im} aria-label={`Likelihood ${li}, impact ${im}`} onClick={() => { setL(li); setM(im); }} style={{ background: `color-mix(in srgb, ${col(li * im)} 55%, var(--card))` }}>{li * im}</button>))}</div>
    <p className="mono">Rows: impact 5 (top) to 1. Columns: likelihood 1 to 5.</p>
    <div className="card" style={{ borderTop: '5px solid ' + col(s), maxWidth: 420 }}><h3>{lvl[0]} risk ({s})</h3><p>Likelihood {l}, impact {m}.</p><p><b>Typical response:</b> {lvl[1]}</p></div>
    <h3 style={{ marginTop: 24 }}>Try an example</h3><div className="row">{EX.map(e => <button key={e[0]} onClick={() => { setL(e[1]); setM(e[2]); }}>{e[0]}</button>)}</div>
    <p className="lead">The four responses: accept, mitigate, transfer (insure or outsource) or avoid.</p></>);
}
