// THEME → ARGUMENT — written (short response) tasks. kind: 'write'
// Scaffolding reduces with difficulty: beginner has a sentence starter, exam has none and asks for evidence.

const base = { type: 'short', mode: 'argument', kind: 'write', category: 'theme-to-argument', skills: ['themeArgument', 'argument'] };

export const themeArgumentWrite = [
  {
    ...base, id: 'taw-001', difficulty: 'beginner', theme: 'conflict', song: 'zombie',
    prompt: 'Theme: Conflict. Song: "Zombie". Complete the sentence to turn the theme into an arguable statement about the song.',
    starter: '"Zombie" presents conflict as ',
    hints: ['Ask: what is the conflict like in this song? Repeating? Inescapable? Grief-stricken? Erupting?', 'Avoid words that fit every song, like "bad" or "intense" on their own.'],
    models: [
      { text: '"Zombie" presents conflict as a cycle of violence that keeps repeating, something the music returns to no matter how many times it erupts.', why: 'Specific and musical — it points to the chord progression that never changes and the choruses that keep crashing back in.' },
      { text: '"Zombie" presents conflict as a source of grief rather than glory, its cracking, wailing vocal mourning the violence instead of celebrating it.', why: 'Arguable, and it suggests musical evidence: the cracking, wailing vocal rather than triumphant sounds.' },
    ],
    explanation: 'A theme becomes an argument once you claim something about how this song presents it.',
  },
  {
    ...base, id: 'taw-002', difficulty: 'beginner', theme: 'hope', song: 'fix-you',
    prompt: 'Theme: Hope. Complete the argument about "Fix You".',
    starter: 'The song presents hope as ',
    hints: ['Think about the long, quiet opening and the much later entry of the full band.', 'Does hope arrive instantly, or slowly?'],
    needDevelop: true,
    models: [
      { text: 'The song presents hope as something that emerges slowly from grief rather than arriving all at once.', why: 'The contrast "rather than" makes it arguable, and "slowly" points to the gradual build you can prove musically.' },
    ],
  },
  {
    ...base, id: 'taw-003', difficulty: 'developing', theme: 'freedom', song: 'free-bird',
    prompt: 'Song: "Free Bird". Turn "Freedom" into an arguable statement about the song. Write one full sentence — no starter this time.',
    hints: ['Use the pattern "\'Free Bird\' presents freedom as …".', 'Add a contrast (rather than, despite) or a change (gradually, only after) — think about the slow first half and the fast ending.'],
    needDevelop: true,
    models: [
      { text: '"Free Bird" presents freedom as a release that has to build, arriving only after the slow, restrained ballad gives way to a long, unrestrained guitar solo.', why: 'Claims freedom must be built up to — you can trace it from the slow opening through the tempo change to the solo.' },
      { text: '"Free Bird" presents freedom as exhilarating but restless, an escape that keeps driving forward without ever settling.', why: 'Holds two ideas in tension, which is what makes it worth arguing — the solo section never returns to the calm of the opening.' },
    ],
  },
  {
    ...base, id: 'taw-004', difficulty: 'developing', theme: 'love', song: 'cant-help-falling-in-love',
    prompt: 'Song: "Can\'t Help Falling in Love". Make this argument more specific: "The song presents love as strong." Rewrite it.',
    starter: '"Can\'t Help Falling in Love" presents love as strong.',
    hints: ['"Strong" how? Inevitable? Devoted? Overwhelming?', 'Add how it develops, or what in the song shows it — the steady sway, the "river" section, the held final note.'],
    needDevelop: true,
    models: [
      { text: '"Can\'t Help Falling in Love" presents love as inevitable rather than chosen, flowing steadily forward like the river described in the middle section.', why: 'A precise, arguable quality (inevitable rather than chosen) plus evidence tied to a specific moment.' },
      { text: '"Can\'t Help Falling in Love" presents love as a tender surrender that grows more certain until the slowing, sustained final note.', why: '"Surrender" makes it arguable, and the ending gives you evidence to prove it.' },
    ],
  },
  {
    ...base, id: 'taw-005', difficulty: 'developing', theme: 'identity', song: 'what-was-i-made-for',
    prompt: 'Write an argument about how identity is presented in "What Was I Made For?".',
    hints: ['Consider the soft, breathy vocal and the lack of a big climax.', 'Is identity certain, fragile, searching, unresolved?'],
    models: [
      { text: 'The song presents identity as fragile and unresolved, a search that turns inward rather than reaching a confident answer.', why: 'Specific, arguable and developable: fragility (timbre), unresolved (no climax), inward (intimate texture).' },
    ],
  },
  {
    ...base, id: 'taw-006', difficulty: 'confident', theme: 'peace', song: 'imagine',
    prompt: 'Write an argument about how peace is presented in "Imagine", and add a musical direction — the elements you would use to prove it.',
    hints: ['Pattern: "The song presents peace as …, through …"', 'Which elements stay simple and steady in this song?'],
    needMusical: true,
    rows: 4,
    models: [
      { text: 'The song presents peace as a simple, attainable ideal rather than a distant dream, through its repetitive piano harmony, steady tempo and restrained dynamics.', why: 'The claim (attainable, not distant) is supported by elements that are deliberately unchanging.' },
    ],
  },
  {
    ...base, id: 'taw-007', difficulty: 'confident', theme: 'change', song: 'man-in-the-mirror',
    prompt: 'Develop a specific argument about how change is presented in "Man in the Mirror". Include a musical direction.',
    hints: ['Think about how the texture grows from one voice to a choir.', 'What happens to the key near the end?'],
    needMusical: true, needDevelop: true,
    models: [
      { text: 'The song presents change as beginning with one individual and growing into a collective movement, through its expanding texture, the upward key change and the choir\'s call and response.', why: 'Development (individual → collective) mapped onto three audible musical processes.' },
    ],
  },
  {
    ...base, id: 'taw-008', difficulty: 'exam', theme: 'heartbreak', song: 'someone-like-you',
    prompt: 'Develop an argument about heartbreak in "Someone Like You" and support it using two contrasting musical moments.',
    task: 'Write 2–4 sentences: your argument, then two moments that contrast (where, what happens, what it shows).',
    hints: ['Contrast the verses with the chorus: register, intensity, vocal strain.', 'Your argument should explain why the contrast matters.'],
    needMusical: true, needDevelop: true, minWords: 45, rows: 7,
    models: [
      { text: 'The song presents heartbreak as a quiet resignation that cannot stay contained. In the verses, low, falling vocal phrases over a bare arpeggiated piano create a sense of restraint and acceptance. In contrast, the chorus leaps into a higher, strained register, so the grief the verses held back breaks through — suggesting that acceptance is something the speaker is still fighting for.', why: 'The argument names a tension (resignation vs not contained); the two moments prove each side of it.' },
    ],
  },
  {
    ...base, id: 'taw-009', difficulty: 'exam', theme: 'loss', song: 'someone-like-you',
    prompt: 'Question: "Analyse how musical elements communicate loss in \'Someone Like You\'." Write a thesis statement you could build a whole exam response around.',
    task: 'One or two sentences. It should be specific, arguable, relevant, developable and musical.',
    needMusical: true, needDevelop: true, minWords: 20,
    models: [
      { text: 'Adele presents loss as something that lingers rather than resolves, using an arpeggiated piano figure that never changes, a strained leap into the chorus and a closing section that returns to where it began to suggest grief that outlasts the song.', why: 'Each musical element named could become one key-moment paragraph.' },
    ],
    explanation: 'A good thesis previews your key moments — it is a plan for the whole response.',
  },
];
