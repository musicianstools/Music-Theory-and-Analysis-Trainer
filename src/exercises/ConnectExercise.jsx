// INTERCONNECTIVITY: five levels, scaffolding removed step by step.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import { RELATIONSHIPS } from '../data/connect/interconnectivity.js';
import { MCQBody, Explanation } from './Objective.jsx';
import { grade } from '../utils/grade.js';
import VerbText from '../components/VerbText.jsx';

const LEVELS = [
  { n: 1, label: 'Choose', desc: 'Choose the best connection.' },
  { n: 2, label: 'Complete', desc: 'Complete the sentence frame.' },
  { n: 3, label: 'Write', desc: 'Write the connection.' },
  { n: 4, label: 'Full sentence', desc: 'Write a full analytical sentence.' },
  { n: 5, label: 'Three elements', desc: 'Connect three elements independently.' },
];

const EXPECT = {
  2: ['effect', 'connection', 'meaning'],
  3: ['effect', 'connection'],
  4: ['terminology', 'effect', 'meaning', 'theme', 'connection'],
  5: ['terminology', 'effect', 'meaning', 'theme', 'connection'],
};

export default function ConnectExercise({ item, onComplete }) {
  const maxLevel = item.elements.length >= 3 ? 5 : 4;
  const [level, setLevel] = useState(Math.min(item.defaultLevel || 1, maxLevel));
  const [choice, setChoice] = useState(null);
  const [blanks, setBlanks] = useState(['', '', '']);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const els = item.elements.slice(0, level === 5 ? 3 : 2);
  const [e1, e2] = item.elements;
  const frameText = `The ${e1.name.toLowerCase()} creates ${blanks[0] || '______'}, while the ${e2.name.toLowerCase()} ${blanks[1] || '______'}. Together, these elements ${blanks[2] || '______'}.`;

  const changeLevel = (n) => { setLevel(n); setResult(null); setChoice(null); setText(''); setBlanks(['', '', '']); };

  const submit = () => {
    let r;
    if (level === 1) {
      const g = grade(item, choice);
      r = { score: g.score, objective: g };
    } else {
      const written = level === 2 ? frameText : text;
      const a = analyseWriting(written, { theme: item.theme, expect: EXPECT[level] });
      r = { score: a.score, analysis: a };
    }
    setResult(r);
    onComplete?.(r.score);
  };

  const canSubmit = level === 1 ? !!choice : level === 2 ? blanks.every((b) => b.trim()) : text.trim().length > 0;

  return (
    <div className="exercise">
      <div className="level-picker" role="tablist" aria-label="Scaffolding level">
        {LEVELS.map((l) => (
          <button key={l.n} role="tab" type="button" aria-selected={level === l.n} disabled={l.n > maxLevel} className={`level ${level === l.n ? 'on' : ''}`} onClick={() => changeLevel(l.n)} title={l.n > maxLevel ? 'Needs a third element' : l.desc}>
            <span className="level-n">L{l.n}</span> {l.label}
          </button>
        ))}
      </div>
      <p className="small muted">{LEVELS[level - 1].desc} Higher levels remove scaffolding.</p>

      <ContextBlock item={{ theme: item.theme, song: item.song }} />
      <div className={`element-cards n${els.length}`}>
        {els.map((e, i) => (
          <div className="element-card" key={e.name}>
            <span className="element-num">Element {i + 1}</span>
            <strong>{e.name}</strong>
            <p>{e.observation}</p>
          </div>
        ))}
      </div>
      <p className="prompt"><VerbText text={`Analyse how these elements work together${item.theme ? ` to communicate ${item.theme}` : ''}.`} /></p>

      {level === 1 && (
        <MCQBody item={{ ...item, prompt: 'Choose the best connection.', context: null, theme: null, song: null }} response={choice} onChange={setChoice} revealed={!!result} />
      )}

      {level === 2 && (
        <div>
          <div className="frame-preview"><span className="frame-label">Your sentence</span><p>{frameText}</p></div>
          {!result && ['What does element 1 create?', 'What does element 2 do?', 'What do they achieve together?'].map((q, i) => (
            <div className="blank-field" key={i}>
              <label className="field-label" htmlFor={`${item.id}-c${i}`}>{i + 1}. {q}</label>
              <input id={`${item.id}-c${i}`} className="input" value={blanks[i]} onChange={(e) => setBlanks(blanks.map((b, j) => (j === i ? e.target.value : b)))} placeholder={i === 2 ? `present ${item.theme} as…` : ''} />
            </div>
          ))}
        </div>
      )}

      {level >= 3 && (
        <div>
          {level === 3 && <p className="small muted">Tip: use a connective — while, whereas, together, reinforced by, in contrast to.</p>}
          <textarea className="input" rows={level === 5 ? 5 : 3} value={text} disabled={!!result} onChange={(e) => setText(e.target.value)} aria-label="Your connection"
            placeholder={level === 3 ? 'The … creates …, while the … …' : level === 4 ? `Write one analytical sentence connecting both elements to ${item.theme}.` : 'Connect all three elements to the theme.'} />
        </div>
      )}

      {!result && <Button className="mt" disabled={!canSubmit} onClick={submit}>Check connection</Button>}

      {result && (
        <>
          {result.objective && <Explanation item={item} result={result.objective} />}
          {result.analysis && <CoachFeedback analysis={result.analysis} />}
          <div className="feedback good">
            <p className="feedback-title">Relationship: {item.relationship}</p>
            <p>{RELATIONSHIPS[item.relationship]}</p>
            {!result.objective && <p>{item.explanation}</p>}
            <p className="model">{level === 2 ? `The ${e1.name.toLowerCase()} creates ${item.frameModel[0]}, while the ${e2.name.toLowerCase()} ${item.frameModel[1]}. Together, these elements ${item.frameModel[2]}.` : level === 5 ? item.modelThree : item.model}</p>
          </div>
          {level < maxLevel && <Button variant="secondary" onClick={() => changeLevel(level + 1)}>Try level {level + 1} with these elements →</Button>}
        </>
      )}
    </div>
  );
}
