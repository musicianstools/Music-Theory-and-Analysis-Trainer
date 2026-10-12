// UPGRADE THE ANALYSIS: rewrite a weak statement with live coaching; reveal a model ladder.
import { useState } from 'react';
import { ContextBlock, Button } from '../components/ui.jsx';
import { CoachFeedback } from '../components/Coach.jsx';
import { analyseWriting, COMPONENTS } from '../utils/coach.js';

export default function UpgradeExercise({ item, onComplete }) {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showLadder, setShowLadder] = useState(false);
  const [done, setDone] = useState(false);
  const expectLabels = COMPONENTS.filter((c) => item.expect.includes(c.key)).map((c) => c.label);

  const feedback = () => {
    setAnalysis(analyseWriting(text, { theme: item.theme, expect: item.expect }));
    setAttempts(attempts + 1);
  };

  return (
    <div className="exercise">
      <ContextBlock item={item} />
      {item.facts?.length > 0 && (
        <div className="facts">
          <p className="field-label">Musical facts you can use</p>
          <ul>{item.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}
      <p className="prompt">Upgrade this statement into strong analysis.</p>
      <p className="small muted">Aim to include: {expectLabels.join(' · ')}</p>
      <textarea className="input" rows={4} value={text} disabled={done} onChange={(e) => setText(e.target.value)} placeholder="Rewrite the statement here…" aria-label="Your upgraded analysis" />
      <div className="row gap wrap">
        {!done && <Button variant="secondary" disabled={!text.trim()} onClick={feedback}>{attempts ? 'Check again' : 'Get feedback'}</Button>}
        {!done && attempts > 0 && (
          <Button onClick={() => { const a = analyseWriting(text, { theme: item.theme, expect: item.expect }); setAnalysis(a); setDone(true); setShowLadder(true); onComplete?.(a.score); }}>
            I'm happy with this
          </Button>
        )}
        {!showLadder && <Button variant="ghost" onClick={() => setShowLadder(true)}>Show one route up the ladder</Button>}
      </div>
      {attempts > 0 && <p className="small muted">Revise and check as many times as you like — each check shows the next layer to add.</p>}
      <CoachFeedback analysis={analysis} />
      {showLadder && (
        <div className="mini-ladder">
          <p className="field-label">One route up the ladder</p>
          <ol>
            <li className="rung weak">“{item.weak}”</li>
            {item.progression.map((p, i) => <li key={i} className={`rung r${i + 1}`}>{p}</li>)}
          </ol>
          <p className="small">{item.explanation}</p>
        </div>
      )}
    </div>
  );
}
