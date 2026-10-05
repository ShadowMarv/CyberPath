import { Fragment, useEffect, useState } from 'react';
import { useHash, useLS } from './hooks';
import { Home, Roadmap, Careers, Teams, Crypto, Certs, Resources, Commands, Glossary, HomeLab } from './Pages';
import Lab from './Lab';
import Quiz from './Quiz';
import Terminal from './Terminal';
import KillChain from './KillChain';
import { Toolbox, Planner } from './Tools';
const META: [string, string, string, string][] = [
  ['home', 'Home', '', 'Start'], ['road', 'Roadmap', 'Four stages with a progress tracker.', 'Learn'], ['planner', 'Study planner', 'Turn weekly hours into a timeline.', 'Learn'],
  ['careers', 'Careers', 'Eight roles and how to reach each.', 'Learn'], ['teams', 'Cyber teams', 'Red, blue, purple and the rest.', 'Learn'], ['crypto', 'Encryption', 'How crypto really works.', 'Learn'], ['kill', 'Attack vs defense', 'Walk the kill chain as red or blue.', 'Learn'],
  ['certs', 'Certificates', 'Which ones are worth it.', 'Prove'], ['quiz', 'Quiz', 'Ten questions to test the basics.', 'Prove'],
  ['res', 'Resources', 'Labs, YouTube, sites, podcasts.', 'Explore'], ['tools', 'Commands', 'A copy-ready cheat sheet.', 'Explore'], ['gloss', 'Glossary', 'Plain-English security terms.', 'Explore'], ['homelab', 'Home lab guide', 'Build a safe practice lab.', 'Explore'],
  ['lab', 'Practice lab', 'Twelve hands-on challenges.', 'Practice'], ['terminal', 'Terminal game', 'Find 3 flags in a fake Linux box.', 'Practice'], ['toolbox', 'Toolbox', 'Encode, hash and test passwords.', 'Practice']];
const links: [string, string, string][] = META.slice(1).map(m => [m[0], m[1], m[2]]);
function view(id: string) {
  switch (id) {
    case 'road': return <Roadmap />; case 'planner': return <Planner />; case 'careers': return <Careers />; case 'teams': return <Teams />; case 'crypto': return <Crypto />;
    case 'certs': return <Certs />; case 'quiz': return <Quiz />; case 'res': return <Resources />; case 'tools': return <Commands />; case 'gloss': return <Glossary />;
    case 'homelab': return <HomeLab />; case 'lab': return <Lab />; case 'toolbox': return <Toolbox />; case 'kill': return <KillChain />; case 'terminal': return <Terminal />; default: return <Home links={links} />;
  }
}
export default function App() {
  const hash = useHash(); const id = META.some(m => m[0] === hash) ? hash : 'home';
  const [theme, setTheme] = useLS<string>('t', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const i = META.findIndex(m => m[0] === id);
  useEffect(() => { document.title = (id === 'home' ? '' : META[i][1] + ' | ') + 'CyberPath'; }, [id, i]);
  const [xp, setXp] = useState(0); const [pal, setPal] = useState(false); const [pq, setPq] = useState('');
  useEffect(() => {
    const n = (k: string) => { try { const v = JSON.parse(localStorage.getItem(k) || '0'); return Array.isArray(v) ? v.length : Number(v) || 0; } catch { return 0; } };
    const f = () => setXp(n('rm') * 10 + n('lab') * 40 + n('tf') * 50 + n('qz') * 20); f();
    window.addEventListener('ls', f); return () => window.removeEventListener('ls', f);
  }, []);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(p => !p); setPq(''); } else if (e.key === 'Escape') setPal(false); };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, []);
  const T = [0, 100, 250, 450, 700, 950]; const RN = ['Newbie', 'Apprentice', 'Analyst', 'Hunter', 'Operator', 'Architect'];
  const ri = T.filter(t => xp >= t).length - 1; const pct = ri === T.length - 1 ? 100 : (xp - T[ri]) / (T[ri + 1] - T[ri]) * 100;
  const pl = META.filter(m => (m[1] + m[2] + m[3]).toLowerCase().includes(pq.toLowerCase()));
  let lg = ''; const nb = { textDecoration: 'none' };
  return (<>
    <aside id="sd"><a className="brand" href="#home">Cyber<b>Path</b></a>
      <div id="sn" role="navigation" aria-label="Pages">{META.map(m => { const g = m[3] !== lg; lg = m[3]; return <Fragment key={m[0]}>{g && <div className="g">{m[3]}</div>}<a href={'#' + m[0]} aria-current={m[0] === id ? 'page' : undefined}>{m[1]}</a></Fragment>; })}</div>
      <div className="xp"><b>Rank: {RN[ri]}</b><span> · {xp} XP</span><div className="bar" style={{ margin: '8px 0 0' }}><i style={{ width: pct + '%' }} /></div></div>
      <button className="btn" type="button" onClick={() => setPal(true)}>Search pages · Ctrl K</button>
      <button className="btn" id="tg" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button></aside>
    <main><section className={'page on' + (id === 'home' ? ' hero' : '')} key={id}>{view(id)}
      <div className="pager">{i > 0 ? <a className="btn" style={nb} href={'#' + META[i - 1][0]}>Back: {META[i - 1][1]}</a> : <span />}{i < META.length - 1 && <a className="btn p" style={nb} href={'#' + META[i + 1][0]}>Next: {META[i + 1][1]}</a>}</div></section></main>
    {pal && <div className="pal" onClick={() => setPal(false)}><div className="pbox" role="dialog" aria-label="Jump to a page" onClick={e => e.stopPropagation()}>
      <input autoFocus value={pq} onChange={e => setPq(e.target.value)} placeholder="Jump to a page..." onKeyDown={e => { if (e.key === 'Enter' && pl[0]) { location.hash = pl[0][0]; setPal(false); } }} />
      {pl.map(m => <a key={m[0]} href={'#' + m[0]} onClick={() => setPal(false)}><b>{m[1]}</b><span>{m[2] || 'Start page'}</span></a>)}</div></div>}
    <footer>Educational use only. Practice only on systems you own or have written permission to test. Unauthorized access is illegal.</footer></>);
}
