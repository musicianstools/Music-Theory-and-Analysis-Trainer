// Fill-the-frame exercise (Theme → Argument "upgrade the theme", Sentence Builder…).
// Students choose a suggested phrase or write their own for each blank; then see the
// assembled sentence, coaching, phrase-quality notes and an optional "develop it further" step.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback, WritePad } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import { Chips, fillFrame } from './shared.jsx';
import SongPicker from '../components/SongPicker.jsx';
import { songsForTheme } from '../data/songs/themeSongs.js';
import VerbText from '../components/VerbText.jsx';

const QUALITY_LABEL = { strong: 'Strong choice', ok: 'Workable', weak: 'Needs more' };

export default function ScaffoldExercise({ item, onComplete }) {
  const [values, setValues] = useState(() => item.blanks.map(() => ''));
  const [checked, setChecked] = useState(null);
  const [song, setSong] = useState(null);
  const set = (i, v) => setValues(values.map((x, j) => (j === i ? v : x)));
  const offerSongs = !item.song && item.category === 'theme-to-argument' && songsForTheme(item.theme).length > 0;
  const frame = song && /^The (composer|song)/.test(item.frame) ? `In "${song.title}", t${item.frame.slice(1)}` : item.frame;
  const sentence = fillFrame(frame, values);
  const ready = values.every((v) => v.trim());

  const check = () => {
    const a = analyseWriting(sentence, { theme: item.theme, expect: item.expect });
    const notes = item.blanks.map((b, i) => (b.suggestions || []).find((s) => s.text.toLowerCase() === values[i].trim().toLowerCase())).filter(Boolean);
    const chipScore = notes.length ? notes.reduce((sum, n) => sum + ({ strong: 1, ok: 0.7, weak: 0.2 }[n.quality] ?? 0.6), 0) / notes.length : null;
    const score = chipScore === null ? a.score : (a.score + chipScore) / 2;
    setChecked({ analysis: a, notes, score });
    onComplete?.(score);
  };

  return (
    <div className="exercise">
      <ContextBlock item={item} />
      <p className="prompt"><VerbText text={item.prompt} /></p>
      {offerSongs && !checked && <SongPicker theme={item.theme} value={song?.key || null} onChange={(k, s2) => setSong(k ? s2 : null)} />}

      <div className="frame-preview" aria-live="polite">
        <span className="frame-label">Your sentence</span>
        <p>{sentence}</p>
      </div>

      {!checked && item.blanks.map((b, i) => (
        <div className="blank-field" key={i}>
          <label className="field-label" htmlFor={`${item.id}-b${i}`}>{item.blanks.length > 1 ? `${i + 1}. ` : ''}{b.label}</label>
          <input id={`${item.id}-b${i}`} className="input" value={values[i]} placeholder={b.placeholder} onChange={(e) => set(i, e.target.value)} />
          <Chips suggestions={b.suggestions} selected={values[i]} onPick={(t) => set(i, t)} />
        </div>
      ))}

      {!checked && (
        <div className="row gap mt">
          <Button disabled={!ready} onClick={check}>Check my sentence</Button>
          {!ready && <span className="muted small">Fill every blank — pick a suggestion or write your own.</span>}
        </div>
      )}

      {checked && (
        <>
          {checked.notes.length > 0 && (
            <div className="quality-notes">
              {checked.notes.map((n) => (
                <p key={n.text} className={`quality quality-${n.quality}`}>
                  <strong>{QUALITY_LABEL[n.quality]}:</strong> “{n.text}” — {n.note}
                </p>
              ))}
            </div>
          )}
          <CoachFeedback analysis={checked.analysis} />
          <div className="feedback good">
            <p className="feedback-title">One strong version</p>
            <p className="model">{item.model}</p>
            {item.explanation && <p>{item.explanation}</p>}
          </div>
          {item.develop && (
            <div className="followup">
              <p className="followup-title">Develop it further</p>
              <p><VerbText text={item.develop.prompt} /></p>
              <WritePad theme={item.theme} expect={['meaning', 'theme']} initial={sentence} rows={3} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
