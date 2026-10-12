// MOCK EXAM BUILDER — assembles a timed paper from every part of the app at one of the five levels.
// Sections: A Theory · B Listening · C Score reading · D Analysis · E Written response.
// Every paper is generated fresh, and every objective question is auto-marked.
import { getSet } from './index.js';
import { generatedItems, drillChoiceMcq, notationItems } from './generators.js';
import { getDrill } from '../drills/drills.js';
import { LEVEL_PRESETS } from '../drills/levelPresets.js';
import { LEVELS } from './levels.js';
import { isObjective } from '../utils/grade.js';
import { expertItems } from '../utils/expert.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
let n = 0;
const uid = (p) => `mock-${p}-${Date.now().toString(36)}-${(n++).toString(36)}`;
const LETTERS = 'abcdefgh';

export const SECTIONS = [
  { key: 'theory', letter: 'A', title: 'Theory', perItem: 1.25, max: 20, blurb: 'Notation, keys, intervals, chords, form and terms.' },
  { key: 'listening', letter: 'B', title: 'Listening', perItem: 1.5, max: 15, blurb: 'Intervals, chords, cadences, metre, texture and timbre — by ear.' },
  { key: 'score', letter: 'C', title: 'Score reading', perItem: 7, max: 3, unit: 'excerpt', blurb: 'A 4–8 bar excerpt: key, metre, tempo, dynamics, articulation, shape, texture and cadence.' },
  { key: 'analysis', letter: 'D', title: 'Analysis', perItem: 1.75, max: 15, blurb: 'Feature → effect, evidence → meaning, connections and synonyms, anchored to set songs.' },
];

export const WRITING_TASKS = [
  { key: 'none', title: 'No written task', minutes: 0 },
  { key: 'theme', title: 'Theme → argument', minutes: 6, blurb: 'Develop an arguable claim about a theme, with a musical direction.' },
  { key: 'paragraph', title: 'Analytical paragraph', minutes: 12, blurb: 'One analytical paragraph on a set song.' },
  { key: 'response', title: 'Extended response', minutes: 60, blurb: 'Introduction plus three key-moment paragraphs, on a freshly generated question.' },
];

export const DEFAULT_CONFIG = { level: 2, theory: 8, listening: 6, score: 1, analysis: 6, writing: 'paragraph', timed: true };

export function suggestedMinutes(cfg) {
  const obj = SECTIONS.reduce((t, s) => t + (Number(cfg[s.key]) || 0) * s.perItem, 0);
  const w = WRITING_TASKS.find((x) => x.key === cfg.writing)?.minutes || 0;
  return Math.max(5, Math.ceil((obj + w) / 5) * 5);
}

export const encodeConfig = (c) => [c.level, c.theory, c.listening, c.score, c.analysis, c.writing, c.timed ? (c.minutes || suggestedMinutes(c)) : 0].join('.');
export function decodeConfig(s) {
  const [level, theory, listening, score, analysis, writing, minutes] = String(s || '').split('.');
  const num = (v, max, d) => { const x = Number(v); return Number.isFinite(x) ? Math.max(0, Math.min(max, Math.round(x))) : d; };
  const cfg = {
    level: num(level, 5, DEFAULT_CONFIG.level) || 1,
    theory: num(theory, 20, DEFAULT_CONFIG.theory),
    listening: num(listening, 15, DEFAULT_CONFIG.listening),
    score: num(score, 3, DEFAULT_CONFIG.score),
    analysis: num(analysis, 15, DEFAULT_CONFIG.analysis),
    writing: WRITING_TASKS.some((w) => w.key === writing) ? writing : DEFAULT_CONFIG.writing,
  };
  const m = num(minutes, 240, 0);
  return { ...cfg, timed: m > 0, minutes: m || suggestedMinutes(cfg) };
}

/** Items from practice sets at (or nearest to) a level. */
function fromSets(setIds, level, count) {
  const key = LEVELS[level - 1].key;
  const all = setIds.flatMap((id) => {
    const set = getSet(id);
    if (!set) return [];
    return [...set.items, ...generatedItems(id, 2), ...(level === 5 ? expertItems(set.items, 6) : [])];
  }).filter(isObjective);
  const exact = shuffle(all.filter((it) => it.difficulty === key));
  const near = shuffle(all.filter((it) => it.difficulty !== key))
    .sort((a, b) => Math.abs(rank(a.difficulty) - level) - Math.abs(rank(b.difficulty) - level));
  const seen = new Set();
  return [...exact, ...near].filter((it) => (seen.has(it.id) ? false : seen.add(it.id))).slice(0, count);
}
const rank = (key) => (LEVELS.findIndex((l) => l.key === key) + 1) || 3;

/** A drill question with a multichoice pad (e.g. timbre words) as a "select all" item. */
function drillMulti(id, level, category) {
  const d = getDrill(id);
  if (!d) return null;
  const preset = (d.levels || LEVEL_PRESETS[id] || {})[level] || {};
  const q = d.generate({ ...d.defaults, ...preset });
  if (q.pad !== 'multichoice' || !q.options) return null;
  const opts = q.options.slice(0, 8).map((o, i) => ({ id: LETTERS[i], text: o.label, value: o.value }));
  const want = new Set(q.solution);
  return {
    id: uid(id), type: 'multi', generated: true, category, difficulty: LEVELS[level - 1].key, skills: d.skills,
    prompt: q.prompt, audio: q.audio ? { events: q.audio } : undefined,
    options: opts.map(({ id: oid, text }) => ({ id: oid, text })),
    correctAnswers: opts.filter((o) => want.has(o.value)).map((o) => o.id),
    explanation: q.explain,
  };
}

function drillItems(ids, level, category, count) {
  const out = [];
  for (let tries = 0; out.length < count && tries < count * 6; tries++) {
    const id = pick(ids);
    const x = drillChoiceMcq(id, level, category);
    if (x) out.push({ ...x, difficulty: LEVELS[level - 1].key });
  }
  return out;
}

function theorySection(level, count) {
  if (!count) return [];
  const notation = shuffle(notationItems(level === 5)).slice(0, Math.ceil(count / 4)).map((x) => ({ ...x, difficulty: LEVELS[level - 1].key }));
  const drills = drillItems(['keysig-id', 'form', 'score-terms'], level, 'notation', Math.ceil(count / 4));
  const rest = fromSets(['theory'], level, count);
  return shuffle([...notation, ...drills, ...rest].slice(0, count));
}

const EAR_BY_LEVEL = {
  1: ['ear-interval', 'ear-scale', 'ear-metre', 'ear-feature', 'ear-texture'],
  2: ['ear-interval', 'ear-scale', 'ear-metre', 'ear-feature', 'ear-texture', 'ear-cadence'],
  3: ['ear-interval', 'ear-chord', 'ear-scale', 'ear-cadence', 'ear-metre', 'ear-feature', 'ear-texture'],
  4: ['ear-interval', 'ear-chord', 'ear-scale', 'ear-cadence', 'ear-metre', 'ear-texture'],
  5: ['ear-interval', 'ear-chord', 'ear-scale', 'ear-cadence', 'ear-metre', 'ear-feature', 'ear-texture'],
};
function listeningSection(level, count) {
  if (!count) return [];
  const timbre = count >= 4 ? [drillMulti('timbre', level, 'listening')].filter((x) => x && x.audio) : [];
  return shuffle([...timbre, ...drillItems(EAR_BY_LEVEL[level], level, 'listening', count - timbre.length)]).slice(0, count);
}

export function scoreSection(level, excerpts) {
  const out = [];
  for (let e = 1; e <= excerpts; e++) {
    const q = getDrill('excerpt').generate({ level: String(level) });
    const group = uid('excerpt');
    q.padProps.questions.forEach((x) => {
      const NONE = 'None of these';
      const choices = x.multi ? [...x.options, NONE] : x.options;
      const answer = x.multi && !x.answer.length ? [NONE] : x.answer;
      const opts = choices.map((t, i) => ({ id: LETTERS[i], text: t }));
      const base = {
        id: `${group}-${x.id}`, generated: true, category: 'score-reading', difficulty: LEVELS[level - 1].key, skills: ['theory', 'terminology'],
        prompt: x.q, score: q.score, audio: { events: q.audio }, group, groupLabel: `Excerpt ${e}`, options: opts, explanation: x.why,
      };
      out.push(x.multi
        ? { ...base, type: 'multi', correctAnswers: opts.filter((o) => answer.includes(o.text)).map((o) => o.id) }
        : { ...base, type: 'mcq', correctAnswer: opts.find((o) => o.text === answer).id });
    });
  }
  return out;
}

function analysisSection(level, count) {
  if (!count) return [];
  return fromSets(['feature-effect', 'evidence-meaning', 'feature-meaning', 'relationships', 'synonyms', 'connect'], level, count);
}

/** Build a whole paper: { questions (each tagged with `section`), writing kind, sections }. */
export function buildMockPaper(cfg) {
  const parts = {
    theory: theorySection(cfg.level, cfg.theory),
    listening: listeningSection(cfg.level, cfg.listening),
    score: scoreSection(cfg.level, cfg.score),
    analysis: analysisSection(cfg.level, cfg.analysis),
  };
  const questions = SECTIONS.flatMap((s) => parts[s.key].map((q) => ({ ...q, section: s.key })));
  return { questions, writing: cfg.writing === 'none' ? null : cfg.writing };
}

export const sectionOf = (key) => SECTIONS.find((s) => s.key === key);
