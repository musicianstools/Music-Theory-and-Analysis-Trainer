// TEEES PARAGRAPHS (Stage: WRITE)
// Topic sentence → Elaborate → Evidence → Explain → Summary/link — the paragraph structure from the
// "Music analysis scaffold". Each paragraph is planned first with the four planning questions.
//
// teeesParagraphs: one model per song moment. `parts.summary` closes a single paragraph; `link` replaces it
// when another paragraph follows. In Evidence, "[timecode]" marks where students add the time from their recording.

export const TEEES_PARTS = [
  { key: 'topic', letter: 'T', label: 'Topic sentence', hl: 'claim',
    guide: 'State very explicitly the theme of the song and how it creates meaning for an audience. Name the song and the artist.',
    starter: 'In "{title}", {artist} ',
    rows: 2 },
  { key: 'elaborate', letter: 'E', label: 'Elaborate', hl: 'meaning',
    guide: 'Give context to your song\'s meaning: what key features communicate this song\'s meaning? Be brief.',
    starter: 'The song is ',
    rows: 2 },
  { key: 'evidence', letter: 'E', label: 'Evidence', hl: 'evidence',
    guide: 'Give a timecode or bar markers, and key lyrical ideas where relevant. Any recording is fine — the time itself isn\'t checked, only that you have given one.',
    starter: 'In the ',
    rows: 2 },
  { key: 'explain', letter: 'E', label: 'Explain', hl: 'effect',
    guide: 'Being very detailed and specific, unpack the key musical characteristics that shape this moment. Make clear and explicit connections to the meaning stated in your topic sentence.',
    starter: 'The ',
    rows: 6 },
  { key: 'summary', letter: 'S', label: 'Summary / link', hl: 'judgement',
    guide: 'Re-establish the topic sentence by summarising. If you have more than one paragraph, use this sentence to link to the next paragraph instead.',
    starter: 'Through this moment, ',
    linkStarter: 'This ',
    rows: 2 },
];

export const PLAN_FIELDS = [
  { key: 'characteristics', label: 'Musical characteristics', q: 'What techniques are used?' },
  { key: 'context', label: 'Context', q: 'Where does it happen and what surrounds it? (Give timecodes.)' },
  { key: 'purpose', label: 'Purpose', q: 'Why is it there? (How it supports the themes, emotions or identity.)' },
  { key: 'impact', label: 'Impact', q: 'How might it affect the audience?' },
];

import { teeesMore } from '../songs/songTasks.js';

const teeesBase = [
  {
    id: 'teees-001', song: 'someone-like-you', theme: 'heartbreak', moment: 'Chorus', difficulty: 'developing',
    plan: {
      characteristics: 'Leap into a higher, strained register; ornamented, leaning notes at the peaks; the same repeating arpeggiated piano figure.',
      context: 'The first chorus [timecode], straight after the low, restrained first verse.',
      purpose: 'Shows the grief held back in the verse breaking through — heartbreak that cannot be contained.',
      impact: 'The audience hears the strain in the voice and feels the emotion spill over; it can feel almost too personal to listen to.',
    },
    parts: {
      topic: 'In "Someone Like You", Adele presents heartbreak as a quiet resignation that the speaker cannot fully hold in, and the chorus is where that restraint gives way for the audience.',
      elaborate: 'The song is a stripped-back piano ballad in which the speaker revisits a former partner who has moved on; its bare voice-and-piano texture and the contrast between low verses and a straining chorus carry this meaning.',
      evidence: 'In the first chorus [timecode], as the speaker insists that she will find someone like her former partner, the melody leaps into a higher register over the same repeating arpeggiated piano figure.',
      explain: 'The leap into a higher, strained register makes the voice sound as if it is reaching beyond its control, contrasting sharply with the low, conversational register of the verses. Ornamented, leaning notes at the emotional peaks add strain to the tone, so the grief held back in the verse now breaks through. Meanwhile, the piano figure does not change, leaving the voice to carry all of this intensity on its own, which reinforces how private and unprotected the speaker\'s heartbreak is. Together, these choices show that the resignation of the verses is not complete.',
      summary: 'Through the chorus, Adele presents heartbreak as a resignation that cannot stay contained.',
      link: 'This outburst does not last, however: the closing section returns to the same piano figure, suggesting that the speaker ends where she began.',
    },
  },
  {
    id: 'teees-002', song: 'fix-you', theme: 'hope', moment: 'Later full-band section', difficulty: 'developing',
    plan: {
      characteristics: 'Drums and electric guitar enter; large dynamic increase; texture expands after a long, gradual build.',
      context: 'The later full-band section [timecode], after a long, fragile opening of organ and falsetto.',
      purpose: 'Shows hope finally becoming strong — but only after grief has been fully felt.',
      impact: 'A release of tension: the audience feels lifted after waiting so long, which makes the moment feel earned.',
    },
    parts: {
      topic: 'In "Fix You", Coldplay present hope as something that grows slowly out of grief rather than replacing it, and the later full-band section is where that hope finally becomes strong for the audience.',
      elaborate: 'The song is an alternative rock ballad offering comfort to someone who is grieving; its long, gradual build from fragile organ and falsetto to a full band carries this meaning.',
      evidence: 'After a long build [timecode], as the lyrics promise to guide the listener home, drums and electric guitar enter for a much louder section.',
      explain: 'The entry of drums and electric guitar after such a long, quiet build creates a sudden expansion of texture and a large dynamic increase. Because the opening was so fragile, with a falsetto vocal over sustained organ chords, this release feels earned rather than instant. The steady drum beat also gives the music forward motion for the first time, suggesting movement out of the stillness of grief. Together, the timing of the entry and the change in texture show hope arriving only after loss has been fully felt.',
      summary: 'In this section, Coldplay present hope as hard-won, growing out of grief rather than erasing it.',
      link: 'Yet the song does not end on this high point: the return to a quieter texture at the close suggests that hope must live alongside loss.',
    },
  },
  {
    id: 'teees-003', song: 'man-in-the-mirror', theme: 'change', moment: 'Final section', difficulty: 'confident',
    plan: {
      characteristics: 'Upward semitone modulation; gospel choir in call and response; increasingly improvised lead vocal.',
      context: 'The final section [timecode], after choruses that have gradually added band and backing vocals.',
      purpose: 'Completes the journey from one person\'s decision to a whole community acting together.',
      impact: 'The audience is swept up and invited to join in — the song feels like a rally rather than a private reflection.',
    },
    parts: {
      topic: 'In "Man in the Mirror", Michael Jackson presents change as beginning with one person and growing into collective action, and the final section is where the audience hears that growth completed.',
      elaborate: 'The song is a gospel-influenced pop ballad urging listeners to take personal responsibility for improving the world; its texture grows from a solo voice to a full choir to carry this message.',
      evidence: 'In the final section [timecode], as the lyrics return to the idea of starting with yourself, the key shifts up a semitone and a gospel choir answers the lead vocal in call and response.',
      explain: 'The upward semitone modulation lifts the whole song onto a higher level, so the music itself refuses to stay where it started — it enacts the change the lyrics call for. The gospel choir answering the lead in call and response turns one voice into a conversation, as though others are taking up the singer\'s call. Above this fuller texture, the increasingly improvised lead vocal adds urgency and conviction. Together, these elements contrast with the sparse opening of solo voice and keyboard, showing a private decision becoming a shared movement.',
      summary: 'Through its final section, the song presents change as something that begins with one individual and spreads to a whole community.',
      link: 'This collective climax is powerful precisely because of how sparsely the song begins — a contrast explored in the next paragraph.',
    },
  },
  {
    id: 'teees-004', song: 'we-are-the-champions', theme: 'triumph', moment: 'First chorus', difficulty: 'beginner',
    plan: {
      characteristics: 'Full band enters; heavily multi-tracked vocals; large dynamic contrast; broad compound metre.',
      context: 'The first chorus [timecode], after a restrained, piano-led verse.',
      purpose: 'Turns a personal struggle into a shared victory.',
      impact: 'The audience is invited to sing along — it sounds like a crowd celebrating together.',
    },
    parts: {
      topic: 'In "We Are the Champions", Queen present triumph as collective rather than individual, and the first chorus is where the audience first hears this shared victory.',
      elaborate: 'The song is a rock anthem celebrating success after struggle; the contrast between its restrained verses and huge, layered choruses carries this meaning.',
      evidence: 'In the first chorus [timecode], as the lyrics declare that "we" are the champions, the full band enters with heavily multi-tracked vocals and a large dynamic contrast.',
      explain: 'The heavily multi-tracked vocals make one singer sound like a crowd, so the victory is heard as shared rather than personal. The full band and sudden dynamic contrast expand the restrained, piano-led texture of the verse into a stadium-sized sound. The broad compound metre gives the chorus a swaying, anthemic feel that invites listeners to sing along. Together, these elements turn the reflective struggle of the verse into a communal celebration.',
      summary: 'In the first chorus, Queen present triumph as a victory that belongs to everyone who has struggled.',
      link: 'This shared triumph grows even larger in the final chorus, the most fully layered statement of the song.',
    },
  },
  {
    id: 'teees-005', song: 'imagine', theme: 'peace', moment: 'Opening', difficulty: 'beginner',
    plan: {
      characteristics: 'Solo piano repeating a simple chord pattern; steady tempo; narrow dynamic range; plain, mostly syllabic vocal.',
      context: 'The opening [timecode] — the very start of the song.',
      purpose: 'Establishes peace as calm and uncomplicated from the first moment.',
      impact: 'The audience is relaxed rather than roused; the idea feels gentle and reachable.',
    },
    parts: {
      topic: 'In "Imagine", John Lennon presents peace as simple and attainable, and the opening establishes this calm, uncomplicated vision for the audience.',
      elaborate: 'The song is a soft-rock ballad inviting listeners to picture a world without division; its plain, unchanging musical surface carries this meaning.',
      evidence: 'In the opening [timecode], as the lyrics invite the listener to picture a world without division, a solo piano repeats a simple chord pattern at a steady tempo beneath a plain, mostly syllabic vocal.',
      explain: 'The repeating chord pattern creates stability and predictability, so nothing in the music struggles or strains. The steady tempo and narrow dynamic range remove any sense of urgency, making the vision sound calm rather than fought for. The mostly syllabic, unornamented vocal delivers the words plainly, as if the idea needs no persuasion. Together, these choices suggest that peace is not complicated — it is simply a choice the listener could make.',
      summary: 'Through its opening, the song presents peace as calm, simple and within reach.',
      link: 'When gentle strings join in the later verses, this calm vision warms without ever losing its restraint.',
    },
  },
  {
    id: 'teees-006', song: 'zombie', theme: 'conflict', moment: 'Chorus', difficulty: 'confident',
    plan: {
      characteristics: 'Heavily distorted guitars and pounding drums; sudden dynamic contrast; vocal breaks into yodel-like cracks; same four-chord progression underneath.',
      context: 'The first chorus [timecode], straight after the restrained verse.',
      purpose: 'Shows violence erupting — and, through the unchanging chords, repeating without end.',
      impact: 'A jolt of aggression followed by anguish; the audience feels the grief behind the anger.',
    },
    parts: {
      topic: 'In "Zombie", The Cranberries present conflict as a cycle of violence that keeps returning, and the chorus is where that violence erupts most forcefully for the audience.',
      elaborate: 'The song is an alternative rock protest written in response to the 1993 Warrington bombing; its unchanging chord progression and explosive choruses carry this meaning.',
      evidence: 'In the first chorus [timecode], as the lyrics repeat the image of a "zombie", heavily distorted guitars and pounding drums crash in and the vocal cracks into yodel-like breaks.',
      explain: 'The sudden dynamic contrast between the restrained verse and the distorted chorus creates an explosive intensity, like violence breaking out without warning. Beneath this, the same four-chord progression continues unchanged, so however loudly the music erupts, it never moves anywhere new. The yodel-like vocal breaks give the voice a raw, strained timbre, turning the repeated word into a cry of anguish rather than a battle cry. Together, these elements convey conflict as both violent and endlessly repeating, leaving grief in its wake.',
      summary: 'Through the chorus, The Cranberries present conflict as a cycle of violence that cannot be escaped.',
      link: 'This cycle is completed in the final section, where wordless wailing over the same progression replaces words altogether.',
    },
  },
];

// Authored TEEES items: the writing task for each paragraph, plus a few objective checks of the structure.
export const teeesParagraphs = [...teeesBase, ...teeesMore];

export const teeesQuestions = [
  ...teeesParagraphs.map((p) => ({
    id: p.id, type: 'teees', category: 'teees', difficulty: p.difficulty, skills: ['writing', 'evidence', 'effect'],
    song: p.song, theme: p.theme, moment: p.moment,
    prompt: `Plan and write a TEEES paragraph about the ${p.moment.toLowerCase()} of the song.`,
  })),
  {
    id: 'teees-def', type: 'match', category: 'teees', difficulty: 'beginner', skills: ['writing'],
    prompt: 'Match each part of a TEEES paragraph to its job.',
    pairs: [
      { left: 'T — Topic sentence', right: 'States the theme and how the song creates meaning, naming the song and artist' },
      { left: 'E — Elaborate', right: 'Briefly gives context: what key features communicate the song\'s meaning' },
      { left: 'E — Evidence', right: 'Gives a timecode or bar markers and key lyrical ideas' },
      { left: 'E — Explain', right: 'Unpacks the musical characteristics in detail and connects them to the topic sentence' },
      { left: 'S — Summary / link', right: 'Re-establishes the topic sentence, or links to the next paragraph' },
    ],
    explanation: 'Topic → Elaborate → Evidence → Explain → Summary/link. Explain is usually the longest part: it is where the detailed analysis happens.',
  },
  {
    id: 'teees-where', type: 'mcq', category: 'teees', difficulty: 'beginner', skills: ['writing', 'evidence'],
    prompt: 'In a TEEES paragraph, where should the timecode or bar markers go?',
    options: [
      { id: 'a', text: 'Topic sentence', feedback: 'The topic sentence states the theme and meaning — keep it free of detail.' },
      { id: 'b', text: 'Elaborate', feedback: 'Elaborate gives brief context about the song as a whole.' },
      { id: 'c', text: 'Evidence' },
      { id: 'd', text: 'Summary / link', feedback: 'By the summary, the evidence has already been given and explained.' },
    ],
    correctAnswer: 'c',
    explanation: 'Evidence pins the moment down: a timecode or bar markers, plus the key lyrical ideas at that point, so your reader can find exactly what you are analysing.',
  },
  {
    id: 'teees-explain', type: 'mcq', category: 'teees', difficulty: 'developing', skills: ['writing', 'effect'],
    prompt: 'Which sentence belongs in the EXPLAIN part of a TEEES paragraph?',
    options: [
      { id: 'a', text: 'In the first chorus [timecode], the full band enters.', feedback: 'This locates the moment — that is Evidence.' },
      { id: 'b', text: 'The heavily multi-tracked vocals make one singer sound like a crowd, so the victory is heard as shared rather than personal.' },
      { id: 'c', text: 'The song is a rock anthem celebrating success after struggle.', feedback: 'This is brief context about the whole song — Elaborate.' },
      { id: 'd', text: 'In conclusion, the song is about triumph.', feedback: 'A summary — and a weak one, because it does not re-establish a specific idea.' },
    ],
    correctAnswer: 'b',
    explanation: 'Explain unpacks a specific musical characteristic (multi-tracked vocals), says what it does (one singer sounds like a crowd) and connects it to the meaning in the topic sentence (shared victory).',
  },
  {
    id: 'teees-link', type: 'mcq', category: 'teees', difficulty: 'developing', skills: ['writing'],
    song: 'zombie', theme: 'conflict',
    prompt: 'Your paragraph on the chorus of "Zombie" will be followed by a paragraph on the final section. Which is the best way to end it?',
    options: [
      { id: 'a', text: 'In conclusion, Zombie is a good song about conflict.', feedback: 'Not a summary of your idea, and it does not lead anywhere.' },
      { id: 'b', text: 'Through the chorus, The Cranberries present conflict as a cycle of violence that cannot be escaped.', feedback: 'A strong summary — but another paragraph follows, so use this sentence to link to it.' },
      { id: 'c', text: 'This cycle is completed in the final section, where wordless wailing over the same progression replaces words altogether.' },
      { id: 'd', text: 'Next I will talk about the ending.', feedback: 'Signposting your essay is not a link; connect the ideas, not the paragraphs.' },
    ],
    correctAnswer: 'c',
    explanation: 'When more than one paragraph follows, the S becomes a link: it carries the idea forward into the next moment, rather than just announcing it.',
  },
];
