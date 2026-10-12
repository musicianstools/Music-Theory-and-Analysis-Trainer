// ARGUMENT BUILDER / BUILD THE ARGUMENT: a step-by-step chain.
// Students can work through all steps, or focus on a single component.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback, SelfAssessment } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import { Chips, HighlightedParagraph, HighlightLegend, ensureSentence } from './shared.jsx';
import SongPicker from '../components/SongPicker.jsx';
import VerbText from '../components/VerbText.jsx';

// A step the student WRITES (it has coach expectations): its suggestions are full
// model answers, so they are only shown after the step is done — never as chips.
const isWritten = (s) => !s.fixed && (Boolean(s.expect) || s.long);
// Sentence starter from the placeholder: "This creates…" → "This creates"
const starterFor = (s) => {
  const p = (s.placeholder || '').split(/[/…]|\.\.\./)[0].trim();
  return p && !/^(e\.g\.|be specific)/i.test(p) && p.length > 2 ? p : '';
};

export default function BuilderExercise({ item, onComplete }) {
  const [mode, setMode] = useState('all'); // 'all' or a step key
  const steps = mode === 'all' ? item.steps : item.steps.filter((s) => s.key === mode);
  const [values, setValues] = useState(() => Object.fromEntries(item.steps.map((s) => [s.key, s.fixed || ''])));
  const [index, setIndex] = useState(0);
  const [stepCoach, setStepCoach] = useState(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [final, setFinal] = useState(null);

  const [song, setSong] = useState(null);
  const current = steps[index];
  const isChain = item.kind === 'chain';
  const val = current ? values[current.key] : '';

  const reset = (m) => { setMode(m); setIndex(0); setStepCoach(null); setFinal(null); setHintOpen(false); };

  const next = () => {
    if (current.expect && !stepCoach) {
      const a = analyseWriting(val, { theme: item.theme, expect: current.expect });
      if (a.missing.length || a.flags.length) { setStepCoach(a); return; } // one chance to revise
    }
    setStepCoach(null);
    setHintOpen(false);
    if (index < steps.length - 1) {
      setIndex(index + 1);
      return;
    }
    // Finished
    const text = mode !== 'all'
      ? val
      : item.finalKey ? values[item.finalKey] : item.steps.map((s) => ensureSentence(values[s.key])).join(' ');
    const expect = mode === 'all' ? item.expect : current.expect || ['effect'];
    const a = analyseWriting(text, { theme: item.theme, expect });
    setFinal({ text, analysis: a });
    onComplete?.(a.score);
  };

  return (
    <div className="exercise">
      <ContextBlock item={item} />
      <p className="prompt"><VerbText text={item.prompt} /></p>
      {!item.song && item.theme && !final && <SongPicker theme={item.theme} value={song} onChange={(k) => setSong(k)} label="Build your argument around a song" />}

      {!isChain && (
        <div className="level-picker" role="tablist" aria-label="Practice focus">
          <button type="button" role="tab" aria-selected={mode === 'all'} className={`level ${mode === 'all' ? 'on' : ''}`} onClick={() => reset('all')}>Whole argument</button>
          {item.steps.map((s) => (
            <button type="button" role="tab" key={s.key} aria-selected={mode === s.key} className={`level ${mode === s.key ? 'on' : ''}`} onClick={() => reset(s.key)}>{s.label} only</button>
          ))}
        </div>
      )}

      <ol className="chain">
        {steps.map((s, i) => (
          <li key={s.key} className={`chain-step ${i < index || final ? 'done' : ''} ${i === index && !final ? 'current' : ''}`}>
            <span className="chain-label">{s.label}</span>
            {(i < index || final) && <span className="chain-value">{values[s.key]}</span>}
            {(i < index || final) && isWritten(s) && s.suggestions?.[0] && (
              <details className="chain-compare">
                <summary>Compare with an example</summary>
                <p className="model">{s.suggestions[0]}</p>
              </details>
            )}
            {i === index && !final && (
              <div className="chain-work">
                <p className="chain-q"><VerbText text={s.prompt} /></p>
                {s.fixed ? (
                  <p className="chain-value">{s.fixed}</p>
                ) : (
                  <>
                    {s.long || ['claim', 'evidence', 'effect', 'meaning', 'connection', 'judgement', 'argument', 'interconnection'].includes(s.key) ? (
                      <textarea className="input" rows={s.long ? 4 : 2} value={val} placeholder={s.placeholder} aria-label={s.label}
                        onChange={(e) => { setValues({ ...values, [s.key]: e.target.value }); setStepCoach(null); }} />
                    ) : (
                      <input className="input" value={val} placeholder={s.placeholder} aria-label={s.label}
                        onChange={(e) => { setValues({ ...values, [s.key]: e.target.value }); setStepCoach(null); }} />
                    )}
                    {isWritten(s) ? (
                      <div className="hint-row">
                        {!hintOpen ? (
                          <button type="button" className="btn btn-ghost btn-small" onClick={() => setHintOpen(true)}>Need a hint?</button>
                        ) : (
                          <div className="hint-box">
                            {s.hint && <p className="small">Hint: {s.hint}</p>}
                            {starterFor(s) && !val.trim() && (
                              <button type="button" className="btn btn-ghost btn-small" onClick={() => setValues({ ...values, [s.key]: starterFor(s) })}>Start me off: “{starterFor(s)}…”</button>
                            )}
                            <p className="small muted">You can compare with an example after you write this step.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {s.hint && <p className="small muted">Tip: {s.hint}</p>}
                        <Chips suggestions={s.suggestions} selected={val} onPick={(t) => { setValues({ ...values, [s.key]: t }); setStepCoach(null); }} />
                      </>
                    )}
                  </>
                )}
                {stepCoach && (
                  <>
                    <CoachFeedback analysis={stepCoach} compact />
                    <p className="small muted">Revise and continue — or continue as it is.</p>
                  </>
                )}
                <div className="row gap mt">
                  {index > 0 && <Button variant="ghost" onClick={() => { setIndex(index - 1); setStepCoach(null); setHintOpen(false); }}>← Back</Button>}
                  <Button disabled={!s.fixed && !val.trim()} onClick={next}>
                    {index === steps.length - 1 ? (stepCoach ? 'Finish anyway' : 'Finish') : stepCoach ? 'Continue anyway →' : 'Next →'}
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      {final && (
        <div className="result-block">
          <h3>{mode === 'all' ? 'Your complete argument' : 'Your component'}</h3>
          {mode === 'all' && !item.finalKey ? (
            <>
              <HighlightLegend />
              <HighlightedParagraph parts={item.steps.map((s) => ({ key: s.key, text: ensureSentence(values[s.key]) }))} />
            </>
          ) : (
            <p className="hl-paragraph">{final.text}</p>
          )}
          <CoachFeedback analysis={final.analysis} />
          {(() => {
            const fullModel = item.model || item.steps.map((s) => s.fixed ? '' : ensureSentence(s.suggestions?.[0])).filter(Boolean).join(' ');
            const model = mode === 'all' ? fullModel : item.steps.find((s) => s.key === mode)?.suggestions?.[0];
            return model ? (
              <div className="feedback good">
                <p className="feedback-title">{mode === 'all' ? 'A model to compare with' : 'Compare with a strong example'}</p>
                <p className="model">{model}</p>
              </div>
            ) : null;
          })()}
          {item.explanation && <p className="small">{item.explanation}</p>}
          {mode === 'all' && <SelfAssessment analysis={final.analysis} />}
        </div>
      )}
    </div>
  );
}
