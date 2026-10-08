import { Fragment, useEffect, useState } from 'react';
import { useHash, useLS } from './hooks';
import { Home, Roadmap, Careers, Teams, Crypto, Certs, Resources, Commands, Glossary, HomeLab } from './Pages';
import Lab from './Lab';
import Quiz from './Quiz';
import Terminal from './Terminal';
import KillChain from './KillChain';
import Arsenal from './ArsenalPage';
import Drill from './Drill';
import Radar from './Radar';
import NetLab from './NetLab';
import Risk from './Risk';
import Bot from './Bot';
import Atlas from './Atlas';
import About from './About';
import Progress from './Progress';
import Rain from './Rain';
import Safety from './Safety';
import NetMap from './NetMap';
import Sims from './Sims';
import Soc from './Soc';
import Intel from './Intel';
import Background from './Background';
import SocCase from './SocCase';
import DefenseLab from './DefenseLab';
import Drills2 from './Drills2';
import Ctf from './Ctf';
import Packets from './Packets';
import CryptoLab from './CryptoLab';
import { Toasts } from './Achievements';
import Nova from './Nova';
import Analyze from './Analyze';
import Finder from './Finder';
import Icon, { ICON } from './Icon';
import LessonPage from './LessonPage';
import { LESSONS } from './content/lessons';
import { FWI, PHI, IRI } from './drills';
import { useFx, useGlobalFx } from './fx';
import { Toolbox, Planner } from './Tools';
const META: [string, string, string, string][] = [
  ['home', 'Home', '', 'Start'], ['road', 'Roadmap', 'Four stages with a progress tracker.', 'Learn'], ['planner', 'Study planner', 'Turn weekly hours into a timeline.', 'Learn'],
  ['careers', 'Careers', 'Eight roles and how to reach each.', 'Learn'], ['teams', 'Cyber teams', 'Red, blue, purple and the rest.', 'Learn'], ['crypto', 'Encryption', 'How crypto really works.', 'Learn'], ['safety', 'Stay safe', 'Advice to avoid every kind of attack.', 'Learn'], ['sims', 'Attack simulations', 'Phishing, SQLi, DDoS and MITM step by step.', 'Learn'], ['cryptolab', 'Crypto lab', 'Vigenere, frequency analysis, RSA, Diffie-Hellman.', 'Learn'], ['kill', 'Attack vs defense', 'Walk the kill chain as red or blue.', 'Learn'], ['risk', 'Risk matrix', 'Likelihood x impact, visualized.', 'Learn'], ['atlas', 'Concept atlas', '58 more concepts, from threat modeling to AI security.', 'Learn'],
  ['progress', 'My progress', 'Skill tree, streak and what to study next.', 'Prove'], ['finder', 'Tools and certificate finder', 'Pick a goal and get a plan.', 'Prove'], ['certs', 'Certificates', 'Which ones are worth it.', 'Prove'], ['quiz', 'Quiz', 'Ten questions to test the basics.', 'Prove'],
  ['arsenal', 'Arsenal', '80 tools and the techniques to master.', 'Explore'], ['analyze', 'Analyzers', 'Check links, files, email headers and logs locally.', 'Analyze'], ['soc', 'SOC dashboard', 'Simulated threat level, traffic and events.', 'Analyze'], ['netmap', 'Network map', 'Click a node: risks and defenses.', 'Analyze'], ['intel', 'Threat intel and history', 'Actors, tactics, famous CVEs, timeline.', 'Analyze'], ['radar', 'Threat radar', 'A simulated live attack feed.', 'Analyze'], ['res', 'Resources', 'Labs, YouTube, sites, podcasts.', 'Explore'], ['tools', 'Commands', 'A copy-ready cheat sheet.', 'Explore'], ['gloss', 'Glossary', 'Plain-English security terms.', 'Explore'], ['homelab', 'Home lab guide', 'Build a safe practice lab.', 'Explore'], ['about', 'About CyberPath', 'Principles, stack and what is next.', 'Explore'],
  ['lab', 'Practice lab', 'Twelve hands-on challenges.', 'Practice'], ['soccase', 'SOC case files', 'Triage logs and write the verdict.', 'Practice'], ['deflab', 'Defense lab', 'Ransomware spread, DDoS load, cracking cost.', 'Practice'], ['drills', 'Scenario drills', 'Voice scam call and spot the bug.', 'Practice'], ['ctf', 'CTF arena', 'Challenges with points, hints and a scoreboard.', 'Practice'], ['packets', 'Packet analyzer', 'Read a fictional capture like Wireshark.', 'Analyze'], ['firewall', 'Firewall duel', 'Allow or block packets by policy.', 'Practice'], ['phish', 'Phish spotter', 'Real or phishing? Six emails.', 'Practice'], ['ir', 'Incident simulator', 'Handle a ransomware night.', 'Practice'], ['netlab', 'Network lab', 'Subnets, ports and hash visuals.', 'Practice'], ['terminal', 'Terminal game', 'Find 3 flags in a fake Linux box.', 'Practice'], ['toolbox', 'Toolbox', 'Encode, hash and test passwords.', 'Practice']];
const links: [string, string, string][] = META.slice(1).map(m => [m[0], m[1], m[2]]);
const GR = [...new Set(META.map(m => m[3]))].filter(g => g !== 'Start');
function view(id: string, h = '') {
  switch (id) {
    case 'lesson': return <LessonPage key={h} id={h.slice(7)} />; case 'road': return <Roadmap />; case 'planner': return <Planner />; case 'careers': return <Careers />; case 'teams': return <Teams />; case 'crypto': return <Crypto />;
    case 'certs': return <Certs />; case 'quiz': return <Quiz />; case 'res': return <Resources />; case 'tools': return <Commands />; case 'gloss': return <Glossary />;
    case 'homelab': return <HomeLab />; case 'lab': return <Lab />; case 'toolbox': return <Toolbox />; case 'kill': return <KillChain />; case 'arsenal': return <Arsenal />; case 'terminal': return <Terminal />; case 'risk': return <Risk />; case 'atlas': return <Atlas />; case 'about': return <About />; case 'analyze': return <Analyze />; case 'finder': return <Finder />; case 'ctf': return <Ctf />; case 'packets': return <Packets />; case 'cryptolab': return <CryptoLab />; case 'soccase': return <SocCase />; case 'deflab': return <DefenseLab />; case 'drills': return <Drills2 />; case 'safety': return <Safety />; case 'netmap': return <NetMap />; case 'sims': return <Sims />; case 'soc': return <Soc />; case 'intel': return <Intel />; case 'progress': return <Progress />; case 'radar': return <Radar />; case 'netlab': return <NetLab />;
    case 'firewall': return <Drill title="Firewall duel" lead="Apply the policy to each packet. Default deny wins." store="fw" items={FWI} />;
    case 'phish': return <Drill title="Phish spotter" lead="Read like an analyst: sender, urgency, links, attachments." store="ph" items={PHI} />;
    case 'ir': return <Drill title="Incident simulator" lead="Four decisions, one ransomware night. Follow the NIST response lifecycle." store="ir" items={IRI} />;
    default: return <Home links={links} />;
  }
}
export default function App() {
  const hash = useHash(); const id = META.some(m => m[0] === hash) ? hash : hash.startsWith('lesson/') ? 'lesson' : 'home';
  const [menu, setMenu] = useState(false); const [dd, setDd] = useState(''); const act = id === 'lesson' ? 'road' : id;
  const [theme, setTheme] = useLS<string>('t', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const i = META.findIndex(m => m[0] === id); useGlobalFx(); useFx(id);
  useEffect(() => { document.title = (id === 'home' ? '' : (META[i]?.[1] ?? 'Lesson') + ' | ') + 'CyberPath'; }, [id, i]);
  const [xp, setXp] = useState(0); const [pal, setPal] = useState(false); const [pq, setPq] = useState('');
  useEffect(() => {
    const n = (k: string) => { try { const v = JSON.parse(localStorage.getItem(k) || '0'); return Array.isArray(v) ? v.length : v && typeof v === 'object' ? (Object.values(v) as number[]).reduce((s, x) => s + Number(x), 0) : Number(v) || 0; } catch { return 0; } };
    const f = () => setXp(n('rm') * 10 + n('lab') * 40 + n('tf') * 50 + n('qz') * 20 + n('ar') * 5 + n('fw') * 3 + n('ph') * 10 + n('ir') * 10 + n('ls') * 25 + n('at') * 3 + n('sf') * 2 + n('sc') * 5 + n('vs') * 3 + n('cr') * 3 + n('ach') * 10 + Math.round(n('ctf') / 4)); f();
    window.addEventListener('ls', f); return () => window.removeEventListener('ls', f);
  }, []);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(p => !p); setPq(''); } else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)) { e.preventDefault(); setPal(true); setPq(''); } else if (e.key === 'Escape') { setPal(false); setDd(''); setMenu(false); } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, []);
  const T = [0, 100, 250, 550, 900, 1300]; const RN = ['Newbie', 'Apprentice', 'Analyst', 'Hunter', 'Operator', 'Architect'];
  const ri = T.filter(t => xp >= t).length - 1; const pct = ri === T.length - 1 ? 100 : (xp - T[ri]) / (T[ri + 1] - T[ri]) * 100;
  const pl = [...META, ...LESSONS.map(l => ['lesson/' + l.id, l.title, l.level + ' lesson', 'Lesson'])].filter(m => (m[1] + m[2] + m[3]).toLowerCase().includes(pq.toLowerCase()));
  useEffect(() => { setDd(''); setMenu(false); document.getElementById('main-content')?.focus({ preventScroll: true }); }, [hash]);
  useEffect(() => { const f = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest?.('#tb')) setDd(''); }; document.addEventListener('click', f); return () => document.removeEventListener('click', f); }, []);
  const [rain, setRain] = useState(false); const [fx, setFx] = useLS<boolean>('fx', (navigator.hardwareConcurrency || 4) > 2); const [zoom, setZoom] = useLS<number>('zoom', 0.67);
  useEffect(() => { document.documentElement.style.setProperty('--z', String(zoom)); window.dispatchEvent(new Event('resize')); }, [zoom]);
  useEffect(() => { try { const d = new Date().toISOString().slice(0, 10); const a: string[] = JSON.parse(localStorage.getItem('days') || '[]'); if (!a.includes(d)) { a.push(d); localStorage.setItem('days', JSON.stringify(a.slice(-400))); window.dispatchEvent(new Event('ls')); } } catch { /* storage unavailable */ } }, []);
  useEffect(() => {
    const K = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']; let n = 0;
    const f = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); n = k === K[n] ? n + 1 : k === K[0] ? 1 : 0; if (n === K.length) { n = 0; if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRain(true); } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, []);
  const nb = { textDecoration: 'none' };
  return (<>
    <a className="skip" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a><div className="sp" /><div className="aur"><i /><i /></div><div className="glow" /><Background on={fx} />{fx && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && <div className="fxo" aria-hidden="true" />}
    <header id="tb"><a className="brand" href="#home">Cyber<b>Path</b></a>
      <nav id="nv" className={menu ? 'open' : ''} aria-label="Main navigation">
        {['home', 'road', 'safety'].map(t => { const m = META.find(x => x[0] === t)!; return <a key={t} href={'#' + t} aria-current={act === t ? 'page' : undefined}>{m[1]}</a>; })}
        {GR.map(g => <div className={'dd' + (dd === g ? ' on' : '')} key={g}>
          <button type="button" aria-expanded={dd === g} className={META.find(m => m[0] === act)?.[3] === g ? 'cur' : ''} onClick={() => setDd(dd === g ? '' : g)}>{g}</button>
          <div className="dm">{META.filter(m => m[3] === g && !['road', 'safety'].includes(m[0])).map(m => <a key={m[0]} href={'#' + m[0]} aria-current={act === m[0] ? 'page' : undefined}><Icon n={ICON[m[0]] || 'book'} size={20} /><div><b>{m[1]}</b><small>{m[2]}</small></div></a>)}</div></div>)}
      </nav>
      <div className="tbr"><button className="btn" type="button" onClick={() => setPal(true)}>Search · Ctrl K</button><a className="chip" href="#progress">{RN[ri]} · {xp} XP</a>
        <button className="btn zbtn" type="button" onClick={() => setZoom(zoom === 0.67 ? 0.8 : zoom === 0.8 ? 1 : 0.67)} title="Page zoom on desktop screens">Zoom {Math.round(zoom * 100)}%</button>
        <button className="btn" type="button" aria-pressed={fx} onClick={() => setFx(!fx)} title="Toggle background effects">FX {fx ? 'on' : 'off'}</button>
        <button className="btn" id="tg" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
        <button className="btn burger" type="button" aria-expanded={menu} aria-controls="nv" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button></div></header>
    <main id="main-content" tabIndex={-1}><section className={'page on' + (id === 'home' ? ' hero' : '')} key={id}><div className="wm" aria-hidden="true"><Icon n={ICON[act] || 'shield'} size={150} intro /></div>{view(id, hash)}
      <div className="pager" hidden={id === 'lesson'}>{i > 0 ? <a className="btn" style={nb} href={'#' + META[i - 1][0]}>Back: {META[i - 1][1]}</a> : <span />}{i < META.length - 1 && <a className="btn p" style={nb} href={'#' + META[i + 1][0]}>Next: {META[i + 1][1]}</a>}</div></section></main>
    {pal && <div className="pal" onClick={() => setPal(false)}><div className="pbox" role="dialog" aria-label="Jump to a page" onClick={e => e.stopPropagation()}>
      <input autoFocus value={pq} onChange={e => setPq(e.target.value)} placeholder="Jump to a page or lesson (press / or Ctrl K)" onKeyDown={e => { if (e.key === 'Enter' && pl[0]) { location.hash = pl[0][0]; setPal(false); } }} />
      {pl.map(m => <a key={m[0]} href={'#' + m[0]} onClick={() => setPal(false)}><b>{m[1]}</b><span>{m[2] || 'Start page'}</span></a>)}</div></div>}
    <Toasts />
    <Nova />
    {rain && <Rain onDone={() => setRain(false)} />}
    <Bot pages={[...META.map(m => [m[0], m[1]] as [string, string]), ...LESSONS.map(l => ['lesson/' + l.id, l.title] as [string, string])]} />
    <footer><p className="mono">cyberpath@lab:~$ uname -a<br />CyberPath 1.0 · static site · no tracking · progress stays in your browser</p>Educational use only. Practice only on systems you own or have written permission to test. Unauthorized access is illegal.<br /><button className="btn" style={{ marginTop: 8 }} onClick={() => window.dispatchEvent(new Event('toggle-nova'))}>Show or hide Nova</button></footer></>);
}
