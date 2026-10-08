import { useState } from 'react';
const N: [string, string, number, number, string, string, string, string][] = [
  ['Internet', 'NET', 50, 165, 'The public network that connects everything. Untrusted by default.', 'TCP/IP, BGP, DNS', 'Scanning, DDoS, malware delivery, spoofed traffic', 'Firewalls, DDoS protection, TLS, treating all inbound traffic as untrusted'],
  ['Router', 'RTR', 150, 165, 'Forwards packets between networks and performs NAT.', 'IP, NAT, DHCP, routing protocols', 'Default passwords, outdated firmware, exposed admin page', 'Change defaults, update firmware, disable remote admin, restrict management access'],
  ['Firewall', 'FW', 250, 165, 'Allows or blocks traffic according to rules.', 'TCP, UDP, ICMP (rule based)', 'Overly broad allow rules, forgotten open ports, no logging', 'Default deny, rule reviews, logging and alerts, separate zones'],
  ['Client', 'PC', 250, 270, 'A user device such as a laptop or phone.', 'HTTP/S, DNS, SMB, SSH', 'Phishing, malware, unpatched software, theft', 'Updates, EDR, disk encryption, least privilege, MFA'],
  ['Web server', 'WEB', 390, 60, 'Serves websites and APIs.', 'HTTP, HTTPS, TLS', 'XSS, SQL injection, SSRF, authentication flaws, DDoS', 'WAF, input validation, authentication, TLS, security headers, patching'],
  ['DNS server', 'DNS', 390, 165, 'Turns names into IP addresses.', 'DNS (port 53), DNS over HTTPS, DNSSEC', 'Spoofing, cache poisoning, tunneling, hijacked records', 'DNSSEC, trusted resolvers, filtering, monitoring unusual queries'],
  ['Database', 'DB', 540, 60, 'Stores the application data.', 'SQL over TCP (for example 5432 or 3306)', 'SQL injection, exposed port, weak credentials, unencrypted backups', 'Private network only, least-privilege accounts, encryption, parameterized queries, backups'],
  ['SIEM', 'SIEM', 540, 270, 'Collects logs and raises alerts.', 'Syslog, agents, APIs', 'Missing log sources, alert fatigue, attackers deleting logs', 'Central tamper-resistant logs, tuned detections, 24/7 triage, retention']];
const E: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [4, 6], [2, 7], [4, 7]];
export default function NetMap() {
  const [s, setS] = useState(4); const n = N[s];
  return (<><h2>Network map</h2><p className="lead">A typical small network. Click or tab to a node to see its purpose, protocols, risks and defenses. Moving dashes show traffic flowing (a diagram, not live data).</p>
    <div className="nm"><svg viewBox="0 0 600 320" role="group" aria-label="Network diagram with eight nodes. Select a node for details.">
      {E.map(([a, b]) => <line key={a + '-' + b} className="e" x1={N[a][2]} y1={N[a][3]} x2={N[b][2]} y2={N[b][3]} />)}
      {N.map((m, i) => <g key={m[0]} className={'nd' + (i === s ? ' sel' : '')} role="button" tabIndex={0} aria-pressed={i === s} aria-label={m[0]} onClick={() => setS(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setS(i); } }}>
        <circle cx={m[2]} cy={m[3]} r="24" /><text className="c" x={m[2]} y={m[3] + 4}>{m[1]}</text><text className="l" x={m[2]} y={m[3] + 42}>{m[0]}</text></g>)}</svg></div>
    <div className="card" style={{ marginTop: 14 }} aria-live="polite"><h3>{n[0]}</h3><p><b>Purpose:</b> {n[4]}</p><p><b>Protocols:</b> {n[5]}</p><p><b>Risks:</b> {n[6]}</p><p><b>Defenses:</b> {n[7]}</p></div></>);
}
