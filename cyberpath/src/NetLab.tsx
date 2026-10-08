import { useEffect, useState } from 'react';
import { sha } from './hooks';
const f = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
function sub(c: string) {
  const m = c.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/); if (!m) return null; const p = +m[5]; const o = m.slice(1, 5).map(Number);
  if (o.some(v => v > 255) || p > 32) return null;
  const ip = ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0; const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0; const net = (ip & mask) >>> 0, bc = (net | ~mask) >>> 0;
  return { net: f(net), mask: f(mask), bc: f(bc), first: f(p >= 31 ? net : net + 1), last: f(p >= 31 ? bc : bc - 1), hosts: p >= 31 ? 2 ** (32 - p) : 2 ** (32 - p) - 2 };
}
export const PORTS: string[][] = [['21', 'FTP', 'Plaintext. Prefer SFTP.'], ['22', 'SSH', 'Remote shell. Keys and MFA, no root login.'], ['23', 'Telnet', 'Plaintext. Disable it.'], ['25', 'SMTP', 'Mail relay. Watch for open relays and spam.'], ['53', 'DNS', 'Name lookups. Used for tunneling and exfiltration.'], ['80', 'HTTP', 'Unencrypted web. Redirect to HTTPS.'], ['110', 'POP3', 'Old mail retrieval. Use the TLS version.'], ['123', 'NTP', 'Time sync. Abused for amplification DDoS.'], ['143', 'IMAP', 'Mail access. Use IMAPS (993).'], ['389', 'LDAP', 'Directory service. Core of Active Directory.'], ['443', 'HTTPS', 'Encrypted web.'], ['445', 'SMB', 'File sharing. Ransomware favorite; never expose.'], ['1433', 'MSSQL', 'Database. Never expose to the internet.'], ['3306', 'MySQL', 'Database. Restrict by firewall.'], ['3389', 'RDP', 'Remote desktop. Brute-force target; use VPN and MFA.'], ['5432', 'PostgreSQL', 'Database. Restrict by firewall.'], ['5900', 'VNC', 'Remote screen. Often weakly protected.']];
const bits = (h: string) => [...h].flatMap(c => parseInt(c, 16).toString(2).padStart(4, '0').split(''));
export default function NetLab() {
  const [c, setC] = useState('192.168.10.0/26'); const [q, setQ] = useState(''); const [t, setT] = useState('password'); const [a, setA] = useState(''); const [b, setB] = useState('');
  useEffect(() => { Promise.all([sha('SHA-256', t), sha('SHA-256', t + '.')]).then(r => { setA(r[0]); setB(r[1]); }).catch(() => undefined); }, [t]);
  const r = sub(c); const ba = bits(a), bb = bits(b); const diff = ba.filter((v, i) => v !== bb[i]).length; const s = q.toLowerCase();
  return (<><h2>Network and crypto lab</h2><p className="lead">Three visual tools: subnet math, a port atlas, and an avalanche-effect viewer for hashes.</p>
    <div className="grid"><div className="card"><h3>Subnet calculator</h3><label htmlFor="cidr">CIDR (e.g. 10.0.0.0/24)</label><input id="cidr" type="text" value={c} onChange={e => setC(e.target.value)} />
      <div className="out">{r ? <><div><b>Network / mask</b>{r.net} / {r.mask}</div><div><b>Usable range</b>{r.first} to {r.last}</div><div><b>Broadcast · hosts</b>{r.bc} · {r.hosts}</div></> : <div>Enter a valid IPv4 CIDR.</div>}</div></div>
      <div className="card"><h3>Hash avalanche</h3><label htmlFor="hv">Text (second hash adds one dot)</label><input id="hv" type="text" value={t} onChange={e => setT(e.target.value)} />
        <div className="row" style={{ alignItems: 'flex-start' }}><div className="hg">{ba.map((v, i) => <i key={i} className={v === '1' ? 'on' : ''} />)}</div><div className="hg">{bb.map((v, i) => <i key={i} className={v !== ba[i] ? 'df' : v === '1' ? 'on' : ''} />)}</div></div>
        <p className="msg">{diff} of 256 bits changed (about half is ideal). Red cells differ.</p></div></div>
    <h3 style={{ marginTop: 28 }}>Port atlas</h3><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search port or service (e.g. 445, ssh)" aria-label="Search ports" />
    <div className="tbl"><table><thead><tr><th>Port</th><th>Service</th><th>Security note</th></tr></thead><tbody>{PORTS.filter(p => p.join(' ').toLowerCase().includes(s)).map(p => <tr key={p[0]}><td className="mono">{p[0]}</td><td><b>{p[1]}</b></td><td>{p[2]}</td></tr>)}</tbody></table></div></>);
}
