// GENERATED ITEMS — fresh, randomised tasks for every practice set, created each session.
// They mix task types (multiple choice, matching, ordering, notation and ear questions) with the
// authored items in each set, so no two sessions are the same.
// generatedItems(setId) → array of items in the normal item format (with `generated: true`).
import { getDrill } from '../drills/drills.js';
import { LEVEL_PRESETS } from '../drills/levelPresets.js';
import { CHORDS, ORDINAL, QUALITY_NAME, KEYS, pick, rand } from '../utils/music.js';
import { analyticalVerbs } from './analysis/verbs.js';
import { featureEffectQuestions as feBase } from './analysis/featureEffect.js';
import { featureEffectMore, evidenceMeaningMore, featureMeaningMore, relationshipMore } from './songs/songTasks.js';
import { evidenceMeaningQuestions as emBase } from './analysis/evidenceMeaning.js';
import { upgradeQuestions } from './analysis/upgrade.js';
import { ladderExamples, LADDER_RUNGS } from './analysis/ladder.js';
import { connectQuestions, RELATIONSHIPS } from './connect/interconnectivity.js';
import { featureMeaningQuestions as fmBase, relationshipQuestions as relBase } from './connect/connectMeaning.js';
const featureEffectQuestions = [...feBase, ...featureEffectMore];
const evidenceMeaningQuestions = [...emBase, ...evidenceMeaningMore];
const featureMeaningQuestions = [...fmBase, ...featureMeaningMore];
const relationshipQuestions = [...relBase, ...relationshipMore];
import { themeArgumentQuestions } from './argument/themeArgument.js';
import { argumentBuilderQuestions } from './argument/argumentBuilder.js';
import { paragraphQuestions } from './writing/paragraphBuilder.js';
import { responsePrompts } from './writing/responsePrompts.js';
import { examParts } from './writing/examParts.js';
import { ARGUMENT_QUALITIES } from './themes/themes.js';
import { getSong } from './songs/songs.js';
import { teeesParagraphs, TEEES_PARTS } from './writing/teees.js';
import { synonymListQuestions } from './analysis/synonymLists.js';

let counter = 0;
const uid = (p) => `gen-${p}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rand(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sample = (a, n) => shuffle(a).slice(0, n);
const letters = 'abcdefgh';
function mcq(base, correct, distractors, extra = {}) {
  const opts = shuffle([{ text: correct, ok: true }, ...distractors.filter((d) => d !== correct).slice(0, 3).map((t) => ({ text: t }))]);
  return { ...base, type: 'mcq', generated: true, options: opts.map((o, i) => ({ id: letters[i], text: o.text, feedback: o.feedback })), correctAnswer: letters[opts.findIndex((o) => o.ok)], ...extra };
}
const splitSentences = (t) => t.trim().split(/(?<=[.!?])\s+(?=[A-Z"“])/).filter(Boolean);

// ---------------- Notation (from the drill engine) ----------------
export function notationItems(hard = false) {
  const out = [];
  const settingsFor = (id) => (hard
    ? { ...getDrill(id).defaults, clef: pick(['treble', 'bass']), keysig: 'all', acc: 'double', range: 'ledger' }
    : { ...getDrill(id).defaults, clef: pick(['treble', 'bass']), keysig: pick(['none', 'none', 'few']), acc: pick(['off', 'on']) });

  // Note name
  {
    const q = getDrill('note-id').generate(settingsFor('note-id'));
    const ans = q.answerText;
    const L = ans[0];
    const others = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].filter((x) => x !== L);
    const acc = ans.slice(1);
    const distract = [...sample(others, 2).map((x) => x + acc), L + (acc ? '' : pick(['♯', '♭']))];
    out.push(mcq({ id: uid('note'), category: 'notation', difficulty: 'beginner', skills: ['theory'], prompt: q.prompt, staff: q.staff, hear: q.hear, explanation: q.explain }, ans, distract));
  }
  // Interval
  {
    const q = getDrill('interval-id').generate({ ...settingsFor('interval-id'), qual: hard ? 'all' : pick(['basic', 'all']), shape: pick(['melodic', 'harmonic']) });
    const { quality, num } = q.solution;
    const lab = (qq, n) => `${QUALITY_NAME[qq]} ${ORDINAL[n]}`;
    const perfect = [4, 5, 8].includes(num);
    const sameNum = (perfect ? ['P', 'A', 'd'] : ['M', 'm', 'A', 'd']).filter((x) => x !== quality).map((x) => lab(x, num));
    const near = [num - 1, num + 1].filter((n) => n >= 2 && n <= 8).map((n) => lab([4, 5, 8].includes(n) ? 'P' : quality === 'P' ? 'M' : quality, n));
    out.push(mcq({ id: uid('interval'), category: 'notation', difficulty: 'developing', skills: ['theory', 'terminology'], prompt: q.prompt, staff: q.staff, hear: q.hear, explanation: q.explain }, q.answerText, shuffle([...sameNum.slice(0, 2), ...near])));
  }
  // Chord
  {
    const q = getDrill('chord-id').generate({ ...settingsFor('chord-id'), types: hard ? 'all' : pick(['basic', 'triads', 'all']), inv: hard ? 'on' : pick(['off', 'on']) });
    const { root, type } = q.solution;
    const rootName = q.answerText.split(' ')[0];
    const nm = (t) => `${rootName} ${CHORDS[t].name.toLowerCase()}`;
    const correct = nm(type);
    const distract = Object.keys(CHORDS).filter((t) => t !== type && CHORDS[t].family === CHORDS[type].family).map(nm);
    void root;
    out.push(mcq({ id: uid('chord'), category: 'notation', difficulty: 'developing', skills: ['theory', 'terminology'], prompt: 'Name this chord (root and quality).', staff: q.staff, hear: q.hear, explanation: q.explain }, correct, shuffle(distract)));
  }
  // Key signature
  {
    const mode = pick(['major', 'minor']);
    const q = getDrill('keysig-id').generate({ clef: pick(['treble', 'bass']), mode, max: '7' });
    const k = q.staff.keySig;
    const near = KEYS.filter((x) => x !== k && (Math.abs(x.count - k.count) <= 1 || x.count === k.count)).map((x) => `${x[mode]} ${mode}`);
    out.push(mcq({ id: uid('keysig'), category: 'notation', difficulty: 'developing', skills: ['theory'], prompt: q.prompt, staff: q.staff, explanation: q.explain }, q.answerText, shuffle(near)));
  }
  if (hard) out.forEach((it) => { it.difficulty = 'expert'; });
  return out;
}

// ---------------- Level 5: drill questions at their hardest preset, as multiple choice ----------------
export function drillChoiceMcq(id, level, category, skills) {
  const d = getDrill(id);
  if (!d) return null;
  const preset = (d.levels || LEVEL_PRESETS[id] || {})[level] || {};
  const q = d.generate({ ...d.defaults, ...preset });
  if (q.pad !== 'choice' || !q.options || q.options.length < 3 || q.rhythm) return null;
  const correct = q.options.find((o) => o.value === q.solution)?.label;
  if (!correct) return null;
  return mcq({ id: uid(id + '-x'), category, difficulty: level === 5 ? 'expert' : 'exam', skills: skills || d.skills, prompt: q.prompt, staff: q.staff, score: q.score, audio: q.audio ? { events: q.audio } : undefined, explanation: q.explain }, correct, q.options.filter((o) => o.value !== q.solution).map((o) => o.label));
}
const EXPERT_DRILLS = {
  theory: ['keysig-id', 'form', 'score-terms'],
  listening: ['ear-cadence', 'ear-metre', 'ear-feature', 'ear-texture', 'ear-scale', 'ear-chord', 'ear-interval'],
};
export function expertDrillItems(setId, count = 6) {
  const out = setId === 'theory' ? notationItems(true) : [];
  const ids = EXPERT_DRILLS[setId] || [];
  for (let tries = 0; ids.length && out.length < count && tries < count * 3; tries++) {
    const x = drillChoiceMcq(pick(ids), 5, setId === 'theory' ? 'notation' : 'listening');
    if (x) out.push(x);
  }
  return out;
}

// ---------------- Theory term banks ----------------
const TERM_BANK = [
  ['Staccato', 'Short and detached'], ['Legato', 'Smooth and connected'], ['Crescendo', 'Gradually getting louder'], ['Diminuendo', 'Gradually getting softer'],
  ['Rallentando', 'Gradually slowing down'], ['Accelerando', 'Gradually speeding up'], ['Rubato', 'Flexible, expressive pushing and pulling of tempo'], ['Fermata', 'A pause — hold the note longer'],
  ['Syncopation', 'Accents on weak beats or off-beats'], ['Ostinato', 'A short pattern repeated persistently'], ['Pedal point', 'A sustained or repeated note while harmonies change'], ['Modulation', 'A change of key'],
  ['Homophonic', 'Melody with chordal accompaniment'], ['Polyphonic', 'Several independent melodic lines'], ['Monophonic', 'A single unaccompanied line'], ['Timbre', 'The tone colour of a sound'],
  ['Melisma', 'Many notes sung to one syllable'], ['Falsetto', 'A light, high vocal register above the normal range'], ['Hemiola', 'Three beats regrouped as two (or two as three)'], ['Cadence', 'A chord progression that ends a phrase'],
  ['Tonic', 'The home note or chord of a key'], ['Dominant', 'The fifth degree of the scale, or the chord built on it'], ['Arpeggio', 'The notes of a chord played one after another'], ['Riff', 'A short repeated instrumental figure in popular music'],
];
// Example effects (in context) for the short-response "define and apply" task.
const TERM_EFFECT = {
  Staccato: 'clipped staccato chords in a song about anxiety could create a restless, nervous energy',
  Legato: 'a smooth legato melody could create a sense of calm continuity or tenderness',
  Crescendo: 'a gradual crescendo into a chorus could build emotional intensity and anticipation',
  Diminuendo: 'a diminuendo at the end of a song could create a sense of fading away, suggesting quiet acceptance',
  Rallentando: 'a rallentando in the final bars could create a sense of reluctance to let go',
  Accelerando: 'an accelerando could create mounting urgency or a loss of control',
  Rubato: 'rubato in a solo vocal could make the performance feel intimate and spontaneous',
  Fermata: 'a fermata before the final chorus could create suspense by holding back the resolution',
  Syncopation: 'syncopated rhythms could create drive and momentum, or instability in a tense context',
  Ostinato: 'an unchanging ostinato could suggest obsession, entrapment or relentless momentum',
  'Pedal point': 'a sustained bass pedal under changing chords could build tension or a sense of being stuck',
  Modulation: 'an upward modulation in a final chorus could lift the energy and suggest renewed conviction',
  Homophonic: 'a homophonic texture keeps the focus on the melody and the words',
  Polyphonic: 'polyphonic texture with competing lines could create a busy, crowded sound, suggesting conflict or many voices at once',
  Monophonic: 'a sudden monophonic passage could expose the voice and suggest isolation',
  Timbre: 'a breathy vocal timbre could make a performance sound fragile and intimate',
  Melisma: 'a melisma on a key word could emphasise its emotional importance',
  Falsetto: 'a falsetto passage could sound vulnerable and fragile',
  Hemiola: 'a hemiola before a cadence could create a sense of broadening or momentary disorientation',
  Cadence: 'an imperfect cadence at the end of a phrase could leave a question hanging',
  Tonic: 'returning to the tonic could create a sense of arrival or homecoming',
  Dominant: 'ending a section on the dominant could create anticipation of resolution',
  Arpeggio: 'repeated piano arpeggios could create a circling, restless feeling',
  Riff: 'a repeated guitar riff could give a song its driving identity and energy',
};

const INTERVAL_SIZES = [['Minor 2nd', 1], ['Major 2nd', 2], ['Minor 3rd', 3], ['Major 3rd', 4], ['Perfect 4th', 5], ['Tritone', 6], ['Perfect 5th', 7], ['Minor 6th', 8], ['Major 6th', 9], ['Minor 7th', 10], ['Major 7th', 11], ['Octave', 12]];
const TEMPO_ORDER = ['Largo', 'Adagio', 'Andante', 'Moderato', 'Allegro', 'Presto'];
const DYN_ORDER = ['pp', 'p', 'mp', 'mf', 'f', 'ff'];

function theoryBankItems() {
  const terms = sample(TERM_BANK, 4);
  const ivs = sample(INTERVAL_SIZES, 4).sort((a, b) => a[1] - b[1]);
  const tempoPick = sample(TEMPO_ORDER, 4).sort((a, b) => TEMPO_ORDER.indexOf(a) - TEMPO_ORDER.indexOf(b));
  const dynPick = sample(DYN_ORDER, 4).sort((a, b) => DYN_ORDER.indexOf(a) - DYN_ORDER.indexOf(b));
  const t = pick(TERM_BANK);
  return [
    { id: uid('terms'), type: 'match', generated: true, category: 'elements', difficulty: 'beginner', skills: ['terminology', 'theory'], prompt: 'Match each term to its meaning.', pairs: terms.map(([left, right]) => ({ left, right })), explanation: 'Precise terms turn description into analysis. Use them as evidence: "a gradual crescendo", not "it gets louder".' },
    { id: uid('ivorder'), type: 'order', generated: true, category: 'intervals', difficulty: 'developing', skills: ['theory'], prompt: 'Arrange these intervals from smallest to largest.', items: shuffle(ivs.map(([n]) => ({ id: n, text: n }))), correctOrder: ivs.map(([n]) => n), explanation: `In semitones: ${ivs.map(([n, s]) => `${n} = ${s}`).join(', ')}.` },
    pick([
      { id: uid('tempo'), type: 'order', generated: true, category: 'tempo', difficulty: 'beginner', skills: ['theory', 'terminology'], prompt: 'Arrange these tempo markings from slowest to fastest.', items: shuffle(tempoPick.map((x) => ({ id: x, text: x }))), correctOrder: tempoPick, explanation: 'Largo → Adagio → Andante → Moderato → Allegro → Presto.' },
      { id: uid('dyn'), type: 'order', generated: true, category: 'dynamics', difficulty: 'beginner', skills: ['theory', 'terminology'], prompt: 'Arrange these dynamic markings from softest to loudest.', items: shuffle(dynPick.map((x) => ({ id: x, text: x }))), correctOrder: dynPick, explanation: 'pp (pianissimo) → p → mp → mf → f → ff (fortissimo).' },
    ]),
    mcq({ id: uid('term'), category: 'elements', difficulty: 'beginner', skills: ['terminology'], prompt: `Which term means: "${t[1].toLowerCase()}"?`, explanation: `${t[0]}: ${t[1].toLowerCase()}.` }, t[0], sample(TERM_BANK.filter((x) => x !== t), 3).map((x) => x[0])),
    (() => {
      const [term, def] = pick(TERM_BANK);
      return {
        id: uid('define'), type: 'short', mode: 'analysis', generated: true, category: 'elements', difficulty: 'developing', skills: ['terminology', 'effect'],
        prompt: `In 1–2 sentences: define "${term.toLowerCase()}", then explain one effect it could have in a song.`,
        expect: ['terminology', 'effect'], minWords: 15,
        hints: ['Definition first, then "In a song, … could create …".', 'Remember: the effect depends on context.'],
        models: [{ text: `${term} means ${def.toLowerCase()}. For example, ${TERM_EFFECT[term]}.`, why: 'A precise definition, then an effect tied to a context — the move from KNOW to EXPLAIN.' }],
      };
    })(),
  ];
}

// ---------------- Ear questions ----------------
const EAR = [['Minor 3rd', 3], ['Major 3rd', 4], ['Perfect 4th', 5], ['Perfect 5th', 7], ['Major 6th', 9], ['Octave', 12], ['Major 2nd', 2], ['Minor 2nd', 1]];
const LISTEN_DESCRIBE = [
  { synth: 'crescendoStrong', focus: 'dynamics', model: 'A repeated chord grows gradually from very soft to very loud — a crescendo from roughly pianissimo to fortissimo — which builds intensity and anticipation.' },
  { synth: 'textureChange', focus: 'texture', model: 'The excerpt begins with a single unaccompanied melody (monophonic texture); at about 3.5 seconds chords and a bass line enter, thickening the texture to homophonic and making the music sound fuller and more settled.' },
  { synth: 'accelerando', focus: 'tempo', model: 'The repeated notes get gradually closer together — an accelerando — which creates a growing sense of urgency.' },
  { synth: 'syncopation', focus: 'rhythm', model: 'The chords are syncopated: they land on the off-beats between the steady clicks, which displaces the accent and creates a restless, driving feel.' },
  { synth: 'imperfectCadence', focus: 'harmony', model: 'The chord progression ends on the dominant chord — an imperfect cadence — so it sounds open and unfinished, like a question.' },
];
const AURAL = [
  ['Staccato', 'Short, separated notes with gaps between them'], ['Legato', 'Smoothly joined notes with no gaps'], ['Crescendo', 'The sound grows steadily louder'],
  ['Accelerando', 'The music gradually speeds up'], ['Syncopation', 'Accents fall between the beats'], ['Imperfect cadence', 'The phrase ends sounding open, as if asking a question'],
  ['Monophonic texture', 'One unaccompanied line'], ['Homophonic texture', 'A melody supported by chords'], ['Minor chord', 'A darker chord: the middle note is a semitone lower than in major'],
];
function earItems() {
  const [name, semis] = pick(EAR);
  const lo = 55 + rand(8);
  const chordType = pick(['maj', 'min', 'dim', 'aug']);
  const offs = { maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8] }[chordType];
  const root = 52 + rand(8);
  const d = pick(LISTEN_DESCRIBE);
  const extra = [
    { id: uid('listen-describe'), type: 'short', mode: 'analysis', generated: true, category: 'listening', difficulty: 'developing', skills: ['listening', 'terminology', 'evidence'], audio: { synth: d.synth },
      prompt: `Listen to the excerpt. In 1–2 sentences, describe what happens in the ${d.focus}, using precise musical terminology and saying what effect it has.`,
      expect: ['terminology', 'effect'], minWords: 12, hints: ['Name the feature with a musical term.', 'Say when it happens or how it changes.', 'Add the effect it creates.'],
      models: [{ text: d.model, why: 'Names the feature precisely, locates it, and explains its effect.' }] },
    { id: uid('aural-match'), type: 'match', generated: true, category: 'listening', difficulty: 'beginner', skills: ['listening', 'terminology'], prompt: 'Match each term to what you would hear.', pairs: sample(AURAL, 4).map(([left, right]) => ({ left, right })), explanation: 'Linking terms to sounds is what lets you name features accurately in a listening exam.' },
  ];
  // Questions from the ear-training drills (cadence, metre, features, texture, tonality), as multiple choice.
  const fromDrills = sample(['ear-cadence', 'ear-metre', 'ear-feature', 'ear-texture'], 2).map((id) => {
    const d = getDrill(id);
    const q = d.generate({ ...d.defaults });
    const correct = q.options.find((o) => o.value === q.solution).label;
    return mcq({ id: uid(id), category: 'listening', subtype: 'ear', difficulty: 'developing', skills: d.skills, prompt: q.prompt, audio: { events: q.audio }, explanation: q.explain }, correct, q.options.filter((o) => o.value !== q.solution).map((o) => o.label));
  });
  return [
    ...extra,
    ...fromDrills,
    mcq({ id: uid('ear-int'), category: 'listening', subtype: 'ear', difficulty: 'developing', skills: ['listening'], prompt: 'Listen. Which interval do you hear (ascending)?', audio: { events: [{ t: 0, d: 0.75, notes: [lo] }, { t: 0.8, d: 1.1, notes: [lo + semis] }] }, explanation: `${name}: ${semis} semitone${semis > 1 ? 's' : ''}.` }, name, sample(EAR.filter((x) => x[0] !== name), 3).map((x) => x[0])),
    mcq({ id: uid('ear-chord'), category: 'listening', subtype: 'ear', difficulty: 'developing', skills: ['listening', 'terminology'], prompt: 'Listen. What is the quality of this chord?', audio: { events: [...offs.map((o, i) => ({ t: i * 0.4, d: 0.5, notes: [root + o] })), { t: 1.35, d: 1.5, notes: offs.map((o) => root + o) }] }, explanation: `${CHORDS[chordType].name}: ${CHORDS[chordType].intervals.map(([q, n]) => `${QUALITY_NAME[q].toLowerCase()} ${ORDINAL[n]}`).join(', ')} above the root.` }, CHORDS[chordType].name, ['Major', 'Minor', 'Diminished', 'Augmented'].filter((x) => x !== CHORDS[chordType].name)),
  ];
}

// ---------------- Analysis ----------------
function synonymItems() {
  const four = sample(analyticalVerbs, 4);
  const v = pick(analyticalVerbs);
  return [
    { ...pick(synonymListQuestions), id: uid('synl'), generated: true },
    { id: uid('verbs'), type: 'match', generated: true, category: 'synonyms', difficulty: 'developing', skills: ['terminology', 'effect'], prompt: 'Match each analytical verb to the relationship it describes.', pairs: four.map((x) => ({ left: x.verb, right: x.meaning })), explanation: 'Analytical verbs are not interchangeable — each makes a different claim about how the music relates to the idea.' },
    mcq({ id: uid('verb'), category: 'synonyms', difficulty: 'beginner', skills: ['terminology'], prompt: `Which analytical verb means "${v.meaning}"?`, explanation: `"${v.verb}" — ${v.meaning}. Typical use: ${v.use}` }, v.verb, sample(analyticalVerbs.filter((x) => x !== v), 3).map((x) => x.verb)),
  ];
}

function progressionOrder(item, setPrefix) {
  const steps = [item.weak, ...item.progression];
  return { id: uid(setPrefix), type: 'order', generated: true, category: 'upgrade', difficulty: 'beginner', skills: ['effect', 'evidence'], theme: item.theme, song: item.song, prompt: `Arrange these versions from weakest to strongest analysis.`, items: shuffle(steps.map((t, i) => ({ id: 's' + i, text: t }))), correctOrder: steps.map((_, i) => 's' + i), explanation: item.explanation };
}

function featureEffectItems() {
  const up = pick(upgradeQuestions);
  const fe = pick(featureEffectQuestions.filter((q) => q.type === 'mcq'));
  const correct = fe.options.find((o) => o.id === fe.correctAnswer).text;
  return [
    progressionOrder(up, 'fe-order'),
    { ...fe, id: uid('fe-short'), type: 'short', mode: 'analysis', generated: true, prompt: 'Write your own strongest explanation of this feature: feature → effect → meaning.', expect: ['terminology', 'effect', 'meaning', 'theme'], options: undefined, theme: fe.context?.theme, models: [{ text: correct, why: fe.explanation }] },
  ];
}

function evidenceMeaningItems() {
  const three = sample(evidenceMeaningQuestions, 3);
  const one = pick(evidenceMeaningQuestions);
  const correct = one.options.find((o) => o.id === one.correctAnswer).text;
  return [
    { id: uid('em-match'), type: 'match', generated: true, category: 'evidence-meaning', difficulty: 'confident', skills: ['evidence', 'effect'], prompt: 'Match each piece of musical evidence to the interpretation it best supports.', pairs: three.map((q) => ({ left: `${q.context.evidence} (${q.context.theme})`, right: q.options.find((o) => o.id === q.correctAnswer).text })), explanation: 'Each interpretation names the specific evidence, the effect it creates and what that suggests about the theme.' },
    { ...one, id: uid('em-short'), type: 'short', mode: 'analysis', generated: true, prompt: `Write your own interpretation: how could this evidence contribute to the presentation of ${one.context.theme}?`, expect: ['terminology', 'effect', 'meaning', 'theme'], theme: one.context.theme, options: undefined, models: [{ text: correct, why: one.explanation }] },
  ];
}

function upgradeItems() {
  const u = pick(upgradeQuestions);
  const levels = u.progression;
  return [
    progressionOrder(pick(upgradeQuestions), 'up-order'),
    mcq({ id: uid('up-best'), category: 'upgrade', difficulty: 'developing', skills: ['effect', 'evidence'], theme: u.theme, song: u.song, weak: u.weak, prompt: `Which upgrade of this weak statement goes furthest — from feature to meaning${u.theme ? ` about ${u.theme}` : ''}?`, explanation: u.explanation }, levels[levels.length - 1], [u.weak, ...levels.slice(0, -1)].reverse()),
  ];
}

function ladderItems() {
  const ex = pick(ladderExamples);
  const rungs = sample(LADDER_RUNGS.map((r, i) => ({ ...r, i })), 4).sort((a, b) => a.i - b.i);
  const r = pick(LADDER_RUNGS);
  const all = LADDER_RUNGS.map((x) => ({ ...x }));
  return [
    { id: uid('ladder-x'), type: 'order', generated: true, category: 'ladder', difficulty: 'expert', skills: ['effect', 'evidence'], prompt: `${ex.title}: arrange ALL six rungs from lowest to highest. (Level 5: no labels to help you.)`, items: shuffle(all.map((x) => ({ id: x.key, text: ex.rungs[x.key] }))), correctOrder: all.map((x) => x.key), explanation: 'Identify → Describe → Explain → Interpret → Connect → Argue: each rung keeps what is below it and adds one new layer.' },
    { id: uid('ladder'), type: 'order', generated: true, category: 'ladder', difficulty: 'developing', skills: ['effect', 'evidence'], prompt: `${ex.title}: arrange these four rungs from lowest to highest.`, items: shuffle(rungs.map((x) => ({ id: x.key, text: ex.rungs[x.key] }))), correctOrder: rungs.map((x) => x.key), explanation: 'Identify → Describe → Explain → Interpret → Connect → Argue.' },
    mcq({ id: uid('rung'), category: 'ladder', difficulty: 'beginner', skills: ['effect'], prompt: `${ex.title}: which rung of the ladder is this statement? "${ex.rungs[r.key]}"`, explanation: `${r.label}: ${r.question}` }, r.label, LADDER_RUNGS.filter((x) => x !== r).map((x) => x.label)),
  ];
}

function connectItems() {
  const c = pick(connectQuestions);
  const [e1, e2] = c.elements;
  const rel = c.relationship;
  const label = { reinforce: 'They reinforce each other', contrast: 'They contrast with each other', develop: 'One develops the other' };
  return [
    mcq({ id: uid('rel'), category: 'interconnectivity', difficulty: 'developing', skills: ['interconnectivity'], theme: c.theme, song: c.song, prompt: `${e1.name}: ${e1.observation} ${e2.name}: ${e2.observation} What is the relationship between these elements${c.theme ? ` in presenting ${c.theme}` : ''}?`, explanation: `${RELATIONSHIPS[rel]} ${c.model}` }, label[rel], Object.values(label).filter((x) => x !== label[rel]).concat(['They are unrelated'])),
    { id: uid('con-short'), type: 'short', mode: 'analysis', generated: true, category: 'interconnectivity', difficulty: 'confident', skills: ['interconnectivity', 'writing'], theme: c.theme, song: c.song, prompt: `Write one sentence connecting these two elements: ${e1.name} (${e1.observation.replace(/\.$/, '')}) and ${e2.name} (${e2.observation.replace(/\.$/, '')}).`, expect: ['effect', 'connection', 'meaning'], models: [{ text: c.model, why: RELATIONSHIPS[rel] }] },
  ];
}

// Feature → meaning: built from the Practice Exam model outlines, so every song × theme pair can appear.
function featureMeaningItems() {
  const p = pick(responsePrompts);
  const parts = examParts[p.id];
  const song = getSong(p.song);
  const m = rand(3);
  const o = p.modelOutline.moments[m];
  const what = o.what.replace(/\.$/, '');
  const base = { generated: true, category: 'feature-meaning', song: p.song, theme: p.theme };
  return [
    mcq({ ...base, id: uid('fm-pick'), difficulty: 'developing', skills: ['interconnectivity', 'effect'], prompt: `"${song.title}", ${o.where.toLowerCase()}: ${what.charAt(0).toLowerCase() + what.slice(1)}. Which sentence connects this to meaning?`, explanation: `${o.why} The strong answer moves from the feature to its effect and then to what it suggests about ${p.theme}.` },
      parts.moments[m].analysis,
      [`In the ${o.where.toLowerCase()}, ${what.charAt(0).toLowerCase() + what.slice(1)}.`, `This part of the song is very emotional and shows ${p.theme}.`, `${song.artist} uses lots of musical elements here to make it interesting.`]),
    { ...base, id: uid('fm-short'), type: 'short', mode: 'analysis', difficulty: 'confident', skills: ['interconnectivity', 'effect', 'writing'],
      facts: [`Where: ${o.where}`, `What happens: ${o.what}`],
      prompt: `Connect this moment of "${song.title}" to the theme of ${p.theme}: what effect do the features create, and what do they suggest?`,
      hints: ['Name one feature precisely, then say what it creates.', `Finish by saying what that suggests about ${p.theme}.`],
      expect: ['effect', 'meaning'], models: [{ text: parts.moments[m].analysis, why: o.why }] },
  ];
}

const REL_LABEL = { reinforce: 'They reinforce each other', contrast: 'They contrast with each other', develop: 'One develops the other' };
const REL_LINKS = { reinforce: ['while', 'and at the same time'], contrast: ['whereas', 'yet', 'in contrast'], develop: ['which then', 'building on this', 'until'] };
function relationshipItems() {
  const c = pick(connectQuestions);
  const [e1, e2] = c.elements;
  const r = c.relationship;
  const base = { generated: true, category: 'relationships', theme: c.theme, song: c.song };
  return [
    mcq({ ...base, id: uid('rel-pick'), difficulty: 'developing', skills: ['interconnectivity'], prompt: `${e1.name}: ${e1.observation} ${e2.name}: ${e2.observation} What is the relationship between these elements${c.theme ? ` in presenting ${c.theme}` : ''}?`, explanation: `${RELATIONSHIPS[r]} ${c.model}` }, REL_LABEL[r], Object.values(REL_LABEL).filter((x) => x !== REL_LABEL[r]).concat(['They are unrelated'])),
    { ...base, id: uid('rel-write'), type: 'short', mode: 'analysis', difficulty: 'confident', skills: ['interconnectivity', 'writing'],
      facts: [`${e1.name}: ${e1.observation}`, `${e2.name}: ${e2.observation}`, `Relationship: ${r} — ${RELATIONSHIPS[r]}`],
      prompt: `Write one sentence showing how ${e1.name.toLowerCase()} and ${e2.name.toLowerCase()} ${r === 'develop' ? 'develop one another' : r === 'contrast' ? 'contrast with each other' : 'reinforce each other'}${c.theme ? ` to present ${c.theme}` : ''}.`,
      hints: [`Linking language for this relationship: ${REL_LINKS[r].map((w) => `"${w}"`).join(', ')}.`, 'Give each element its own job, then say what they achieve together.'],
      expect: ['effect', 'connection', 'meaning'], models: [{ text: c.model, why: RELATIONSHIPS[r] }] },
  ];
}

function themeArgumentItems() {
  const prog = pick(themeArgumentQuestions.filter((q) => q.progressive));
  const quals = sample(ARGUMENT_QUALITIES, 4);
  const out = [{ id: uid('qual'), type: 'match', generated: true, category: 'theme-to-argument', kind: 'quality', difficulty: 'beginner', skills: ['themeArgument'], prompt: 'Match each quality of a strong argument to its meaning.', pairs: quals.map((q) => ({ left: q.label, right: q.text })), explanation: 'A strong argument is specific, arguable, relevant, developable and musical.' }];
  if (prog) out.push({ id: uid('ta-order'), type: 'order', generated: true, category: 'theme-to-argument', kind: 'strongest', difficulty: 'beginner', skills: ['themeArgument'], theme: prog.theme, song: prog.song, prompt: `Theme: ${prog.theme}. Arrange these from a bare theme to the strongest argument.`, items: shuffle(prog.options.map((o) => ({ id: o.id, text: o.text }))), correctOrder: prog.options.map((o) => o.id), explanation: prog.explanation });
  return out;
}

const ROLE = { claim: 'Claim', evidence: 'Evidence', effect: 'Musical effect', meaning: 'Meaning', connection: 'Connection', judgement: 'Evaluation' };
function argumentBuilderItems() {
  const ab = pick(argumentBuilderQuestions.filter((q) => q.steps.every((s) => s.suggestions?.length)));
  const four = sample(ab.steps, 4);
  return [
    { id: uid('ab-match'), type: 'match', generated: true, category: 'argument-builder', difficulty: 'developing', skills: ['argument'], theme: ab.theme, song: ab.song, prompt: 'Match each sentence to its role in the argument.', pairs: four.map((s) => ({ left: s.suggestions[0], right: ROLE[s.key] })), explanation: 'Claim → evidence → effect → meaning → connection → evaluation.' },
    { id: uid('ab-order'), type: 'order', generated: true, category: 'argument-builder', difficulty: 'beginner', skills: ['argument'], theme: ab.theme, song: ab.song, prompt: 'Arrange these sentences into a complete argument.', items: shuffle(ab.steps.map((s) => ({ id: s.key, text: s.suggestions[0] }))), correctOrder: ab.steps.map((s) => s.key), explanation: 'Claim → evidence → effect → meaning → connection → evaluation.' },
  ];
}

function paragraphItems() {
  const pb = pick(paragraphQuestions);
  const sents = splitSentences(pb.model);
  if (sents.length !== pb.fields.length) return [];
  const four = sample(pb.fields.map((f, i) => ({ f, s: sents[i] })), 4);
  return [
    { id: uid('pb-order'), type: 'order', generated: true, category: 'paragraph-builder', difficulty: 'developing', skills: ['writing'], theme: pb.theme, song: pb.song, prompt: 'These sentences form a model analytical paragraph. Put them in the right order.', items: shuffle(sents.map((t, i) => ({ id: 's' + i, text: t }))), correctOrder: sents.map((_, i) => 's' + i), explanation: 'Claim → evidence → effect → meaning → interconnectivity → evaluation.' },
    { id: uid('pb-match'), type: 'match', generated: true, category: 'paragraph-builder', difficulty: 'developing', skills: ['writing'], theme: pb.theme, song: pb.song, prompt: 'Match each sentence to the job it does in the paragraph.', pairs: four.map(({ f, s }) => ({ left: s, right: f.label })), explanation: 'Every sentence in a strong paragraph has one clear job.' },
  ];
}

function examSkillItems() {
  const p = pick(responsePrompts);
  const parts = examParts[p.id];
  const song = getSong(p.song);
  const m = rand(3);
  const where = p.modelOutline.moments.map((x) => x.where);
  return [
    { id: uid('intro-order'), type: 'order', generated: true, category: 'exam-skills', kind: 'thesis', difficulty: 'beginner', skills: ['writing', 'argument'], song: p.song, theme: p.theme, examQuestion: p.question, prompt: 'Arrange these sentences into a strong introduction.', items: shuffle([{ id: 'context', text: parts.context }, { id: 'preview', text: parts.preview }, { id: 'thesis', text: parts.thesis }]), correctOrder: ['context', 'preview', 'thesis'], explanation: 'Context first, then a preview of the three moments. The thesis should be the last sentence, so the introduction builds to your argument.' },
    { id: uid('para-order'), type: 'order', generated: true, category: 'exam-skills', kind: 'analysis', difficulty: 'developing', skills: ['writing'], song: p.song, theme: p.theme, examQuestion: p.question, prompt: `Arrange the paragraph for key moment ${m + 1} (${where[m]}).`, items: shuffle([{ id: 'topic', text: parts.moments[m].topic }, { id: 'analysis', text: parts.moments[m].analysis }, { id: 'connection', text: parts.moments[m].connection }]), correctOrder: ['topic', 'analysis', 'connection'], explanation: 'Topic sentence (link to the argument) → analysis (evidence, effect, meaning) → interconnectivity.' },
    { id: uid('moment-match'), type: 'match', generated: true, category: 'exam-skills', kind: 'topic', difficulty: 'developing', skills: ['writing', 'evidence'], song: p.song, theme: p.theme, examQuestion: p.question, prompt: 'Match each topic sentence to its key moment.', pairs: parts.moments.map((x, i) => ({ left: x.topic, right: where[i] })), explanation: 'A topic sentence names where the moment is and what it contributes to the argument.' },
    mcq({ id: uid('thesis-pick'), category: 'exam-skills', kind: 'thesis', difficulty: 'beginner', skills: ['themeArgument', 'argument'], song: p.song, theme: p.theme, examQuestion: p.question, prompt: 'Which sentence would make the strongest thesis to end the introduction?', explanation: `${parts.thesis} — specific, arguable and developable across three moments. It should be the last sentence of the introduction.` },
    parts.thesis, [`"${song.title}" is a song about ${p.theme}.`, `${song.artist} presents ${p.theme} in this song.`, `${song.artist} presents ${p.theme} as sad and important.`]),
  ];
}

// TEEES: structure tasks built from the model paragraphs (order, match, best topic sentence, missing part, summary vs link).
const TEEES_NAME = (p, link) => `${p.letter} — ${p.key === 'summary' ? (link ? 'Link' : 'Summary') : p.label}`;
function teeesItems() {
  const m = pick(teeesParagraphs);
  const song = getSong(m.song);
  const base = { generated: true, category: 'teees', song: m.song, theme: m.theme, moment: m.moment };
  const link = Math.random() < 0.5;
  const text = (k) => (k === 'summary' && link ? m.parts.link : m.parts[k]);
  const missing = pick(TEEES_PARTS.slice(1, 4));
  const four = sample(TEEES_PARTS, 4);
  return [
    { ...base, id: uid('teees-order'), type: 'order', difficulty: 'beginner', skills: ['writing'], prompt: `Arrange these sentences into a TEEES paragraph about the ${m.moment.toLowerCase()} of "${song.title}".`, items: shuffle(TEEES_PARTS.map((p) => ({ id: p.key, text: text(p.key) }))), correctOrder: TEEES_PARTS.map((p) => p.key), explanation: 'Topic sentence → Elaborate → Evidence → Explain → Summary/link. The paragraph states its idea, gives brief context, pins down the moment, explains it in detail, then ties it back (or links on).' },
    { ...base, id: uid('teees-match'), type: 'match', difficulty: 'developing', skills: ['writing'], prompt: 'Match each sentence to its part of the TEEES paragraph.', pairs: four.map((p) => ({ left: text(p.key), right: TEEES_NAME(p, link) })), explanation: 'Each part has one job: state the idea (T), give brief context (E), pin down the moment (E), unpack it in detail (E), then summarise or link (S).' },
    mcq({ ...base, id: uid('teees-topic'), difficulty: 'beginner', skills: ['writing', 'themeArgument'], prompt: `Which is the strongest topic sentence for a TEEES paragraph about the ${m.moment.toLowerCase()} of "${song.title}"?`, explanation: 'A topic sentence states the theme very explicitly, names the song and artist, and says how the music creates meaning — without the detail, which belongs in Evidence and Explain.' },
      m.parts.topic, [`"${song.title}" is a really good song with lots of emotion.`, `"${song.title}" is a song by ${song.artist}.`, m.parts.evidence]),
    mcq({ ...base, id: uid('teees-missing'), difficulty: 'developing', skills: ['writing'], prompt: 'Which part of TEEES is missing from this paragraph?', stimulus: TEEES_PARTS.filter((p) => p !== missing).map((p) => text(p.key)).join(' '), explanation: `The ${missing.label.toLowerCase()} is missing. ${missing.guide}` },
      `${missing.letter} — ${missing.label}`, TEEES_PARTS.filter((p) => p !== missing && p.key !== 'topic').map((p) => TEEES_NAME(p, link)).concat(['T — Topic sentence']).slice(0, 3)),
  ];
}

const GENERATORS = {
  theory: () => [...notationItems(), ...theoryBankItems()],
  listening: earItems,
  synonyms: synonymItems,
  'feature-effect': featureEffectItems,
  'evidence-meaning': evidenceMeaningItems,
  upgrade: upgradeItems,
  ladder: ladderItems,
  connect: connectItems,
  'feature-meaning': featureMeaningItems,
  relationships: relationshipItems,
  'theme-argument': themeArgumentItems,
  'argument-builder': argumentBuilderItems,
  'paragraph-builder': paragraphItems,
  teees: teeesItems,
  'sentence-builder': paragraphItems,
  'exam-skills': examSkillItems,
};

/** Fresh generated items for a set (different every call). */
export function generatedItems(setId, rounds = 1) {
  const g = GENERATORS[setId];
  if (!g) return [];
  const out = [];
  for (let i = 0; i < rounds; i++) out.push(...g());
  return out;
}
