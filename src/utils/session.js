// Builds a practice session: a random, mixed selection of authored and freshly generated tasks.
import { generatedItems, expertDrillItems } from '../data/generators.js';
import { expertItems } from './expert.js';

export const SESSION_SIZE = 10;

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const typeClass = (it) => (it.type === 'mcq' || it.type === 'multi' ? 'choice' : it.type);

/** Interleave so the same kind of task rarely appears twice in a row. */
export function mixByType(items) {
  const groups = {};
  shuffle(items).forEach((it) => { (groups[typeClass(it)] = groups[typeClass(it)] || []).push(it); });
  const out = [];
  let last = null;
  while (out.length < items.length) {
    const keys = Object.keys(groups).filter((k) => groups[k].length).sort((a, b) => groups[b].length - groups[a].length);
    const k = keys.find((x) => x !== last) || keys[0];
    out.push(groups[k].shift());
    last = k;
  }
  return out;
}

/**
 * @param set   a SETS entry
 * @param setId its key
 * @param query filters from the URL (difficulty, category, kind, song)
 */
const RANK = { beginner: 1, developing: 2, confident: 3, exam: 4, expert: 5 };
const MIN_AT_LEVEL = 6;

export function buildSession(set, setId, query = {}) {
  if (!set) return [];
  const keepOther = (it) =>
    (!query.category || it.category === query.category) &&
    (!query.kind || it.kind === query.kind) &&
    (!query.song || it.song === query.song);
  // Building one Practice Exam response step by step keeps its natural order.
  if (query.song && setId === 'exam-skills') return set.items.filter(keepOther).filter((it) => !query.difficulty || it.difficulty === query.difficulty);
  const want = query.difficulty;
  const all = [
    ...set.items,
    ...generatedItems(setId, want ? 4 : 2),
    ...expertItems(set.items, want === 'expert' ? 10 : 1),
    ...(want === 'expert' ? expertDrillItems(setId, 6) : []),
  ].filter(keepOther);
  let pool = want ? all.filter((it) => it.difficulty === want) : all;
  if (want && pool.length < MIN_AT_LEVEL) {
    // Not enough at exactly this level: top up from the nearest levels (closest first).
    const near = all.filter((it) => it.difficulty !== want).sort((a, b) => Math.abs(RANK[a.difficulty] - RANK[want]) - Math.abs(RANK[b.difficulty] - RANK[want]) || Math.random() - 0.5);
    pool = [...pool, ...near.slice(0, MIN_AT_LEVEL - pool.length)];
  }
  const authored = pool.filter((it) => !it.generated);
  const generated = pool.filter((it) => it.generated);
  const size = Math.min(SESSION_SIZE, authored.length + generated.length);
  // Round-robin across task types so every session mixes multiple choice, matching, ordering, writing…
  const groups = {};
  [...shuffle(authored), ...shuffle(generated)].forEach((it) => { (groups[typeClass(it)] = groups[typeClass(it)] || []).push(it); });
  Object.keys(groups).forEach((k) => { groups[k] = shuffle(groups[k]); });
  const picked = [];
  while (picked.length < size) {
    const keys = shuffle(Object.keys(groups).filter((k) => groups[k].length));
    if (!keys.length) break;
    for (const k of keys) { if (picked.length < size) picked.push(groups[k].shift()); }
  }
  return mixByType(picked);
}
