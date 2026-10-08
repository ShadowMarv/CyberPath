import { useState } from 'react';
import Drill from './Drill';
import { VSI, CRI } from './drills';
export default function Drills2() {
  const [k, setK] = useState(0);
  return (<><div className="row">{['Voice scam call', 'Spot the vulnerability'].map((t, i) => <button key={t} aria-pressed={k === i} onClick={() => setK(i)}>{t}</button>)}</div>
    {k === 0 ? <Drill key="v" title="Voice scam call" lead="A caller is working on you. Choose the safest reply each round." store="vs" items={VSI} /> : <Drill key="c" title="Spot the vulnerability" lead="Read the code and name the weakness. These are tiny teaching snippets." store="cr" items={CRI} />}</>);
}
