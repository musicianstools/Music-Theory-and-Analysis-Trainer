// NASHVILLE NUMBERS — chords as numbers relative to the key (1 = the tonic chord).
// Tasks: chord symbols → numbers (built slot by slot), numbers → chord symbols, and hear a progression → numbers.
// Chord tokens: [prefix ♭/♯][number 1–7][suffix: '' major | 'm' minor | '°' diminished | '7' dominant 7th | 'maj7' | 'm7' | '+' augmented][/bass 3|5|7]
import { LETTERS, KEYS, pick, rand } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const MAJ = [0, 2, 4, 5, 7, 9, 11];
const PC = [0, 2, 4, 5, 7, 9, 11];
const ACC = { '-2': '♭♭', '-1': '♭', 0: '', 1: '♯', 2: '×' };
const QUAL = { '': [0, 4, 7], m: [0, 3, 7], '°': [0, 3, 6], 7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], '+': [0, 4, 8] };
const QUAL_NAME = { '': 'major', m: 'minor', '°': 'diminished', 7: 'dominant 7th', maj7: 'major 7th', m7: 'minor 7th', '+': 'augmented' };

// Chord pools by level (tokens). Each level includes the previous ones.
const POOLS = {
  1: ['1', '4', '5'],
  2: ['1', '2m', '3m', '4', '5', '6m'],
  3: ['1', '2m', '3m', '4', '5', '6m', '57', '2m7', '1maj7', '1/3', '5/7', '4maj7'],
  4: ['1', '2m', '4', '5', '6m', '57', '2m7', '1/3', '♭7', '♭6', '4m', '2', '37', '7°', '♭3'],
  5: ['1', '2m7', '57', '6m', '1maj7', '♭27', '♭3', '♭6', '♭7', '♯4°', '1+', '4m6', '37', '5/7', '♭2maj7'],
};
const KEY_MAX = { 1: 0, 2: 2, 3: 7, 4: 7, 5: 7 };

export function parseToken(tok) {
  const m = /^([♭♯]?)([1-7])(maj7|m7|m6|m|°|7|\+)?(?:\/([1-7]))?$/.exec(tok);
  if (!m) return null;
  return { pre: m[1] === '♭' ? -1 : m[1] === '♯' ? 1 : 0, num: Number(m[2]), suf: m[3] || '', bass: m[4] ? Number(m[4]) : null };
}

/** Spell the chord for a token in a major key (tonic = { l, a }). Returns { name, root, tones (semitones above root), bassSemi }. */
export function chordFor(tok, key) {
  const p = parseToken(tok);
  const l = (key.l + p.num - 1) % 7;
  const target = (PC[key.l] + key.a + MAJ[p.num - 1] + p.pre + 120) % 12;
  let a = ((target - PC[l] + 18) % 12) - 6;
  const rootName = LETTERS[l] + ACC[a];
  const suffix = p.suf === '°' ? 'dim' : p.suf === 'm6' ? 'm6' : p.suf;
  const tones = p.suf === 'm6' ? [0, 3, 7, 9] : QUAL[p.suf];
  let name = rootName + (suffix === 'dim' ? '°' : suffix);
  let bassSemi = 0;
  if (p.bass) {
    // Nashville slash = the bass note as a degree of the KEY (5/7 in C = G/B)
    const bl = (key.l + p.bass - 1) % 7;
    const bt = (PC[key.l] + key.a + MAJ[p.bass - 1] + 120) % 12;
    const ba = ((bt - PC[bl] + 18) % 12) - 6;
    name += `/${LETTERS[bl]}${ACC[ba]}`;
    bassSemi = (bt - target + 12) % 12;
  }
  return { name, rootPc: target, tones, bassSemi, a };
}

function keyFor(level) {
  const k = pick(KEYS.filter((x) => x.count <= KEY_MAX[level]));
  const l = LETTERS.indexOf(k.major[0]);
  const a = k.major.includes('♯') ? 1 : k.major.includes('♭') ? -1 : 0;
  return { name: k.major, l, a };
}

function progression(level) {
  const pool = POOLS[level];
  const len = level <= 2 ? 4 : level === 3 ? 6 : 8;
  const out = ['1'];
  while (out.length < len - 1) {
    const c = pick(pool.filter((x) => x !== out[out.length - 1]));
    out.push(c);
  }
  out.push(Math.random() < 0.75 ? '1' : pick(['5', '57'].filter((x) => pool.includes(x)).concat(['5'])));
  if (out[out.length - 1] === out[out.length - 2]) out[out.length - 2] = pick(pool.filter((x) => x !== out[out.length - 1]));
  return out;
}

function audioFor(prog, key) {
  return prog.flatMap((tok, i) => {
    const c = chordFor(tok, key);
    const root = 48 + c.rootPc;
    const r = root > 55 ? root - 12 : root;
    const bass = r - 12 + c.bassSemi - (c.bassSemi > 7 ? 12 : 0);
    const upper = c.tones.map((t) => r + 12 + t);
    return [{ t: i * 1.1, d: 1.0, notes: [bass, ...upper], timbre: 'organ', gain: 0.75 }];
  });
}

const mutate = (prog, level) => {
  const v = [...prog];
  const i = 1 + rand(v.length - 1);
  const pool = POOLS[level].filter((x) => x !== v[i]);
  v[i] = pick(pool);
  return v;
};

export const NASHVILLE_DRILL = {
  id: 'nashville', title: 'Nashville Numbers', stage: 'know', skills: ['theory', 'terminology'], kind: 'Harmony', verbs: ['Identify', 'Apply'],
  blurb: 'Chords as numbers in a key: 1 – 4 – 5, 6m, 57, ♭7… Write the numbers, find the chords, or hear the progression.',
  settings: [
    { key: 'mode', label: 'Task', options: [['name', 'Chords → numbers'], ['chords', 'Numbers → chords'], ['hear', 'Hear it → numbers']] },
    { key: 'level', label: 'Chords', options: [['1', '1, 4, 5 in C'], ['2', 'All diatonic triads'], ['3', '+ 7ths and slash chords'], ['4', '+ borrowed and secondary chords'], ['5', '+ tritone subs and chromatic chords']] },
  ],
  defaults: { mode: 'name', level: '2' },
  levels: { 1: { level: '1' }, 2: { level: '2' }, 3: { level: '3' }, 4: { level: '4' }, 5: { level: '5' } },
  generate(s) {
    const level = Number(s.level);
    const key = keyFor(level);
    const prog = progression(level);
    const names = prog.map((t) => chordFor(t, key).name);
    const chart = prog.join(' – ');
    const legend = 'In Nashville numbers, the number is the scale degree of the chord root in the major key. Major chords are just the number (4); add m for minor (6m), ° for diminished, 7 for a dominant 7th (57), maj7 for a major 7th; ♭ or ♯ means the root is lowered or raised (♭7); a slash shows the bass note as a number in the key (1/3 = the 1 chord over the 3rd degree of the key — C/E in C; 5/7 = G/B).';
    const walk = prog.map((t, i) => `${names[i]} = ${t}`).join(', ');
    const tags = [`Task|${{ name: 'Chords → numbers', chords: 'Numbers → chords', hear: 'Hear → numbers' }[s.mode]}`, `Level|${level}`];
    if (s.mode === 'chords' || s.mode === 'hear') {
      const variants = new Map([[chart, prog]]);
      for (let k = 0; k < 100 && variants.size < 4; k++) { const v = mutate(prog, level); variants.set(v.join(' – '), v); }
      const opts = shuffle([...variants.entries()]).map(([c, v]) => ({ value: c, label: s.mode === 'chords' ? v.map((t) => chordFor(t, key).name).join(' – ') : c }));
      return {
        prompt: s.mode === 'chords' ? `Key of ${key.name}. Which chords does this chart mean?  ${chart}` : `Listen. The key is ${key.name} and the first chord is 1. Which chart matches?`,
        audio: s.mode === 'hear' ? audioFor(prog, key) : null,
        pad: 'choice', options: opts, tags,
        solution: chart, check: (r) => r === chart,
        answerText: s.mode === 'chords' ? names.join(' – ') : chart,
        explain: `${walk}. ${legend}`,
      };
    }
    return {
      prompt: `Key of ${key.name}. Write these chords as Nashville numbers:  ${names.join(' – ')}`,
      pad: 'nashville', padProps: { count: prog.length, level },
      tags,
      solution: prog,
      check: (r) => Array.isArray(r) && r.length === prog.length && r.every((x, i) => x === prog[i]),
      answerText: chart,
      explain: `${walk}. ${legend}`,
    };
  },
};
