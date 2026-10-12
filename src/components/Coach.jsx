import { useState } from 'react';
import { analyseWriting, COMPONENTS } from '../utils/coach.js';

/** Supportive feedback on a piece of writing: what is there, what is vague, what to add next. */
export function CoachFeedback({ analysis, compact = false }) {
  if (!analysis) return null;
  const { strengths, flags, nextStep, terms } = analysis;
  return (
    <div className="coach" aria-live="polite">
      {strengths.length > 0 && (
        <div className="coach-block">
          <p className="coach-heading">What you've included</p>
          <ul className="coach-list good">
            {strengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
          {terms.length > 0 && !compact && <p className="coach-terms">Terms spotted: {terms.slice(0, 8).map((t) => <span key={t} className="term">{t}</span>)}</p>}
        </div>
      )}
      {flags.map((f) => (
        <div key={f.id} className="coach-flag">
          <p>{f.message}</p>
          <p className="coach-prompt">→ {f.prompt}</p>
        </div>
      ))}
      {nextStep && (
        <div className="coach-next">
          <p className="coach-heading">Next step: {nextStep.label.toLowerCase()}</p>
          <p>{nextStep.next}</p>
        </div>
      )}
      {!nextStep && !flags.length && (
        <div className="coach-next done">
          <p className="coach-heading">Every component this task asks for is present.</p>
          <p>Now check quality: is each part specific, and does each sentence connect to the next?</p>
        </div>
      )}
    </div>
  );
}

/** A writing box with on-demand coaching. */
export function WritePad({ theme, expect, placeholder, initial = '', rows = 4, onSubmit, submitLabel = 'Get feedback', label, autoFocus }) {
  const [text, setText] = useState(initial);
  const [analysis, setAnalysis] = useState(null);
  return (
    <div className="writepad">
      {label && <label className="field-label">{label}</label>}
      <textarea
        className="input"
        rows={rows}
        value={text}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        aria-label={label || 'Your writing'}
      />
      <div className="row gap">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!text.trim()}
          onClick={() => {
            const a = analyseWriting(text, { theme, expect });
            setAnalysis(a);
            onSubmit?.(text, a);
          }}
        >
          {submitLabel}
        </button>
        <span className="muted small">{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
      </div>
      <CoachFeedback analysis={analysis} />
    </div>
  );
}

const CHECKLIST = [
  { id: 'question', label: 'Answered the question?' },
  { id: 'argument', label: 'Developed the theme into an argument?', auto: (c) => c.meaning && c.theme },
  { id: 'claim', label: 'Made a clear claim?', auto: (c) => c.meaning },
  { id: 'terms', label: 'Used specific musical terminology?', auto: (c) => c.terminology },
  { id: 'elements', label: 'Identified musical elements?', auto: (c) => c.terminology },
  { id: 'evidence', label: 'Provided specific evidence?', auto: (c) => c.evidence },
  { id: 'effect', label: 'Explained the musical effect?', auto: (c) => c.effect },
  { id: 'meaning', label: 'Connected evidence to meaning?', auto: (c) => c.meaning },
  { id: 'theme', label: 'Connected the evidence to the theme?', auto: (c) => c.theme },
  { id: 'connection', label: 'Connected multiple musical elements?', auto: (c) => c.connection },
  { id: 'why', label: 'Explained why the composer uses the features?', auto: (c) => c.why },
  { id: 'judgement', label: 'Made an evaluation?', auto: (c) => c.judgement },
  { id: 'notdescribe', label: 'Avoided simply describing the music?', auto: (c, a) => c.effect && c.meaning && !a.flags.length },
];

/** "Have I…" self-assessment. Student ticks; coach suggestions shown as hints. Not a grade. */
export function SelfAssessment({ analysis }) {
  const [ticked, setTicked] = useState({});
  const count = Object.values(ticked).filter(Boolean).length;
  const pct = Math.round((count / CHECKLIST.length) * 100);
  return (
    <section className="selfcheck" aria-labelledby="selfcheck-h">
      <div className="selfcheck-head">
        <h3 id="selfcheck-h">Have I…</h3>
        <span className="muted small">Writing-quality diagnostic — not a grade</span>
      </div>
      <div className="progress progress-accent" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="small muted">{count} of {CHECKLIST.length} checked</p>
      <ul className="checklist">
        {CHECKLIST.map((c) => {
          const detected = analysis && c.auto ? c.auto(analysis.checks, analysis) : null;
          return (
            <li key={c.id}>
              <label>
                <input type="checkbox" checked={!!ticked[c.id]} onChange={(e) => setTicked({ ...ticked, [c.id]: e.target.checked })} />
                <span>{c.label}</span>
                {detected === true && <span className="hint-tag yes">coach spotted this</span>}
                {detected === false && <span className="hint-tag no">coach couldn't find this</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { COMPONENTS };
