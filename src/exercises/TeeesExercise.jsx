// TEEES PARAGRAPH — plan a moment, then write Topic sentence → Elaborate → Evidence → Explain → Summary/link.
// Two ways to work: part by part (guided, with hints) or as one whole paragraph (with a TEEES checklist).
// Feedback: each part is checked for its job, the paragraph is colour-coded by part, and a model is shown to compare.
import { useMemo, useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback } from '../components/Coach.jsx';
import { analyseWriting } from '../utils/coach.js';
import { getSong } from '../data/songs/songs.js';
import { TEEES_PARTS, PLAN_FIELDS, teeesParagraphs } from '../data/writing/teees.js';
import { ensureSentence } from './shared.jsx';

const wc = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);
const STOP = new Set(['the', 'and', 'that', 'this', 'with', 'as', 'of', 'in', 'a', 'an', 'is', 'to', 'for', 'its', 'it', 'song', 'where', 'which', 'from', 'are', 'by', 'be', 'into', 'than']);
const keyWords = (t) => (t.toLowerCase().match(/[a-z']{4,}/g) || []).filter((w) => !STOP.has(w));
// A timecode (1:05, 0:45–1:10, 2m30s) or bar markers (bar 12, bars 9–16, b. 12, mm. 5–8). The value itself is never checked —
// it differs between recordings and editions — only that one was given. "[timecode]" is the placeholder used in the models.
const TIME_RE = /\b\d{1,2}:\d{2}\b|\b\d{1,2}m\s?\d{1,2}s?\b|\b(?:bars?|b\.|mm?\.|measures?)\s*\d+|\[timecode\]/i;
const LINK_RE = /\b(however|yet|next|later|following|then|this (?:leads|sets up|prepares)|in contrast|by contrast|returns?|completed?|builds? (?:on|towards)|grows?|develops?|until|whereas|but)\b/i;

/** Check one TEEES part for the job it is meant to do. Returns { ok, tips[] }. */
export function checkPart(key, text, { song, theme, topic, ending }) {
  const t = text.trim();
  const words = wc(t);
  const tips = [];
  const lower = t.toLowerCase();
  if (!t) return { ok: false, tips: ['Not written yet.'] };
  if (key === 'topic') {
    if (song && !lower.includes(song.title.toLowerCase().slice(0, 8)) && !lower.includes(song.artist.toLowerCase().split(' ')[0])) tips.push(`Name the song or artist explicitly ("${song.title}", ${song.artist}).`);
    if (theme && !lower.includes(theme.toLowerCase().slice(0, 5))) tips.push(`State the theme explicitly — use the word "${theme}".`);
    if (!/\b(present|convey|portray|depict|explore|construct|suggest|communicat|express|reveal|capture)\w*/i.test(t)) tips.push('Say how the song creates meaning: "presents … as …", "conveys …", "explores …".');
  }
  if (key === 'elaborate') {
    if (words < 10) tips.push('Add a little context: what kind of song is it, and what is it about?');
    if (words > 60) tips.push('Elaborate should be brief — one or two sentences. Save the detail for Explain.');
  }
  if (key === 'evidence') {
    if (!TIME_RE.test(t)) tips.push('Give a timecode (e.g. 1:05) or bar markers (e.g. bars 9–12) — from whichever recording or score you are using.');
    if (!/\blyric|\bwords?\b|\bsings?\b|\bline\b|"|“|as the (speaker|singer|lyrics)/i.test(t)) tips.push('Include the key lyrical idea at this point, where relevant.');
  }
  if (key === 'explain') {
    const a = analyseWriting(t, { theme, expect: ['terminology', 'effect', 'meaning'] });
    a.missing.forEach((m) => tips.push(m.next));
    if (words < 45) tips.push('Explain should be the most detailed part — unpack two or three musical characteristics, each with its effect.');
    const topicWords = new Set(keyWords(topic || ''));
    if (topicWords.size && !keyWords(t).some((w) => topicWords.has(w))) tips.push('Make an explicit connection back to the meaning in your topic sentence — reuse its key idea.');
  }
  if (key === 'summary') {
    if (ending === 'link') {
      if (!LINK_RE.test(t)) tips.push('Another paragraph follows, so link to it: carry your idea forward into the next moment ("This … is developed / challenged / completed in …").');
    } else {
      const topicWords = new Set(keyWords(topic || ''));
      if (topicWords.size && keyWords(t).filter((w) => topicWords.has(w)).length < 2) tips.push('Re-establish your topic sentence: restate its key idea in fresh words.');
      if (/^in conclusion|good song|really good/i.test(t)) tips.push('Avoid "in conclusion" and opinions — restate your specific idea about the theme.');
    }
  }
  return { ok: tips.length === 0, tips };
}

function Plan({ plan, setPlan, song }) {
  return (
    <details className="teees-plan" open>
      <summary>Plan your moment</summary>
      <p className="small muted">Organise your ideas before you write. You can keep it to short notes.</p>
      <div className="teees-plan-grid">
        {PLAN_FIELDS.map((f) => (
          <label key={f.key} className="teees-plan-field">
            <span className="field-label">{f.label}</span>
            <span className="small muted">{f.q}</span>
            <textarea className="input" rows={2} value={plan[f.key] || ''} onChange={(e) => setPlan({ ...plan, [f.key]: e.target.value })} />
          </label>
        ))}
      </div>
      {song && <p className="small muted">Tip: “What happens in {song.title}” above lists the key moments you can draw on.</p>}
    </details>
  );
}

export default function TeeesExercise({ item, onComplete }) {
  const model = teeesParagraphs.find((p) => p.id === item.id) || teeesParagraphs.find((p) => p.song === item.song);
  const song = getSong(item.song);
  const theme = item.theme;
  const [mode, setMode] = useState(item.forceWhole ? 'whole' : 'parts'); // 'parts' | 'whole' (Level 5 is whole-paragraph only)
  const [ending, setEnding] = useState('summary'); // 'summary' | 'link'
  const [plan, setPlan] = useState({});
  const fillStarter = (s) => (s || '').replace('{title}', song?.title || 'the song').replace('{artist}', song?.artist || 'the artist');
  const [parts, setParts] = useState(() => Object.fromEntries(TEEES_PARTS.map((p) => [p.key, ''])));
  const [hints, setHints] = useState({});
  const [whole, setWhole] = useState('');
  const [ticks, setTicks] = useState({});
  const [result, setResult] = useState(null);

  const partChecks = useMemo(() => Object.fromEntries(TEEES_PARTS.map((p) => [p.key, checkPart(p.key, parts[p.key], { song, theme, topic: parts.topic, ending })])), [parts, song, theme, ending]);
  const allWritten = TEEES_PARTS.every((p) => parts[p.key].trim());

  const submit = () => {
    if (mode === 'parts') {
      const okCount = TEEES_PARTS.filter((p) => partChecks[p.key].ok).length;
      const text = TEEES_PARTS.map((p) => ensureSentence(parts[p.key])).join(' ');
      const a = analyseWriting(text, { theme });
      const score = Math.round((0.6 * (okCount / TEEES_PARTS.length) + 0.4 * a.score) * 100) / 100;
      setResult({ mode, text, analysis: a, score, checks: partChecks });
      onComplete?.(score);
    } else {
      const a = analyseWriting(whole, { theme, expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme'] });
      const tickScore = Object.values(ticks).filter(Boolean).length / TEEES_PARTS.length;
      const score = Math.round((0.5 * a.score + 0.5 * tickScore) * 100) / 100;
      setResult({ mode, text: whole, analysis: a, score });
      onComplete?.(score);
    }
  };

  const modelParts = model ? TEEES_PARTS.map((p) => ({ ...p, text: p.key === 'summary' && ending === 'link' ? model.parts.link : model.parts[p.key] })) : [];

  return (
    <div className="exercise teees">
      <ContextBlock item={{ song: item.song, theme: item.theme, moment: item.moment }} />
      <p className="prompt">{item.prompt}</p>

      <div className="teees-strip" aria-label="TEEES structure">
        {TEEES_PARTS.map((p) => <span key={p.key} className={`teees-chip hl-${p.hl}`}><strong>{p.letter}</strong> {p.label}</span>)}
      </div>

      {!result && (
        <>
          <div className="row gap wrap">
            {!item.forceWhole && <div className="level-picker" role="tablist" aria-label="How to write">
              <button type="button" role="tab" aria-selected={mode === 'parts'} className={`level ${mode === 'parts' ? 'on' : ''}`} onClick={() => setMode('parts')}>Part by part</button>
              <button type="button" role="tab" aria-selected={mode === 'whole'} className={`level ${mode === 'whole' ? 'on' : ''}`} onClick={() => setMode('whole')}>Whole paragraph</button>
            </div>}
            <div className="level-picker" role="radiogroup" aria-label="Paragraph ending">
              <button type="button" role="radio" aria-checked={ending === 'summary'} className={`level ${ending === 'summary' ? 'on' : ''}`} onClick={() => setEnding('summary')}>Single paragraph — summarise</button>
              <button type="button" role="radio" aria-checked={ending === 'link'} className={`level ${ending === 'link' ? 'on' : ''}`} onClick={() => setEnding('link')}>Another paragraph follows — link</button>
            </div>
          </div>

          <Plan plan={plan} setPlan={setPlan} song={song} />

          {mode === 'parts' ? (
            <ol className="teees-parts">
              {TEEES_PARTS.map((p) => {
                const val = parts[p.key];
                const c = partChecks[p.key];
                const starter = fillStarter(p.key === 'summary' && ending === 'link' ? p.linkStarter : p.starter);
                return (
                  <li key={p.key} className={`teees-part hlb-${p.hl}`}>
                    <div className="teees-part-head">
                      <span className={`teees-letter hl-${p.hl}`}>{p.letter}</span>
                      <span className="teees-part-label">{p.key === 'summary' ? (ending === 'link' ? 'Link' : 'Summary') : p.label}</span>
                      <span className="small muted">{wc(val)} words</span>
                    </div>
                    <p className="small teees-guide">{p.key === 'summary' ? (ending === 'link' ? 'Another paragraph follows: use this sentence to link to the next paragraph.' : 'Re-establish the topic sentence by summarising it.') : p.guide}</p>
                    <textarea className="input" rows={p.rows} value={val} aria-label={p.label}
                      onChange={(e) => setParts({ ...parts, [p.key]: e.target.value })} />
                    <div className="row gap wrap teees-part-foot">
                      {!val.trim() && <button type="button" className="btn btn-ghost btn-small" onClick={() => setParts({ ...parts, [p.key]: starter })}>Start me off: “{starter.trim()}…”</button>}
                      {val.trim() && <button type="button" className="btn btn-ghost btn-small" onClick={() => setHints({ ...hints, [p.key]: true })}>Check this part</button>}
                    </div>
                    {hints[p.key] && val.trim() && (
                      c.ok
                        ? <p className="small teees-ok">✓ This does the job of the {p.label.toLowerCase()}.</p>
                        : <ul className="small teees-tips">{c.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="teees-whole">
              <textarea className="input" rows={12} value={whole} onChange={(e) => setWhole(e.target.value)} aria-label="Your TEEES paragraph"
                placeholder="Topic sentence → Elaborate → Evidence → Explain → Summary/link" />
              <p className="small muted">{wc(whole)} words · Tick each part once you have written it:</p>
              <ul className="teees-checklist">
                {TEEES_PARTS.map((p) => (
                  <li key={p.key}>
                    <label><input type="checkbox" checked={!!ticks[p.key]} onChange={(e) => setTicks({ ...ticks, [p.key]: e.target.checked })} /> <strong>{p.letter} — {p.key === 'summary' ? (ending === 'link' ? 'Link' : 'Summary') : p.label}:</strong> {p.key === 'summary' ? (ending === 'link' ? 'links to the next paragraph' : 're-establishes the topic sentence') : p.guide}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="row gap mt">
            <Button disabled={mode === 'parts' ? !allWritten : wc(whole) < 60} onClick={submit}>Check my paragraph</Button>
            {mode === 'parts' && !allWritten && <span className="small muted">Write all five parts to check the paragraph.</span>}
            {mode === 'whole' && wc(whole) < 60 && <span className="small muted">Aim for at least 60 words.</span>}
          </div>
        </>
      )}

      {result && (
        <div className="result-block">
          <h3>Your TEEES paragraph</h3>
          {result.mode === 'parts' ? (
            <>
              <p className="hl-paragraph">
                {TEEES_PARTS.map((p) => <span key={p.key}><mark className={`hl hl-${p.hl}`} title={p.label}>{ensureSentence(parts[p.key])}</mark>{' '}</span>)}
              </p>
              <ul className="teees-report">
                {TEEES_PARTS.map((p) => {
                  const c = result.checks[p.key];
                  return (
                    <li key={p.key} className={c.ok ? 'met' : 'unmet'}>
                      <span className="crit-mark" aria-hidden="true">{c.ok ? '✓' : '○'}</span>
                      <span><strong>{p.letter} — {p.key === 'summary' ? (ending === 'link' ? 'Link' : 'Summary') : p.label}</strong>{c.ok ? '' : <span className="crit-tip"> — {c.tips.join(' ')}</span>}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="hl-paragraph prewrap">{result.text}</p>
          )}
          <CoachFeedback analysis={result.analysis} />

          {model && (
            <div className="feedback good">
              <p className="feedback-title">A model TEEES paragraph to compare with</p>
              <p className="hl-paragraph">
                {modelParts.map((p) => <span key={p.key}><mark className={`hl hl-${p.hl}`} title={p.label}>{p.text}</mark>{' '}</span>)}
              </p>
              <ul className="teees-legend">
                {TEEES_PARTS.map((p) => <li key={p.key}><span className={`hl-swatch hl-${p.hl}`} />{p.letter} — {p.key === 'summary' ? (ending === 'link' ? 'Link' : 'Summary') : p.label}</li>)}
              </ul>
              <details className="mt">
                <summary>The plan behind the model</summary>
                <dl className="context">
                  {PLAN_FIELDS.map((f) => <div key={f.key} className="context-row"><dt>{f.label}</dt><dd>{model.plan[f.key]}</dd></div>)}
                </dl>
              </details>
              <p className="small muted">“[timecode]” marks where you add the time from the recording you are using.</p>
            </div>
          )}
          <Button variant="ghost" className="mt" onClick={() => setResult(null)}>Revise my paragraph</Button>
        </div>
      )}
    </div>
  );
}
