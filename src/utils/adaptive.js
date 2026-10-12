// ADAPTIVE PRACTICE — suggested levels and spaced review, worked out from the progress store.
//
// Level topics are stored as `lv:<scope>:<n>` (scope = 'set:<id>', 'drill:<id>' or 'mock'), so they never
// mix with the strengths/weaknesses topics. Spaced review looks at the ordinary topics (cat:, set:, drill:).
import { summarize, topicLabel, topicHref } from './stats.js';

export const levelTopic = (scope, n) => `lv:${scope}:${n}`;
const WINDOW = 10; // judge a level on the last 10 answers there
const NEED = 6; // answers before a level suggestion is made
const UP = 0.85;
const DOWN = 0.5;
const DAY = 86400000;
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);


/**
 * Suggest a level for one set, drill or the mock exam.
 * Returns null (no data yet) or { level, from, dir: 'up' | 'down' | 'stay', pct, count, reason }.
 */
export function suggestLevel(st, scope) {
  const topics = st.topics || {};
  const tried = [1, 2, 3, 4, 5].map((n) => ({ n, r: topics[levelTopic(scope, n)] })).filter((x) => x.r?.attempts);
  if (!tried.length) return null;
  const cur = tried.sort((a, b) => (b.r.last || 0) - (a.r.last || 0))[0];
  const recent = cur.r.recent.slice(-WINDOW);
  const pct = Math.round(avg(recent) * 100);
  const base = { from: cur.n, pct, count: recent.length };
  if (recent.length < NEED) {
    return { ...base, level: cur.n, dir: 'stay', reason: `Keep going at Level ${cur.n}: ${NEED - recent.length} more answer${NEED - recent.length === 1 ? '' : 's'} and a level will be suggested.` };
  }
  if (pct >= UP * 100 && cur.n < 5) return { ...base, level: cur.n + 1, dir: 'up', reason: `${pct}% on your last ${recent.length} at Level ${cur.n} — ready for Level ${cur.n + 1}.` };
  if (pct < DOWN * 100 && cur.n > 1) return { ...base, level: cur.n - 1, dir: 'down', reason: `${pct}% on your last ${recent.length} at Level ${cur.n}. Drop to Level ${cur.n - 1} to secure the basics, then move back up.` };
  return { ...base, level: cur.n, dir: 'stay', reason: cur.n === 5 && pct >= UP * 100 ? `${pct}% at Level 5. Nothing harder — keep it sharp.` : `${pct}% on your last ${recent.length} at Level ${cur.n}. Stay here until you are above ${UP * 100}%.` };
}

/** One level for the whole app (used by the mock exam builder): mock history first, then everything else. */
export function suggestOverallLevel(st) {
  const mock = suggestLevel(st, 'mock');
  if (mock && mock.count >= NEED) return mock;
  const scopes = [...new Set(Object.keys(st.topics || {}).filter((k) => k.startsWith('lv:') && !k.startsWith('lv:mock')).map((k) => k.slice(3, k.lastIndexOf(':'))))];
  const sugg = scopes.map((s) => suggestLevel(st, s)).filter((x) => x && x.count >= NEED);
  if (!sugg.length) return mock;
  const levels = sugg.map((x) => x.level).sort((a, b) => a - b);
  const level = levels[Math.floor((levels.length - 1) / 2)];
  return { level, dir: 'stay', count: sugg.reduce((n, x) => n + x.count, 0), reason: `Based on your recent practice in ${sugg.length} practice area${sugg.length === 1 ? "" : "s"}.` };
}

// ---------------- Spaced review ----------------
// A topic comes back after a gap that grows with how well it is known:
// below 50% → 1 day, below 70% → 2 days, below 85% → 5 days, otherwise 14 days.
const GAP_DAYS = (pct) => (pct < 50 ? 1 : pct < 70 ? 2 : pct < 85 ? 5 : 14);
const MIN_ATTEMPTS = 3;

function reviewCandidates(st) {
  const topics = st.topics || {};
  const keys = Object.keys(topics);
  const drillsWithDetail = new Set(keys.filter((k) => k.startsWith('drill:') && k.split('|').length === 3).map((k) => k.split('|')[0]));
  return keys.filter((k) => {
    if (k.startsWith('cat:')) return true;
    if (k.startsWith('set:')) return k !== 'set:theory';
    if (k.startsWith('drill:')) {
      const parts = k.split('|');
      if (parts.length === 3) return !/^(Level|Answer|Task|Clef|Shape|Mode|Display|Played|Played as|Voicing|Position|Starting note|Length|Accidental|Direction|Note|Tonic|Root|Covers)$/.test(parts[1]);
      return parts.length === 1 && !drillsWithDetail.has(k);
    }
    return false;
  });
}

/**
 * Topics due for review today, most urgent first.
 * Each: { key, label, href, pct, attempts, days (since last practised), gap, reason }
 */
export function dueForReview(st, now = Date.now(), limit = 4) {
  return reviewCandidates(st)
    .map((key) => {
      const s = summarize(st.topics[key]);
      if (!s || s.attempts < MIN_ATTEMPTS || !s.last) return null;
      const pct = Math.round(avg(st.topics[key].recent.slice(-WINDOW)) * 100);
      const days = (now - s.last) / DAY;
      const gap = GAP_DAYS(pct);
      if (days < gap) return null;
      const d = Math.floor(days);
      return {
        key, label: topicLabel(key), href: topicHref(key), pct, attempts: s.attempts, days: d, gap,
        urgency: (days / gap) * (1.2 - pct / 100),
        reason: pct < 70 ? `${pct}% last time · ${d === 1 ? 'yesterday' : `${d} days ago`}` : `${pct}% · keep it fresh (${d} days ago)`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, limit);
}

/** When the next review falls due, if nothing is due now (for a friendly "next review" line). */
export function nextReviewIn(st, now = Date.now()) {
  let soonest = null;
  reviewCandidates(st).forEach((key) => {
    const r = st.topics[key];
    if (!r || r.attempts < MIN_ATTEMPTS || !r.last) return;
    const pct = Math.round(avg(r.recent.slice(-WINDOW)) * 100);
    const at = r.last + GAP_DAYS(pct) * DAY;
    if (at > now && (soonest === null || at < soonest)) soonest = at;
  });
  return soonest === null ? null : Math.max(1, Math.ceil((soonest - now) / DAY));
}
