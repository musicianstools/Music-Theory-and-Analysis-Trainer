// Section pages (Theory, Listen, Analyse, Argue, Write) are generated from this config.
// `sets` refer to keys in data/index.js; `links` add cards for tools that are not practice sets.

export const SECTIONS = {
  theory: {
    stage: 'know', eyebrow: 'Stage 1 · Know', title: 'Theory',
    lede: 'Secure the concepts and terminology you will use in every listening answer and every paragraph.',
    drills: ['note-id', 'key-id', 'key-find', 'interval-id', 'chord-id', 'interval-build', 'chord-build', 'scale-build', 'keysig-id', 'rhythm', 'timbre', 'nashville', 'form', 'transpose', 'score-terms', 'excerpt'],
    sets: ['theory'],
    topicFilter: true,
  },
  listen: {
    stage: 'hear', eyebrow: 'Stage 2 · Hear', title: 'Listen',
    lede: 'Identify elements, features and moments of change by ear — then name them precisely.',
    drills: ['ear-feature', 'ear-texture', 'ear-tonality', 'ear-metre', 'ear-cadence', 'ear-melody', 'ear-interval', 'ear-chord', 'ear-scale'],
    sets: ['listening'],
    note: 'These excerpts are generated in your browser, so they work offline and isolate one feature at a time. The system also supports real recordings with start and end times — see the README.',
  },
  analyse: {
    stage: 'explain', eyebrow: 'Stage 3 · Analyse', title: 'Analyse',
    lede: 'Break analysis into small skills and practise moving one step further each time.',
    progression: ['Feature', 'Evidence', 'Effect', 'Meaning', 'Connection', 'Argument'],
    sets: ['feature-effect', 'evidence-meaning', 'synonyms', 'upgrade', 'ladder'],
    links: [{ to: '/ladder', title: 'The Analysis Ladder', blurb: 'See how one observation climbs from Identify to Argue — then climb it yourself.', stage: 'explain' }],
  },
  connect: {
    stage: 'connect', eyebrow: 'Stage 4 · Connect', title: 'Connect',
    lede: 'Link each musical feature to what it means, to the theme, and to the other elements around it.',
    progression: ['Feature', 'Effect', 'Meaning', 'Theme', 'Other elements'],
    sets: ['feature-meaning', 'connect', 'relationships'],
    links: [{ to: '/practice/exam-skills?kind=connection', title: 'Interconnectivity in the Practice Exam', blurb: 'Write the interconnectivity sentence for a key moment of a real Practice Exam question.', stage: 'connect' }],
  },
  argue: {
    stage: 'argue', eyebrow: 'Stage 5 · Argue', title: 'Argue',
    lede: 'A theme is not an argument. Turn broad themes into specific, defensible claims you can prove with music.',
    sets: ['theme-argument', 'argument-builder'],
    themeLesson: true,
  },
  write: {
    stage: 'write', eyebrow: 'Stage 6 · Write', title: 'Write',
    lede: 'Bring it all together: sentences, arguments, paragraphs and full responses — with scaffolding you can gradually remove.',
    sets: ['teees', 'exam-skills', 'sentence-builder', 'paragraph-builder', 'theme-argument', 'argument-builder'],
    examSkills: true,
    links: [{ to: '/write/response', title: 'Practice Exam — guided', blurb: 'Write a full exam response (introduction + three key-moment paragraphs) with scaffolding you can remove. For timed conditions, use Practice Exam in Exam Mode.', stage: 'write' }],
  },
};
