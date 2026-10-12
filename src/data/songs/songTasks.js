// SONG TASKS — written analysis tasks for the second wave of library songs:
// Hallelujah, Bohemian Rhapsody, Smells Like Teen Spirit, Billie Jean, Yesterday, Respect, Treaty,
// Adagio for Strings, In the Hall of the Mountain King and Clocks.
// Each array is merged into its matching set in data/index.js (and teees.js), so these items behave
// exactly like the authored items alongside them.

const fe = { category: 'feature-effect', skills: ['effect', 'evidence'] };
const em = { category: 'evidence-meaning', skills: ['evidence', 'effect'] };
const fm = { category: 'feature-meaning', skills: ['interconnectivity', 'effect'] };
const rel = { category: 'relationships', skills: ['interconnectivity'] };

// ───────────────────────── FEATURE → EFFECT ─────────────────────────
export const featureEffectMore = [
  {
    ...fe, id: 'fe-013', type: 'mcq', difficulty: 'beginner', song: 'hall-of-the-mountain-king',
    context: { feature: 'The same short theme repeats over and over, getting faster and louder each time.', theme: 'danger' },
    prompt: 'Which is the strongest explanation of this feature?',
    options: [
      { id: 'a', text: 'The music gets faster and louder.', feedback: 'Identification only — this is what happens, not what it does.' },
      { id: 'b', text: 'The accelerando and crescendo build excitement.', feedback: 'Better: correct terms and an effect. But excitement about what? Link it to the danger.' },
      { id: 'c', text: 'The accelerando and crescendo applied to one unchanging theme create a sense of something closing in, presenting danger as relentless — nothing new arrives, only more of the same, faster.' },
      { id: 'd', text: 'Fast music is always exciting.', feedback: 'No feature always means one thing. Here, the speed reads as threat, not fun.' },
    ],
    correctAnswer: 'c',
    explanation: 'C names the features (accelerando, crescendo), says what is special about how they are used (on one unchanging theme), and connects the effect (closing in) to the theme of danger.',
  },
  {
    ...fe, id: 'fe-014', type: 'order', difficulty: 'beginner', song: 'smells-like-teen-spirit',
    context: { feature: 'Quiet, almost empty verses are followed by suddenly loud, heavily distorted choruses.', theme: 'rebellion' },
    prompt: 'Arrange these responses from weakest to strongest.',
    items: [
      { id: 'a', text: 'The chorus is loud.' },
      { id: 'b', text: 'There is dynamic contrast between the verse and the chorus.' },
      { id: 'c', text: 'The sudden dynamic contrast between the subdued verse and the distorted chorus creates an explosive release of energy.' },
      { id: 'd', text: 'The sudden dynamic contrast between the subdued verse and the distorted chorus creates an explosive release of energy, presenting rebellion as frustration that hides beneath boredom until it bursts out.' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    explanation: 'Identify → name with terminology (dynamic contrast) → describe the effect (explosive release) → connect to meaning (frustration hidden beneath boredom). That last step is what makes it analysis.',
  },
  {
    ...fe, id: 'fe-015', type: 'mcq', difficulty: 'developing', song: 'billie-jean',
    context: { feature: 'The same bass line repeats under the whole song while the vocal grows more insistent.', theme: 'paranoia' },
    prompt: 'Which explanation is most analytical?',
    options: [
      { id: 'a', text: 'The bass line is very catchy and makes you want to dance.', feedback: 'True for many listeners — but this is a personal response, not analysis of meaning.' },
      { id: 'b', text: 'The bass line is an ostinato.', feedback: 'Correct terminology, but no effect or meaning.' },
      { id: 'c', text: 'The unchanging bass ostinato forms a groove that never lets up, so as the vocal becomes more insistent above it, the speaker sounds trapped inside the same situation, presenting paranoia as a loop he cannot escape.' },
      { id: 'd', text: 'Minor keys show the singer is upset.', feedback: '"Minor = upset" is a formula. What matters here is how the repetition and the vocal interact.' },
    ],
    correctAnswer: 'c',
    explanation: 'C uses the term (ostinato), explains the effect of the repetition against a changing vocal (trapped, a loop), and connects it to paranoia. It reads the combination, not one feature on its own.',
  },
  {
    ...fe, id: 'fe-016', type: 'mcq', difficulty: 'developing', song: 'adagio-for-strings',
    context: { feature: 'Straight after the fortissimo climax in a very high register, the whole orchestra stops: a sudden silence.', theme: 'grief' },
    prompt: 'Which explanation best captures the effect of the silence?',
    options: [
      { id: 'a', text: 'The orchestra stops playing for a moment.', feedback: 'Identification — and it undersells how sudden and complete the stop is.' },
      { id: 'b', text: 'The general pause after the anguished fortissimo climax leaves the tension hanging with nowhere to go, creating an emptiness that presents grief as something that overwhelms and then leaves only absence.' },
      { id: 'c', text: 'The silence gives the musicians a rest.', feedback: 'A practical reason, not a musical effect or meaning.' },
      { id: 'd', text: 'Silence is always sad.', feedback: 'Silence can be suspenseful, peaceful, comic or shocking. Its meaning depends on what comes before and after.' },
    ],
    correctAnswer: 'b',
    explanation: 'B names the feature precisely (general pause), places it in context (straight after the climax), describes the effect (tension hanging, emptiness) and links it to grief.',
  },
  {
    ...fe, id: 'fe-017', type: 'mcq', difficulty: 'beginner', song: 'respect',
    context: { feature: 'Backing vocals answer the lead singer\'s lines throughout the song.', theme: 'empowerment' },
    prompt: 'Which is the strongest explanation of this feature?',
    options: [
      { id: 'a', text: 'There are backing singers.', feedback: 'Identification only.' },
      { id: 'b', text: 'The call and response between the lead and backing vocals creates a sense of support, turning one woman\'s demand into a collective one and presenting empowerment as shared.' },
      { id: 'c', text: 'The backing vocals make the song sound fuller.', feedback: 'True, but stops at the effect on texture. What does it suggest?' },
      { id: 'd', text: 'Call and response is used.', feedback: 'Correct term, no effect or meaning.' },
    ],
    correctAnswer: 'b',
    explanation: 'B names the technique, explains its effect (support) and connects it to meaning (a collective demand). The other options each stop one or two steps short.',
  },
  {
    ...fe, id: 'fe-018', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'clocks',
    context: { feature: 'A fast, repeating piano arpeggio riff runs through the whole song without stopping.', theme: 'urgency' },
    theme: 'urgency',
    prompt: 'Write your own explanation: feature → effect → meaning.',
    starter: 'The ',
    expect: ['terminology', 'evidence', 'effect', 'meaning', 'theme'],
    hints: ['Name the feature precisely: what kind of figure is it, and how often does it repeat?', 'What does something that never stops cycling sound like? A ticking clock? A racing heart?', 'Link it to urgency with an analytical verb.'],
    models: [{ text: 'The fast, repeating piano arpeggio riff cycles through the whole song without stopping, creating a restless, ticking momentum that conveys urgency, as if time keeps running on regardless of the speaker.', why: 'Terminology (arpeggio, riff), evidence (repeating, the whole song), effect (restless, ticking momentum) and meaning (time running on).' }],
  },
  {
    ...fe, id: 'fe-019', type: 'mcq', difficulty: 'confident', song: 'bohemian-rhapsody',
    context: { feature: 'The song moves through sharply contrasting sections — ballad, mock opera, hard rock — with no repeating chorus.', theme: 'guilt' },
    prompt: 'Which explanation is most analytical?',
    options: [
      { id: 'a', text: 'The song has lots of different parts, which makes it interesting.', feedback: '"Interesting" is an opinion. What do the changes do?' },
      { id: 'b', text: 'The song is through-composed.', feedback: 'Correct terminology but no effect or meaning.' },
      { id: 'c', text: 'The through-composed form never returns to a chorus, so the speaker cannot settle anywhere; each abrupt change of style sounds like a different voice arguing, presenting guilt as a state of mind that is fractured and restless.' },
      { id: 'd', text: 'The opera part is funny.', feedback: 'It can sound theatrical — but this response does not link that to meaning.' },
    ],
    correctAnswer: 'c',
    explanation: 'C names the form, explains what the lack of a returning chorus does (no settling) and what the contrasts suggest (different voices arguing), then connects to guilt.',
  },
  {
    ...fe, id: 'fe-020', type: 'short', mode: 'analysis', difficulty: 'confident', song: 'yesterday',
    context: { feature: 'In the later verses, a string quartet joins the voice and acoustic guitar with sustained lines underneath.', theme: 'regret' },
    theme: 'regret',
    prompt: 'Explain the effect of the strings in context. Strings do not have one fixed meaning — what do they do here?',
    expect: ['terminology', 'effect', 'meaning', 'theme'],
    hints: ['Strings can sound grand, romantic or tense. Is this a big orchestra or a small quartet?', 'Do the strings lift the mood or deepen it?'],
    models: [{ text: 'The string quartet adds sustained lines beneath the voice without making the texture much louder or fuller, which creates a sense of intimacy and deepens the reflective mood rather than lifting it, so regret is presented as private and lingering rather than dramatic.', why: 'Reads the strings in context: a small, sustained quartet, not a grand orchestra, so the effect is intimate.' }],
  },
  {
    ...fe, id: 'fe-021', type: 'mcq', difficulty: 'developing', song: 'treaty',
    context: { feature: 'The yidaki (didgeridoo) and bilma (clapsticks) play alongside electric guitar, bass and drums.', theme: 'reconciliation' },
    prompt: 'Which explanation is strongest?',
    options: [
      { id: 'a', text: 'The song uses a didgeridoo and a guitar.', feedback: 'Identification — and "yidaki" is the more accurate, culturally appropriate term.' },
      { id: 'b', text: 'The fusion of Yolŋu instruments (yidaki and bilma) with electric guitar, bass and drums means the two musical cultures sound at the same time, presenting reconciliation as two peoples standing together on equal terms.' },
      { id: 'c', text: 'Traditional instruments always sound ancient.', feedback: 'A generalisation. Here they are part of a modern dance-rock song — that combination is the point.' },
      { id: 'd', text: 'The instruments make the song more exciting.', feedback: 'Vague effect, no meaning.' },
    ],
    correctAnswer: 'b',
    explanation: 'B uses accurate terminology (yidaki, bilma, fusion), says what the combination does and connects it to reconciliation.',
  },
  {
    ...fe, id: 'fe-022', type: 'mcq', difficulty: 'confident', song: 'hallelujah',
    context: { feature: 'The lyric about "the fourth, the fifth, the minor fall, the major lift" is sung over exactly those chords.', theme: 'faith' },
    prompt: 'Which explanation best captures this feature?',
    options: [
      { id: 'a', text: 'The lyrics are about music.', feedback: 'True, but no analysis of what the music does.' },
      { id: 'b', text: 'This is word painting.', feedback: 'Correct term — but what is its effect?' },
      { id: 'c', text: 'The word painting makes the harmony enact the lyric, so the listener hears the "minor fall" and "major lift" as they are described; this self-aware moment suggests that faith and praise can be built, even performed, rather than simply felt.' },
      { id: 'd', text: 'The minor chord is sad and the major chord is happy.', feedback: 'This turns a subtle moment into a formula. The song is interested in the movement between them.' },
    ],
    correctAnswer: 'c',
    explanation: 'C names the device, explains what the listener experiences, and makes an interpretive claim about faith. Note that it avoids "minor = sad, major = happy".',
  },
];

// ───────────────────────── EVIDENCE → MEANING ─────────────────────────
export const evidenceMeaningMore = [
  {
    ...em, id: 'em-011', type: 'mcq', difficulty: 'beginner', song: 'yesterday',
    context: { theme: 'regret', evidence: 'Voice and acoustic guitar alone in the first verse, with phrases that often fall at their endings.' },
    prompt: 'How could this evidence contribute to the presentation of regret?',
    options: [
      { id: 'a', text: 'The song is sad because the melody goes down.', feedback: '"Down = sad" is a formula. What does the falling shape suggest about the speaker?' },
      { id: 'b', text: 'The bare voice-and-guitar texture makes the song feel like a private confession, and the falling phrase endings suggest a speaker sinking back into memory — presenting regret as quiet and inward.' },
      { id: 'c', text: 'There is a guitar and a singer.', feedback: 'Identification only.' },
      { id: 'd', text: 'All acoustic songs are about regret.', feedback: 'No instrument carries a fixed meaning.' },
    ],
    correctAnswer: 'b',
    explanation: 'B combines two pieces of evidence (texture and melodic shape), interprets each, and builds an argument about how regret is presented.',
    contextNote: '"Yesterday" is often described as being in a major key. The sense of regret comes from the lyrics, the falling phrases and the intimate texture — not from tonality.',
    followUp: { prompt: 'Write your own sentence linking the intimate texture to regret.', theme: 'regret' },
  },
  {
    ...em, id: 'em-012', type: 'mcq', difficulty: 'developing', song: 'respect',
    context: { theme: 'empowerment', evidence: 'The word "respect" is spelled out letter by letter, followed by more rapid call and response.' },
    prompt: 'Which interpretation is most defensible?',
    options: [
      { id: 'a', text: 'Spelling out the word over the syncopated groove creates a deliberate pause in the lyric that makes the demand unmistakable — as if the speaker is refusing to be misunderstood — presenting empowerment as clear, confident and non-negotiable.' },
      { id: 'b', text: 'The singer spells a word.', feedback: 'Identification only.' },
      { id: 'c', text: 'Spelling is a fun gimmick.', feedback: 'It is memorable — but ask what it does for the meaning.' },
      { id: 'd', text: 'It shows the singer is angry.', feedback: 'Possible, but unsupported. What in the delivery suggests confidence rather than anger?' },
    ],
    correctAnswer: 'a',
    explanation: 'A explains what the device does (makes the demand unmistakable) and why that matters for the theme (empowerment as non-negotiable).',
    contextNote: 'Released in 1967, during the civil rights and women\'s movements, the song was widely heard as a wider call for respect — context strengthens this reading.',
    followUp: { prompt: 'Write one sentence linking the call and response to empowerment.', theme: 'empowerment' },
  },
  {
    ...em, id: 'em-013', type: 'mcq', difficulty: 'developing', song: 'billie-jean',
    context: { theme: 'pressure', evidence: 'The introduction builds layer by layer: drums alone, then the bass line, then synth chords.' },
    prompt: 'How could this evidence contribute to the presentation of pressure?',
    options: [
      { id: 'a', text: 'The introduction is long.', feedback: 'Description only.' },
      { id: 'b', text: 'Each new layer locks into the same tight groove, creating a sense of the texture tightening around the listener before the vocal even begins — presenting pressure as something that surrounds the speaker from the start.' },
      { id: 'c', text: 'Drums always create tension.', feedback: 'Drums can create many effects. Explain what these drums do here.' },
      { id: 'd', text: 'The song is in a minor key, which means it is about something bad.', feedback: 'A formula — and it ignores the evidence given, which is about texture.' },
    ],
    correctAnswer: 'b',
    explanation: 'B interprets the gradual layering (tightening, surrounding) and connects it to the theme. It stays on the evidence it was given.',
    contextNote: 'The groove is also danceable — a strong response might argue that the pressure is hidden beneath a smooth, controlled surface.',
    followUp: { prompt: 'Write a sentence explaining how the danceable groove could complicate the idea of pressure.', theme: 'pressure' },
  },
  {
    ...em, id: 'em-014', type: 'mcq', difficulty: 'beginner', song: 'hall-of-the-mountain-king',
    context: { theme: 'tension', evidence: 'The piece opens very quietly, slowly, in low bassoons and plucked (pizzicato) strings.' },
    prompt: 'How could this evidence contribute to the presentation of tension?',
    options: [
      { id: 'a', text: 'The low register and quiet, detached pizzicato sound like creeping footsteps, so the listener senses something approaching before it arrives — creating suspense that heightens the tension and suggests a danger that the rest of the piece unleashes.' },
      { id: 'b', text: 'It starts quietly.', feedback: 'Identification only.' },
      { id: 'c', text: 'Low instruments are scary.', feedback: 'Low instruments can also be warm, calm or comic. Why do they sound threatening here?' },
      { id: 'd', text: 'Bassoons are woodwind instruments.', feedback: 'Correct, but not analysis.' },
    ],
    correctAnswer: 'a',
    explanation: 'A combines register, dynamics and articulation (pizzicato) into an image (creeping footsteps) and an effect (suspense).',
    contextNote: 'In Ibsen\'s play Peer Gynt, this music accompanies Peer being chased by trolls in the mountain king\'s hall — the dramatic context supports a reading of approaching danger.',
    followUp: { prompt: 'Write your own sentence linking the opening to tension.', theme: 'tension' },
  },
  {
    ...em, id: 'em-015', type: 'mcq', difficulty: 'confident', song: 'adagio-for-strings',
    context: { theme: 'mourning', evidence: 'A slow, mostly stepwise melody that keeps reaching upwards over sustained string chords.' },
    prompt: 'Which interpretation is most defensible?',
    options: [
      { id: 'a', text: 'The melody is slow because the piece is sad.', feedback: '"Slow = sad" skips the analysis. What does the reaching shape add?' },
      { id: 'b', text: 'The melody moves by step.', feedback: 'Accurate, but no interpretation.' },
      { id: 'c', text: 'The stepwise melody keeps reaching upwards but rarely arrives anywhere stable, and the sustained chords beneath it hold the tension, presenting mourning as a long, aching effort to rise above loss.' },
      { id: 'd', text: 'Strings always sound emotional.', feedback: 'A generalisation. The meaning comes from how they are used here.' },
    ],
    correctAnswer: 'c',
    explanation: 'C connects melodic shape (reaching, rarely arriving), texture (sustained chords) and meaning (an aching effort to rise above loss).',
    contextNote: 'Adagio for Strings has been played at many memorials and state funerals. That reception history can be mentioned, but your argument must still rest on the music.',
    followUp: { prompt: 'Now write your own version linking the melody to mourning.', theme: 'mourning' },
  },
  {
    ...em, id: 'em-016', type: 'mcq', difficulty: 'developing', song: 'smells-like-teen-spirit',
    context: { theme: 'alienation', evidence: 'A low, mumbled vocal in the verses over a sparse texture.' },
    prompt: 'How could this evidence contribute to the presentation of alienation?',
    options: [
      { id: 'a', text: 'The singer is hard to understand.', feedback: 'True, but what does that suggest?' },
      { id: 'b', text: 'The mumbled, low-register vocal delivery makes the speaker sound detached and disengaged, as if he does not expect to be heard — presenting alienation as apathy that hides deeper frustration.' },
      { id: 'c', text: 'Grunge singers always mumble.', feedback: 'A genre generalisation. Explain what it does in this song.' },
      { id: 'd', text: 'The verse is quiet.', feedback: 'Identification only.' },
    ],
    correctAnswer: 'b',
    explanation: 'B interprets the delivery (detached, disengaged) and builds an argument about alienation, setting up the contrast with the screamed chorus.',
    contextNote: 'The meaning of the mumbled verse depends on what follows: the screamed chorus reveals the frustration underneath.',
    followUp: { prompt: 'Write a sentence connecting the mumbled verse to the screamed chorus.', theme: 'alienation' },
  },
  {
    ...em, id: 'em-017', type: 'mcq', difficulty: 'confident', song: 'treaty',
    context: { theme: 'culture', evidence: 'The song is sung in both English and Yolŋu Matha.' },
    prompt: 'Which interpretation is most defensible?',
    options: [
      { id: 'a', text: 'The two languages show that the band is bilingual.', feedback: 'A fact about the performers, not an interpretation.' },
      { id: 'b', text: 'Singing in Yolŋu Matha over the driving dance beat and rock instrumentation of a mainstream pop song creates a striking contrast that asserts that Yolŋu culture belongs in the national conversation, and placing it beside English presents culture as something shared and continuing rather than lost.' },
      { id: 'c', text: 'Non-English lyrics make songs more mysterious.', feedback: 'This treats Yolŋu Matha as exotic rather than meaningful. Consider why it is there.' },
      { id: 'd', text: 'Some of the words are not in English.', feedback: 'Identification only.' },
    ],
    correctAnswer: 'b',
    explanation: 'B interprets the bilingual lyrics in their context (a mainstream hit) and argues about how culture is presented.',
    contextNote: 'Treaty (1991) responded to the unfulfilled 1988 promise of a treaty between the Australian Government and Aboriginal peoples. It became the first song by a predominantly Aboriginal band to chart in Australia.',
    followUp: { prompt: 'Write your own sentence linking the bilingual lyrics to culture.', theme: 'culture' },
  },
  {
    ...em, id: 'em-018', type: 'mcq', difficulty: 'developing', song: 'hallelujah',
    context: { theme: 'doubt', evidence: 'Every verse ends with the same one-word refrain, "Hallelujah", over a rising then settling melodic line.' },
    prompt: 'How could this evidence contribute to the presentation of doubt?',
    options: [
      { id: 'a', text: 'Because the same word returns after verses about very different experiences, it seems to mean something different each time — praise, longing, exhaustion — presenting faith as uncertain and shifting, shaped by doubt.' },
      { id: 'b', text: '"Hallelujah" means praise, so the song is about praise.', feedback: 'This ignores how the verses change the meaning of the refrain.' },
      { id: 'c', text: 'The refrain repeats.', feedback: 'Identification only.' },
      { id: 'd', text: 'Repetition is boring.', feedback: 'Repetition is a deliberate choice — ask what it does.' },
    ],
    correctAnswer: 'a',
    explanation: 'A shows how repetition can change meaning: the same refrain sounds different after each verse. That instability supports a reading about doubt.',
    contextNote: 'Many artists have recorded the song; Jeff Buckley\'s 1994 cover is especially well known. Compare versions — the meaning of the refrain can shift with the performance.',
    followUp: { prompt: 'Write one sentence about how the rising-then-settling refrain melody adds to this reading.', theme: 'doubt' },
  },
  {
    ...em, id: 'em-019', type: 'mcq', difficulty: 'beginner', song: 'clocks',
    context: { theme: 'time', evidence: 'The piano riff continues at the end as the other layers drop away.' },
    prompt: 'How could this evidence contribute to the presentation of time?',
    options: [
      { id: 'a', text: 'The song ends.', feedback: 'Identification — what is special about how it ends?' },
      { id: 'b', text: 'Leaving the riff alone as everything else falls away suggests that time keeps going even after the moment has passed, presenting time as indifferent to the speaker.' },
      { id: 'c', text: 'Pianos always sound like clocks.', feedback: 'It is this riff — fast and constantly cycling — that suggests a clock, not the instrument itself.' },
      { id: 'd', text: 'The song is called Clocks so it is about time.', feedback: 'The title helps, but your evidence must be musical.' },
    ],
    correctAnswer: 'b',
    explanation: 'B interprets a structural choice (the riff outlasting everything else) and connects it to time.',
    contextNote: 'The title invites a "ticking clock" reading — use it, but support it with what the music does.',
    followUp: { prompt: 'Write your own version linking the ending to the theme of time.', theme: 'time' },
  },
  {
    ...em, id: 'em-020', type: 'mcq', difficulty: 'confident', song: 'bohemian-rhapsody',
    context: { theme: 'fate', evidence: 'After the hard-rock section, the music slows to a quiet piano close and a final gong.' },
    prompt: 'Which interpretation is most defensible?',
    options: [
      { id: 'a', text: 'The song ends quietly because it is over.', feedback: 'Every song ends — ask why it ends this way.' },
      { id: 'b', text: 'The gong is a percussion instrument.', feedback: 'True, but no interpretation.' },
      { id: 'c', text: 'After the defiance of the hard-rock section, the return to a quiet, slow piano texture sounds like exhaustion, and the final gong sounds like a sentence being passed — presenting fate as something the speaker finally accepts.' },
      { id: 'd', text: 'Quiet endings always mean peace.', feedback: 'A quiet ending can mean peace, resignation, exhaustion or death. Context decides.' },
    ],
    correctAnswer: 'c',
    explanation: 'C reads the ending against what came before it (defiance → exhaustion) and turns the gong into evidence for an argument about fate.',
    contextNote: 'The song never explains its own story, so several readings are defensible. Your job is to choose one and support it.',
    followUp: { prompt: 'Write a sentence offering a different, defensible reading of the quiet ending.', theme: 'fate' },
  },
];

// ───────────────────────── CONNECT: FEATURE → MEANING ─────────────────────────
export const featureMeaningMore = [
  {
    ...fm, id: 'fm-015', type: 'mcq', difficulty: 'beginner', song: 'respect', theme: 'empowerment',
    prompt: 'In "Respect", Aretha Franklin belts the melody with a powerful, gospel-influenced tone. Which sentence connects this feature to meaning?',
    options: [
      { id: 'a', text: 'She sings loudly.', feedback: 'Describes the feature only.' },
      { id: 'b', text: 'The powerful, belted vocal sounds confident and unafraid, suggesting that respect is being demanded rather than asked for.' },
      { id: 'c', text: 'Aretha Franklin was a famous singer.', feedback: 'A fact about the performer, not a connection to meaning.' },
      { id: 'd', text: 'Loud singing is always angry.', feedback: 'A formula. Here it reads as confidence.' },
    ],
    correctAnswer: 'b',
    explanation: 'Feature (belted vocal) → effect (confident, unafraid) → meaning (respect demanded, not requested).',
  },
  {
    ...fm, id: 'fm-016', type: 'multi', difficulty: 'developing', song: 'billie-jean', theme: 'paranoia',
    prompt: 'Which features of "Billie Jean" could you connect to the idea of paranoia? Select all that apply.',
    options: [
      { id: 'a', text: 'The bass ostinato that repeats under the whole song' },
      { id: 'b', text: 'Short synth chord stabs' },
      { id: 'c', text: 'Strings entering later and adding tension' },
      { id: 'd', text: 'A slow, rubato a cappella introduction', feedback: 'This does not happen in the song — it opens with drums.' },
      { id: 'e', text: 'A key change up a semitone for the last chorus', feedback: 'This does not happen in the song.' },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation: 'The unchanging ostinato suggests a loop the speaker cannot escape; the short stabs add a nervous edge; the strings increase tension later on. Only connect features the music actually contains.',
  },
  {
    ...fm, id: 'fm-017', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'adagio-for-strings', theme: 'grief',
    prompt: 'In "Adagio for Strings", the music builds slowly to a fortissimo climax in a very high register. Connect this feature to the theme of grief in one or two sentences.',
    hints: ['How long does the build take, and how does the climax sound — triumphant, or strained?', 'What does that suggest about grief?'],
    expect: ['terminology', 'effect', 'meaning'],
    models: [{ text: 'The long, gradual crescendo to a fortissimo climax in a strained, high register makes the strings sound as if they are crying out, suggesting that grief builds until it becomes almost unbearable.', why: 'Terminology (crescendo, fortissimo, register), effect (crying out), meaning (grief building until unbearable).' }],
  },
  {
    ...fm, id: 'fm-018', type: 'mcq', difficulty: 'developing', song: 'treaty', theme: 'reconciliation',
    prompt: 'In "Treaty", bilma (clapsticks) and yidaki establish the pulse before the band enters. Which interpretation best links this to reconciliation?',
    options: [
      { id: 'a', text: 'Because the Yolŋu instruments set the pulse that the band then joins, the song suggests that reconciliation should begin from Aboriginal culture and be met on its terms.' },
      { id: 'b', text: 'The song has a long introduction.', feedback: 'Describes the structure but makes no connection.' },
      { id: 'c', text: 'Clapsticks are a traditional instrument.', feedback: 'True, but no connection to meaning.' },
      { id: 'd', text: 'The band comes in late because they were not ready.', feedback: 'Not an interpretation supported by the music.' },
    ],
    correctAnswer: 'a',
    explanation: 'The order of entry is a deliberate choice. Reading who leads and who joins turns a structural detail into an argument.',
  },
  {
    ...fm, id: 'fm-019', type: 'short', mode: 'analysis', difficulty: 'beginner', song: 'hall-of-the-mountain-king', theme: 'danger',
    prompt: 'By the end of "In the Hall of the Mountain King", the full orchestra plays the theme very fast and fortissimo. Write one sentence connecting this feature to the theme of danger.',
    starter: 'The full orchestra ',
    hints: ['Compare it with the quiet, slow opening.', 'What does that change suggest about the danger?'],
    expect: ['effect', 'meaning'],
    models: [{ text: 'The full orchestra playing the theme at a frantic tempo and fortissimo creates a sense of chaos, suggesting that the danger which crept in quietly has finally caught up.', why: 'Feature → effect (chaos) → meaning (danger has caught up), using the contrast with the opening.' }],
  },
  {
    ...fm, id: 'fm-020', type: 'mcq', difficulty: 'confident', song: 'smells-like-teen-spirit', theme: 'youth',
    prompt: 'In "Smells Like Teen Spirit", a raw, screamed vocal arrives in each chorus after mumbled verses. What does this most convincingly suggest about youth?',
    options: [
      { id: 'a', text: 'That young people are loud.', feedback: 'A stereotype, not an interpretation of the music.' },
      { id: 'b', text: 'That youth is a mix of boredom and buried frustration: the apathy of the verses is not the whole truth, and the scream reveals what it hides.' },
      { id: 'c', text: 'That the singer was tired in the verses.', feedback: 'A literal reading that misses how the contrast creates meaning.' },
      { id: 'd', text: 'That the chorus is the best part.', feedback: 'An opinion, not analysis.' },
    ],
    correctAnswer: 'b',
    explanation: 'The meaning comes from the contrast. Neither the mumble nor the scream alone carries the argument.',
  },
];

// ───────────────────────── CONNECT: REINFORCE · CONTRAST · DEVELOP ─────────────────────────
const RELOPTS = (fb) => [
  { id: 'a', text: 'They reinforce each other', ...(fb.a ? { feedback: fb.a } : {}) },
  { id: 'b', text: 'They contrast with each other', ...(fb.b ? { feedback: fb.b } : {}) },
  { id: 'c', text: 'One develops the other', ...(fb.c ? { feedback: fb.c } : {}) },
  { id: 'd', text: 'They are unrelated', feedback: 'Elements in the same song almost always interact. Ask how.' },
];

export const relationshipMore = [
  {
    ...rel, id: 'rel-013', type: 'mcq', difficulty: 'beginner', song: 'yesterday', theme: 'regret',
    prompt: '"Yesterday": falling phrase endings + an intimate voice-and-guitar texture. What is the relationship?',
    options: RELOPTS({ b: 'Both suggest something quiet and inward, so they work in the same direction.', c: 'Neither changes the other over time here; they act together.' }),
    correctAnswer: 'a',
    explanation: 'Falling phrases suggest sinking into memory; the intimate texture makes it private. Same direction = reinforce.',
  },
  {
    ...rel, id: 'rel-014', type: 'mcq', difficulty: 'developing', song: 'smells-like-teen-spirit', theme: 'rebellion',
    prompt: '"Smells Like Teen Spirit": the subdued, mumbled verse + the distorted, screamed chorus. What is the relationship?',
    options: RELOPTS({ a: 'They pull in opposite directions — apathy against fury. That is contrast.', c: 'The chorus does not grow out of the verse gradually — it bursts in.' }),
    correctAnswer: 'b',
    explanation: 'Quiet, detached verse against loud, raw chorus: the meaning lives in the gap between them.',
  },
  {
    ...rel, id: 'rel-015', type: 'mcq', difficulty: 'developing', song: 'hall-of-the-mountain-king', theme: 'danger',
    prompt: '"In the Hall of the Mountain King": the quiet opening statement of the theme + its later, fast, fortissimo repetitions. What is the relationship?',
    options: RELOPTS({ a: 'They are not simply working side by side — one grows out of the other across time.', b: 'They are the same theme, so the later versions extend the opening rather than oppose it.' }),
    correctAnswer: 'c',
    explanation: 'The theme stays the same but grows faster, louder and fuller: the later statements develop what the opening set up.',
  },
  {
    ...rel, id: 'rel-016', type: 'mcq', difficulty: 'confident', song: 'billie-jean', theme: 'pressure',
    prompt: '"Billie Jean": a danceable, controlled groove + lyrics about accusation and denial. What is the relationship?',
    options: RELOPTS({ a: 'A smooth, danceable surface and anxious lyrics pull in different directions.', c: 'Neither one changes the other over time; they sit side by side.' }),
    correctAnswer: 'b',
    explanation: 'The cool, controlled groove contrasts with the anxious lyrics, which can be read as a speaker trying to keep his composure under pressure.',
  },
  {
    ...rel, id: 'rel-017', type: 'short', mode: 'analysis', difficulty: 'developing', song: 'respect', theme: 'empowerment',
    prompt: 'In "Respect", the belted lead vocal is answered by backing vocals. Write one sentence that names how these two elements relate and what they create together. Use linking language.',
    hints: ['Do they point the same way, pull apart, or does one build on the other?', 'Linking language: "while", "and at the same time", "together these…"'],
    expect: ['effect', 'meaning'],
    models: [{ text: 'The confident, belted lead vocal is reinforced by the backing vocals answering each line, and together these elements create a sense of collective support, suggesting that empowerment is shared rather than individual.', why: 'Names the relationship (reinforced), uses linking language (together these) and gives the combined meaning.' }],
  },
  {
    ...rel, id: 'rel-018', type: 'short', mode: 'analysis', difficulty: 'confident', song: 'clocks', theme: 'urgency',
    prompt: 'In "Clocks", the texture fills out across the song, but the piano riff never changes. Write one or two sentences explaining how these two elements relate. Use linking language.',
    hints: ['One element changes, the other does not. Is that contrast, or does one develop the other?', 'What does the unchanging riff suggest beneath the growing texture?'],
    expect: ['effect', 'meaning'],
    models: [{ text: 'While the texture grows fuller around it, the piano riff never changes, and this contrast creates a sense that time keeps ticking on regardless of everything else, conveying urgency as something constant beneath the song.', why: 'Linking language (while, this contrast), names the relationship and gives its effect and meaning.' }],
  },
];

// ───────────────────────── TEEES MODEL PARAGRAPHS ─────────────────────────
export const teeesMore = [
  {
    id: 'teees-007', song: 'smells-like-teen-spirit', theme: 'rebellion', moment: 'First chorus', difficulty: 'developing',
    plan: {
      characteristics: 'Sudden dynamic contrast; heavily distorted power chords; raw, screamed vocal after a mumbled verse.',
      context: 'The first chorus [timecode], straight after a subdued verse with an almost empty texture.',
      purpose: 'Shows the frustration hidden under the verse\'s apathy bursting out.',
      impact: 'The audience is jolted by the sudden volume; the release feels cathartic.',
    },
    parts: {
      topic: 'In "Smells Like Teen Spirit", Nirvana present rebellion as frustration hidden beneath apathy, and the first chorus is where that frustration bursts out for the audience.',
      elaborate: 'The song is a grunge anthem about a bored, disaffected generation; its quiet–loud structure and contrast between mumbled and screamed vocals carry this meaning.',
      evidence: 'In the first chorus [timecode], as Cobain sings a string of disconnected images, the full band returns at full volume after the subdued verse.',
      explain: 'The sudden dynamic contrast between the near-empty verse and the chorus creates a jolt, so the release of energy feels explosive rather than gradual. Heavily distorted power chords thicken the texture and add a harsh, abrasive timbre, while the vocal shifts from a low mumble into a raw scream. Together, these elements suggest that the apathy of the verse was only a surface, and that the rebellion underneath has been building all along.',
      summary: 'Through this chorus, Nirvana present rebellion as frustration that cannot stay hidden beneath apathy.',
      link: 'However, the next verse returns to the same subdued texture, suggesting that this rebellion keeps sinking back into apathy before it erupts again.',
    },
  },
  {
    id: 'teees-008', song: 'adagio-for-strings', theme: 'grief', moment: 'Climax and silence', difficulty: 'confident',
    plan: {
      characteristics: 'Long crescendo to fortissimo; very high register in the violins; sudden general pause.',
      context: 'The climax [timecode], after several minutes of slow, legato build.',
      purpose: 'Shows grief growing beyond endurance and leaving an emptiness behind.',
      impact: 'The audience feels the tension peak and then hang in the silence; it can feel overwhelming.',
    },
    parts: {
      topic: 'In "Adagio for Strings", Samuel Barber presents grief as something that builds beyond endurance and then leaves only emptiness, and the climax is where the audience feels this most.',
      elaborate: 'The piece is a slow work for string orchestra, often played at memorials; its seamless legato texture and long, gradual build carry this meaning.',
      evidence: 'At the climax [timecode], after the melody has climbed for several minutes, the strings reach a very high register at fortissimo and then stop completely. As there are no lyrics, the musical line itself carries the meaning.',
      explain: 'The long crescendo to fortissimo pushes the violins into a strained, high register, so the sound becomes intense and almost painful, like a cry. Because the melody has been reaching upwards by step for so long, this peak feels like the limit of what can be endured. The general pause that follows leaves the tension unresolved: the silence sounds like absence. Together, the climax and the silence suggest that grief overwhelms and then leaves only emptiness.',
      summary: 'Through the climax and the silence that follows, Barber presents grief as overwhelming, leaving an emptiness behind.',
      link: 'This emptiness is developed in the closing section, where the opening material returns quietly and fades without a clear resolution.',
    },
  },
  {
    id: 'teees-009', song: 'respect', theme: 'empowerment', moment: 'Spelled-out section', difficulty: 'beginner',
    plan: {
      characteristics: 'The word spelled out letter by letter; belted vocal; call and response with backing vocals; horn stabs.',
      context: 'The middle section [timecode], straight after the saxophone solo.',
      purpose: 'Makes the demand for respect unmistakable and shows others supporting it.',
      impact: 'The audience hears a confident demand they can join in with; it feels like a rallying cry.',
    },
    parts: {
      topic: 'In "Respect", Aretha Franklin presents empowerment as a confident demand that others take up, and the spelled-out section is where the audience hears this most clearly.',
      elaborate: 'The song is a soul track in which the speaker insists on being treated with respect; its belted vocal, driving beat and call and response carry this meaning.',
      evidence: 'In the middle section [timecode], after the saxophone solo, Franklin sings the word "respect" letter by letter, and the backing vocals answer her.',
      explain: 'Spelling out the word slows the lyric down, so the demand becomes impossible to misunderstand. The belted, gospel-influenced vocal sounds confident rather than pleading, and the punchy horn stabs and driving beat add energy. Meanwhile, the call and response with the backing vocals creates a sense of support, turning one woman\'s demand into a collective one. Together, these choices convey empowerment as confident, clear and shared.',
      summary: 'In this section, Franklin presents empowerment as a confident demand that others take up with her.',
      link: 'This collective energy builds towards the ending, where the call and response becomes faster and more insistent as the song fades.',
    },
  },
  {
    id: 'teees-010', song: 'hall-of-the-mountain-king', theme: 'danger', moment: 'Whole-piece build', difficulty: 'beginner',
    plan: {
      characteristics: 'One theme repeated; accelerando and crescendo; instruments added until the full orchestra plays.',
      context: 'From the quiet opening [timecode] to the frantic ending.',
      purpose: 'Shows danger closing in — nothing new, only more of the same, faster.',
      impact: 'The audience feels tension rise steadily until it becomes chaotic.',
    },
    parts: {
      topic: 'In "In the Hall of the Mountain King", Grieg presents danger as something that closes in relentlessly, and the build across the whole piece lets the audience feel it approach.',
      elaborate: 'The piece is orchestral music written for the play Peer Gynt, in which the hero is chased by trolls; one short theme, repeated with more and more intensity, carries this meaning.',
      evidence: 'The theme begins quietly in the bassoons and pizzicato strings [timecode] and repeats again and again until the full orchestra plays it at a frantic tempo. There are no lyrics, so the music tells the story of the chase.',
      explain: 'The low register and detached pizzicato of the opening sound like creeping footsteps, creating suspense. With each repetition, a gradual accelerando and crescendo increase the intensity, and more instruments join, thickening the texture. Because the theme itself never changes, nothing new arrives: the danger simply grows faster, louder and closer. By the end, the tutti fortissimo sounds chaotic, as if the danger has finally caught up.',
      summary: 'Through this relentless build, Grieg presents danger as closing in until it can no longer be escaped.',
      link: 'This build is completed by the crashing final chords, which end the chase abruptly.',
    },
  },
  {
    id: 'teees-011', song: 'yesterday', theme: 'regret', moment: 'Bridge', difficulty: 'developing',
    plan: {
      characteristics: 'Contrasting middle section; the melody rises as the speaker asks why, then falls back; string quartet beneath.',
      context: 'The bridge [timecode], between verses of falling phrases.',
      purpose: 'Shows the speaker briefly searching for an answer before sinking back into regret.',
      impact: 'The audience feels a brief lift of hope that does not last.',
    },
    parts: {
      topic: 'In "Yesterday", The Beatles present regret as a private sadness the speaker cannot escape, and the bridge is where the audience hears a brief attempt to break out of it.',
      elaborate: 'The song is a pop ballad in which the speaker looks back on a lost relationship; its intimate texture of voice, acoustic guitar and string quartet carries this meaning.',
      evidence: 'In the bridge [timecode], as the speaker asks why his partner had to go, the melody rises before falling back into the verse.',
      explain: 'The rising melodic line in the bridge contrasts with the falling phrase endings of the verses, creating a brief lift, as if the speaker is searching for an answer. However, the phrase soon falls back, and the return to the verse melody closes off that search. Meanwhile, the string quartet\'s sustained lines deepen the reflective mood rather than lifting it. Together, these features suggest that regret is private and inescapable.',
      summary: 'Through the bridge, The Beatles present regret as a private sadness the speaker briefly questions but cannot escape.',
      link: 'This sense of falling back is developed in the final verse, where the opening melody returns unchanged.',
    },
  },
  {
    id: 'teees-012', song: 'treaty', theme: 'reconciliation', moment: 'Yolŋu Matha section', difficulty: 'confident',
    plan: {
      characteristics: 'Singing in Yolŋu Matha; yidaki and bilma with electric guitar, bass and drums; driving dance beat.',
      context: 'A Yolŋu Matha section [timecode], after verses sung in English.',
      purpose: 'Shows two cultures sounding together on equal terms.',
      impact: 'The audience hears both cultures at once in a mainstream dance song; it feels inclusive and celebratory.',
    },
    parts: {
      topic: 'In "Treaty", Yothu Yindi present reconciliation as two cultures sounding together on equal terms, and the Yolŋu Matha section is where the audience hears this most directly.',
      elaborate: 'The song is a rock and dance track written in response to the unfulfilled promise of a treaty; its fusion of Yolŋu and Western instruments and its bilingual lyrics carry this meaning.',
      evidence: 'In a Yolŋu Matha section [timecode], after English lyrics about the promise of a treaty, the vocal shifts into Yolŋu Matha over the same driving beat.',
      explain: 'The shift into Yolŋu Matha brings a traditional vocal style into the foreground, while the electric guitar, bass and drums continue beneath it. The yidaki and bilma do not drop out when the band plays; instead, both instrumental traditions sound at the same time, creating a fused texture. Because neither culture is placed in the background, the music conveys reconciliation as a partnership rather than one culture absorbing the other.',
      summary: 'Through this section, Yothu Yindi present reconciliation as a partnership between two cultures on equal terms.',
      link: 'This partnership builds on the opening, where the bilma and yidaki set the pulse before the band joins in.',
    },
  },
];
