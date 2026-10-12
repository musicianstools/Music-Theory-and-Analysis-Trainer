// LISTENING QUESTIONS (Stage: HEAR)
// Audio formats supported on any question:
//   audio: { synth: 'recipeName' }                       → synthesised in the browser (utils/audioSynth.js)
//   audio: { src: 'audio/my-file.mp3', start: 12, end: 31 }  → a real recording in /public/audio
//   audioCompare: [ {label:'Excerpt A', ...audio}, {label:'Excerpt B', ...audio} ]
// `subtype` labels the listening skill: element | feature | compare | terminology | evidence-hunt

export const listeningQuestions = [
  {
    id: 'lis-001', type: 'mcq', subtype: 'element', category: 'listening', difficulty: 'beginner', skills: ['listening', 'terminology'],
    audio: { synth: 'crescendoStrong' },
    prompt: 'Identify the element: which musical element changes most noticeably in this excerpt?',
    options: [
      { id: 'a', text: 'Dynamics' },
      { id: 'b', text: 'Pitch', feedback: 'The same chord repeats throughout — the pitch does not change.' },
      { id: 'c', text: 'Tempo', feedback: 'The chords are evenly spaced — the speed stays the same.' },
      { id: 'd', text: 'Timbre', feedback: 'The same sound source is used throughout.' },
    ],
    correctAnswer: 'a',
    explanation: 'The repeated chord stays on the same pitch at a steady tempo, but grows steadily louder: a crescendo. Isolating what changes from what stays the same is the first step of listening analysis.',
  },
  {
    id: 'lis-002', type: 'mcq', subtype: 'compare', category: 'listening', difficulty: 'beginner', skills: ['listening'],
    audioCompare: [{ label: 'Excerpt A', synth: 'crescendoSubtle' }, { label: 'Excerpt B', synth: 'crescendoStrong' }],
    prompt: 'Compare: which excerpt uses a more prominent crescendo?',
    options: [
      { id: 'a', text: 'Excerpt A', feedback: 'Listen again: A grows only slightly louder; B starts very quietly and ends much louder.' },
      { id: 'b', text: 'Excerpt B' },
      { id: 'c', text: 'They are the same', feedback: 'Both crescendo, but the range of change is very different.' },
    ],
    correctAnswer: 'b',
    explanation: 'Excerpt B covers a much wider dynamic range (roughly pianissimo to fortissimo), so its crescendo is more prominent. In writing, the size of a change is useful evidence: "a dramatic crescendo" vs "a slight swell".',
  },
  {
    id: 'lis-003', type: 'mcq', subtype: 'terminology', category: 'listening', difficulty: 'beginner', skills: ['listening', 'terminology'],
    audio: { synth: 'staccato' },
    prompt: 'Which term best describes the articulation you hear?',
    options: [
      { id: 'a', text: 'Legato', feedback: 'Legato notes would join smoothly. Here there are clear gaps between notes.' },
      { id: 'b', text: 'Staccato' },
      { id: 'c', text: 'Tenuto', feedback: 'Tenuto notes are held for their full length.' },
      { id: 'd', text: 'Glissando', feedback: 'A glissando slides continuously between pitches.' },
    ],
    correctAnswer: 'b',
    explanation: 'Each note is short and detached, with silence between: staccato. Compare it with the legato version in the next question.',
  },
  {
    id: 'lis-004', type: 'mcq', subtype: 'terminology', category: 'listening', difficulty: 'beginner', skills: ['listening', 'terminology'],
    audio: { synth: 'legato' },
    prompt: 'The same melody again. Which term best describes the articulation now?',
    options: [
      { id: 'a', text: 'Legato' },
      { id: 'b', text: 'Staccato', feedback: 'There are no gaps now — the notes join smoothly.' },
      { id: 'c', text: 'Accent', feedback: 'No note is emphasised above the others.' },
      { id: 'd', text: 'Pizzicato', feedback: 'Pizzicato means plucking a string instrument.' },
    ],
    correctAnswer: 'a',
    explanation: 'The notes connect smoothly with no gaps: legato. Same pitches, same rhythm — only articulation changed, yet the character is quite different. That is why articulation is worth writing about.',
  },
  {
    id: 'lis-005', type: 'mcq', subtype: 'feature', category: 'listening', difficulty: 'developing', skills: ['listening'],
    audio: { synth: 'syncopation' },
    prompt: 'Identify the feature: listen to the chords against the clicking beat. What rhythmic feature can you hear?',
    options: [
      { id: 'a', text: 'Syncopation — the chords fall between the beats' },
      { id: 'b', text: 'Straight crotchets on every beat', feedback: 'The click marks the beat; the chords avoid landing with it.' },
      { id: 'c', text: 'Triplets', feedback: 'Triplets divide a beat into three — here the chords sit on the "and" between beats.' },
      { id: 'd', text: 'Rallentando', feedback: 'The tempo stays steady.' },
    ],
    correctAnswer: 'a',
    explanation: 'The clicks mark the beat; the chords land on the off-beats ("and"), displacing the accent: syncopation. Listen for the tension between the pulse and the accents.',
  },
  {
    id: 'lis-006', type: 'mcq', subtype: 'feature', category: 'listening', difficulty: 'developing', skills: ['listening', 'terminology'],
    audio: { synth: 'majorThenMinor' },
    prompt: 'You hear two chords, each arpeggiated then played together. How does the second differ from the first?',
    options: [
      { id: 'a', text: 'The first is major; the second is minor (its middle note is lowered).' },
      { id: 'b', text: 'The first is minor; the second is major.', feedback: 'Listen to the middle note: it drops by a semitone in the second chord, which makes it minor.' },
      { id: 'c', text: 'The second chord is in a different octave.', feedback: 'Both start on the same note.' },
      { id: 'd', text: 'They are identical.', feedback: 'One note changes — the third.' },
    ],
    correctAnswer: 'a',
    explanation: 'The third of the chord drops a semitone (E → E♭), turning C major into C minor. Remember: this changes the colour, but what that colour means depends on context.',
  },
  {
    id: 'lis-007', type: 'mcq', subtype: 'evidence-hunt', category: 'listening', difficulty: 'developing', skills: ['listening', 'evidence'],
    audio: { synth: 'textureChange' },
    prompt: 'Evidence hunt: watch the timer while you listen. At roughly what point does the texture change?',
    options: [
      { id: 'a', text: 'Around 1 second', feedback: 'At 1 second only the melody is playing.' },
      { id: 'b', text: 'Around 3–4 seconds' },
      { id: 'c', text: 'Around 6 seconds', feedback: 'By 6 seconds the accompaniment has already been playing for a while.' },
      { id: 'd', text: 'The texture does not change', feedback: 'Listen for the chords and bass that join the melody.' },
    ],
    correctAnswer: 'b',
    explanation: 'At about 3.5 seconds, chords and a bass line join the solo melody: the texture changes from monophonic to homophonic. Locating a change precisely ("when the accompaniment enters at…") makes evidence far more convincing.',
  },
  {
    id: 'lis-008', type: 'mcq', subtype: 'terminology', category: 'listening', difficulty: 'confident', skills: ['listening', 'terminology'],
    audio: { synth: 'imperfectCadence' },
    prompt: 'Listen to how the progression ends. Which cadence do you hear?',
    options: [
      { id: 'a', text: 'Perfect cadence (V – I)', feedback: 'A perfect cadence would end on the home chord and sound finished. This sounds open.' },
      { id: 'b', text: 'Imperfect cadence (ends on V)' },
      { id: 'c', text: 'Plagal cadence (IV – I)', feedback: 'A plagal cadence also ends on the home chord.' },
      { id: 'd', text: 'Interrupted cadence (V – vi)', feedback: 'An interrupted cadence moves away from V to a surprising chord; here the music stops on V.' },
    ],
    correctAnswer: 'b',
    explanation: 'The progression I – IV – I – V stops on the dominant, so it sounds unfinished: an imperfect cadence. In analysis this can support ideas like uncertainty, questioning or anticipation.',
  },
  {
    id: 'lis-009', type: 'mcq', subtype: 'feature', category: 'listening', difficulty: 'confident', skills: ['listening', 'terminology'],
    audio: { synth: 'accelerando' },
    prompt: 'What happens to the tempo in this excerpt?',
    options: [
      { id: 'a', text: 'Rallentando — it gradually slows', feedback: 'The gaps between notes shrink, so it is getting faster.' },
      { id: 'b', text: 'Accelerando — it gradually speeds up' },
      { id: 'c', text: 'It stays at a steady tempo', feedback: 'Listen to the spacing: it narrows steadily.' },
      { id: 'd', text: 'Rubato — it fluctuates freely', feedback: 'Rubato pushes and pulls; this change is consistent in one direction.' },
    ],
    correctAnswer: 'b',
    explanation: 'The notes get steadily closer together: accelerando. Depending on context, an accelerando can create excitement, panic, urgency or loss of control.',
  },
];
