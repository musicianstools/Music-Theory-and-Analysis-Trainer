// THE ANALYSIS LADDER — visual examples + "climb the ladder" ordering practice.

export const LADDER_RUNGS = [
  { key: 'identify', label: 'Identify', question: 'What do you notice?' },
  { key: 'describe', label: 'Describe', question: 'What exactly happens — with musical terms?' },
  { key: 'explain', label: 'Explain', question: 'What does that musical choice do?' },
  { key: 'interpret', label: 'Interpret', question: 'What feeling, sense or idea does it create?' },
  { key: 'connect', label: 'Connect', question: 'How does it link to the theme?' },
  { key: 'argue', label: 'Argue', question: 'What is your overall claim, and how effectively is it achieved?' },
];

export const ladderExamples = [
  {
    id: 'ladder-dynamics',
    title: 'Dynamics · Conflict',
    rungs: {
      identify: 'The dynamics increase.',
      describe: 'The dynamics gradually increase from piano to forte.',
      explain: 'The crescendo increases intensity.',
      interpret: 'This creates a sense of growing emotional tension.',
      connect: 'This reinforces the presentation of conflict as increasingly intense.',
      argue: 'Through the gradual crescendo, the composer effectively presents conflict as an increasingly overwhelming experience.',
    },
  },
  {
    id: 'ladder-melody',
    title: 'Melody · Heartbreak',
    rungs: {
      identify: 'The melody goes down.',
      describe: 'Each vocal phrase descends stepwise to a low note at its ending.',
      explain: 'The repeated falling contour makes each phrase sink rather than lift.',
      interpret: 'This creates a sense of resignation, as though each attempt to rise fails.',
      connect: 'This reinforces the presentation of heartbreak as something the speaker cannot rise above.',
      argue: 'Through the persistently descending phrases, the composer convincingly presents heartbreak as a weight that pulls the speaker back down each time.',
    },
  },
  {
    id: 'ladder-texture',
    title: 'Texture · Isolation',
    rungs: {
      identify: 'The instruments stop.',
      describe: 'In the bridge, the texture reduces suddenly to an unaccompanied solo voice.',
      explain: 'The monophonic texture exposes the voice with nothing to support it.',
      interpret: 'This creates a stark sense of vulnerability and emptiness.',
      connect: 'This emphasises the speaker\'s isolation from the community heard earlier in the full chorus.',
      argue: 'By stripping the texture back to a lone voice, the composer powerfully presents isolation as a sudden, exposing loss of support.',
    },
  },
];

// Ordering practice: put the rungs in order (generated from the examples above).
export const ladderQuestions = ladderExamples.map((ex, i) => ({
  id: `ladder-00${i + 1}`,
  type: 'order',
  category: 'ladder',
  difficulty: i === 0 ? 'beginner' : 'developing',
  skills: ['effect', 'evidence'],
  prompt: `Climb the ladder (${ex.title}): arrange these statements from IDENTIFY (bottom) to ARGUE (top).`,
  items: LADDER_RUNGS.map((r) => ({ id: r.key, text: ex.rungs[r.key] })),
  correctOrder: LADDER_RUNGS.map((r) => r.key),
  explanation: 'Identify → Describe → Explain → Interpret → Connect → Argue. Each rung keeps everything from the rung below and adds one new layer of thinking.',
}));
