import { useEffect, useRef, useState } from 'react';
import { useLS } from './hooks';
const FL = ['FLAG{hidden_files_exist}', 'FLAG{decode_me}', 'FLAG{scan_then_probe}'];
const FS: Record<string, string> = { '/etc/os-release': 'PRETTY_NAME="CyberPath Lab Linux"\nID=cyberpath', 'readme.txt': 'Welcome, guest. Find 3 flags. Type help. Start with ls -a', '.secret': FL[0], 'notes.txt': 'backup key (base64): ' + btoa(FL[1]), 'access.log': 'Failed password for root from 203.0.113.45\nAccepted password for guest from 127.0.0.1\nFailed password for admin from 203.0.113.45' };
function run(cmd: string): string {
  const [c, ...a] = cmd.trim().split(/\s+/);
  switch (c) {
    case '': return '';
    case 'help': return 'Commands: help, ls [-a] [-l], cat <file>, uname -a, sudo -l, cyberpath status, about, network, crypto, threats, protocols, grep <word> <file>, base64 -d <text>, nmap localhost, curl localhost:<port>, whoami, id, pwd, clear';
    case 'ls': { const ns = Object.keys(FS).filter(f => !f.startsWith('/') && (a.includes('-a') || !f.startsWith('.'))); return a.includes('-l') ? ns.map(f => `${f === '.secret' ? '-rw-------' : '-rw-r--r--'} 1 guest guest ${String(FS[f].length).padStart(4)} ${f}`).join('\n') : ns.join('  '); }
    case 'cat': return a[0] === '/etc/shadow' ? 'cat: /etc/shadow: Permission denied' : FS[a[0]] ?? `cat: ${a[0] ?? ''}: No such file`;
    case 'grep': return (FS[a[1]] ?? '').split('\n').filter(l => l.includes(a[0] ?? '')).join('\n') || '(no match)';
    case 'base64': try { return atob(a[1] ?? ''); } catch { return 'base64: invalid input'; }
    case 'nmap': return a[0] === 'localhost' ? 'PORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http-alt' : 'Scan only localhost in this lab.';
    case 'curl': return a[0] === 'localhost:8080' ? FL[2] : a[0] === 'localhost:80' ? '<h1>It works</h1>' : 'curl: could not connect';
    case 'cyberpath': return a[0] === 'status' ? 'CyberPath lab status (simulated)\nSYSTEM ........ ONLINE\nNETWORK ....... SEGMENTED\nTHREATS ....... 03\nALERTS ........ 01\nENCRYPTION .... TLS 1.3 (example)' : 'usage: cyberpath status';
    case 'about': return 'CyberPath: a free cybersecurity learning platform. Everything here is educational and runs in your browser.';
    case 'network': return 'Zones: internet > firewall > DMZ (web) > internal (database, SIEM). See the Network map page.';
    case 'crypto': return 'Symmetric: AES. Asymmetric: RSA, ECC. Hash: SHA-256. Passwords: Argon2id or bcrypt with a salt.';
    case 'threats': return 'Common threats: phishing, ransomware, credential stuffing, DDoS, supply chain attacks, insider misuse.';
    case 'protocols': return 'HTTP 80, HTTPS 443, SSH 22, DNS 53, SMTP 25, RDP 3389 (never expose it).';
    case 'uname': return 'Linux cyberpath-lab 6.1.0 x86_64 GNU/Linux'; case 'sudo': return 'Sorry, user guest may not run sudo on cyberpath-lab.'; case 'whoami': return 'guest'; case 'id': return 'uid=1000(guest) gid=1000(guest)'; case 'pwd': return '/home/guest';
    default: return `${c}: command not found. Try help`;
  }
}
export default function Terminal() {
  const [lines, setLines] = useState<string[]>(['CyberPath shell. Goal: capture 3 flags. Type help.']); const [v, setV] = useState('');
  const [found, setFound] = useLS<string[]>('tf', []); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);
  const go = () => {
    if (v.trim() === 'clear') { setLines([]); setV(''); return; }
    const out = run(v); const nf = FL.filter(f => out.includes(f) && !found.includes(f));
    if (nf.length) setFound([...found, ...nf]);
    setLines([...lines, 'guest@lab:~$ ' + v, ...(out ? [out] : []), ...nf.map(f => `*** Flag captured: ${f} ***`)]); setV('');
  };
  return (<><h2>Terminal game</h2><p className="lead">A safe fake Linux box. Use real commands to find three flags. Hint: hidden files, encoded notes, then scan and probe.</p>
    <div className="mono">Flags {found.length} / 3</div><div className="bar"><i style={{ width: found.length / 3 * 100 + '%' }} /></div>
    <div className="term" onClick={() => document.getElementById('ti')?.focus()}>{lines.map((l, n) => <div key={n}>{l}</div>)}
      <div className="trow">guest@lab:~$ <input id="ti" value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') go(); }} aria-label="Terminal input" autoComplete="off" spellCheck={false} /></div><div ref={end} /></div>
    <button className="btn" style={{ marginTop: 12 }} onClick={() => setFound([])}>Reset flags</button></>);
}
