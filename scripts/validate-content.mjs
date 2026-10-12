// Content validator: run `npm run validate` after editing data files.
// Checks every exercise has the fields its type needs, ids are unique, and answers point at real options.
import { SETS } from '../src/data/index.js';
import { songs } from '../src/data/songs/songs.js';

const errors = [];
const ids = new Set();
const songIds = new Set(songs.map((s) => s.id));
const DIFF = ['beginner', 'developing', 'confident', 'exam', 'expert'];
const SKILLS = ['theory', 'terminology', 'listening', 'evidence', 'effect', 'interconnectivity', 'themeArgument', 'argument', 'writing'];

for (const [setId, set] of Object.entries(SETS)) {
  for (const it of set.items) {
    const where = `${setId}/${it.id}`;
    const err = (m) => errors.push(`${where}: ${m}`);
    if (!it.id) err('missing id');
    if (ids.has(it.id)) err('duplicate id');
    ids.add(it.id);
    if (!DIFF.includes(it.difficulty)) err(`bad difficulty "${it.difficulty}"`);
    if (!Array.isArray(it.skills) || !it.skills.length) err('missing skills');
    (it.skills || []).forEach((s) => SKILLS.includes(s) || err(`unknown skill "${s}"`));
    if (it.song && !songIds.has(it.song)) err(`unknown song "${it.song}"`);
    // Any task about a theme must be anchored to a real song, so students never argue about a hypothetical piece.
    if ((it.theme || it.context?.theme) && !it.song) err('has a theme but no song — add `song` so the task is about a real piece');
    switch (it.type) {
      case 'mcq':
        if (!it.prompt) err('missing prompt');
        if (!it.options?.length) err('missing options');
        if (!it.options?.some((o) => o.id === it.correctAnswer)) err('correctAnswer not in options');
        if (!it.explanation) err('missing explanation');
        break;
      case 'multi':
        if (!it.correctAnswers?.every((c) => it.options.some((o) => o.id === c))) err('correctAnswers not in options');
        break;
      case 'order':
        if (it.correctOrder?.length !== it.items?.length) err('correctOrder length mismatch');
        if (!it.correctOrder?.every((c) => it.items.some((o) => o.id === c))) err('correctOrder id not in items');
        break;
      case 'match':
        if (!it.pairs?.length) err('missing pairs');
        break;
      case 'scaffold': {
        const n = (it.frame.match(/\{\d+\}/g) || []).length;
        if (n !== it.blanks?.length) err(`frame has ${n} blanks but ${it.blanks?.length} blank definitions`);
        if (!it.model) err('missing model');
        break;
      }
      case 'upgrade':
        if (!it.weak || !it.progression?.length || !it.expect?.length) err('needs weak, progression, expect');
        break;
      case 'connect':
        if (it.elements?.length < 2) err('needs at least 2 elements');
        if (!it.options?.some((o) => o.id === it.correctAnswer)) err('correctAnswer not in options');
        if (it.frameModel?.length !== 3) err('frameModel needs 3 parts');
        if (it.elements?.length >= 3 && !it.modelThree) err('3 elements but no modelThree');
        break;
      case 'direction':
        if (!it.elements?.length || !it.compose || !it.model) err('needs elements, compose, model');
        break;
      case 'builder':
        if (!it.steps?.length) err('missing steps');
        if (it.finalKey && !it.steps.some((s) => s.key === it.finalKey)) err('finalKey not a step');
        break;
      case 'short':
        if (!it.prompt || !it.models?.length) err('needs prompt and models');
        if (!['argument', 'analysis'].includes(it.mode)) err('mode must be argument or analysis');
        if (it.mode === 'analysis' && !it.expect?.length) err('analysis mode needs expect');
        break;
      case 'synlist':
        if (!it.word || !it.accepted?.length || !it.target) err('synlist needs word, accepted, target');
        break;
      case 'teees':
        if (!it.song) err('teees needs a song');
        break;
      case 'paragraph':
        if (!it.fields?.length || !it.model || !it.question) err('needs fields, question, model');
        break;
      default:
        err(`unknown type "${it.type}"`);
    }
  }
}

const counts = Object.entries(SETS).map(([k, s]) => `${k}: ${s.items.length}`).join(', ');
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ Content OK — ${ids.size} exercises (${counts}); ${songs.length} songs.`);
