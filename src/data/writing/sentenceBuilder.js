// SENTENCE BUILDER (Stage: WRITE) — each task builds one analytical sentence for a Practice Exam question.
// FEATURE + SPECIFIC EVIDENCE + EFFECT + MEANING + THEME, using the reusable 'scaffold' exercise.
import { responsePrompts } from './responsePrompts.js';
import { examParts } from './examParts.js';

const q = (id) => responsePrompts.find((p) => p.id === id).question;
const thesis = (id) => examParts[id].thesis;

export const sentenceBuilderQuestions = [
  {
    id: 'sb-001', type: 'scaffold', category: 'sentence-builder', difficulty: 'beginner', skills: ['writing', 'effect'],
    theme: 'heartbreak', song: 'someone-like-you', examQuestion: q('rp-001'), argument: thesis('rp-001'),
    prompt: 'Build a sentence for key moment 1 (the opening verse).',
    frame: 'In the {0}, the {1} creates {2}, reinforcing the presentation of heartbreak as {3}.',
    blanks: [
      { label: 'Where', placeholder: 'opening verse', suggestions: [
        { text: 'opening verse', quality: 'strong', note: 'Locates the moment precisely.' },
        { text: 'song', quality: 'weak', note: 'Too general — which part of the song?' },
      ] },
      { label: 'Feature + specific evidence', placeholder: 'low, falling vocal phrases', suggestions: [
        { text: 'low, falling vocal phrases over a bare arpeggiated piano', quality: 'strong', note: 'Terminology plus specific detail.' },
        { text: 'melody', quality: 'weak', note: 'Names an element but not what happens in it.' },
        { text: 'sad singing', quality: 'weak', note: '"Sad" is an interpretation, not evidence.' },
      ] },
      { label: 'Effect', placeholder: 'a sense of restraint', suggestions: [
        { text: 'a sense of restraint and sinking resignation', quality: 'strong', note: 'A precise effect.' },
        { text: 'sadness', quality: 'ok', note: 'An effect, but broad. What kind of sadness?' },
      ] },
      { label: 'Meaning (your claim)', placeholder: 'a private grief', suggestions: [
        { text: 'a private grief the speaker is trying to accept', quality: 'strong', note: 'Matches the thesis and is arguable.' },
        { text: 'sad', quality: 'weak', note: 'Repeats the obvious.' },
      ] },
    ],
    expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme'],
    model: 'In the opening verse, the low, falling vocal phrases over a bare arpeggiated piano create a sense of restraint and sinking resignation, reinforcing the presentation of heartbreak as a private grief the speaker is trying to accept.',
    explanation: 'Every analytical sentence in your exam response can follow this shape: where → evidence → effect → meaning.',
  },
  {
    id: 'sb-002', type: 'scaffold', category: 'sentence-builder', difficulty: 'beginner', skills: ['writing', 'effect'],
    theme: 'hope', song: 'fix-you', examQuestion: q('rp-002'), argument: thesis('rp-002'),
    prompt: 'Build a sentence for key moment 2 (the entry of the full band).',
    frame: 'When the {0}, the {1} creates {2}, presenting hope as {3}.',
    blanks: [
      { label: 'Where / when', placeholder: 'full band finally enters', suggestions: [
        { text: 'full band finally enters', quality: 'strong', note: 'Locates the moment and hints at the delay.' },
      ] },
      { label: 'Feature + specific evidence', placeholder: 'dramatic dynamic increase', suggestions: [
        { text: 'dramatic dynamic increase and thickening texture', quality: 'strong', note: 'Two precise features.' },
        { text: 'drums', quality: 'weak', note: 'An instrument, not what it does.' },
      ] },
      { label: 'Effect', placeholder: 'a cathartic release', suggestions: [
        { text: 'a cathartic release of long-held tension', quality: 'strong', note: 'Explains why the moment feels powerful.' },
        { text: 'excitement', quality: 'ok', note: 'Possible, but does "excitement" fit a song about grief?' },
      ] },
      { label: 'Meaning (your claim)', placeholder: 'something that gathers strength slowly', suggestions: [
        { text: 'something that gathers strength slowly', quality: 'strong', note: 'Links to the thesis.' },
      ] },
    ],
    expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme'],
    model: 'When the full band finally enters, the dramatic dynamic increase and thickening texture create a cathartic release of long-held tension, presenting hope as something that gathers strength slowly.',
    explanation: 'Start with "when" or "in the…" so the reader always knows where the evidence comes from.',
  },
  {
    id: 'sb-003', type: 'scaffold', category: 'sentence-builder', difficulty: 'developing', skills: ['writing', 'effect'],
    theme: 'change', song: 'man-in-the-mirror', examQuestion: q('rp-003'), argument: thesis('rp-003'),
    prompt: 'Build a sentence for key moment 3 (the final section). Fewer suggestions — write your own where you can.',
    frame: 'In the {0}, the {1} {2}, which {3} change as {4}.',
    blanks: [
      { label: 'Where', placeholder: 'final section', suggestions: [] },
      { label: 'Feature + specific evidence', placeholder: 'upward semitone modulation', suggestions: [] },
      { label: 'Effect (a verb phrase)', placeholder: 'lifts the music into a brighter register', suggestions: [] },
      { label: 'Analytical verb', placeholder: 'presents', suggestions: [
        { text: 'presents', quality: 'strong', note: 'Introduces how the theme is shown.' },
        { text: 'reinforces the presentation of', quality: 'strong', note: 'Shows it strengthens an earlier idea.' },
        { text: 'is about', quality: 'weak', note: 'Not an analytical relationship.' },
      ] },
      { label: 'Meaning (your claim)', placeholder: 'gathering collective momentum', suggestions: [] },
    ],
    expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme'],
    model: 'In the final section, the upward semitone modulation lifts the music into a brighter, more intense register, which presents change as gathering collective momentum.',
    explanation: 'The analytical verb matters: "presents" introduces an idea, "reinforces" strengthens one you have already established.',
  },
  {
    id: 'sb-004', type: 'scaffold', category: 'sentence-builder', difficulty: 'confident', skills: ['writing', 'effect', 'interconnectivity'],
    theme: 'acceptance', song: 'let-it-be', examQuestion: q('rp-004'), argument: thesis('rp-004'),
    prompt: 'Build a connected sentence for key moment 1 (the opening): two elements working together.',
    frame: 'In the {0}, the {1} establishes {2}, while the {3} {4}. Together, these elements present acceptance as {5}.',
    blanks: [
      { label: 'Where', placeholder: 'opening', suggestions: [] },
      { label: 'Element 1 + evidence', placeholder: 'stable, repeating I–V–vi–IV progression', suggestions: [] },
      { label: 'Effect 1', placeholder: 'a sense of solemn calm', suggestions: [] },
      { label: 'Element 2 + evidence', placeholder: 'hymn-like piano timbre', suggestions: [] },
      { label: 'Effect 2', placeholder: 'adds warmth and gospel associations', suggestions: [] },
      { label: 'Combined meaning', placeholder: 'a source of comfort rather than defeat', suggestions: [] },
    ],
    expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme', 'connection'],
    model: 'In the opening, the stable, repeating I–V–vi–IV progression establishes a sense of solemn calm, while the hymn-like piano timbre adds warmth and gospel associations. Together, these elements present acceptance as a source of comfort rather than defeat.',
    explanation: 'Two features + what each does + what they achieve together — exactly what interconnectivity sentences need in the exam.',
  },
  {
    id: 'sb-005', type: 'scaffold', category: 'sentence-builder', difficulty: 'exam', skills: ['writing', 'effect', 'interconnectivity', 'argument'],
    theme: 'triumph', song: 'we-are-the-champions', examQuestion: q('rp-005'), argument: thesis('rp-005'),
    prompt: 'Build the final evaluation sentence for this response: ARGUMENT + EVIDENCE + INTERCONNECTIVITY + EVALUATION.',
    frame: 'Ultimately, the contrast between {0} and {1} {2} presents triumph as {3}.',
    blanks: [
      { label: 'Moment / evidence 1', placeholder: 'the restrained, piano-led verses', suggestions: [] },
      { label: 'Moment / evidence 2', placeholder: 'the fully layered choruses', suggestions: [] },
      { label: 'Evaluation adverb', placeholder: 'effectively', suggestions: [] },
      { label: 'Your final argument', placeholder: 'a collective celebration earned through struggle', suggestions: [] },
    ],
    expect: ['terminology', 'evidence', 'meaning', 'theme', 'connection', 'judgement'],
    model: 'Ultimately, the contrast between the restrained, piano-led verses and the fully layered choruses effectively presents triumph as a collective celebration earned through struggle.',
    explanation: 'A final evaluation looks across the whole response — it names the contrast or journey, evaluates it and restates the argument.',
  },
];
