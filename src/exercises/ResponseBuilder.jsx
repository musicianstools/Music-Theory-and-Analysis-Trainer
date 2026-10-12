// PRACTICE EXAM (extended response): Introduction + Key moment 1 + Key moment 2 + Key moment 3.
// Practice mode: scaffolding can be removed (guided → prompts → independent) and a report appears on submit.
// Exam mode: headings only, optional planning space, report shown by the exam page.
import { useState } from 'react';
import { RESPONSE_SECTIONS } from '../data/writing/responsePrompts.js';
import { getSong } from '../data/songs/songs.js';
import { analyseWriting, analyseArgument, findLocations, COMPONENTS } from '../utils/coach.js';
import { CoachFeedback, SelfAssessment } from '../components/Coach.jsx';
import { Button } from '../components/ui.jsx';
import { examParts } from '../data/writing/examParts.js';
import VerbText from '../components/VerbText.jsx';
import { verbsInText } from '../data/cognitiveVerbs.js';
import TaskVerbs from '../components/TaskVerbs.jsx';

export const RESPONSE_SCAFFOLDS = [
  { key: 'guided', label: 'Guided', desc: 'Sentence starters and a checklist for each paragraph' },
  { key: 'prompts', label: 'Prompts only', desc: 'Checklist for each paragraph, no starters' },
  { key: 'independent', label: 'Independent', desc: 'Headings only — exam conditions' },
];

const wc = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);
const fill = (s, prompt, song) => s.replace('{title}', song?.title || 'the work').replace('{artist}', song?.artist || 'the composer').replace('{theme}', prompt.theme);

/** Analyse a complete response. Returns per-section analysis, structure checks and an overall score. */
export function buildReport(prompt, values) {
  const sections = RESPONSE_SECTIONS.map((s) => {
    const text = values[s.key] || '';
    return { ...s, text, words: wc(text), analysis: analyseWriting(text, { theme: prompt.theme, expect: s.expect }), locations: findLocations(text) };
  });
  const [intro, ...moments] = sections;
  const introSentences = intro.text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const lastSentence = introSentences[introSentences.length - 1] || '';
  const arg = analyseArgument(lastSentence, { theme: prompt.theme });
  const argAnywhere = analyseArgument(intro.text, { theme: prompt.theme });
  const argMet = Object.fromEntries(arg.criteria.map((c) => [c.key, c.met]));
  const unlocated = moments.filter((m) => !m.locations.length).map((m) => m.label);
  const locSets = moments.map((m) => m.locations.join('|')).filter(Boolean);
  const distinct = new Set(locSets).size === locSets.length;
  const short = sections.filter((s) => s.words < s.target[0]);

  const checks = [
    (() => {
      // The thesis should be the last sentence of the introduction — recommended, not required.
      const anyMet = Object.fromEntries(argAnywhere.criteria.map((c) => [c.key, c.met]));
      const atEnd = argMet.claim && argMet.specific;
      const present = atEnd || (anyMet.claim && anyMet.specific);
      return {
        label: 'The introduction includes a specific thesis',
        ok: present,
        note: present && !atEnd ? 'Your thesis is there, but it is not the final sentence. It should usually be the last sentence of the introduction, so the introduction builds to your argument — consider moving it.' : null,
        tip: anyMet.claim && !argMet.claim
          ? 'Your thesis is there, but it is not the final sentence — and it needs a more specific idea about the theme. It should usually be the last sentence of the introduction, so the introduction builds to your argument.'
          : arg.flags[0]?.prompt || 'Include your thesis in the introduction — ideally as its last sentence: "… presents [theme] as …" with a precise, arguable idea.',
      };
    })(),
    { label: 'The introduction sets the context first', ok: introSentences.length >= 3 || (introSentences.length >= 2 && !analyseArgument(introSentences[0], { theme: prompt.theme }).criteria[0].met), tip: 'Open with context (the song, artist and theme), then preview your moments, and only then state your thesis.' },
    { label: 'The introduction previews the key moments', ok: intro.locations.length >= 2 || intro.analysis.terms.length >= 2, tip: 'Name the moments or elements you will analyse, e.g. "the restrained verses, the straining chorus and the unresolved ending".' },
    { label: 'Each key moment is located in the music', ok: unlocated.length === 0, tip: `Say where the moment happens (section and/or timestamp)${unlocated.length ? ` — missing in ${unlocated.join(', ')}` : ''}.` },
    { label: 'The three moments are different', ok: locSets.length === 3 && distinct, tip: locSets.length < 3 ? 'Locate all three moments so the reader can see they are different parts of the music.' : 'Two paragraphs seem to discuss the same part of the song. Choose moments that develop or contrast your argument.' },
    { label: 'Every paragraph links back to the theme', ok: sections.every((s) => s.analysis.checks.theme), tip: `Name ${prompt.theme} in each paragraph and say what the moment suggests about it.` },
    { label: 'Elements are connected in every key-moment paragraph', ok: moments.every((m) => m.analysis.checks.connection), tip: 'Show how two elements work together: "while…", "together, these…", "reinforced by…".' },
    { label: 'The response ends with an overall evaluation', ok: moments[2].analysis.checks.judgement, tip: 'Finish key moment 3 with how effectively the theme is communicated overall, and why.' },
    { label: 'Paragraphs are developed in enough detail', ok: short.length === 0, tip: `Aim for about ${RESPONSE_SECTIONS[1].target[0]}–${RESPONSE_SECTIONS[1].target[1]} words per key-moment paragraph${short.length ? ` (short: ${short.map((s) => s.label).join(', ')})` : ''}.` },
  ];
  const paraScores = sections.map((s, i) => (i === 0 ? (s.analysis.score + arg.score) / 2 : s.analysis.score));
  const paraMean = paraScores.reduce((a, b) => a + b, 0) / paraScores.length;
  const checkMean = checks.filter((c) => c.ok).length / checks.length;
  const full = sections.map((s) => s.text).join('\n\n');
  return {
    sections, arg, checks, full,
    words: sections.reduce((n, s) => n + s.words, 0),
    overall: analyseWriting(full, { theme: prompt.theme }),
    score: Math.round((0.6 * paraMean + 0.4 * checkMean) * 100) / 100,
  };
}

const MATRIX = COMPONENTS.map((c) => ({ key: c.key, label: c.label.replace('Musical ', '').replace('Specific ', '').replace('Link to the theme', 'Theme') }));

export function ResponseReport({ prompt, report }) {
  return (
    <div className="report">
      <section className="essay" aria-label="Your response">
        <h3>Your response <span className="small muted">· {report.words} words</span></h3>
        {report.sections.map((s) => (
          <div key={s.key} className={`essay-para hlb-${s.hl}`}>
            <p className="essay-label">{s.label}</p>
            <p className="prewrap">{s.text || <em className="muted">Not written.</em>}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Structure</h3>
        <ul className="structure-checks">
          {report.checks.map((c) => (
            <li key={c.label} className={c.ok ? 'met' : 'unmet'}>
              <span className="crit-mark" aria-hidden="true">{c.ok ? '✓' : '○'}</span>
              <span><strong>{c.label}</strong>{!c.ok && <span className="crit-tip"> — {c.tip}</span>}{c.ok && c.note && <span className="crit-tip"> — {c.note}</span>}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Paragraph diagnostic</h3>
        <p className="small muted">What the coach could find in each paragraph. A diagnostic of components, not a mark.</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr><th scope="col">Paragraph</th><th scope="col">Words</th>{MATRIX.map((m) => <th key={m.key} scope="col">{m.label}</th>)}</tr>
            </thead>
            <tbody>
              {report.sections.map((s) => (
                <tr key={s.key}>
                  <th scope="row">{s.label}</th>
                  <td className={s.words < s.target[0] ? 'low' : ''}>{s.words}<span className="muted small"> /{s.target[0]}+</span></td>
                  {MATRIX.map((m) => {
                    const expected = s.expect.includes(m.key);
                    const ok = s.analysis.checks[m.key];
                    return <td key={m.key} className={expected ? (ok ? 'yes' : 'no') : 'na'} aria-label={expected ? (ok ? 'present' : 'missing') : 'not required'}>{expected ? (ok ? '✓' : '·') : '–'}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Feedback by paragraph</h3>
        {report.sections.map((s) => (
          <details key={s.key} className="para-feedback">
            <summary>{s.label}{s.analysis.missing.length ? ` — next: ${s.analysis.missing[0].label.toLowerCase()}` : ' — all components found'}</summary>
            <CoachFeedback analysis={s.analysis} />
          </details>
        ))}
      </section>

      {prompt.modelOutline && (
        <details className="model-details" open>
          <summary>One possible plan for this question</summary>
          {(() => {
            const parts = examParts[prompt.partsId || prompt.id];
            return parts ? (
              <p><strong>Model introduction</strong> (context → preview → thesis as the last sentence): {parts.context} {parts.preview} <mark className="hl hl-claim">{parts.thesis}</mark></p>
            ) : (
              <p><strong>Introduction:</strong> {prompt.modelOutline.intro}</p>
            );
          })()}
          <p className="small"><strong>Possible key moments:</strong></p>
          <ol className="tidy">
            {prompt.modelOutline.moments.map((m) => (
              <li key={m.where}><strong>{m.where}:</strong> {m.what} {m.why && <em>{m.why}</em>}</li>
            ))}
          </ol>
          {prompt.modelOutline.otherMoments?.length > 0 && (
            <p className="small muted">Other moments you could use: {prompt.modelOutline.otherMoments.map((m) => `${m.where} (${m.what.replace(/\.$/, '')})`).join('; ')}.</p>
          )}
        </details>
      )}
      <SelfAssessment analysis={report.overall} />
    </div>
  );
}

export default function ResponseBuilder({ prompt, mode = 'practice', phase = 'writing', onSubmit, timeUp = false }) {
  const planning = phase === 'planning';
  const song = prompt.song ? getSong(prompt.song) : null;
  const exam = mode === 'exam';
  const [scaffold, setScaffold] = useState(exam ? 'independent' : 'guided');
  const starters = (sc) => Object.fromEntries(RESPONSE_SECTIONS.map((s) => [s.key, sc === 'guided' ? fill(s.starter, prompt, song) : '']));
  const [vals, setVals] = useState(() => starters(exam ? 'independent' : 'guided'));
  const [plan, setPlan] = useState({ argument: '', m1: '', m2: '', m3: '' });
  const [report, setReport] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const total = RESPONSE_SECTIONS.reduce((n, s) => n + wc(vals[s.key]), 0);
  const empty = RESPONSE_SECTIONS.filter((s) => wc(vals[s.key]) < 10);
  const untouched = Object.values(vals).every((v, i) => v.trim() === (scaffold === 'guided' ? fill(RESPONSE_SECTIONS[i].starter, prompt, song).trim() : ''));

  const changeScaffold = (sc) => {
    setScaffold(sc);
    // Only swap starters into paragraphs the student has not written yet.
    setVals((v) => Object.fromEntries(RESPONSE_SECTIONS.map((s) => {
      const cur = v[s.key].trim();
      const isStarter = !cur || cur === fill(s.starter, prompt, song).trim();
      return [s.key, isStarter ? (sc === 'guided' ? fill(s.starter, prompt, song) : '') : v[s.key]];
    })));
  };

  const submit = (force = false) => {
    if (!force && empty.length) { setConfirming(true); return; }
    setConfirming(false);
    const r = buildReport(prompt, vals);
    if (!exam) setReport(r);
    onSubmit?.(vals, r);
  };

  if (report && !exam) {
    return (
      <div className="response-builder">
        <p className="question-box"><span className="field-label">Question</span><VerbText text={prompt.question} /></p>
        <ResponseReport prompt={prompt} report={report} />
        <div className="row gap wrap mt">
          <Button variant="secondary" onClick={() => setReport(null)}>Revise my response</Button>
          {scaffold !== 'independent' && <Button variant="ghost" onClick={() => { setReport(null); changeScaffold(scaffold === 'guided' ? 'prompts' : 'independent'); }}>Try with less scaffolding →</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="response-builder">
      <TaskVerbs verbs={[...new Set([...verbsInText(prompt.question), 'Analyse', 'Evaluate', 'Synthesise'])]} />
      <p className="question-box"><span className="field-label">Question</span><VerbText text={prompt.question} /></p>
      {song && <p className="small muted">{song.artist} — <em>{song.title}</em> ({song.year}). Characteristics you may draw on: {song.characteristics.slice(0, 4).join('; ')}.</p>}

      {!exam && (
        <div className="level-picker" role="tablist" aria-label="Scaffolding">
          {RESPONSE_SCAFFOLDS.map((s) => (
            <button key={s.key} type="button" role="tab" aria-selected={scaffold === s.key} title={s.desc} className={`level ${scaffold === s.key ? 'on' : ''}`} onClick={() => changeScaffold(s.key)}>{s.label}</button>
          ))}
        </div>
      )}

      <details className="plan" open={exam || undefined}>
        <summary>Planning space <span className="small muted">(not marked)</span></summary>
        <div className="plan-grid">
          <label htmlFor="plan-arg">Argument</label>
          <input id="plan-arg" className="input" value={plan.argument} onChange={(e) => setPlan({ ...plan, argument: e.target.value })} placeholder={`${prompt.theme} as …`} />
          {['m1', 'm2', 'm3'].map((k, i) => (
            <div key={k} className="plan-row">
              <label htmlFor={`plan-${k}`}>Moment {i + 1}</label>
              <input id={`plan-${k}`} className="input" value={plan[k]} onChange={(e) => setPlan({ ...plan, [k]: e.target.value })} placeholder="where · elements · what it shows" />
            </div>
          ))}
        </div>
      </details>

      {RESPONSE_SECTIONS.map((s) => {
        const n = wc(vals[s.key]);
        return (
          <fieldset key={s.key} className={`para-field essay-field hlb-${s.hl}`}>
            <legend>{s.label}</legend>
            {scaffold !== 'independent' && <p className="small muted field-q"><VerbText text={s.question} /></p>}
            {scaffold !== 'independent' && (
              <ul className="guide">{s.guide.map((g) => <li key={g}>{g}</li>)}</ul>
            )}
            <textarea id={`rb-${s.key}`} className="input" rows={s.key === 'intro' ? 5 : 9} value={vals[s.key]} aria-label={s.label} readOnly={planning}
              placeholder={planning ? 'Opens when planning time ends.' : ''}
              onChange={(e) => setVals({ ...vals, [s.key]: e.target.value })} />
            <p className={`small wordcount ${n && n < s.target[0] ? 'under' : ''}`}>{n} words · suggested {s.target[0]}–{s.target[1]}</p>
          </fieldset>
        );
      })}

      {timeUp && <p className="small muted">Time is up. Finish your sentence and submit — in the real exam you would stop here.</p>}
      {planning ? null : confirming ? (
        <div className="feedback partial" role="alertdialog" aria-label="Confirm submission">
          <p className="feedback-title">{empty.map((s) => s.label).join(', ')} {empty.length === 1 ? 'is' : 'are'} empty or very short.</p>
          <p>You can still submit — the report will show what is missing.</p>
          <div className="row gap wrap">
            <Button onClick={() => submit(true)}>Submit anyway</Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>Keep writing</Button>
          </div>
        </div>
      ) : (
        <div className="row gap wrap mt">
          <Button disabled={untouched || total < 20} onClick={() => submit()}>{exam ? 'Submit response' : 'Submit for feedback'}</Button>
          <span className="small muted">{total} words in total</span>
        </div>
      )}
    </div>
  );
}
