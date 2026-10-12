// PARAGRAPH BUILDER: full frames → prompts only → independent. Output is colour-coded by component.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback, SelfAssessment } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import { Chips, fillFrame, blankCount, HighlightedParagraph, HighlightLegend, ensureSentence } from './shared.jsx';
import VerbText from '../components/VerbText.jsx';

export const SCAFFOLDS = [
  { key: 'full', label: 'Full scaffold', desc: 'Sentence frames with blanks' },
  { key: 'prompts', label: 'Prompts only', desc: 'A guiding question for each component' },
  { key: 'free', label: 'Independent', desc: 'One box — exam conditions' },
];

const EXPECT = ['terminology', 'evidence', 'effect', 'meaning', 'theme', 'connection', 'judgement'];

export default function ParagraphExercise({ item, onComplete }) {
  const [scaffold, setScaffold] = useState(item.defaultScaffold || 'full');
  const [blanks, setBlanks] = useState(() => Object.fromEntries(item.fields.map((f) => [f.key, Array(blankCount(f.frame)).fill('')])));
  const [texts, setTexts] = useState(() => Object.fromEntries(item.fields.map((f) => [f.key, ''])));
  const [free, setFree] = useState('');
  const [result, setResult] = useState(null);

  const parts = item.fields.map((f) => ({
    key: f.key,
    text: scaffold === 'full' ? fillFrame(f.frame, blanks[f.key], '') : ensureSentence(texts[f.key]),
  }));
  const ready = scaffold === 'full'
    ? item.fields.every((f) => blanks[f.key].every((b) => b.trim()))
    : scaffold === 'prompts' ? item.fields.every((f) => texts[f.key].trim()) : free.trim().split(/\s+/).length >= 15;

  const build = () => {
    const text = scaffold === 'free' ? free : parts.map((p) => p.text).join(' ');
    const a = analyseWriting(text, { theme: item.theme, expect: EXPECT });
    setResult({ text, analysis: a });
    onComplete?.(a.score);
  };

  const setBlank = (key, i, v) => setBlanks({ ...blanks, [key]: blanks[key].map((x, j) => (j === i ? v : x)) });

  return (
    <div className="exercise">
      <div className="level-picker" role="tablist" aria-label="Scaffolding">
        {SCAFFOLDS.map((s) => (
          <button key={s.key} role="tab" type="button" aria-selected={scaffold === s.key} className={`level ${scaffold === s.key ? 'on' : ''}`} onClick={() => { setScaffold(s.key); setResult(null); }} title={s.desc}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="question-box"><span className="field-label">Question</span><VerbText text={item.question} /></p>
      <ContextBlock item={{ song: item.song, theme: item.theme, stimulus: item.stimulus }} />

      {!result && scaffold === 'full' && item.fields.map((f) => {
        const segments = f.frame.split(/\{\d+\}/);
        return (
          <fieldset key={f.key} className={`para-field hlb-${f.key}`}>
            <legend>{f.label}</legend>
            <p className="frame-inline">
              {segments.map((seg, i) => (
                <span key={i}>
                  {seg}
                  {i < segments.length - 1 && (
                    <input className="input inline" value={blanks[f.key][i]} aria-label={`${f.label} blank ${i + 1}`} onChange={(e) => setBlank(f.key, i, e.target.value)} />
                  )}
                </span>
              ))}
            </p>
            {f.suggestions && f.suggestions.map((list, i) => (
              <Chips key={i} suggestions={list} selected={blanks[f.key][i]} onPick={(t) => setBlank(f.key, i, t)} />
            ))}
          </fieldset>
        );
      })}

      {!result && scaffold === 'prompts' && item.fields.map((f) => (
        <fieldset key={f.key} className={`para-field hlb-${f.key}`}>
          <legend>{f.label}</legend>
          <label className="small muted" htmlFor={`${item.id}-${f.key}`}>{f.question}</label>
          <textarea id={`${item.id}-${f.key}`} className="input" rows={2} value={texts[f.key]} onChange={(e) => setTexts({ ...texts, [f.key]: e.target.value })} />
        </fieldset>
      ))}

      {!result && scaffold === 'free' && (
        <div>
          <p className="small muted">Write a complete paragraph: argument, evidence, effect, meaning, interconnectivity and evaluation.</p>
          <textarea className="input" rows={9} value={free} onChange={(e) => setFree(e.target.value)} aria-label="Your paragraph" />
          <p className="small muted">{free.trim() ? free.trim().split(/\s+/).length : 0} words</p>
        </div>
      )}

      {!result && <Button className="mt" disabled={!ready} onClick={build}>Build my paragraph</Button>}

      {result && (
        <div className="result-block">
          <h3>Your paragraph</h3>
          {scaffold === 'free' ? <p className="hl-paragraph">{result.text}</p> : (
            <>
              <HighlightLegend />
              <HighlightedParagraph parts={parts} />
            </>
          )}
          <CoachFeedback analysis={result.analysis} />
          <details className="model-details">
            <summary>Compare with a model paragraph</summary>
            <p className="model">{item.model}</p>
          </details>
          <SelfAssessment analysis={result.analysis} />
          <div className="row gap wrap mt">
            <Button variant="secondary" onClick={() => setResult(null)}>Revise my paragraph</Button>
            {scaffold !== 'free' && <Button variant="ghost" onClick={() => { setScaffold(scaffold === 'full' ? 'prompts' : 'free'); setResult(null); }}>Try with less scaffolding →</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
