// Spelling-aware music theory engine used by the drills.
// A note is { l, a, o }: letter index (0=C … 6=B), accidental (-2..2), octave (scientific, C4 = middle C).

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const PC = [0, 2, 4, 5, 7, 9, 11];
export const ACC_TEXT = { '-2': '♭♭', '-1': '♭', 0: '', 1: '♯', 2: '×' };
const ACC_WORD = { '-2': ' double flat', '-1': ' flat', 0: '', 1: ' sharp', 2: ' double sharp' };

export const note = (l, a = 0, o = 4) => ({ l, a, o });
export const dia = (n) => n.l + 7 * n.o;
export const midi = (n) => 12 * (n.o + 1) + PC[n.l] + n.a;
export const noteName = (n, withOctave = false) => LETTERS[n.l] + ACC_TEXT[n.a] + (withOctave ? n.o : '');
export const noteWords = (n) => LETTERS[n.l] + ACC_WORD[n.a];
export const fromDia = (d, a = 0) => ({ l: ((d % 7) + 7) % 7, a, o: Math.floor(d / 7) });
export const sameNote = (x, y) => x.l === y.l && x.a === y.a;

/** Parse "F#4", "Bb3", "C" (octave defaults to 4). */
export function parseNote(s) {
  const m = /^([A-G])(bb|b|##|#|x|♭|♯)?(-?\d)?$/.exec(s.trim());
  if (!m) throw new Error('Bad note ' + s);
  const a = { bb: -2, b: -1, '♭': -1, '#': 1, '♯': 1, '##': 2, x: 2 }[m[2]] ?? 0;
  return { l: LETTERS.indexOf(m[1]), a, o: m[3] !== undefined ? Number(m[3]) : 4 };
}

// ---------- Intervals ----------
const BASE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };
const PERFECT = new Set([1, 4, 5, 8]);
export const ORDINAL = { 1: 'unison', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 8: 'octave' };
export const QUALITY_NAME = { d: 'Diminished', m: 'Minor', M: 'Major', P: 'Perfect', A: 'Augmented' };

/** Name the interval from lower to upper note: { num, quality, semis, label, short } */
export function intervalBetween(lo, hi) {
  const num = dia(hi) - dia(lo) + 1;
  const semis = midi(hi) - midi(lo);
  const simple = num > 8 ? ((num - 2) % 7) + 2 : num;
  const octaves = num > 8 ? Math.floor((num - 2) / 7) : 0;
  const diff = semis - (BASE[simple] + 12 * octaves);
  let quality;
  if (PERFECT.has(simple)) quality = { '-1': 'd', 0: 'P', 1: 'A' }[diff];
  else quality = { '-2': 'd', '-1': 'm', 0: 'M', 1: 'A' }[diff];
  return {
    num, simple, quality: quality || '?', semis,
    short: (quality || '?') + num,
    label: `${QUALITY_NAME[quality] || 'Unusual'} ${ORDINAL[num] || num + 'th'}`,
  };
}

/** Build the note a given interval above `n`. quality: d m M P A; num: 1–8 */
export function noteAbove(n, quality, num) {
  const target = fromDia(dia(n) + num - 1);
  const want = midi(n) + BASE[num] + (PERFECT.has(num)
    ? { d: -1, P: 0, A: 1 }[quality]
    : { d: -2, m: -1, M: 0, A: 1 }[quality]);
  return { ...target, a: want - midi(target) };
}

/** Build the note a given interval below `n`. */
export function noteBelow(n, quality, num) {
  const target = fromDia(dia(n) - (num - 1));
  const want = midi(n) - BASE[num] - (PERFECT.has(num)
    ? { d: -1, P: 0, A: 1 }[quality]
    : { d: -2, m: -1, M: 0, A: 1 }[quality]);
  return { ...target, a: want - midi(target) };
}

// ---------- Chords ----------
export const CHORDS = {
  maj: { name: 'Major', short: '', intervals: [['M', 3], ['P', 5]], family: 'triad' },
  min: { name: 'Minor', short: 'm', intervals: [['m', 3], ['P', 5]], family: 'triad' },
  dim: { name: 'Diminished', short: '°', intervals: [['m', 3], ['d', 5]], family: 'triad' },
  aug: { name: 'Augmented', short: '+', intervals: [['M', 3], ['A', 5]], family: 'triad' },
  maj7: { name: 'Major 7th', short: 'maj7', intervals: [['M', 3], ['P', 5], ['M', 7]], family: 'seventh' },
  dom7: { name: 'Dominant 7th', short: '7', intervals: [['M', 3], ['P', 5], ['m', 7]], family: 'seventh' },
  min7: { name: 'Minor 7th', short: 'm7', intervals: [['m', 3], ['P', 5], ['m', 7]], family: 'seventh' },
  hdim7: { name: 'Half-diminished 7th', short: 'ø7', intervals: [['m', 3], ['d', 5], ['m', 7]], family: 'seventh' },
  dim7: { name: 'Diminished 7th', short: '°7', intervals: [['m', 3], ['d', 5], ['d', 7]], family: 'seventh' },
};

export const INVERSION_NAMES = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];
export const FIGURES = { triad: ['5/3', '6 (6/3)', '6/4'], seventh: ['7', '6/5', '4/3', '4/2 (2)'] };

/** Notes of a chord in root position, ascending, then rotated for inversion. */
export function buildChord(root, type, inversion = 0) {
  const tones = [root, ...CHORDS[type].intervals.map(([q, n]) => noteAbove(root, q, n))];
  const out = tones.map((t) => ({ ...t }));
  for (let i = 0; i < inversion; i++) {
    const lowest = out.shift();
    out.push({ ...lowest, o: lowest.o + 1 });
  }
  return out;
}

// ---------- Key signatures ----------
export const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6]; // F C G D A E B (letter indexes)
export const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3]; // B E A D G C F
// Staff positions (diatonic index) for each accidental in treble clef; bass clef = -14.
export const KEYSIG_DIA_TREBLE = {
  sharp: [3 + 35, 0 + 35, 4 + 35, 1 + 35, 5 + 28, 2 + 35, 6 + 28], // F5 C5 G5 D5 A4 E5 B4
  flat: [6 + 28, 2 + 35, 5 + 28, 1 + 35, 4 + 28, 0 + 35, 3 + 28], // B4 E5 A4 D5 G4 C5 F4
};
export const KEYS = [
  { count: 0, type: 'sharp', major: 'C', minor: 'A' },
  { count: 1, type: 'sharp', major: 'G', minor: 'E' },
  { count: 2, type: 'sharp', major: 'D', minor: 'B' },
  { count: 3, type: 'sharp', major: 'A', minor: 'F♯' },
  { count: 4, type: 'sharp', major: 'E', minor: 'C♯' },
  { count: 5, type: 'sharp', major: 'B', minor: 'G♯' },
  { count: 6, type: 'sharp', major: 'F♯', minor: 'D♯' },
  { count: 7, type: 'sharp', major: 'C♯', minor: 'A♯' },
  { count: 1, type: 'flat', major: 'F', minor: 'D' },
  { count: 2, type: 'flat', major: 'B♭', minor: 'G' },
  { count: 3, type: 'flat', major: 'E♭', minor: 'C' },
  { count: 4, type: 'flat', major: 'A♭', minor: 'F' },
  { count: 5, type: 'flat', major: 'D♭', minor: 'B♭' },
  { count: 6, type: 'flat', major: 'G♭', minor: 'E♭' },
  { count: 7, type: 'flat', major: 'C♭', minor: 'A♭' },
];
/** The accidental a key signature gives to a letter (k = an entry of KEYS, l = letter index). */
export const keySigAccidental = (k, l) => {
  if (!k || !k.count) return 0;
  if (k.type === 'sharp') return SHARP_ORDER.slice(0, k.count).includes(l) ? 1 : 0;
  return FLAT_ORDER.slice(0, k.count).includes(l) ? -1 : 0;
};
export const keyAccidentalNames = (k) => (k.type === 'sharp' ? SHARP_ORDER : FLAT_ORDER).slice(0, k.count).map((l) => LETTERS[l] + (k.type === 'sharp' ? '♯' : '♭'));

// ---------- Scales (for ear training) ----------
export const SCALES = {
  major: { name: 'Major', steps: [2, 2, 1, 2, 2, 2, 1] },
  natMinor: { name: 'Natural minor', steps: [2, 1, 2, 2, 1, 2, 2] },
  harmMinor: { name: 'Harmonic minor', steps: [2, 1, 2, 2, 1, 3, 1] },
  melMinor: { name: 'Melodic minor (ascending)', steps: [2, 1, 2, 2, 2, 2, 1] },
  dorian: { name: 'Dorian', steps: [2, 1, 2, 2, 2, 1, 2] },
  mixolydian: { name: 'Mixolydian', steps: [2, 2, 1, 2, 2, 1, 2] },
  lydian: { name: 'Lydian', steps: [2, 2, 2, 1, 2, 2, 1] },
  phrygian: { name: 'Phrygian', steps: [1, 2, 2, 2, 1, 2, 2] },
  pentatonic: { name: 'Major pentatonic', steps: [2, 2, 3, 2, 3] },
  blues: { name: 'Blues', steps: [3, 2, 1, 1, 3, 2] },
};
export const scaleMidis = (startMidi, steps) => steps.reduce((acc, s) => [...acc, acc[acc.length - 1] + s], [startMidi]);

// ---------- Helpers ----------
export const rand = (n) => Math.floor(Math.random() * n);
export const pick = (arr) => arr[rand(arr.length)];
/** Black-key names for a MIDI pitch class, both spellings. */
export const PC_NAMES = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
