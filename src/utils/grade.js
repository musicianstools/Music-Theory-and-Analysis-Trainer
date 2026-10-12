// Grading for objective exercise types. Each returns { correct: boolean, score: 0–1 }.
// Exercise components are "controlled": they hold no answer logic, so the same component
// works in practice mode (instant feedback) and exam mode (feedback after submission).

export const OBJECTIVE_TYPES = ['mcq', 'multi', 'order', 'match'];
export const isObjective = (item) => OBJECTIVE_TYPES.includes(item.type);

export function emptyResponse(item) {
  switch (item.type) {
    case 'multi': return [];
    case 'match': return {};
    case 'order': return null; // component initialises a shuffled order
    default: return null;
  }
}

export function isAnswered(item, response) {
  if (response === null || response === undefined) return false;
  if (item.type === 'multi') return response.length > 0;
  if (item.type === 'match') return Object.keys(response).length === item.pairs.length;
  return true;
}

export function grade(item, response) {
  switch (item.type) {
    case 'mcq': {
      const correct = response === item.correctAnswer;
      return { correct, score: correct ? 1 : 0 };
    }
    case 'multi': {
      const want = new Set(item.correctAnswers);
      const got = new Set(response || []);
      let hits = 0, wrong = 0;
      got.forEach((g) => (want.has(g) ? hits++ : wrong++));
      const score = Math.max(0, (hits - wrong) / want.size);
      return { correct: hits === want.size && wrong === 0, score };
    }
    case 'order': {
      const order = response || [];
      const target = item.correctOrder;
      const pos = target.filter((id, i) => order[i] === id).length;
      return { correct: pos === target.length, score: pos / target.length };
    }
    case 'match': {
      const r = response || {};
      const right = item.pairs.filter((_, i) => r[i] === i).length;
      return { correct: right === item.pairs.length, score: right / item.pairs.length };
    }
    default:
      return { correct: false, score: 0 };
  }
}

/** Deterministic shuffle (seeded by item id) so order is stable across re-renders. */
export function seededShuffle(arr, seedStr = 'x') {
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
