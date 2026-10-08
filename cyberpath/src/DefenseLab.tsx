import { useEffect, useState } from 'react';
const flip = <T extends object>(o: T, k: keyof T) => ({ ...o, [k]: !o[k] });
function Ransom() {
  const [o, setO] = useState({ patch: false, priv: false, seg: false, edr: false, bak: false }); const [g, setG] = useState<number[]>(Array(20).fill(0)); const [run, setRun] = useState(false); const [t, setT] = useState(0);
  const start = () => { const a: number[] = Array(20).fill(0); a[0] = 1; setG(a); setT(0); setRun(true); };
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => {
      setG(p => { const n = [...p]; const base = 0.35 * (o.patch ? 0.4 : 1) * (o.priv ? 0.6 : 1);
        p.forEach((s, i) => { if (s !== 1) return; const x = i % 5, y = Math.floor(i / 5);
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx < 0 || nx > 4 || ny < 0 || ny > 3) return; const j = ny * 5 + nx; if (p[j] !== 0) return; const cross = o.seg && (x < 2) !== (nx < 2); if (Math.random() < base * (cross ? 0.1 : 1)) n[j] = 1; });
          if (o.edr && t >= 2 && Math.random() < 0.25) n[i] = 2; });
        return n; });
      setT(x => x + 1);
    }, 500);
    return () => clearTimeout(id);
  }, [run, t, o]);
  useEffect(() => { if (run && (t > 40 || (t > 0 && !g.includes(1)))) setRun(false); }, [g, run, t]);
  const hit = g.filter(s => s > 0).length; const lab: Record<string, string> = { patch: 'Patching (slows spread)', priv: 'Least privilege (slows spread)', seg: 'Segmentation (a boundary between the two halves)', edr: 'EDR (isolates infected machines)', bak: 'Offline backups (recovery)' };
  return (<><p className="lead">Machine 1 is infected by a phishing email. Choose defenses, then start. Each tick the ransomware tries to spread to neighbors. Results are random, so run it a few times.</p>
    <div className="sf">{(Object.keys(lab) as (keyof typeof o)[]).map(k => <label className="chk" key={k}><input type="checkbox" disabled={run} checked={o[k]} onChange={() => setO(flip(o, k))} />{lab[k]}</label>)}</div>
    <div className="rg" role="img" aria-label="Twenty machines. Symbols show healthy, encrypted or isolated.">{g.map((s, i) => <div key={i} className={'rc s' + s} style={o.seg && i % 5 === 2 ? { borderLeft: '4px double var(--ink)' } : undefined}>{s === 0 ? 'OK' : s === 1 ? 'ENC' : 'ISO'}</div>)}</div>
    <p className="mono">Tick {t} · {run ? 'spreading...' : t ? 'finished' : 'ready'} · affected {hit}/20</p>
    <p><button className="btn p" onClick={start} disabled={run}>{t ? 'Run again' : 'Start attack'}</button></p>
    {!run && t > 0 && <div className="card" aria-live="polite"><h3>{hit} of 20 machines affected</h3><p>{o.bak ? 'Offline backups exist, so affected machines can be restored (slowly).' : 'No offline backups: affected data may be lost or the business may face a ransom decision.'}</p><p>{o.edr ? 'EDR contained some machines as ISO.' : 'Without EDR nothing stopped the spread except luck and layout.'} Try changing one defense and compare.</p></div>}</>);
}
function Ddos() {
  const [legit, setLegit] = useState(500); const [atk, setAtk] = useState(20000); const [cdn, setCdn] = useState(false); const [rl, setRl] = useState(false); const [auto, setAuto] = useState(false);
  const cap = 3000 * (auto ? 3 : 1); const load = legit + atk * (cdn ? 0.1 : 1) * (rl ? 0.5 : 1); const pct = Math.round(load / cap * 100); const st = pct <= 70 ? 'HEALTHY' : pct <= 100 ? 'DEGRADED' : 'DOWN (overloaded)';
  return (<><p className="lead">A server handles {cap.toLocaleString()} requests per second. See how layers change the outcome. Numbers are illustrative.</p>
    <label htmlFor="lg">Normal visitors: {legit} req/s</label><input id="lg" type="range" min={100} max={2000} step={100} value={legit} onChange={e => setLegit(+e.target.value)} style={{ width: '100%' }} />
    <label htmlFor="at">Attack traffic: {atk.toLocaleString()} req/s</label><input id="at" type="range" min={0} max={50000} step={1000} value={atk} onChange={e => setAtk(+e.target.value)} style={{ width: '100%' }} />
    <div className="sf"><label className="chk"><input type="checkbox" checked={cdn} onChange={() => setCdn(!cdn)} />CDN or scrubbing service (blocks about 90%)</label><label className="chk"><input type="checkbox" checked={rl} onChange={() => setRl(!rl)} />Rate limiting (blocks about 50%)</label><label className="chk"><input type="checkbox" checked={auto} onChange={() => setAuto(!auto)} />Autoscaling (3x capacity)</label></div>
    <div className="bar" style={{ height: 16 }}><i style={{ width: Math.min(100, pct) + '%', background: pct > 100 ? 'var(--red)' : pct > 70 ? 'var(--amb)' : 'var(--grn)' }} /></div><p className="mono" role="status">Load {pct}% of capacity: {st}</p></>);
}
const HR: [string, number][] = [['MD5 or SHA-1 (fast, unsalted)', 1e11], ['SHA-256 (fast)', 2e10], ['bcrypt, cost 12', 1e3], ['Argon2id, typical settings', 1e2]];
function Crack() {
  const [len, setLen] = useState(10); const [cs, setCs] = useState([true, true, true, false]); const [h, setH] = useState(0);
  const pool = [26, 26, 10, 33].reduce((a, n, i) => a + (cs[i] ? n : 0), 0); const s = Math.pow(pool, len) / 2 / HR[h][1];
  const fmt = (x: number) => x < 60 ? 'seconds' : x < 3600 ? Math.ceil(x / 60) + ' minutes' : x < 86400 ? Math.round(x / 3600) + ' hours' : x < 3.15e7 ? Math.round(x / 86400) + ' days' : x < 4.3e17 ? Math.round(x / 3.15e7).toLocaleString() + ' years' : 'longer than the age of the universe';
  return (<><p className="lead">Average time to guess a truly random password offline, on one high-end GPU rig. Speeds are order-of-magnitude illustrations. Real people choose predictable passwords, so real cracking is faster.</p>
    <label htmlFor="cl">Length: {len} characters</label><input id="cl" type="range" min={6} max={20} value={len} onChange={e => setLen(+e.target.value)} style={{ width: '100%' }} />
    <div className="sf">{['lowercase', 'UPPERCASE', 'digits', 'symbols'].map((n, i) => <label className="chk" key={n}><input type="checkbox" checked={cs[i]} onChange={() => setCs(cs.map((v, k) => (k === i ? !v : v)))} />{n}</label>)}</div>
    <label htmlFor="ch">How the site stores the password</label><select id="ch" value={h} onChange={e => setH(+e.target.value)}>{HR.map((x, i) => <option key={x[0]} value={i}>{x[0]}</option>)}</select>
    <div className="card" style={{ marginTop: 12 }} role="status"><h3>{pool ? fmt(s) : 'Pick at least one character type'}</h3><p>Pool of {pool} characters, about {pool ? Math.round(len * Math.log2(pool)) : 0} bits. Compare fast hashes with bcrypt or Argon2id: the storage method can matter as much as the password. Salting also stops precomputed tables and cracking many users at once.</p></div></>);
}
export default function DefenseLab() {
  const [k, setK] = useState(0); const T = ['Ransomware spread', 'DDoS load', 'Cracking cost'];
  return (<><h2>Defense lab</h2><p className="lead">Three small simulations that show why layered defenses work. They are teaching models, not predictions.</p>
    <div className="row">{T.map((t, i) => <button key={t} aria-pressed={k === i} onClick={() => setK(i)}>{t}</button>)}</div>{k === 0 ? <Ransom /> : k === 1 ? <Ddos /> : <Crack />}</>);
}
