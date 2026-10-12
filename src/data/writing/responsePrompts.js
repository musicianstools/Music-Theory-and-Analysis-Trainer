// PRACTICE EXAM — structure and prompts (Stage: WRITE)
// Structure: Introduction + three key-moment paragraphs.
// `target` = suggested word range; `expect` = components the coach looks for in that paragraph.

const ALL = ['terminology', 'evidence', 'effect', 'meaning', 'theme', 'connection', 'judgement'];

export const RESPONSE_SECTIONS = [
  {
    key: 'intro', label: 'Introduction', hl: 'claim', target: [60, 130],
    expect: ['meaning', 'theme', 'terminology'],
    question: 'Set the context, preview your three moments, and end with your thesis.',
    guide: [
      'Open with context: the work, the artist and how it relates to the theme.',
      'Preview your three key moments and the musical elements you will analyse.',
      'Finish with your thesis — it should be the last sentence of the introduction: a specific, arguable claim about the theme.',
    ],
    starter: '"{title}" by {artist} ',
  },
  {
    key: 'm1', label: 'Key moment 1', hl: 'evidence', target: [140, 260], expect: ALL,
    question: 'Where is the first moment, what happens musically, and how does it support your argument?',
    guide: [
      'Topic sentence linking this moment to your argument.',
      'Locate it precisely (section and/or timestamp).',
      'Evidence: what happens, using musical terminology.',
      'Effect: what the musical choice does.',
      'Meaning: how it communicates the theme.',
      'Interconnectivity: how another element supports or contrasts it.',
      'Link back to the argument with an evaluation.',
    ],
    starter: 'The first key moment occurs in the ',
  },
  {
    key: 'm2', label: 'Key moment 2', hl: 'meaning', target: [140, 260], expect: ALL,
    question: 'How does a second, different moment develop, reinforce or contrast your argument?',
    guide: [
      'Show how this moment develops, reinforces or contrasts moment 1.',
      'Locate it, then give evidence with terminology.',
      'Explain effect and meaning; connect at least two elements.',
      'Link back to the argument with an evaluation.',
    ],
    starter: 'This idea is developed in the ',
  },
  {
    key: 'm3', label: 'Key moment 3', hl: 'judgement', target: [140, 260], expect: ALL,
    question: 'How does a third moment complete your argument, and how effectively is the theme communicated overall?',
    guide: [
      'Choose a moment that completes or complicates the argument (often the climax or ending).',
      'Locate it, give evidence, explain effect and meaning.',
      'Connect several elements.',
      'Finish with a clear overall evaluation of how effectively the theme is communicated.',
    ],
    starter: 'Finally, in the ',
  },
];

export const responsePrompts = [
  {
    id: 'rp-001', theme: 'heartbreak', song: 'someone-like-you', difficulty: 'developing',
    question: 'Analyse and evaluate how musical elements communicate heartbreak in "Someone Like You". Refer to three key musical moments.',
    modelOutline: {
      intro: 'Argument: heartbreak as a quiet resignation that cannot stay contained. Preview: restrained verses, straining choruses, and a closing that returns to the unchanging piano pattern.',
      moments: [
        { where: 'Opening verse', what: 'Low register, phrases falling at their endings, bare repeating arpeggiated piano.', why: 'Restraint and resignation; the exposed texture makes grief private.' },
        { where: 'Chorus', what: 'Leap into a higher, strained register; ornamented notes at emotional peaks; greater intensity.', why: 'The grief held back in the verses breaks through — resignation is not complete.' },
        { where: 'Closing section', what: 'The texture returns to voice and the same piano figure, with no instrumental climax.', why: 'Nothing is resolved: the speaker returns to the same circling thoughts — evaluation on how effectively the contrast communicates heartbreak.' },
      ],
    },
  },
  {
    id: 'rp-002', theme: 'hope', song: 'fix-you', difficulty: 'confident',
    question: 'Analyse and evaluate how musical elements communicate hope in "Fix You". Refer to three key musical moments.',
    modelOutline: {
      intro: 'Argument: hope as something that grows slowly out of grief rather than replacing it. Preview: fragile opening, delayed full-band release, quiet close.',
      moments: [
        { where: 'Opening', what: 'Sustained organ chords, fragile falsetto, minimal texture.', why: 'Stillness and vulnerability: hope begins as a whisper.' },
        { where: 'Later full-band section', what: 'Drums and electric guitar enter after a long build; large dynamic increase.', why: 'Release feels earned because it was delayed — hope gathers strength.' },
        { where: 'Ending', what: 'Return to a quieter, more intimate texture.', why: 'Hope coexists with loss rather than erasing it — evaluation on the overall arc.' },
      ],
    },
  },
  {
    id: 'rp-003', theme: 'change', song: 'man-in-the-mirror', difficulty: 'exam',
    question: 'Analyse and evaluate how musical elements communicate the theme of change in "Man in the Mirror". Refer to three key musical moments.',
    modelOutline: {
      intro: 'Argument: change as beginning with one individual and growing into collective action. Preview: intimate opening, layered choruses, final modulation with choir.',
      moments: [
        { where: 'Opening', what: 'Solo voice with keyboard; sparse texture.', why: 'Change starts as a private decision.' },
        { where: 'Choruses', what: 'Band layers and backing vocals added; fuller texture and dynamics.', why: 'The idea gains support and momentum.' },
        { where: 'Final section', what: 'Upward semitone modulation, gospel choir in call and response, improvised lead vocal.', why: 'Change becomes communal and urgent — evaluation: the structure enacts the message.' },
      ],
    },
  },
  {
    id: 'rp-004', theme: 'acceptance', song: 'let-it-be', difficulty: 'developing',
    question: 'Analyse and evaluate how musical elements communicate acceptance in "Let It Be". Refer to three key musical moments.',
    modelOutline: {
      intro: 'Argument: acceptance as a source of comfort and strength rather than defeat. Preview: hymn-like opening, filling texture, full-band later choruses.',
      moments: [
        { where: 'Opening', what: 'Solo piano and voice; stable, repeating I–V–vi–IV progression; hymn-like style.', why: 'Calm, solemn stability: acceptance as consolation.' },
        { where: 'Middle of the song', what: 'Organ, bass and drums gradually join; texture fills.', why: 'Comfort grows into communal support.' },
        { where: 'Guitar solo and later choruses', what: 'Fuller band and more forceful instrumental playing over the same progression.', why: 'Acceptance gains strength without losing its stability — evaluation.' },
      ],
    },
  },
  {
    id: 'rp-005', theme: 'triumph', song: 'we-are-the-champions', difficulty: 'confident',
    question: 'Analyse and evaluate how musical elements communicate triumph in "We Are the Champions". Refer to three key musical moments.',
    modelOutline: {
      intro: 'Argument: triumph as hard-won and collective, earned through struggle. Preview: reflective verse, first anthemic chorus, final chorus.',
      moments: [
        { where: 'Opening verse', what: 'Restrained, piano-led texture; more reflective vocal delivery.', why: 'Struggle and endurance before victory.' },
        { where: 'First chorus', what: 'Full band; heavily multi-tracked vocals; broad compound metre; large dynamic contrast.', why: 'Release becomes shared — many voices, one celebration.' },
        { where: 'Final chorus', what: 'Most fully layered statement of the chorus.', why: 'Triumph as communal and sustained — evaluation on the effect of contrast.' },
      ],
    },
  },
];

// Short analysis challenge prompts for Exam Mode (single-paragraph responses).
export const analysisChallengePrompts = [
  { id: 'ac-001', theme: 'heartbreak', song: 'someone-like-you', prompt: 'In one paragraph, analyse how ONE musical element communicates heartbreak in "Someone Like You", connecting it to a second element.' },
  { id: 'ac-002', theme: 'peace', song: 'imagine', prompt: 'In one paragraph, analyse how musical simplicity communicates peace in "Imagine".' },
  { id: 'ac-003', theme: 'identity', song: 'what-was-i-made-for', prompt: 'In one paragraph, analyse how timbre and dynamics communicate identity in "What Was I Made For?".' },
  { id: 'ac-004', theme: 'triumph', song: 'we-are-the-champions', prompt: 'In one paragraph, analyse how contrast between verse and chorus communicates triumph in "We Are the Champions".' },
  { id: 'ac-005', theme: 'acceptance', song: 'let-it-be', prompt: 'In one paragraph, analyse how harmony and timbre communicate acceptance in "Let It Be".' },
];
