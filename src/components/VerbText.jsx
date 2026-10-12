// Renders task text with cognitive verbs (analyse, evaluate, discuss…) marked up as tooltips.
// Hover, keyboard focus or tap shows the definition. Each verb is marked once per text, and only where it is an instruction.
import { useId } from 'react';
import { instructionVerbs, verbFor } from '../data/cognitiveVerbs.js';

function Verb({ word }) {
  const id = useId();
  const v = verbFor(word);
  if (!v) return word;
  return (
    <span className="cv" tabIndex={0} aria-describedby={id}>
      {word}
      <span className="cv-tip" role="tooltip" id={id}>
        <strong>{v.verb}</strong> — {v.def}
      </span>
    </span>
  );
}

export default function VerbText({ text }) {
  if (typeof text !== 'string') return text ?? null;
  // Only verbs used as instructions are marked (not "a dynamic contrast"); each verb once.
  const parts = [];
  const seen = new Set();
  let last = 0;
  for (const { index, word, verb } of instructionVerbs(text)) {
    if (seen.has(verb)) continue;
    seen.add(verb);
    if (index > last) parts.push(text.slice(last, index));
    parts.push(<Verb key={index} word={word} />);
    last = index + word.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
