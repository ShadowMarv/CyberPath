import { useState } from 'react';
import { useLS } from './hooks';
import Diagram from './Diagram';
import { LESSONS as L } from './content/lessons';
const S = [['what', 'What is it?'], ['why', 'Why does it matter?'], ['how', 'How does it work?'], ['where', 'Where is it used?'], ['wrong', 'What can go wrong?'], ['defend', 'How do defenders protect against it?'], ['practice', 'Practice it safely']] as const;
export default function LessonPage({ id }: { id: string }) {
  const [done, setDone] = useLS<string[]>('ls', []); const [a, setA] = useState<Record<number, number>>({});
  const i = L.findIndex(x => x.id === id); const l = L[i];
  if (!l) return (<><h2>Lesson not found</h2><a className="btn" href="#road">Back to the roadmap</a></>);
  const answered = l.quiz.every((_, n) => a[n] !== undefined); const ok = done.includes(l.id); const ns = { textDecoration: 'none' };
  return (<div className="les"><a href="#road">Back to the roadmap</a><h2>{l.title}</h2>
    <div className="lt"><span className="tag">{l.level}</span><span className="tag">{l.time}</span><span className="tag">Prerequisite: {l.pre}</span></div>
    <div className="card" style={{ marginTop: 16 }}><h3>You will learn to</h3><ul>{l.obj.map(o => <li key={o}>{o}</li>)}</ul></div>
    <Diagram id={l.id} />
    {S.map(([k, label], n) => <section key={k}><h3>{n + 1}. {label}</h3>{l[k].split('\n').map((p, j) => <p key={j}>{p}</p>)}</section>)}
    <h3>Key terms</h3><dl>{l.terms.map(t => <div key={t[0]}><dt>{t[0]}</dt><dd>{t[1]}</dd></div>)}</dl>
    <h3>Check yourself</h3>
    {l.quiz.map((q, n) => <div className="card" key={q[0]} style={{ marginBottom: 12 }}><p><b>{q[0]}</b></p>
      <div className="opts">{q[1].map((o, m) => <button key={o} disabled={a[n] !== undefined} onClick={() => setA({ ...a, [n]: m })} style={a[n] !== undefined && m === q[2] ? { borderColor: 'var(--grn)', borderWidth: 2 } : a[n] === m ? { borderColor: 'var(--red)', borderWidth: 2 } : undefined}>{o}</button>)}</div>
      {a[n] !== undefined && <p className="msg">{a[n] === q[2] ? 'Correct. ' : 'Not quite. '}{q[3]}</p>}</div>)}
    <p><b>Sources:</b> {l.src.map(s => <a key={s[1]} href={s[1]} target="_blank" rel="noopener noreferrer">{s[0]}</a>)}</p>
    <button className="btn p" disabled={!answered || ok} onClick={() => setDone([...done, l.id])}>{ok ? 'Lesson completed (+25 XP)' : answered ? 'Mark lesson complete' : 'Answer the quiz to finish'}</button>
    <div className="pager">{i > 0 ? <a className="btn" style={ns} href={'#lesson/' + L[i - 1].id}>Back: {L[i - 1].title}</a> : <span />}{i < L.length - 1 && <a className="btn p" style={ns} href={'#lesson/' + L[i + 1].id}>Next lesson: {L[i + 1].title}</a>}</div></div>);
}
