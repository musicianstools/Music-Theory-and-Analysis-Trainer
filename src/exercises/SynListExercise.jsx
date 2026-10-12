// SYNONYM LIST — list as many musical or analytical synonyms as you can for a word.
// Words are matched against a bank (inflections allowed); words not in the bank are shown as "not in our list",
// not as wrong — they may still be good choices.
import { useState } from 'react';
import { Button } from '../components/ui.jsx';
import { checkSynonymList, splitList } from '../data/analysis/synonymLists.js';

export default function SynListExercise({ item, onComplete }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const count = splitList(text).length;
  const submit = () => {
    const r = checkSynonymList(text, item.accepted, item.word);
    const score = Math.min(1, r.found.length / item.target);
    setResult(r);
    onComplete?.(score);
  };
  return (
    <div className="exercise synlist">
      <p className="prompt">List as many {item.kind === 'musical' ? 'musical terms and descriptive words' : 'analytical words'} as you can that could replace:</p>
      <p className="synlist-word">“{item.word}”</p>
      {item.example && <p className="small muted">For example: <em>{item.example.replace('___', `[${item.word.split(' (')[0]}]`)}</em></p>}
      <label className="field-label" htmlFor={`${item.id}-list`}>Your list — aim for {item.target} or more (separate with commas or new lines)</label>
      <textarea id={`${item.id}-list`} className="input" rows={4} value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder={item.kind === 'musical' ? 'e.g. an Italian term, then descriptive words…' : 'e.g. conveys, …'} />
      <div className="row gap mt">
        <Button disabled={!count} onClick={submit}>{result ? 'Check again' : 'Check my list'}</Button>
        <span className="small muted">{count} word{count === 1 ? '' : 's'}</span>
      </div>
      {result && (
        <div className="result-block">
          <p className="feedback-title">{result.found.length >= item.target ? `Great range — ${result.found.length} recognised (aim was ${item.target}).` : `${result.found.length} recognised — aim for ${item.target}. Add more, then check again.`}</p>
          {result.found.length > 0 && (
            <div className="chips">{result.found.map((f) => <span key={f.matched} className="chip on" title={f.said !== f.matched ? `matched "${f.matched}"` : undefined}>✓ {f.said}</span>)}</div>
          )}
          {result.unknown.length > 0 && (
            <>
              <p className="small muted mt">Not in our list (they may still work — check the meaning fits, or ask your teacher):</p>
              <div className="chips">{result.unknown.map((w) => <span key={w} className="chip muted-chip">{w}</span>)}</div>
            </>
          )}
          <details className="mt">
            <summary>Show more words you could use ({result.missed.length})</summary>
            <div className="chips">{result.missed.map((w) => <span key={w} className="chip">{w}</span>)}</div>
          </details>
          {item.note && <p className="small mt"><strong>Choose carefully:</strong> {item.note}</p>}
        </div>
      )}
    </div>
  );
}
