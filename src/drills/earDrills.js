// MORE EAR DRILLS (Stage: HEAR) — cadences, melodic dictation, metre, musical features, texture, tonality.
// Every question is generated fresh: random key, tempo, melody and voicing, so nothing can be memorised.
// Audio is a list of note events played by utils/audioSynth.js → playMidiEvents:
//   { t, d, notes: [midi], gain?, timbre?: 'piano' | 'organ' | 'click' }
import { LETTERS, KEYS, fromDia, dia, midi, keySigAccidental, keyAccidentalNames, noteName, pick, rand } from '../utils/music.js';
const keyAccidentalNamesFor = (k) => keyAccidentalNames(k).join(', ');

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 11]; // harmonic minor: raised 7th, as used at cadences
const PENTA = [0, 2, 4, 7, 9];
/** Semitones above the tonic for scale degree d (0-based, may be negative or > 6). */
const degSemis = (d, scale = MAJOR) => { const n = scale.length; return 12 * Math.floor(d / n) + scale[((d % n) + n) % n]; };

// ---------- Harmony helpers ----------
// Chords as scale degrees of their root; triads are stacked thirds within the scale.
const triad = (root, scale) => [root, root + 2, root + 4].map((d) => degSemis(d, scale));
/** Voice a chord: bass on the root (octave 2–3) + three upper voices placed as close as possible to the previous chord. */
function voiceProgression(tonic, roots, scale) {
  let prev = null;
  return roots.map((r) => {
    const pcs = triad(r, scale).map((x) => ((x % 12) + 12) % 12);
    const bass = tonic - 12 + (((degSemis(r, scale) % 12) + 12) % 12) - (degSemis(r, scale) % 12 > 7 ? 12 : 0);
    const cands = [];
    for (let base = tonic - 2; base <= tonic + 12; base++) {
      const pc = (((base - tonic) % 12) + 12) % 12;
      const i = pcs.indexOf(pc);
      if (i === -1) continue;
      const v = [base];
      for (let k = 1; k < 3; k++) { let n = v[k - 1] + 1; while (pcs.indexOf((((n - tonic) % 12) + 12) % 12) !== (i + k) % 3) n++; v.push(n); }
      cands.push(v);
    }
    const target = prev || [tonic + 4, tonic + 7, tonic + 12];
    const best = cands.reduce((a, c) => (c.reduce((n, x, j) => n + Math.abs(x - target[j]), 0) < a.reduce((n, x, j) => n + Math.abs(x - target[j]), 0) ? c : a));
    prev = best;
    return [bass, ...best];
  });
}

const CADENCES = {
  perfect: { name: 'Perfect (V–I)', major: [0, 3, 4, 0], minor: [0, 3, 4, 0], sound: 'Dominant to tonic: it sounds finished, like a full stop. In analysis it can suggest resolution, certainty or arrival.' },
  imperfect: { name: 'Imperfect (ends on V)', major: [0, 3, 0, 4], minor: [0, 3, 0, 4], sound: 'The phrase stops on the dominant: it sounds unfinished, like a comma or a question. It can suggest something left open or unresolved.' },
  plagal: { name: 'Plagal (IV–I)', major: [0, 5, 3, 0], minor: [0, 5, 3, 0], sound: 'Subdominant to tonic: a softer close than a perfect cadence — the "Amen" cadence. It can suggest calm, reverence or gentle acceptance.' },
  interrupted: { name: 'Interrupted (V–vi)', major: [0, 3, 4, 5], minor: [0, 3, 4, 5], sound: 'You expect V–I, but the dominant moves to chord vi (VI in minor) instead: a surprise. It can suggest disappointment, delay or an unexpected turn.' },
};
const ROMAN_MAJ = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const ROMAN_MIN = ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'vii°'];

// ---------- Melody helpers ----------
function randomMelody(len, { leaps = true, lo = -2, hi = 9, start = 0 } = {}) {
  // Melodies with momentum: mostly keep going in the same direction, and avoid zig-zags (x–y–x).
  const m = [start];
  let dir = pick([-1, 1]);
  for (let guard = 0; m.length < len && guard < 500; guard++) {
    const prev = m[m.length - 1];
    if (Math.random() < 0.35) dir = -dir;
    const size = leaps && Math.random() < 0.4 ? pick([2, 2, 3, 4]) : 1;
    const next = prev + dir * size;
    if (next < lo || next > hi) { dir = -dir; continue; }
    if (m.length >= 2 && next === m[m.length - 2] && Math.random() < 0.85) continue;
    m.push(next);
  }
  while (m.length < len) m.push(m[m.length - 1] + (m[m.length - 1] < hi ? 1 : -1));
  return m;
}

function majorKeyFor(setting) {
  const max = { c: 0, few: 2, some: 4 }[setting] ?? 0;
  return pick(KEYS.filter((k) => k.count <= max));
}

export const EAR_DRILLS_MORE = [
  {
    id: 'ear-cadence', title: 'Cadence Ear Training', stage: 'hear', skills: ['listening', 'terminology'], ear: true,
    blurb: 'Hear a four-chord phrase and name the cadence at the end.',
    settings: [
      { key: 'set', label: 'Cadences', options: [['two', 'Perfect & imperfect'], ['three', '+ plagal'], ['all', '+ interrupted']] },
      { key: 'mode', label: 'Keys', options: [['major', 'Major keys'], ['both', 'Major and minor']] },
    ],
    defaults: { set: 'all', mode: 'major' },
    generate(s) {
      const pool = { two: ['perfect', 'imperfect'], three: ['perfect', 'imperfect', 'plagal'], all: ['perfect', 'imperfect', 'plagal', 'interrupted'] }[s.set];
      const kind = pick(pool);
      const minor = s.mode === 'both' && Math.random() < 0.5;
      const scale = minor ? MINOR : MAJOR;
      const tonic = 55 + rand(8);
      const roots = [...CADENCES[kind][minor ? 'minor' : 'major']];
      if (kind === 'perfect' && Math.random() < 0.5) roots[1] = minor ? 3 : pick([1, 3, 5]);
      if (kind === 'imperfect' && Math.random() < 0.5) roots.splice(0, 3, 0, minor ? 5 : 5, minor ? 3 : 1);
      const chords = voiceProgression(tonic, roots, scale);
      const beat = 0.85 + Math.random() * 0.2;
      const audio = chords.map((c, i) => ({ t: i * beat, d: i === chords.length - 1 ? 1.7 : beat * 0.95, notes: c, timbre: 'organ', gain: 0.8 }));
      const R = minor ? ROMAN_MIN : ROMAN_MAJ;
      return {
        prompt: 'Listen to the phrase. Which cadence ends it?',
        audio,
        pad: 'choice', options: pool.map((v) => ({ value: v, label: CADENCES[v].name })),
        tags: [`Cadence|${CADENCES[kind].name.split(' (')[0]}`, `Key|${minor ? 'Minor' : 'Major'}`],
        solution: kind,
        check: (r) => r === kind,
        answerText: CADENCES[kind].name,
        explain: `The phrase was ${roots.map((r) => R[r]).join(' – ')} in a ${minor ? 'minor' : 'major'} key. ${CADENCES[kind].sound} Tip: sing the tonic at the start, then ask whether the last chord feels like home.`,
      };
    },
  },
  {
    id: 'ear-melody', title: 'Melodic Dictation', stage: 'hear', skills: ['listening', 'theory'], ear: true, verbs: ['Identify', 'Compare'], kind: 'Ear → notation',
    blurb: 'Hear a short melody, then choose the matching notation — or write it on the stave yourself.',
    settings: [
      { key: 'answer', label: 'Answer by', options: [['choose', 'Choosing the notation'], ['write', 'Writing it on the stave']] },
      { key: 'len', label: 'Length', options: [['4', '4 notes'], ['5', '5 notes'], ['6', '6 notes']] },
      { key: 'move', label: 'Movement', options: [['steps', 'Steps only'], ['leaps', 'Steps and leaps']] },
      { key: 'keys', label: 'Keys', options: [['c', 'C major'], ['few', 'Up to 2 ♯ or ♭'], ['some', 'Up to 4 ♯ or ♭']] },
    ],
    defaults: { answer: 'choose', len: '5', move: 'steps', keys: 'c' },
    generate(s) {
      const k = majorKeyFor(s.keys);
      const len = Number(s.len);
      const tonicL = LETTERS.indexOf(k.major[0]);
      const tonicDia = tonicL + 7 * 4; // tonic in octave 4 (C4–B4)
      const start = pick([0, 0, 2, 4]);
      const mel = randomMelody(len, { leaps: s.move === 'leaps', lo: -1, hi: 8, start });
      const toNotes = (m) => m.map((d) => fromDia(tonicDia + d, keySigAccidental(k, ((tonicL + d) % 7 + 7) % 7)));
      const key = (m) => m.join(',');
      const variants = new Map([[key(mel), mel]]);
      for (let tries = 0; variants.size < 4 && tries < 200; tries++) {
        const v = [...mel];
        const i = 1 + rand(len - 1);
        v[i] += pick([-2, -1, 1, 2]);
        if (Math.random() < 0.3 && len > 3) { const j = 1 + rand(len - 1); if (j !== i) v[j] += pick([-1, 1]); }
        if (v.some((x) => x < -2 || x > 9)) continue;
        if (v.some((x, j) => j > 0 && x === v[j - 1])) continue;
        variants.set(key(v), v);
      }
      const opts = shuffle([...variants.values()]).map((m, i) => ({ value: key(m), label: `Option ${'ABCD'[i]}`, staff: { clef: 'treble', columns: toNotes(m).map((n) => [n]), keySig: k.count ? k : null } }));
      const notes = toNotes(mel);
      const tonicMidi = midi(fromDia(tonicDia, keySigAccidental(k, tonicL)));
      const chord = [tonicMidi - 12, tonicMidi, tonicMidi + 4, tonicMidi + 7];
      const gap = 0.55;
      const audio = [{ t: 0, d: 1.0, notes: chord, gain: 0.7 }, ...notes.map((n, i) => ({ t: 1.5 + i * gap, d: gap * 0.9, notes: [midi(n)] }))];
      const leapsIn = mel.slice(1).filter((d, i) => Math.abs(d - mel[i]) > 1).length;
      const shape = `Follow the shape first: ${mel.slice(1).map((d, i) => (d > mel[i] ? (d - mel[i] > 1 ? 'leap up' : 'step up') : (mel[i] - d > 1 ? 'leap down' : 'step down'))).join(', ')}. ${leapsIn ? `There ${leapsIn === 1 ? 'is 1 leap' : `are ${leapsIn} leaps`} — check how far each one goes.` : 'It moves only by step.'}`;
      if (s.answer === 'write') {
        const sol = notes.slice(1);
        return {
          prompt: `First you hear the key chord (${k.major} major), then the melody. The first note is given — write the rest on the stave.${k.count ? ` (No key signature is shown, so add the ${k.type === 'sharp' ? 'sharps' : 'flats'} of ${k.major} major yourself.)` : ''}`,
          audio,
          pad: 'staffwrite', padProps: { clef: 'treble', tonic: notes[0], count: len - 1, accs: [-1, 0, 1], solution: sol.map((n) => ({ ...n })) },
          staffAfter: { clef: 'treble', columns: notes.map((n) => [n]) }, staffAfterLabel: 'The melody you heard', hideAfterIfRight: true,
          tags: [`Answer|Written on the stave`, `Movement|${s.move === 'steps' ? 'Steps only' : 'Steps and leaps'}`, `Length|${len} notes`, `Key|${k.count ? 'With sharps or flats' : 'C major'}`],
          solution: sol,
          check: (r) => Array.isArray(r) && r.length === sol.length && r.every((x, i) => x && x.l === sol[i].l && x.a === sol[i].a && x.o === sol[i].o),
          answerText: notes.map((n) => noteName(n)).join(' – '),
          explain: `${shape} The melody starts on ${noteName(notes[0])}.${k.count ? ` In ${k.major} major, remember the ${k.type === 'sharp' ? 'sharps' : 'flats'}: ${keyAccidentalNamesFor(k)}.` : ''}`,
        };
      }
      return {
        prompt: `First you hear the key chord (${k.major} major), then the melody. Which notation matches the melody?`,
        audio,
        pad: 'staffchoice', options: opts,
        tags: [`Movement|${s.move === 'steps' ? 'Steps only' : 'Steps and leaps'}`, `Length|${len} notes`, `Key|${k.count ? 'With a key signature' : 'C major'}`],
        solution: key(mel),
        check: (r) => r === key(mel),
        answerText: `${opts.find((o) => o.value === key(mel)).label}: ${notes.map((n) => noteName(n)).join(' – ')}`,
        explain: `Follow the shape first: ${mel.slice(1).map((d, i) => (d > mel[i] ? (d - mel[i] > 1 ? 'leap up' : 'step up') : (mel[i] - d > 1 ? 'leap down' : 'step down'))).join(', ')}. ${leapsIn ? `There ${leapsIn === 1 ? 'is 1 leap' : `are ${leapsIn} leaps`} — check how far each one goes.` : 'It moves only by step.'} The melody starts on ${start === 0 ? 'the tonic' : `degree ${start + 1} of the scale`} (${noteName(notes[0])}). Compare the options note by note to find where they differ.`,
      };
    },
  },
  {
    id: 'ear-metre', title: 'Metre Ear Training', stage: 'hear', skills: ['listening', 'terminology'], ear: true,
    blurb: 'Feel the strong beats and identify the metre.',
    settings: [
      { key: 'set', label: 'Metres', options: [['simple', 'Duple, triple, quadruple'], ['compound', '+ compound duple (6/8)']] },
      { key: 'click', label: 'Beat click', options: [['off', 'No click'], ['on', 'Click on every beat']] },
    ],
    defaults: { set: 'simple', click: 'off' },
    generate(s) {
      const METRES = {
        duple: { name: 'Simple duple (2/4)', beats: 2, sub: 1, label: '2 beats in a bar' },
        triple: { name: 'Simple triple (3/4)', beats: 3, sub: 1, label: '3 beats in a bar' },
        quadruple: { name: 'Simple quadruple (4/4)', beats: 4, sub: 1, label: '4 beats in a bar' },
        compound: { name: 'Compound duple (6/8)', beats: 2, sub: 3, label: '2 dotted-crotchet beats, each split into 3' },
      };
      const pool = s.set === 'compound' ? ['duple', 'triple', 'quadruple', 'compound'] : ['duple', 'triple', 'quadruple'];
      const m = pick(pool);
      const M = METRES[m];
      const tonic = 57 + rand(6);
      const beat = M.sub === 3 ? 0.66 + Math.random() * 0.12 : 0.48 + Math.random() * 0.12;
      const prog = pick([[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 5, 3], [0, 3, 0, 4]]);
      const chords = voiceProgression(tonic, prog, MAJOR);
      const audio = [];
      const bars = 4;
      chords.slice(0, bars).forEach((c, b) => {
        const barStart = b * M.beats * beat;
        audio.push({ t: barStart, d: M.beats * beat * 0.9, notes: [c[0]], gain: 1.1 });
        for (let bt = 0; bt < M.beats; bt++) {
          for (let sb = 0; sb < M.sub; sb++) {
            const t = barStart + bt * beat + (sb * beat) / M.sub;
            if (bt === 0 && sb === 0) { audio.push({ t, d: beat / M.sub * 0.9, notes: c.slice(1), gain: 1.0 }); continue; }
            const accent = sb === 0 ? (m === 'quadruple' && bt === 2 ? 0.55 : 0.4) : 0.22;
            audio.push({ t, d: (beat / M.sub) * 0.8, notes: c.slice(1), gain: accent });
          }
          if (s.click === 'on') audio.push({ t: barStart + bt * beat, d: 0.05, notes: [96], timbre: 'click', gain: bt === 0 ? 0.9 : 0.5 });
        }
      });
      return {
        prompt: 'Listen for the strongest beats (the bass note sounds on beat 1 of each bar). What is the metre?',
        audio,
        pad: 'choice', options: pool.map((v) => ({ value: v, label: METRES[v].name })),
        tags: [`Metre|${M.name}`],
        solution: m,
        check: (r) => r === m,
        answerText: M.name,
        explain: `${M.name}: ${M.label}. Count from each bass note (beat 1) to the next — that is one bar.${m === 'quadruple' ? ' Beat 3 is a little stronger than beats 2 and 4, which separates 4/4 from 2/4.' : ''}${m === 'compound' ? ' Each beat divides into three, giving a lilting, rocking feel — different from 3/4, where there are three separate beats.' : ''}${m === 'triple' ? ' Strong–weak–weak gives a waltz-like swing.' : ''}`,
      };
    },
  },
  {
    id: 'ear-feature', title: 'Musical Features by Ear', stage: 'hear', skills: ['listening', 'terminology', 'evidence'], ear: true, verbs: ['Identify', 'Describe'],
    blurb: 'Identify dynamics, tempo, articulation, texture and register changes — the evidence for your analysis.',
    settings: [
      { key: 'focus', label: 'Element', options: [['dynamics', 'Dynamics'], ['tempo', 'Tempo'], ['articulation', 'Articulation'], ['texture', 'Texture'], ['mixed', 'Mixed — what changes?']] },
    ],
    defaults: { focus: 'mixed' },
    generate(s) {
      const FEATURES = {
        crescendo: { group: 'dynamics', name: 'Crescendo', desc: 'gradually gets louder', meaning: 'building intensity, growing confidence or rising tension' },
        diminuendo: { group: 'dynamics', name: 'Diminuendo', desc: 'gradually gets softer', meaning: 'fading, withdrawal or calming' },
        subito: { group: 'dynamics', name: 'Sudden dynamic contrast (subito forte)', desc: 'jumps suddenly from soft to loud', meaning: 'shock, interruption or an outburst' },
        accelerando: { group: 'tempo', name: 'Accelerando', desc: 'gradually speeds up', meaning: 'urgency, excitement or panic' },
        ritardando: { group: 'tempo', name: 'Ritardando', desc: 'gradually slows down', meaning: 'winding down, hesitation or a sense of ending' },
        steady: { group: 'tempo', name: 'Steady tempo', desc: 'keeps the same speed throughout', meaning: 'stability, control or inevitability', noChange: true },
        staccato: { group: 'articulation', name: 'Staccato', desc: 'is short and detached', meaning: 'lightness, playfulness or nervous energy', noChange: true },
        legato: { group: 'articulation', name: 'Legato', desc: 'is smooth and connected', meaning: 'calm, flowing continuity or lyricism', noChange: true },
        accents: { group: 'articulation', name: 'Accents', desc: 'has some notes strongly emphasised', meaning: 'force, insistence or aggression', noChange: true },
        thickens: { group: 'texture', name: 'Texture thickens', desc: 'begins as a single line, then accompaniment joins', meaning: 'support arriving, growth or community' },
        thins: { group: 'texture', name: 'Texture thins', desc: 'begins with full accompaniment, then drops to a single line', meaning: 'isolation, exposure or intimacy' },
        register: { group: 'register', name: 'Melody moves to a higher register', desc: 'repeats its melody an octave higher', meaning: 'lifting, brightening or strain' },
      };
      const groupOf = (g) => Object.keys(FEATURES).filter((k) => FEATURES[k].group === g);
      const changes = ['crescendo', 'diminuendo', 'subito', 'accelerando', 'ritardando', 'thickens', 'thins', 'register'];
      const pool = s.focus === 'mixed' ? changes : groupOf(s.focus);
      const f = pick(pool);
      const F = FEATURES[f];
      const tonic = 57 + rand(6);
      const mel = randomMelody(12, { leaps: true, lo: 0, hi: 7, start: pick([0, 2, 4]) });
      const prog = [0, 3, 4, 0];
      const chords = voiceProgression(tonic, prog, MAJOR);
      const n = mel.length;
      let gap = 0.38;
      const times = []; let t = 0;
      for (let i = 0; i < n; i++) {
        times.push(t);
        if (f === 'accelerando') gap = Math.max(0.17, gap * 0.92);
        if (f === 'ritardando') gap = Math.min(0.8, gap * 1.09);
        t += gap;
      }
      const audio = [];
      mel.forEach((d, i) => {
        const g = f === 'crescendo' ? 0.12 + (i / (n - 1)) * 1.0 : f === 'diminuendo' ? 1.12 - (i / (n - 1)) * 1.0 : f === 'subito' ? (i < n / 2 ? 0.18 : 1.15) : 0.65;
        const nextT = i < n - 1 ? times[i + 1] : times[i] + 0.5;
        const len = nextT - times[i];
        const pitch = tonic + 12 + degSemis(d) + (f === 'register' && i >= n / 2 ? 12 : 0);
        const art = f === 'staccato' ? { d: len * 0.25, timbre: 'organ' } : f === 'legato' ? { d: len * 1.02, timbre: 'organ' } : { d: len * 0.85 };
        const acc = f === 'accents' && i % 3 === 0 ? 1.25 : f === 'accents' ? 0.4 : 1;
        audio.push({ t: times[i], notes: [pitch], gain: g * acc, ...art });
        const chordIdx = Math.min(3, Math.floor((i / n) * 4));
        const withAcc = !(f === 'thickens' && i < n / 2) && !(f === 'thins' && i >= n / 2) && f !== 'register';
        if (withAcc && (i % 3 === 0)) {
          audio.push({ t: times[i], d: Math.min(1.4, len * 3 * 0.95), notes: chords[chordIdx], gain: g * 0.55 * (f === 'accents' ? 0.8 : 1) });
        }
      });
      const groupName = { dynamics: 'dynamics', tempo: 'tempo', articulation: 'articulation', texture: 'texture', register: 'register' };
      const optKeys = s.focus === 'mixed' ? shuffle([f, ...shuffle(changes.filter((x) => x !== f)).slice(0, 3)]) : pool;
      return {
        prompt: s.focus === 'mixed' ? 'Listen. What changes in this excerpt?' : `Listen. Which term best describes the ${groupName[F.group]}?`,
        audio,
        pad: 'choice', options: optKeys.map((v) => ({ value: v, label: FEATURES[v].name })),
        tags: [`Element|${F.group[0].toUpperCase() + F.group.slice(1)}`, `Feature|${F.name}`],
        solution: f,
        check: (r) => r === f,
        answerText: F.name,
        explain: `The music ${F.desc}: ${F.name.toLowerCase()}. In an analysis, this is your evidence — then say what it creates in context (for example ${F.meaning}). The same feature can mean different things in different songs, so always check it against the theme.`,
      };
    },
  },
  {
    id: 'ear-texture', title: 'Texture Ear Training', stage: 'hear', skills: ['listening', 'terminology'], ear: true,
    blurb: 'Monophonic, homophonic, melody and accompaniment, or polyphonic?',
    settings: [
      { key: 'set', label: 'Textures', options: [['three', 'Monophonic, homophonic, polyphonic'], ['four', '+ melody and accompaniment']] },
    ],
    defaults: { set: 'four' },
    generate(s) {
      const TEX = {
        mono: { name: 'Monophonic', desc: 'a single melodic line with no accompaniment', tip: 'Only one note sounds at a time.' },
        homo: { name: 'Homophonic (chordal)', desc: 'all parts moving together in the same rhythm, like a hymn', tip: 'Every note of the melody is a chord: the parts start and stop together.' },
        mel: { name: 'Melody and accompaniment', desc: 'a clear melody supported by a broken-chord accompaniment', tip: 'One line stands out on top; underneath, the accompaniment has its own repeating pattern. (This is a type of homophonic texture.)' },
        poly: { name: 'Polyphonic (imitative)', desc: 'two independent melodic lines, the second imitating the first', tip: 'Two melodies of equal importance overlap — the second enters with the same tune after the first has started.' },
      };
      const pool = s.set === 'three' ? ['mono', 'homo', 'poly'] : ['mono', 'homo', 'mel', 'poly'];
      const kind = pick(pool);
      const tonic = 57 + rand(6);
      const beat = 0.42 + Math.random() * 0.08;
      const audio = [];
      if (kind === 'poly') {
        const m = randomMelody(10, { leaps: true, lo: 0, hi: 6, start: 0 });
        const pitches = m.map((d) => tonic + 12 + degSemis(d, PENTA));
        const lens = m.map(() => pick([1, 1, 1, 2, 0.5]));
        const line = []; let t = 0;
        pitches.forEach((p, i) => { line.push({ t, d: lens[i] * beat * 0.92, p }); t += lens[i] * beat; });
        const delay = 2 * beat;
        line.forEach((e) => audio.push({ t: e.t, d: e.d, notes: [e.p], gain: 0.8 }));
        line.forEach((e) => audio.push({ t: e.t + delay, d: e.d, notes: [e.p - 12], gain: 0.8 }));
      } else {
        const prog = pick([[0, 3, 4, 0], [0, 5, 3, 4, 0], [0, 4, 5, 3, 4, 0]]);
        const chords = voiceProgression(tonic, prog, MAJOR);
        chords.forEach((c, b) => {
          const t0 = b * 2 * beat;
          const top = c[3] + 12;
          const passing = top + pick([2, -1, -2, 1]);
          if (kind === 'mono') {
            audio.push({ t: t0, d: beat * 0.9, notes: [top] }, { t: t0 + beat, d: beat * 0.9, notes: [passing] });
          } else if (kind === 'homo') {
            audio.push({ t: t0, d: beat * 0.95, notes: [c[0], c[1] + 12, c[2] + 12, top], timbre: 'organ', gain: 0.9 });
            audio.push({ t: t0 + beat, d: beat * 0.95, notes: [c[0], c[1] + 12, c[2] + 12, top], timbre: 'organ', gain: 0.75 });
          } else {
            audio.push({ t: t0, d: beat * 0.9, notes: [top + 12], gain: 1.0 }, { t: t0 + beat, d: beat * 0.9, notes: [passing + 12], gain: 1.0 });
            [c[0], c[1], c[2], c[3]].forEach((n, k) => audio.push({ t: t0 + k * beat / 2, d: beat / 2 * 0.9, notes: [n], gain: 0.45 }));
          }
        });
      }
      return {
        prompt: 'Listen. Which texture is this?',
        audio,
        pad: 'choice', options: pool.map((v) => ({ value: v, label: TEX[v].name })),
        tags: [`Texture|${TEX[kind].name}`],
        solution: kind,
        check: (r) => r === kind,
        answerText: TEX[kind].name,
        explain: `${TEX[kind].name}: ${TEX[kind].desc}. ${TEX[kind].tip}`,
      };
    },
  },
  {
    id: 'ear-tonality', title: 'Major or Minor?', stage: 'hear', skills: ['listening', 'terminology'], ear: true,
    blurb: 'Hear a short phrase and identify its tonality — without assuming major = happy.',
    settings: [
      { key: 'play', label: 'Played as', options: [['phrase', 'Melody with chords'], ['melody', 'Melody only (harder)']] },
    ],
    defaults: { play: 'phrase' },
    generate(s) {
      const minor = Math.random() < 0.5;
      const scale = minor ? MINOR : MAJOR;
      const tonic = 55 + rand(8);
      // Always include the 3rd of the scale early, then a free middle, then 2–1 to close on the tonic.
      const head = pick([[0, 1, 2], [0, 2, 4], [4, 2, 0, 2], [2, 1, 0, 2], [0, 2, 1, 2]]);
      let fixed = [...head];
      while (fixed.length < head.length + 3) {
        const prev = fixed[fixed.length - 1];
        const nxt = prev + pick([-1, 1, -2, 2]);
        if (nxt < 0 || nxt > 7 || nxt === prev) continue;
        fixed.push(nxt);
      }
      if (fixed[fixed.length - 1] === 1) fixed.push(2);
      fixed.push(1, 0);
      const prog = [0, 3, 4, 0];
      const chords = voiceProgression(tonic, prog, scale);
      const beat = 0.45;
      const audio = [];
      fixed.forEach((d, i) => audio.push({ t: i * beat, d: i === fixed.length - 1 ? 1.2 : beat * 0.9, notes: [tonic + 12 + degSemis(d, scale)] }));
      if (s.play === 'phrase') {
        const last = fixed.length - 1;
        const at = [0, Math.round(last / 3), Math.round((2 * last) / 3), last];
        chords.forEach((c, k) => audio.push({ t: at[k] * beat, d: k === 3 ? 1.2 : (at[k + 1] - at[k]) * beat * 0.95, notes: c, gain: 0.5 }));
      }
      const name = minor ? 'Minor' : 'Major';
      return {
        prompt: 'Listen. Is this phrase in a major or a minor key?',
        audio,
        pad: 'choice', options: [{ value: 'major', label: 'Major' }, { value: 'minor', label: 'Minor' }],
        tags: [`Tonality|${name}`, `Played as|${s.play === 'phrase' ? 'Melody with chords' : 'Melody only'}`],
        solution: minor ? 'minor' : 'major',
        check: (r) => r === (minor ? 'minor' : 'major'),
        answerText: name,
        explain: `${name}: the 3rd note of the scale is ${minor ? 'a minor 3rd (3 semitones)' : 'a major 3rd (4 semitones)'} above the tonic${minor ? ', and the raised 7th leads strongly back to the tonic at the end' : ''}. Listen for that 3rd, and for the tonic chord at the start and end. Remember: tonality is not mood — a minor key can sound defiant or calm, and a major key can sound bittersweet.`,
      };
    },
  },
];
