import { useEffect, useRef, useState } from 'react';
import { useLS } from './hooks';
const FL = ['FLAG{hidden_files_exist}', 'FLAG{decode_me}', 'FLAG{scan_then_probe}'];
const FS: Record<string, string> = { 'readme.txt': 'Welcome, guest. Find 3 flags. Type help. Start with ls -a', '.secret': FL[0], 'notes.txt': 'backup key (base64): ' + btoa(FL[1]), 'access.log': 'Failed password for root from 203.0.113.45\nAccepted password for guest from 127.0.0.1\nFailed password for admin from 203.0.113.45' };
function run(cmd: string): string {
  const [c, ...a] = cmd.trim().split(/\s+/);
  switch (c) {
    case '': return '';
    case 'help': return 'Commands: help, ls [-a], cat <file>, grep <word> <file>, base64 -d <text>, nmap localhost, curl localhost:<port>, whoami, id, pwd, clear';
    case 'ls': return Object.keys(FS).filter(f => a.includes('-a') || !f.startsWith('.')).join('  ');
    case 'cat': return FS[a[0]] ?? `cat: ${a[0] ?? ''}: No such file`;
    case 'grep': return (FS[a[1]] ?? '').split('\n').filter(l => l.includes(a[0] ?? '')).join('\n') || '(no match)';
    case 'base64': try { return atob(a[1] ?? ''); } catch { return 'base64: invalid input'; }
    case 'nmap': return a[0] === 'localhost' ? 'PORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http-alt' : 'Scan only localhost in this lab.';
    case 'curl': return a[0] === 'localhost:8080' ? FL[2] : a[0] === 'localhost:80' ? '<h1>It works</h1>' : 'curl: could not connect';
    case 'whoami': return 'guest'; case 'id': return 'uid=1000(guest) gid=1000(guest)'; case 'pwd': return '/home/guest';
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
