import { useEffect, useState } from 'react';
import Globe from './Globe';
import { useLS, caesar, sha } from './hooks';
import { teams, cry, certs, R, CP, TL, G } from './data';

function Typer() {
  const W = ['defend networks.', 'hack ethically.', 'hunt threats.', 'break crypto.', 'land the job.'];
  const [i, setI] = useState(0); const [n, setN] = useState(0);
  useEffect(() => { const w = W[i]; const t = setTimeout(() => { if (n === w.length) { setN(0); setI((i + 1) % W.length); } else setN(n + 1); }, n === w.length ? 1400 : 70); return () => clearTimeout(t); }, [n, i]);
  return <span className="ty">{W[i].slice(0, n)}</span>;
}
export function Home({ links }: { links: [string, string, string][] }) {
  const [t, setT] = useState('Attack at dawn'); const [k, setK] = useState(3); const [h, setH] = useState('');
  useEffect(() => { sha('SHA-256', t).then(setH).catch(() => setH('Not available in this browser')); }, [t]);
  const nb = { textDecoration: 'none' };
  return (<>
    <h1>Learn to <Typer /></h1>
    <p className="lead">A senior's map: what to learn first, which team fits you, how encryption works, which certificates matter, and a lab to practice right here.</p>
    <div className="cta"><a className="btn p" href="#road" style={nb}>Start the roadmap</a><a className="btn" href="#lab" style={nb}>Jump to the lab</a></div>
    <Globe />
    <div className="bench"><h3>Cipher bench: try it now</h3>
      <label htmlFor="pt">Type a message</label><input type="text" id="pt" value={t} onChange={e => setT(e.target.value)} />
      <label htmlFor="sh">Caesar shift: {k}</label><input type="range" id="sh" min={1} max={25} value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%' }} />
      <div className="out">
        <div><b>Caesar (broken in seconds, never use)</b>{caesar(t, k)}</div>
        <div><b>Base64 (encoding, not encryption)</b>{(() => { try { return btoa(unescape(encodeURIComponent(t))); } catch { return ''; } })()}</div>
        <div><b>SHA-256 (one-way hash)</b>{h}</div></div>
      <p className="msg">Change one letter and the hash changes completely. That is the avalanche effect.</p></div>
    <h2 style={{ marginTop: 44, fontSize: 26 }}>Where do you want to go?</h2>
    <div className="grid" style={{ marginTop: 12 }}>{links.map(l => <a key={l[0]} className="card" href={'#' + l[0]}><h3>{l[1]}</h3><p>{l[2]}</p></a>)}</div>
  </>);
}

const ST: [string, string[]][] = [
  ['Stage 1: Foundations', ['Networking: TCP/IP, DNS, HTTP, subnetting (Professor Messer)', 'Linux basics (Linux Journey, OverTheWire Bandit)', 'Python and Bash scripting', 'Windows and Active Directory basics']],
  ['Stage 2: Core security', ['CIA triad, risk, IAM, least privilege', 'OWASP Top 10 and PortSwigger labs', 'Cryptography and TLS basics', 'Wireshark, Nmap, Burp Suite, CyberChef', 'TryHackMe Pre Security, then SOC Level 1 or Jr Pentester']],
  ['Stage 3: Pick a lane', ['Defense: Splunk free training, CyberDefenders, MITRE ATT&CK', 'Offense: Hack The Box, PortSwigger, TCM PEH course', 'GRC: NIST CSF, ISO 27001 overview, ISC2 CC', 'AppSec or Cloud: secure code review, AWS/Azure security']],
  ['Stage 4: Prove it', ['Earn one entry-level certificate for your lane', 'Publish 5 write-ups on GitHub or a blog', 'Play 3 CTFs (picoCTF, CTFtime)', 'Apply for junior roles and internships; join communities']]];
export function Roadmap() {
  const [done, setDone] = useLS<string[]>('rm', []);
  const total = ST.reduce((n, s) => n + s[1].length, 0);
  const tog = (k: string) => setDone(done.includes(k) ? done.filter(x => x !== k) : [...done, k]);
  return (<><h2>The roadmap</h2><p className="lead">Tick items as you finish them. Progress is saved in your browser.</p>
    <div className="mono">{done.length} / {total} done</div><div className="bar"><i style={{ width: done.length / total * 100 + '%' }} /></div>
    {ST.map((s, i) => <details className="stage" key={s[0]} open={i === 0}><summary>{s[0]}</summary><div className="in">
      {s[1].map(it => <label className="chk" key={it}><input type="checkbox" checked={done.includes(it)} onChange={() => tog(it)} />{it}</label>)}</div></details>)}</>);
}

export const Careers = () => (<><h2>Career paths</h2><p className="lead">Pick one to aim at. Each shows what you do and where to start.</p>
  <div className="grid">{CP.map(c => <div className="card" key={c[0]}><h3>{c[0]}</h3><p>{c[1]}</p><p><b>{c[2]}</b></p></div>)}</div></>);
export const Teams = () => (<><h2>Types of cyber teams</h2><p className="lead">Colors describe what a team does, not rank. Real companies often blend them.</p>
  <div className="grid">{teams.map(t => <div className="card" key={t[0]} style={{ borderTop: '5px solid ' + t[1] }}><h3>{t[0]}</h3><p>{t[2]}</p><p><b>Tools and skills:</b> {t[3]}</p><p>{t[4]}</p></div>)}</div></>);
export const Crypto = () => (<><h2>Types of encryption and related tools</h2><p className="lead">Never invent your own crypto. Use vetted libraries and current algorithms.</p>
  <div className="grid">{cry.map(c => <div className="card" key={c[0]}><h3>{c[0]}</h3><p>{c[1]}</p><p><b>Examples:</b> {c[2]}</p><p>{c[3]}</p></div>)}</div></>);

const CU: Record<string, string> = {
  'ISC2 Certified in Cybersecurity (CC)': 'https://www.isc2.org/certifications/cc', 'Microsoft SC-900': 'https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/',
  'Google Cybersecurity Certificate': 'https://grow.google/certificates/cybersecurity/', 'Cisco Networking Academy courses': 'https://www.netacad.com',
  'CompTIA Security+': 'https://www.comptia.org/certifications/security', 'CompTIA Network+': 'https://www.comptia.org/certifications/network',
  'eJPT (INE)': 'https://ine.com/learning/certifications/external/elearnsecurity-junior-penetration-tester-cert', 'BTL1 (Security Blue Team)': 'https://securityblue.team/why-btl1/',
  'CompTIA CySA+': 'https://www.comptia.org/certifications/cybersecurity-analyst', 'PNPT (TCM Security)': 'https://certifications.tcm-sec.com/pnpt/',
  'Cisco CCNA': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html', 'AWS Security Specialty / AZ-500': 'https://aws.amazon.com/certification/certified-security-specialty/',
  'OSCP (OffSec)': 'https://www.offsec.com/courses/pen-200/', 'CISSP (ISC2)': 'https://www.isc2.org/certifications/cissp', 'GIAC (GSEC, GCIH, GCFA)': 'https://www.giac.org/certifications/' };
export function Certs() {
  const [f, setF] = useState('All');
  return (<><h2>Certificates that help</h2><p className="lead">Certificates open doors; skills close the interview. Prices change, so check the vendor page.</p>
    <div className="row">{['All', 'Entry', 'Mid', 'Advanced'].map(l => <button key={l} aria-pressed={f === l} onClick={() => setF(l)}>{l}</button>)}</div>
    <div className="tbl"><table><thead><tr><th>Certificate</th><th>Level</th><th>Lane</th><th>Cost</th><th>Why it matters</th><th>Official page</th></tr></thead>
      <tbody>{certs.filter(c => f === 'All' || c[1] === f).map(c => <tr key={c[0]}><td><b>{c[0]}</b></td>{c.slice(1).map((x, i) => <td key={i}>{x}</td>)}<td><a href={CU[c[0]]} target="_blank" rel="noopener noreferrer">Open site</a></td></tr>)}</tbody></table></div></>);
}

export function Resources() {
  const [q, setQ] = useState(''); const s = q.toLowerCase();
  return (<><h2>Free resources and links</h2><p className="lead">Free tiers and promotions change, so verify before relying on one.</p>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search (e.g. youtube, linux, crypto)" aria-label="Search resources" />
    {R.map(g => { const it = g[1].filter(r => (g[0] + ' ' + r.join(' ')).toLowerCase().includes(s));
      return it.length ? <div key={g[0]}><h3 style={{ marginTop: 24 }}>{g[0]}</h3>{it.map(r => <a key={r[1]} className="res" href={r[1]} target="_blank" rel="noopener noreferrer"><b>{r[0]}</b><span>{r[2]}</span></a>)}</div> : null; })}</>);
}

function Cmd({ t, c }: { t: string; c: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(c).then(() => { setOk(true); setTimeout(() => setOk(false), 1200); }).catch(() => undefined); };
  return <div className="card"><button className="btn cp" type="button" onClick={copy}>{ok ? 'Copied' : 'Copy'}</button><p><b>{t}</b></p><div className="cmd mono">{c}</div></div>;
}
export const Commands = () => (<><h2>Command cheat sheet</h2><p className="lead">Run these only on your own machines or lab targets.</p><div className="grid">{TL.map(c => <Cmd key={c[0]} t={c[0]} c={c[1]} />)}</div></>);

export function Glossary() {
  const [q, setQ] = useState(''); const s = q.toLowerCase(); const it = G.filter(g => (g[0] + g[1]).toLowerCase().includes(s));
  return (<><h2>Glossary</h2><p className="lead">Plain-English security terms.</p>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search terms (e.g. phishing)" aria-label="Search glossary" />
    <dl>{it.length ? it.map(g => <div key={g[0]}><dt>{g[0]}</dt><dd>{g[1]}</dd></div>) : <dd>No match. Try another word.</dd>}</dl></>);
}

const HL: string[][] = [['1. Virtualize', 'Install VirtualBox or VMware Workstation Player. Never practice on your main OS.'], ['2. Attacker VM', 'Kali Linux or Parrot OS in a VM. Snapshot it after setup.'], ['3. Targets', 'Run OWASP Juice Shop, DVWA, Metasploitable 2 or VulnHub machines as victims.'], ['4. Isolate the network', 'Use host-only or internal networks so vulnerable VMs never touch your home LAN or the internet.'], ['5. Windows and AD', 'Use Microsoft evaluation ISOs to build a small Active Directory domain for attack and defense practice.'], ['6. Defender stack', 'Install Wazuh, Security Onion or Splunk Free to watch your own attacks appear in the logs.'], ['7. Snapshots and notes', 'Snapshot before each exercise. Keep notes in Obsidian or GitHub as portfolio write-ups.'], ['8. Rules', 'Only test what you own or have written permission to test.']];
export const HomeLab = () => (<><h2>Build a safe home lab</h2><p className="lead">A free lab on one laptop (16 GB RAM is comfortable) beats any course.</p><div className="grid">{HL.map(c => <div className="card" key={c[0]}><h3>{c[0]}</h3><p>{c[1]}</p></div>)}</div></>);
