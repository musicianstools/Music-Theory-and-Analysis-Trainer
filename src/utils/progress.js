// Student progress, stored in localStorage.
// Shape is deliberately simple and serialisable so a future teacher dashboard / backend
// can sync it (see README "Future teacher mode").
import { useSyncExternalStore } from 'react';

const KEY = 'met-progress-v1';
const RECENT_WINDOW = 20; // skill % = average of the most recent N scored attempts
const KEEP = 40; // stored history (recent window + previous window, for trends)

export const STAGES = [
  { key: 'know', label: 'Know', statement: 'I know the terminology.' },
  { key: 'hear', label: 'Hear', statement: 'I can identify the feature.' },
  { key: 'explain', label: 'Analyse', statement: 'I can analyse what a feature does and what it means.' },
  { key: 'connect', label: 'Connect', statement: 'I can connect the feature to meaning and other elements.' },
  { key: 'argue', label: 'Argue', statement: 'I can turn the theme into a specific, defensible claim.' },
  { key: 'write', label: 'Write', statement: 'I can use my argument and evidence to write a strong response.' },
];

export const SKILLS = [
  { key: 'theory', label: 'Theory', stage: 'know', href: '/practice/theory',
    low: 'Some core concepts are still shaky. Secure terminology first — it is the vocabulary every later skill depends on.',
    mid: 'Your theory is developing. Target the categories where you lose marks.' },
  { key: 'terminology', label: 'Terminology', stage: 'know', href: '/practice/theory',
    low: 'Precise terms make analysis credible. Practise naming what you hear with the correct word.',
    mid: 'Your terminology is mostly accurate — aim for more specific terms (e.g. "syncopation", not "interesting rhythm").' },
  { key: 'listening', label: 'Listening', stage: 'hear', href: '/practice/listening',
    low: 'Train your ear to locate features — evidence starts with hearing it.',
    mid: 'You are hearing features well. Focus on locating exactly when they happen.' },
  { key: 'evidence', label: 'Musical Evidence', stage: 'explain', href: '/practice/evidence-meaning',
    low: 'You often name a meaning without pointing to specific musical evidence. Practise linking evidence to meaning.',
    mid: 'Your evidence is improving — make it more specific (where, how, compared with what).' },
  { key: 'effect', label: 'Analysing Effect', stage: 'explain', href: '/practice/feature-effect',
    low: 'You are identifying features, but not yet explaining what they do. Practise moving from feature to effect.',
    mid: 'You explain effects well — now push each effect towards meaning.' },
  { key: 'interconnectivity', label: 'Interconnectivity', stage: 'connect', href: '/connect',
    low: 'Your analysis tends to list elements one at a time. Practise showing how elements work together.',
    mid: 'You are connecting elements — try naming the relationship (reinforce, contrast, develop).' },
  { key: 'themeArgument', label: 'Theme → Argument', stage: 'argue', href: '/practice/theme-argument',
    low: 'You are identifying themes, but your arguments are often too broad. Practise turning a theme into a specific, arguable claim.',
    mid: 'Your arguments are getting sharper. Push for claims about how the theme develops or changes.' },
  { key: 'argument', label: 'Argument', stage: 'argue', href: '/practice/argument-builder',
    low: 'Practise building a claim and supporting it step by step with evidence, effect and meaning.',
    mid: 'Your arguments are supported — strengthen the evaluation at the end.' },
  { key: 'writing', label: 'Written Analysis', stage: 'write', href: '/practice/paragraph-builder',
    low: 'Bring the skills together in a paragraph. The scaffold will guide each component.',
    mid: 'Your paragraphs have structure — try removing scaffolding to write more independently.' },
];

export const SKILL_GROUPS = [
  { label: 'Theory', skills: ['theory', 'terminology'] },
  { label: 'Listening', skills: ['listening'] },
  { label: 'Analysis', skills: ['evidence', 'effect'] },
  { label: 'Connection', skills: ['interconnectivity'] },
  { label: 'Argument', skills: ['themeArgument', 'argument'] },
  { label: 'Writing', skills: ['writing'] },
];

const empty = () => ({ skills: {}, topics: {}, days: {}, activity: [], items: {}, created: Date.now() });

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

let state = typeof window === 'undefined' ? empty() : load();
const listeners = new Set();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable — keep in memory */ }
  listeners.forEach((l) => l());
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

const bump = (prev, s, now) => {
  const p = prev || { attempts: 0, sum: 0, recent: [] };
  return { attempts: p.attempts + 1, sum: (p.sum ?? p.recent.reduce((a, b) => a + b, 0)) + s, recent: [...p.recent, s].slice(-KEEP), last: now };
};
const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/**
 * Record a scored attempt (score 0–1) against skills and topics.
 * topics are namespaced keys, e.g. 'cat:intervals', 'set:theory', 'drill:interval-id', 'drill:interval-id|Size|6th'.
 */
export function recordResult(itemId, skills, score, topics = []) {
  const s = Math.max(0, Math.min(1, Number(score) || 0));
  const now = Date.now();
  const next = { ...state, skills: { ...state.skills }, items: { ...state.items }, topics: { ...(state.topics || {}) }, days: { ...(state.days || {}) } };
  for (const key of new Set(skills || [])) {
    if (!SKILLS.find((k) => k.key === key)) continue;
    next.skills[key] = bump(next.skills[key], s, now);
  }
  for (const t of new Set((topics || []).filter(Boolean))) next.topics[t] = bump(next.topics[t], s, now);
  const dk = dayKey(now);
  next.days[dk] = (next.days[dk] || 0) + 1;
  if (itemId) {
    const prev = next.items[itemId];
    next.items[itemId] = { best: Math.max(prev?.best ?? 0, s), last: s, at: Date.now() };
  }
  state = next;
  save();
}

/** Log a finished session for "Continue practising". */
export function logActivity({ title, href, score, count, stage }) {
  state = {
    ...state,
    activity: [{ title, href, score, count, stage, at: Date.now() }, ...state.activity].slice(0, 12),
  };
  save();
}

export function resetProgress() {
  state = empty();
  save();
}

export function skillPercent(st, key) {
  const s = st.skills[key];
  if (!s || !s.recent.length) return null;
  const r = s.recent.slice(-RECENT_WINDOW);
  return Math.round((r.reduce((a, b) => a + b, 0) / r.length) * 100);
}

export function groupPercent(st, keys) {
  const vals = keys.map((k) => skillPercent(st, k)).filter((v) => v !== null);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

export function stagePercent(st, stageKey) {
  return groupPercent(st, SKILLS.filter((s) => s.stage === stageKey).map((s) => s.key));
}

/** Decide what the student should practise next, and why. */
export function getRecommendation(st) {
  const scored = SKILLS.map((s) => ({ ...s, pct: skillPercent(st, s.key) })).filter((s) => s.pct !== null);
  const untried = SKILLS.filter((s) => skillPercent(st, s.key) === null);

  if (!scored.length) {
    return {
      skill: SKILLS[0],
      title: 'Start with the foundations',
      message: 'Begin at KNOW: a short theory set shows what you already know and builds the vocabulary you will use in every analysis.',
      href: '/practice/theory',
      strongest: null,
    };
  }
  const sorted = [...scored].sort((a, b) => a.pct - b.pct);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  // If everything attempted is solid, move the student forward to the next untried stage.
  if (weakest.pct >= 75 && untried.length) {
    const next = untried[0];
    return {
      skill: next,
      title: next.label,
      message: `Your attempted skills are secure (lowest is ${weakest.label} at ${weakest.pct}%). Move forward to ${next.label} — the next step on the path to writing.`,
      href: next.href,
      strongest,
    };
  }
  return {
    skill: weakest,
    title: weakest.label,
    message: weakest.pct < 60 ? weakest.low : weakest.mid,
    href: weakest.href,
    strongest,
  };
}
