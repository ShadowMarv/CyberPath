import { useState } from 'react';
import { LESSONS } from './content/lessons';
import { ATLAS } from './content/atlas';
import { AR } from './arsenalData';
import { Badges } from './Achievements';
const rd = (k: string): unknown => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const arr = (k: string): string[] => { const v = rd(k); return Array.isArray(v) ? (v as string[]) : []; };
const num = (k: string): number => { const v = rd(k); return typeof v === 'number' ? v : 0; };
const streak = (days: string[]) => { const s = new Set(days); const d = new Date(); let n = 0; while (s.has(d.toISOString().slice(0, 10))) { n++; d.setUTCDate(d.getUTCDate() - 1); } return n; };
const KEYS = ['ach', 'ctf', 'sc', 'sf', 'vs', 'cr', 'rm', 'ls', 'at', 'ar', 'lab', 'tf', 'qz', 'fw', 'ph', 'ir', 'days'];
function SkillRadar({ rows }: { rows: [string, number, number][] }) {
  const n = rows.length; const R = 95; const c = 150, d = 140; const pt = (i: number, k: number) => [c + Math.sin(i / n * 2 * Math.PI) * R * k, d - Math.cos(i / n * 2 * Math.PI) * R * k];
  const v = (r: [string, number, number]) => (r[2] ? r[1] / r[2] : 0);
  return (<svg viewBox="0 0 300 280" className="skr" role="img" aria-label="Skill radar chart of lesson completion by topic">
    {[0.25, 0.5, 0.75, 1].map(k => <polygon key={k} points={rows.map((_, i) => pt(i, k).join(',')).join(' ')} className="rg0" />)}
    {rows.map((r, i) => { const [x, y] = pt(i, 1); const [lx, ly] = pt(i, 1.17); return <g key={r[0]}><line x1={c} y1={d} x2={x} y2={y} className="rg0" /><text x={lx} y={ly + 3} textAnchor={lx < c - 5 ? 'end' : lx > c + 5 ? 'start' : 'middle'}>{r[0].replace(' lessons', '')}</text></g>; })}
    <polygon points={rows.map((r, i) => pt(i, v(r)).join(',')).join(' ')} className="rgp" />{rows.map((r, i) => { const [x, y] = pt(i, v(r)); return <circle key={r[0]} cx={x} cy={y} r="3" className="rgd" />; })}</svg>);
}
export default function Progress() {
  const [tick, setTick] = useState(0); const [nm, setNm] = useState(''); const ls = arr('ls'); const days = arr('days');
  const cats = [...new Set(LESSONS.map(l => l.cat))];
  const rows: [string, number, number][] = [...cats.map((c): [string, number, number] => [c + ' lessons', LESSONS.filter(l => l.cat === c && ls.includes(l.id)).length, LESSONS.filter(l => l.cat === c).length]),
    ['Concept atlas', arr('at').length, ATLAS.length], ['Tools practiced', arr('ar').length, AR.reduce((n, c) => n + c[2].length, 0)], ['Roadmap checklist', arr('rm').length, 17], ['Lab challenges', arr('lab').length, 12], ['Terminal flags', arr('tf').length, 3],
    ['Quiz best score', num('qz'), 10], ['Firewall duel best', num('fw'), 10], ['Phish spotter best', num('ph'), 6], ['Incident simulator best', num('ir'), 12]];
  const pct = (r: [string, number, number]) => Math.round(r[1] / r[2] * 100); const weak = [...rows].sort((a, b) => pct(a) - pct(b)).slice(0, 3); const next = LESSONS.filter(l => !ls.includes(l.id)).slice(0, 3);
  const reset = () => { if (window.confirm('Reset all progress stored on this device?')) { try { KEYS.forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ } window.dispatchEvent(new Event('ls')); setTick(tick + 1); } };
  return (<><h2>My progress</h2><p className="lead">Everything here is computed from what you have done on this device. Nothing is sent anywhere.</p>
    <div className="grid"><div className="card"><div className="big">{streak(days)}</div><p>day streak</p></div><div className="card"><div className="big">{ls.length}/{LESSONS.length}</div><p>lessons completed</p></div><div className="card"><div className="big">{days.length}</div><p>days studied</p></div></div>
    <h3 style={{ marginTop: 28 }}>Skill tree</h3><SkillRadar rows={rows.slice(0, cats.length)} />{rows.map(r => <div className="pr" key={r[0]}><span>{r[0]}</span><div className="bar"><i style={{ width: pct(r) + '%' }} /></div><span className="mono">{pct(r)}%</span></div>)}
    <h3 style={{ marginTop: 28 }}>Recommended next</h3><div className="grid">{next.length ? next.map(l => <a className="card" key={l.id} href={'#lesson/' + l.id}><h3>{l.title}</h3><p>{l.level} · {l.time}</p></a>) : <div className="card"><p>All lessons complete. Work through the Concept atlas and the labs.</p></div>}</div>
    <h3 style={{ marginTop: 28 }}>Areas to strengthen</h3><p>{weak.map(w => w[0]).join(', ')}.</p>
    <Badges />
    <h3 style={{ marginTop: 28 }}>Progress certificate</h3><p className="lead">A printable record of your study on CyberPath. It is a self-study record, not an accredited certification.</p>
    <label htmlFor="cn">Your name</label><input id="cn" type="text" value={nm} onChange={e => setNm(e.target.value)} /><p><button className="btn" onClick={() => window.print()}>Print certificate</button></p>
    <div className="cert"><h2>Certificate of Progress</h2><p>This records that</p><p className="cn">{nm || 'Your name'}</p><p>has completed {ls.length} of {LESSONS.length} CyberPath lessons and studied on {days.length} days.</p><p>{new Date().toLocaleDateString()}</p></div>
    <p style={{ marginTop: 20 }}><button className="btn" onClick={reset}>Reset all progress</button></p></>);
}
