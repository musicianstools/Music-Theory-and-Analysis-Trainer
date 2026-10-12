import { useEffect, useMemo, useRef, useState } from 'react';
import { getExamMode } from '../data/examModes.js';
import { getSet } from '../data/index.js';
import { analysisChallengePrompts } from '../data/writing/responsePrompts.js';
import { generateExamQuestion } from '../data/writing/examQuestions.js';
import { generatedItems, notationItems } from '../data/generators.js';
import { themes, ARGUMENT_QUALITIES } from '../data/themes/themes.js';
import { getSong } from '../data/songs/songs.js';
import { isObjective, grade, isAnswered, emptyResponse, shuffle } from '../utils/grade.js';
import { analyseWriting, analyseArgument } from '../utils/coach.js';
import { recordResult, logActivity } from '../utils/progress.js';
import { ObjectiveBody, Explanation } from '../exercises/Objective.jsx';
import ResponseBuilder, { ResponseReport } from '../exercises/ResponseBuilder.jsx';
import { ArgumentFeedback } from '../exercises/ShortResponseExercise.jsx';
import { CoachFeedback, SelfAssessment } from '../components/Coach.jsx';
import { Button, ButtonLink, Card, Callout } from '../components/ui.jsx';
import { goBack } from '../utils/router.jsx';
import SongPicker, { songStarter } from '../components/SongPicker.jsx';
import NotFound from './NotFound.jsx';
import VerbText from '../components/VerbText.jsx';
import { verbsForItem, verbsInText } from '../data/cognitiveVerbs.js';
import TaskVerbs from '../components/TaskVerbs.jsx';
import { scoreSection, buildMockPaper, decodeConfig, encodeConfig, SECTIONS, sectionOf } from '../data/mockExam.js';
import { levelLabel } from '../data/levels.js';
import { levelTopic } from '../utils/adaptive.js';

/** Turn a mock-exam config (from the URL) into an exam mode. */
function customMode(c) {
  const cfg = decodeConfig(c);
  const parts = [
    ...SECTIONS.filter((s) => cfg[s.key]).map((s) => `${s.title} (${cfg[s.key]}${s.key === 'score' ? ` excerpt${cfg[s.key] > 1 ? 's' : ''}` : ''})`),
    ...(cfg.writing !== 'none' ? ['a written task'] : []),
  ];
  return {
    id: 'custom', custom: cfg, title: 'Mock exam', subtitle: levelLabel(cfg.level),
    minutes: cfg.timed ? cfg.minutes : 0, untimed: !cfg.timed,
    blurb: `Your mock exam at ${levelLabel(cfg.level)}: ${parts.join(', ')}.`,
  };
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function writingTask(kind) {
  if (kind === 'paragraph') return { kind: 'paragraph', ...pick(analysisChallengePrompts) };
  if (kind === 'theme') return { kind: 'theme', theme: pick(themes) };
  if (kind === 'response') return { kind: 'response', ...generateExamQuestion() };
  return null;
}

function buildPaper(mode) {
  if (mode.custom) {
    const p = buildMockPaper(mode.custom);
    return { questions: p.questions, writing: writingTask(p.writing) };
  }
  let questions = [];
  if (mode.objective) {
    const { pools, count, split } = mode.objective;
    if (split) {
      questions = Object.entries(split).flatMap(([setId, n]) => shuffle([...getSet(setId).items, ...generatedItems(setId)].filter(isObjective)).slice(0, n));
    } else {
      const pool = pools.flatMap((p) => [...getSet(p).items, ...generatedItems(p)].filter(isObjective));
      const extra = mode.objective.mix ? [
        ...shuffle(notationItems(false)).slice(0, mode.objective.mix.notation || 0),
        ...shuffle(scoreSection(2, mode.objective.mix.score ? 1 : 0)).slice(0, mode.objective.mix.score || 0),
      ] : [];
      questions = shuffle([...extra, ...shuffle(pool).slice(0, count - extra.length)]);
    }
  }
  let writing = null;
  if (mode.writing?.kind === 'paragraph') writing = { kind: 'paragraph', ...pick(analysisChallengePrompts) };
  if (mode.writing?.kind === 'theme') writing = { kind: 'theme', theme: pick(themes) };
  if (mode.writing?.kind === 'response') writing = { kind: 'response', ...generateExamQuestion() };
  return { questions, writing };
}

function useCountdown(seconds, running, onEnd) {
  const [left, setLeft] = useState(seconds);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => setLeft((l) => {
      if (l <= 1) { clearInterval(t); endRef.current?.(); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running]);
  return left;
}

const fmt = (s) => (s >= 3600
  ? `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
const fmtMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)} hour${m >= 120 ? 's' : ''}${m % 60 ? ` ${m % 60} minutes` : ''}` : `${m} minutes`);

function ParagraphTask({ task, onDone, timeUp }) {
  const [text, setText] = useState('');
  const song = getSong(task.song);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <TaskVerbs verbs={[...new Set([...verbsInText(task.prompt), 'Analyse', 'Evaluate'])]} />
      <p className="question-box"><span className="field-label">Analysis challenge</span><VerbText text={task.prompt} /></p>
      {song && <p className="small muted">Characteristics you may draw on: {song.characteristics.join('; ')}.</p>}
      <textarea className="input" rows={10} value={text} onChange={(e) => setText(e.target.value)} aria-label="Your paragraph" placeholder="Argument → evidence → effect → meaning → interconnectivity → evaluation" />
      <div className="row gap mt">
        <Button disabled={words < 15} onClick={() => onDone(text, analyseWriting(text, { theme: task.theme }))}>Submit paragraph</Button>
        <span className="small muted">{words} words</span>
      </div>
      {timeUp && <p className="small muted mt">Time is up. Finish your sentence and submit — in the real exam you would stop here.</p>}
    </div>
  );
}

function ThemeTask({ task, onDone, timeUp }) {
  const [arg, setArg] = useState('');
  const [song, setSong] = useState(null);
  const [dir, setDir] = useState('');
  const [checks, setChecks] = useState({});
  return (
    <div>
      <TaskVerbs verbs={['Interpret', 'Develop', 'Justify']} />
      <p className="question-box"><span className="field-label">Your theme</span><span className="theme-big">{task.theme.label}</span></p>
      <p>Choose a song, then develop a specific, arguable claim about how it presents <strong>{task.theme.label.toLowerCase()}</strong>, and name the musical direction you would use to prove it.</p>
      <SongPicker theme={task.theme.id} value={song} onChange={(k, s2) => { setSong(k); if (!arg.trim() || arg.trim().startsWith('In "')) setArg(k ? songStarter(s2, task.theme.label.toLowerCase()) : ''); }} />
      <label className="field-label" htmlFor="ex-arg">Your argument</label>
      <textarea id="ex-arg" className="input" rows={3} value={arg} onChange={(e) => setArg(e.target.value)} placeholder={`The composer presents ${task.theme.label.toLowerCase()} as…`} />
      <label className="field-label" htmlFor="ex-dir">Musical direction — which elements, and what would you listen for?</label>
      <textarea id="ex-dir" className="input" rows={3} value={dir} onChange={(e) => setDir(e.target.value)} placeholder="…through a gradual thickening of texture and…" />
      <fieldset className="quality-check">
        <legend>Before you submit: is your argument…</legend>
        {ARGUMENT_QUALITIES.map((q) => (
          <label key={q.key}><input type="checkbox" checked={!!checks[q.key]} onChange={(e) => setChecks({ ...checks, [q.key]: e.target.checked })} /> <strong>{q.label}</strong> — {q.text}</label>
        ))}
      </fieldset>
      <Button className="mt" disabled={!arg.trim()} onClick={() => {
        const text = `${arg.trim()} ${dir.trim()}`;
        const argument = analyseArgument(text, { theme: task.theme.label, needMusical: true, needDevelop: true });
        onDone(text, { ...analyseWriting(text, { theme: task.theme.label, expect: ['terminology', 'meaning', 'theme'] }), score: argument.score }, argument);
      }}>Submit argument</Button>
      {timeUp && <p className="small muted mt">Time is up — submit when you are ready.</p>}
    </div>
  );
}

export default function ExamRun({ mode: modeId, query = {} }) {
  const mode = useMemo(() => (modeId === 'custom' ? customMode(query.c) : getExamMode(modeId)), [modeId, query.c]);
  const paper = useMemo(() => (mode ? buildPaper(mode) : null), [mode]);
  const [phase, setPhase] = useState('intro');
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [writingResult, setWritingResult] = useState(null);
  const [hideTimer, setHideTimer] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const recorded = useRef(false);

  const running = (phase === 'objective' || phase === 'writing') && !mode?.untimed;
  const left = useCountdown((mode?.minutes || 1) * 60, running, () => {
    setTimeUp(true);
    if (phase === 'objective') submitObjective(true);
  });
  const planLeft = useCountdown((mode?.planningMinutes || 0) * 60, phase === 'planning', () => setPhase('writing'));

  // Save progress once, when results are first shown.
  useEffect(() => {
    if (phase !== 'results' || recorded.current || !paper) return;
    recorded.current = true;
    const res = paper.questions.map((x) => ({ x, r: grade(x, responses[x.id]) }));
    res.forEach(({ x, r }) => recordResult(x.generated ? null : x.id, x.skills, r.score, [x.category && `cat:${x.category}`, `exam:${modeId}`, mode.custom && levelTopic('mock', mode.custom.level), x.section && `exam:custom|${x.section}`]));
    if (writingResult) recordResult(`exam-${modeId}-writing`, paper.writing.kind === 'theme' ? ['themeArgument', 'argument'] : ['writing', 'argument'], writingResult.analysis.score, [`exam:${modeId}`, `exam:${modeId}|writing`]);
    const scores = [...res.map((y) => y.r.score), ...(writingResult ? [writingResult.analysis.score] : [])];
    if (scores.length) logActivity({ title: `Exam · ${mode.title}`, href: `/exam/${modeId}`, score: scores.reduce((a, b) => a + b, 0) / scores.length, count: scores.length, stage: null });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mode) return <NotFound />;
  const qs = paper.questions;
  const q = qs[idx];
  const answered = qs.filter((x) => isAnswered(x, responses[x.id])).length;

  function submitObjective(force = false) {
    if (!force && answered < qs.length) { setConfirming(true); return; }
    setConfirming(false);
    setPhase(paper.writing ? 'writing' : 'results');
  }

  const start = () => setPhase(qs.length ? 'objective' : mode.planningMinutes ? 'planning' : 'writing');

  const results = phase === 'results' ? qs.map((x) => ({ q: x, r: grade(x, responses[x.id]) })) : [];

  return (
    <div className="page narrow exam">
      <div className="exam-bar">
        <div>
          <p className="eyebrow">Exam Mode</p>
          <h1 className="h2">{mode.title}</h1>
          {mode.subtitle && <p className="small muted">{mode.subtitle}</p>}
        </div>
        {(running || phase === 'planning') && (
          <div className="timer-wrap">
            <span className="timer-phase">{phase === 'planning' ? 'Planning' : phase === 'objective' ? 'Time left' : 'Writing'}</span>
            {!hideTimer && <span className={`timer ${(phase === 'planning' ? planLeft : left) < 60 ? 'low' : ''}`} aria-live="off">{fmt(phase === 'planning' ? planLeft : left)}</span>}
            <button className="btn btn-ghost btn-small" onClick={() => setHideTimer(!hideTimer)}>{hideTimer ? 'Show timer' : 'Hide timer'}</button>
          </div>
        )}
      </div>

      {phase === 'intro' && (
        <Card>
          <p>{mode.blurb}</p>
          <ul className="tidy">
            {mode.planningMinutes ? (
              <li>Time allowed: <strong>{fmtMinutes(mode.planningMinutes)} planning</strong>, then <strong>{fmtMinutes(mode.minutes)} writing</strong> — the same as the real exam. You can start writing early.</li>
            ) : mode.untimed ? (
              <li>Untimed — take as long as you need.</li>
            ) : (
              <li>Time allowed: <strong>{fmtMinutes(mode.minutes)}</strong></li>
            )}
            {mode.custom && SECTIONS.filter((s) => paper.questions.some((x) => x.section === s.key)).map((s) => (
              <li key={s.key}>Section {s.letter} · {s.title}: {paper.questions.filter((x) => x.section === s.key).length} questions{s.key === 'score' ? ` on ${mode.custom.score} excerpt${mode.custom.score > 1 ? 's' : ''}` : ''}</li>
            ))}
            {paper.writing?.kind === 'response' && <li>Your question is generated fresh for this attempt. It appears when planning time starts.</li>}
            {qs.length > 0 && <li>{qs.length} questions — move freely between them; feedback appears after you submit.</li>}
            {paper.writing && <li>A written task{qs.length ? ' after the questions' : ''}.</li>}
          </ul>
          <Button className="mt" onClick={start}>Begin</Button>
        </Card>
      )}

      {phase === 'objective' && q && (
        <>
          <nav className="qnav" aria-label="Question navigation">
            {qs.map((x, i) => [
              x.section && (i === 0 || qs[i - 1].section !== x.section) && <span key={'sec-' + x.section} className="qnav-sec" aria-hidden="true">{sectionOf(x.section).letter}</span>,
              <button key={x.id} className={`qnav-btn ${i === idx ? 'current' : ''} ${isAnswered(x, responses[x.id]) ? 'answered' : ''}`} onClick={() => setIdx(i)} aria-label={`Question ${i + 1}${isAnswered(x, responses[x.id]) ? ', answered' : ''}`} aria-current={i === idx}>
                {i + 1}
              </button>,
            ])}
          </nav>
          <p className="small muted">{answered} of {qs.length} answered</p>
          <Card className="exercise-card">
            <p className="practice-count">Question {idx + 1}{q.section && <> · Section {sectionOf(q.section).letter}: {sectionOf(q.section).title}{q.groupLabel ? ` · ${q.groupLabel}` : ''}</>}</p>
            <TaskVerbs verbs={verbsForItem(q)} />
            <ObjectiveBody key={q.id} item={q} response={responses[q.id] ?? emptyResponse(q)} onChange={(v) => setResponses((r) => ({ ...r, [q.id]: v }))} revealed={false} />
          </Card>
          <div className="row between practice-nav">
            {idx === 0
              ? <Button variant="ghost" onClick={() => goBack(mode.custom ? '/exam/build' : '/exam')}>← Back</Button>
              : <Button variant="ghost" onClick={() => setIdx(idx - 1)}>← Previous</Button>}
            {idx < qs.length - 1
              ? <Button variant="secondary" onClick={() => setIdx(idx + 1)}>Next →</Button>
              : <Button onClick={() => submitObjective()}>{paper.writing ? 'Submit & continue to writing' : 'Submit answers'}</Button>}
          </div>
          {confirming && (
            <div className="feedback partial" role="alertdialog" aria-label="Confirm submission">
              <p className="feedback-title">You have answered {answered} of {qs.length} questions.</p>
              <p>Unanswered questions will be marked as incorrect, but you will still see their explanations.</p>
              <div className="row gap wrap">
                <Button onClick={() => submitObjective(true)}>Submit anyway</Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>Keep working</Button>
              </div>
            </div>
          )}
        </>
      )}

      {(phase === 'writing' || phase === 'planning') && (
        <Card>
          {phase === 'planning' && (
            <div className="planning-banner">
              <div>
                <p className="feedback-title">Planning time</p>
                <p className="small">Read the question, choose your three key moments and draft your thesis in the planning space. The response boxes open when planning ends.</p>
              </div>
              <Button variant="secondary" onClick={() => setPhase('writing')}>Start writing now</Button>
            </div>
          )}
          {paper.writing.kind === 'paragraph' && <ParagraphTask task={paper.writing} timeUp={timeUp} onDone={(text, analysis) => { setWritingResult({ text, analysis }); setPhase('results'); }} />}
          {paper.writing.kind === 'theme' && <ThemeTask task={paper.writing} timeUp={timeUp} onDone={(text, analysis, argument) => { setWritingResult({ text, analysis, argument }); setPhase('results'); }} />}
          {paper.writing.kind === 'response' && (
            <>
              {timeUp && <Callout title="Time is up">Finish your current sentence and submit.</Callout>}
              <ResponseBuilder prompt={paper.writing} mode="exam" phase={phase} timeUp={timeUp} onSubmit={(vals, report) => { setWritingResult({ report, analysis: { score: report.score } }); setPhase('results'); }} />
            </>
          )}
        </Card>
      )}

      {phase === 'results' && (
        <div className="exam-results">
          <Card className="summary">
            <h2 className="h3">Results</h2>
            {qs.length > 0 && (
              <p className="summary-score">
                {results.filter((x) => x.r.correct).length}/{qs.length}
                <span className="small muted"> questions fully correct · {Math.round((results.reduce((a, x) => a + x.r.score, 0) / qs.length) * 100)}% overall</span>
              </p>
            )}
            {mode.custom && qs.length > 0 && (
              <div className="mock-breakdown">
                {SECTIONS.filter((s) => results.some((x) => x.q.section === s.key)).map((s) => {
                  const rs = results.filter((x) => x.q.section === s.key);
                  const pct = Math.round((rs.reduce((a, x) => a + x.r.score, 0) / rs.length) * 100);
                  return (
                    <div key={s.key} className="mock-break-row">
                      <span className="mock-letter">{s.letter}</span>
                      <span className="mock-break-name">{s.title}</span>
                      <span className="mock-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
                      <span className="mock-break-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
            {writingResult && <p>Your written task is below with coaching. Remember: the writing diagnostic shows which components are present — it is not a grade.</p>}
            {timeUp && <p className="small muted">Time ran out — work was submitted automatically.</p>}
          </Card>

          {writingResult?.report && (
            <Card>
              <ResponseReport prompt={paper.writing} report={writingResult.report} />
            </Card>
          )}

          {writingResult && !writingResult.report && (
            <Card>
              <h2 className="h3">Your written task</h2>
              <p className="hl-paragraph prewrap">{writingResult.text}</p>
              {writingResult.argument ? <ArgumentFeedback result={writingResult.argument} item={{ needMusical: true }} /> : <CoachFeedback analysis={writingResult.analysis} />}
              {paper.writing.kind === 'theme' && (
                <div className="feedback good">
                  <p className="feedback-title">Some directions for “{paper.writing.theme.label}”</p>
                  <ul className="tidy">{paper.writing.theme.starters.map((s) => <li key={s}>The composer presents {paper.writing.theme.label.toLowerCase()} as {s}…</li>)}</ul>
                </div>
              )}
              <SelfAssessment analysis={writingResult.analysis} />
            </Card>
          )}

          {results.length > 0 && <h2 className="section-title">Review your answers</h2>}
          {results.map(({ q: x, r }, i) => (
            <Card key={x.id} className="exercise-card review">
              <p className="practice-count">Question {i + 1}{x.section ? ` · ${sectionOf(x.section).title}` : ''} · {r.correct ? 'Correct' : r.score > 0 ? 'Partly correct' : 'Review this'}</p>
              <ObjectiveBody item={x} response={responses[x.id] ?? emptyResponse(x)} onChange={() => {}} revealed />
              <Explanation item={x} result={r} />
            </Card>
          ))}
          <div className="row gap wrap mt">
            {mode.custom ? (
              <>
                <ButtonLink to={`/exam/custom?c=${encodeConfig(mode.custom)}&attempt=${Date.now().toString(36)}`}>New paper, same settings</ButtonLink>
                <ButtonLink variant="secondary" to="/exam/build">Change settings</ButtonLink>
              </>
            ) : <ButtonLink to={`/exam/${modeId}?attempt=${Date.now()}`}>{paper.writing?.kind === 'response' ? 'Start a new practice exam' : 'Try again'}</ButtonLink>}
            <ButtonLink variant="ghost" to="/exam">Back to Exam Mode</ButtonLink>
            <ButtonLink variant="secondary" to="/">Home — see what to practise next</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
