import { useState } from 'react';
import { certs } from './data';
import { AR } from './arsenalData';
import { LESSONS } from './content/lessons';
import { CU } from './Pages';
const G: Record<string, { c: string[]; t: string[]; l: string[]; p: string }> = {
  'Start from zero': { c: ['ISC2 Certified in Cybersecurity (CC)', 'Google Cybersecurity Certificate', 'CompTIA Security+', 'Cisco Networking Academy courses'], t: ['Wireshark', 'Nmap', 'CyberChef', 'Kali Linux', 'Python'], l: ['intro', 'cia', 'ports'], p: 'Write a one-page security checklist and apply it to your own accounts and devices.' },
  'SOC analyst': { c: ['CompTIA Security+', 'CompTIA CySA+', 'BTL1 (Security Blue Team)', 'GIAC (GSEC, GCIH, GCFA)'], t: ['Splunk', 'Wazuh', 'Security Onion', 'Sigma rules', 'Wireshark', 'MITRE ATT&CK'], l: ['linux-ops', 'dnsmail', 'honeypots', 'fileless'], p: 'Build a home SIEM with Wazuh or Security Onion and write a detection for failed SSH logins.' },
  'Penetration tester': { c: ['eJPT (INE)', 'PNPT (TCM Security)', 'OSCP (OffSec)', 'CompTIA Security+'], t: ['Nmap', 'Burp Suite', 'Metasploit', 'ffuf', 'BloodHound'], l: ['apisec', 'linux-users', 'threatmodel'], p: 'Complete 10 lab rooms on systems you are allowed to test and publish write-ups with the fixes.' },
  'Cloud security': { c: ['Microsoft SC-900', 'AWS Security Specialty / AZ-500', 'CompTIA Security+'], t: ['Prowler', 'ScoutSuite', 'Trivy', 'CloudGoat', 'Docker'], l: ['oauth', 'linux-ops', 'threatmodel'], p: 'Deploy a small app in a free-tier account, scan it with Prowler or Trivy and fix the findings.' },
  'GRC and risk': { c: ['ISC2 Certified in Cybersecurity (CC)', 'CISSP (ISC2)', 'CompTIA Security+'], t: ['NIST CSF', 'CIS Controls', 'MITRE ATT&CK'], l: ['risk', 'cia', 'threatmodel'], p: 'Write a risk register for a fictional small business using the NIST Cybersecurity Framework.' },
  'Forensics and IR': { c: ['BTL1 (Security Blue Team)', 'GIAC (GSEC, GCIH, GCFA)', 'CompTIA CySA+'], t: ['Autopsy', 'Volatility 3', 'Velociraptor', 'Eric Zimmerman tools'], l: ['forensics', 'fileless', 'linux-ops'], p: 'Analyze a public forensic image or memory sample and write a timeline report.' } };
export default function Finder() {
  const [g, setG] = useState('Start from zero'); const [free, setFree] = useState(false); const x = G[g]; const tools = AR.flatMap(c => c[2]);
  const cs = x.c.map(n => certs.find(r => r[0] === n)).filter((r): r is string[] => !!r).filter(r => !free || /free|low/i.test(r[3]));
  return (<><h2>Tools and certificate finder</h2><p className="lead">Pick a goal and get a starter plan: lessons, tools, certificates and a portfolio project. Prices and free options change, so check each official page.</p>
    <label htmlFor="fg">My goal</label><select id="fg" value={g} onChange={e => setG(e.target.value)}>{Object.keys(G).map(k => <option key={k}>{k}</option>)}</select><label className="chk"><input type="checkbox" checked={free} onChange={() => setFree(!free)} />Show only free or low-cost certificates</label>
    <h3 style={{ marginTop: 24 }}>1. Start with these lessons</h3><div className="grid">{x.l.map(id => { const l = LESSONS.find(y => y.id === id); return l ? <a className="card" key={id} href={'#lesson/' + id}><h3>{l.title}</h3><p>{l.level} · {l.time}</p></a> : null; })}</div>
    <h3 style={{ marginTop: 24 }}>2. Learn these tools</h3><div className="grid">{x.t.map(n => { const t = tools.find(y => y[0] === n); return t ? <div className="card" key={n}><h3>{t[0]}</h3><p>{t[1]}</p><a href={t[2]} target="_blank" rel="noopener noreferrer">Open site</a></div> : null; })}</div>
    <h3 style={{ marginTop: 24 }}>3. Certificates to consider</h3><div className="grid">{cs.map(r => <div className="card" key={r[0]}><span className="tag">{r[1]}</span><h3>{r[0]}</h3><p>{r[3]}</p><p>{r[4]}</p><a href={CU[r[0]]} target="_blank" rel="noopener noreferrer">Official page</a></div>)}{!cs.length && <p>No free or low-cost options in this list. Untick the filter to see all.</p>}</div>
    <h3 style={{ marginTop: 24 }}>4. Portfolio project</h3><div className="card"><p>{x.p}</p></div></>);
}
