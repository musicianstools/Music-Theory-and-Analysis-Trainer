import { useCallback, useEffect, useRef, useState } from 'react';
import { getDrill } from '../drills/drills.js';
import { NotePad, IntervalPad, ChordPad, ChoicePad, SpellPad, StaffWritePad, StaffChoicePad, MultiChoicePad, TextPad, RhythmChoicePad, RhythmBuildPad, QuizPad, NashvillePad } from '../drills/AnswerPads.jsx';
import Staff from '../components/notation/Staff.jsx';
import RhythmStaff from '../components/notation/RhythmStaff.jsx';
import ScoreStaff from '../components/notation/ScoreStaff.jsx';
import Keyboard from '../components/notation/Keyboard.jsx';
import { playMidiEvents } from '../utils/audioSynth.js';
import { recordResult, logActivity, useProgress } from '../utils/progress.js';
import { noteName, CHORDS, ORDINAL, QUALITY_NAME, PC_NAMES } from '../utils/music.js';
import { StageBar, ButtonLink } from '../components/ui.jsx';
import { Link } from '../utils/router.jsx';
import NotFound from './NotFound.jsx';
import TaskVerbs from '../components/TaskVerbs.jsx';
import { LEVELS } from '../data/levels.js';
import { levelTopic, suggestLevel } from '../utils/adaptive.js';
import { LEVEL_PRESETS } from '../drills/levelPresets.js';

const storeKey = (id) => `met-drill-${id}`;
export const presetsFor = (drill) => drill.levels || LEVEL_PRESETS[drill.id] || null;
const DEFAULT_LEVEL = 2;
function loadSettings(drill) {
  // Default: wait for the student after every answer. Older saved settings stored autoNext: true
  // without the student choosing it, so a saved value only counts once autoNextChosen is set.
  const presets = presetsFor(drill);
  const fresh = { ...drill.defaults, ...(presets ? presets[DEFAULT_LEVEL] : {}), level: presets ? DEFAULT_LEVEL : null, autoNext: false };
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey(drill.id)) || '{}');
    if (!saved.autoNextChosen) delete saved.autoNext;
    return { ...fresh, ...saved };
  } catch { return fresh; }
}

function describe(q, r) {
  if (r === null || r === undefined) return '';
  if (q.pad === 'note') return noteName({ l: r.l, a: r.a, o: 4 });
  if (q.pad === 'interval') return `${QUALITY_NAME[r.quality]} ${ORDINAL[r.num]}`;
  if (q.pad === 'multichoice') return r.join(', ');
  if (q.pad === 'nashville') return r.join(' – ');
  if (q.pad === 'quiz') return 'your answers';
  if (q.pad === 'text') return `“${r}”`;
  if (q.pad === 'rhythmbuild') return 'a different rhythm';
  if (q.pad === 'rhythmchoice') return q.options.find((o) => o.value === r)?.label || '';
  if (q.pad === 'spell' || q.pad === 'staffwrite') return r.map((n) => noteName(n)).join(' ');
  if (false) return r.map((n) => noteName(n)).join('–');
  if (q.pad === 'chord') return `${noteName(r.root)} ${CHORDS[r.type].name.toLowerCase()}`;
  if (q.pad === 'keyboard') return `${PC_NAMES[r % 12]}${Math.floor(r / 12) - 1}`;
  return q.options?.find((o) => o.value === r)?.label || String(r);
}

export default function DrillPage({ id }) {
  const drill = getDrill(id);
  const [settings, setSettings] = useState(() => (drill ? loadSettings(drill) : {}));
  const progress = useProgress();
  const sugg = drill && presetsFor(drill) ? suggestLevel(progress, `drill:${drill.id}`) : null;
  const [q, setQ] = useState(() => (drill ? drill.generate(loadSettings(drill)) : null));
  const [given, setGiven] = useState(null);
  const [result, setResult] = useState(null); // 'right' | 'wrong'
  const [partial, setPartial] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0, best: 0 });
  const [started, setStarted] = useState(!drill?.ear);
  const [round, setRound] = useState(0);
  const stopRef = useRef(null);
  const timer = useRef(null);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const play = useCallback((events) => {
    if (!events) return;
    stopRef.current?.();
    try { stopRef.current = playMidiEvents(events); } catch { /* audio unavailable */ }
  }, []);

  const next = useCallback(() => {
    clearTimeout(timer.current);
    setQ(drill.generate(settings));
    setGiven(null);
    setResult(null);
    setPartial(null);
    setRound((r) => r + 1);
  }, [drill, settings]);

  // Ear drills: play each new question automatically once the student has pressed Start.
  useEffect(() => { if (drill?.ear && started && q?.audio) play(q.audio); }, [q, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // Log the session to "Continue practising" when leaving.
  useEffect(() => () => {
    clearTimeout(timer.current);
    stopRef.current?.();
    const s = scoreRef.current;
    if (drill && s.total > 0) logActivity({ title: `Drill · ${drill.title}`, href: `/drill/${drill.id}`, score: s.right / s.total, count: s.total, stage: drill.stage });
  }, [drill]);

  // Enter / Space for the next question.
  useEffect(() => {
    const onKey = (e) => {
      if (result && (e.key === 'Enter' || e.key === ' ') && !['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement?.tagName)) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, next]);

  if (!drill) return <NotFound />;

  const answer = (r) => {
    if (result) return;
    const raw = q.check(r);
    const value = typeof raw === 'number' ? raw : raw ? 1 : 0; // multi-question tasks return a fraction
    const ok = value >= 0.999;
    setGiven(r);
    setPartial(typeof raw === 'number' ? value : null);
    setResult(ok ? 'right' : 'wrong');
    setScore((s) => {
      const streak = ok ? s.streak + 1 : 0;
      return { right: s.right + (ok ? 1 : 0), total: s.total + 1, streak, best: Math.max(s.best, streak) };
    });
    recordResult(null, drill.skills, value, [`drill:${drill.id}`, ...(q.tags || []).map((t) => `drill:${drill.id}|${t}`), settings.level && !settings.custom && levelTopic(`drill:${drill.id}`, Number(settings.level))]);
    if (ok && settings.autoNext) timer.current = setTimeout(next, 1100);
    if (!ok && drill.ear && q.audio) setTimeout(() => play(q.audio), 300);
  };

  const changeSetting = (key, value) => {
    const presets = presetsFor(drill);
    const s = key === 'level'
      ? { ...settings, ...presets[value], level: value, custom: false }
      : { ...settings, [key]: value, ...(key === 'autoNext' ? { autoNextChosen: true } : { custom: true }) };
    setSettings(s);
    try { localStorage.setItem(storeKey(drill.id), JSON.stringify(s)); } catch { /* storage unavailable */ }
    if (key !== 'autoNext') {
      clearTimeout(timer.current);
      setQ(drill.generate(s));
      setGiven(null);
      setResult(null);
      setPartial(null);
      setRound((r) => r + 1);
    }
  };

  // keyboard marks
  let marks = q.keyboard?.marks || {};
  if (q.pad === 'keyboard' && result) marks = { ...(result === 'wrong' ? { [given]: 'bad' } : {}), [q.target]: 'good' };
  const pct = score.total ? Math.round((score.right / score.total) * 100) : null;
  const disabled = !!result;

  return (
    <div className="page narrow drill">
      <StageBar current={drill.stage} compact />
      <div className="drill-head">
        <div>
          <p className="eyebrow"><Link to={drill.stage === 'hear' ? '/listen' : '/theory'}>{drill.stage === 'hear' ? 'Listen' : 'Theory'}</Link> · Skill drill</p>
          <h1 className="h2">{drill.title}</h1>
        </div>
        <dl className="scoreboard" aria-live="polite">
          <div><dt>Correct</dt><dd>{score.right}/{score.total}</dd></div>
          <div><dt>Accuracy</dt><dd>{pct === null ? '—' : pct + '%'}</dd></div>
          <div><dt>Streak</dt><dd>{score.streak}<span className="small muted"> (best {score.best})</span></dd></div>
        </dl>
      </div>

      {presetsFor(drill) && (
        <div className="level-row" role="radiogroup" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.n} type="button" role="radio" aria-checked={settings.level === l.n} className={`level-btn lv-${l.n} ${settings.level === l.n ? 'on' : ''}`} onClick={() => changeSetting('level', l.n)} title={l.note}>
              <span className="level-n">Level {l.n}{sugg?.level === l.n && <span className="level-sug" title={sugg.reason}>Suggested</span>}</span><span className="level-name">{l.name}</span>
            </button>
          ))}
        </div>
      )}
      {sugg && sugg.count >= 6 && <p className={`small center level-reason ${sugg.dir}`}>{sugg.dir === 'up' ? '▲ ' : sugg.dir === 'down' ? '▼ ' : ''}{sugg.reason}{sugg.level !== Number(settings.level) && <> <button type="button" className="linkish" onClick={() => changeSetting('level', sugg.level)}>Switch to Level {sugg.level}</button></>}</p>}
      {presetsFor(drill) && settings.custom && <p className="small muted center">Level {settings.level} with your own settings — choose a level to reset.</p>}
      <details className="drill-settings">
        <summary>{presetsFor(drill) ? 'Fine-tune settings' : 'Settings'}</summary>
        <div className="settings-grid">
          {drill.settings.map((st) => (
            <div key={st.key} className="setting">
              <span className="setting-label">{st.label}</span>
              <div className="seg" role="radiogroup" aria-label={st.label}>
                {st.options.map(([v, label]) => (
                  <button key={v} type="button" role="radio" aria-checked={settings[st.key] === v} className={`seg-btn ${settings[st.key] === v ? 'on' : ''}`} onClick={() => changeSetting(st.key, v)}>{label}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="setting">
            <span className="setting-label">After a correct answer</span>
            <div className="seg" role="radiogroup" aria-label="After a correct answer">
              {[[false, 'Wait for me'], [true, 'Next question automatically']].map(([v, label]) => (
                <button key={String(v)} type="button" role="radio" aria-checked={settings.autoNext === v} className={`seg-btn ${settings.autoNext === v ? 'on' : ''}`} onClick={() => changeSetting('autoNext', v)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </details>

      <section className={`drill-card ${result ? 'is-' + result : ''}`}>
        <TaskVerbs verbs={drill.verbs || (drill.kind === 'Spelling' ? ['Apply'] : ['Identify'])} />
        <p className="drill-prompt">{q.prompt}</p>

        {(q.staff || (result && q.staffAfter && !(result === 'right' && q.hideAfterIfRight))) && (() => {
          const sf = result && q.staffAfter && !(result === 'right' && q.hideAfterIfRight) ? q.staffAfter : q.staff;
          return (
            <div className={`drill-staff ${sf.columns.length > 3 ? 'wide' : ''}`}>
              {result && q.staffAfterLabel && sf === q.staffAfter && <p className="small muted center">{q.staffAfterLabel}</p>}
              <Staff key={round + (result ? 'r' : '')} clef={sf.clef} columns={sf.columns} keySig={sf.keySig} width={sf.columns.length > 3 ? 540 : sf.columns.length > 1 ? 340 : sf.keySig ? 300 : 260}
                tones={result ? sf.columns.map((c) => c.map(() => (result === 'right' ? 'good' : 'hint'))) : []} label={`${sf.clef} clef`} />
            </div>
          );
        })()}

        {q.score && (
          <div className="drill-staff wide score-wrap">
            <ScoreStaff key={'s' + round} score={q.score} width={q.score.bars.length > 6 ? 900 : q.score.bars.length > 4 ? 760 : 640} />
          </div>
        )}

        {(q.rhythm || (result && q.rhythmAfter)) && (() => {
          const rs = result && q.rhythmAfter ? q.rhythmAfter : q.rhythm;
          return (
            <div className={`drill-staff wide ${rs.single ? 'rhythm-single' : ''}`}>
              {result && q.rhythmAfter && <p className="small muted center">The rhythm you heard</p>}
              <RhythmStaff key={'r' + round + (result ? 'x' : '')} bars={rs.bars} timeSig={rs.timeSig} width={rs.width || (rs.bars.length > 1 ? 560 : 380)} tone={result ? (result === 'right' ? 'good' : 'hint') : null} center={rs.single} label="Rhythm" />
            </div>
          );
        })()}

        {q.audio && (
          <div className="ear-controls">
            {!started ? (
              <button type="button" className="btn btn-primary big-play" onClick={() => { setStarted(true); }}>▶ Start listening</button>
            ) : (
              <button type="button" className="btn btn-secondary big-play" onClick={() => play(q.audio)}>{drill.ear ? '▶ Play again' : '▶ Listen'}</button>
            )}
          </div>
        )}

        {q.keyboard && (
          <Keyboard key={'k' + round} startMidi={q.keyboard.startMidi} octaves={q.keyboard.octaves} marks={marks}
            onKey={q.pad === 'keyboard' ? (m) => { play([{ t: 0, d: 0.8, notes: [m] }]); answer(m); } : undefined} disabled={disabled} />
        )}

        {(!drill.ear || started || !q.audio) && (
          <div className="drill-pad" key={'p' + round}>
            {q.pad === 'note' && <NotePad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'interval' && <IntervalPad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'staffwrite' && <StaffWritePad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'spell' && <SpellPad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'chord' && <ChordPad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'nashville' && <NashvillePad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'quiz' && <QuizPad {...q.padProps} onAnswer={answer} disabled={disabled} solution={q.solution} />}
            {q.pad === 'multichoice' && <MultiChoicePad options={q.options} onAnswer={answer} disabled={disabled} solution={q.solution} />}
            {q.pad === 'text' && <TextPad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'rhythmchoice' && <RhythmChoicePad options={q.options} onAnswer={answer} disabled={disabled} given={given} solution={q.solution} />}
            {q.pad === 'rhythmbuild' && <RhythmBuildPad {...q.padProps} onAnswer={answer} disabled={disabled} />}
            {q.pad === 'staffchoice' && <StaffChoicePad options={q.options} onAnswer={answer} disabled={disabled} given={given} solution={q.solution} />}
            {q.pad === 'choice' && <ChoicePad options={q.options} onAnswer={answer} disabled={disabled} />}
          </div>
        )}

        <div className="drill-feedback" aria-live="assertive">
          {result === 'right' && (
            <div className="feedback good">
              <p className="feedback-title">{partial !== null ? 'All correct!' : `Correct — ${q.answerText}.`}</p>
              {!settings.autoNext && <p className="small">{q.explain}</p>}
            </div>
          )}
          {result === 'wrong' && (
            <div className="feedback warn">
              <p className="feedback-title">{partial !== null ? `${Math.round(partial * (q.padProps?.questions?.length || 1))} of ${q.padProps?.questions?.length || 1} correct — the answers are marked above.` : `You answered ${describe(q, given)}. The answer is ${q.answerText}.`}</p>
              <p>{q.explain}</p>
            </div>
          )}
        </div>

        <div className="row gap wrap drill-actions">
          {q.hear && <button type="button" className="btn btn-ghost btn-small" onClick={() => play(q.hear)}>♪ Hear it</button>}
          {result && <button type="button" className="btn btn-primary" onClick={next} autoFocus>Next question →</button>}
          {!result && <button type="button" className="btn btn-ghost btn-small" onClick={next}>Skip</button>}
          {score.total > 0 && <button type="button" className="btn btn-ghost btn-small" onClick={() => setScore({ right: 0, total: 0, streak: 0, best: 0 })}>Reset score</button>}
        </div>
      </section>
      <p className="small muted center">Questions are generated endlessly. Press Enter for the next question.</p>
      <div className="row gap wrap center-row"><ButtonLink variant="ghost" size="small" to={drill.stage === 'hear' ? '/listen' : '/theory'}>← All drills</ButtonLink></div>
    </div>
  );
}
