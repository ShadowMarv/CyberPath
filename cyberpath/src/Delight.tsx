import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLS } from './hooks';
import { LESSONS } from './content/lessons';
import Icon from './Icon';
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const TIPS = ['Turn on MFA for your email first: it is the key to every other account.', 'Use a password manager and let it generate a unique password for every site.', 'Install updates promptly. Most attacks use bugs that already have a fix.', 'Hover over links before clicking, and read the real domain from right to left.', 'Back up important files with the 3-2-1 rule, and test restoring one.', 'Never reuse a password. One breach should not open all your accounts.', 'On public Wi-Fi, prefer HTTPS sites and use a VPN for anything sensitive.', 'Urgency or secrecy in a request is a red flag. Pause and verify another way.', 'Lock your screen when you step away. Physical access beats most defenses.', 'Practice only on systems you own or have written permission to test.', 'Read logs for ten minutes a day on your lab machine. Normal becomes obvious.', 'Write down what you learn. A public notes repository is a portfolio.', 'Check app permissions on your phone: does a flashlight need your contacts?', 'Use passkeys where available: there is nothing to phish.'];
export function Daily() {
  const [done] = useLS<string[]>('ls', []); const next = LESSONS.find(l => !done.includes(l.id)); const t = TIPS[Math.floor(Date.now() / 864e5) % TIPS.length];
  return (<div className="grid" style={{ margin: '24px 0 8px' }}><div className="card"><span className="tag">Tip of the day</span><p>{t}</p></div>
    <div className="card"><span className="tag">Next up</span>{next ? <><h3>{next.title}</h3><p>{next.level} · {next.time}</p><a href={'#lesson/' + next.id}>Start this lesson</a></> : <p>All lessons complete. Try the Concept atlas next.</p>}</div></div>);
}
const J: string[][] = [['Foundations', 'lesson/intro', 'shield'], ['Networking', 'lesson/ports', 'net'], ['Systems', 'lesson/linux-fs', 'terminal'], ['Specialize', 'road', 'bug'], ['Career', 'certs', 'award']];
export function Journey() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => { if (calm()) return; const ctx = gsap.context(() => { gsap.from('.jl', { scaleX: 0, duration: 1.4, ease: 'power2.out', delay: 0.3 }); gsap.from('.jn span', { scale: 0, duration: 0.6, stagger: 0.25, delay: 0.3, ease: 'back.out(2)' }); }, r); return () => ctx.revert(); }, []);
  return (<><h2 style={{ marginTop: 44, fontSize: 26 }}>Your journey</h2><p className="lead">Five milestones from zero to a cybersecurity career. Click one to jump in.</p>
    <div className="jr" ref={r}><div className="jl" />{J.map(j => <a key={j[0]} className="jn" href={'#' + j[1]}><span><Icon n={j[2]} size={24} /></span><b>{j[0]}</b></a>)}</div></>);
}
const MY: string[][] = [['"Macs and Linux machines cannot get viruses."', 'Every operating system can be attacked. Attackers just target the most common ones first, and phishing works on any device.'], ['"A strong password is enough."', 'Passwords leak in breaches and get phished. Add MFA, and prefer passkeys.'], ['"Hackers only go after big companies."', 'Automated tools scan the whole internet. Small businesses and individuals are easy, common targets.'], ['"Incognito mode makes me anonymous."', 'It only skips saving local history. Websites, your network and your internet provider can still see your activity.'], ['"The padlock means the site is safe."', 'HTTPS encrypts traffic to the site, but criminals use HTTPS on phishing sites too. Check the domain.'], ['"Antivirus is all I need."', 'It is one layer. Updates, backups, MFA and careful habits matter just as much (defense in depth).']];
function Flip({ m }: { m: string[] }) {
  const r = useRef<HTMLButtonElement>(null); const [o, setO] = useState(false);
  const go = () => { if (calm() || !r.current) { setO(!o); return; } gsap.to(r.current, { rotationY: 90, transformPerspective: 600, duration: 0.15, onComplete: () => { setO(x => !x); gsap.to(r.current, { rotationY: 0, duration: 0.2 }); } }); };
  return <button ref={r} className="flip" onClick={go} aria-pressed={o}><span className="tag">{o ? 'Fact' : 'Myth'}</span><p>{o ? m[1] : m[0]}</p><small>Click to {o ? 'see the myth' : 'reveal the truth'}</small></button>;
}
export const Myths = () => (<><h2 style={{ marginTop: 44, fontSize: 26 }}>Myth or fact?</h2><div className="grid" style={{ marginTop: 12 }}>{MY.map(m => <Flip key={m[0]} m={m} />)}</div></>);
