// Objective (auto-marked) exercise types. Each body component is CONTROLLED:
// props { item, response, onChange, revealed } — so the same components work in
// practice mode (ObjectiveExercise, instant feedback) and Exam Mode (feedback after submit).
import { useEffect, useMemo, useState } from 'react';
import AudioPlayer from '../components/AudioPlayer.jsx';
import { ContextBlock, Button } from '../components/ui.jsx';
import { WritePad } from '../components/Coach.jsx';
import { ArgumentWritePad } from './ShortResponseExercise.jsx';
import Staff from '../components/notation/Staff.jsx';
import ScoreStaff from '../components/notation/ScoreStaff.jsx';
import { playMidiEvents } from '../utils/audioSynth.js';
import { grade, isAnswered, seededShuffle, emptyResponse } from '../utils/grade.js';
import VerbText from '../components/VerbText.jsx';

function Prompt({ item }) {
  const parts = item.prompt.split('___');
  return (
    <p className="prompt">
      {parts.map((p, i) => (
        <span key={i}><VerbText text={p} />{i < parts.length - 1 && <span className="blank" aria-label="blank">______</span>}</span>
      ))}
    </p>
  );
}

function Audio({ item }) {
  if (item.audio) return <AudioPlayer audio={item.audio} label="Listen to the excerpt" />;
  if (item.audioCompare) {
    return (
      <div className="audio-compare">
        {item.audioCompare.map((a) => <AudioPlayer key={a.label} audio={a} label={a.label} />)}
      </div>
    );
  }
  return null;
}

function Notation({ item }) {
  if (item.score) {
    const bars = item.score.bars.length;
    return (
      <div className="drill-staff wide score-wrap">
        <ScoreStaff score={item.score} width={bars > 6 ? 900 : bars > 4 ? 760 : 640} />
      </div>
    );
  }
  if (!item.staff) return null;
  return (
    <div className="drill-staff">
      <Staff clef={item.staff.clef} columns={item.staff.columns} keySig={item.staff.keySig} width={item.staff.columns.length > 1 ? 340 : 280} label={`${item.staff.clef} clef`} />
      {item.hear && <div className="row center-row"><button type="button" className="btn btn-ghost btn-small" onClick={() => { try { playMidiEvents(item.hear); } catch { /* no audio */ } }}>♪ Hear it</button></div>}
    </div>
  );
}

export function MCQBody({ item, response, onChange, revealed }) {
  return (
    <div>
      <ContextBlock item={item} />
      <Notation item={item} />
      <Audio item={item} />
      <Prompt item={item} />
      <div className="options" role="radiogroup" aria-label="Answer options">
        {item.options.map((o, i) => {
          const selected = response === o.id;
          const correct = revealed && o.id === item.correctAnswer;
          const wrong = revealed && selected && !correct;
          return (
            <div key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={revealed}
                className={`option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'incorrect' : ''}`}
                onClick={() => onChange(o.id)}
              >
                <span className="option-key">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{o.text}</span>
                {correct && <span className="option-mark" aria-label="correct answer">✓</span>}
              </button>
              {wrong && o.feedback && <p className="option-feedback">{o.feedback}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MultiBody({ item, response = [], onChange, revealed }) {
  const want = new Set(item.correctAnswers);
  const toggle = (id) => onChange(response.includes(id) ? response.filter((x) => x !== id) : [...response, id]);
  return (
    <div>
      <ContextBlock item={item} />
      <Notation item={item} />
      <Audio item={item} />
      <Prompt item={item} />
      <div className="chips-grid" role="group" aria-label="Select all that apply">
        {item.options.map((o) => {
          const on = response.includes(o.id);
          const cls = revealed ? (want.has(o.id) ? (on ? 'correct' : 'missed') : on ? 'incorrect' : '') : '';
          return (
            <button key={o.id} type="button" aria-pressed={on} disabled={revealed} className={`select-chip ${on ? 'on' : ''} ${cls}`} onClick={() => toggle(o.id)}>
              {o.text}
            </button>
          );
        })}
      </div>
      {revealed && <p className="small muted">Green = correct choice · Amber outline = needed but not chosen · Red = not needed</p>}
    </div>
  );
}

export function OrderBody({ item, response, onChange, revealed }) {
  const initial = useMemo(() => {
    let s = seededShuffle(item.items.map((x) => x.id), item.id);
    if (s.join() === item.correctOrder.join()) s = [...s.slice(1), s[0]];
    return s;
  }, [item]);
  useEffect(() => { if (!response) onChange(initial); }, [response, initial, onChange]);
  const order = response || initial;
  const byId = Object.fromEntries(item.items.map((x) => [x.id, x]));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <ContextBlock item={item} />
      <Prompt item={item} />
      <ol className="order-list">
        {order.map((id, i) => {
          const ok = revealed ? item.correctOrder[i] === id : null;
          return (
            <li key={id} className={`order-item ${ok === true ? 'correct' : ok === false ? 'incorrect' : ''}`}>
              <span className="order-num">{i + 1}</span>
              <span className="order-text">{byId[id].text}</span>
              {!revealed && (
                <span className="order-ctrl">
                  <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move "${byId[id].text}" up`}>↑</button>
                  <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`Move "${byId[id].text}" down`}>↓</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {revealed && !grade(item, order).correct && (
        <div className="order-answer">
          <p className="small strong">Correct order</p>
          <ol>{item.correctOrder.map((id) => <li key={id}>{byId[id].text}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

export function MatchBody({ item, response = {}, onChange, revealed }) {
  const rights = useMemo(() => seededShuffle(item.pairs.map((p, i) => ({ text: p.right, i })), item.id), [item]);
  return (
    <div>
      <ContextBlock item={item} />
      <Prompt item={item} />
      <div className="match">
        {item.pairs.map((p, li) => {
          const chosen = response[li];
          const ok = revealed ? chosen === li : null;
          return (
            <div key={li} className={`match-row ${ok === true ? 'correct' : ok === false ? 'incorrect' : ''}`}>
              <span className="match-left">{p.left}</span>
              <select
                className="input select"
                value={chosen ?? ''}
                disabled={revealed}
                onChange={(e) => onChange({ ...response, [li]: e.target.value === '' ? undefined : Number(e.target.value) })}
                aria-label={`Match for ${p.left}`}
              >
                <option value="">Choose…</option>
                {rights.map((r) => <option key={r.i} value={r.i}>{r.text}</option>)}
              </select>
              {revealed && ok === false && <span className="match-fix">→ {p.right}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const OBJECTIVE_BODIES = { mcq: MCQBody, multi: MultiBody, order: OrderBody, match: MatchBody };

export function ObjectiveBody(props) {
  const Body = OBJECTIVE_BODIES[props.item.type];
  return <Body {...props} />;
}

export function Explanation({ item, result }) {
  return (
    <div className={`feedback ${result.correct ? 'good' : result.score > 0 ? 'partial' : 'warn'}`} role="status">
      <p className="feedback-title">
        {result.correct ? 'Yes — here is why.' : result.score > 0 ? `Partly there (${Math.round(result.score * 100)}%). Here is the full picture.` : 'Not this time — here is the thinking.'}
      </p>
      <p>{item.explanation}</p>
      {item.contextNote && <p className="context-note"><strong>Context matters:</strong> {item.contextNote}</p>}
    </div>
  );
}

/** Practice-mode wrapper: answer → check → explanation (+ optional "write your own" follow-up). */
export function ObjectiveExercise({ item, onComplete }) {
  const [response, setResponse] = useState(() => emptyResponse(item));
  const [result, setResult] = useState(null);
  const answered = isAnswered(item, response);
  return (
    <div className="exercise">
      <ObjectiveBody item={item} response={response} onChange={setResponse} revealed={!!result} />
      {!result && (
        <div className="row gap mt">
          <Button disabled={!answered} onClick={() => { const r = grade(item, response); setResult(r); onComplete?.(r.score); }}>
            Check answer
          </Button>
          {!answered && <span className="muted small">{item.type === 'order' ? 'Arrange the items, then check.' : 'Choose an answer to continue.'}</span>}
        </div>
      )}
      {result && <Explanation item={item} result={result} />}
      {result && item.followUp && (
        <div className="followup">
          <p className="followup-title">Your turn</p>
          <p>{item.followUp.prompt}</p>
          {item.followUp.mode === 'argument'
            ? <ArgumentWritePad theme={item.followUp.theme} starter={item.followUp.starter} />
            : <WritePad theme={item.followUp.theme} expect={['terminology', 'effect', 'meaning', 'theme']} placeholder="Write your own analytical sentence…" rows={3} />}
        </div>
      )}
    </div>
  );
}
