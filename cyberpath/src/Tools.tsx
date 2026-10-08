import { useEffect, useState } from 'react';
import { caesar, sha } from './hooks';
const OPS: Record<string, (s: string) => string> = {
  'Base64 encode': s => btoa(unescape(encodeURIComponent(s))), 'Base64 decode': s => decodeURIComponent(escape(atob(s))),
  'Hex encode': s => [...s].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '),
  'Hex decode': s => s.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join(''),
  'URL encode': encodeURIComponent, 'URL decode': decodeURIComponent, 'ROT13': s => caesar(s, 13) };
function Pass() {
  const [p, setP] = useState('');
  const pool = (/[a-z]/.test(p) ? 26 : 0) + (/[A-Z]/.test(p) ? 26 : 0) + (/\d/.test(p) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(p) ? 33 : 0);
  const bits = p ? p.length * Math.log2(pool) : 0; const sec = Math.pow(2, bits) / 2e10;
  const fmt = (x: number) => x < 1 ? 'instantly' : x < 3600 ? Math.round(x / 60) + ' minutes or less' : x < 86400 * 365 ? Math.round(x / 86400) + ' days' : x < 3.15e12 ? Math.round(x / 3.15e7) + ' years' : 'longer than civilization';
  const lvl = bits < 40 ? 'Weak' : bits < 60 ? 'Fair' : bits < 80 ? 'Strong' : 'Very strong';
  return (<div className="card"><h3>Password strength</h3><label htmlFor="pw">Try a password (it never leaves your browser)</label><input id="pw" type="text" value={p} onChange={e => setP(e.target.value)} autoComplete="off" />
    <p><b>{p ? lvl : 'Type to test'}</b>{p && <> · about {Math.round(bits)} bits · offline crack on a fast hash: {fmt(sec)}</>}</p>
    <p>Length beats complexity. Use a password manager and a 4+ word passphrase, and turn on MFA.</p></div>);
}
function Chmod() {
  const [m, setM] = useState([6, 4, 4]); const flip = (i: number, b: number) => setM(m.map((d, k) => (k === i ? d ^ b : d)));
  const sym = m.map(d => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-')).join('');
  const bits: [string, number][] = [['r', 4], ['w', 2], ['x', 1]];
  return (<div className="card"><h3>chmod calculator</h3>
    {['Owner', 'Group', 'Others'].map((n, i) => <div className="row" key={n} style={{ margin: '4px 0' }}><b style={{ width: 64 }}>{n}</b>{bits.map(([l, b]) => <label className="chk" key={l}><input type="checkbox" aria-label={n + ' ' + l} checked={(m[i] & b) !== 0} onChange={() => flip(i, b)} />{l}</label>)}</div>)}
    <div className="out"><div><b>Command</b>chmod {m.join('')} file</div><div><b>ls -l shows</b>-{sym}</div></div>
    <p className="msg">{m[2] & 2 ? 'Others can write: avoid this.' : m.join('') === '600' ? 'Good for private keys and secrets.' : 'Ask: does everyone listed really need this access?'}</p></div>);
}
export function Toolbox() {
  const [op, setOp] = useState('Base64 encode'); const [t, setT] = useState('hello world'); const [alg, setAlg] = useState('SHA-256'); const [h, setH] = useState('');
  let out = ''; try { out = OPS[op](t); } catch { out = 'Invalid input for this operation'; }
  useEffect(() => { sha(alg, t).then(setH).catch(() => setH('Not available')); }, [alg, t]);
  return (<><h2>Toolbox</h2><p className="lead">Small tools for daily practice. Everything runs locally.</p>
    <div className="grid"><div className="card"><h3>Encoder and decoder</h3><label htmlFor="eo">Operation</label>
      <select id="eo" value={op} onChange={e => setOp(e.target.value)}>{Object.keys(OPS).map(k => <option key={k}>{k}</option>)}</select>
      <label htmlFor="ei">Input</label><textarea id="ei" value={t} onChange={e => setT(e.target.value)} /><div className="out"><div><b>Result</b>{out}</div></div></div>
      <div className="card"><h3>Hash generator</h3><label htmlFor="ha">Algorithm</label>
        <select id="ha" value={alg} onChange={e => setAlg(e.target.value)}>{['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(k => <option key={k}>{k}</option>)}</select>
        <div className="out"><div><b>{alg} of the input</b>{h}</div></div><p>SHA-1 is broken for security use. Use Argon2id or bcrypt for passwords.</p></div>
      <Pass /><Chmod /></div></>);
}
const LANES: Record<string, number> = { 'SOC analyst': 300, 'Penetration tester': 400, 'GRC analyst': 250, 'Cloud security': 300 };
const PH: [string, number, string][] = [['Foundations', .25, 'Networking, Linux, Python'], ['Core security', .35, 'OWASP, crypto, tools, guided rooms'], ['Lane skills', .25, 'Labs and projects for your lane'], ['Prove it', .15, 'Certificate, write-ups, CTFs, applications']];
export function Planner() {
  const [lane, setLane] = useState('SOC analyst'); const [hrs, setHrs] = useState(8);
  const wk = Math.ceil(LANES[lane] / Math.max(1, hrs));
  return (<><h2>Study planner</h2><p className="lead">A rough estimate to job-ready entry level from zero. Real pace varies.</p>
    <div className="card"><label htmlFor="pl">Target role</label><select id="pl" value={lane} onChange={e => setLane(e.target.value)}>{Object.keys(LANES).map(k => <option key={k}>{k}</option>)}</select>
      <label htmlFor="ph">Hours per week: {hrs}</label><input id="ph" type="range" min={2} max={40} value={hrs} onChange={e => setHrs(+e.target.value)} style={{ width: '100%' }} />
      <p><b>About {wk} weeks ({(wk / 4.3).toFixed(1)} months)</b> for roughly {LANES[lane]} study hours.</p></div>
    <div className="grid" style={{ marginTop: 14 }}>{PH.map(p => <div className="card" key={p[0]}><h3>{p[0]}</h3><p><b>~{Math.max(1, Math.round(wk * p[1]))} weeks</b></p><p>{p[2]}</p></div>)}</div></>);
}
