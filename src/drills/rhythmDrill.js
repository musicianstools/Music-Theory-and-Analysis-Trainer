// RHYTHM — identification (hear → choose the notation), dictation (hear → build it) and note values.
// Rhythms are built from beat-groups, randomly, at three levels of complexity. Durations in ticks (12 = crotchet).
import { pick, rand } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const N = (t, rest = false) => (rest ? { t, rest: true } : { t });

// Beat-groups. `level`: 1 simple, 2 developing, 3 complex. `metre`: 'simple' (crotchet beat) or 'compound' (dotted-crotchet beat).
export const RHYTHM_GROUPS = [
  // simple metre
  { id: 'q', metre: 'simple', level: 1, notes: [N(12)] },
  { id: 'ee', metre: 'simple', level: 1, notes: [N(6), N(6)] },
  { id: 'qr', metre: 'simple', level: 1, notes: [N(12, true)] },
  { id: 'h', metre: 'simple', level: 1, notes: [N(24)] },
  { id: 'dh', metre: 'simple', level: 1, notes: [N(36)] },
  { id: 'w', metre: 'simple', level: 1, notes: [N(48)] },
  { id: 'ssss', metre: 'simple', level: 2, notes: [N(3), N(3), N(3), N(3)] },
  { id: 'ess', metre: 'simple', level: 2, notes: [N(6), N(3), N(3)] },
  { id: 'sse', metre: 'simple', level: 2, notes: [N(3), N(3), N(6)] },
  { id: 'dqe', metre: 'simple', level: 2, notes: [N(18), N(6)] },
  { id: 're', metre: 'simple', level: 2, notes: [N(6, true), N(6)] },
  { id: 'des', metre: 'simple', level: 3, notes: [N(9), N(3)] },
  { id: 'sde', metre: 'simple', level: 3, notes: [N(3), N(9)] },
  { id: 'ses', metre: 'simple', level: 3, notes: [N(3), N(6), N(3)] },
  { id: 'trip', metre: 'simple', level: 3, notes: [N(4), N(4), N(4)], triplet: true },
  { id: 'eqe', metre: 'simple', level: 3, notes: [N(6), N(12), N(6)] },
  { id: 'er', metre: 'simple', level: 3, notes: [N(6), N(6, true)] },
  { id: 'rss', metre: 'simple', level: 3, notes: [N(6, true), N(3), N(3)] },
  { id: 'qtrip', metre: 'simple', level: 4, notes: [N(8), N(8), N(8)], triplet: true },
  { id: 'rsrs', metre: 'simple', level: 4, notes: [N(3, true), N(3), N(3, true), N(3)] },
  { id: 'sder', metre: 'simple', level: 4, notes: [N(3), N(6), N(3, true)] },
  // compound metre (6/8): beat = dotted crotchet (18 ticks)
  { id: 'cdq', metre: 'compound', level: 1, notes: [N(18)] },
  { id: 'ceee', metre: 'compound', level: 1, notes: [N(6), N(6), N(6)] },
  { id: 'cqe', metre: 'compound', level: 1, notes: [N(12), N(6)] },
  { id: 'cdqr', metre: 'compound', level: 1, notes: [N(18, true)] },
  { id: 'cdh', metre: 'compound', level: 1, notes: [N(36)] },
  { id: 'ceq', metre: 'compound', level: 2, notes: [N(6), N(12)] },
  { id: 'cssee', metre: 'compound', level: 2, notes: [N(3), N(3), N(6), N(6)] },
  { id: 'cree', metre: 'compound', level: 2, notes: [N(6, true), N(6), N(6)] },
  { id: 'cdes', metre: 'compound', level: 3, notes: [N(9), N(3), N(6)] },
  { id: 'cssssss', metre: 'compound', level: 3, notes: [N(3), N(3), N(3), N(3), N(3), N(3)] },
  { id: 'ceess', metre: 'compound', level: 3, notes: [N(6), N(6), N(3), N(3)] },
  { id: 'crssee', metre: 'compound', level: 4, notes: [N(3, true), N(3), N(6), N(6)] },
  { id: 'cdqtie', metre: 'compound', level: 4, notes: [N(3), N(12), N(3)] },
];
export const groupTicks = (g) => g.notes.reduce((n, x) => n + x.t, 0);

const TIME_SIGS = { simple: [[2, 4], [3, 4], [4, 4]], compound: [[6, 8]], odd: [[5, 4]] };
const barTicksOf = (ts) => (ts[0] * 48) / ts[1];
const beatTicksOf = (ts) => (ts[1] === 8 ? 18 : 12);

function poolFor(level, metre, ts) {
  const bt = barTicksOf(ts);
  return RHYTHM_GROUPS.filter((g) => g.metre === metre && g.level <= level && groupTicks(g) <= bt);
}

/** Fill a bar with random groups; long notes are less likely so bars stay interesting. */
function makeBar(pool, ts) {
  for (let tries = 0; tries < 50; tries++) {
    let left = barTicksOf(ts);
    const bar = [];
    while (left > 0) {
      const fits = pool.filter((g) => groupTicks(g) <= left);
      const weighted = fits.flatMap((g) => Array(groupTicks(g) > beatTicksOf(ts) * 1.5 ? 1 : g.level === 1 ? 3 : 4).fill(g));
      const g = pick(weighted);
      bar.push(g);
      left -= groupTicks(g);
    }
    if (!bar.every((g) => g.notes.every((n) => n.rest))) return bar;
  }
  return [pool[0]];
}

const flat = (bars) => bars.map((bar) => bar.flatMap((g) => g.notes.map((n) => (n.rest ? `r${n.t}` : `${n.t}`))).join('.')).join('|');

/** Counting syllables for a rhythm: 1 e & a / 1 trip let; compound 1 ta & ta a ta. */
function countText(bars, ts) {
  const beat = beatTicksOf(ts);
  const SUB = beat === 12 ? { 0: '', 3: 'e', 6: '&', 9: 'a', 4: 'trip', 8: 'let', 16: 'let' } : { 0: '', 3: 'ta', 6: '&', 9: 'ta', 12: 'a', 15: 'ta' };
  return bars.map((bar) => {
    let t = 0;
    return bar.flatMap((g) => g.notes.map((n) => {
      const sub = t % beat;
      const w = sub === 0 ? String(Math.floor(t / beat) + 1) : SUB[sub] || '·';
      t += n.t;
      return n.rest ? `(${w})` : w;
    })).join(' ');
  }).join(' | ');
}

export function rhythmAudio(bars, ts, beatSec, { clickAll = false } = {}) {
  const beat = beatTicksOf(ts);
  const tickSec = beatSec / beat;
  const beatsPerBar = barTicksOf(ts) / beat;
  const ev = [];
  for (let b = 0; b < beatsPerBar; b++) ev.push({ t: b * beatSec, d: 0.05, notes: [b === 0 ? 96 : 91], timbre: 'click', gain: b === 0 ? 1 : 0.7 });
  const start = beatsPerBar * beatSec;
  let t = 0;
  bars.forEach((bar) => bar.forEach((g) => g.notes.forEach((n) => {
    if (!n.rest) ev.push({ t: start + t * tickSec, d: Math.max(0.08, n.t * tickSec * 0.85), notes: [72], gain: 0.9 });
    t += n.t;
  })));
  if (clickAll) for (let b = 0; b < (t / beat); b++) ev.push({ t: start + b * beatSec, d: 0.04, notes: [96], timbre: 'click', gain: b % beatsPerBar === 0 ? 0.5 : 0.3 });
  return ev;
}

const NOTE_NAMES = {
  48: ['Semibreve', 'whole note'], 36: ['Dotted minim', 'dotted half note'], 24: ['Minim', 'half note'], 18: ['Dotted crotchet', 'dotted quarter note'],
  12: ['Crotchet', 'quarter note'], 9: ['Dotted quaver', 'dotted eighth note'], 6: ['Quaver', 'eighth note'], 3: ['Semiquaver', 'sixteenth note'],
};
const nameOf = (t, rest) => `${NOTE_NAMES[t][0]}${rest ? ' rest' : ''} (${NOTE_NAMES[t][1]}${rest ? ' rest' : ''})`;

export const RHYTHM_DRILL = {
  id: 'rhythm', title: 'Rhythm Reading & Dictation', stage: 'know', skills: ['theory', 'listening'], ear: true, kind: 'Ear → notation', verbs: ['Identify', 'Apply'],
  blurb: 'Hear a rhythm and pick its notation, write it down yourself, or name note values — simple to complex, in simple and compound time.',
  settings: [
    { key: 'mode', label: 'Task', options: [['identify', 'Hear & choose the notation'], ['dictate', 'Dictation (build it)'], ['values', 'Name the note value']] },
    { key: 'level', label: 'Rhythms', options: [['1', 'Simple'], ['2', 'Developing (semiquavers, dotted)'], ['3', 'Complex (syncopation, triplets)'], ['4', 'Extreme (off-beat semiquavers, crotchet triplets)'], ['mix', 'Mixed']] },
    { key: 'metre', label: 'Time', options: [['simple', '2/4, 3/4, 4/4'], ['both', '+ 6/8'], ['odd', '+ 6/8 and 5/4']] },
    { key: 'bars', label: 'Length', options: [['1', '1 bar'], ['2', '2 bars']] },
  ],
  defaults: { mode: 'identify', level: 'mix', metre: 'simple', bars: '1' },
  generate(s) {
    const level = s.level === 'mix' ? pick([1, 2, 2, 3, 3]) : Number(s.level);
    if (s.mode === 'values') {
      const vals = level === 1 ? [48, 24, 12, 6] : level === 2 ? [48, 36, 24, 18, 12, 6, 3] : [48, 36, 24, 18, 12, 9, 6, 3];
      const t = pick(vals);
      const rest = [12, 24, 48, 6].includes(t) && level > 1 && Math.random() < 0.35;
      const others = shuffle(vals.filter((v) => v !== t)).slice(0, 3).map((v) => nameOf(v, rest));
      const answer = nameOf(t, rest);
      const options = shuffle([answer, ...others]).map((x) => ({ value: x, label: x }));
      return {
        prompt: `Name this ${rest ? 'rest' : 'note value'}.`,
        rhythm: { bars: [[{ notes: [{ t, rest }] }]], timeSig: null, width: 120, single: true },
        pad: 'choice', options,
        tags: [`Task|Note values`, `Value|${NOTE_NAMES[t][0]}${rest ? ' rest' : ''}`],
        solution: answer, check: (r) => r === answer, answerText: answer,
        explain: `${answer}: worth ${t / 12} crotchet beat${t === 12 ? '' : 's'} in simple time.${[36, 18, 9].includes(t) ? ' A dot adds half the value again.' : ''}`,
      };
    }
    const metre = s.metre !== 'simple' && Math.random() < 0.35 ? 'compound' : 'simple';
    const ts = metre === 'simple' && s.metre === 'odd' && Math.random() < 0.4 ? [5, 4] : pick(TIME_SIGS[metre]);
    const pool = poolFor(level, metre, ts);
    const bars = Array.from({ length: Number(s.bars) }, () => makeBar(pool, ts));
    const beatSec = metre === 'compound' ? 0.85 + Math.random() * 0.15 : 0.6 + Math.random() * 0.12;
    const audio = rhythmAudio(bars, ts, beatSec);
    const key = flat(bars);
    const count = countText(bars, ts);
    const asNotation = (bs) => bs.map((bar) => bar.map((g) => ({ notes: g.notes, triplet: g.triplet })));
    const tags = [`Task|${s.mode === 'dictate' ? 'Dictation' : 'Identification'}`, `Level|${['', 'Simple', 'Developing', 'Complex'][level]}`, `Time|${ts.join('/')}`];
    const explain = `Count it: ${count}  (numbers are beats; "&", "e", "a" ${metre === 'compound' ? 'and "ta"' : 'and "trip-let"'} are subdivisions; brackets are rests). ${metre === 'compound' ? 'In 6/8 there are two dotted-crotchet beats per bar, each dividing into three quavers.' : `In ${ts.join('/')} there are ${ts[0]} crotchet beats per bar.`} Listen for where each sound starts against the count-in beat.`;
    if (s.mode === 'dictate') {
      return {
        prompt: `Listen (one bar of clicks counts you in), then write the rhythm in ${ts.join('/')}.`,
        audio, pad: 'rhythmbuild',
        padProps: { groups: pool.map((g) => ({ id: g.id, notes: g.notes, triplet: g.triplet, ticks: groupTicks(g) })), timeSig: ts, bars: bars.length, barTicks: barTicksOf(ts) },
        rhythm: null, rhythmAfter: { bars: asNotation(bars), timeSig: ts },
        tags, solution: key,
        check: (r) => typeof r === 'string' && r === key,
        answerText: 'the rhythm shown above', explain,
      };
    }
    // identify: three or four options that differ in one group
    const variants = new Map([[key, bars]]);
    for (let tries = 0; tries < 200 && variants.size < 4; tries++) {
      const v = bars.map((bar) => [...bar]);
      const b = rand(v.length);
      const i = rand(v[b].length);
      // Replace one group with a different way of filling the same number of beats (one group or several).
      const ticks = groupTicks(v[b][i]);
      const fill = [];
      let left = ticks;
      for (let k = 0; k < 20 && left > 0; k++) {
        const fits = pool.filter((g) => groupTicks(g) <= left && (fill.length || left !== ticks || g.id !== v[b][i].id));
        if (!fits.length) break;
        const g = pick(fits);
        fill.push(g); left -= groupTicks(g);
      }
      if (left !== 0 || !fill.length) continue;
      v[b].splice(i, 1, ...fill);
      if (v.flat().every((g) => g.notes.every((n) => n.rest))) continue;
      variants.set(flat(v), v);
    }
    const opts = shuffle([...variants.entries()]).map(([k, v], i) => ({ value: k, label: `Option ${'ABCD'[i]}`, rhythm: { bars: asNotation(v), timeSig: ts } }));
    return {
      prompt: `Listen (one bar of clicks counts you in). Which rhythm do you hear?`,
      audio, pad: 'rhythmchoice', options: opts,
      tags, solution: key, check: (r) => r === key,
      answerText: opts.find((o) => o.value === key).label, explain,
    };
  },
};
