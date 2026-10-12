// CONTENT REGISTRY — the single place that connects data files to the app.
// To add a new practice set: create a data file, import it here and add an entry to SETS.
// Pages, practice sessions and Exam Mode all read from this registry.

import { LEVELS } from './levels.js';
import { theoryQuestions } from './theory/theoryQuestions.js';
import { theoryBank } from './theory/theoryBank.js';
import { listeningQuestions } from './listening/listeningQuestions.js';
import { synonymQuestions } from './analysis/synonyms.js';
import { featureEffectQuestions } from './analysis/featureEffect.js';
import { evidenceMeaningQuestions } from './analysis/evidenceMeaning.js';
import { upgradeQuestions } from './analysis/upgrade.js';
import { ladderQuestions } from './analysis/ladder.js';
import { connectQuestions } from './connect/interconnectivity.js';
import { featureMeaningQuestions, relationshipQuestions } from './connect/connectMeaning.js';
import { themeArgumentQuestions } from './argument/themeArgument.js';
import { themeArgumentWrite } from './argument/themeArgumentWrite.js';
import { argumentBuilderQuestions } from './argument/argumentBuilder.js';
import { synonymListQuestions } from './analysis/synonymLists.js';
import { teeesQuestions } from './writing/teees.js';
import { featureEffectMore, evidenceMeaningMore, featureMeaningMore, relationshipMore } from './songs/songTasks.js';
import { paragraphQuestions } from './writing/paragraphBuilder.js';
import { sentenceBuilderQuestions } from './writing/sentenceBuilder.js';
import { examSkillTasks } from './writing/examSkills.js';

// Five levels (see data/levels.js). Item difficulty keys stay beginner…exam (+ expert for Level 5) so saved progress still works.
export const DIFFICULTIES = LEVELS.map((l) => ({ key: l.key, n: l.n, label: `Level ${l.n}: ${l.name}`, short: `Level ${l.n}`, name: l.name, note: l.note }));

const RANK = { beginner: 0, developing: 1, confident: 2, exam: 3, expert: 4 };
// Stable sort so a set runs from heavy scaffolding to independent work.
const byDifficulty = (items) => items.map((it, i) => [it, i]).sort((a, b) => RANK[a[0].difficulty] - RANK[b[0].difficulty] || a[1] - b[1]).map(([it]) => it);

export const SETS = {
  theory: {
    title: 'Theory Trainer', stage: 'know', items: [...theoryQuestions, ...theoryBank],
    blurb: 'Terminology and concepts — the vocabulary of every analysis.',
    why: 'You cannot write precise analysis without precise terms. Each answer explains the concept and the misconception behind wrong options.',
    filterBy: 'category',
  },
  listening: {
    title: 'Listening Trainer', stage: 'hear', items: listeningQuestions,
    blurb: 'Identify elements, features and changes by ear.',
    why: 'Evidence starts with hearing it. These excerpts are synthesised in your browser so you can focus on one feature at a time.',
  },
  synonyms: {
    title: 'Musical Synonyms', stage: 'explain', items: [...synonymQuestions, ...synonymListQuestions],
    blurb: 'Choose the analytical verb that fits the relationship.',
    why: 'Analytical verbs are not interchangeable: "reinforces", "contrasts" and "establishes" make different claims.',
  },
  'feature-effect': {
    title: 'Feature → Effect', stage: 'explain', items: [...featureEffectQuestions, ...featureEffectMore],
    blurb: 'Identifying a feature is not analysis — analyse what it does and what it means.',
    why: 'Markers reward explanation of effect and meaning, not lists of features.',
  },
  'evidence-meaning': {
    title: 'Evidence → Meaning', stage: 'explain', items: [...evidenceMeaningQuestions, ...evidenceMeaningMore],
    blurb: 'Connect specific musical evidence to what it communicates.',
    why: 'Interpretation must be supported by evidence — and depends on context.',
  },
  upgrade: {
    title: 'Upgrade the Analysis', stage: 'explain', items: upgradeQuestions,
    blurb: 'Rewrite weak statements into strong analysis, with live coaching.',
    why: 'Strong analysis is built by adding layers: terminology, evidence, effect, meaning, theme, connection, evaluation.',
  },
  ladder: {
    title: 'Climb the Analysis Ladder', stage: 'explain', items: ladderQuestions,
    blurb: 'Order statements from Identify to Argue.',
    why: 'Seeing each rung helps you notice where your own writing stops climbing.',
  },
  connect: {
    title: 'Interconnectivity', stage: 'connect', items: connectQuestions,
    blurb: 'Show how musical elements work together — five levels of scaffolding.',
    why: 'Strong analysis does not list elements one at a time. It explains how they reinforce, contrast or develop each other.',
  },
  'feature-meaning': {
    title: 'Feature → Meaning', stage: 'connect', items: [...featureMeaningQuestions, ...featureMeaningMore],
    blurb: 'Connect a musical feature to what it suggests and to the theme — in any song.',
    why: 'An observation only earns marks once you say what it means. Connecting feature → effect → meaning → theme is the core move of analysis.',
  },
  relationships: {
    title: 'Reinforce · Contrast · Develop', stage: 'connect', items: [...relationshipQuestions, ...relationshipMore],
    blurb: 'Name how elements relate, and use linking language that makes the relationship clear.',
    why: '"And" lists. "While", "whereas" and "which then" connect — and examiners reward the connection.',
  },
  'theme-argument': {
    title: 'Theme → Argument', stage: 'argue', items: byDifficulty([...themeArgumentQuestions, ...themeArgumentWrite]),
    blurb: 'A theme is not an argument. Turn broad themes into specific claims.',
    why: 'An argument gives your whole response direction — it is what every piece of evidence proves.',
    filterBy: 'kind',
  },
  'argument-builder': {
    title: 'Argument Builder', stage: 'argue', items: argumentBuilderQuestions,
    blurb: 'Claim → evidence → effect → meaning → connection → evaluation.',
    why: 'Practise each component on its own, then see them combine into a complete argument.',
  },
  'exam-skills': {
    title: 'Practice Exam Skills', stage: 'write', items: examSkillTasks,
    blurb: 'Short writing and objective tasks that build each part of a Practice Exam response: context, preview, thesis, topic sentences, analysis, interconnectivity, links and evaluation.',
    why: 'Each task is one piece of a real exam answer, in the order you would write it. Master the pieces, then put them together in the Practice Exam.',
    filterBy: 'kind',
  },
  'sentence-builder': {
    title: 'Sentence Builder', stage: 'write', items: sentenceBuilderQuestions,
    blurb: 'Construct analytical sentences piece by piece.',
    why: 'Feature + specific evidence + effect + meaning + theme — the building block of every paragraph.',
  },
  teees: {
    title: 'TEEES Paragraphs', stage: 'write', items: teeesQuestions,
    blurb: 'Plan a moment, then write Topic sentence → Elaborate → Evidence → Explain → Summary/link.',
    why: 'A consistent paragraph structure means every paragraph states its idea, grounds it in the music, explains it in detail and ties it back — or leads on to the next.',
  },
  'paragraph-builder': {
    title: 'Paragraph Builder', stage: 'write', items: paragraphQuestions,
    blurb: 'Write a complete analytical paragraph with removable scaffolding.',
    why: 'See your paragraph assembled and colour-coded by analytical component.',
  },
};

export const FILTER_LABELS = {
  kind: { context: 'Introduction context', thesis: 'Thesis (end of introduction)', preview: 'Introduction preview', topic: 'Topic sentences', analysis: 'Moment analysis', connection: 'Interconnectivity', transition: 'Linking sentences', judgement: 'Final evaluation', write: 'Write your own argument', strongest: 'A · Strongest argument', upgrade: 'B · Upgrade the theme', specific: 'C · Make it specific', direction: 'D · Musical direction', chain: 'E · Build the argument', quality: 'Argument quality' },
  category: { teees: 'TEEES paragraphs', 'feature-meaning': 'Feature → Meaning', relationships: 'Reinforce · Contrast · Develop', 
    cadences: 'Cadences', chords: 'Chords', harmony: 'Harmony', tonality: 'Tonality', modulation: 'Modulation', transposition: 'Transposition',
    scales: 'Scales', modes: 'Modes', intervals: 'Intervals', metre: 'Metre', rhythm: 'Rhythm', tempo: 'Tempo',
    dynamics: 'Dynamics', articulation: 'Articulation', timbre: 'Timbre', texture: 'Texture', form: 'Form', elements: 'Elements',
    keys: 'Keys & key signatures', 'scale-degrees': 'Scale degrees', 'note-values': 'Note values', enharmonics: 'Enharmonics', terms: 'Italian & performance terms', instruments: 'Instruments', voices: 'Voice types', melody: 'Melody', notation: 'Notation',
  },
};

export const getSet = (id) => SETS[id];

export const allItems = () => Object.entries(SETS).flatMap(([setId, s]) => s.items.map((it) => ({ ...it, setId })));
