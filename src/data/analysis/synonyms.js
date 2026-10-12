// MUSICAL SYNONYMS (Stage: EXPLAIN) — choosing the analytical verb that fits the relationship.
// `prompt` may contain "___" which the UI renders as a blank.

export const synonymQuestions = [
  {
    id: 'syn-001', type: 'mcq', category: 'synonyms', difficulty: 'beginner', skills: ['terminology', 'effect'],
    prompt: 'Improve this weak statement. Which version uses the most precise analytical verb?',
    weak: 'The song explores peace.',
    options: [
      { id: 'a', text: 'The song is about peace.', feedback: '"Is about" names a topic but makes no claim. It is weaker than the original.' },
      { id: 'b', text: 'The song talks about peace.', feedback: 'Songs do not "talk" — and this still makes no claim about how peace is shown.' },
      { id: 'c', text: 'The song presents peace as a simple, achievable ideal, its unhurried tempo and gentle dynamics conveying calm certainty.' },
      { id: 'd', text: 'The song shows peace a lot.', feedback: '"Shows a lot" is vague: it says nothing about how or what kind of peace.' },
    ],
    correctAnswer: 'c',
    explanation: '"Presents … as" turns a topic into a claim, and "conveying" links specific musical evidence to an emotional effect. A strong verb is only useful when it carries a specific idea.',
  },
  {
    id: 'syn-002', type: 'mcq', category: 'synonyms', difficulty: 'beginner', skills: ['terminology', 'effect'],
    prompt: 'The backing vocals added in the second chorus ___ the sense of hope already established in the first chorus.',
    options: [
      { id: 'a', text: 'establish', feedback: '"Establish" means setting something up for the first time — but the hope was already there.' },
      { id: 'b', text: 'reinforce' },
      { id: 'c', text: 'contrast', feedback: 'Nothing is being set in opposition: the backing vocals support the same idea.' },
      { id: 'd', text: 'depict', feedback: '"Depict" suits concrete, pictorial representation (word painting), not strengthening a mood.' },
    ],
    correctAnswer: 'b',
    explanation: '"Reinforce" means to strengthen an idea that already exists. The key clue is "already established" — the second chorus builds on the first.',
  },
  {
    id: 'syn-003', type: 'mcq', category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'],
    prompt: 'The sparse, whispered bridge ___ with the dense final chorus, setting private doubt against public celebration.',
    options: [
      { id: 'a', text: 'reinforces', feedback: 'The two sections are opposed, not supporting each other.' },
      { id: 'b', text: 'contrasts' },
      { id: 'c', text: 'establishes', feedback: 'Nothing new is being set up — the sentence is about opposition between two moments.' },
      { id: 'd', text: 'characterises', feedback: '"Characterises" gives qualities to a person or idea; it does not describe two sections in opposition.' },
    ],
    correctAnswer: 'b',
    explanation: '"Contrasts with" places two ideas in opposition. The clue is "setting … against". Contrast is powerful evidence because the difference itself carries meaning.',
  },
  {
    id: 'syn-004', type: 'mcq', category: 'synonyms', difficulty: 'beginner', skills: ['terminology', 'effect'],
    prompt: 'The sustained organ chords in the introduction ___ a reflective, hymn-like atmosphere that the rest of the song builds upon.',
    options: [
      { id: 'a', text: 'establish' },
      { id: 'b', text: 'reinforce', feedback: 'You can only reinforce something already present. In the introduction, nothing has come before.' },
      { id: 'c', text: 'contrast', feedback: 'There is no opposing idea in the sentence.' },
      { id: 'd', text: 'highlight', feedback: 'Highlighting draws attention to something that exists; here the atmosphere is being created.' },
    ],
    correctAnswer: 'a',
    explanation: '"Establish" suits openings: the music sets up a mood or idea that later sections develop. Clue: "in the introduction … builds upon".',
  },
  {
    id: 'syn-005', type: 'mcq', category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'],
    prompt: 'The sudden fortissimo accent on the final word of the line ___ its importance.',
    options: [
      { id: 'a', text: 'emphasises' },
      { id: 'b', text: 'develops', feedback: '"Develops" implies change over time; a single accent is a moment of emphasis.' },
      { id: 'c', text: 'depicts', feedback: 'Depicting would mean picturing something concrete; here the accent draws attention.' },
      { id: 'd', text: 'establishes', feedback: 'Establishing sets something up; the accent is pointing at something.' },
    ],
    correctAnswer: 'a',
    explanation: '"Emphasises" means drawing attention to something. A sudden dynamic accent is a classic emphasis device. ("Highlights" would also work, but "develops" or "depicts" would not.)',
  },
  {
    id: 'syn-006', type: 'mcq', category: 'synonyms', difficulty: 'confident', skills: ['terminology', 'effect'],
    prompt: 'Through relentless distorted guitar riffs, mechanical drum patterns and shouted vocals, the composer ___ conflict as dehumanising.',
    options: [
      { id: 'a', text: 'mentions', feedback: '"Mentions" is far too passive for a deliberate, multi-element representation.' },
      { id: 'b', text: 'constructs' },
      { id: 'c', text: 'emphasises', feedback: 'Close, but "emphasises" means drawing attention to an existing idea. Here several choices actively build a particular version of conflict.' },
      { id: 'd', text: 'establishes', feedback: '"Establishes" suits an opening. The sentence describes a representation built through many deliberate choices.' },
    ],
    correctAnswer: 'b',
    explanation: '"Constructs" signals that the composer actively creates a particular representation through deliberate choices. It is a sophisticated verb because it frames the music as shaping meaning, not merely reflecting it.',
  },
  {
    id: 'syn-007', type: 'mcq', category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'],
    prompt: 'In a film cue, rapid string tremolo and sudden timpani rolls ___ the approaching storm.',
    options: [
      { id: 'a', text: 'depict' },
      { id: 'b', text: 'reinforce', feedback: 'Reinforce needs an existing idea to strengthen. Here the music is picturing something concrete.' },
      { id: 'c', text: 'characterise', feedback: '"Characterise" gives qualities to a person or idea; a storm is being pictured.' },
      { id: 'd', text: 'contrast', feedback: 'No opposing idea is mentioned.' },
    ],
    correctAnswer: 'a',
    explanation: '"Depict" suits word painting — music imitating something concrete (wind, thunder, climbing, falling).',
  },
  {
    id: 'syn-008', type: 'mcq', category: 'synonyms', difficulty: 'confident', skills: ['terminology', 'effect'],
    prompt: 'Over three verses, the composer ___ the idea of hope, moving it from a fragile solo line to a full choral statement.',
    options: [
      { id: 'a', text: 'establishes', feedback: 'Establishing only covers the setting-up. The sentence traces change across the whole song.' },
      { id: 'b', text: 'depicts', feedback: 'Hope is abstract; the sentence is about change over time, not picturing.' },
      { id: 'c', text: 'develops' },
      { id: 'd', text: 'emphasises', feedback: 'Emphasis is a moment; this is a process across three verses.' },
    ],
    correctAnswer: 'c',
    explanation: '"Develops" describes an idea changing or growing over time. Clue: "over three verses … moving it from … to …". Arguments about development are often the most sophisticated.',
  },
  {
    id: 'syn-009', type: 'mcq', category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'],
    prompt: 'Which verb best replaces "shows" in: "The breathy, cracking vocal timbre shows the singer\'s grief"?',
    options: [
      { id: 'a', text: 'conveys' },
      { id: 'b', text: 'contrasts', feedback: 'Nothing is being opposed.' },
      { id: 'c', text: 'establishes', feedback: 'Possible if this were the opening, but the sentence is about carrying emotion to the listener.' },
      { id: 'd', text: 'represents', feedback: '"Represents" means stands for or symbolises. The timbre is carrying a feeling, not acting as a symbol.' },
    ],
    correctAnswer: 'a',
    explanation: '"Conveys" means carrying an emotion or idea to the listener — ideal for vocal timbre and performance choices.',
  },
  {
    id: 'syn-010', type: 'mcq', category: 'synonyms', difficulty: 'confident', skills: ['terminology', 'effect'],
    prompt: 'A bold brass fanfare accompanies every entrance of the hero, and ___ him as confident and commanding.',
    options: [
      { id: 'a', text: 'characterises' },
      { id: 'b', text: 'develops', feedback: 'The fanfare is consistent each time — it gives qualities rather than changing them.' },
      { id: 'c', text: 'depicts', feedback: 'Close — but "depicts" focuses on picturing; "characterises" focuses on giving a person qualities.' },
      { id: 'd', text: 'contrasts', feedback: 'There is no opposition here.' },
    ],
    correctAnswer: 'a',
    explanation: '"Characterises" gives a person or persona specific qualities. Leitmotifs (recurring themes for a character) are classic evidence for characterisation.',
  },
  {
    id: 'syn-011', type: 'short', mode: 'analysis', category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'],
    weak: '"Someone Like You" talks about loss.', theme: 'loss', song: 'someone-like-you',
    prompt: 'Rewrite this weak statement using a precise analytical verb and a specific claim.',
    starter: '"Someone Like You" ',
    expect: ['meaning', 'theme'],
    hints: ['Songs do not "talk". Try presents, conveys, portrays, constructs…', 'Add "as …" to make a claim — think about the piano figure that never changes.'],
    models: [{ text: '"Someone Like You" portrays loss as a quiet, lingering absence rather than a single moment of grief.', why: '"Portrays … as" casts loss in a particular light and makes an arguable claim.' }],
  },
  {
    id: 'syn-012', type: 'short', mode: 'analysis', category: 'synonyms', difficulty: 'confident', skills: ['terminology', 'effect'],
    weak: 'The later choruses also show hope.', theme: 'hope', song: 'let-it-be',
    prompt: 'In "Let It Be", the hymn-like piano opening has already established hope. Rewrite the sentence with a verb that shows the later choruses strengthen that idea, and name the musical evidence.',
    expect: ['terminology', 'meaning', 'theme'],
    hints: ['Which verb means "strengthens an idea that already exists"?', 'What changes in the later choruses? Think about the instruments and how forcefully they play.'],
    models: [{ text: 'In the later choruses, the fuller band texture and more forceful playing over the same progression reinforce the hope established in the opening.', why: '"Reinforce" is the precise verb for strengthening an existing idea, and the evidence is specific.' }],
  },
];

