// LEVEL 5 ("Arnold Schoenberg has entered the chat") — turns any task into its no-help version:
// multiple choice becomes "write it yourself", hints and starters disappear, scaffolds are removed.
// Theory and listening sets get Level 5 questions from the drills at their hardest settings instead (see generators.js).
let n = 0;
const uid = (p) => `x-${p}-${Date.now().toString(36)}-${(n++).toString(36)}`;
const NOTE = ' (Level 5: no options, no hints — write it yourself.)';

const ASK = {
  'feature-effect': 'Explain this feature: what effect does it create, and what does it suggest about the theme?',
  'evidence-meaning': 'Interpret this evidence: what effect does it create, and what could it suggest about the theme?',
  'feature-meaning': 'Connect this feature to meaning and to the theme in one or two sentences.',
  relationships: 'Write a sentence that shows how these elements relate, and what they achieve together.',
  'theme-to-argument': 'Write the strongest argument you can.',
  synonyms: 'Write the strongest analytical sentence you can.',
  upgrade: 'Write the strongest version you can.',
};
function expertPrompt(item, theme) {
  const rest = item.prompt.replace(/Which (?:is|one|explanation|interpretation|sentence|argument|revision|response)[^?]*\?/i, '').trim();
  const ask = rest.length > 25 ? rest : `${rest ? rest + ' ' : ''}${ASK[item.category] || 'Write the strongest answer you can.'}`;
  return `${ask}${theme && !/theme/i.test(ask) ? ` Theme: ${theme}.` : ''}${NOTE}`;
}

export function toExpert(item) {
  if (!item) return null;
  const base = { generated: true, difficulty: 'expert', id: uid(item.id) };
  switch (item.type) {
    case 'short':
      return { ...item, ...base, hints: undefined, starter: undefined, prompt: item.prompt + ' (Level 5: no hints or starter.)', minWords: Math.max(item.minWords || 0, 18) };
    case 'mcq': {
      const correct = item.options?.find((o) => o.id === item.correctAnswer)?.text;
      if (!correct || correct.length < 50) return null; // short answers (terms, labels) do not make good writing tasks
      const isArg = item.category === 'theme-to-argument';
      const theme = item.theme || item.context?.theme;
      return {
        ...item, ...base, type: 'short', mode: isArg ? 'argument' : 'analysis', options: undefined, correctAnswer: undefined, followUp: undefined,
        theme, prompt: expertPrompt(item, theme),
        expect: theme ? ['terminology', 'effect', 'meaning', 'theme'] : ['terminology', 'effect', 'meaning'],
        models: [{ text: correct, why: item.explanation || '' }],
      };
    }
    case 'upgrade':
      return {
        ...item, ...base, type: 'short', mode: 'analysis', progression: undefined, facts: undefined,
        prompt: `Upgrade the weak statement into strong analysis in one go.${item.facts?.length ? ` Facts you can use: ${item.facts.join(' ')}` : ''}${NOTE}`,
        expect: item.expect, models: [{ text: item.progression[item.progression.length - 1], why: item.explanation || '' }],
      };
    case 'builder': {
      const model = item.model || item.steps.map((s) => s.fixed ? '' : s.suggestions?.[0]).filter(Boolean).map((t) => (/[.!?]$/.test(t) ? t : t + '.')).join(' ');
      return { ...item, ...base, type: 'short', mode: 'analysis', steps: undefined, prompt: `${item.prompt} Write the whole argument in one go — claim, evidence, effect, meaning, connection and evaluation.${NOTE}`, expect: item.expect || ['terminology', 'evidence', 'effect', 'meaning', 'theme', 'connection'], models: [{ text: model, why: item.explanation || 'Every link of the argument chain, in one paragraph.' }] };
    }
    case 'scaffold':
    case 'direction':
      if (!item.model) return null;
      return { ...item, ...base, type: 'short', mode: item.category === 'theme-to-argument' ? 'argument' : 'analysis', blanks: undefined, elements: undefined, frame: undefined,
        prompt: `${item.prompt}${item.argument ? ` Argument: "${item.argument}"` : ''}${NOTE}`, expect: item.expect || ['terminology', 'effect', 'meaning'], models: [{ text: item.model, why: item.explanation || '' }], needDevelop: item.category === 'theme-to-argument' };
    case 'connect':
      return { ...item, ...base, defaultLevel: item.modelThree ? 5 : 4 };
    case 'paragraph':
      return { ...item, ...base, defaultScaffold: 'free' };
    case 'teees':
      return { ...item, ...base, forceWhole: true };
    case 'synlist':
      return { ...item, ...base, target: item.target + 4 };
    default:
      return null;
  }
}

/** Up to `count` Level 5 versions of random items from a set. */
export function expertItems(items, count = 3) {
  const pool = [...items].sort(() => Math.random() - 0.5);
  const out = [];
  for (const it of pool) {
    if (out.length >= count) break;
    const x = toExpert(it);
    if (x) out.push(x);
  }
  return out;
}
