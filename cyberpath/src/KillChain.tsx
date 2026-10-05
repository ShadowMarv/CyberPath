import { useEffect, useState } from 'react';
const K: string[][] = [
  ['Reconnaissance', 'Gathers emails, domains, open ports and employee names.', 'Limits public info, monitors scans, runs honeypots.', 'OSINT, Nmap, Shodan'],
  ['Weaponization', 'Pairs an exploit with a payload such as a malicious document.', 'Uses threat intel, sandbox detonation and patching of known exploits.', 'Exploit frameworks, macro kits'],
  ['Delivery', 'Sends it by phishing email, USB drop or a hacked website.', 'Email filtering, web proxy and security awareness training.', 'Phishing kits'],
  ['Exploitation', 'Triggers a vulnerability to run code on the victim.', 'Patching, EDR, memory protections and a WAF.', 'Public CVE exploits'],
  ['Installation', 'Plants a backdoor or persistence mechanism.', 'Application allowlisting, EDR alerts and file integrity monitoring.', 'RATs, scheduled tasks'],
  ['Command and control', "Opens a remote channel to the attacker's server.", 'Egress filtering, DNS monitoring and blocking known C2.', 'C2 frameworks'],
  ['Actions on objectives', 'Steals data, encrypts files or moves laterally.', 'Segmentation, DLP, backups and incident response.', 'Exfiltration tools, ransomware']];
export default function KillChain() {
  const [i, setI] = useState(0); const [red, setRed] = useState(true); const [play, setPlay] = useState(false);
  useEffect(() => { if (!play) return; const t = setInterval(() => setI(x => (x + 1) % K.length), 2200); return () => clearInterval(t); }, [play]);
  const c = red ? 'var(--red)' : 'var(--blue)';
  return (<><h2>Attack vs defense: the kill chain</h2><p className="lead">Every breach follows steps. Red teams walk the chain; blue teams try to break it as early as possible. Switch sides and step through.</p>
    <div className="row"><button aria-pressed={red} onClick={() => setRed(true)}>Red team view</button><button aria-pressed={!red} onClick={() => setRed(false)}>Blue team view</button><button onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Auto-play'}</button></div>
    <div className="kc" role="tablist">{K.map((k, n) => <button key={k[0]} role="tab" aria-selected={n === i} style={n <= i ? { background: c, borderColor: c, color: 'var(--onacc)' } : undefined} onClick={() => setI(n)}><b>Step {n + 1}</b>{k[0]}</button>)}</div>
    <div className="card" style={{ borderTop: '5px solid ' + c, marginTop: 16 }}><h3>{K[i][0]}</h3><p><b>{red ? 'Attacker does' : 'Defender does'}:</b> {K[i][red ? 1 : 2]}</p><p><b>Typical tools:</b> {K[i][3]}</p>
      <p className="msg">{red ? 'Each completed step brings the attacker closer to the objective.' : i < 3 ? 'Stopping them here is cheapest: they have not touched your systems yet.' : 'Late stage: detection and response now limit the damage.'}</p></div></>);
}
