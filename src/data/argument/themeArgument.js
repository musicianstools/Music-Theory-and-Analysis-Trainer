// THEME → ARGUMENT (Stage: ARGUE)
// Exercise kinds (see `kind`):
//   strongest  — A. Identify the strongest argument (mcq)
//   upgrade    — B. Upgrade the theme (scaffold: complete "presents X as…", then develop)
//   specific   — C. Make it more specific (mcq or scaffold)
//   direction  — D. Add a musical direction (choose elements, then compose)
//   chain      — E. Build the argument step by step (builder)
//   quality    — Argument quality: specific / arguable / relevant / developable / musical (mcq)

const ELEMENTS = ['dynamics', 'rhythm', 'harmony', 'melody', 'texture', 'instrumentation', 'articulation', 'form'];

export const themeArgumentQuestions = [
  // ---------- A. Identify the strongest argument ----------
  {
    id: 'ta-001', type: 'mcq', kind: 'strongest', category: 'theme-to-argument', difficulty: 'beginner', skills: ['themeArgument'], progressive: true,
    theme: 'peace', song: 'imagine',
    prompt: 'Theme: Peace. Song: "Imagine". Which is the strongest argument?',
    options: [
      { id: 'a', text: '"Imagine" is about peace.', feedback: 'This only names the theme. There is nothing to prove — it is a topic, not a claim.' },
      { id: 'b', text: '"Imagine" presents peace.', feedback: 'Better verb, but still no claim about how peace is presented.' },
      { id: 'c', text: '"Imagine" presents peace as desirable.', feedback: 'Now it is an interpretation — but "desirable" is broad and hard to develop across several musical elements.' },
      { id: 'd', text: '"Imagine" presents peace as a simple, attainable alternative to conflict, its calm, unchanging musical surface suggesting that unity is within reach.' },
    ],
    correctAnswer: 'd',
    followUp: { mode: 'argument', theme: 'peace', song: 'imagine', prompt: 'Now write your own argument about how "Imagine" presents peace — different from option D.', starter: '"Imagine" presents peace as ' },
    explanation: 'D is specific (peace as simple and attainable), arguable (someone could read the song as naive or idealistic instead), and developable — it points to musical evidence you can actually hear: the steady tempo, the restrained dynamics and the simple, repeating piano pattern.',
  },
  {
    id: 'ta-002', type: 'mcq', kind: 'strongest', category: 'theme-to-argument', difficulty: 'beginner', skills: ['themeArgument'], progressive: true,
    theme: 'heartbreak', song: 'someone-like-you',
    prompt: 'Theme: Heartbreak. Which statement is the most developed argument?',
    options: [
      { id: 'a', text: 'Heartbreak.', feedback: 'Level 1 — a theme on its own.' },
      { id: 'b', text: 'The composer presents heartbreak.', feedback: 'Level 2 — a basic statement with no interpretation.' },
      { id: 'c', text: 'The composer presents heartbreak as emotionally painful.', feedback: 'Level 3 — an interpretation, but almost any heartbreak song could be described this way.' },
      { id: 'd', text: 'The composer presents heartbreak as an emotionally overwhelming experience that gradually becomes difficult to escape.' },
    ],
    correctAnswer: 'd',
    followUp: { mode: 'argument', theme: 'heartbreak', prompt: 'Write your own Level 5 argument about heartbreak.', starter: 'The composer presents heartbreak as ' },
    explanation: 'D (Level 5) makes a claim about how the theme develops ("gradually becomes difficult to escape"). That gives you a direction for the whole response: you can trace musical changes across the song to prove it.',
  },
  {
    id: 'ta-003', type: 'mcq', kind: 'strongest', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument'],
    theme: 'identity', song: 'what-was-i-made-for',
    prompt: 'Theme: Identity. Which is the most useful argument for analytical writing?',
    options: [
      { id: 'a', text: 'The song presents identity as important.', feedback: 'Too obvious to be worth arguing — almost everything presents its theme as "important".' },
      { id: 'b', text: 'The song presents identity as fragile and unresolved, conveying a self that is searching rather than certain.' },
      { id: 'c', text: 'The song is about who Billie Eilish really is.', feedback: 'This makes a biographical claim about the artist that the music alone cannot prove.' },
      { id: 'd', text: 'The song presents identity through music.', feedback: 'Circular — every song presents its ideas through music.' },
    ],
    correctAnswer: 'b',
    followUp: { mode: 'argument', theme: 'identity', prompt: 'Write a different argument about identity that is just as specific.' },
    explanation: 'B is specific (fragile, unresolved), arguable, and musical — you can prove "fragile" through timbre and dynamics, and "unresolved" through the absence of a climax.',
  },
  {
    id: 'ta-004', type: 'mcq', kind: 'strongest', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument'],
    theme: 'hope', song: 'fix-you',
    prompt: 'Theme: Hope. Which argument makes a claim about how the theme changes?',
    options: [
      { id: 'a', text: 'The song presents hope as positive.', feedback: 'Hope is positive by definition — this adds nothing.' },
      { id: 'b', text: 'The song presents hope as emerging gradually from grief, beginning as fragile reassurance and growing into collective strength.' },
      { id: 'c', text: 'The song presents hope and grief.', feedback: 'Names two themes but makes no claim about their relationship.' },
      { id: 'd', text: 'The song makes people feel hopeful.', feedback: 'A claim about listeners\' feelings, not about how the music presents hope.' },
    ],
    correctAnswer: 'b',
    followUp: { mode: 'argument', theme: 'hope', prompt: 'Write your own argument that makes a claim about how hope changes.' },
    explanation: 'B claims how hope develops (fragile → strong) and its relationship to grief. That maps directly onto the song\'s structure, so you can prove it moment by moment.',
  },

  // ---------- B. Upgrade the theme ----------
  {
    id: 'ta-005', type: 'scaffold', kind: 'upgrade', category: 'theme-to-argument', difficulty: 'beginner', skills: ['themeArgument'],
    theme: 'conflict', song: 'zombie',
    prompt: 'Theme: Conflict. Song: "Zombie". Turn this theme into an arguable statement about the song.',
    frame: '"Zombie" presents conflict as {0}.',
    blanks: [{
      label: 'Your interpretation', placeholder: 'e.g. a cycle that keeps repeating',
      suggestions: [
        { text: 'bad', quality: 'weak', note: 'Too obvious — conflict is almost always "bad". What is this song\'s view of it?' },
        { text: 'loud and angry', quality: 'weak', note: 'Describes the sound of the chorus, not an idea about conflict.' },
        { text: 'a cycle that keeps repeating', quality: 'strong', note: 'Specific and musical: the same chord progression never stops repeating.' },
        { text: 'a source of grief rather than glory', quality: 'strong', note: 'Takes a perspective on conflict — very arguable, and the cracking, wailing vocal supports it.' },
        { text: 'violence that erupts again and again', quality: 'ok', note: 'Specific and developable through the contrast between verses and choruses.' },
      ],
    }],
    develop: { prompt: 'Now develop your argument further. Add how the conflict develops, changes or what it is contrasted with in the song.' },
    expect: ['meaning', 'theme'],
    model: '"Zombie" presents conflict as a cycle of violence that keeps repeating, its unchanging chord progression and increasingly anguished vocal suggesting grief that cannot move on.',
    explanation: 'A theme becomes an argument when you add a claim about how this song presents it. Then push further: how does it develop?',
  },
  {
    id: 'ta-006', type: 'scaffold', kind: 'upgrade', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument'],
    theme: 'freedom', song: 'free-bird',
    prompt: 'Theme: Freedom. Song: "Free Bird". Turn this theme into an arguable statement about the song.',
    frame: '"Free Bird" presents freedom as {0}.',
    blanks: [{
      label: 'Your interpretation', placeholder: 'e.g. a release that has to build',
      suggestions: [
        { text: 'good', quality: 'weak', note: 'Not arguable — nobody would disagree.' },
        { text: 'a release that has to build', quality: 'strong', note: 'Implies restraint before freedom — you can trace that from the slow ballad to the fast solo.' },
        { text: 'an escape from restriction', quality: 'ok', note: 'Specific; invites contrast between the restrained opening and the unrestrained ending.' },
        { text: 'exhilarating but restless', quality: 'strong', note: 'A nuanced claim holding two ideas in tension — the solo never settles.' },
      ],
    }],
    develop: { prompt: 'Develop it further: what is freedom contrasted with, or how does it change across the song?' },
    expect: ['meaning', 'theme'],
    model: '"Free Bird" presents freedom as a release that has to build, the slow, restrained ballad giving way to a long, unrestrained guitar solo.',
    explanation: 'Words like "but", "only after" and "rather than" let your argument hold complexity — that is what makes it worth proving.',
  },
  {
    id: 'ta-007', type: 'scaffold', kind: 'upgrade', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument'],
    theme: 'belonging', song: 'man-in-the-mirror',
    prompt: 'Theme: Belonging. Turn this theme into an arguable statement about this song.',
    frame: 'The song presents belonging as {0}.',
    blanks: [{
      label: 'Your interpretation', placeholder: 'e.g. collective rather than individual',
      suggestions: [
        { text: 'nice', quality: 'weak', note: 'Too vague to prove.' },
        { text: 'collective rather than individual', quality: 'strong', note: 'Supported by the growth from solo voice to choir.' },
        { text: 'something achieved through action', quality: 'strong', note: 'Links belonging to the song\'s call for change.' },
        { text: 'important', quality: 'weak', note: 'Not arguable — every theme is "important".' },
      ],
    }],
    develop: { prompt: 'Develop it: how does the sense of belonging grow or change across the song?' },
    expect: ['meaning', 'theme'],
    model: 'The song presents belonging as collective rather than individual, growing from one solitary voice into a communal response.',
    explanation: 'Contrast phrases ("rather than") make an argument precise and suggest the evidence you will need.',
  },

  // ---------- C. Make it more specific ----------
  {
    id: 'ta-008', type: 'mcq', kind: 'specific', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument'],
    theme: 'conflict', song: 'zombie',
    prompt: '"\'Zombie\' presents conflict as intense." How could you make this argument more specific?',
    options: [
      { id: 'a', text: '"Zombie" presents conflict as very, very intense.', feedback: 'Intensifiers add emphasis, not specificity.' },
      { id: 'b', text: '"Zombie" presents conflict as a cycle of violence that keeps erupting and cannot be escaped.' },
      { id: 'c', text: '"Zombie" presents conflict as intense and bad.', feedback: '"Bad" adds nothing arguable.' },
      { id: 'd', text: 'Conflict is intense in "Zombie".', feedback: 'This is less specific than the original.' },
    ],
    correctAnswer: 'b',
    followUp: { mode: 'argument', theme: 'conflict', song: 'zombie', prompt: 'Make "\'Zombie\' presents conflict as intense." more specific in your own words.', starter: '"Zombie" presents conflict as ' },
    explanation: '"Keeps erupting" points to the choruses crashing in again and again; "cannot be escaped" points to the chord progression that never changes. Each gives you something to prove with musical evidence.',
  },
  {
    id: 'ta-009', type: 'scaffold', kind: 'specific', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument'],
    theme: 'love', song: 'cant-help-falling-in-love',
    prompt: 'Song: "Can\'t Help Falling in Love". Make this argument more specific: "The song presents love as strong."',
    frame: '"Can\'t Help Falling in Love" presents love as {0}, {1}.',
    blanks: [
      {
        label: 'A more precise quality', placeholder: 'e.g. inevitable and unforced',
        suggestions: [
          { text: 'very strong', quality: 'weak', note: 'Intensifying is not specifying.' },
          { text: 'inevitable and unforced', quality: 'strong', note: 'Precise qualities you can link to the steady sway and smooth legato line.' },
          { text: 'tender and devoted', quality: 'strong', note: 'Links to the soft dynamics, gentle backing vocals and legato delivery.' },
        ],
      },
      {
        label: 'How it develops or what it contrasts with', placeholder: 'e.g. flowing forward like the river in the middle section',
        suggestions: [
          { text: 'flowing forward like the river in the middle section', quality: 'strong', note: 'Ties the claim to a specific moment where the melody moves more continuously.' },
          { text: 'held onto until the very last, sustained note', quality: 'strong', note: 'Development over time, anchored in the ending.' },
          { text: 'which is good', quality: 'weak', note: 'An evaluation of the song, not an argument about love.' },
        ],
      },
    ],
    expect: ['meaning', 'theme'],
    model: '"Can\'t Help Falling in Love" presents love as inevitable and unforced, flowing forward like the river in the middle section.',
    explanation: 'Specificity = precise qualities + development or contrast — both anchored in something you can hear in the song.',
  },
  {
    id: 'ta-010', type: 'mcq', kind: 'specific', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument'],
    theme: 'loss', song: 'someone-like-you',
    prompt: '"\'Someone Like You\' presents loss as sad." Which revision is the most specific and developable?',
    options: [
      { id: 'a', text: '"Someone Like You" presents loss as extremely sad.', feedback: 'Intensifying the adjective does not make the claim more specific.' },
      { id: 'b', text: '"Someone Like You" presents loss as something that lingers, its quiet persistence shaping the whole song rather than a single moment of grief.' },
      { id: 'c', text: '"Someone Like You" presents loss through sad music.', feedback: 'Vague, and assumes the music is simply "sad" — it is actually in a major key.' },
      { id: 'd', text: '"Someone Like You" is about losing someone.', feedback: 'Back to a topic.' },
    ],
    correctAnswer: 'b',
    followUp: { mode: 'argument', theme: 'loss', song: 'someone-like-you', prompt: 'Write your own specific, developable argument about how "Someone Like You" presents loss.', starter: '"Someone Like You" presents loss as ' },
    explanation: 'B is specific (lingers, quiet persistence) and developable across the whole song — you can prove it with the same arpeggiated piano figure that continues throughout and the closing section that returns to where it began.',
  },

  // ---------- D. Add a musical direction ----------
  {
    id: 'ta-011', type: 'direction', kind: 'direction', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument', 'argument'],
    theme: 'conflict', song: 'zombie',
    argument: '"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape.',
    prompt: 'Which musical elements of "Zombie" could you use to investigate this argument? Choose at least two.',
    elements: ELEMENTS.map((id) => ({
      id,
      fit: { dynamics: 'strong', rhythm: 'possible', texture: 'strong', harmony: 'strong', instrumentation: 'strong', melody: 'possible', articulation: 'possible', form: 'strong' }[id],
      note: {
        dynamics: 'Strong fit: the jump from restrained verses to loud choruses happens again and again — violence that keeps erupting.',
        rhythm: 'Possible: the pounding drums in the chorus add force — but say what they contribute beyond "loud".',
        texture: 'Strong fit: the texture thickens dramatically each time the full band crashes in.',
        harmony: 'Strong fit: the same four-chord progression repeats throughout and never moves somewhere new — a cycle with no escape.',
        instrumentation: 'Strong fit: heavily distorted electric guitars give the chorus a harsh, violent timbre.',
        melody: 'Possible: the vocal cracks into yodel-like breaks on "Zombie" — strong for grief, less direct for "cycle".',
        articulation: 'Possible: the hard-hitting attacks of the chorus could support aggression — be specific about where.',
        form: 'Strong fit: verse and chorus keep alternating, and the ending returns to the same progression rather than resolving.',
      }[id],
    })),
    minSelect: 2,
    compose: { prompt: 'Now build your argument with a musical direction.', starter: '"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape through ' },
    expect: ['terminology', 'meaning', 'theme'],
    model: '"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape through an unchanging four-chord progression and distorted choruses that keep crashing back in.',
    explanation: 'Adding a musical direction tells the reader how you will prove your argument. Choose elements of the song where you can actually hear the idea.',
  },
  {
    id: 'ta-012', type: 'direction', kind: 'direction', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument', 'argument'],
    theme: 'hope', song: 'fix-you',
    argument: 'The song presents hope as emerging gradually from grief.',
    prompt: 'Which musical elements would best support this argument? Choose at least two.',
    elements: ELEMENTS.map((id) => ({
      id,
      fit: { texture: 'strong', dynamics: 'strong', instrumentation: 'strong', form: 'strong', melody: 'possible', harmony: 'possible', rhythm: 'possible', articulation: 'weak' }[id],
      note: {
        texture: 'Strong fit: the gradual layering from organ and voice to full band traces "emerging gradually".',
        dynamics: 'Strong fit: the long build from quiet to loud mirrors hope gaining strength.',
        instrumentation: 'Strong fit: the late entry of drums and electric guitar marks a turning point.',
        form: 'Strong fit: the long, delayed build and quiet return shape the whole argument.',
        melody: 'Possible: changes of register (falsetto to fuller voice) could support it — listen closely.',
        harmony: 'Possible, but harder to hear as a gradual change here.',
        rhythm: 'Possible: the drums\' arrival adds rhythmic drive — but rhythm is static for much of the song.',
        articulation: 'Weak fit: articulation does not change in an obvious, audible way here.',
      }[id],
    })),
    minSelect: 2,
    compose: { prompt: 'Now write the argument with a musical direction.', starter: 'The song presents hope as emerging gradually from grief through ' },
    expect: ['terminology', 'meaning', 'theme'],
    model: 'The song presents hope as emerging gradually from grief through a slowly thickening texture and a long dynamic build that culminates in the entry of the full band.',
    explanation: 'The strongest choices are elements that actually change across the song. An argument is only as strong as the evidence you can hear.',
  },

  // ---------- E. Build the argument ----------
  {
    id: 'ta-013', type: 'builder', kind: 'chain', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument', 'argument', 'interconnectivity'],
    theme: 'conflict', song: 'zombie',
    prompt: 'Build an argument about how "Zombie" presents conflict, one link at a time.',
    steps: [
      { key: 'theme', label: 'Theme', prompt: 'Start with the theme.', fixed: 'Conflict' },
      { key: 'interpretation', label: 'Interpretation', prompt: 'What is conflict like in "Zombie"? (One idea.)', suggestions: ['Conflict is a cycle that keeps repeating.', 'Conflict is unavoidable.', 'Conflict leaves grief behind.'], placeholder: 'Conflict is…' },
      { key: 'argument', label: 'Argument', prompt: 'Turn it into a claim: "\'Zombie\' presents conflict as…"', suggestions: ['"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape.'], placeholder: '"Zombie" presents conflict as…', expect: ['meaning', 'theme'] },
      { key: 'element', label: 'Musical element', prompt: 'Which element will you use first?', suggestions: ['Harmony', 'Dynamics', 'Texture', 'Timbre'], placeholder: 'e.g. Harmony' },
      { key: 'evidence', label: 'Evidence', prompt: 'What specifically happens in that element, and where?', suggestions: ['The same four-chord progression repeats through every verse and chorus without change'], placeholder: 'Be specific: where and how?', expect: ['terminology'] },
      { key: 'effect', label: 'Effect', prompt: 'What does that do?', suggestions: ['It creates a circular, trapped feeling, as if the music can never arrive anywhere new.'], placeholder: 'It creates / builds…', expect: ['effect'] },
      { key: 'meaning', label: 'Meaning', prompt: 'How does it link to your argument?', suggestions: ['This reinforces the sense of violence repeating endlessly.'], placeholder: 'This reinforces / suggests…', expect: ['meaning'] },
      { key: 'element2', label: 'Second element', prompt: 'Which second element works with the first?', suggestions: ['Timbre', 'Dynamics', 'Texture'], placeholder: 'e.g. Timbre' },
      { key: 'interconnection', label: 'Interconnection', prompt: 'How do the two elements work together?', suggestions: ['The heavily distorted choruses keep crashing back in over the unchanging progression, so together they make the violence erupt again and again without ever moving on.'], placeholder: '…works with… / while… / together…', expect: ['connection'] },
      { key: 'final', label: 'Final argument', prompt: 'Now combine everything into one sophisticated argument.', suggestions: ['"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape, using an unchanging chord progression and repeatedly erupting, distorted choruses to construct a sense of violence that keeps returning.'], placeholder: '"Zombie" presents conflict as…, using…', expect: ['terminology', 'effect', 'meaning', 'theme', 'connection'], long: true },
    ],
    finalKey: 'final',
    expect: ['terminology', 'effect', 'meaning', 'theme', 'connection'],
    model: '"Zombie" presents conflict as a relentless cycle of violence that is difficult to escape, using an unchanging chord progression and repeatedly erupting, distorted choruses to construct a sense of violence that keeps returning.',
    explanation: 'Theme → interpretation → argument → element → evidence → effect → meaning → second element → interconnection → final argument. Every link is small; together they form a complete, defensible claim about one song.',
  },

  // ---------- Argument quality ----------
  {
    id: 'ta-014', type: 'mcq', kind: 'quality', category: 'theme-to-argument', difficulty: 'developing', skills: ['themeArgument'],
    theme: 'peace', song: 'imagine',
    prompt: 'Which argument about "Imagine" would be easiest to prove with musical evidence?',
    options: [
      { id: 'a', text: '"Imagine" presents peace as what John Lennon personally believed in.', feedback: 'Not musical: biographical beliefs cannot be proven from the sound of the music.' },
      { id: 'b', text: '"Imagine" presents peace as calm and attainable, its simple harmony and gentle, steady delivery avoiding any sense of struggle.' },
      { id: 'c', text: '"Imagine" presents peace as the most important issue in the world.', feedback: 'A value judgement about the world, not something the music can demonstrate.' },
      { id: 'd', text: '"Imagine" presents peace as something listeners in the 1970s wanted.', feedback: 'A historical claim about audiences — interesting context, but not provable from the music.' },
    ],
    correctAnswer: 'b',
    explanation: 'B is musical: "calm and attainable" can be supported by audible features in the song — the simple repeating chord pattern, steady tempo, restrained dynamics and plain vocal delivery. Always ask: can I point to something in the music that proves this?',
  },
  {
    id: 'ta-015', type: 'mcq', kind: 'quality', category: 'theme-to-argument', difficulty: 'confident', skills: ['themeArgument'],
    theme: 'conflict', song: 'zombie',
    prompt: 'Question: "Analyse how musical elements communicate conflict in \'Zombie\'." A student argues: "\'Zombie\' presents peace as fragile." Which quality does this argument lack?',
    options: [
      { id: 'a', text: 'Specific', feedback: '"Fragile" is reasonably specific.' },
      { id: 'b', text: 'Arguable', feedback: 'It is arguable — someone could disagree.' },
      { id: 'c', text: 'Relevant' },
      { id: 'd', text: 'Musical', feedback: 'Fragility could be supported musically — the restrained verses, for example.' },
    ],
    correctAnswer: 'c',
    explanation: 'The question asks about conflict. An argument about peace may be interesting, but it does not directly answer the question. Fix it by reframing: "\'Zombie\' presents conflict as a constant threat that keeps shattering a fragile calm."',
  },
];
