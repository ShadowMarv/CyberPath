import { useEffect, useRef, type ReactElement } from 'react';
import gsap from 'gsap';
const on = { fill: 'var(--onacc)' };
const RINGS: [string, number][] = [['People and process', 100], ['Network', 80], ['Host', 60], ['Application', 40]];
const CIA: [string, number, number, string, string][] = [['C', 180, 40, 'Confidentiality', 'Only the right people see it'], ['I', 60, 170, 'Integrity', 'Not changed without permission'], ['A', 300, 170, 'Availability', 'Works when you need it']];
const PERM = '-rwxr-x---'; const XS = [70, 260, 450];
const ST: [number, number, string][] = [[0, 1, '1 Click "Sign in"'], [1, 2, '2 Redirect to the provider'], [0, 2, '3 Log in (with MFA)'], [2, 1, '4 Short-lived code'], [1, 2, '5 Swap code for tokens']];
const CAP: Record<string, string> = { authn: 'Authentication comes first, authorization second, and both are checked on the server.', risk: 'Score each risk, then decide what to do about it.', threatmodel: 'Ask the six STRIDE questions for every flow that crosses a trust boundary.', dnsmail: 'DNS resolves names step by step. SPF, DKIM and DMARC are published in DNS too.', apisec: 'Every API call should pass the same four checks.', forensics: 'Collect the data that disappears fastest first.', fileless: 'The parent-child relationship between processes is the clue defenders watch.', intro: 'Defense in depth: if one layer fails, the next still protects the data.', cia: 'The three goals every security decision protects.', crypto: 'Encryption turns readable data into ciphertext. Only the key turns it back.', ports: 'The IP address finds the machine. The port finds the service.', 'linux-fs': 'Each triplet is a sum: r = 4, w = 2, x = 1, so rwxr-x--- is 750.', oauth: 'The app never sees your password. It only receives a code, then tokens.' };
function svg(id: string): ReactElement | null {
  switch (id) {
    case 'intro': return <svg viewBox="0 0 360 220" role="img" aria-label="Concentric layers: people and process, network, host, application, data">{RINGS.map(([t, r]) => <g key={t} data-r><circle cx="180" cy="110" r={r} className="b" /><text x="180" y={110 - r + 14} textAnchor="middle" fontSize="11">{t}</text></g>)}<g data-r><circle cx="180" cy="110" r="20" className="p" /><text x="180" y="114" textAnchor="middle" fontSize="11" style={on}>Data</text></g></svg>;
    case 'cia': return <svg viewBox="0 0 360 235" role="img" aria-label="Triangle with Confidentiality, Integrity and Availability around the data"><path data-a d="M180 40L60 170H300z" className="a" /><text x="180" y="130" textAnchor="middle" fontSize="13">DATA</text>
      {CIA.map(([l, x, y, t, s]) => <g key={l} data-a><circle cx={x} cy={y} r="22" className="p" /><text x={x} y={y + 5} textAnchor="middle" fontSize="16" fontWeight="700" style={on}>{l}</text>
        <text x={l === 'C' ? x + 32 : x} y={l === 'C' ? y - 2 : y + 40} textAnchor={l === 'C' ? 'start' : 'middle'} fontSize="13" fontWeight="700">{t}</text><text x={l === 'C' ? x + 32 : x} y={l === 'C' ? y + 14 : y + 56} textAnchor={l === 'C' ? 'start' : 'middle'} fontSize="11">{s}</text></g>)}</svg>;
    case 'crypto': return <svg viewBox="0 0 528 130" role="img" aria-label="Plaintext, encrypt with key, ciphertext, decrypt with key, plaintext">
      {['Plaintext', 'Encrypt', 'Ciphertext', 'Decrypt', 'Plaintext'].map((t, i) => <g key={i} data-a><rect x={6 + i * 106} y="45" width="92" height="40" rx="10" className={i % 2 ? 'p' : 'b'} /><text x={52 + i * 106} y="70" textAnchor="middle" fontSize="13" style={i % 2 ? on : undefined}>{t}</text>{i < 4 && <text x={105 + i * 106} y="71" textAnchor="middle" fontSize="16">→</text>}</g>)}
      <text x="158" y="32" textAnchor="middle" fontSize="12">+ key</text><text x="370" y="32" textAnchor="middle" fontSize="12">+ key</text><circle className="pk" cx="52" cy="108" r="6" style={{ fill: 'var(--acc)' }} /></svg>;
    case 'ports': return <svg viewBox="0 0 520 140" role="img" aria-label="A browser at one IP and port talks to a web server at another IP on port 443">
      <g data-a><rect x="10" y="35" width="150" height="70" rx="10" className="b" /><text x="85" y="64" textAnchor="middle" fontSize="13" fontWeight="700">Your browser</text><text x="85" y="84" textAnchor="middle" fontSize="11">192.0.2.7 : 51514</text></g>
      <g data-a><rect x="360" y="35" width="150" height="70" rx="10" className="b" /><text x="435" y="64" textAnchor="middle" fontSize="13" fontWeight="700">Web server</text><text x="435" y="84" textAnchor="middle" fontSize="11">198.51.100.20 : 443</text></g>
      <line x1="160" y1="70" x2="360" y2="70" className="a" /><text x="260" y="52" textAnchor="middle" fontSize="11">HTTPS request to port 443</text><text x="260" y="100" textAnchor="middle" fontSize="11">reply to port 51514</text><circle className="pp" cx="170" cy="70" r="6" style={{ fill: 'var(--acc)' }} /></svg>;
    case 'linux-fs': return <svg viewBox="0 0 480 150" role="img" aria-label="The permission string rwxr-x--- split into owner, group and others">
      {[...PERM].map((c, i) => <g key={i} data-a><rect x={20 + i * 42} y="25" width="38" height="38" rx="6" className={i > 0 && c !== '-' ? 'p' : 'b'} /><text x={39 + i * 42} y="50" textAnchor="middle" fontSize="18" style={i > 0 && c !== '-' ? on : undefined}>{c}</text></g>)}
      {['Owner = 7', 'Group = 5', 'Others = 0'].map((t, g) => <text key={t} data-a x={20 + (1 + 3 * g) * 42 + 59} y="90" textAnchor="middle" fontSize="13" fontWeight="700">{t}</text>)}<text x="240" y="125" textAnchor="middle" fontSize="12">first character: - file, d directory</text></svg>;
    case 'oauth': return <svg viewBox="0 0 520 240" role="img" aria-label="Sequence: you, the app and the identity provider exchanging a login code and tokens">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style={{ fill: 'var(--acc)' }} /></marker></defs>
      {['You', 'The app', 'Identity provider'].map((t, i) => <g key={t} data-a><rect x={XS[i] - 55} y="8" width="110" height="26" rx="8" className="b" /><text x={XS[i]} y="26" textAnchor="middle" fontSize="12" fontWeight="700">{t}</text><line x1={XS[i]} y1="34" x2={XS[i]} y2="232" stroke="var(--line)" strokeDasharray="4 4" /></g>)}
      {ST.map(([a, b, t], i) => <g key={t} data-a><line x1={XS[a] + (b > a ? 4 : -4)} y1={70 + i * 36} x2={XS[b] + (b > a ? -6 : 6)} y2={70 + i * 36} className="a" markerEnd="url(#ah)" /><text x={(XS[a] + XS[b]) / 2} y={63 + i * 36} textAnchor="middle" fontSize="11">{t}</text></g>)}</svg>;
    case 'authn': return <svg viewBox="0 0 520 150" role="img" aria-label="You, then authentication, then authorization, then the resource">
      {[['You', 10, 80, 'b'], ['Authentication', 110, 130, 'p'], ['Authorization', 260, 130, 'p'], ['Resource', 410, 100, 'b']].map(([t, x, w, c]) => <g key={String(t)} data-a><rect x={x} y="40" width={w} height="44" rx="10" className={String(c)} /><text x={Number(x) + Number(w) / 2} y="67" textAnchor="middle" fontSize="13" fontWeight="700" style={c === 'p' ? on : undefined}>{t}</text></g>)}
      {[100, 250, 400].map(x => <text key={x} data-a x={x} y="68" textAnchor="middle" fontSize="16">→</text>)}
      <text data-a x="175" y="108" textAnchor="middle" fontSize="12" fontWeight="700">Who are you?</text><text data-a x="175" y="124" textAnchor="middle" fontSize="11">password, passkey, MFA</text><text data-a x="325" y="108" textAnchor="middle" fontSize="12" fontWeight="700">What may you do?</text><text data-a x="325" y="124" textAnchor="middle" fontSize="11">roles and permissions</text></svg>;
    case 'risk': return <svg viewBox="0 0 520 140" role="img" aria-label="Likelihood times impact equals risk">
      {[['Likelihood 1 to 5', 10, 140, 'b'], ['Impact 1 to 5', 190, 140, 'b'], ['Risk score', 370, 140, 'p']].map(([t, x, w, c]) => <g key={String(t)} data-a><rect x={x} y="25" width={w} height="50" rx="10" className={String(c)} /><text x={Number(x) + Number(w) / 2} y="55" textAnchor="middle" fontSize="13" fontWeight="700" style={c === 'p' ? on : undefined}>{t}</text></g>)}
      <text data-a x="165" y="58" textAnchor="middle" fontSize="22">×</text><text data-a x="345" y="58" textAnchor="middle" fontSize="22">=</text><text data-a x="260" y="115" textAnchor="middle" fontSize="12">Then choose: accept, mitigate, transfer or avoid</text></svg>;
    case 'threatmodel': return <svg viewBox="0 0 520 190" role="img" aria-label="Data flow from a user to a web app to a database with a trust boundary">
      <rect data-a x="170" y="25" width="340" height="115" rx="12" fill="none" strokeDasharray="6 5" strokeWidth="2" style={{ stroke: 'var(--red)' }} /><text data-a x="182" y="43" fontSize="11" fontWeight="700">Trust boundary</text>
      {[['User', 10, 90], ['Web app', 200, 110], ['Database', 400, 100]].map(([t, x, w]) => <g key={String(t)} data-a><rect x={x} y="62" width={w} height="44" rx="10" className="b" /><text x={Number(x) + Number(w) / 2} y="89" textAnchor="middle" fontSize="13" fontWeight="700">{t}</text></g>)}
      {[135, 355].map(x => <text key={x} data-a x={x} y="90" textAnchor="middle" fontSize="16">→</text>)}
      {[...'STRIDE'].map((l, i) => <g key={i} data-a><circle cx={140 + i * 40} cy="165" r="14" className="p" /><text x={140 + i * 40} y="170" textAnchor="middle" fontSize="13" fontWeight="700" style={on}>{l}</text></g>)}</svg>;
    case 'dnsmail': return <svg viewBox="0 0 528 190" role="img" aria-label="DNS lookup chain from browser to resolver, root, TLD and authoritative server, plus SPF, DKIM and DMARC">
      {['Browser', 'Resolver', 'Root', '.com TLD', 'Authoritative'].map((t, i) => <g key={t} data-a><rect x={6 + i * 106} y="20" width="92" height="40" rx="10" className={i === 1 ? 'p' : 'b'} /><text x={52 + i * 106} y="45" textAnchor="middle" fontSize="12" fontWeight="700" style={i === 1 ? on : undefined}>{t}</text>{i < 4 && <text x={105 + i * 106} y="46" textAnchor="middle" fontSize="16">→</text>}</g>)}
      <text data-a x="264" y="88" textAnchor="middle" fontSize="12">The answer (an IP address) flows back and is cached</text>
      {[['SPF: who may send', 10], ['DKIM: signed message', 185], ['DMARC: what to do if checks fail', 360]].map(([t, x]) => <g key={String(t)} data-a><rect x={x} y="115" width="158" height="46" rx="10" className="b" /><text x={Number(x) + 79} y="143" textAnchor="middle" fontSize="11" fontWeight="700">{t}</text></g>)}</svg>;
    case 'apisec': return <svg viewBox="0 0 520 170" role="img" aria-label="A client calls an API gateway that runs four checks before reaching the service and data">
      <g data-a><rect x="10" y="62" width="80" height="44" rx="10" className="b" /><text x="50" y="89" textAnchor="middle" fontSize="13" fontWeight="700">Client</text></g>
      <rect data-a x="130" y="12" width="250" height="146" rx="12" className="b" /><text data-a x="255" y="30" textAnchor="middle" fontSize="12" fontWeight="700">API: four checks on every call</text>
      {['1 Who are you?', '2 Allowed on this object?', '3 Is the input valid?', '4 Normal amount of use?'].map((t, i) => <g key={t} data-a><rect x="145" y={40 + i *28} width="220" height="22" rx="6" className="p" /><text x="255" y={55 + i * 28} textAnchor="middle" fontSize="11" style={on}>{t}</text></g>)}
      <g data-a><rect x="410" y="62" width="100" height="44" rx="10" className="b" /><text x="460" y="89" textAnchor="middle" fontSize="13" fontWeight="700">Data</text></g>
      {[110, 395].map(x => <text key={x} data-a x={x} y="90" textAnchor="middle" fontSize="16">→</text>)}</svg>;
    case 'forensics': return <svg viewBox="0 0 360 210" role="img" aria-label="Order of volatility from RAM down to backups">
      {['CPU and RAM', 'Network connections', 'Running processes', 'Disk', 'Logs', 'Backups and archives'].map((t, i) => <g key={t} data-a><rect x="20" y={12 + i * 31} width={320 - i * 28} height="25" rx="7" style={{ fill: `color-mix(in srgb, var(--acc) ${64 - i * 10}%, var(--card))`, stroke: 'var(--line)' }} /><text x="32" y={29 + i * 31} fontSize="12" fontWeight="700">{i + 1}. {t}</text></g>)}</svg>;
    case 'fileless': return <svg viewBox="0 0 520 150" role="img" aria-label="Process tree: explorer starts Word, Word starts PowerShell, which connects out and creates a scheduled task">
      {[['explorer.exe', 10], ['winword.exe', 150], ['powershell.exe', 290]].map(([t, x], i) => <g key={String(t)} data-a><rect x={x} y="55" width="120" height="40" rx="10" className="b" style={i === 2 ? { stroke: 'var(--red)', strokeWidth: 2.5 } : undefined} /><text x={Number(x) + 60} y="80" textAnchor="middle" fontSize="12" fontWeight="700">{t}</text>{i < 2 && <text x={Number(x) + 135} y="80" textAnchor="middle" fontSize="16">→</text>}</g>)}
      <text data-a x="210" y="40" textAnchor="middle" fontSize="11" fontWeight="700">Office starting a shell = red flag</text>
      {[['connects out', 20], ['scheduled task', 90]].map(([t, y]) => <g key={String(t)} data-a><path d={`M410 75L425 ${Number(y) + 17}`} className="a" /><rect x="425" y={y} width="90" height="34" rx="8" className="b" /><text x="470" y={Number(y) + 21} textAnchor="middle" fontSize="11">{t}</text></g>)}</svg>;
    default: return null;
  }
}
export default function Diagram({ id }: { id: string }) {
  const r = useRef<HTMLElement>(null); const s = svg(id);
  useEffect(() => {
    if (!s || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (id === 'intro') gsap.from('[data-r]', { scale: 0, svgOrigin: '180 110', duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)' }); else gsap.from('[data-a]', { opacity: 0, y: 10, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
      if (id === 'crypto') gsap.fromTo('.pk', { x: 0 }, { x: 424, duration: 3.5, repeat: -1, ease: 'none' });
      if (id === 'ports') gsap.fromTo('.pp', { x: 0 }, { x: 170, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, r);
    return () => ctx.revert();
  }, [id, s]);
  return s ? <figure className="dg" ref={r}>{s}<figcaption>{CAP[id]}</figcaption></figure> : null;
}
