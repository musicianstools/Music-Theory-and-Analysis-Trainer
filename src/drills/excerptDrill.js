// SCORE EXCERPT ANALYSIS — a freshly composed 4–8 bar excerpt; students identify everything happening in it:
// key, time signature, tempo, dynamics, articulation, melodic shape and movement, range, texture, cadence, repetition…
// The excerpt is built harmony-first (one chord per bar), so the melody, accompaniment, cadence and answers all agree.
import { LETTERS, KEYS, fromDia, dia, midi, keySigAccidental, noteName, intervalBetween, pick, rand } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// Rhythm cells for one beat (12 ticks) or two beats, by level. In 6/8, cells fill a dotted-crotchet beat (18).
const CELLS = {
  simple: [
    { lv: 1, n: [12] }, { lv: 1, n: [24] }, { lv: 2, n: [6, 6] }, { lv: 2, n: [12] }, { lv: 3, n: [18, 6] }, { lv: 3, n: [6, 6] },
    { lv: 4, n: [3, 3, 6] }, { lv: 4, n: [9, 3] }, { lv: 5, n: [3, 3, 3, 3] }, { lv: 5, n: [6, 3, 3] },
  ],
  compound: [{ lv: 1, n: [18] }, { lv: 1, n: [12, 6] }, { lv: 2, n: [6, 6, 6] }, { lv: 3, n: [9, 3, 6] }, { lv: 4, n: [6, 12] }, { lv: 5, n: [3, 3, 6, 6] }],
};
const TEMPI = [
  { word: 'Adagio', meaning: 'Slow (at ease)', beat: 0.9 }, { word: 'Andante', meaning: 'At a walking pace', beat: 0.7 },
  { word: 'Moderato', meaning: 'At a moderate speed', beat: 0.6 }, { word: 'Allegro', meaning: 'Fast and lively', beat: 0.45 }, { word: 'Presto', meaning: 'Very fast', beat: 0.35 },
];
const DYN_IT = { pp: 'pianissimo', p: 'piano', mp: 'mezzo piano', mf: 'mezzo forte', f: 'forte', ff: 'fortissimo' };
const DYN_WORD = { pp: 'pianissimo (very soft)', p: 'piano (soft)', mp: 'mezzo piano (moderately soft)', mf: 'mezzo forte (moderately loud)', f: 'forte (loud)', ff: 'fortissimo (very loud)' };
const DYN_GAIN = { pp: 0.3, p: 0.45, mp: 0.6, mf: 0.75, f: 0.95, ff: 1.15 };
const MAJ = [0, 2, 4, 5, 7, 9, 11];

/** Spell scale degree d (0 = tonic; may be negative or above 6) in key k. Minor keys raise the 7th (harmonic minor). */
function spell(d, k, minor, tonicL, octave) {
  const l = (((tonicL + d) % 7) + 7) % 7;
  const deg = ((d % 7) + 7) % 7;
  let a = keySigAccidental(k, l);
  if (minor && deg === 6) a += 1;
  return fromDia(tonicL + 7 * octave + d, a);
}
const triadDegrees = (root) => [root, root + 2, root + 4].map((x) => ((x % 7) + 7) % 7);

function makeExcerpt(level) {
  const bars = level <= 2 ? 4 : level === 3 ? 6 : 8;
  const maxAcc = [0, 0, 2, 3, 4, 7][level];
  const minor = level >= 3 && Math.random() < 0.4;
  const k = pick(KEYS.filter((x) => x.count <= maxAcc));
  const tonicName = minor ? k.minor : k.major;
  const tonicL = LETTERS.indexOf(tonicName[0]);
  const metre = level >= 4 && Math.random() < 0.3 ? 'compound' : 'simple';
  const timeSig = metre === 'compound' ? [6, 8] : pick(level === 1 ? [[4, 4]] : [[4, 4], [3, 4], [2, 4]]);
  const barTicks = (timeSig[0] * 48) / timeSig[1];
  const beat = metre === 'compound' ? 18 : 12;
  const cadence = level >= 3 && Math.random() < 0.4 ? 'imperfect' : 'perfect';
  const shift = tonicL >= 4 ? -3 : 0; // keep G, A and B keys from climbing too high on the stave
  // harmony: one chord (scale degree) per bar
  const prog = bars === 4 ? [0, pick([3, 5, 1]), 4, 0] : bars === 6 ? [0, 3, 4, 0, pick([3, 1]), 4, 0].slice(0, 6) : [0, pick([3, 5]), 1, 4, 0, pick([3, 5]), 1, 4];
  if (bars === 6) prog.splice(5, 1, 4);
  const lastChords = cadence === 'perfect' ? [4, 0] : [pick([3, 1, 0]), 4];
  prog.splice(bars - 2, 2, ...lastChords);
  // melody shape and movement
  const contourPlan = pick(['ascending', 'descending', 'arch', 'wave']);
  const conjunct = level <= 2 ? Math.random() < 0.8 : Math.random() < 0.6;
  const target = (i, n) => {
    const p = i / Math.max(1, n - 1);
    if (contourPlan === 'ascending') return shift + p * 6;
    if (contourPlan === 'descending') return shift + 7 - p * 7;
    if (contourPlan === 'arch') return shift + 1 + Math.sin(p * Math.PI) * 6;
    return shift + 2 + Math.sin(p * Math.PI * 3) * 2.5;
  };
  const useSequence = level >= 4 && bars >= 4 && Math.random() < 0.5;
  // rhythm per bar
  const cells = CELLS[metre].filter((c) => c.lv <= level);
  const rhythmBar = (isLast) => {
    if (isLast) return metre === 'compound' ? [36] : [barTicks];
    const out = [];
    let left = barTicks;
    while (left > 0) {
      const c = pick(cells.filter((x) => x.n.reduce((a, b) => a + b, 0) <= left && (x.n.reduce((a, b) => a + b, 0) % beat === 0)));
      out.push(...c.n); left -= c.n.reduce((a, b) => a + b, 0);
    }
    return out;
  };
  const rhythms = Array.from({ length: bars }, (_, b) => rhythmBar(b === bars - 1));
  if (useSequence) { rhythms[2] = [...rhythms[0]]; rhythms[3] = [...rhythms[1]]; }
  const total = rhythms.flat().length;
  // pitches
  let prev = shift + (contourPlan === 'descending' ? 7 : contourPlan === 'ascending' ? 0 : 2);
  const degs = [];
  let i = 0;
  rhythms.forEach((rb, b) => {
    const chordTones = triadDegrees(prog[b]);
    let t = 0;
    rb.forEach((dur, j) => {
      const strong = t % beat === 0 && (t === 0 || t === barTicks / 2 || metre === 'compound');
      const isFinal = b === bars - 1;
      let d;
      if (isFinal) {
        const base = cadence === 'perfect' ? [0, 7] : [4, 6, 1];
        const opts = [...base, ...base.map((x) => x - 7)].filter((x) => x >= -2 + shift && x <= 9 + shift);
        d = opts.reduce((best, x) => (Math.abs(x - prev) < Math.abs(best - prev) ? x : best), opts[0]);
      } else {
        const want = target(i, total);
        const cands = [];
        for (let x = -2 + shift; x <= 9 + shift; x++) {
          if (strong && !chordTones.includes(((x % 7) + 7) % 7)) continue;
          const step = Math.abs(x - prev);
          if (conjunct && step > 2 && !(strong && step <= 3)) continue;
          if (!conjunct && i > 0 && step < 2 && Math.random() < 0.6) continue;
          if (step > 5) continue;
          cands.push(x);
        }
        const pool = cands.length ? cands : [prev + (want > prev ? 1 : -1)];
        d = pool.sort((p, q) => Math.abs(p - want) - Math.abs(q - want) + (Math.random() - 0.5) * 1.2)[0];
      }
      degs.push(d); prev = d; i++; t += dur; void j;
    });
  });
  if (useSequence) {
    const n0 = rhythms[0].length + rhythms[1].length;
    for (let j = 0; j < n0; j++) degs[n0 + j] = Math.min(9 + shift, degs[j] + 1);
  }
  // chromatic passing note (level 5): sharpen one non-final note that steps up into the next
  let chromaticBar = null;
  const octave = 4;
  const notes = degs.map((d) => spell(d, k, minor, tonicL, octave));
  if (level >= 5) {
    for (let j = 1; j < notes.length - 2; j++) {
      if (degs[j + 1] === degs[j] + 1 && Math.random() < 0.5) { notes[j] = { ...notes[j], a: notes[j].a + 1 }; if (Math.abs(notes[j].a) <= 2) { chromaticBar = null; } break; }
    }
  }
  // assemble bars of events + markings
  const startDyn = pick(level <= 1 ? ['p', 'f'] : ['p', 'mp', 'mf', 'f', 'pp']);
  let hair = level >= 2 ? pick(['cresc', 'dim', null]) : null;
  if (hair === 'dim' && startDyn === 'pp') hair = 'cresc';
  const endDyn = hair === 'cresc' ? { pp: 'mf', p: 'f', mp: 'f', mf: 'ff', f: 'ff' }[startDyn] : hair === 'dim' ? { pp: 'pp', p: 'pp', mp: 'p', mf: 'p', f: 'p' }[startDyn] : null;
  const tempo = level >= 2 ? pick(TEMPI) : null;
  const artPlan = level >= 2 ? shuffle(['staccato', 'slur', 'accent', 'tenuto']).slice(0, level >= 4 ? 3 : level >= 3 ? 2 : 1) : [];
  const ritard = level >= 4 && Math.random() < 0.6;
  const fermata = level >= 3 && Math.random() < 0.5;
  let n = 0;
  const upper = rhythms.map((rb, b) => rb.map((dur, j) => {
    const ev = { t: dur, notes: [notes[n]] };
    if (b === 0 && j === 0) ev.dyn = startDyn;
    if (hair && b === Math.floor(bars / 2) - 1 && j === 0) ev.hair = hair;
    if (hair && b === bars - 1 && j === 0) { ev.hair = 'end'; ev.dyn = endDyn; }
    if (ritard && b === bars - 1 && j === 0) ev.text = 'rit.';
    if (fermata && b === bars - 1 && j === rb.length - 1) ev.fermata = true;
    ev.art = [];
    if (artPlan.includes('staccato') && b === 1 && dur <= 12) ev.art.push('staccato');
    if (artPlan.includes('accent') && j === 0 && b % 2 === 0 && b < bars - 1) ev.art.push('accent');
    if (artPlan.includes('tenuto') && b === bars - 2 && j === 0) ev.art.push('tenuto');
    n++;
    return ev;
  }));
  if (artPlan.includes('slur')) {
    const sb = bars > 4 ? 2 : 0;
    if (upper[sb].length >= 2) { upper[sb][0].slur = 'start'; upper[sb][upper[sb].length - 1].slur = 'end'; } else artPlan.splice(artPlan.indexOf('slur'), 1);
  }
  ['staccato', 'accent', 'tenuto'].forEach((a) => { if (artPlan.includes(a) && !upper.flat().some((e) => e.art.includes(a))) artPlan.splice(artPlan.indexOf(a), 1); });
  // accompaniment (texture) from level 2
  const texture = level === 1 ? 'mono' : Math.random() < 0.7 ? 'accomp' : 'mono';
  const lower = texture === 'accomp' ? {
    clef: 'bass',
    bars: prog.map((root, b) => {
      const tones = [0, 2, 4].map((x) => spell(root + x, k, minor, tonicL, 2)).map((nn) => (dia(nn) < 16 ? { ...nn, o: nn.o + 1 } : nn));
      const chord = tones.map((nn) => (dia(nn) > 26 ? { ...nn, o: nn.o - 1 } : nn)).sort((p, q) => dia(p) - dia(q));
      return metre === 'compound' ? [{ t: 36, notes: chord }] : timeSig[0] === 3 ? [{ t: 36, notes: chord }] : timeSig[0] === 2 ? [{ t: 24, notes: chord }] : [{ t: 24, notes: chord }, { t: 24, notes: chord }];
    }),
  } : null;
  return { level, k, minor, tonicName, timeSig, metre, tempo, bars: upper, lower, prog, cadence, contourPlan, conjunct, notes, degs, startDyn, hair, endDyn, artPlan, ritard, fermata, texture, useSequence, chromaticBar };
}

// ---------- analysis of what was actually generated (answers come from the notes, not the plan) ----------
function contourOf(degs) {
  const n = degs.length;
  const hi = Math.max(...degs); const lo = Math.min(...degs);
  const iHi = degs.indexOf(hi); const iLo = degs.indexOf(lo);
  const first = degs[0]; const last = degs[n - 1];
  if (iHi > n * 0.2 && iHi < n * 0.8 && hi - first >= 2 && hi - last >= 2) return 'arch';
  if (iLo > n * 0.2 && iLo < n * 0.8 && first - lo >= 2 && last - lo >= 2) return 'dip';
  if (last - first >= 3) return 'ascending';
  if (first - last >= 3) return 'descending';
  return 'wave';
}
const CONTOUR_TEXT = {
  ascending: 'Mostly ascending (rising overall)', descending: 'Mostly descending (falling overall)', arch: 'Arch-shaped (rises to a high point, then falls)',
  dip: 'Inverted arch (falls to a low point, then rises)', wave: 'Wave-like (rises and falls around the same area)',
};

function audioFor(ex) {
  const beatSec = ex.tempo ? ex.tempo.beat : 0.6;
  const tick = (ex.metre === 'compound' ? beatSec * 1.4 : beatSec) / (ex.metre === 'compound' ? 18 : 12);
  const ev = [];
  let t = 0;
  const totalBars = ex.bars.length;
  let gain = DYN_GAIN[ex.startDyn];
  const hairFrom = Math.floor(totalBars / 2) - 1;
  ex.bars.forEach((bar, b) => {
    if (ex.hair && b > hairFrom) gain = DYN_GAIN[ex.startDyn] + ((DYN_GAIN[ex.endDyn] - DYN_GAIN[ex.startDyn]) * (b - hairFrom)) / (totalBars - 1 - hairFrom);
    const slow = ex.ritard && b === totalBars - 1 ? 1.35 : 1;
    let bt = 0;
    const barStart = t;
    bar.forEach((e) => {
      const dur = e.t * tick * slow * (e.fermata ? 1.8 : 1);
      const short = e.art?.includes('staccato');
      const acc = e.art?.includes('accent') ? 1.35 : e.art?.includes('tenuto') ? 1.1 : 1;
      ev.push({ t, d: short ? dur * 0.35 : dur * 0.92, notes: e.notes.map(midi), gain: gain * acc, timbre: short ? 'organ' : undefined });
      t += dur; bt += e.t;
    });
    if (ex.lower) {
      let lt = barStart;
      ex.lower.bars[b].forEach((e) => { const d = e.t * tick * slow; ev.push({ t: lt, d: d * 0.95, notes: e.notes.map(midi), gain: gain * 0.55 }); lt += d; });
    }
  });
  return ev;
}

function options(correct, wrongs) {
  return shuffle([correct, ...shuffle([...new Set(wrongs.filter((w) => w !== correct))]).slice(0, 3)]);
}

function questionsFor(ex) {
  const qs = [];
  const keyName = `${ex.tonicName} ${ex.minor ? 'minor' : 'major'}`;
  const rel = ex.minor ? `${ex.k.major} major` : `${ex.k.minor} minor`;
  const nearKeys = KEYS.filter((x) => Math.abs(x.count - ex.k.count) <= 1 || (x.type === ex.k.type && Math.abs(x.count - ex.k.count) <= 2)).flatMap((x) => [`${x.major} major`, `${x.minor} minor`]);
  qs.push({ id: 'key', topic: 'Key', q: 'What key is this excerpt in?', options: options(keyName, [rel, ...nearKeys]), answer: keyName,
    why: `The key signature has ${ex.k.count ? `${ex.k.count} ${ex.k.type === 'sharp' ? 'sharp' : 'flat'}${ex.k.count > 1 ? 's' : ''}` : 'no sharps or flats'} (${ex.k.major} major or ${ex.k.minor} minor). ${ex.minor ? `The raised 7th (the leading note) and the ending on ${ex.tonicName} point to the minor key.` : `The melody and harmony centre on ${ex.tonicName}${ex.cadence === 'perfect' ? ', where it ends' : ''}.`}` });
  const tsText = { '4/4': '4 crotchet beats in every bar', '3/4': '3 crotchet beats in every bar', '2/4': '2 crotchet beats in every bar', '6/8': '2 dotted-crotchet beats in every bar (each split into 3 quavers)' };
  const ts = ex.timeSig.join('/');
  qs.push({ id: 'time', topic: 'Time signature', q: `What does the ${ts} time signature tell you?`, options: options(tsText[ts], Object.values(tsText).concat(['6 crotchet beats in every bar'])), answer: tsText[ts],
    why: `${ts}: ${tsText[ts]}. The top number counts the beats; the bottom number shows the beat's note value${ts === '6/8' ? ' (8 = quavers, grouped in threes)' : ' (4 = crotchet)'}.` });
  if (ex.tempo) qs.push({ id: 'tempo', topic: 'Tempo', q: `What does the tempo marking "${ex.tempo.word}" mean?`, options: options(ex.tempo.meaning, TEMPI.map((x) => x.meaning)), answer: ex.tempo.meaning, why: `${ex.tempo.word} = ${ex.tempo.meaning.toLowerCase()}.` });
  const dynAns = ex.hair ? `Starts ${DYN_IT[ex.startDyn]}, then ${ex.hair === 'cresc' ? 'gets gradually louder (crescendo)' : 'gets gradually softer (diminuendo)'} to ${DYN_IT[ex.endDyn]}` : `Stays ${DYN_IT[ex.startDyn]} — ${DYN_WORD[ex.startDyn].match(/\((.*)\)/)[1]} throughout`;
  const dynWrong = [
    `Starts ${DYN_IT[ex.startDyn]}, then gets gradually ${ex.hair === 'cresc' ? 'softer (diminuendo)' : 'louder (crescendo)'} to ${ex.startDyn === 'p' ? 'pianissimo' : 'forte'}`,
    `Stays ${DYN_IT[ex.startDyn === 'f' ? 'p' : 'f']} throughout`,
    'Changes suddenly from loud to soft (subito)', `Starts ${DYN_IT[ex.endDyn || (ex.startDyn === 'mf' ? 'p' : 'mf')]} and stays there`,
  ];
  qs.push({ id: 'dyn', topic: 'Dynamics', q: 'How do the dynamics behave?', options: options(dynAns, dynWrong), answer: dynAns,
    why: `The opening marking is ${ex.startDyn} = ${DYN_WORD[ex.startDyn]}.${ex.hair ? ` The hairpin ${ex.hair === 'cresc' ? 'opens out (<): crescendo' : 'closes (>): diminuendo'}, arriving at ${ex.endDyn} = ${DYN_WORD[ex.endDyn]}.` : ''}` });
  if (ex.level >= 2) {
    const ART = { staccato: 'Staccato (short, detached — dots)', slur: 'Slur / legato (smooth — curved line)', accent: 'Accent (emphasised — >)', tenuto: 'Tenuto (held for full value — line)' };
    qs.push({ id: 'art', topic: 'Articulation', multi: true, q: 'Which articulations are used? Select all that apply — there may be more than one.', options: Object.values(ART), answer: ex.artPlan.map((a) => ART[a]).sort(),
      why: ex.artPlan.length ? `Used: ${ex.artPlan.map((a) => ART[a]).join('; ')}.` : 'No articulation markings are used.' });
  }
  const shape = contourOf(ex.degs);
  qs.push({ id: 'shape', topic: 'Melodic shape', q: 'What is the overall shape (contour) of the melody?', options: options(CONTOUR_TEXT[shape], Object.values(CONTOUR_TEXT)), answer: CONTOUR_TEXT[shape],
    why: `Trace the highest and lowest notes: the melody starts on ${noteName(ex.notes[0])}, reaches its highest note (${noteName(ex.notes[ex.degs.indexOf(Math.max(...ex.degs))])}) and ends on ${noteName(ex.notes[ex.notes.length - 1])}.` });
  const steps = ex.degs.slice(1).filter((d, j) => Math.abs(d - ex.degs[j]) <= 1).length;
  const leaps = ex.degs.length - 1 - steps;
  const moveAns = steps >= leaps * 2 ? 'Mostly conjunct (moves by step)' : leaps >= steps ? 'Mostly disjunct (moves by leap)' : 'A mix of steps and leaps';
  qs.push({ id: 'move', topic: 'Melodic movement', q: 'How does the melody move?', options: options(moveAns, ['Mostly conjunct (moves by step)', 'Mostly disjunct (moves by leap)', 'A mix of steps and leaps', 'It stays on one note']), answer: moveAns,
    why: `${steps} step${steps === 1 ? '' : 's'} and ${leaps} leap${leaps === 1 ? '' : 's'} between notes.` });
  if (ex.level >= 2) {
    const texAns = ex.texture === 'accomp' ? 'Homophonic — melody with chordal accompaniment' : 'Monophonic — a single melodic line';
    qs.push({ id: 'texture', topic: 'Texture', q: 'What is the texture?', options: options(texAns, ['Homophonic — melody with chordal accompaniment', 'Monophonic — a single melodic line', 'Polyphonic — independent melodic lines', 'Heterophonic — variations of one melody at once']), answer: texAns,
      why: ex.texture === 'accomp' ? 'The upper stave has the melody; the lower stave supports it with block chords.' : 'There is only one line — no accompaniment.' });
  }
  if (ex.level >= 3) {
    const lo = ex.notes.reduce((a, b) => (dia(b) < dia(a) || (dia(b) === dia(a) && midi(b) < midi(a)) ? b : a));
    const hi = ex.notes.reduce((a, b) => (dia(b) > dia(a) || (dia(b) === dia(a) && midi(b) > midi(a)) ? b : a));
    const iv = intervalBetween(lo, hi);
    const rangeAns = iv.num > 8 ? `More than an octave (${iv.label.toLowerCase()})` : iv.label;
    qs.push({ id: 'range', topic: 'Range', q: 'What is the range of the melody (lowest to highest note)?', options: options(rangeAns, ['Perfect 5th', 'Major 6th', 'Octave', 'Perfect 4th', 'Minor 7th', 'Major 3rd', 'More than an octave (major 9th)']), answer: rangeAns,
      why: `Lowest ${noteName(lo, true)}, highest ${noteName(hi, true)}: ${iv.label.toLowerCase()}.` });
    const cadAns = ex.cadence === 'perfect' ? 'Perfect cadence (V–I) — sounds finished' : 'Imperfect cadence (ends on V) — sounds unfinished';
    qs.push({ id: 'cadence', topic: 'Cadence', q: 'Which cadence ends the excerpt?', options: options(cadAns, ['Perfect cadence (V–I) — sounds finished', 'Imperfect cadence (ends on V) — sounds unfinished', 'Plagal cadence (IV–I) — "Amen"', 'Interrupted cadence (V–vi) — a surprise']), answer: cadAns,
      why: `The last two chords are ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][ex.prog[ex.prog.length - 2]]} and ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][ex.prog[ex.prog.length - 1]]}.` });
  }
  if (ex.level >= 4) {
    const seqAns = ex.useSequence ? 'Bars 3–4 repeat bars 1–2 one step higher (a sequence)' : 'There is no sequence — bars 3–4 are new material';
    qs.push({ id: 'seq', topic: 'Repetition', q: 'How are bars 3–4 related to bars 1–2?', options: options(seqAns, ['Bars 3–4 repeat bars 1–2 one step higher (a sequence)', 'There is no sequence — bars 3–4 are new material', 'Bars 3–4 repeat bars 1–2 exactly', 'Bars 3–4 are bars 1–2 played backwards (retrograde)']), answer: seqAns,
      why: ex.useSequence ? 'The rhythm is the same and every note is one scale step higher: a melodic sequence.' : 'The rhythm and/or the melodic shape change, so it is not a sequence.' });
    const endings = [ex.ritard && 'rit. (ritardando) — gradually slowing down', ex.fermata && 'A fermata — pause on the last note'].filter(Boolean);
    const endAns = endings.length ? endings.join(' + ') : 'No change — it keeps strict time to the end';
    qs.push({ id: 'ending', topic: 'Tempo markings', q: 'What happens to the time at the end?', options: options(endAns, ['rit. (ritardando) — gradually slowing down', 'A fermata — pause on the last note', 'rit. (ritardando) — gradually slowing down + A fermata — pause on the last note', 'No change — it keeps strict time to the end', 'accel. — gradually speeding up']), answer: endAns,
      why: endings.length ? `Look above the last bar${ex.fermata ? ' and over the final note' : ''}.` : 'There are no tempo changes or pauses marked.' });
  }
  return qs;
}

export const EXCERPT_LEVELS = { 1: { level: '1' }, 2: { level: '2' }, 3: { level: '3' }, 4: { level: '4' }, 5: { level: '5' } };

export const EXCERPT_DRILL = {
  id: 'excerpt', title: 'Score Excerpt Analysis', stage: 'know', skills: ['theory', 'terminology', 'evidence'], kind: 'Score reading', verbs: ['Identify', 'Analyse', 'Describe'],
  blurb: 'A new 4–8 bar excerpt every time: identify the key, metre, tempo, dynamics, articulation, melodic shape, texture, cadence and more.',
  settings: [{ key: 'level', label: 'Excerpt', options: [['1', '4 bars, C major'], ['2', '4 bars, markings'], ['3', '6 bars, minor keys, cadences'], ['4', '8 bars, sequences, rit.'], ['5', '8 bars, everything']] }],
  defaults: { level: '2' },
  levels: EXCERPT_LEVELS,
  generate(s) {
    const level = Number(s.level);
    let ex = makeExcerpt(level);
    for (let tries = 0; tries < 20 && ex.notes.some((n) => Math.abs(n.a) > 2); tries++) ex = makeExcerpt(level);
    const quiz = questionsFor(ex);
    const score = { clef: 'treble', keySig: ex.k.count ? ex.k : null, timeSig: ex.timeSig, tempo: ex.tempo?.word, bars: ex.bars, lower: ex.lower };
    const answer = Object.fromEntries(quiz.map((q) => [q.id, q.answer]));
    return {
      prompt: 'Study the excerpt (and listen if you like). Answer every question, then check.',
      score, audio: audioFor(ex), hearOnly: true,
      pad: 'quiz', padProps: { questions: quiz },
      tags: [`Level|${level}`, ...quiz.map((q) => `Covers|${q.topic}`)],
      solution: answer,
      check: (r) => {
        if (!r) return 0;
        const right = quiz.filter((q) => (q.multi ? JSON.stringify([...(r[q.id] || [])].sort()) === JSON.stringify(q.answer) : r[q.id] === q.answer)).length;
        return right / quiz.length;
      },
      answerText: 'see the marked answers',
      explain: 'Work through it in this order: key and time signature → tempo and dynamics → articulation → melody (shape, movement, range) → texture → cadence and structure. Each of these is evidence you can use in an analysis.',
    };
  },
};
