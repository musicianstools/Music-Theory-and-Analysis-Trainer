// THEME → ARGUMENT D: add a musical direction. Choose elements, get fit feedback, then compose.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import SongPicker from '../components/SongPicker.jsx';
import { songsForTheme } from '../data/songs/themeSongs.js';
import VerbText from '../components/VerbText.jsx';

const FIT = { strong: 'Strong fit', possible: 'Possible', weak: 'Hard to prove' };

export default function DirectionExercise({ item, onComplete }) {
  const [picked, setPicked] = useState([]);
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState(item.compose.starter || '');
  const [analysis, setAnalysis] = useState(null);
  const [song, setSong] = useState(null);
  const offerSongs = !item.song && songsForTheme(item.theme).length > 0;
  const chooseSong = (k, s2) => {
    setSong(k ? s2 : null);
    const base = item.compose.starter || '';
    const withSong = (x) => (x ? `In "${x.title}", t${base.slice(1)}` : base);
    if ([base, ...songsForTheme(item.theme).map(withSong)].map((x) => x.trim()).includes(text.trim())) setText(withSong(k ? s2 : null));
  };
  const toggle = (id) => setPicked(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);
  const chosen = item.elements.filter((e) => picked.includes(e.id));
  const pickScore = chosen.length ? chosen.reduce((s, e) => s + ({ strong: 1, possible: 0.6, weak: 0.1 }[e.fit]), 0) / chosen.length : 0;

  return (
    <div className="exercise">
      <ContextBlock item={item} />
      {offerSongs && !analysis && <SongPicker theme={item.theme} value={song?.key || null} onChange={chooseSong} label="Choose a song to test this argument against" />}
      <p className="prompt"><VerbText text={item.prompt} /></p>
      <div className="chips-grid">
        {item.elements.map((e) => (
          <button key={e.id} type="button" aria-pressed={picked.includes(e.id)} disabled={checked} className={`select-chip cap ${picked.includes(e.id) ? 'on' : ''} ${checked && picked.includes(e.id) ? 'fit-' + e.fit : ''}`} onClick={() => toggle(e.id)}>
            {e.id}
          </button>
        ))}
      </div>
      {!checked && <Button className="mt" disabled={picked.length < item.minSelect} onClick={() => setChecked(true)}>Check my choices</Button>}
      {checked && (
        <>
          <div className="fit-list">
            {chosen.map((e) => (
              <p key={e.id} className={`fit fit-${e.fit}`}><strong className="cap">{e.id} — {FIT[e.fit]}.</strong> {e.note.replace(/^[^:]+:\s*/, '')}</p>
            ))}
            {item.elements.filter((e) => e.fit === 'strong' && !picked.includes(e.id)).map((e) => (
              <p key={e.id} className="fit fit-missed"><strong className="cap">Also worth considering: {e.id}.</strong> {e.note.replace(/^[^:]+:\s*/, '')}</p>
            ))}
          </div>
          <div className="followup">
            <p className="followup-title"><VerbText text={item.compose.prompt} /></p>
            <textarea className="input" rows={3} value={text} disabled={!!analysis} onChange={(e) => setText(e.target.value)} aria-label="Your argument with a musical direction" />
            {!analysis && (
              <Button className="mt" disabled={text.trim().length <= (item.compose.starter || '').trim().length + (song ? song.title.length + 6 : 0)} onClick={() => {
                const a = analyseWriting(text, { theme: item.theme, expect: item.expect });
                setAnalysis(a);
                onComplete?.((a.score + pickScore) / 2);
              }}>Check my argument</Button>
            )}
            <CoachFeedback analysis={analysis} />
            {analysis && (
              <div className="feedback good">
                <p className="feedback-title">One strong version</p>
                <p className="model">{item.model}</p>
                <p>{item.explanation}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
