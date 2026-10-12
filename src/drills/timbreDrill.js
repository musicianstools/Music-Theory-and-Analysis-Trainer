// TIMBRE WORDS — hear a synthesised sound (or read an instrument description) and describe its tone colour.
// Two answer modes: choose all the words that fit, or type your own timbre word.
// `words` = words that fit; `avoid` = words that clearly do not (used as distractors).
import { pick, rand } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export const TIMBRE_SOUNDS = {
  bright: { label: 'Bright, buzzy sound', voice: { wave: 'sawtooth', filter: { freq: 7000, Q: 0.8 }, attack: 0.01, level: 0.75 },
    words: ['bright', 'brassy', 'buzzy', 'brilliant', 'sharp', 'cutting', 'edgy', 'rich in overtones'], avoid: ['mellow', 'muffled', 'breathy', 'pure', 'dull'],
    why: 'Lots of strong upper harmonics (overtones) make a sound bright and buzzy — like a trumpet or a synth lead.' },
  mellow: { label: 'Mellow, warm sound', voice: { wave: 'triangle', filter: { freq: 1100, Q: 0.6 }, attack: 0.08, level: 1.1 },
    words: ['mellow', 'warm', 'soft', 'smooth', 'round', 'gentle', 'velvety'], avoid: ['harsh', 'buzzy', 'nasal', 'metallic', 'piercing'],
    why: 'Few upper harmonics and a gentle attack give a warm, rounded tone — like a French horn or a soft synth pad.' },
  pure: { label: 'Pure, clear sound', voice: { wave: 'sine', attack: 0.03, level: 1.2 },
    words: ['pure', 'clear', 'simple', 'smooth', 'flute-like', 'clean', 'glassy'], avoid: ['buzzy', 'gritty', 'nasal', 'brassy', 'distorted'],
    why: 'A sine wave has almost no overtones, so the tone sounds pure and simple — close to a flute or a whistle.' },
  hollow: { label: 'Hollow, reedy sound', voice: { wave: 'square', filter: { freq: 1800, Q: 0.7 }, attack: 0.02, level: 0.8 },
    words: ['hollow', 'reedy', 'woody', 'clarinet-like', 'covered'], avoid: ['breathy', 'metallic', 'pure', 'shrill'],
    why: 'A square wave contains only odd-numbered harmonics, which gives the hollow, woody colour of a clarinet in its low register.' },
  nasal: { label: 'Nasal, pinched sound', voice: { wave: 'sawtooth', filter: { type: 'bandpass', freq: 1400, Q: 7 }, attack: 0.02, level: 1.4 },
    words: ['nasal', 'reedy', 'pinched', 'thin', 'oboe-like', 'penetrating', 'twangy'], avoid: ['warm', 'round', 'deep', 'breathy', 'full'],
    why: 'When one narrow band of frequencies is emphasised, the tone sounds pinched and nasal — like an oboe or a muted trumpet.' },
  breathy: { label: 'Breathy, airy sound', voice: { wave: 'sine', toneLevel: 0.35, noise: 1.2, noiseAt: 1, noiseQ: 3, attack: 0.12, level: 1.1 },
    words: ['breathy', 'airy', 'whispery', 'hazy', 'soft', 'fragile', 'wispy'], avoid: ['brassy', 'metallic', 'harsh', 'focused', 'piercing'],
    why: 'Audible air (noise) around a weak pitch makes a breathy, airy tone — like a breathy vocal or a pan flute.' },
  harsh: { label: 'Harsh, distorted sound', voice: { wave: 'sawtooth', drive: 9, filter: { freq: 5000, Q: 0.7 }, attack: 0.005, level: 0.55 },
    words: ['harsh', 'distorted', 'gritty', 'raw', 'aggressive', 'abrasive', 'fuzzy', 'crunchy'], avoid: ['pure', 'mellow', 'smooth', 'breathy', 'gentle'],
    why: 'Overdriving a sound adds rough, dense overtones — the gritty, distorted timbre of a rock guitar.' },
  metallic: { label: 'Metallic, bell-like sound', voice: { wave: 'sine', fm: { ratio: 3.5, index: 3, decay: 1.2 }, attack: 0.003, decay: 1.4, sustain: 0.05, release: 0.6, level: 1 },
    words: ['metallic', 'bell-like', 'ringing', 'shimmering', 'resonant', 'chiming', 'glassy'], avoid: ['breathy', 'muffled', 'warm', 'reedy', 'dull'],
    why: 'Overtones that are not in a simple harmonic series, plus a long ringing decay, sound metallic and bell-like — like a glockenspiel or chimes.' },
  muffled: { label: 'Muffled, dull sound', voice: { wave: 'square', filter: { freq: 380, Q: 0.6 }, attack: 0.03, level: 1.6 },
    words: ['muffled', 'dull', 'dark', 'muted', 'covered', 'veiled', 'murky'], avoid: ['bright', 'brilliant', 'piercing', 'crisp', 'sharp'],
    why: 'Cutting away the upper frequencies leaves a dull, muffled tone — like music heard through a wall, or a heavily muted instrument.' },
  plucked: { label: 'Plucked, percussive sound', voice: { wave: 'sawtooth', filter: { freq: 5000, sweepTo: 500, Q: 1 }, attack: 0.003, decay: 0.35, sustain: 0.02, release: 0.1, level: 0.9 },
    words: ['plucked', 'percussive', 'twangy', 'dry', 'short', 'staccato', 'pizzicato-like'], avoid: ['sustained', 'breathy', 'smooth', 'legato', 'airy'],
    why: 'A sharp attack that dies away quickly sounds plucked and percussive — like a guitar, harp or pizzicato strings.' },
};

export const TIMBRE_INSTRUMENTS = [
  { name: 'a muted trumpet', words: ['nasal', 'buzzy', 'thin', 'pinched', 'distant', 'muted'], avoid: ['warm', 'breathy', 'round', 'booming'] },
  { name: 'a flute in its low register', words: ['breathy', 'airy', 'mellow', 'dark', 'soft', 'hollow'], avoid: ['brassy', 'harsh', 'nasal', 'piercing'] },
  { name: 'a distorted electric guitar', words: ['gritty', 'distorted', 'harsh', 'crunchy', 'aggressive', 'raw', 'fuzzy'], avoid: ['pure', 'mellow', 'breathy', 'delicate'] },
  { name: 'pizzicato strings', words: ['plucked', 'percussive', 'dry', 'light', 'detached', 'crisp'], avoid: ['sustained', 'smooth', 'legato', 'booming'] },
  { name: 'a pipe organ', words: ['sustained', 'resonant', 'full', 'majestic', 'rich', 'reverberant'], avoid: ['plucked', 'breathy', 'thin', 'dry'] },
  { name: 'a glockenspiel', words: ['bright', 'metallic', 'bell-like', 'ringing', 'shimmering', 'sparkling'], avoid: ['breathy', 'muffled', 'dark', 'reedy'] },
  { name: 'a clarinet in its low register', words: ['dark', 'rich', 'hollow', 'woody', 'mellow', 'reedy'], avoid: ['metallic', 'shrill', 'brassy', 'thin'] },
  { name: 'an oboe', words: ['nasal', 'reedy', 'penetrating', 'plaintive', 'focused'], avoid: ['breathy', 'booming', 'metallic', 'fuzzy'] },
  { name: 'a falsetto voice', words: ['airy', 'light', 'fragile', 'breathy', 'delicate', 'ethereal'], avoid: ['booming', 'gritty', 'brassy', 'heavy'] },
  { name: 'a belted chest-voice vocal', words: ['powerful', 'brassy', 'full', 'intense', 'strained', 'bright'], avoid: ['breathy', 'fragile', 'muffled', 'whispery'] },
  { name: 'a bowed double bass', words: ['deep', 'dark', 'rich', 'resonant', 'warm', 'gruff'], avoid: ['shrill', 'thin', 'bright', 'sparkling'] },
  { name: 'muted strings (con sordino)', words: ['veiled', 'muted', 'soft', 'hushed', 'distant', 'covered'], avoid: ['brassy', 'piercing', 'crisp', 'harsh'] },
  { name: 'a snare drum', words: ['crisp', 'sharp', 'rattling', 'dry', 'snappy', 'percussive'], avoid: ['sustained', 'mellow', 'breathy', 'legato'] },
  { name: 'a warm synth pad', words: ['warm', 'smooth', 'sustained', 'lush', 'soft', 'hazy'], avoid: ['percussive', 'harsh', 'dry', 'twangy'] },
];

// Extra words that are also fine to give for a sound (typed-answer mode), beyond its `words`.
const ALSO_OK = {
  bright: ['piercing', 'trumpet-like', 'strident', 'shrill', 'clear'],
  mellow: ['dark', 'soft-edged', 'rich', 'sweet', 'horn-like', 'muted'],
  pure: ['sweet', 'thin', 'whistle-like', 'soft', 'hollow'],
  hollow: ['dark', 'woody', 'mellow', 'buzzy'],
  nasal: ['buzzy', 'piercing', 'bright', 'muted'],
  breathy: ['whispered', 'misty', 'delicate', 'light', 'ethereal'],
  harsh: ['dirty', 'heavy', 'rough', 'buzzy', 'overdriven', 'noisy'],
  metallic: ['bright', 'sparkling', 'tinkling', 'clangy', 'clanging'],
  muffled: ['soft', 'mellow', 'deep', 'heavy', 'thick', 'murky', 'boomy'],
  plucked: ['sharp', 'bright', 'detached', 'crisp', 'snappy', 'clicky'],
};

const norm = (w) => w.toLowerCase().trim().replace(/[.!?,;:"'“”]/g, '').replace(/\s+/g, ' ');
const base = (w) => norm(w).replace(/-?(like|ish)$/, '').replace(/(ly)$/, '');
export function timbreWordMatches(answer, list) {
  const a = norm(answer);
  if (!a) return false;
  return list.some((w) => norm(w) === a || base(w) === base(a) || (a.length > 4 && base(w).startsWith(base(a)) && base(w).length - base(a).length <= 2));
}

export const TIMBRE_DRILL = {
  id: 'timbre', title: 'Timbre Words', stage: 'know', skills: ['theory', 'terminology', 'listening'], ear: true, kind: 'Vocabulary', verbs: ['Identify', 'Describe'],
  blurb: 'Hear a sound (or read an instrument) and describe its tone colour — choose the timbre words that fit, or give your own.',
  settings: [
    { key: 'source', label: 'Sounds', options: [['synth', 'Synthesised sounds (listen)'], ['inst', 'Instrument descriptions'], ['both', 'Both']] },
    { key: 'answer', label: 'Answer by', options: [['choose', 'Choosing words that fit'], ['type', 'Typing your own word']] },
  ],
  defaults: { source: 'synth', answer: 'choose' },
  generate(s) {
    const useSynth = s.source === 'synth' || (s.source === 'both' && Math.random() < 0.6);
    let fit, avoid, why, audio = null, subject, tag;
    if (useSynth) {
      const key = pick(Object.keys(TIMBRE_SOUNDS));
      const T = TIMBRE_SOUNDS[key];
      fit = T.words; avoid = T.avoid; why = T.why; tag = T.label;
      const root = 57 + rand(8);
      const shape = pick([[0, 4, 7, 12], [0, 2, 4, 7], [7, 4, 2, 0], [0, 7, 12, 7]]);
      audio = shape.map((iv, i) => ({ t: i * 0.6, d: 0.55, notes: [root + iv], voice: T.voice })).concat([{ t: 2.5, d: 1.3, notes: [root], voice: T.voice }]);
      subject = 'this sound';
      fit = [...fit, ...(s.answer === 'type' ? ALSO_OK[key] : [])];
    } else {
      const I = pick(TIMBRE_INSTRUMENTS);
      fit = I.words; avoid = I.avoid; subject = I.name; tag = 'Instrument description';
      why = `Typical words for ${I.name}: ${I.words.join(', ')}. Timbre words describe tone colour — the quality that makes two instruments playing the same note sound different.`;
    }
    if (s.answer === 'type') {
      return {
        prompt: useSynth ? 'Listen. Give one timbre word that describes this sound.' : `Give one timbre word that describes the sound of ${subject}.`,
        audio, pad: 'text', padProps: { placeholder: 'e.g. mellow', label: 'Your timbre word' },
        tags: [`Answer|Typed word`, `Sound|${tag}`],
        solution: fit[0],
        check: (r) => timbreWordMatches(r, fit),
        answerText: `any of: ${fit.slice(0, 8).join(', ')}`,
        explain: `${why} Words that fit include ${fit.slice(0, 8).join(', ')}. ${'Avoid words that describe pitch, volume or mood alone (high, loud, sad) — timbre is tone colour.'}`,
      };
    }
    const right = shuffle(fit).slice(0, pick([2, 3]));
    const wrong = shuffle(avoid).slice(0, 6 - right.length);
    const options = shuffle([...right, ...wrong]).map((w) => ({ value: w, label: w }));
    return {
      prompt: useSynth ? 'Listen. Which timbre words describe this sound? Select all that apply — there may be more than one.' : `Which timbre words describe the sound of ${subject}? Select all that apply — there may be more than one.`,
      audio, pad: 'multichoice', options,
      tags: [`Answer|Choose words`, `Sound|${tag}`],
      solution: [...right].sort(),
      check: (r) => Array.isArray(r) && r.length === right.length && right.every((w) => r.includes(w)),
      answerText: right.join(', '),
      explain: `${why} Words that fit: ${right.join(', ')}. Words that do not: ${wrong.join(', ')}.`,
    };
  },
};
