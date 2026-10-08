import { useEffect, useRef, useState } from 'react';
import { G, certs, CP } from './data';
import { AR } from './arsenalData';
import { ATLAS } from './content/atlas';
import { KW } from './content/keywords';
import Icon from './Icon';
import { PORTS } from './NetLab';
type R = { t: string; to?: [string, string] };
type M = R & { me?: boolean };
const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (s: string, w: string) => new RegExp('(^|[^a-z0-9])' + esc(w.toLowerCase()) + '($|[^a-z0-9])').test(s);
const LANES: [RegExp, string][] = [[/soc|blue|defen|analyst|forensic|dfir/, 'Security+, CySA+ and BTL1'], [/pentest|penetration|red|offens|hack|bug/, 'eJPT, then PNPT or OSCP'], [/cloud|aws|azure/, 'SC-900, then AZ-500 or the AWS Security Specialty'], [/grc|compliance|manag|audit|risk/, 'ISC2 CC, then CISSP later']];
const FAQ: [RegExp, string, [string, string]?][] = [
  [/analy[sz]|suspicious (link|file|email)|check (a |this )?(link|url|file)|header/, 'Open Analyzers: it checks a link, a file (read locally, never uploaded), email headers and SSH logs. Results are indicative only.', ['analyze', 'Analyzers']],
  [/which cert|what cert|my goal|where do i start|career plan/, 'Use the Tools and certificate finder: pick a goal and get lessons, tools, certificates and a project.', ['finder', 'Finder']],
  [/ctf|capture the flag|scoreboard/, 'The CTF arena has 11 fictional challenges across Web, Crypto, Forensics, Networking, Linux, OSINT, Reverse and Misc, with points and hints.', ['ctf', 'CTF arena']],
  [/simulat/, 'Simulations here: Attack simulations (10 step-by-step attacks), SOC case files, the Defense lab (ransomware spread, DDoS load, cracking cost), Firewall duel, Phish spotter, the Incident simulator and the SOC dashboard.', ['deflab', 'Defense lab']],
  [/linux|file mode|permission/, 'Start with the Linux lessons: filesystem and permissions, then users and sudo, then logs, services and SSH hardening. The Toolbox has a chmod calculator and the Terminal game lets you practice.', ['lesson/linux-fs', 'Linux filesystem lesson']],
  [/roadmap|where.*start|begin|beginner|first step/, 'Start with networking, Linux and Python, then core security (OWASP, crypto, tools), pick a lane, and prove it with a certificate and write-ups.', ['road', 'Roadmap']],
  [/how long|months|timeline/, 'Roughly 6 to 12 months part-time to be junior-ready. The study planner estimates it from your weekly hours.', ['planner', 'Study planner']],
  [/free|cheap|no money/, 'Plenty is free: TryHackMe free rooms, PortSwigger Academy, OverTheWire, Professor Messer and picoCTF.', ['res', 'Resources']],
  [/legal|illegal|permission|authori/, 'Only test systems you own or have written permission to test. Use a home lab or legal platforms like TryHackMe and Hack The Box.', ['homelab', 'Home lab guide']],
  [/hash|encrypt|encod|aes|rsa|crypto/, 'Encoding (Base64) is reversible by anyone. Encryption is reversible with a key. Hashing is one-way. Store passwords with Argon2id or bcrypt.', ['crypto', 'Encryption']],
  [/red team|blue team|purple/, 'Red attacks to test, blue defends and detects, purple makes them work together.', ['teams', 'Cyber teams']],
  [/python|script|coding|program/, 'Python is the best first language for security: scanners, log parsers and API automation.', ['tools', 'Commands']],
  [/ctf|practice|hands.?on|game/, 'Try the Practice lab, Terminal game, Firewall duel and Phish spotter here, then TryHackMe and picoCTF.', ['lab', 'Practice lab']]];
const STOP = ['the', 'for', 'and', 'how', 'what', 'are', 'can', 'tool', 'tools', 'use', 'which', 'with', 'that', 'this', 'best'];
function answer(q: string, pages: [string, string][]): R {
  const s = q.toLowerCase().trim().replace('pentest', 'penetration');
  if (/^(hi|hello|hey|yo|salam)\b/.test(s)) return { t: 'Hi! Ask me about a term, tool, port, certificate or career, or say "open the lab".' };
  if (/keyword|what can (i|you)|topics|^help$/.test(s)) { const n = G.length + KW.length + ATLAS.length + AR.reduce((a, c) => a + c[2].length, 0) + PORTS.length; return { t: `I know about ${n} terms, tools and ports. Try: ` + KW.filter((_, i) => i % 6 === 0).map(k => k[0].split('|')[0]).join(', ') + '. Ask "what is ..." about any of them.', to: ['gloss', 'Glossary'] }; }
  const pm = s.match(/\bport\s*(\d+)|^(\d{2,5})$/);
  if (pm) { const p = PORTS.find(x => x[0] === (pm[1] || pm[2])); if (p) return { t: `Port ${p[0]} is ${p[1]}. ${p[2]}`, to: ['netlab', 'Network lab'] }; }
  if (/\b(open|go to|take me|show me|navigate)\b/.test(s)) { const pg = pages.find(p => s.includes(p[1].toLowerCase())) || pages.find(p => has(s, p[0])); if (pg) return { t: `Opening ${pg[1]}.`, to: pg }; }
  if (/cert|exam|credential/.test(s)) { const l = LANES.find(x => x[0].test(s)); return { t: l ? `For that path I would look at ${l[1]}.` : `Good first picks: ${certs[0][0]}, ${certs[4][0]} or ${certs[2][0]}.`, to: ['certs', 'Certificates'] }; }
  if (/career|job|role|become|work as/.test(s)) { const c = CP.find(x => has(s, x[0].toLowerCase().split(' ')[0])); return { t: c ? `${c[0]}: ${c[1]} ${c[2]}` : 'Roles to consider: ' + CP.map(x => x[0]).join(', ') + '.', to: ['careers', 'Careers'] }; }
  const m = s.match(/(?:what is|what's|define|explain|meaning of)\s+(?:an?\s+|the\s+)?(.+?)\??$/); const term = m ? m[1] : s;
  const g = G.find(x => has(term, x[0].toLowerCase())) || G.find(x => term.length > 2 && x[0].toLowerCase().includes(term));
  if (g) return { t: `${g[0]}: ${g[1]}`, to: ['gloss', 'Glossary'] };
  const kw = KW.find(k => k[0].split('|').some(a => a.length > 1 && (has(term, a) || has(s, a))));
  if (kw) return { t: `${kw[0].split('|')[0]}: ${kw[1]}`, to: ['gloss', 'Glossary'] };
  const at = term.length > 3 ? ATLAS.find(x => x[1].toLowerCase().includes(term)) : undefined;
  if (at) return { t: `${at[1]}: ${at[2]} Defense: ${at[4]}`, to: ['atlas', 'Concept atlas'] };
  const tl = AR.flatMap(c => c[2]).find(x => has(s, x[0]));
  if (tl) return { t: `${tl[0]}: ${tl[1]}. Official site: ${tl[2]}`, to: ['arsenal', 'Arsenal'] };
  const tk = s.split(/[^a-z0-9+]+/).filter(w => w.length > 2 && !STOP.includes(w));
  const sc = AR.flatMap(c => c[2].map(x => ({ x, n: tk.filter(w => (x[0] + ' ' + x[1] + ' ' + c[0] + ' ' + c[1]).toLowerCase().includes(w)).length }))).filter(y => y.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
  if (sc.length && /tool|software|use for|which|best|how (do|to|can)/.test(s)) return { t: 'Try ' + sc.map(y => `${y.x[0]} (${y.x[1].toLowerCase()})`).join('; ') + '.', to: ['arsenal', 'Arsenal'] };
  const f = FAQ.find(x => x[0].test(s)); if (f) return { t: f[1], to: f[2] };
  return { t: "I don't know that one yet. Ask about a glossary term, tool, port, certificate or career, or say \"open the roadmap\"." };
}
const CH = ['List keywords', 'What is a zero-day?', 'Tool for web testing', 'Certificate for SOC', 'Port 445', 'Open the lab'];
export default function Bot({ pages }: { pages: [string, string][] }) {
  const [open, setOpen] = useState(false); const [v, setV] = useState(''); const [wait, setWait] = useState(false);
  const [ms, setMs] = useState<M[]>([{ t: 'Hi! I am CyberBot, an offline helper that knows this site. Try a suggestion below.' }]); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { const f = () => setOpen(true); window.addEventListener('openbot', f); return () => window.removeEventListener('openbot', f); }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [ms, wait, open]);
  const send = (q: string) => { if (!q.trim() || wait) return; setMs(m => [...m, { me: true, t: q }]); setV(''); setWait(true); const a = answer(q, pages); setTimeout(() => { setMs(m => [...m, a]); setWait(false); }, 450); };
  return (<>
    {open && <div className="bot" role="dialog" aria-label="CyberBot assistant"><header><span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon n="shield" size={20} />CyberBot</span><button className="btn" onClick={() => setOpen(false)} aria-label="Close assistant">Close</button></header>
      <div className="bms">{ms.map((m, i) => <div key={i} className={'bm' + (m.me ? ' me' : '')}>{m.t}{m.to && <a href={'#' + m.to[0]}>Open {m.to[1]}</a>}</div>)}{wait && <div className="bm">...</div>}<div ref={end} /></div>
      <div className="bchips">{CH.map(c => <button key={c} onClick={() => send(c)}>{c}</button>)}</div>
      <div className="bin"><input type="text" value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(v); }} placeholder="Ask about security..." aria-label="Ask CyberBot" /><button className="btn p" onClick={() => send(v)}>Send</button></div></div>}
    <button className="bot-fab" onClick={() => setOpen(!open)} aria-label={open ? 'Close assistant' : 'Open assistant'}>{open ? 'x' : '>_'}</button></>);
}
