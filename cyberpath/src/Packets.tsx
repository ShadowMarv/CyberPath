import { useState } from 'react';
const C = '192.0.2.7', S = '198.51.100.20', D = '192.0.2.53', W = '198.51.100.30', X = '203.0.113.45';
const PK: string[][] = [
  ['DNS', C, D, '53012', '53', '74', 'Standard query A shop.example', 'The client asks the DNS server for the address of shop.example. Plain DNS is neither signed nor encrypted.'],
  ['DNS', D, C, '53', '53012', '90', 'Standard query response A 198.51.100.20', 'The answer tells the client which IP address to connect to.'],
  ['TCP', C, S, '51514', '443', '66', '51514 > 443 [SYN]', 'Step 1 of the three-way handshake: the client asks to connect.'],
  ['TCP', S, C, '443', '51514', '66', '443 > 51514 [SYN, ACK]', 'Step 2: the server accepts the request.'],
  ['TCP', C, S, '51514', '443', '54', '51514 > 443 [ACK]', 'Step 3: the connection is established.'],
  ['TLS', C, S, '51514', '443', '571', 'Client Hello (SNI shop.example)', 'The browser starts the TLS handshake and names the site it wants.'],
  ['TLS', S, C, '443', '51514', '1420', 'Server Hello, Certificate', 'The server answers with its certificate so the browser can verify it.'],
  ['TLS', C, S, '51514', '443', '129', 'Application Data', 'Encrypted. An observer sees sizes and timing, not the content.'],
  ['TLS', S, C, '443', '51514', '1380', 'Application Data', 'The encrypted response.'],
  ['HTTP', C, W, '51600', '80', '412', 'GET /login.html HTTP/1.1', 'Plain HTTP: anyone on the path can read this request.'],
  ['HTTP', W, C, '80', '51600', '1020', 'HTTP/1.1 200 OK (login form)', 'The login form is delivered without encryption.'],
  ['HTTP', C, W, '51600', '80', '468', 'POST /login username=sara password=hunter2', 'Credentials travel in cleartext. This is why logins must use HTTPS.'],
  ['ARP', C, 'Broadcast', '', '', '42', 'Who has 192.0.2.1? Tell 192.0.2.7', 'ARP finds the hardware address for an IP on the local network. It has no authentication, which enables ARP spoofing.'],
  ['ICMP', C, S, '', '', '98', 'Echo (ping) request', 'Ping checks whether a host is reachable.'],
  ['ICMP', S, C, '', '', '98', 'Echo (ping) reply', 'The host answered.'],
  ['TCP', X, S, '40001', '21', '60', '40001 > 21 [SYN]', 'One of several connection attempts from the same external address.'],
  ['TCP', S, X, '21', '40001', '60', '21 > 40001 [RST, ACK]', 'Port 21 is closed, so the server resets the attempt.'],
  ['TCP', X, S, '40002', '22', '60', '40002 > 22 [SYN]', 'The same source now tries port 22.'],
  ['TCP', X, S, '40003', '23', '60', '40003 > 23 [SYN]', 'And port 23. Probing many ports in sequence is a port scan pattern.'],
  ['TCP', C, S, '51514', '443', '54', '51514 > 443 [FIN, ACK]', 'The client closes the connection politely.']];
const QS: string[][] = [['Which address looks like it is port scanning?', 'Packets 16 to 19: 203.0.113.45 sends SYN packets to ports 21, 22 and 23 in quick succession, and the server resets the closed ones.'], ['Which three packets form the TCP handshake?', 'Packets 3, 4 and 5: SYN, SYN-ACK, ACK.'], ['What is dangerous about packet 12?', 'It is an HTTP POST on port 80 that carries a username and password in cleartext. Anyone on the network path could read it. Use HTTPS.']];
const match = (p: string[], q: string) => { const s = q.trim().toLowerCase(); if (!s) return true; const a = s.match(/^ip\.addr\s*==\s*(\S+)$/); if (a) return p[1] === a[1] || p[2] === a[1]; const t = s.match(/^tcp\.port\s*==\s*(\d+)$/); if (t) return p[0] !== 'DNS' && (p[3] === t[1] || p[4] === t[1]); return [p[0], p[1], p[2], p[6]].join(' ').toLowerCase().includes(s); };
export default function Packets() {
  const [q, setQ] = useState(''); const [sel, setSel] = useState(2); const p = PK[sel];
  const rows = PK.map((x, i) => [x, i] as [string[], number]).filter(([x]) => match(x, q));
  const det = [`Frame ${sel + 1}: ${p[5]} bytes on the wire`, p[0] === 'ARP' ? 'Ethernet II: broadcast to ff:ff:ff:ff:ff:ff (ARP has no IP layer)' : `Internet Protocol: ${p[1]} > ${p[2]}`, ...(p[3] ? [`${p[0] === 'DNS' ? 'UDP' : 'TCP'} ports: ${p[3]} > ${p[4]}`] : []), 'Info: ' + p[6]];
  return (<><h2>Packet analyzer</h2><p className="lead">A fictional capture, read the way you would in Wireshark. Filter by protocol (tcp, dns, tls, http, arp, icmp), by text, or with <code>ip.addr == 203.0.113.45</code> and <code>tcp.port == 443</code>. Click a packet for details.</p>
    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter, for example: ip.addr == 203.0.113.45" aria-label="Packet filter" />
    <div className="tbl pkt"><table><thead><tr><th>No.</th><th>Time</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Info</th></tr></thead><tbody>{rows.map(([x, i]) => <tr key={i} tabIndex={0} aria-selected={i === sel} onClick={() => setSel(i)} onKeyDown={e => { if (e.key === 'Enter') setSel(i); }}><td>{i + 1}</td><td>{(i * 0.083).toFixed(3)}</td><td>{x[1]}</td><td>{x[2]}</td><td>{x[0]}</td><td>{x[6]}</td></tr>)}</tbody></table></div>
    {!rows.length && <p>No packets match this filter.</p>}
    <div className="card" style={{ marginTop: 14 }} aria-live="polite"><h3>Packet {sel + 1} details</h3><div className="cmd mono" style={{ whiteSpace: 'pre-wrap' }}>{det.join('\n')}</div><p><b>What it shows:</b> {p[7]}</p></div>
    <h3 style={{ marginTop: 24 }}>Questions to answer from the capture</h3>{QS.map(x => <details className="tl" key={x[0]}><summary>{x[0]}</summary><p>{x[1]}</p></details>)}</>);
}
