import { useState } from 'react';
import { useLS } from './hooks';
const Q: [string, string[], number, string][] = [
  ['A DDoS attack mainly hits which CIA pillar?', ['Confidentiality', 'Integrity', 'Availability'], 2, 'It makes the service unreachable.'],
  ['Which is a one-way function?', ['AES', 'SHA-256', 'RSA'], 1, 'Hashes cannot be reversed; AES and RSA are reversible with a key.'],
  ['Best way to store passwords?', ['AES with the key stored beside it', 'Argon2id or bcrypt with a salt', 'Plain MD5'], 1, 'Slow salted hashes resist cracking.'],
  ['Which team simulates attackers?', ['Red team', 'Blue team', 'White team'], 0, 'Red = offense, blue = defense.'],
  ['Default SSH port?', ['21', '22', '443'], 1, '21 is FTP, 443 is HTTPS.'],
  ['What does MFA add?', ['A second proof of identity', 'Faster login', 'Stronger Wi-Fi'], 0, 'Something you know plus have or are.'],
  ['Which is encoding, not encryption?', ['Base64', 'AES-GCM', 'ChaCha20'], 0, 'Base64 needs no key to reverse.'],
  ['In TLS, what encrypts the bulk session data?', ['A symmetric key', "The CA's private key", 'A hash'], 0, 'Asymmetric crypto sets up the symmetric key.'],
  ['What is phishing?', ['Tricking people into giving data or running malware', 'Scanning ports', 'Cracking Wi-Fi'], 0, 'It targets people, usually by email.'],
  ['Least privilege means', ['Users get only the access they need', 'Everyone is admin', 'Passwords are short'], 0, 'It limits damage when an account is compromised.']];
export default function Quiz() {
  const [i, setI] = useState(0); const [pick, setPick] = useState<number | null>(null); const [sc, setSc] = useState(0); const [best, setBest] = useLS<number>('qz', 0);
  if (i >= Q.length) return (<><h2>Quiz</h2><div className="card"><h3>Score: {sc} / {Q.length}</h3><p>{sc >= 8 ? 'Strong basics. Move on to the lab.' : 'Review the roadmap and encryption pages, then retry.'}</p>
    <button className="btn p" onClick={() => { setI(0); setSc(0); setPick(null); }}>Try again</button></div></>);
  const q = Q[i];
  return (<><h2>Quiz</h2><p className="lead">Question {i + 1} of {Q.length}</p><div className="card"><h3>{q[0]}</h3>
    <div className="row" style={{ flexDirection: 'column' }}>{q[1].map((o, n) => <button key={o} disabled={pick !== null} onClick={() => { setPick(n); if (n === q[2]) setSc(sc + 1); }}
      style={pick !== null && n === q[2] ? { borderColor: 'var(--grn)', borderWidth: 2 } : pick === n ? { borderColor: 'var(--red)', borderWidth: 2 } : undefined}>{o}</button>)}</div>
    {pick !== null && <><p className="msg">{pick === q[2] ? 'Correct. ' : 'Not quite. '}{q[3]}</p><button className="btn p" onClick={() => { if (i + 1 === Q.length) setBest(Math.max(best, sc)); setI(i + 1); setPick(null); }}>{i + 1 < Q.length ? 'Next question' : 'See score'}</button></>}</div></>);
}
