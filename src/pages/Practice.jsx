import { levelByKey } from '../data/levels.js';
import { levelTopic } from '../utils/adaptive.js';
import { useMemo, useRef, useState } from 'react';
import { Link, goBack } from '../utils/router.jsx';
import { getSet, DIFFICULTIES, FILTER_LABELS } from '../data/index.js';
import { getSong } from '../data/songs/songs.js';
import { recordResult, logActivity, SKILLS } from '../utils/progress.js';
import { buildSession } from '../utils/session.js';
import ExerciseRenderer from '../exercises/ExerciseRenderer.jsx';
import { StageBar, DifficultyTag, Button, ButtonLink, ProgressBar, EmptyState, STAGE_HREF } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

const NEXT_SET = {
  theory: 'listening', listening: 'feature-effect', 'feature-effect': 'evidence-meaning', 'evidence-meaning': 'upgrade',
  synonyms: 'upgrade', upgrade: 'connect', ladder: 'upgrade', connect: 'theme-argument', 'theme-argument': 'argument-builder',
  'argument-builder': 'paragraph-builder', 'sentence-builder': 'exam-skills', 'exam-skills': 'paragraph-builder', 'paragraph-builder': null,
};

export default function Practice({ setId, query }) {
  const set = getSet(setId);
  const [round, setRound] = useState(0);
  // A fresh random, mixed selection every time a session starts (and on "Practise again").
  const items = useMemo(() => buildSession(set, setId, query), [set, setId, query.difficulty, query.category, query.kind, query.song, round]); // eslint-disable-line react-hooks/exhaustive-deps

  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [finished, setFinished] = useState(false);
  const logged = useRef(false);

  if (!set) return <NotFound />;

  const filterLabel = query.difficulty ? DIFFICULTIES.find((d) => d.key === query.difficulty)?.label
    : query.category ? FILTER_LABELS.category[query.category] || query.category
    : query.kind ? FILTER_LABELS.kind[query.kind]
    : query.song ? getSong(query.song)?.title : null;

  if (!items.length) {
    return (
      <div className="page narrow">
        <EmptyState title="No exercises match this filter yet.">
          <p>Add items to the data files, or <Link to={`/practice/${setId}`}>practise the whole set</Link>.</p>
        </EmptyState>
      </div>
    );
  }

  const item = items[idx];
  const completed = scores[item.id] !== undefined;
  const answeredCount = Object.keys(scores).length;

  const handleComplete = (score) => {
    if (scores[item.id] !== undefined) return;
    setScores((s) => ({ ...s, [item.id]: score }));
    recordResult(item.generated ? null : item.id, item.skills, score, [`set:${setId}`, item.category && `cat:${item.category}`, levelByKey(item.difficulty) && levelTopic(`set:${setId}`, levelByKey(item.difficulty).n)]);
  };

  const finish = () => {
    setFinished(true);
    const vals = Object.values(scores);
    if (!logged.current && vals.length) {
      logged.current = true;
      const qs = new URLSearchParams(query).toString();
      logActivity({
        title: set.title + (filterLabel ? ` · ${filterLabel}` : ''),
        href: `/practice/${setId}${qs ? '?' + qs : ''}`,
        score: vals.reduce((a, b) => a + b, 0) / vals.length,
        count: vals.length,
        stage: set.stage,
      });
    }
  };

  if (finished) {
    const vals = Object.values(scores);
    const avg = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) : 0;
    const skillKeys = [...new Set(items.flatMap((i) => i.skills))];
    const next = NEXT_SET[setId];
    const weak = items.filter((i) => scores[i.id] !== undefined && scores[i.id] < 0.6);
    return (
      <div className="page narrow">
        <p className="eyebrow">Session complete</p>
        <h1 className="title">{set.title}</h1>
        <div className="card summary">
          <p className="summary-score">{avg}%<span className="small muted"> across {vals.length} {vals.length === 1 ? 'task' : 'tasks'}</span></p>
          <p>{avg >= 80 ? 'Secure. You are ready to move up a difficulty level or on to the next stage.' : avg >= 55 ? 'Developing well. Revisit the tasks below, reading the feedback closely, then try again.' : 'This is a skill to build. Slow down, use the scaffolds and read each explanation — that is where the learning happens.'}</p>
          <p className="small muted">Skills practised: {skillKeys.map((k) => SKILLS.find((s) => s.key === k)?.label).filter(Boolean).join(' · ')}</p>
        </div>
        {weak.length > 0 && (
          <div className="card">
            <h2 className="h3">Worth another look</h2>
            <ul className="tidy">{weak.map((w) => <li key={w.id}>{w.prompt || w.question || w.weak || w.id}</li>)}</ul>
          </div>
        )}
        <div className="row gap wrap mt">
          <Button onClick={() => { setRound((r) => r + 1); setIdx(0); setScores({}); setFinished(false); logged.current = false; }}>Practise again — new questions</Button>
          {next && <ButtonLink variant="secondary" to={`/practice/${next}`}>Next step: {getSet(next).title} →</ButtonLink>}
          <ButtonLink variant="ghost" to="/">Home</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow practice">
      <div className="practice-head">
        <StageBar current={set.stage} compact />
        <div className="row between wrap">
          <div>
            <p className="eyebrow">{set.title}{filterLabel ? ` · ${filterLabel}` : ''}</p>
            <p className="practice-count">Task {idx + 1} of {items.length}</p>
          </div>
          <DifficultyTag difficulty={item.difficulty} />
        </div>
        <ProgressBar value={Math.round((answeredCount / items.length) * 100)} showValue={false} label="" />
      </div>

      <div className="card exercise-card">
        <ExerciseRenderer key={item.id} item={item} onComplete={handleComplete} />
      </div>

      <div className="row between practice-nav">
        {idx === 0
          ? <Button variant="ghost" onClick={() => goBack(STAGE_HREF[set.stage] || '/')}>← Back</Button>
          : <Button variant="ghost" onClick={() => setIdx(idx - 1)}>← Previous</Button>}
        {idx < items.length - 1 ? (
          <Button variant={completed ? 'primary' : 'ghost'} onClick={() => setIdx(idx + 1)}>{completed ? 'Next task →' : 'Skip →'}</Button>
        ) : (
          <Button variant={completed ? 'primary' : 'ghost'} onClick={finish}>Finish session</Button>
        )}
      </div>
    </div>
  );
}
