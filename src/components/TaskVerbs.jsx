// "Cognitive verbs in this task" — chips with a definition tooltip (hover, tap or keyboard focus).
import { useId } from 'react';
import { verbInfo } from '../data/cognitiveVerbs.js';

function VerbChip({ name }) {
  const id = useId();
  const v = verbInfo(name);
  if (!v) return null;
  return (
    <span className="cv verb-chip" tabIndex={0} aria-describedby={id}>
      {v.verb}
      <span className="cv-tip" role="tooltip" id={id}><strong>{v.verb}</strong> — {v.def}</span>
    </span>
  );
}

export default function TaskVerbs({ verbs, label = 'Cognitive verbs' }) {
  if (!verbs?.length) return null;
  return (
    <div className="task-verbs">
      <span className="task-verbs-label">{label}</span>
      {verbs.map((v) => <VerbChip key={v} name={v} />)}
      <span className="sr-only">Focus a verb to hear its definition.</span>
    </div>
  );
}
