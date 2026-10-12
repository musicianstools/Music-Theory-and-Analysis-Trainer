// FORM & STRUCTURE — hear a piece built from contrasting sections and name its form; read a song map and name the form;
// or match section names (verse, chorus, bridge…) to their jobs. Every audio piece is generated fresh.
import { pick, rand } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export const FORMS = [
  { id: 'binary', lv: 1, name: 'Binary (AB)', plan: ['A', 'B'], why: 'Two contrasting sections, A then B, with no return to A.' },
  { id: 'ternary', lv: 1, name: 'Ternary (ABA)', plan: ['A', 'B', 'A'], why: 'A, a contrasting B, then A returns — a satisfying sense of coming home.' },
  { id: 'strophic', lv: 1, name: 'Strophic (AAA)', plan: ['A', 'A', 'A'], why: 'The same music repeated for every verse — common in folk songs and hymns.' },
  { id: 'aaba', lv: 2, name: '32-bar song form (AABA)', plan: ['A', 'A', 'B', 'A'], why: 'Two A sections, a contrasting B (the "middle 8" or bridge), then A again — classic jazz-standard and Tin Pan Alley form.' },
  { id: 'rondo', lv: 2, name: 'Rondo (ABACA)', plan: ['A', 'B', 'A', 'C', 'A'], why: 'A keeps returning between different episodes (B, C) — like a chorus between contrasting verses.' },
  { id: 'verse', lv: 3, name: 'Verse–chorus (ABAB)', plan: ['A', 'B', 'A', 'B'], why: 'Verse and chorus alternate; the chorus (B) is fuller and higher and returns with the same melody.' },
  { id: 'vcb', lv: 3, name: 'Verse–chorus with bridge (ABABCB)', plan: ['A', 'B', 'A', 'B', 'C', 'B'], why: 'Verse–chorus twice, then a new bridge section (C) before a final chorus.' },
  { id: 'variations', lv: 4, name: 'Theme and variations (A A1 A2 A3)', plan: ['A', 'A1', 'A2', 'A3'], why: 'One theme, then varied versions of it — the melody stays recognisable while rhythm, register or texture change.' },
  { id: 'arch', lv: 4, name: 'Arch form (ABCBA)', plan: ['A', 'B', 'C', 'B', 'A'], why: 'Sections return in reverse order around a central C — a symmetrical arch.' },
  { id: 'blues', lv: 4, name: '12-bar blues', plan: ['BLUES'], why: 'Twelve bars over I–I–I–I | IV–IV–I–I | V–IV–I–I: the chord pattern, not the melody, defines the form.' },
  { id: 'through', lv: 5, name: 'Through-composed (ABCD)', plan: ['A', 'B', 'C', 'D'], why: 'New music for every section, with no return — the music follows the story instead of repeating.' },
  { id: 'rondo7', lv: 5, name: 'Seven-part rondo (ABACABA)', plan: ['A', 'B', 'A', 'C', 'A', 'B', 'A'], why: 'An extended rondo: A returns four times, with B also returning near the end.' },
];

// Each section letter gets its own key area, register, melody shape and accompaniment.
const SECTION_STYLE = {
  A: { shift: 0, chords: [0, 5, 7, 0], mel: [0, 2, 4, 5, 4, 2, 0, -1, 0], acc: 'block' },
  B: { shift: 7, chords: [0, 5, 7, 0], mel: [4, 4, 5, 7, 9, 7, 5, 4, 2], acc: 'arp' },
  C: { shift: 5, chords: [0, 7, 5, 0], mel: [7, 5, 7, 9, 7, 5, 4, 2, 0], acc: 'pulse' },
  D: { shift: 9, chords: [0, 5, 7, 0], mel: [0, -1, 0, 2, 4, 2, 0, 4, 0], acc: 'block', minor: true },
};
const MAJ = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
const degSemi = (d) => (d < 0 ? MAJ[7 + d] - 12 : MAJ[d]);

function sectionAudio(letter, t0, tonic, beat) {
  const base = letter.replace(/\d/, '');
  const varNo = Number(letter.slice(1)) || 0;
  const st = SECTION_STYLE[base];
  const root = tonic + st.shift - (st.shift > 6 ? 12 : 0);
  const ev = [];
  st.mel.forEach((d, i) => {
    // variations: 1 = higher octave + dotted rhythm, 2 = minor-ish + faster, 3 = bass melody
    const step = varNo === 2 ? beat * 0.66 : beat;
    const t = t0 + i * step + (varNo === 1 && i % 2 ? beat * 0.25 : 0);
    let p = root + 12 + degSemi(d) + (st.minor && [2, 4].includes(d) ? -1 : 0);
    if (varNo === 1) p += 12;
    if (varNo === 3) p -= 12;
    ev.push({ t, d: step * 0.85, notes: [p], gain: varNo === 3 ? 1 : 0.85 });
  });
  const len = st.mel.length * (varNo === 2 ? beat * 0.66 : beat);
  st.chords.forEach((c, k) => {
    const cr = root + c - (c > 6 ? 12 : 0) - 12;
    const tones = [cr, cr + (st.minor ? 3 : 4), cr + 7];
    const ct = t0 + (k * len) / 4;
    const dur = len / 4;
    if (st.acc === 'block') ev.push({ t: ct, d: dur * 0.95, notes: tones, gain: 0.45, timbre: 'organ' });
    if (st.acc === 'arp') tones.concat([cr + 12]).forEach((n, j) => ev.push({ t: ct + (j * dur) / 4, d: dur / 4, notes: [n], gain: 0.4 }));
    if (st.acc === 'pulse') [0, 1, 2, 3].forEach((j) => ev.push({ t: ct + (j * dur) / 4, d: dur / 6, notes: [cr - 12, cr], gain: 0.4 }));
  });
  return { ev, len };
}

function bluesAudio(tonic, beat) {
  const ev = [];
  const bars = [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 0];
  bars.forEach((c, b) => {
    const r = tonic + c - 12;
    [0, 1, 2, 3].forEach((j) => ev.push({ t: (b * 4 + j) * beat * 0.6, d: beat * 0.5, notes: [r - 12, j % 2 ? r + 9 : r + 7, r + 10], gain: 0.55 }));
  });
  return ev;
}

export const SONG_MAPS = [
  { lv: 1, map: 'Verse 1 – Verse 2 – Verse 3 – Verse 4 (same music each time)', answer: 'Strophic (AAA)' },
  { lv: 2, map: 'A (8 bars) – A (8 bars) – B (8 bars) – A (8 bars)', answer: '32-bar song form (AABA)' },
  { lv: 2, map: 'Main theme – Episode 1 – Main theme – Episode 2 – Main theme', answer: 'Rondo (ABACA)' },
  { lv: 3, map: 'Intro – Verse – Chorus – Verse – Chorus – Outro', answer: 'Verse–chorus (ABAB)' },
  { lv: 3, map: 'Verse – Chorus – Verse – Chorus – Bridge – Chorus', answer: 'Verse–chorus with bridge (ABABCB)' },
  { lv: 3, map: 'Section A – Section B – Section A', answer: 'Ternary (ABA)' },
  { lv: 4, map: 'Theme – Variation 1 – Variation 2 – Variation 3 – Variation 4', answer: 'Theme and variations (A A1 A2 A3)' },
  { lv: 4, map: 'A – B – C – B – A', answer: 'Arch form (ABCBA)' },
  { lv: 4, map: 'I I I I | IV IV I I | V IV I I (repeated for each verse)', answer: '12-bar blues' },
  { lv: 5, map: 'Section 1 – Section 2 – Section 3 – Section 4, each new, nothing repeats', answer: 'Through-composed (ABCD)' },
  { lv: 5, map: 'A – B – A – C – A – B – A', answer: 'Seven-part rondo (ABACABA)' },
];

export const SECTION_TERMS = [
  { lv: 1, term: 'Verse', job: 'Tells the story; the music repeats but the lyrics change each time' },
  { lv: 1, term: 'Chorus', job: 'The main, repeated section with the same lyrics and melody each time — often the hook' },
  { lv: 1, term: 'Intro', job: 'Opens the song before the voice enters, setting the mood' },
  { lv: 1, term: 'Outro', job: 'Closes the song, often fading or repeating the hook' },
  { lv: 2, term: 'Bridge (middle 8)', job: 'A contrasting section, usually heard once, that leads back to the chorus' },
  { lv: 2, term: 'Pre-chorus', job: 'Builds tension between the verse and the chorus' },
  { lv: 3, term: 'Instrumental break', job: 'A section with no singing, often featuring a solo' },
  { lv: 3, term: 'Refrain', job: 'A repeated line or phrase that ends each verse' },
  { lv: 4, term: 'Coda', job: 'An added ending section that rounds off the piece' },
  { lv: 4, term: 'Episode', job: 'A contrasting section between returns of the main theme in a rondo' },
  { lv: 5, term: 'Codetta', job: 'A short closing passage at the end of a section rather than the whole piece' },
  { lv: 5, term: 'Transition', job: 'Passage that moves from one section or key to the next' },
];

export const FORM_DRILL = {
  id: 'form', title: 'Form & Structure', stage: 'know', skills: ['theory', 'listening', 'terminology'], kind: 'Form', ear: true, verbs: ['Identify', 'Analyse', 'Sequence'],
  blurb: 'Hear a piece and name its form (binary, ternary, rondo, AABA, verse–chorus…), read a song map, or match section names to their jobs.',
  settings: [
    { key: 'mode', label: 'Task', options: [['hear', 'Hear it → name the form'], ['map', 'Read a song map → name the form'], ['terms', 'Section names → their jobs']] },
    { key: 'level', label: 'Forms', options: [['1', 'AB, ABA, AAA'], ['2', '+ AABA, rondo'], ['3', '+ verse–chorus, bridge'], ['4', '+ variations, arch, 12-bar blues'], ['5', '+ through-composed, 7-part rondo']] },
  ],
  defaults: { mode: 'hear', level: '2' },
  levels: { 1: { level: '1' }, 2: { level: '2' }, 3: { level: '3' }, 4: { level: '4' }, 5: { level: '5' } },
  generate(s) {
    const lv = Number(s.level);
    const pool = FORMS.filter((f) => f.lv <= lv);
    if (s.mode === 'terms') {
      const terms = SECTION_TERMS.filter((t) => t.lv <= lv);
      const t = pick(terms);
      const opts = shuffle([t, ...shuffle(terms.filter((x) => x !== t)).slice(0, 3)]).map((x) => ({ value: x.term, label: x.term }));
      return {
        prompt: `Which section: "${t.job}"?`, pad: 'choice', options: opts, tags: ['Task|Section names'],
        solution: t.term, check: (r) => r === t.term, answerText: t.term, explain: `${t.term}: ${t.job.toLowerCase()}.`,
      };
    }
    if (s.mode === 'map') {
      const m = pick(SONG_MAPS.filter((x) => x.lv <= lv));
      const opts = shuffle([m.answer, ...shuffle(pool.map((f) => f.name).filter((n) => n !== m.answer)).slice(0, 3)]).map((x) => ({ value: x, label: x }));
      const f = FORMS.find((x) => x.name === m.answer);
      return {
        prompt: `Song map: ${m.map}. What is the form?`, pad: 'choice', options: opts, tags: ['Task|Song map', `Form|${m.answer}`],
        solution: m.answer, check: (r) => r === m.answer, answerText: m.answer, explain: f.why,
      };
    }
    const f = pick(pool);
    const tonic = 57 + rand(5);
    const beat = 0.32;
    let audio = [];
    if (f.id === 'blues') audio = bluesAudio(tonic, beat);
    else {
      let t = 0;
      f.plan.forEach((sec) => { const { ev, len } = sectionAudio(sec, t, tonic, beat); audio = audio.concat(ev); t += len + 0.45; });
    }
    const opts = shuffle([f, ...shuffle(pool.filter((x) => x !== f && x.plan.length !== 0)).slice(0, 3)]).map((x) => ({ value: x.id, label: x.name }));
    return {
      prompt: f.id === 'blues' ? 'Listen to the whole piece. What is the form?' : 'Listen to the whole piece. Each section has its own melody and accompaniment — which return, and which are new? What is the form?',
      audio, pad: 'choice', options: opts, tags: ['Task|Hear the form', `Form|${f.name}`],
      solution: f.id, check: (r) => r === f.id, answerText: f.name,
      explain: `${f.name}: ${f.why}${f.plan.length > 1 ? ` You heard ${f.plan.join(' – ')}.` : ''} Tip: give each new section a letter as you listen, and reuse the letter when music returns.`,
    };
  },
};
