// SHORT RESPONSE: the student writes their own answer (an argument, an explanation, a rewrite),
// gets coaching, revises as many times as they like, then compares with model answers.
//   mode 'argument' → checked against argument criteria (claim, specific, developed, musical, relevant)
//   mode 'analysis' → checked against analysis components (terminology, evidence, effect, meaning…)
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback } from '../components/Coach.jsx';
import { analyseWriting, analyseArgument } from '../utils/coach.js';
import SongPicker, { songStarter } from '../components/SongPicker.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import { songsForTheme } from '../data/songs/themeSongs.js';
import VerbText from '../components/VerbText.jsx';

export function ArgumentFeedback({ result, item }) {
  return (
    <div className="coach" aria-live="polite">
      <ul className="criteria">
        {result.criteria.filter((c) => c.key !== 'musical' || item.needMusical || c.met).map((c) => (
          <li key={c.key} className={c.met ? 'met' : 'unmet'}>
            <span className="crit-mark" aria-hidden="true">{c.met ? '✓' : '○'}</span>
            <span><strong>{c.label}</strong>{!c.met && <span className="crit-tip"> — {c.tip}</span>}</span>
          </li>
        ))}
      </ul>
      {result.flags.map((f) => (
        <div key={f.id} className="coach-flag">
          <p>{f.message}</p>
          <p className="coach-prompt">→ {f.prompt}</p>
        </div>
      ))}
      {!result.flags.length && result.next && !result.next.met && (
        <div className="coach-next"><p className="coach-heading">Next step: {result.next.label.toLowerCase()}</p><p>{result.next.tip}</p></div>
      )}
    </div>
  );
}

export default function ShortResponseExercise({ item, onComplete }) {
  const [text, setText] = useState(item.starter || '');
  const [result, setResult] = useState(null);
  const [checks, setChecks] = useState(0);
  const [done, setDone] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [pickedSong, setPickedSong] = useState(null);
  const isArg = item.mode === 'argument';
  const offerSongs = isArg && !item.song && songsForTheme(item.theme).length > 0;
  const pickSong = (key, song) => {
    setPickedSong(key);
    const starters = [item.starter || '', ...songsForTheme(item.theme).map((x) => songStarter(x, item.theme))].map((x) => x.trim());
    if (!text.trim() || starters.includes(text.trim())) setText(key ? songStarter(song, item.theme) : (item.starter || ''));
  };
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = item.minWords || (isArg ? 8 : 12);
  const changed = text.trim() !== (item.starter || '').trim();

  const evaluate = () => (isArg
    ? analyseArgument(text, { theme: item.theme, needMusical: item.needMusical, needDevelop: item.needDevelop })
    : analyseWriting(text, { theme: item.theme, expect: item.expect }));

  return (
    <div className="exercise">
      <ContextBlock item={item} />
      {item.audio && <AudioPlayer audio={item.audio} label="Listen to the excerpt" />}
      <p className="prompt"><VerbText text={item.prompt} /></p>
      {item.task && <p className="small muted">{item.task}</p>}
      {item.facts?.length > 0 && (
        <div className="facts">
          <p className="field-label">Musical facts you can use</p>
          <ul>{item.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}
      {offerSongs && !done && <SongPicker theme={item.theme} value={pickedSong} onChange={pickSong} />}

      <label className="field-label" htmlFor={`${item.id}-txt`}>Your response</label>
      <textarea id={`${item.id}-txt`} className="input" rows={item.rows || 4} value={text} disabled={done}
        onChange={(e) => setText(e.target.value)} placeholder={item.placeholder || ''} />
      <div className="row between wrap">
        <span className="small muted">{words} words{words < minWords ? ` · aim for at least ${minWords}` : ''}</span>
        {item.hints?.length > 0 && !done && (
          <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowHints(!showHints)}>{showHints ? 'Hide hints' : 'Need a hint?'}</button>
        )}
      </div>
      {showHints && !done && <ul className="hints">{item.hints.map((h) => <li key={h}>{h}</li>)}</ul>}

      {!done && (
        <div className="row gap wrap mt">
          <Button variant="secondary" disabled={!changed || words < 3} onClick={() => { setResult(evaluate()); setChecks(checks + 1); }}>
            {checks ? 'Check again' : 'Check my response'}
          </Button>
          {checks > 0 && (
            <Button onClick={() => { const r = evaluate(); setResult(r); setDone(true); onComplete?.(r.score); }}>Finish &amp; compare</Button>
          )}
        </div>
      )}
      {checks > 0 && !done && <p className="small muted">Revise and check as often as you like. When you are happy, finish to see model answers.</p>}

      {result && (isArg ? <ArgumentFeedback result={result} item={item} /> : <CoachFeedback analysis={result} />)}

      {done && (
        <div className="feedback good">
          <p className="feedback-title">{item.models.length > 1 ? 'Strong responses to compare with' : 'A strong response to compare with'}</p>
          {item.models.map((m) => (
            <div key={m.text} className="model-block">
              <p className="model">{m.text}</p>
              {m.why && <p className="small">{m.why}</p>}
            </div>
          ))}
          {item.explanation && <p className="context-note">{item.explanation}</p>}
          {pickedSong && <p className="context-note">The models are written about the theme in general. Check that your argument fits what you actually hear in the song you chose.</p>}
        </div>
      )}
    </div>
  );
}

/** Compact argument writer used as a follow-up after multiple-choice questions. */
export function ArgumentWritePad({ theme, starter = '', needMusical = false }) {
  const [text, setText] = useState(starter);
  const [result, setResult] = useState(null);
  return (
    <div className="writepad">
      <textarea className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} aria-label="Your argument" />
      <div className="row gap mt">
        <Button variant="secondary" disabled={text.trim() === starter.trim()} onClick={() => setResult(analyseArgument(text, { theme, needMusical }))}>{result ? 'Check again' : 'Check my argument'}</Button>
      </div>
      {result && <ArgumentFeedback result={result} item={{ needMusical }} />}
    </div>
  );
}
