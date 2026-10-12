// Turns the raw progress store into readable statistics for the Stats page and Home.
import { SETS, FILTER_LABELS } from '../data/index.js';
import { DRILLS } from '../drills/drills.js';
import { EXAM_MODES } from '../data/examModes.js';

export const MIN_FOR_VERDICT = 5; // attempts needed before a topic counts as a strength or weakness
const RECENT = 20;

const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

/** { attempts, recent %, allTime %, trend (points vs previous window) | null, last } */
export function summarize(rec) {
  if (!rec || !rec.attempts) return null;
  const recent = rec.recent.slice(-RECENT);
  const prev = rec.recent.slice(-2 * RECENT, -RECENT);
  const sum = rec.sum ?? rec.recent.reduce((a, b) => a + b, 0);
  return {
    attempts: rec.attempts,
    recent: Math.round(avg(recent) * 100),
    allTime: Math.round((sum / rec.attempts) * 100),
    trend: prev.length >= 5 ? Math.round((avg(recent) - avg(prev)) * 100) : null,
    last: rec.last || null,
  };
}

const THEORY_ORDER = ['notation', 'intervals', 'scales', 'modes', 'keys', 'scale-degrees', 'enharmonics', 'chords', 'harmony', 'cadences', 'tonality', 'modulation', 'transposition',
  'rhythm', 'metre', 'note-values', 'tempo', 'dynamics', 'articulation', 'terms', 'melody', 'texture', 'timbre', 'instruments', 'voices', 'form', 'elements'];
export const THEORY_TOPICS = THEORY_ORDER.filter((c) => c === 'notation' || SETS.theory.items.some((i) => i.category === c) || c === 'elements');

export function topicLabel(key) {
  const [ns, rest] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (ns === 'cat') return FILTER_LABELS.category[rest] || rest;
  if (ns === 'set') return SETS[rest]?.title || rest;
  if (ns === 'exam') return EXAM_MODES.find((m) => m.id === rest.split('|')[0])?.title || rest;
  if (ns === 'drill') {
    const [id, group, value] = rest.split('|');
    const d = DRILLS.find((x) => x.id === id);
    return group ? `${d?.title || id}: ${value}` : d?.title || id;
  }
  return key;
}

export function topicHref(key) {
  const [ns, rest] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (ns === 'cat') return THEORY_TOPICS.includes(rest) && rest !== 'notation' ? `/practice/theory?category=${rest}` : rest === 'notation' ? '/drill/note-id' : '/practice/theory';
  if (ns === 'set') return `/practice/${rest}`;
  if (ns === 'drill') return `/drill/${rest.split('|')[0]}`;
  if (ns === 'exam') return `/exam/${rest.split('|')[0]}`;
  return '/';
}

/** Strengths and weaknesses across theory topics, drill details and practice sets. */
export function strengthsAndWeaknesses(st) {
  const rows = Object.entries(st.topics || {})
    .filter(([k]) => k.startsWith('cat:') || k.startsWith('set:') || (k.startsWith('drill:') && k.split('|').length === 3))
    .filter(([k]) => !(k.startsWith('set:theory')))
    .map(([k, r]) => ({ key: k, label: topicLabel(k), href: topicHref(k), ...summarize(r) }))
    .filter((r) => r.attempts >= MIN_FOR_VERDICT);
  const sorted = [...rows].sort((a, b) => b.recent - a.recent || b.attempts - a.attempts);
  return {
    strengths: sorted.filter((r) => r.recent >= 70).slice(0, 4),
    weaknesses: [...sorted].reverse().filter((r) => r.recent < 70).slice(0, 4),
    eligible: rows.length,
  };
}

/** Headline numbers. */
export function headline(st) {
  const topics = st.topics || {};
  const top = Object.entries(topics).filter(([k]) => k.startsWith('set:') || (k.startsWith('drill:') && !k.includes('|')) || (k.startsWith('exam:') && !k.includes('|')));
  const attempts = top.reduce((n, [, r]) => n + r.attempts, 0);
  const sum = top.reduce((n, [, r]) => n + (r.sum ?? 0), 0);
  const drillAnswers = Object.entries(topics).filter(([k]) => k.startsWith('drill:') && !k.includes('|')).reduce((n, [, r]) => n + r.attempts, 0);
  const days = Object.keys(st.days || {}).sort();
  // Current streak: consecutive days up to today (or yesterday)
  let streak = 0;
  const d = new Date();
  const key = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  if (!(st.days || {})[key(d)]) d.setDate(d.getDate() - 1);
  while ((st.days || {})[key(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return {
    answered: attempts,
    accuracy: attempts ? Math.round((sum / attempts) * 100) : null,
    drillAnswers,
    daysPractised: days.length,
    streak,
  };
}

/** Per-drill breakdown: { drill, summary, groups: [{ group, rows: [{ value, ...summary }] }] } */
export function drillBreakdown(st) {
  const topics = st.topics || {};
  return DRILLS.map((d) => {
    const summary = summarize(topics[`drill:${d.id}`]);
    const groups = {};
    Object.entries(topics).forEach(([k, r]) => {
      if (!k.startsWith(`drill:${d.id}|`)) return;
      const [, group, value] = k.split('|');
      (groups[group] = groups[group] || []).push({ value, key: k, ...summarize(r) });
    });
    return {
      drill: d,
      summary,
      groups: Object.entries(groups).map(([group, rows]) => ({ group, rows: rows.sort((a, b) => a.recent - b.recent) })),
    };
  });
}

export function timeAgo(t) {
  if (!t) return '—';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}
