// TRANSPOSITION — move a short melody by an interval, into a new key, or for a transposing instrument.
// Answer on the stave or as note names. Every melody and interval is generated fresh.
import { LETTERS, KEYS, fromDia, dia, keySigAccidental, noteAbove, noteBelow, noteName, intervalBetween, QUALITY_NAME, ORDINAL, pick, rand } from '../utils/music.js';

const INSTRUMENTS = [
  { lv: 3, name: 'B♭ clarinet', q: 'M', n: 2, desc: 'sounds a major 2nd lower than written' },
  { lv: 3, name: 'B♭ trumpet', q: 'M', n: 2, desc: 'sounds a major 2nd lower than written' },
  { lv: 4, name: 'E♭ alto saxophone', q: 'M', n: 6, desc: 'sounds a major 6th lower than written' },
  { lv: 4, name: 'F horn', q: 'P', n: 5, desc: 'sounds a perfect 5th lower than written' },
  { lv: 5, name: 'B♭ tenor saxophone', q: 'M', n: 9, desc: 'sounds a major 9th (an octave and a major 2nd) lower than written' },
];
const INTERVALS = {
  1: [['P', 5], ['P', 4], ['P', 8]],
  2: [['P', 5], ['P', 4], ['M', 2], ['P', 8]],
  3: [['P', 5], ['P', 4], ['M', 2], ['m', 3], ['M', 3], ['M', 6]],
  4: [['M', 2], ['m', 2], ['m', 3], ['M', 3], ['P', 4], ['P', 5], ['M', 6], ['m', 7]],
  5: [['m', 2], ['A', 4], ['d', 5], ['m', 6], ['M', 7], ['A', 2], ['m', 3]],
};
const KEY_MAX = { 1: 0, 2: 1, 3: 3, 4: 5, 5: 7 };
const ivName = (q, n) => `${QUALITY_NAME[q].toLowerCase()} ${n === 8 ? 'octave' : n === 9 ? '9th' : ORDINAL[n]}`;

function melody(level, k) {
  const tonicL = LETTERS.indexOf(k.major[0]);
  const len = level <= 1 ? 3 : level <= 3 ? 4 : 5;
  const base = tonicL + 7 * pick([3, 4, 5]);
  let d = pick([0, 2, 4]);
  const degs = [d];
  while (degs.length < len) { d += pick([-2, -1, 1, 1, 2]); d = Math.max(-1, Math.min(7, d)); if (d !== degs[degs.length - 1]) degs.push(d); }
  return degs.map((x) => fromDia(base + x, keySigAccidental(k, (((tonicL + x) % 7) + 7) % 7)));
}

export const TRANSPOSE_DRILL = {
  id: 'transpose', title: 'Transposition', stage: 'know', skills: ['theory'], kind: 'Spelling', verbs: ['Apply'],
  blurb: 'Move a melody up or down by an interval, or write it out for a B♭, E♭ or F instrument — on the stave or as note names.',
  settings: [
    { key: 'mode', label: 'Task', options: [['interval', 'By an interval'], ['instrument', 'For a transposing instrument'], ['mixed', 'Mixed']] },
    { key: 'answer', label: 'Answer', options: [['staff', 'Write on the stave'], ['names', 'Note names']] },
    { key: 'level', label: 'Difficulty', options: [['1', 'C major, up a 4th/5th/octave'], ['2', '1 ♯/♭, + major 2nd'], ['3', 'Up to 3 ♯/♭, 3rds and 6ths, B♭ instruments'], ['4', 'Up to 5 ♯/♭, E♭ and F instruments'], ['5', 'Any key, augmented/diminished, double accidentals']] },
  ],
  defaults: { mode: 'interval', answer: 'names', level: '2' },
  levels: { 1: { level: '1', mode: 'interval' }, 2: { level: '2', mode: 'interval' }, 3: { level: '3', mode: 'mixed' }, 4: { level: '4', mode: 'mixed' }, 5: { level: '5', mode: 'mixed' } },
  generate(s) {
    const level = Number(s.level);
    const useInst = s.mode === 'instrument' || (s.mode === 'mixed' && level >= 3 && Math.random() < 0.45);
    let k; let orig; let out; let up; let q; let n; let inst = null; let toWritten = true;
    for (let tries = 0; tries < 200; tries++) {
      k = pick(KEYS.filter((x) => x.count <= KEY_MAX[level]));
      if (useInst) {
        inst = pick(INSTRUMENTS.filter((x) => x.lv <= Math.max(3, level)));
        toWritten = level < 4 ? true : Math.random() < 0.6;
        q = inst.q; n = inst.n; up = toWritten;
      } else {
        [q, n] = pick(INTERVALS[level]);
        up = level === 1 ? true : Math.random() < 0.6;
      }
      orig = melody(level, k);
      out = orig.map((x) => (up ? noteAbove(x, q, n > 8 ? n - 7 : n) : noteBelow(x, q, n > 8 ? n - 7 : n)));
      if (n > 8) out = out.map((x) => ({ ...x, o: x.o + (up ? 1 : -1) }));
      const lim = level >= 5 ? 2 : 1;
      if (out.every((x) => Math.abs(x.a) <= lim) && [...orig, ...out].every((x) => dia(x) >= 28 && dia(x) <= 40)) break;
    }
    const interval = ivName(q, n);
    const what = inst
      ? (toWritten ? `This is the concert-pitch melody. Write it out for ${inst.name} (it ${inst.desc}, so write it a ${interval} higher).` : `This is the written part for ${inst.name}. Write the concert pitch (it ${inst.desc}).`)
      : `Transpose this melody ${up ? 'up' : 'down'} a ${interval}.`;
    const ex = orig.map((x, i) => `${noteName(x)} → ${noteName(out[i])}`).join(', ');
    const check = (r) => Array.isArray(r) && r.length === out.length && r.every((x, i) => x && x.l === out[i].l && x.a === out[i].a && (s.answer !== 'staff' || x.o === out[i].o));
    const explain = `${inst ? `${inst.name} ${inst.desc}. ` : ''}Move every note ${up ? 'up' : 'down'} a ${interval}: count the letter names first (${n > 8 ? n - 7 : n} letters, counting the starting note), then check each accidental. ${ex}.${!inst && n !== 8 ? ` Tip: the new key is a ${interval} ${up ? 'above' : 'below'} the old one — use its key signature to check your accidentals.` : ''}`;
    const accs = level >= 5 ? [-2, -1, 0, 1, 2] : [-1, 0, 1];
    const tags = [`Task|${inst ? 'Transposing instrument' : 'By an interval'}`, `Interval|${interval}`, `Answer|${s.answer === 'staff' ? 'Stave' : 'Note names'}`];
    const base = {
      prompt: what,
      staff: { clef: 'treble', columns: orig.map((x) => [x]), keySig: null },
      staffAfter: { clef: 'treble', columns: out.map((x) => [x]) }, staffAfterLabel: 'Transposed', hideAfterIfRight: true,
      tags, solution: out.map((x) => ({ ...x })), check, answerText: out.map((x) => noteName(x)).join(' – '), explain,
    };
    if (s.answer === 'staff') return { ...base, staffAfter: base.staffAfter, pad: 'staffwrite', padProps: { clef: 'treble', tonic: null, count: out.length, accs, solution: out.map((x) => ({ ...x })), startNear: orig[0] } };
    return { ...base, staffAfter: undefined, pad: 'spell', padProps: { root: null, roles: out.map((_, i) => String(i + 1)), accs } };
  },
};
void intervalBetween;
