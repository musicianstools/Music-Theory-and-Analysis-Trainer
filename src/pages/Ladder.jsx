import { useState } from 'react';
import { LADDER_RUNGS, ladderExamples } from '../data/analysis/ladder.js';
import { PageHeader, StageBar, ButtonLink } from '../components/ui.jsx';
import VerbText from '../components/VerbText.jsx';

export default function Ladder() {
  const [exId, setExId] = useState(ladderExamples[0].id);
  const [reached, setReached] = useState(1);
  const ex = ladderExamples.find((e) => e.id === exId);
  const rungsTopDown = [...LADDER_RUNGS].map((r, i) => ({ ...r, i })).reverse();

  return (
    <div className="page narrow">
      <PageHeader eyebrow="Stage 3 · Analyse" title="The Analysis Ladder" lede="Each rung keeps everything below it and adds one new layer of thinking. Most weak analysis stops at the bottom two rungs.">
        <StageBar current="explain" />
      </PageHeader>

      <div className="level-picker" role="tablist" aria-label="Example">
        {ladderExamples.map((e) => (
          <button key={e.id} type="button" role="tab" aria-selected={exId === e.id} className={`level ${exId === e.id ? 'on' : ''}`} onClick={() => { setExId(e.id); setReached(1); }}>{e.title}</button>
        ))}
      </div>

      <ol className="ladder" aria-label="Analysis ladder, top rung first">
        {rungsTopDown.map((r) => {
          const shown = r.i < reached;
          return (
            <li key={r.key} className={`ladder-rung ${shown ? 'shown' : ''} ${r.i === reached - 1 ? 'latest' : ''}`}>
              <div className="ladder-side">
                <span className="ladder-label"><VerbText text={r.label} /></span>
                <span className="ladder-q">{r.question}</span>
              </div>
              <p className="ladder-text">{shown ? ex.rungs[r.key] : ''}</p>
            </li>
          );
        })}
      </ol>
      <div className="row gap wrap">
        {reached < LADDER_RUNGS.length
          ? <button className="btn btn-primary" onClick={() => setReached(reached + 1)}>Climb to {LADDER_RUNGS[reached].label} ↑</button>
          : <button className="btn btn-ghost" onClick={() => setReached(1)}>Back to the bottom</button>}
        <ButtonLink variant="secondary" to="/practice/ladder">Climb it yourself (ordering)</ButtonLink>
        <ButtonLink variant="ghost" to="/practice/upgrade">Upgrade the Analysis →</ButtonLink>
      </div>
    </div>
  );
}
