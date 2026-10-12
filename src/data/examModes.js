// EXAM MODE configuration. `objective` picks auto-marked questions from practice sets;
// `writing` adds a written task. Edit counts, timings and pools here.

export const EXAM_MODES = [
  {
    id: 'quick', title: 'Quick Practice', minutes: 10,
    blurb: '8 mixed questions across theory, notation, score reading and analysis. A low-stakes warm-up.',
    // `mix` guarantees some notation (staff) and score-reading questions in every paper.
    objective: { pools: ['theory', 'synonyms', 'feature-effect', 'evidence-meaning', 'theme-argument'], count: 8, mix: { notation: 2, score: 1 } },
  },
  {
    id: 'theory', title: 'Theory Test', minutes: 15,
    blurb: '12 timed theory and terminology questions.',
    objective: { pools: ['theory'], count: 12 },
  },
  {
    id: 'listening', title: 'Listening Test', minutes: 12,
    blurb: 'Identify elements, features and changes by ear.',
    objective: { pools: ['listening'], count: 9 },
  },
  {
    id: 'analysis', title: 'Analysis Challenge', minutes: 12,
    blurb: 'One short analytical paragraph on a set song.',
    writing: { kind: 'paragraph' },
  },
  {
    id: 'theme', title: 'Theme → Argument Challenge', minutes: 6,
    blurb: 'Receive a theme. Develop a specific, arguable claim with a musical direction.',
    writing: { kind: 'theme' },
  },
  {
    id: 'practice-exam', title: 'Practice Exam', minutes: 120, planningMinutes: 20,
    blurb: 'A full written exam under real conditions: 20 minutes planning, then 2 hours to write an introduction and three key-moment paragraphs. A new question every attempt.',
    writing: { kind: 'response' },
  },
  {
    id: 'full', title: 'Full Practice', minutes: 35,
    blurb: 'Theory and listening questions, then an analytical paragraph.',
    objective: { pools: ['theory', 'listening'], count: 9, split: { theory: 6, listening: 3 } },
    writing: { kind: 'paragraph' },
  },
];

export const getExamMode = (id) => EXAM_MODES.find((m) => m.id === id);
