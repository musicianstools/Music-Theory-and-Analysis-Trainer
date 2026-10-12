// COGNITIVE VERBS — the instruction words in tasks and exam questions.
// Shown as tooltips wherever they appear in a task prompt. Edit or add definitions freely.
// `match` is a regex source (case-insensitive, whole word) covering the forms that appear in prompts.

export const COGNITIVE_VERBS = [
  { verb: 'Analyse', match: 'analys(?:e|es|ing|is)', def: 'Examine something in detail: break it into its parts (the musical elements), identify how they work and relate to each other, and draw out what they mean.' },
  { verb: 'Evaluate', match: 'evaluat(?:e|es|ing|ion)', def: 'Make an evaluation of how effective or valuable something is, weighing strengths and limitations and supporting your evaluation with evidence.' },
  { verb: 'Discuss', match: 'discuss(?:es|ing)?', def: 'Examine an idea through argument: consider different points of view or interpretations, support each with evidence, and reach a conclusion.' },
  { verb: 'Explain', match: 'explain(?:s|ing)?', def: 'Make something clear by giving reasons or showing how and why it happens — for example, how a musical feature creates an effect.' },
  { verb: 'Identify', match: 'identif(?:y|ies|ying)', def: 'Recognise and name something precisely, such as a feature, element or term.' },
  { verb: 'Describe', match: 'describ(?:e|es|ing)', def: 'Give an account of the features or characteristics of something — what happens — without yet explaining why.' },
  { verb: 'Interpret', match: 'interpret(?:s|ing)?', def: 'Draw out meaning: say what the music suggests or represents in context, supported by evidence.' },
  { verb: 'Compare', match: 'compar(?:e|es|ing)', def: 'Show how two or more things are similar and how they are different.' },
  { verb: 'Contrast', match: 'contrast(?:s|ing)?', def: 'Show how two or more things are different, and why the difference matters.' },
  { verb: 'Justify', match: 'justif(?:y|ies|ying)', def: 'Give valid reasons and evidence that support a claim, decision or interpretation.' },
  { verb: 'Examine', match: 'examin(?:e|es|ing)', def: 'Investigate something closely and in detail, looking at how its parts work.' },
  { verb: 'Synthesise', match: 'synthesi[sz](?:e|es|ing)', def: 'Combine different ideas, elements or pieces of evidence into one coherent argument.' },
  { verb: 'Define', match: 'defin(?:e|es|ing)', def: 'State the precise meaning of a term.' },
  { verb: 'Recall', match: 'recall(?:s|ing)?', def: 'Remember and state facts, terms or examples you have learned — for example, as many words as you can for an idea.' },
  { verb: 'Apply', match: 'apply|applies|applying', def: 'Use knowledge or a rule in a new situation — for example, use interval rules to build a chord or spell a scale.' },
  { verb: 'Sequence', match: 'sequenc(?:e|es|ing)', def: 'Arrange ideas or events in a logical order, such as the steps of an argument or the parts of a paragraph.' },
  { verb: 'Classify', match: 'classif(?:y|ies|ying)', def: 'Sort things into categories according to shared features, such as matching terms to the sounds they describe.' },
  { verb: 'Develop', match: 'develop', def: 'In a task: expand an idea with more detail, reasons and evidence so it becomes fuller and more specific.' },
  { verb: 'To what extent', match: 'to what extent', def: 'Weigh the evidence for and against a claim, then make a clear evaluation of how far it is true — rarely completely or not at all.' },
];

export const VERB_REGEX = new RegExp(`\\b(${COGNITIVE_VERBS.map((v) => v.match).join('|')})\\b`, 'gi');

export function verbFor(word) {
  return COGNITIVE_VERBS.find((v) => new RegExp(`^(?:${v.match})$`, 'i').test(word));
}

// ---------------------------------------------------------------------------
// Which cognitive verbs does a task ENGAGE? Verbs named in the prompt come first, then the
// thinking the task type requires (even when the prompt does not name it).
const CATEGORY_VERBS = {
  listening: ['Identify'],
  synonyms: ['Define'],
  'feature-effect': ['Explain', 'Analyse'],
  'evidence-meaning': ['Interpret', 'Analyse'],
  upgrade: ['Analyse', 'Develop'],
  ladder: ['Analyse', 'Sequence'],
  interconnectivity: ['Analyse', 'Synthesise'],
  'feature-meaning': ['Interpret', 'Analyse'],
  relationships: ['Analyse', 'Compare'],
  'argument-builder': ['Analyse', 'Justify', 'Evaluate'],
  'sentence-builder': ['Analyse', 'Evaluate'],
  'paragraph-builder': ['Analyse', 'Synthesise', 'Evaluate'],
  teees: ['Analyse', 'Explain'],
};
const KIND_VERBS = {
  // Theme → Argument
  strongest: ['Evaluate'], upgrade: ['Develop'], specific: ['Develop', 'Justify'], direction: ['Analyse'], chain: ['Synthesise'], quality: ['Evaluate'], write: ['Interpret', 'Justify'], theme: ['Interpret'],
  // Practice Exam skills
  context: ['Describe'], preview: ['Synthesise'], thesis: ['Interpret', 'Justify'], topic: ['Analyse'], analysis: ['Analyse'], connection: ['Synthesise'], transition: ['Synthesise'], judgement: ['Evaluate'], paragraph: ['Analyse', 'Evaluate'], response: ['Analyse', 'Evaluate', 'Synthesise'],
};
const TYPE_VERBS = { synlist: ['Recall', 'Define'] };
const SUBTYPE_VERBS = { 'build-the-concept': ['Apply'], 'correct-the-mistake': ['Examine', 'Apply'], compare: ['Compare'], 'terminology-selection': ['Define'] };

export const verbInfo = (name) => COGNITIVE_VERBS.find((v) => v.verb === name);

/**
 * Cognitive verbs used as INSTRUCTIONS in a text: at the start of a sentence or clause
 * ("Analyse how…", "…: explain why"), joined to one ("Analyse and evaluate…"), or after "to"
 * ("…to justify your choice"). "To what extent" counts anywhere. A word used as a noun or
 * description ("a dynamic contrast", "the chorus develops") is not an instruction.
 * Returns [{ index, word, verb }].
 */
export function instructionVerbs(text) {
  if (typeof text !== 'string') return [];
  const out = [];
  for (const m of text.matchAll(VERB_REGEX)) {
    const v = verbFor(m[0]);
    if (!v) continue;
    const before = text.slice(0, m.index);
    const prev = out[out.length - 1];
    const ok = v.verb === 'To what extent'
      || /(^|[.!?:;—–(]\s*)$/.test(before)
      || /(?:,|\bthen)\s+$/.test(before)
      || (/\b(?:and|or),?\s+$/i.test(before) && prev && m.index - (prev.index + prev.word.length) <= 6)
      || (/\bto\s+$/i.test(before) && !/\b(?:close|due|next|up|similar|according|compared|contrast|equal|leads?|moves?|returns?)\s+to\s+$/i.test(before));
    if (ok) out.push({ index: m.index, word: m[0], verb: v.verb });
  }
  return out;
}

/** Cognitive verbs a text instructs, as canonical names, in order of appearance. */
export function verbsInText(text) {
  return instructionVerbs(text).map((x) => x.verb);
}

export function verbsForItem(item) {
  if (!item) return [];
  const fromText = [item.prompt, item.question].flatMap(verbsInText); // not examQuestion: that is context for the whole exam, not this task
  const derived = [...(TYPE_VERBS[item.type] || SUBTYPE_VERBS[item.subtype] || KIND_VERBS[item.kind] || CATEGORY_VERBS[item.category]
    || (item.type === 'short' ? ['Analyse'] : ['Identify']))];
  if (item.type === 'order' && !derived.includes('Sequence')) derived.push('Sequence');
  if (item.type === 'match' && !derived.includes('Classify')) derived.push('Classify');
  return [...new Set([...fromText, ...derived])].slice(0, 4);
}
