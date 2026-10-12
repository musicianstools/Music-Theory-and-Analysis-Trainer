// THEORY BANK — a large, levelled set of theory questions.
// Many families are computed from the music engine (keys, scale degrees, cadences), so answers are always correct.
// Every question has a level (beginner → exam), a category (topic) and an explanation; most options carry
// misconception feedback.
import { KEYS, parseNote, noteAbove, noteName, keyAccidentalNames } from '../../utils/music.js';
import { seededShuffle } from '../../utils/grade.js';

const IDS = 'abcdefgh';
let n = 0;
function q({ category, difficulty, prompt, correct, distractors, explanation, skills = ['theory', 'terminology'], terminology }) {
  const id = `tb-${String(++n).padStart(3, '0')}`;
  const seen = new Set([correct]);
  const ds = distractors.map((d) => (typeof d === 'string' ? { text: d } : d)).filter((d) => !seen.has(d.text) && seen.add(d.text)).slice(0, 3);
  const opts = seededShuffle([{ text: correct, ok: true }, ...ds], id);
  return {
    id, type: 'mcq', category, difficulty, skills, prompt, explanation, terminology,
    options: opts.map((o, i) => ({ id: IDS[i], text: o.text, feedback: o.feedback })),
    correctAnswer: IDS[opts.findIndex((o) => o.ok)],
  };
}
const ascii = (s) => s.replace('♯', '#').replace('♭', 'b');
const N = (s) => parseNote(ascii(s));
const MAJOR_STEPS = [['P', 1], ['M', 2], ['M', 3], ['P', 4], ['P', 5], ['M', 6], ['M', 7]];
const scaleOf = (tonic) => MAJOR_STEPS.map(([qq, num]) => noteName(noteAbove(N(tonic), qq, num)));
const level = (count) => (count <= 2 ? 'beginner' : count <= 4 ? 'developing' : 'confident');

const items = [];

// ---------- Time signatures (metre) ----------
const TS = [
  ['2/4', 'Simple duple', 'beginner'], ['3/4', 'Simple triple', 'beginner'], ['4/4', 'Simple quadruple', 'beginner'], ['2/2', 'Simple duple', 'developing'],
  ['3/8', 'Simple triple', 'developing'], ['3/2', 'Simple triple', 'confident'], ['6/8', 'Compound duple', 'developing'], ['9/8', 'Compound triple', 'developing'],
  ['12/8', 'Compound quadruple', 'developing'], ['6/4', 'Compound duple', 'confident'], ['5/4', 'Irregular (asymmetric)', 'confident'], ['7/8', 'Irregular (asymmetric)', 'confident'],
];
const TS_OPTS = ['Simple duple', 'Simple triple', 'Simple quadruple', 'Compound duple', 'Compound triple', 'Compound quadruple', 'Irregular (asymmetric)'];
TS.forEach(([sig, ans, diff]) => {
  const top = Number(sig.split('/')[0]);
  const compound = [6, 9, 12].includes(top);
  items.push(q({
    category: 'metre', difficulty: diff, prompt: `How is the time signature ${sig} classified?`, correct: ans,
    distractors: TS_OPTS.filter((o) => o !== ans).sort((a, b) => (a.split(' ')[1] === ans.split(' ')[1] ? -1 : 0) - (b.split(' ')[1] === ans.split(' ')[1] ? -1 : 0)).map((o) => ({ text: o, feedback: o.startsWith('Compound') && !compound ? `In ${sig} each beat divides into two, so it is simple, not compound.` : o.startsWith('Simple') && compound ? `When the top number is 6, 9 or 12, beats group into threes (dotted notes), so it is compound.` : undefined })),
    explanation: compound
      ? `${sig}: the top number ${top} means ${top / 3} dotted beats, each divided into three — ${ans.toLowerCase()}.`
      : top === 5 || top === 7 ? `${sig}: ${top} beats cannot be grouped evenly into twos or threes (e.g. 3+2 or 2+2+3), so the metre is irregular.`
        : `${sig}: ${top} beats per bar, each divided into two — ${ans.toLowerCase()}.`,
    terminology: ['metre', 'simple time', 'compound time'],
  }));
});

// ---------- Key signatures & relative keys ----------
KEYS.filter((k) => k.count > 0).forEach((k) => {
  const word = k.type === 'sharp' ? 'sharp' : 'flat';
  const ans = `${k.count} ${word}${k.count > 1 ? 's' : ''}`;
  const near = [k.count - 1, k.count + 1].filter((c) => c >= 1 && c <= 7).map((c) => `${c} ${word}${c > 1 ? 's' : ''}`);
  const other = `${k.count} ${k.type === 'sharp' ? 'flat' : 'sharp'}${k.count > 1 ? 's' : ''}`;
  items.push(q({
    category: 'keys', difficulty: level(k.count), prompt: `How many sharps or flats are in the key signature of ${k.major} major?`, correct: ans,
    distractors: [...near, { text: other, feedback: `Check the direction: ${k.type === 'sharp' ? 'sharp keys go clockwise round the circle of fifths (G, D, A…)' : 'flat keys go anticlockwise (F, B♭, E♭…)'}.` }],
    explanation: `${k.major} major has ${ans}: ${keyAccidentalNames(k).join(' ')}. ${k.type === 'sharp' ? 'Sharps are added in the order F C G D A E B; the key is a semitone above the last sharp.' : 'Flats are added in the order B E A D G C F; the key is the second-last flat.'}`,
    skills: ['theory'],
  }));
});
KEYS.forEach((k) => {
  const others = KEYS.filter((x) => x !== k);
  items.push(q({
    category: 'keys', difficulty: level(k.count), prompt: `What is the relative minor of ${k.major} major?`, correct: `${k.minor} minor`,
    distractors: [
      { text: `${k.major} minor`, feedback: `${k.major} minor is the tonic (parallel) minor — it has the same tonic, not the same key signature.` },
      ...others.filter((x) => Math.abs(x.count - k.count) <= 1).map((x) => ({ text: `${x.minor} minor`, feedback: `${x.minor} minor is the relative minor of ${x.major} major.` })),
    ],
    explanation: `Relative keys share a key signature. The relative minor starts on the 6th degree of the major scale — three semitones below the tonic: ${k.major} → ${k.minor}.`,
  }));
  items.push(q({
    category: 'keys', difficulty: k.count <= 2 ? 'developing' : 'confident', prompt: `What is the relative major of ${k.minor} minor?`, correct: `${k.major} major`,
    distractors: [
      { text: `${k.minor} major`, feedback: `${k.minor} major is the tonic (parallel) major, not the relative major.` },
      ...others.filter((x) => Math.abs(x.count - k.count) <= 1).map((x) => ({ text: `${x.major} major`, feedback: `${x.major} major is the relative major of ${x.minor} minor.` })),
    ],
    explanation: `The relative major is three semitones (a minor 3rd) above the minor tonic: ${k.minor} → ${k.major}. Both share ${k.count ? `${k.count} ${k.type}${k.count > 1 ? 's' : ''}` : 'no sharps or flats'}.`,
  }));
});

// ---------- Scale degrees ----------
const DEGREES = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading note'];
DEGREES.forEach((name, i) => {
  items.push(q({
    category: 'scale-degrees', difficulty: i === 0 || i === 4 ? 'beginner' : 'developing', prompt: `What is the technical name for degree ${i + 1} of a major scale?`, correct: name,
    distractors: DEGREES.filter((d) => d !== name).sort(() => 0).slice(i % 3, (i % 3) + 4),
    explanation: `Degrees 1–7: tonic, supertonic, mediant, subdominant, dominant, submediant, leading note. The ${name.toLowerCase()} is degree ${i + 1}.${i === 6 ? ' In the natural minor, the lowered 7th is called the subtonic.' : ''}`,
  }));
});
['C', 'G', 'D', 'A', 'E', 'F', 'B♭', 'E♭', 'A♭', 'B', 'D♭', 'F♯'].forEach((t) => {
  const sc = scaleOf(t);
  const count = KEYS.find((k) => k.major === t).count;
  [[4, 'dominant'], [3, 'subdominant'], [6, 'leading note'], [5, 'submediant']].forEach(([deg, word], j) => {
    if (j > 1 && count > 4) return;
    items.push(q({
      category: 'scale-degrees', difficulty: count <= 1 ? 'beginner' : count <= 3 ? 'developing' : 'confident',
      prompt: `What is the ${word} of ${t} major?`, correct: sc[deg],
      distractors: sc.filter((x, i) => i !== deg && i !== 0).map((x) => ({ text: x, feedback: `${x} is degree ${sc.indexOf(x) + 1} (the ${DEGREES[sc.indexOf(x)].toLowerCase()}).` })),
      explanation: `${t} major: ${sc.join(' – ')}. The ${word} is degree ${deg + 1}: ${sc[deg]}.`,
      skills: ['theory'],
    }));
  });
});

// ---------- Cadences in keys ----------
['C', 'G', 'D', 'F', 'B♭', 'A', 'E♭', 'E'].forEach((t, i) => {
  const sc = scaleOf(t);
  const I = sc[0], IV = sc[3], V = sc[4], vi = sc[5] + 'm';
  const type = ['perfect', 'plagal', 'imperfect', 'interrupted'][i % 4];
  const ans = { perfect: `${V} – ${I}`, plagal: `${IV} – ${I}`, imperfect: `${I} – ${V}`, interrupted: `${V} – ${vi}` }[type];
  const all = { perfect: `${V} – ${I}`, plagal: `${IV} – ${I}`, imperfect: `${I} – ${V}`, interrupted: `${V} – ${vi}` };
  items.push(q({
    category: 'cadences', difficulty: i < 4 ? 'developing' : 'confident', prompt: `In ${t} major, which chords form ${type === 'imperfect' ? 'an' : 'a'} ${type} cadence?`, correct: ans,
    distractors: Object.entries(all).filter(([k]) => k !== type).map(([k, v]) => ({ text: v, feedback: `${v} is ${k === 'imperfect' || k === 'interrupted' ? 'an' : 'a'} ${k} cadence.` })),
    explanation: `In ${t} major, I = ${I}, IV = ${IV}, V = ${V}, vi = ${vi}. Perfect V–I, plagal IV–I, imperfect ends on V, interrupted V–vi.`,
  }));
});

// ---------- Note values ----------
const NV = [
  ['semibreve (whole note)', '4 beats', 'beginner'], ['minim (half note)', '2 beats', 'beginner'], ['crotchet (quarter note)', '1 beat', 'beginner'],
  ['quaver (eighth note)', '½ a beat', 'beginner'], ['semiquaver (sixteenth note)', '¼ of a beat', 'developing'], ['dotted minim', '3 beats', 'developing'],
  ['dotted crotchet', '1½ beats', 'developing'], ['dotted quaver', '¾ of a beat', 'confident'],
];
const NV_OPTS = ['4 beats', '3 beats', '2 beats', '1½ beats', '1 beat', '¾ of a beat', '½ a beat', '¼ of a beat'];
NV.forEach(([name, ans, diff]) => items.push(q({
  category: 'note-values', difficulty: diff, prompt: `In 4/4 time (crotchet beat), how long does a ${name} last?`, correct: ans,
  distractors: NV_OPTS.filter((o) => o !== ans).sort((a, b) => Math.abs(NV_OPTS.indexOf(a) - NV_OPTS.indexOf(ans)) - Math.abs(NV_OPTS.indexOf(b) - NV_OPTS.indexOf(ans))),
  explanation: `${name[0].toUpperCase() + name.slice(1)} = ${ans}. A dot adds half the note's value again (a dotted crotchet = 1 + ½).`,
  skills: ['theory'],
})));
items.push(q({ category: 'note-values', difficulty: 'developing', prompt: 'How many quavers fit in a dotted minim?', correct: '6', distractors: ['4', '3', '8'], explanation: 'A dotted minim = 3 crotchet beats = 6 quavers.', skills: ['theory'] }));
items.push(q({ category: 'note-values', difficulty: 'confident', prompt: 'A crotchet triplet fits three crotchets into the time of…', correct: 'Two crotchets (a minim)', distractors: ['Three crotchets', 'One crotchet', 'Four crotchets'], explanation: 'A triplet fits three notes into the time normally taken by two of the same value.', skills: ['theory'] }));
items.push(q({ category: 'note-values', difficulty: 'confident', prompt: 'What is an anacrusis?', correct: 'An upbeat (pick-up) before the first full bar', distractors: [{ text: 'A note held across the bar line', feedback: 'That is a tie or syncopation.' }, 'A pause at the end of a phrase', 'A rest lasting a whole bar'], explanation: 'An anacrusis (pick-up / upbeat) is one or more notes before the first strong beat. The final bar is usually shortened to balance it.' }));

// ---------- Enharmonic equivalents ----------
[['C♯', 'D♭', 'developing'], ['D♯', 'E♭', 'developing'], ['F♯', 'G♭', 'beginner'], ['G♯', 'A♭', 'developing'], ['A♯', 'B♭', 'beginner'],
  ['E♯', 'F', 'confident'], ['B♯', 'C', 'confident'], ['F♭', 'E', 'confident'], ['C♭', 'B', 'confident']].forEach(([a, b, diff]) => {
  const pool = ['C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'].filter((x) => x !== a && x !== b);
  const idx = pool.findIndex((x) => x[0] === b[0]);
  items.push(q({
    category: 'enharmonics', difficulty: diff, prompt: `Which note is enharmonically equivalent to ${a}?`, correct: b,
    distractors: pool.slice(Math.max(0, idx - 2), idx + 2),
    explanation: `${a} and ${b} sound the same pitch but are spelled differently. The spelling depends on the key and the function of the note.`,
  }));
});

// ---------- Italian & performance terms ----------
const TERMS = [
  ['Pizzicato', 'Plucked (on a string instrument)', 'beginner'], ['Arco', 'Played with the bow', 'developing'], ['A cappella', 'Voices with no instrumental accompaniment', 'beginner'],
  ['Tutti', 'Everyone plays (the whole ensemble)', 'beginner'], ['Dolce', 'Sweetly', 'developing'], ['Cantabile', 'In a singing style', 'developing'],
  ['Espressivo', 'Expressively', 'developing'], ['Sostenuto', 'Sustained', 'developing'], ['Marcato', 'Marked, strongly accented', 'developing'],
  ['Sforzando (sfz)', 'A sudden, strong accent', 'developing'], ['Subito', 'Suddenly', 'confident'], ['Poco a poco', 'Little by little', 'confident'],
  ['Morendo', 'Dying away', 'confident'], ['Ritenuto', 'Held back — immediately slower', 'confident'], ['Meno mosso', 'Less movement — slower', 'confident'],
  ['Più mosso', 'More movement — faster', 'confident'], ['Con sordino', 'With a mute', 'confident'], ['Glissando', 'A slide between two pitches', 'developing'],
  ['Vibrato', 'A slight, regular wavering of pitch for warmth', 'developing'], ['Tremolo', 'Rapid repetition of a note (or alternation between notes)', 'developing'],
  ['D.C. al Fine', 'Go back to the beginning and play until "Fine"', 'confident'], ['Tenuto', 'Held for its full value, slightly stressed', 'developing'],
  ['Divisi', 'A section splits to play separate parts', 'exam'], ['Col legno', 'Played with the wood of the bow', 'exam'], ['Sul ponticello', 'Bowed near the bridge, giving a glassy tone', 'exam'],
];
TERMS.forEach(([term, def, diff], i) => items.push(q({
  category: 'terms', difficulty: diff, prompt: `What does "${term}" mean?`, correct: def,
  distractors: [1, 5, 9, 13].map((o) => TERMS[(i + o) % TERMS.length][1]),
  explanation: `${term}: ${def.toLowerCase()}.`,
})));

// ---------- Instruments & voices ----------
const FAMS = ['Woodwind', 'Brass', 'Strings', 'Percussion'];
[['Oboe', 'Woodwind', 'beginner', 'A double-reed woodwind instrument.'], ['Clarinet', 'Woodwind', 'beginner', 'A single-reed woodwind instrument.'], ['Flute', 'Woodwind', 'developing', 'Made of metal, but a woodwind: the sound comes from air across an edge, not lip vibration.'],
  ['Bassoon', 'Woodwind', 'developing', 'The bass double-reed woodwind.'], ['Saxophone', 'Woodwind', 'confident', 'Made of brass, but a woodwind: it uses a single reed.'], ['Trumpet', 'Brass', 'beginner', 'Sound comes from the player\'s lips buzzing in a mouthpiece.'],
  ['French horn', 'Brass', 'developing', 'A brass instrument with a coiled tube and a mellow tone.'], ['Trombone', 'Brass', 'beginner', 'A brass instrument that changes pitch with a slide.'], ['Tuba', 'Brass', 'beginner', 'The lowest standard brass instrument.'],
  ['Cello', 'Strings', 'beginner', 'A bowed string instrument between viola and double bass.'], ['Harp', 'Strings', 'developing', 'A plucked string instrument.'], ['Double bass', 'Strings', 'beginner', 'The lowest bowed string instrument.'],
  ['Timpani', 'Percussion', 'developing', 'Tuned percussion — kettle drums that play definite pitches.'], ['Xylophone', 'Percussion', 'developing', 'Tuned percussion with wooden bars.'], ['Snare drum', 'Percussion', 'beginner', 'Untuned percussion.'],
].forEach(([inst, fam, diff, why]) => items.push(q({
  category: 'instruments', difficulty: diff, prompt: `Which instrument family does the ${inst.toLowerCase()} belong to?`, correct: fam,
  distractors: FAMS.filter((f) => f !== fam).map((f) => ({ text: f, feedback: inst === 'Saxophone' && f === 'Brass' ? 'It is made of brass, but family depends on how the sound is made — the saxophone uses a reed.' : inst === 'Flute' && f === 'Brass' ? 'Material does not decide the family; the flute has no buzzing lips.' : undefined })),
  explanation: why, skills: ['theory', 'terminology'],
})));
items.push({ id: `tb-${String(++n).padStart(3, '0')}`, type: 'order', category: 'voices', difficulty: 'beginner', skills: ['theory', 'terminology'], prompt: 'Arrange these voice types from highest to lowest.', items: ['Soprano', 'Mezzo-soprano', 'Alto', 'Tenor', 'Baritone', 'Bass'].map((v) => ({ id: v, text: v })), correctOrder: ['Soprano', 'Mezzo-soprano', 'Alto', 'Tenor', 'Baritone', 'Bass'], explanation: 'Soprano → mezzo-soprano → alto (contralto) → tenor → baritone → bass.' });
items.push(q({ category: 'voices', difficulty: 'confident', prompt: 'A male singer performing in the alto range, usually in head voice or falsetto, is called a…', correct: 'Countertenor', distractors: ['Baritone', 'Tenor', 'Bass-baritone'], explanation: 'A countertenor sings in the alto (sometimes mezzo) range, usually using falsetto/head voice.' }));
items.push(q({ category: 'voices', difficulty: 'developing', prompt: 'SATB stands for…', correct: 'Soprano, Alto, Tenor, Bass', distractors: ['Strings, Alto, Trumpet, Bass', 'Soprano, Alto, Treble, Baritone', 'Solo, Accompaniment, Tutti, Bass'], explanation: 'SATB is the standard four-part choir: soprano, alto, tenor, bass.' }));

// ---------- Form & structure ----------
[
  ['beginner', 'What is strophic form?', 'The same music is repeated for every verse', ['New music for every section', 'Two contrasting sections, A and B', 'A main theme returning between contrasting episodes'], 'Strophic form (AAA…) repeats the same music for each verse, as in many hymns and folk songs.'],
  ['developing', 'What is through-composed form?', 'New music throughout, with little or no repetition of sections', ['The same music for every verse', 'Verse–chorus alternation', 'ABA with a return'], 'Through-composed music keeps moving to new material, often following a story in the lyrics.'],
  ['developing', 'Which pattern describes rondo form?', 'ABACA', ['ABA', 'AABA', 'AB'], 'Rondo: a main theme (A) keeps returning between contrasting episodes (B, C…).'],
  ['developing', 'What is 32-bar song form?', 'AABA — four 8-bar sections, with a contrasting bridge (B)', ['ABACA', 'Twelve bars repeated with a fixed chord pattern', 'Verse–chorus with a pre-chorus'], 'AABA (32-bar) form was standard in jazz standards and Tin Pan Alley songs; the B section is the bridge or middle eight.'],
  ['confident', 'Which chord pattern is the standard 12-bar blues?', 'I I I I | IV IV I I | V IV I I', ['I IV V I | I IV V I | I IV V I', 'I V vi IV repeated three times', 'ii V I repeated four times'], 'The 12-bar blues uses three four-bar phrases over I, IV and V.'],
  ['developing', 'In verse–chorus form, which section usually has the same lyrics each time?', 'The chorus', ['The verse', 'The bridge', 'The intro'], 'Verses change their lyrics; the chorus usually repeats words and music, making it the "hook".'],
  ['developing', 'What is the usual function of a bridge (middle eight) in a pop song?', 'To provide contrast, often once, before the final chorus', ['To introduce the song', 'To repeat the chorus quietly', 'To end the song'], 'The bridge brings new material — often new harmony or texture — so the return of the chorus feels fresh.'],
  ['confident', 'What is theme and variations form?', 'A theme is stated, then repeated with changes each time', ['Two themes alternate', 'Each section introduces new material', 'A theme returns between episodes'], 'Variations can change melody, harmony, rhythm, tempo, texture or tonality while keeping the theme recognisable.'],
  ['exam', 'What are the three main sections of sonata form?', 'Exposition, development, recapitulation', ['Verse, chorus, bridge', 'Introduction, theme, coda', 'Statement, episode, return'], 'Sonata form: themes are presented (exposition), explored and transformed (development), then return (recapitulation), often followed by a coda.'],
  ['beginner', 'What is a coda?', 'A closing section that ends a piece', ['An opening section', 'A repeated chorus', 'A key change'], 'Coda (Italian "tail") or outro: the final section, rounding the piece off.'],
].forEach(([diff, prompt, correct, ds, expl]) => items.push(q({ category: 'form', difficulty: diff, prompt, correct, distractors: ds, explanation: expl })));

// ---------- Melody ----------
[
  ['beginner', 'A melody that moves mostly by step is described as…', 'Conjunct', ['Disjunct', 'Chromatic', 'Syncopated'], 'Conjunct = stepwise; disjunct = with leaps.'],
  ['beginner', 'A melody with many large leaps is described as…', 'Disjunct', ['Conjunct', 'Diatonic', 'Legato'], 'Disjunct melodies leap; they can sound dramatic, unsettled or energetic depending on context.'],
  ['developing', 'Repeating a melodic idea at a higher or lower pitch is called…', 'A sequence', ['An ostinato', 'An inversion', 'A cadence'], 'A sequence repeats a phrase on successive pitch levels — often used to build intensity.'],
  ['developing', 'A short, recognisable musical idea that is developed through a piece is a…', 'Motif', ['Coda', 'Cadence', 'Pedal'], 'Motifs (like the four-note opening of Beethoven\'s Fifth) give a piece unity.'],
  ['confident', 'Playing a melody upside down (rising intervals become falling) is called…', 'Inversion', ['Retrograde', 'Augmentation', 'Diminution'], 'Melodic inversion flips the direction of each interval. Retrograde plays it backwards; augmentation lengthens note values; diminution shortens them.'],
  ['confident', 'Playing a melody with all its note values doubled is called…', 'Augmentation', ['Diminution', 'Retrograde', 'Inversion'], 'Augmentation lengthens note values (often doubling them); diminution shortens them.'],
  ['developing', 'A secondary melody played at the same time as the main melody is a…', 'Countermelody', ['Ostinato', 'Drone', 'Riff'], 'A countermelody adds a second, independent line — creating polyphony.'],
  ['developing', 'When music imitates the meaning of a word (e.g. a rising line on "heaven"), it is called…', 'Word painting', ['Melisma', 'Syllabic setting', 'Sequence'], 'Word painting (text painting) makes the music depict the lyrics.'],
].forEach(([diff, prompt, correct, ds, expl]) => items.push(q({ category: 'melody', difficulty: diff, prompt, correct, distractors: ds, explanation: expl })));

// ---------- Advanced harmony (confident / exam) ----------
[
  ['exam', 'A piece in a minor key ends on a MAJOR tonic chord. What is this called?', 'Tierce de Picardie (Picardy third)', ['Plagal cadence', 'Interrupted cadence', 'Neapolitan sixth'], 'The Picardy third raises the third of the final tonic chord, ending a minor-key piece with unexpected brightness.'],
  ['exam', 'What is a Neapolitan sixth chord?', 'A major chord on the flattened 2nd degree, usually in first inversion', ['A minor chord on the 6th degree', 'A dominant seventh in second inversion', 'A chord containing an augmented sixth'], 'In C minor the Neapolitan is D♭ major (♭II), usually as ♭II6, leading to V.'],
  ['exam', 'In C major, a D major chord leading to G major is best described as…', 'A secondary dominant (V of V)', ['A Neapolitan chord', 'A pivot chord', 'A plagal cadence'], 'D major contains F♯ — the leading note of G — so it acts as the dominant of the dominant (V/V).'],
  ['confident', 'A note is held over from one chord into the next, clashes, then resolves down by step. This is a…', 'Suspension', ['Passing note', 'Pedal point', 'Appoggiatura'], 'A suspension has three stages: preparation, suspension (the clash) and resolution — e.g. a 4–3 suspension.'],
  ['confident', 'What is the difference between a passing note and an auxiliary note?', 'A passing note moves by step between two different chord notes; an auxiliary note steps away and back to the same note', ['They are the same thing', 'A passing note is always chromatic', 'An auxiliary note always leaps'], 'Both are non-chord (non-harmony) notes approached and left by step.'],
  ['exam', 'A chord progression whose roots fall by fifths (e.g. vi – ii – V – I) is called…', 'A circle-of-fifths progression', ['A plagal progression', 'A chromatic progression', 'A pedal progression'], 'Falling fifths create strong forward motion towards the tonic.'],
  ['exam', 'When modulating, a chord that belongs to both the old and new key is called a…', 'Pivot chord', ['Pedal chord', 'Passing chord', 'Neapolitan chord'], 'A pivot (common) chord smooths a modulation by belonging to both keys.'],
  ['confident', 'What is the most common modulation from a major key?', 'To the dominant (e.g. C major → G major)', ['To the tonic minor', 'To the key a tritone away', 'To the Neapolitan'], 'Moving to the dominant (one more sharp / one fewer flat) is the most closely related modulation; the relative minor is also very common.'],
  ['confident', 'The progression Ic – V – I uses which chord?', 'A cadential six-four (second-inversion tonic before V)', ['A Neapolitan sixth', 'A diminished seventh', 'A secondary dominant'], 'The cadential 6/4 (Ic) delays V, strengthening the perfect cadence.'],
  ['exam', 'Which chord is built entirely from stacked minor thirds, dividing the octave equally?', 'Diminished seventh', ['Half-diminished seventh', 'Dominant seventh', 'Augmented triad'], 'Because the diminished seventh is symmetrical, it can resolve to many keys — useful for modulation and suspense.'],
  ['confident', 'A "blue note" in blues and jazz is…', 'A flattened 3rd, 5th or 7th degree, often bent', ['A note played on a blue-coloured instrument', 'A sustained bass note', 'A note in the bridge only'], 'Blue notes are expressive, slightly flattened scale degrees.'],
  ['developing', 'What does "diatonic" mean?', 'Using only the notes of the current key', ['Using notes outside the key', 'Using only five notes', 'Moving only by step'], 'Diatonic notes belong to the key; chromatic notes are outside it.'],
  ['exam', 'Two different metres played at the same time (e.g. 3/4 against 4/4) is called…', 'Polymetre', ['Hemiola', 'Syncopation', 'Rubato'], 'Polymetre layers different metres; polyrhythm layers conflicting rhythmic groupings (e.g. 3 against 2).'],
  ['confident', 'Which figured-bass symbol shows a triad in first inversion?', '6 (6/3)', ['5/3', '6/4', '7'], 'Root position 5/3, first inversion 6/3 (written 6), second inversion 6/4.'],
].forEach(([diff, prompt, correct, ds, expl]) => items.push(q({ category: 'harmony', difficulty: diff, prompt, correct, distractors: ds, explanation: expl })));


// ---------- Interval inversion & compound intervals ----------
[['Major 2nd', 'Minor 7th'], ['Minor 3rd', 'Major 6th'], ['Major 3rd', 'Minor 6th'], ['Perfect 4th', 'Perfect 5th'], ['Perfect 5th', 'Perfect 4th'],
  ['Major 6th', 'Minor 3rd'], ['Minor 7th', 'Major 2nd'], ['Augmented 4th', 'Diminished 5th']].forEach(([a, b]) => {
  const all = ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Augmented 4th', 'Diminished 5th', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th'];
  const flip = b.replace(/^Major/, 'X').replace(/^Minor/, 'Major').replace(/^X/, 'Minor');
  items.push(q({
    category: 'intervals', difficulty: 'confident', prompt: `When a ${a.toLowerCase()} is inverted, what interval does it become?`, correct: b,
    distractors: [{ text: flip !== b ? flip : all[(all.indexOf(b) + 1) % all.length], feedback: 'Inversion swaps major ↔ minor and augmented ↔ diminished; perfect stays perfect.' }, a, all[(all.indexOf(b) + 2) % all.length]],
    explanation: `Inverting an interval: the numbers add up to 9 (${a.split(' ')[1]} + ${b.split(' ')[1]}), major ↔ minor, augmented ↔ diminished, perfect stays perfect.`,
  }));
});
[['Major 9th', 'Major 2nd'], ['Minor 10th', 'Minor 3rd'], ['Perfect 11th', 'Perfect 4th'], ['Perfect 12th', 'Perfect 5th'], ['Major 13th', 'Major 6th']].forEach(([c, simple]) => {
  items.push(q({
    category: 'intervals', difficulty: 'exam', prompt: `A ${c.toLowerCase()} is a compound interval. Which simple interval plus an octave is it?`, correct: `${simple} + an octave`,
    distractors: ['Major 2nd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 7th'].filter((x) => x !== simple).slice(0, 3).map((x) => `${x} + an octave`),
    explanation: `Subtract 7 from the number to find the simple interval: ${c.split(' ')[1].replace(/th|rd|nd/, '')} − 7 = ${simple.split(' ')[1]}. The quality stays the same.`,
  }));
});

// ---------- Diatonic chords in keys (Roman numerals) ----------
const DEG_CHORDS = [[1, 'ii', 'minor'], [2, 'iii', 'minor'], [5, 'vi', 'minor'], [6, 'vii°', 'diminished'], [3, 'IV', 'major'], [4, 'V', 'major']];
['D', 'B♭', 'A', 'E♭', 'E', 'A♭'].forEach((t) => {
  const sc = scaleOf(t);
  const count = KEYS.find((k) => k.major === t).count;
  DEG_CHORDS.forEach(([deg, roman, qual], j) => {
    if (j >= 4 && count < 3) return;
    const ans = `${sc[deg]} ${qual}`;
    items.push(q({
      category: 'chords', difficulty: count >= 3 ? 'exam' : 'confident', prompt: `What is chord ${roman} in ${t} major?`, correct: ans,
      distractors: [
        { text: `${sc[deg]} ${qual === 'major' ? 'minor' : 'major'}`, feedback: `Right root, wrong quality. In a major key: I, IV, V are major; ii, iii, vi are minor; vii° is diminished.` },
        { text: `${sc[(deg + 1) % 7]} ${qual}`, feedback: `That is built on degree ${((deg + 1) % 7) + 1}, not degree ${deg + 1}.` },
        { text: `${sc[(deg + 6) % 7]} ${qual}`, feedback: `That is built on degree ${((deg + 6) % 7) + 1}, not degree ${deg + 1}.` },
      ],
      explanation: `${t} major: ${sc.join(' – ')}. Chord ${roman} is built on degree ${deg + 1} (${sc[deg]}) and is ${qual} — capital numerals are major, lower-case minor, ° diminished.`,
    }));
  });
});

// ---------- Transposing instruments ----------
[
  ['A B♭ clarinet plays a written C. Which concert pitch sounds?', 'B♭ (a major 2nd lower)', ['C (no change)', 'D (a major 2nd higher)', 'E♭ (a minor 3rd higher)'], 'B♭ instruments (clarinet, trumpet, tenor sax) sound a major 2nd lower than written.'],
  ['A horn in F plays a written C. Which concert pitch sounds?', 'F (a perfect 5th lower)', ['C (no change)', 'G (a perfect 5th higher)', 'B♭ (a major 2nd lower)'], 'The French horn in F sounds a perfect 5th lower than written.'],
  ['An alto saxophone (in E♭) plays a written C. Which concert pitch sounds?', 'E♭ (a major 6th lower)', ['C (no change)', 'B♭ (a major 2nd lower)', 'A (a minor 3rd lower)'], 'E♭ alto saxophone sounds a major 6th lower than written.'],
].forEach(([prompt, correct, ds, expl]) => items.push(q({ category: 'transposition', difficulty: 'exam', prompt, correct, distractors: ds, explanation: expl })));

export const theoryBank = items;
