import { useState } from 'react';
import { caesar, vig } from './hooks';
function Vig() {
  const [t, setT] = useState('ATTACK AT DAWN'); const [k, setK] = useState('LEMON'); const [d, setD] = useState(false);
  return (<><label htmlFor="vt">Text</label><textarea id="vt" value={t} onChange={e => setT(e.target.value)} /><label htmlFor="vk">Key (letters)</label><input id="vk" type="text" value={k} onChange={e => setK(e.target.value)} />
    <label className="chk"><input type="checkbox" checked={d} onChange={() => setD(!d)} />Decrypt mode</label><div className="out"><div><b>{d ? 'Plaintext' : 'Ciphertext'}</b>{k.replace(/[^a-z]/gi, '') ? vig(t, k, d) : 'Enter a key made of letters'}</div></div>
    <p>Better than Caesar because the shift changes with each key letter. Still weak: a repeating key leaves patterns that frequency analysis can find (the Kasiski method). Modern ciphers like AES are designed to leave no such patterns.</p></>);
}
function Freq() {
  const [t, setT] = useState(caesar('THE EARLY BIRD CATCHES THE WORM AND EVERY SECURE SYSTEM NEEDS REGULAR UPDATES', 3));
  const cnt = Array(26).fill(0) as number[]; for (const ch of t.toUpperCase()) { const i = ch.charCodeAt(0) - 65; if (i >= 0 && i < 26) cnt[i]++; }
  const top = cnt.indexOf(Math.max(...cnt)); const mx = Math.max(1, ...cnt); const shift = (top - 4 + 26) % 26;
  return (<><label htmlFor="ft">Ciphertext (a Caesar cipher by default)</label><textarea id="ft" value={t} onChange={e => setT(e.target.value)} />
    <svg className="bars" viewBox="0 0 260 90" role="img" aria-label="Letter frequency chart">{cnt.map((n, i) => <g key={i}><rect x={i * 10 + 1} y={70 - n / mx * 60} width="8" height={n / mx * 60} /><text x={i * 10 + 5} y="82">{String.fromCharCode(65 + i)}</text></g>)}</svg>
    <p>Most common letter: <b>{Math.max(...cnt) ? String.fromCharCode(65 + top) : '-'}</b>. In English the most common letter is E, so a guess is a Caesar shift of {shift}.</p>
    <div className="out"><div><b>Guessed plaintext</b>{caesar(t, 26 - shift)}</div></div><p>Frequency analysis broke simple substitution ciphers for centuries. It is why good ciphers hide letter statistics.</p></>);
}
const PR = [5, 7, 11, 13, 17, 19, 23, 29]; const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
function Rsa() {
  const [p, setP] = useState(11); const [q, setQ] = useState(13); const [m, setM] = useState(42);
  const n = p * q, phi = (p - 1) * (q - 1); let e = 3; while (gcd(e, phi) !== 1) e += 2; let d = 1; while ((d * e) % phi !== 1) d++;
  const mp = (b: number, x: number) => { let r = 1; for (let i = 0; i < x; i++) r = (r * (b % n)) % n; return r; }; const mm = Math.min(m, n - 1); const c = mp(mm, e);
  return (<><p className="lead">RSA with tiny numbers so you can follow the math. Real keys are 2048 bits or more.</p><div className="sf"><label>p <select value={p} onChange={e2 => setP(+e2.target.value)}>{PR.map(x => <option key={x}>{x}</option>)}</select></label><label>q <select value={q} onChange={e2 => setQ(+e2.target.value)}>{PR.map(x => <option key={x}>{x}</option>)}</select></label></div>
    {p === q ? <p className="msg">Choose two different primes.</p> : <><label htmlFor="rm">Message number m: {mm}</label><input id="rm" type="range" min={2} max={n - 1} value={mm} onChange={e2 => setM(+e2.target.value)} style={{ width: '100%' }} />
      <div className="out"><div><b>n = p x q</b>{n}</div><div><b>phi = (p-1)(q-1)</b>{phi}</div><div><b>Public key (e, n)</b>({e}, {n}) with e coprime to phi</div><div><b>Private key (d, n)</b>({d}, {n}) because e x d mod phi = 1</div><div><b>Encrypt: c = m^e mod n</b>{c}</div><div><b>Decrypt: c^d mod n</b>{mp(c, d)} (the original message)</div></div></>}
    <p>Security rests on factoring: anyone can see n, but finding p and q gets very hard for huge n. Small n like this is trivial to break.</p></>);
}
const md = (b: number, x: number, p: number) => { let r = 1; for (let i = 0; i < x; i++) r = (r * b) % p; return r; };
function Dh() {
  const [a, setA] = useState(6); const [b, setB] = useState(15); const p = 23, g = 5; const A = md(g, a, p), B = md(g, b, p);
  return (<><p className="lead">Diffie-Hellman lets two people agree on a secret over an open channel. Public values: p = {p}, g = {g}. Toy numbers only.</p>
    <label htmlFor="da">Alice secret a: {a}</label><input id="da" type="range" min={2} max={20} value={a} onChange={e => setA(+e.target.value)} style={{ width: '100%' }} /><label htmlFor="db">Bob secret b: {b}</label><input id="db" type="range" min={2} max={20} value={b} onChange={e => setB(+e.target.value)} style={{ width: '100%' }} />
    <div className="out"><div><b>Alice sends A = g^a mod p</b>{A}</div><div><b>Bob sends B = g^b mod p</b>{B}</div><div><b>Alice computes B^a mod p</b>{md(B, a, p)}</div><div><b>Bob computes A^b mod p</b>{md(A, b, p)}</div></div>
    <p>Both get the same shared secret. An eavesdropper sees p, g, A and B but not a or b. Real systems use huge numbers or elliptic curves (ECDH), and authenticate the exchange so a man-in-the-middle cannot sit between the two.</p></>);
}
export default function CryptoLab() {
  const [k, setK] = useState(0); const T = ['Vigenere', 'Frequency analysis', 'RSA', 'Diffie-Hellman'];
  return (<><h2>Crypto lab</h2><p className="lead">Hands-on classic and modern cryptography with numbers small enough to follow. These are teaching toys and never safe for real secrets.</p>
    <div className="row">{T.map((t, i) => <button key={t} aria-pressed={k === i} onClick={() => setK(i)}>{t}</button>)}</div>{[<Vig key="v" />, <Freq key="f" />, <Rsa key="r" />, <Dh key="d" />][k]}</>);
}
