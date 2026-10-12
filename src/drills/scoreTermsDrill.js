// SCORE-READING TERMS — a short excerpt with one marking highlighted: what does it mean?
// Or the reverse: which marking means this? Terms are grouped by level.
import { fromDia, pick } from '../utils/music.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// kind: where the marking is drawn. mark: how it is attached to an event (see ScoreStaff).
export const SCORE_TERMS = [
  // Level 1
  { lv: 1, term: 'p (piano)', meaning: 'Soft', kind: 'dyn', mark: { dyn: 'p' } },
  { lv: 1, term: 'f (forte)', meaning: 'Loud', kind: 'dyn', mark: { dyn: 'f' } },
  { lv: 1, term: 'Crescendo (hairpin <)', meaning: 'Gradually getting louder', kind: 'hair', mark: { hair: 'cresc' } },
  { lv: 1, term: 'Diminuendo (hairpin >)', meaning: 'Gradually getting softer', kind: 'hair', mark: { hair: 'dim' } },
  { lv: 1, term: 'Staccato (dot)', meaning: 'Short and detached', kind: 'art', mark: { art: ['staccato'] } },
  { lv: 1, term: 'Slur (curved line)', meaning: 'Play smoothly, joining the notes (legato)', kind: 'slur', mark: { slur: 'start' } },
  // Level 2
  { lv: 2, term: 'pp (pianissimo)', meaning: 'Very soft', kind: 'dyn', mark: { dyn: 'pp' } },
  { lv: 2, term: 'ff (fortissimo)', meaning: 'Very loud', kind: 'dyn', mark: { dyn: 'ff' } },
  { lv: 2, term: 'mp (mezzo piano)', meaning: 'Moderately soft', kind: 'dyn', mark: { dyn: 'mp' } },
  { lv: 2, term: 'mf (mezzo forte)', meaning: 'Moderately loud', kind: 'dyn', mark: { dyn: 'mf' } },
  { lv: 2, term: 'Accent (>)', meaning: 'Emphasise the note — play it with extra force', kind: 'art', mark: { art: ['accent'] } },
  { lv: 2, term: 'Allegro', meaning: 'Fast and lively', kind: 'tempo', mark: { tempo: 'Allegro' } },
  { lv: 2, term: 'Andante', meaning: 'At a walking pace', kind: 'tempo', mark: { tempo: 'Andante' } },
  { lv: 2, term: 'Adagio', meaning: 'Slow (at ease)', kind: 'tempo', mark: { tempo: 'Adagio' } },
  // Level 3
  { lv: 3, term: 'Tenuto (line)', meaning: 'Hold the note for its full value, slightly emphasised', kind: 'art', mark: { art: ['tenuto'] } },
  { lv: 3, term: 'Fermata (pause)', meaning: 'Pause — hold the note longer than its value', kind: 'fermata', mark: { fermata: true } },
  { lv: 3, term: 'rit. (ritardando)', meaning: 'Gradually slowing down', kind: 'text', mark: { text: 'rit.' } },
  { lv: 3, term: 'accel. (accelerando)', meaning: 'Gradually speeding up', kind: 'text', mark: { text: 'accel.' } },
  { lv: 3, term: 'a tempo', meaning: 'Return to the original speed', kind: 'text', mark: { text: 'a tempo' } },
  { lv: 3, term: 'sfz (sforzando)', meaning: 'A sudden, strong accent on one note', kind: 'dyn', mark: { dyn: 'sfz' } },
  { lv: 3, term: 'Presto', meaning: 'Very fast', kind: 'tempo', mark: { tempo: 'Presto' } },
  { lv: 3, term: 'Moderato', meaning: 'At a moderate speed', kind: 'tempo', mark: { tempo: 'Moderato' } },
  // Level 4
  { lv: 4, term: 'Marcato (^)', meaning: 'Strongly marked — heavily accented', kind: 'art', mark: { art: ['marcato'] } },
  { lv: 4, term: 'fp (fortepiano)', meaning: 'Loud, then immediately soft', kind: 'dyn', mark: { dyn: 'fp' } },
  { lv: 4, term: 'rall. (rallentando)', meaning: 'Gradually slowing down (broadening)', kind: 'text', mark: { text: 'rall.' } },
  { lv: 4, term: 'dolce', meaning: 'Sweetly', kind: 'text', mark: { text: 'dolce' } },
  { lv: 4, term: 'cantabile', meaning: 'In a singing style', kind: 'text', mark: { text: 'cantabile' } },
  { lv: 4, term: 'rubato', meaning: 'Flexible tempo — push and pull the time expressively', kind: 'text', mark: { text: 'rubato' } },
  { lv: 4, term: 'pizz. (pizzicato)', meaning: 'Pluck the strings', kind: 'text', mark: { text: 'pizz.' } },
  { lv: 4, term: 'arco', meaning: 'Play with the bow (after pizzicato)', kind: 'text', mark: { text: 'arco' } },
  { lv: 4, term: 'Largo', meaning: 'Very slow and broad', kind: 'tempo', mark: { tempo: 'Largo' } },
  { lv: 4, term: 'Vivace', meaning: 'Lively and quick', kind: 'tempo', mark: { tempo: 'Vivace' } },
  // Level 5
  { lv: 5, term: 'subito p', meaning: 'Suddenly soft', kind: 'text', mark: { text: 'subito p' } },
  { lv: 5, term: 'sotto voce', meaning: 'In an undertone — very quietly, as if aside', kind: 'text', mark: { text: 'sotto voce' } },
  { lv: 5, term: 'morendo', meaning: 'Dying away (softer and usually slower)', kind: 'text', mark: { text: 'morendo' } },
  { lv: 5, term: 'con sord.', meaning: 'With a mute', kind: 'text', mark: { text: 'con sord.' } },
  { lv: 5, term: 'col legno', meaning: 'Strike or bow the strings with the wood of the bow', kind: 'text', mark: { text: 'col legno' } },
  { lv: 5, term: 'sul ponticello', meaning: 'Bow near the bridge — a glassy, metallic sound', kind: 'text', mark: { text: 'sul pont.' } },
  { lv: 5, term: 'attacca', meaning: 'Go straight on to the next section without a break', kind: 'text', mark: { text: 'attacca' } },
  { lv: 5, term: 'Sprechstimme', meaning: 'Half-spoken, half-sung voice (used by Schoenberg)', kind: 'text', mark: { text: 'Sprechstimme' } },
  { lv: 5, term: 'niente', meaning: 'To nothing — fade away to silence', kind: 'text', mark: { text: 'niente' } },
];

function phrase(term) {
  // Two bars of 4/4 in C major; the marking goes on the second event (or spans events 1–4 for hairpins and slurs).
  const pitches = shuffle([[0, 1, 2, 4], [4, 2, 1, 0], [0, 2, 4, 2], [2, 3, 4, 5]])[0];
  const n = (d) => fromDia(30 + 0 * 7 - 2 + d); // from C4 upwards (dia 28 = C4)
  const ev = (d, t = 12) => ({ t, notes: [n(d)] });
  const bars = [[ev(pitches[0]), ev(pitches[1]), ev(pitches[2]), ev(pitches[3])], [ev(pitches[2]), ev(pitches[1]), { t: 24, notes: [n(pitches[0])] }]];
  const at = term.kind === 'fermata' ? 6 : 1;
  const flat = bars.flat();
  const target = flat[at];
  Object.assign(target, term.mark.tempo ? {} : term.mark);
  if (term.mark.hair) { flat[1].hair = term.mark.hair; flat[4].hair = 'end'; }
  if (term.mark.slur) { flat[1].slur = 'start'; flat[3].slur = 'end'; }
  return { clef: 'treble', keySig: null, timeSig: [4, 4], tempo: term.mark.tempo, bars, highlight: { kind: term.kind, at } };
}

export const SCORE_TERMS_DRILL = {
  id: 'score-terms', title: 'Score-Reading Terms', stage: 'know', skills: ['theory', 'terminology'], kind: 'Score reading', verbs: ['Identify', 'Define'],
  blurb: 'Dynamics, articulation, tempo and expression markings in a real score context — from "p" to "Sprechstimme".',
  settings: [
    { key: 'mode', label: 'Task', options: [['meaning', 'What does the highlighted marking mean?'], ['term', 'Which marking means…?']] },
    { key: 'level', label: 'Terms', options: [['1', 'Level 1'], ['2', 'Up to level 2'], ['3', 'Up to level 3'], ['4', 'Up to level 4'], ['5', 'Up to level 5']] },
  ],
  defaults: { mode: 'meaning', level: '2' },
  levels: { 1: { level: '1' }, 2: { level: '2' }, 3: { level: '3' }, 4: { level: '4' }, 5: { level: '5' } },
  generate(s) {
    const max = Number(s.level);
    const pool = SCORE_TERMS.filter((t) => t.lv <= max);
    const fresh = pool.filter((t) => t.lv === max);
    const term = pick(Math.random() < 0.6 && fresh.length ? fresh : pool);
    const others = shuffle(pool.filter((t) => t !== term && t.meaning !== term.meaning));
    // prefer distractors of the same kind (dynamics with dynamics, tempo with tempo…)
    const sameKind = others.filter((t) => t.kind === term.kind || (['dyn', 'hair'].includes(t.kind) && ['dyn', 'hair'].includes(term.kind)));
    const distract = [...sameKind, ...others.filter((t) => !sameKind.includes(t))].slice(0, 3);
    const tags = [`Level|${term.lv}`, `Marking|${{ dyn: 'Dynamics', hair: 'Dynamics', art: 'Articulation', slur: 'Articulation', tempo: 'Tempo', text: 'Expression & technique', fermata: 'Tempo' }[term.kind]}`];
    if (s.mode === 'term') {
      const opts = shuffle([term, ...distract]).map((t) => ({ value: t.term, label: t.term }));
      return {
        prompt: `Which marking means: "${term.meaning}"?`,
        pad: 'choice', options: opts, tags,
        solution: term.term, check: (r) => r === term.term, answerText: term.term,
        explain: `${term.term} — ${term.meaning.toLowerCase()}.${distract[0] ? ` Compare: ${distract[0].term} — ${distract[0].meaning.toLowerCase()}.` : ''}`,
      };
    }
    const opts = shuffle([term, ...distract]).map((t) => ({ value: t.meaning, label: t.meaning }));
    return {
      prompt: 'What does the highlighted marking mean?',
      score: phrase(term), pad: 'choice', options: opts, tags,
      solution: term.meaning, check: (r) => r === term.meaning, answerText: term.meaning,
      explain: `${term.term}: ${term.meaning.toLowerCase()}.`,
    };
  },
};
