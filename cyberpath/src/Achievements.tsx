import { useEffect, useState } from 'react';
import { LESSONS } from './content/lessons';
const rd = (k: string): unknown => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const len = (k: string) => { const v = rd(k); return Array.isArray(v) ? v.length : 0; };
const num = (k: string) => { const v = rd(k); return typeof v === 'number' ? v : 0; };
const sum = (k: string) => { const v = rd(k); return v && typeof v === 'object' && !Array.isArray(v) ? (Object.values(v) as number[]).reduce((s, x) => s + Number(x), 0) : 0; };
const streak = () => { const s = new Set(Array.isArray(rd('days')) ? (rd('days') as string[]) : []); const d = new Date(); let n = 0; while (s.has(d.toISOString().slice(0, 10))) { n++; d.setUTCDate(d.getUTCDate() - 1); } return n; };
export const ACH: [string, string, string, () => boolean][] = [
  ['first', 'First steps', 'Complete a lesson', () => len('ls') >= 1], ['scholar', 'Scholar', 'Complete 5 lessons', () => len('ls') >= 5], ['grad', 'Graduate', 'Complete every lesson', () => len('ls') >= LESSONS.length],
  ['flags', 'Flag hunter', 'Capture all 3 terminal flags', () => len('tf') >= 3], ['lab', 'Lab rat', 'Solve all 12 lab challenges', () => len('lab') >= 12], ['quiz', 'Quiz master', 'Score 9 or more in the quiz', () => num('qz') >= 9],
  ['phish', 'Sharp eyes', 'Spot all 6 phishing emails', () => num('ph') >= 6], ['fw', 'Firewall pro', 'Score 10 in the Firewall duel', () => num('fw') >= 10], ['ir', 'First responder', 'Score 12 in the Incident simulator', () => num('ir') >= 12],
  ['soc', 'Tier 1 analyst', 'Earn 25 points across SOC cases', () => sum('sc') >= 25], ['ctf', 'CTF competitor', 'Earn 500 CTF points', () => sum('ctf') >= 500], ['tools', 'Toolsmith', 'Practice 10 tools', () => len('ar') >= 10],
  ['habits', 'Safe habits', 'Adopt 20 safety habits', () => len('sf') >= 20], ['streak', 'On a roll', 'Study 3 days in a row', () => streak() >= 3]];
export function Toasts() {
  const [q, setQ] = useState<string[][]>([]);
  useEffect(() => {
    const check = () => { try { const first = localStorage.getItem('ach') === null; const have: string[] = first ? [] : (rd('ach') as string[]) || []; const now = ACH.filter(a => a[3]() && !have.includes(a[0]));
      if (first || now.length) localStorage.setItem('ach', JSON.stringify([...have, ...now.map(a => a[0])])); if (!first && now.length) setQ(p => [...p, ...now.map(a => [a[0], a[1], a[2]])]); } catch { /* storage unavailable */ } };
    check(); window.addEventListener('ls', check); return () => window.removeEventListener('ls', check);
  }, []);
  useEffect(() => { if (!q.length) return; const t = setTimeout(() => setQ(p => p.slice(1)), 4500); return () => clearTimeout(t); }, [q]);
  return <div className="toasts" role="status" aria-live="polite">{q.slice(0, 3).map(t => <div className="toast" key={t[0]}><b>Achievement unlocked</b><br />{t[1]}: {t[2]}</div>)}</div>;
}
export function Badges() {
  const have = (rd('ach') as string[] | null) ?? [];
  return <><h3 style={{ marginTop: 28 }}>Achievements ({have.length}/{ACH.length})</h3><div className="grid">{ACH.map(a => <div className="card" key={a[0]}><span className="tag">{have.includes(a[0]) ? 'Unlocked' : 'Locked'}</span><h3>{a[1]}</h3><p>{a[2]}</p></div>)}</div></>;
}
