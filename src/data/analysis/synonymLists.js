// SYNONYM LISTS — "List as many musical or analytical synonyms as you can for…".
// `accepted` is the word bank students are matched against (inflections are handled: conveys / convey / conveyed).
// `note` explains a distinction worth knowing. Add words freely — the check is a list match, not a dictionary.

const base = { type: 'synlist', category: 'synonyms', skills: ['terminology', 'effect'] };

export const synonymListQuestions = ([
  { ...base, id: 'synl-001', difficulty: 'beginner', word: 'shows', target: 6, kind: 'analytical',
    example: 'The falling melody ___ the speaker\'s grief.',
    accepted: ['presents', 'conveys', 'portrays', 'depicts', 'reveals', 'suggests', 'communicates', 'expresses', 'emphasises', 'highlights', 'reflects', 'illustrates', 'demonstrates', 'represents', 'evokes', 'captures', 'signals', 'implies', 'establishes', 'reinforces', 'characterises', 'symbolises', 'constructs', 'underscores', 'mirrors', 'embodies', 'exposes', 'accentuates', 'foregrounds', 'indicates', 'articulates', 'dramatises', 'enacts'],
    note: 'These are not all interchangeable: "depicts" suits concrete images (word painting), "reinforces" needs an idea that already exists, "suggests" is tentative, "establishes" suits openings.' },
  { ...base, id: 'synl-002', difficulty: 'beginner', word: 'makes (as in "makes the listener feel…")', target: 5, kind: 'analytical',
    example: 'The sudden crescendo ___ a sense of panic.',
    accepted: ['creates', 'generates', 'produces', 'evokes', 'establishes', 'builds', 'elicits', 'instils', 'fosters', 'cultivates', 'conjures', 'induces', 'provokes', 'constructs', 'crafts', 'arouses', 'sparks', 'triggers', 'heightens', 'intensifies', 'stirs'],
    note: '"Evokes" and "conjures" suit memories and images; "induces" and "provokes" suit physical or strong reactions; "fosters" and "cultivates" suit feelings that grow over time.' },
  { ...base, id: 'synl-003', difficulty: 'beginner', word: 'uses', target: 4, kind: 'analytical',
    example: 'The composer ___ a repeated bass riff.',
    accepted: ['employs', 'utilises', 'features', 'incorporates', 'draws on', 'deploys', 'harnesses', 'exploits', 'relies on', 'introduces', 'adopts', 'applies', 'includes', 'layers', 'integrates', 'showcases', 'implements', 'makes use of'],
    note: 'Better still: replace "uses X" with what X does — "a repeated bass riff anchors…".' },
  { ...base, id: 'synl-004', difficulty: 'developing', word: 'changes (verb)', target: 5, kind: 'analytical',
    example: 'The texture ___ in the final chorus.',
    accepted: ['shifts', 'transforms', 'develops', 'evolves', 'alters', 'transitions', 'modulates', 'morphs', 'varies', 'turns', 'moves', 'mutates', 'progresses', 'builds', 'contrasts', 'thickens', 'thins', 'intensifies', 'dissolves', 'expands', 'contracts', 'pivots'],
    note: '"Modulates" is only for a change of key. "Thickens", "thins", "intensifies" name the direction of change — more precise than "changes".' },
  { ...base, id: 'synl-005', difficulty: 'beginner', word: 'loud', target: 5, kind: 'musical',
    example: 'The chorus is ___.',
    accepted: ['forte', 'fortissimo', 'fortississimo', 'mezzo forte', 'f', 'ff', 'fff', 'mf', 'powerful', 'booming', 'thunderous', 'intense', 'resounding', 'strong', 'heavy', 'blaring', 'emphatic', 'full', 'full-bodied', 'bold', 'forceful', 'sforzando', 'deafening', 'roaring', 'clamorous'],
    note: 'Use the Italian dynamic (forte, fortissimo) for precision, then a descriptive word for effect. "Sforzando" is a sudden accent rather than general loudness.' },
  { ...base, id: 'synl-006', difficulty: 'beginner', word: 'quiet / soft', target: 5, kind: 'musical',
    example: 'The opening verse is ___.',
    accepted: ['piano', 'pianissimo', 'pianississimo', 'mezzo piano', 'p', 'pp', 'ppp', 'mp', 'hushed', 'subdued', 'restrained', 'gentle', 'delicate', 'muted', 'faint', 'understated', 'sotto voce', 'intimate', 'whispered', 'tender', 'calm', 'reserved', 'murmured'],
    note: '"Restrained" and "subdued" suggest holding back — useful for arguments about suppressed emotion.' },
  { ...base, id: 'synl-007', difficulty: 'beginner', word: 'gets louder', target: 4, kind: 'musical',
    example: 'The music ___ into the chorus.',
    accepted: ['crescendo', 'crescendos', 'swells', 'builds', 'intensifies', 'grows', 'rises', 'climbs', 'escalates', 'surges', 'amplifies', 'heightens', 'mounts', 'expands', 'erupts', 'cresc'],
    note: '"Crescendo" is gradual; "erupts" or "surges" suggest something sudden — say which it is.' },
  { ...base, id: 'synl-008', difficulty: 'developing', word: 'gets softer', target: 4, kind: 'musical',
    example: 'The final phrase ___.',
    accepted: ['diminuendo', 'decrescendo', 'dim', 'decresc', 'fades', 'recedes', 'subsides', 'softens', 'dies away', 'dwindles', 'ebbs', 'morendo', 'calando', 'retreats', 'withdraws', 'diminishes', 'falls away', 'evaporates'],
    note: '"Morendo" (dying away) and "calando" usually also involve slowing down.' },
  { ...base, id: 'synl-009', difficulty: 'beginner', word: 'fast', target: 5, kind: 'musical',
    example: 'The tempo is ___.',
    accepted: ['allegro', 'presto', 'vivace', 'prestissimo', 'allegretto', 'molto allegro', 'quick', 'rapid', 'brisk', 'lively', 'driving', 'energetic', 'hurried', 'frantic', 'propulsive', 'up-tempo', 'urgent', 'racing', 'swift', 'breakneck', 'frenetic'],
    note: '"Allegretto" is only moderately fast. "Frantic" and "hurried" add meaning (panic, pressure); "lively" and "brisk" are neutral.' },
  { ...base, id: 'synl-010', difficulty: 'beginner', word: 'slow', target: 5, kind: 'musical',
    example: 'The tempo is ___.',
    accepted: ['adagio', 'largo', 'lento', 'grave', 'larghetto', 'andante', 'adagietto', 'unhurried', 'leisurely', 'sluggish', 'languid', 'measured', 'plodding', 'steady', 'stately', 'dragging', 'sedate', 'lethargic', 'relaxed'],
    note: '"Andante" is a walking pace — moderately slow. "Plodding" and "dragging" carry negative meaning; "stately" and "measured" suggest dignity.' },
  { ...base, id: 'synl-011', difficulty: 'developing', word: 'smooth (articulation)', target: 4, kind: 'musical',
    example: 'The violin line is ___.',
    accepted: ['legato', 'flowing', 'connected', 'slurred', 'seamless', 'sostenuto', 'lyrical', 'cantabile', 'sustained', 'fluid', 'singing', 'unbroken', 'graceful', 'gliding', 'portamento', 'glissando'],
    note: '"Portamento" and "glissando" are slides between notes — smooth, but a specific technique.' },
  { ...base, id: 'synl-012', difficulty: 'developing', word: 'short and detached', target: 4, kind: 'musical',
    example: 'The piano chords are ___.',
    accepted: ['staccato', 'staccatissimo', 'clipped', 'crisp', 'spiky', 'choppy', 'punchy', 'pointed', 'separated', 'pizzicato', 'marcato', 'stabbing', 'jagged', 'percussive', 'abrupt'],
    note: '"Pizzicato" is plucked strings specifically; "marcato" means marked/accented, often also detached.' },
  { ...base, id: 'synl-013', difficulty: 'developing', word: 'thick (texture)', target: 4, kind: 'musical',
    example: 'The texture in the final chorus is ___.',
    accepted: ['dense', 'full', 'layered', 'rich', 'heavy', 'polyphonic', 'contrapuntal', 'saturated', 'lush', 'busy', 'complex', 'orchestral', 'expansive', 'multi-layered', 'textured', 'crowded', 'homophonic', 'tutti'],
    note: '"Polyphonic" means independent lines, not just many instruments — a thick texture can also be homophonic (chordal). Use the term that is accurate.' },
  { ...base, id: 'synl-014', difficulty: 'developing', word: 'thin (texture)', target: 4, kind: 'musical',
    example: 'The texture in the bridge is ___.',
    accepted: ['sparse', 'bare', 'exposed', 'light', 'transparent', 'minimal', 'stripped-back', 'stripped back', 'monophonic', 'open', 'skeletal', 'delicate', 'pared-back', 'pared back', 'unaccompanied', 'a cappella', 'solo', 'spare'],
    note: '"Monophonic" and "unaccompanied" are precise — a single line. "Exposed" and "bare" add meaning (vulnerability).' },
  { ...base, id: 'synl-015', difficulty: 'developing', word: 'sad (mood)', target: 5, kind: 'analytical',
    example: 'The ending sounds ___.',
    accepted: ['melancholy', 'melancholic', 'sorrowful', 'mournful', 'despairing', 'grieving', 'wistful', 'bittersweet', 'plaintive', 'lamenting', 'desolate', 'forlorn', 'sombre', 'somber', 'elegiac', 'poignant', 'resigned', 'heartbroken', 'anguished', 'regretful', 'nostalgic', 'bleak', 'dejected', 'downcast', 'tragic', 'pensive', 'yearning'],
    note: 'Each mood word makes a different claim: "wistful" and "nostalgic" look back fondly, "resigned" accepts, "anguished" is acute pain. Choose the one your evidence supports — and never let "minor" automatically mean "sad".' },
  { ...base, id: 'synl-016', difficulty: 'developing', word: 'happy (mood)', target: 5, kind: 'analytical',
    example: 'The chorus sounds ___.',
    accepted: ['joyful', 'elated', 'euphoric', 'jubilant', 'triumphant', 'celebratory', 'carefree', 'uplifting', 'exuberant', 'buoyant', 'optimistic', 'cheerful', 'ecstatic', 'content', 'playful', 'radiant', 'bright', 'hopeful', 'festive', 'exultant', 'blissful', 'lighthearted', 'light-hearted', 'gleeful', 'upbeat'],
    note: '"Triumphant" implies victory over something; "content" is calm happiness; "euphoric" is intense. Precise mood words make an argument arguable.' },
  { ...base, id: 'synl-017', difficulty: 'confident', word: 'high (pitch)', target: 3, kind: 'musical',
    example: 'The vocal moves into a ___ part of the range.',
    accepted: ['upper register', 'high register', 'soaring', 'elevated', 'shrill', 'high-pitched', 'treble', 'falsetto', 'head voice', 'altissimo', 'stratospheric', 'top of the range', 'lofty', 'piercing', 'tessitura', 'upper range', 'climactic', 'strained'],
    note: '"Register" is the key term: the upper register of a voice or instrument. "Strained" and "piercing" add effect; "falsetto" and "head voice" are vocal techniques.' },
  { ...base, id: 'synl-018', difficulty: 'confident', word: 'stands out', target: 4, kind: 'analytical',
    example: 'The trumpet ___ above the texture.',
    accepted: ['is prominent', 'prominent', 'is foregrounded', 'foregrounded', 'dominates', 'dominant', 'cuts through', 'soars', 'rises above', 'is emphasised', 'emphasised', 'is highlighted', 'highlighted', 'is featured', 'featured', 'pierces', 'projects', 'is salient', 'salient', 'striking', 'pronounced', 'leads', 'takes centre stage'],
    note: '"Foregrounded" and "prominent" describe the mix or texture; "cuts through" and "projects" describe timbre and balance.' },
]).map((q) => ({ ...q, explanation: q.note }));

// ---------- matching ----------
const norm = (w) => w.toLowerCase().replace(/[“”"'.!?;:()]/g, '').replace(/^(to|is|it|the)\s+/, '').replace(/\s+/g, ' ').trim();
const stem = (w) => norm(w).replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '').replace(/e$/, '');

/** Split a student's list on commas, new lines, semicolons, slashes or " and ". */
export function splitList(text) {
  return [...new Set((text || '').split(/[\n,;/]+|\s+and\s+/i).map(norm).filter((w) => w && w.length > 1))];
}

/** Returns { found: [{ said, matched }], unknown: [said], missed: [accepted words not given] } */
export function checkSynonymList(text, accepted, word) {
  const said = splitList(text);
  const bankStems = accepted.map((a) => [a, stem(a)]);
  const found = [];
  const unknown = [];
  const matched = new Set();
  const self = stem(word.split(/[ (/]/)[0]);
  said.forEach((w) => {
    if (stem(w) === self) { unknown.push(w); return; }
    const hit = bankStems.find(([a, s]) => s === stem(w) || norm(a) === w)
      || (w.includes(' ') && bankStems.find(([a, s]) => !a.includes(' ') && s === stem(w.split(' ')[0])));
    if (hit && !matched.has(hit[0])) { matched.add(hit[0]); found.push({ said: w, matched: hit[0] }); } else if (!hit) unknown.push(w);
  });
  return { found, unknown, missed: accepted.filter((a) => !matched.has(a)) };
}
