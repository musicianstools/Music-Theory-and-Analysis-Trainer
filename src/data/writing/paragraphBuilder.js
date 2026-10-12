// PARAGRAPH BUILDER (Stage: WRITE)
// Fields use frames with numbered blanks: {0}, {1}. Scaffold levels in the UI:
//   Full scaffold (frames)  →  Prompts only  →  Independent (single box)
// Optional `suggestions` (array per blank) give beginners phrase banks to choose from.

const frames = (theme) => [
  { key: 'claim', label: 'Claim / Argument', frame: `The composer presents ${theme} as {0}.`, question: `What is your argument about ${theme}?` },
  { key: 'evidence', label: 'Musical evidence', frame: 'This is evident through {0}.', question: 'What specifically happens in the music?' },
  { key: 'effect', label: 'Musical effect', frame: 'This creates {0}.', question: 'What does that musical choice do?' },
  { key: 'meaning', label: 'Meaning', frame: 'This communicates {0} because {1}.', question: 'How does this communicate the theme — and why?' },
  { key: 'connection', label: 'Interconnectivity', frame: 'This is reinforced by {0}, which {1}.', question: 'How does another element support, contrast or develop this?' },
  { key: 'judgement', label: 'Evaluation', frame: 'Therefore, the composer effectively communicates {0}.', question: 'How effectively is the idea communicated?' },
];

export const paragraphQuestions = [
  {
    id: 'pb-001', type: 'paragraph', category: 'paragraph-builder', difficulty: 'beginner', defaultScaffold: 'full', skills: ['writing', 'argument'],
    theme: 'conflict', song: 'zombie',
    question: 'Analyse and evaluate how musical elements communicate the theme of conflict in "Zombie".',
    stimulus: 'The same four-chord progression repeats throughout; restrained verses give way to choruses of heavily distorted guitars and pounding drums; the vocal cracks into yodel-like breaks on "Zombie"; the song ends with wordless wailing over the same progression.',
    fields: frames('conflict').map((f) => ({
      ...f,
      suggestions: {
        claim: [['a relentless cycle of violence that is difficult to escape', 'a source of grief rather than glory']],
        evidence: [['the same four-chord progression repeating through every verse and chorus', 'choruses that crash in with heavily distorted guitars and pounding drums']],
        effect: [['a circular, trapped feeling with no sense of arrival', 'a sense of violence erupting again and again']],
        meaning: [['conflict as a cycle that cannot be broken', 'the violence as endless'], ['the music never moves somewhere new, however often it erupts', 'every outburst returns to the same place']],
        connection: [['the cracking, yodel-like breaks in the vocal', 'the wordless wailing of the final section'], ['turn each chorus into a cry of anguish', 'leave grief as the only response to the violence']],
        judgement: [['conflict as a relentless cycle that leaves only grief behind', 'conflict as violent, repetitive and unresolved']],
      }[f.key],
    })),
    model: 'The composer presents conflict as a relentless cycle of violence that is difficult to escape. This is evident through the same four-chord progression repeating through every verse and chorus, while the choruses crash in with heavily distorted guitars and pounding drums. This creates a circular, trapped feeling with no sense of arrival. This communicates conflict as a cycle that cannot be broken because the music never moves somewhere new, however often it erupts. This is reinforced by the cracking, yodel-like breaks in the vocal, which turn each chorus into a cry of anguish. Therefore, the composer effectively communicates conflict as a relentless cycle that leaves only grief behind.',
  },
  {
    id: 'pb-002', type: 'paragraph', category: 'paragraph-builder', difficulty: 'developing', defaultScaffold: 'full', skills: ['writing', 'argument'],
    theme: 'heartbreak', song: 'someone-like-you',
    question: 'Analyse how musical elements communicate heartbreak in "Someone Like You".',
    fields: frames('heartbreak'),
    model: 'The composer presents heartbreak as a private grief that cannot be contained. This is evident through the descending vocal phrases of the verses, sung in a low register over a bare, arpeggiated piano accompaniment. This creates a sense of quiet resignation and exposure. This communicates heartbreak as deeply personal because nothing in the texture shields or distracts from the voice. This is reinforced by the chorus\'s leap into a higher, strained register, which makes the restrained grief of the verses break through. Therefore, the composer effectively communicates heartbreak as a resignation that cannot stay contained.',
  },
  {
    id: 'pb-003', type: 'paragraph', category: 'paragraph-builder', difficulty: 'developing', defaultScaffold: 'prompts', skills: ['writing', 'argument'],
    theme: 'hope', song: 'fix-you',
    question: 'Analyse and evaluate how musical elements communicate hope in "Fix You".',
    fields: frames('hope'),
    model: 'The composer presents hope as emerging gradually from grief. This is evident through the opening\'s sustained organ chords and fragile falsetto, with the full band withheld for much of the song. This creates a long, hushed build in which anticipation slowly accumulates. This communicates hope as hard-won because it only arrives after a long period of stillness and vulnerability. This is reinforced by the entry of drums and electric guitar with a dramatic dynamic increase, which turns the accumulated tension into release. Therefore, the composer effectively communicates hope as something that grows out of, rather than replaces, grief.',
  },
  {
    id: 'pb-004', type: 'paragraph', category: 'paragraph-builder', difficulty: 'confident', defaultScaffold: 'prompts', skills: ['writing', 'argument'],
    theme: 'identity', song: 'what-was-i-made-for',
    question: 'Analyse how musical elements communicate identity in "What Was I Made For?".',
    fields: frames('identity'),
    model: 'The composer presents identity as fragile and unresolved. This is evident through the soft, breathy head-voice timbre over a sparse piano accompaniment. This creates an intimate, exposed quality, as if the singer is confiding rather than performing. This communicates identity as uncertain because the voice never projects confidently or claims the space around it. This is reinforced by the restrained dynamics, which withhold the climactic chorus expected of a ballad. Therefore, the composer effectively communicates identity as an inward, unfinished search.',
  },
  {
    id: 'pb-005', type: 'paragraph', category: 'paragraph-builder', difficulty: 'exam', defaultScaffold: 'free', skills: ['writing', 'argument'],
    theme: 'peace', song: 'imagine',
    question: 'Analyse and evaluate how musical elements communicate peace in "Imagine".',
    fields: frames('peace'),
    model: 'The composer presents peace as a simple, attainable ideal. This is evident through the repetitive piano chord pattern, played at a steady tempo with very little dynamic change. This creates a sense of calm stability, free from tension or disruption. This communicates peace as within reach because the music itself avoids drama and struggle. This is reinforced by the plain, largely syllabic vocal delivery, which keeps attention on the message rather than on display. Therefore, the composer effectively communicates peace as an ideal made to feel achievable through deliberate musical simplicity.',
  },
];
