// CONNECT (Stage 4) — two strands of "I can connect the feature to meaning and other elements."
//   featureMeaningQuestions: link a musical feature (and its effect) to meaning and to the theme.
//   relationshipQuestions:   say HOW elements relate — reinforce, contrast or develop — with linking language.
// Item formats are the same as every other set (see README → Exercise types).

const fm = { category: 'feature-meaning', skills: ['interconnectivity', 'effect'] };
const rel = { category: 'relationships', skills: ['interconnectivity'] };

export const featureMeaningQuestions = [
  {
    ...fm, id: 'fm-001', type: 'mcq', difficulty: 'beginner', song: 'someone-like-you', theme: 'heartbreak',
    prompt: 'In the opening verse of "Someone Like You", the vocal phrases fall at their endings. Which sentence connects this feature to meaning?',
    options: [
      { id: 'a', text: 'The phrases fall at their endings.', feedback: 'This only describes the feature. Connecting means saying what it suggests.' },
      { id: 'b', text: 'The falling phrase endings create a sense of sinking resignation, suggesting a speaker who keeps losing the strength to move on.' },
      { id: 'c', text: 'The melody is sad because it goes down.', feedback: '"Down = sad" is a formula. Say what the falling shape does and what it suggests in this song.' },
      { id: 'd', text: 'Adele is a very emotional singer.', feedback: 'A comment about the performer, not a connection between a feature and meaning.' },
    ],
    correctAnswer: 'b',
    explanation: 'Feature (falling phrase endings) → effect (sinking resignation) → meaning (a speaker who cannot move on). Each step adds one layer.',
  },
  {
    ...fm, id: 'fm-002', type: 'mcq', difficulty: 'beginner', song: 'imagine', theme: 'peace',
    prompt: '"Imagine" keeps a narrow dynamic range and a steady tempo throughout. What does this most convincingly suggest about peace?',
    options: [
      { id: 'a', text: 'That peace is boring.', feedback: 'A value judgement, not an interpretation supported by how the features work.' },
      { id: 'b', text: 'That peace is calm and attainable — nothing in the music struggles or strains to reach it.' },
      { id: 'c', text: 'That the song is in a major key.', feedback: 'True of the song, but it does not connect the features named in the question to meaning.' },
      { id: 'd', text: 'That peace is impossible.', feedback: 'The music offers no struggle or instability to support this reading.' },
    ],
    correctAnswer: 'b',
    explanation: 'Stability in dynamics and tempo removes any sense of effort, so the music presents peace as something reachable rather than fought for.',
  },
  {
    ...fm, id: 'fm-003', type: 'mcq', difficulty: 'developing', song: 'fix-you', theme: 'hope',
    prompt: 'In "Fix You", drums and electric guitar enter only after a long, quiet build. Which interpretation best links this to the theme of hope?',
    options: [
      { id: 'a', text: 'The late entry of the full band makes hope feel earned: it arrives only after a long stretch of fragility, as though it has to grow out of grief.' },
      { id: 'b', text: 'The band comes in to make the song louder.', feedback: 'Describes the effect on volume but stops before meaning or theme.' },
      { id: 'c', text: 'Drums always represent hope.', feedback: 'No instrument carries a fixed meaning. The meaning comes from how it is used here.' },
      { id: 'd', text: 'The song is about hope because the title is "Fix You".', feedback: 'Evidence from the title, not from the music.' },
    ],
    correctAnswer: 'a',
    explanation: 'The timing of the entry, not just the entry itself, carries the meaning: hope is delayed, so it feels hard-won.',
  },
  {
    ...fm, id: 'fm-004', type: 'mcq', difficulty: 'developing', song: 'man-in-the-mirror', theme: 'change',
    prompt: 'Near the end of "Man in the Mirror", the key shifts up a semitone. Which sentence connects this feature to the theme of change most precisely?',
    options: [
      { id: 'a', text: 'The key change makes it more exciting.', feedback: '"Exciting" is vague and there is no link to change.' },
      { id: 'b', text: 'There is a modulation up a semitone.', feedback: 'Accurate terminology, but no effect or meaning.' },
      { id: 'c', text: 'The upward semitone modulation lifts the whole song onto a higher level, enacting the change the lyrics call for: the music itself refuses to stay where it started.' },
      { id: 'd', text: 'Key changes are common in pop songs.', feedback: 'A generalisation about genre, not this song.' },
    ],
    correctAnswer: 'c',
    explanation: 'The strongest connections show the music doing what the theme describes — here, the music literally changes level.',
  },
  {
    ...fm, id: 'fm-005', type: 'mcq', difficulty: 'confident', song: 'someone-like-you', theme: 'acceptance',
    prompt: '"Someone Like You" is in a major key. Which reading avoids the "major = happy" formula and connects the tonality to meaning?',
    options: [
      { id: 'a', text: 'The major key shows the song is happy.', feedback: 'This is the formula the question warns against, and it ignores the falling phrases and strained chorus.' },
      { id: 'b', text: 'The major key is a mistake for a sad song.', feedback: 'Treats a deliberate choice as an error instead of interpreting it.' },
      { id: 'c', text: 'Combined with the falling phrases, the major tonality sounds less like joy and more like warm, bittersweet acceptance of a loss already lived through.' },
      { id: 'd', text: 'The major key is not important.', feedback: 'Every musical choice can be interpreted; dismissing it loses evidence.' },
    ],
    correctAnswer: 'c',
    explanation: 'Meaning comes from context: the same tonality can suggest joy, nostalgia or acceptance depending on what surrounds it.',
  },
  {
    ...fm, id: 'fm-006', type: 'match', difficulty: 'beginner',
    prompt: 'Match each musical feature to the meaning it most convincingly suggests in context.',
    pairs: [
      { left: 'A sparse texture of voice and one instrument at a private, reflective moment', right: 'Isolation or vulnerability' },
      { left: 'A gospel choir answering the lead singer in call and response', right: 'A community joining in' },
      { left: 'A riff that returns unchanged after every section', right: 'Something inescapable or persistent' },
      { left: 'A gradual crescendo across the final section', right: 'Growing intensity or determination' },
    ],
    explanation: 'These are tendencies, not rules: always check the meaning against the context of the song and the theme.',
  },
  {
    ...fm, id: 'fm-007', type: 'match', difficulty: 'developing',
    prompt: 'Each moment comes from a song in the library. Match it to the theme it supports most directly.',
    pairs: [
      { left: '"We Are the Champions" — heavily multi-tracked vocals in the chorus', right: 'Community' },
      { left: '"What Was I Made For?" — soft, breathy head voice over sparse piano', right: 'Self-doubt' },
      { left: '"Let It Be" — a stable, repeating I–V–vi–IV progression in a hymn-like style', right: 'Comfort' },
      { left: '"Fix You" — a return to a quieter, intimate texture at the end', right: 'Healing' },
    ],
    explanation: 'Multi-tracking sounds like many voices (community); a breathy, fragile vocal suggests uncertainty (self-doubt); a stable, hymn-like progression is reassuring (comfort); the gentle return after the climax suggests recovery (healing).',
  },
  {
    ...fm, id: 'fm-008', type: 'order', difficulty: 'beginner', song: 'we-are-the-champions', theme: 'triumph',
    prompt: 'Arrange these to build a connection from the feature to the theme.',
    items: [
      { id: 'feature', text: 'In the first chorus, the full band enters with heavily multi-tracked vocals.' },
      { id: 'effect', text: 'The sudden expansion creates a huge, stadium-sized sound.' },
      { id: 'meaning', text: 'This suggests a victory that is shared rather than individual.' },
      { id: 'theme', text: 'Triumph is therefore presented as collective, belonging to everyone who struggled.' },
    ],
    correctOrder: ['feature', 'effect', 'meaning', 'theme'],
    explanation: 'Feature → effect → meaning → theme. Each sentence builds on the one before.',
  },
  {
    ...fm, id: 'fm-009', type: 'order', difficulty: 'developing', song: 'what-was-i-made-for', theme: 'identity',
    prompt: 'Order these from the weakest to the strongest connection to the theme of identity.',
    items: [
      { id: 'w1', text: 'The song is quiet.' },
      { id: 'w2', text: 'The vocal is soft and breathy, which sounds sad.' },
      { id: 'w3', text: 'The soft, breathy head voice sounds fragile, suggesting someone unsure of themselves.' },
      { id: 'w4', text: 'The breathy head voice, left exposed over sparse piano, presents identity as fragile and uncertain — a self still searching for its purpose.' },
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    explanation: 'The strongest version names the feature precisely, explains its effect, and links that effect to a specific idea about the theme.',
  },
  {
    ...fm, id: 'fm-010', type: 'multi', difficulty: 'developing', song: 'let-it-be', theme: 'comfort',
    prompt: 'Which features of "Let It Be" could you connect to the idea of comfort? Select all that apply.',
    options: [
      { id: 'a', text: 'The stable, repeating I–V–vi–IV progression' },
      { id: 'b', text: 'The hymn-like piano style of the opening' },
      { id: 'c', text: 'Instruments gradually joining, filling the texture' },
      { id: 'd', text: 'A sudden, violent tempo change', feedback: 'This does not happen in the song.' },
      { id: 'e', text: 'Heavy distortion throughout', feedback: 'This does not happen in the song.' },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation: 'Repetition and stability reassure; the hymn-like style suggests faith; the filling texture can suggest support gathering around the speaker. Only connect features the music actually contains.',
  },
  {
    ...fm, id: 'fm-011', type: 'short', mode: 'analysis', difficulty: 'beginner', song: 'imagine', theme: 'peace',
    prompt: 'In "Imagine", the piano repeats a simple chord pattern at a steady tempo. Write one sentence connecting this feature to the theme of peace.',
    starter: 'The repeating chord pattern ',
    hints: ['What does the repetition create — stability, calm, predictability?', 'Finish by saying what that suggests about peace.'],
    expect: ['effect', 'meaning'],
    models: [{ text: 'The repeating chord pattern creates a sense of stability and calm, suggesting that peace is simple and within reach rather than something to fight for.', why: 'Feature → effect (stability, calm) → meaning about peace (simple, within reach).' }],
  },
  {
    ...fm, id: 'fm-012', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'someone-like-you', theme: 'heartbreak',
    prompt: 'In the chorus of "Someone Like You", the vocal leaps into a higher, strained register. Connect this feature to the theme of heartbreak in one or two sentences.',
    hints: ['What does a strained, high register sound like compared with the low verses?', 'What does that change suggest about the speaker\'s feelings?'],
    expect: ['terminology', 'effect', 'meaning'],
    models: [{ text: 'The leap into a higher, strained register makes the voice sound as if it is reaching beyond its control, suggesting that the grief held back in the verses can no longer be contained. Heartbreak is presented as something that breaks through restraint.', why: 'Uses the term register, explains the effect (reaching beyond control), and links it to a specific idea about heartbreak.' }],
  },
  {
    ...fm, id: 'fm-013', type: 'short', mode: 'analysis', difficulty: 'confident', song: 'man-in-the-mirror', theme: 'community',
    prompt: 'In the final section of "Man in the Mirror", a gospel choir answers the lead vocal in call and response. Connect this feature to the theme of community.',
    hints: ['Who is singing now, compared with the opening?', 'What does it mean that the choir answers rather than simply accompanies?'],
    expect: ['terminology', 'effect', 'meaning', 'theme'],
    models: [{ text: 'The call and response between the lead vocal and the gospel choir turns one voice into a conversation, so the choir seems to take up the singer\'s call. This presents community as something built when one person\'s commitment inspires others to answer.', why: 'Explains what call and response does (turns a solo into a conversation) and connects it to a precise idea about community.' }],
  },
  {
    ...fm, id: 'fm-014', type: 'short', mode: 'analysis', difficulty: 'exam', song: 'fix-you', theme: 'healing',
    prompt: 'The ending of "Fix You" returns to a quieter, more intimate texture after the full-band climax. Connect this feature to the theme of healing, and say why the return matters.',
    hints: ['Why not end on the loudest moment?', 'What does a return suggest — recovery, calm after release, care?'],
    expect: ['effect', 'meaning', 'theme', 'judgement'],
    models: [{ text: 'By returning to a quiet, intimate texture after the full-band climax, the ending suggests calm after an emotional release rather than a triumphant victory. Healing is therefore presented as gentle and ongoing, which is more convincing than a loud ending would be because grief rarely disappears all at once.', why: 'Connects the feature to meaning and theme, then evaluates why the choice is effective.' }],
  },
];

export const relationshipQuestions = [
  {
    ...rel, id: 'rel-001', type: 'match', difficulty: 'beginner',
    prompt: 'Match each relationship to what it means.',
    pairs: [
      { left: 'Reinforce', right: 'The elements point the same way, strengthening each other' },
      { left: 'Contrast', right: 'The elements pull in different directions, creating tension' },
      { left: 'Develop', right: 'One element changes or extends what another has set up' },
    ],
    explanation: 'Naming the relationship is what turns two observations into interconnectivity.',
  },
  {
    ...rel, id: 'rel-002', type: 'match', difficulty: 'beginner',
    prompt: 'Match each linking phrase to the relationship it usually signals.',
    pairs: [
      { left: '…while… / …and at the same time…', right: 'Reinforce' },
      { left: '…whereas… / …yet… / …in contrast…', right: 'Contrast' },
      { left: '…which then… / …building on this…', right: 'Develop' },
      { left: '…together, these elements…', right: 'Sums up the combined effect' },
    ],
    explanation: 'Linking language makes the relationship visible to the examiner. "And" alone rarely does.',
  },
  {
    ...rel, id: 'rel-003', type: 'mcq', difficulty: 'beginner', song: 'someone-like-you', theme: 'heartbreak',
    prompt: '"Someone Like You": descending vocal phrases + a bare voice-and-piano texture. What is the relationship?',
    options: [
      { id: 'a', text: 'They reinforce each other' },
      { id: 'b', text: 'They contrast with each other', feedback: 'Both point towards exposed, sinking resignation, so they work in the same direction.' },
      { id: 'c', text: 'One develops the other', feedback: 'Neither element changes the other across time here; they act together.' },
      { id: 'd', text: 'They are unrelated', feedback: 'Elements heard at the same moment almost always interact. Ask how.' },
    ],
    correctAnswer: 'a',
    explanation: 'The falling phrases create resignation; the bare texture leaves it exposed. Same direction = reinforce.',
  },
  {
    ...rel, id: 'rel-004', type: 'mcq', difficulty: 'developing', song: 'someone-like-you', theme: 'acceptance',
    prompt: '"Someone Like You": a major tonality + lyrics and phrasing full of loss. What is the relationship?',
    options: [
      { id: 'a', text: 'They reinforce each other', feedback: 'A major tonality does not point towards loss in the same way. Look for the tension between them.' },
      { id: 'b', text: 'They contrast with each other' },
      { id: 'c', text: 'One develops the other', feedback: 'Neither changes the other across the song.' },
      { id: 'd', text: 'They are unrelated', feedback: 'The tension between them is exactly what makes the song bittersweet.' },
    ],
    correctAnswer: 'b',
    explanation: 'Contrast: the warmth of the major tonality pulls against the sense of loss, producing bittersweet acceptance rather than simple sadness.',
  },
  {
    ...rel, id: 'rel-005', type: 'mcq', difficulty: 'developing', song: 'let-it-be', theme: 'comfort',
    prompt: '"Let It Be": the same chord progression continues while organ, bass and drums gradually join. What is the relationship?',
    options: [
      { id: 'a', text: 'They contrast with each other', feedback: 'Nothing pulls against the progression; the new instruments support it.' },
      { id: 'b', text: 'One develops the other' },
      { id: 'c', text: 'They are unrelated', feedback: 'The instruments are layered onto the progression, so they clearly interact.' },
      { id: 'd', text: 'The progression cancels out the instruments', feedback: 'Not a relationship examiners would recognise; and the two work together.' },
    ],
    correctAnswer: 'b',
    explanation: 'Develop: the stable progression sets up comfort, and the gradually filling texture extends it, as though support is gathering.',
  },
  {
    ...rel, id: 'rel-006', type: 'mcq', difficulty: 'confident', song: 'what-was-i-made-for', theme: 'isolation',
    prompt: '"What Was I Made For?": strings and quiet layers enter gradually, but the dynamics stay restrained. What is the most precise description of the relationship?',
    options: [
      { id: 'a', text: 'They reinforce each other — both are quiet.', feedback: 'Partly true, but it misses the tension: the texture grows while the volume refuses to.' },
      { id: 'b', text: 'Contrast: the texture grows while the dynamics hold back, so the music never releases its feeling.' },
      { id: 'c', text: 'They are unrelated.', feedback: 'They happen at the same time and shape each other.' },
      { id: 'd', text: 'The strings develop the vocal into a climax.', feedback: 'There is no climax: the restraint is the point.' },
    ],
    correctAnswer: 'b',
    explanation: 'A growing texture would normally lead to a louder climax. Holding the dynamics down contrasts with that expectation, presenting a feeling kept inside.',
  },
  {
    ...rel, id: 'rel-007', type: 'mcq', difficulty: 'developing',
    prompt: 'Which sentence makes the relationship between two elements clearest?',
    options: [
      { id: 'a', text: 'The tempo is fast and the dynamics are loud.', feedback: 'Two observations joined by "and" — no relationship stated.' },
      { id: 'b', text: 'The fast tempo creates urgency, while the loud dynamics intensify it, so together they make the conflict feel overwhelming.' },
      { id: 'c', text: 'There is a fast tempo. There are loud dynamics.', feedback: 'A list of separate facts.' },
      { id: 'd', text: 'Tempo and dynamics are both important elements.', feedback: 'True of any song; says nothing about this one.' },
    ],
    correctAnswer: 'b',
    explanation: 'Each element gets its own job (creates urgency / intensifies it), then "together" states the combined effect.',
  },
  {
    ...rel, id: 'rel-008', type: 'order', difficulty: 'developing', song: 'man-in-the-mirror', theme: 'change',
    prompt: 'Arrange these clauses into one interconnectivity sentence that shows development.',
    items: [
      { id: 'a', text: 'The sparse opening of solo voice and keyboard presents change as a private decision,' },
      { id: 'b', text: 'which the choruses then expand as band layers and backing vocals join,' },
      { id: 'c', text: 'until the gospel choir in the final section turns it into a shared movement.' },
    ],
    correctOrder: ['a', 'b', 'c'],
    explanation: 'Development sentences follow time: set up → extend → transform. "Which … then" and "until" carry the relationship.',
  },
  {
    ...rel, id: 'rel-009', type: 'multi', difficulty: 'confident',
    prompt: 'Which of these sentences state a CONTRAST between elements? Select all that apply.',
    options: [
      { id: 'a', text: 'The bright major harmony sits uneasily against the falling, hesitant melody.' },
      { id: 'b', text: 'Whereas the verses keep a sparse texture, the chorus erupts with the full band.' },
      { id: 'c', text: 'The crescendo and the thickening texture both build intensity.', feedback: 'Both elements point the same way, so this is reinforcement.' },
      { id: 'd', text: 'The steady pulse continues even as the vocal line becomes increasingly frantic.' },
    ],
    correctAnswers: ['a', 'b', 'd'],
    explanation: 'Contrast language: sits against, whereas, even as. Option C shows reinforcement.',
  },
  {
    ...rel, id: 'rel-010', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'we-are-the-champions', theme: 'perseverance',
    prompt: '"We Are the Champions": the opening verse is restrained and piano-led; the first chorus brings the full band and a large dynamic contrast. Write one sentence showing how these two moments CONTRAST, and what the contrast suggests.',
    starter: 'Whereas the opening verse ',
    hints: ['Use contrast language: whereas, in contrast, yet.', 'End with what the contrast suggests about perseverance.'],
    expect: ['connection', 'effect', 'meaning'],
    models: [{ text: 'Whereas the opening verse is restrained and reflective, the full band and sudden dynamic contrast of the first chorus make the music burst outward, suggesting that perseverance through quiet struggle is finally rewarded with release.', why: 'States both sides of the contrast, the effect (bursting outward) and the meaning (struggle rewarded).' }],
  },
  {
    ...rel, id: 'rel-011', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'imagine', theme: 'unity',
    prompt: '"Imagine": gentle strings join the piano in later verses, while the dynamics stay restrained. Write one sentence showing how these elements REINFORCE each other.',
    hints: ['What does each element contribute — warmth? calm?', 'Use "while" or "and at the same time", then "together".'],
    expect: ['connection', 'effect', 'meaning'],
    models: [{ text: 'The gentle strings create a warmer texture, while the restrained dynamics keep that warmth calm and unforced; together, they present unity as something that grows naturally rather than being imposed.', why: 'Each element has its own job, the linking words show they point the same way, and "together" states the combined meaning.' }],
  },
  {
    ...rel, id: 'rel-012', type: 'short', mode: 'analysis', difficulty: 'exam', song: 'fix-you', theme: 'grief',
    prompt: '"Fix You": the fragile falsetto and sustained organ of the opening are later met by drums and electric guitar. Write two sentences showing how the later section DEVELOPS what the opening set up, and connect it to grief.',
    hints: ['Sentence 1: what does the opening establish?', 'Sentence 2: how does the full band change or extend it — and what does that suggest about grief?'],
    expect: ['terminology', 'connection', 'effect', 'meaning'],
    models: [{ text: 'The fragile falsetto over sustained organ chords establishes grief as quiet and fragile. When the drums and electric guitar finally enter, they work together with the large dynamic increase to develop this fragility into a powerful release, suggesting that grief, given time and support, can be transformed into strength.', why: 'Shows development over time (establishes → develop into) and connects the change to a specific idea about grief.' }],
  },
];
