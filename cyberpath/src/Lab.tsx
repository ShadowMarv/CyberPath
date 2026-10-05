import { useState } from 'react';
import { useLS, caesar } from './hooks';
type Ch = { t: string; d: string; p?: string; a: string[]; h: string; sim?: boolean };
const log = ['Oct 03 02:14:01 sshd: Failed password for root from 198.51.100.7', 'Oct 03 02:14:03 sshd: Failed password for admin from 203.0.113.45', 'Oct 03 02:14:04 sshd: Failed password for root from 203.0.113.45', 'Oct 03 02:14:05 sshd: Accepted password for sara from 192.0.2.10', 'Oct 03 02:14:06 sshd: Failed password for test from 203.0.113.45', 'Oct 03 02:14:07 sshd: Failed password for oracle from 203.0.113.45'].join('\n');
const hex = (s: string, pre: string) => [...s].map(c => pre + c.charCodeAt(0).toString(16)).join(pre === '' ? ' ' : '');
const C: Ch[] = [
  { t: '1. Rotate it', d: 'A message was shifted with ROT13. Decode it.', p: 'SYNT{pnrfne_vf_rnfl}', a: ['flag{caesar_is_easy}'], h: 'Apply ROT13 again to reverse it.' },
  { t: '2. Not encryption', d: 'Decode this string and submit the flag.', p: btoa('FLAG{base64_is_not_encryption}'), a: ['flag{base64_is_not_encryption}'], h: 'Think Base64.' },
  { t: '3. Name that hash', d: 'Which algorithm made this hash? (md5, sha1, sha256, bcrypt)', p: '5f4dcc3b5aa765d61d8327deb882cf99', a: ['md5'], h: '32 hex characters = 128 bits.' },
  { t: '4. Hex to text', d: 'Convert this hex to text.', p: hex('FLAG{hex}', ''), a: ['flag{hex}'], h: 'Each pair is one ASCII character: 46 is F.' },
  { t: '5. Brute force hunter', d: 'Which IP is brute-forcing SSH? Submit the IP address.', p: log, a: ['203.0.113.45'], h: 'Count the failed lines per IP. Ignore the accepted login.' },
  { t: '6. Which port?', d: 'Which TCP port does SSH use by default?', a: ['22'], h: 'It sits just below telnet (23).' },
  { t: '7. Bypass the login (SQL injection)', d: "The server builds: SELECT * FROM users WHERE user='[input]' AND pass='***'. Log in as admin without the password, then submit the flag it shows.", a: ['flag{sql_injection_bypass}'], h: "Close the quote and comment out the rest: admin'--", sim: true },
  { t: '8. URL decode', d: 'Decode this percent-encoded string.', p: hex('FLAG{url_decode}', '%'), a: ['flag{url_decode}'], h: '%46 is the ASCII code 0x46, the letter F.' },
  { t: '9. Read the token', d: 'This JWT is not encrypted. Decode its middle part for the flag.', p: btoa('{"alg":"none"}') + '.' + btoa(JSON.stringify({ user: 'guest', role: 'user', flag: 'FLAG{jwt_is_just_base64}' })).replace(/=+$/, '') + '.sig', a: ['flag{jwt_is_just_base64}'], h: 'Base64-decode the second part between the dots.' },
  { t: '10. Which pillar?', d: 'A DDoS attack mainly breaks which part of the CIA triad?', a: ['availability'], h: 'The service becomes unreachable.' },
  { t: '11. Spot the phish', d: 'What is the real domain this link goes to?', p: 'From: support@paypa1-secure.com\nSubject: Account locked!\nLink: http://paypal.com.verify-login.example.net/login', a: ['verify-login.example.net', 'example.net'], h: 'Read the host right to left, up to the first single slash.' },
  { t: '12. Unknown shift', d: 'A Caesar cipher with an unknown shift. Try all 25 shifts.', p: caesar('FLAG{brute_force}', 5), a: ['flag{brute_force}'], h: 'The flag starts with FLAG. Find the shift that gives it.' }];

function Item({ c, ok, onOk }: { c: Ch; ok: boolean; onOk: () => void }) {
  const [v, setV] = useState(''); const [u, setU] = useState(''); const [q, setQ] = useState('Query appears here');
  const [m, setM] = useState<[string, string]>(['', '']);
  const check = () => { if (c.a.includes(v.trim().toLowerCase())) { onOk(); setM(['Correct.' + (c.sim ? ' Real fix: parameterized queries.' : ''), 'var(--grn)']); } else setM(['Not yet. Try the hint.', 'var(--red)']); };
  const test = () => { setQ(`SELECT * FROM users WHERE user='${u}' AND pass='***'`); const bad = /'\s*(--|#)/.test(u) || /'\s*or\s*'?1'?\s*=\s*'?1/i.test(u); setM([bad ? 'Logged in as admin! Flag: FLAG{sql_injection_bypass}' : 'Login failed.', bad ? 'var(--grn)' : 'var(--red)']); };
  return (<div className={'ch' + (ok ? ' done' : '')}><h3>{c.t}</h3><p>{c.d}</p>{c.p && <pre>{c.p}</pre>}
    {c.sim && <><div className="r"><input type="text" value={u} onChange={e => setU(e.target.value)} placeholder="Username field" aria-label="Username" /><button className="btn" onClick={test}>Test login</button></div><pre>{q}</pre></>}
    <div className="r"><input type="text" value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') check(); }} placeholder="Your answer" aria-label={'Answer to ' + c.t} />
      <button className="btn p" onClick={check}>Check</button><button className="btn" onClick={() => setM(['Hint: ' + c.h, 'var(--mut)'])}>Hint</button></div>
    <div className="msg" role="status" style={{ color: m[1] }}>{m[0]}</div></div>);
}
export default function Lab() {
  const [s, setS] = useLS<number[]>('lab', []);
  return (<><h2>Practice lab</h2><p className="lead">Twelve challenges that run in your browser. Answers are flags like FLAG&#123;...&#125; or short answers. CyberChef helps.</p>
    <div className="mono">Solved {s.length} / {C.length}</div><div className="bar"><i style={{ width: s.length / C.length * 100 + '%' }} /></div>
    {C.map((c, i) => <Item key={c.t} c={c} ok={s.includes(i)} onOk={() => { if (!s.includes(i)) setS([...s, i]); }} />)}
    <button className="btn" onClick={() => setS([])}>Reset progress</button></>);
}
