// The writing coach: a transparent, rule-based diagnostic for student analysis.
// It is NOT a marker. It looks for the components of strong analysis
// (terminology → evidence → effect → meaning → theme → connection → evaluation)
// and flags common vague patterns with a supportive next-step prompt.
import { GLOSSARY_TERMS } from '../data/glossary.js';

const has = (re, text) => re.test(text);

// ---- Vague analysis detector -------------------------------------------------
const ELEMENT_WORDS = 'dynamics|melody|rhythm|harmony|texture|timbre|tempo|instruments|instrumentation|articulation|form|structure|pitch|metre|tonality';

export const VAGUE_PATTERNS = [
  {
    id: 'opinion',
    re: /\b(song|music|piece|it|this)\s+(is|was|sounds)\s+(really\s+|very\s+|so\s+)?(good|great|nice|bad|amazing|beautiful|cool|interesting)\b/i,
    message: 'This is a personal opinion rather than analysis — it tells us what you think of the music, not what the music does.',
    prompt: 'Which musical feature stands out, and what does it do?',
  },
  {
    id: 'unsupported-effective',
    re: /\b(is|was|are)\s+(very\s+|really\s+)?effective\b/i,
    unless: /\b(because|through|by|as|since|which)\b/i,
    message: '"Effective" is an evaluation — a good instinct — but it needs a reason.',
    prompt: 'Effective at doing what? Name the musical evidence that makes it effective.',
  },
  {
    id: 'uses-element',
    re: new RegExp(`\\b(uses|used|has|includes)\\s+(a\\s+lot\\s+of\\s+|lots\\s+of\\s+|different\\s+)?(${ELEMENT_WORDS})\\b\\s*[.!]?\\s*$`, 'im'),
    message: 'This identifies a musical element, but not what happens in it or why it matters.',
    prompt: 'What specifically happens in that element? (e.g. "a gradual crescendo through the final chorus")',
  },
  {
    id: 'everyday-description',
    re: /\b(gets|got|becomes|goes|went)\s+(a\s+lot\s+|much\s+|really\s+)?(louder|softer|quieter|faster|slower|higher|lower)\b/i,
    message: 'This describes what you hear in everyday language. It is a start — now make it musical.',
    prompt: 'What is the musical term for this, and what effect does it create?',
  },
  {
    id: 'bare-mood',
    re: /\b(song|music|piece|melody|it|this)\s+(is|sounds|feels)\s+(really\s+|very\s+|quite\s+)?(sad|happy|angry|scary|calm|upbeat|depressing)\b/i,
    unless: /\b(because|through|created by|due to|as a result)\b/i,
    message: 'This names a mood without showing which musical evidence creates it.',
    prompt: 'What specific musical evidence creates that mood?',
  },
  {
    id: 'feel-emotional',
    re: /\bmakes?\s+(the\s+)?(listener|audience|you|us|people|me)\s+(feel\s+)?(emotional|something|things|good|bad|feel)\b/i,
    message: '"Makes the listener feel emotional" is too broad to analyse.',
    prompt: 'Which emotion, precisely? And what does that suggest about the theme?',
  },
  {
    id: 'is-about',
    re: /\b(song|piece|music|it)\s+is\s+(all\s+)?about\b/i,
    message: '"Is about" names a topic, not an argument.',
    prompt: 'What does the music suggest about this theme? Try: "presents ___ as ___".',
  },
  {
    id: 'mood-formula',
    re: /\b(minor\b[^.]{0,40}\b(sad|depress)|major\b[^.]{0,40}\b(happy|cheerful)|fast\b[^.]{0,25}\bexcit|slow\b[^.]{0,25}\bsad)/i,
    unless: /\b(context|lyric|combined|together with|alongside|while|although|however|whereas)\b/i,
    message: 'Careful — major/minor and fast/slow do not have fixed meanings. This can be a valid reading, but only in context.',
    prompt: 'What else in the music (lyrics, register, performance, other elements) supports this reading here?',
  },
];

export function detectVague(text) {
  const t = (text || '').trim();
  if (!t) return [];
  return VAGUE_PATTERNS.filter((p) => has(p.re, t) && !(p.unless && has(p.unless, t)));
}

// ---- Component checks -----------------------------------------------------------
const RE = {
  evidence: /\b(closing|end of|middle|start|begin\w*|enter\w*|join\w*|arriv\w*|after|when the|chorus\w*|verse\w*|bridge|pre-chorus|intro|introduction|opening|final\w*|later|outro|coda|ending\w*|bars?|section\w*|second|third|first|gradual\w*|sudden\w*|sustain\w*|repeat\w*|repetiti\w*|register|from\s+\w+\s+to\s+\w+|throughout|each time|returns?|half-step|semitone|pianissimo|fortissimo|at the end|at the start)\b/i,
  effect: /\b(mak\w*\b[^.]{0,30}\b(feel|sound|seem)\w*|sounds? \w+|keep\w* the focus|leav\w*|giv\w*|den(y|ies|ied|ying)|withhold\w*|emphasi[sz]\w*|echo\w*|invit\w*|hold\w* back|turn\w*|seem\w*|sound\w* (both|like|as)|feel\w* (like|as)|strip\w*|expos\w*|leav\w* (the|it|us)|creat\w*|generat\w*|build\w*|intensif\w*|increas\w*|heighten\w*|evok\w*|produc\w*|establish\w*|sense of|atmosphere|tension|release|instability|stability|momentum|urgency|intimacy|distance|weight|drives?|propels?|suspends?|unsettl\w*|lifts?|grounds?)\b/i,
  meaning: /\b(heard as|read as|as if|as though|establish\w*|develop\w*|complet\w*|complicat\w*|enact\w*|mirror\w*|demonstrat\w*|challeng\w*|transform\w*|signal\w*|impl(y|ies)|present\w*|portray\w*|convey\w*|communicat\w*|reinforc\w*|suggest\w*|represent\w*|depict\w*|emphasi[sz]\w*|reflect\w*|symboli[sz]\w*|characteri[sz]\w*|construct\w*|highlight\w*|express\w*|illustrat\w*|captur\w*|evok\w*)\b/i,
  connection: /\b(while|whilst|together|combin\w*|each other|alongside|reinforced by|developed (by|when)|works? with|working with|in contrast|contrast\w*|whereas|as well as|coupled with|both|in conjunction|complement\w*|juxtapos\w*|interact\w*|layered with|similarly)\b|\b(using|through)\b[^.]{3,80}\band\b/i,
  judgement: /\b(effective(ly)?|successful(ly)?|powerful(ly)?|convincing(ly)?|compelling(ly)?|ultimately|therefore|thus|consequently|most (clearly|powerfully|effectively))\b/i,
  why: /\b(because|in order to|so that|which (suggests|reflects|mirrors|allows|reinforces|creates|emphasises|emphasizes)|reflecting|suggesting|mirroring|allowing|to (suggest|show|reflect|mirror|convey|represent))\b/i,
};

export function findTerms(text) {
  const t = (text || '').toLowerCase();
  return GLOSSARY_TERMS.filter((term) => new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i').test(t));
}

function themeMentioned(text, theme) {
  if (!theme) return null;
  const root = theme.toLowerCase().replace(/[^a-z ]/g, '').slice(0, Math.max(4, Math.min(6, theme.length - 1)));
  return text.toLowerCase().includes(root);
}

export const COMPONENTS = [
  { key: 'terminology', label: 'Musical terminology', next: 'Name the feature with a precise musical term (e.g. crescendo, syncopation, homophonic texture, falsetto).' },
  { key: 'evidence', label: 'Specific evidence', next: 'Make the evidence specific: where does it happen, and how? (e.g. "in the final chorus", "gradually from piano to forte").' },
  { key: 'effect', label: 'Musical effect', next: 'Explain what the feature does: what does it create, build or change?' },
  { key: 'meaning', label: 'Meaning', next: 'Connect the effect to meaning with an analytical verb (reinforces, conveys, emphasises…).' },
  { key: 'theme', label: 'Link to the theme', next: 'Name the theme and say what the music suggests about it.' },
  { key: 'connection', label: 'Interconnectivity', next: 'Show how a second element works with (or against) the first: "while…", "together, these…".' },
  { key: 'judgement', label: 'Evaluation', next: 'Finish with an evaluation: how effectively is the idea communicated, and why?' },
];

/**
 * Analyse a piece of student writing.
 * @param {string} text
 * @param {{theme?: string, expect?: string[]}} opts  expect = components this task requires
 */
export function analyseWriting(text, opts = {}) {
  const t = (text || '').trim();
  const terms = findTerms(t);
  const words = t ? t.split(/\s+/).length : 0;
  const tm = themeMentioned(t, opts.theme);
  const checks = {
    terminology: terms.length > 0,
    evidence: has(RE.evidence, t),
    effect: has(RE.effect, t),
    meaning: has(RE.meaning, t),
    theme: tm === null ? has(RE.meaning, t) : tm,
    connection: has(RE.connection, t),
    judgement: has(RE.judgement, t),
    why: has(RE.why, t),
  };
  const flags = detectVague(t);
  const expect = opts.expect || COMPONENTS.map((c) => c.key);
  const met = expect.filter((k) => checks[k]);
  let score = expect.length ? met.length / expect.length : 0;
  if (flags.length) score = Math.max(0, score - 0.1 * flags.length);
  if (words < 6) score = Math.min(score, 0.3);

  const strengths = COMPONENTS.filter((c) => expect.includes(c.key) && checks[c.key]).map((c) => c.label);
  const missing = COMPONENTS.filter((c) => expect.includes(c.key) && !checks[c.key]);
  const nextStep = missing[0] || null;
  return { checks, terms, flags, strengths, missing, nextStep, score: Math.round(score * 100) / 100, words };
}

// ---- Argument checker (Theme → Argument short responses) ----------------------
const BLAND = /^(good|bad|important|sad|happy|nice|positive|negative|emotional|interesting|powerful|strong|real|big|meaningful|significant|very \w+|really \w+)$/i;
const CLAIM_RE = /\b(present\w*|portray\w*|depict\w*|construct\w*|characteri[sz]\w*|convey\w*|frame\w*|explore\w*|represent\w*|show\w*)\b[^.]*?\bas\b\s+([^.;:]+)/i;
const DEVELOP_RE = /\b(cannot|refus\w*|earned|hard-won|instead of|only after|in contrast|contrast\w*|against|increasingly|gradually|becom\w*|grow\w*|shift\w*|transform\w*|develop\w*|evolv\w*|rather than|despite|whereas|while|but|yet|until|ultimately|initially|eventually|at first|by the end|from\b[^.]{1,40}\bto)\b/i;
const ELEMENT_RE = /\b(dynamic\w*|rhythm\w*|harmon\w*|melod\w*|texture\w*|timbre\w*|instrument\w*|articulation|form|structure|tempo|register|tonality|metre|meter|voice|vocal\w*|accompaniment|chord\w*|key change|modulation)\b/i;

export const ARGUMENT_CRITERIA = [
  { key: 'claim', label: 'Makes a claim', tip: 'Go beyond naming the theme: "The composer presents [theme] as …".' },
  { key: 'specific', label: 'Specific', tip: 'Replace broad words (sad, important, emotional) with a precise idea — what kind of heartbreak, conflict, hope?' },
  { key: 'developed', label: 'Shows development or contrast', tip: 'Say how the theme develops, changes or is contrasted: "increasingly…", "rather than…", "gradually becomes…".' },
  { key: 'musical', label: 'Points to musical evidence', tip: 'Add a musical direction: "…through the thickening texture and rising register".' },
  { key: 'relevant', label: 'Answers the theme asked', tip: 'Make sure the argument is about the theme in the question.' },
];

export function analyseArgument(text, { theme, needMusical = false, needDevelop = false } = {}) {
  const t = (text || '').trim();
  const m = CLAIM_RE.exec(t);
  const claimPhrase = m ? m[2].trim().replace(/\s+/g, ' ') : '';
  const claimWords = claimPhrase ? claimPhrase.split(' ').length : 0;
  const tm = themeMentioned(t, theme);
  const met = {
    claim: !!m,
    specific: !!m && claimWords >= 3 && !BLAND.test(claimPhrase.split(/,| and | through | using /)[0].trim()),
    developed: DEVELOP_RE.test(t),
    musical: ELEMENT_RE.test(t) || findTerms(t).length > 0,
    relevant: tm === null ? true : tm,
  };
  const flags = detectVague(t);
  if (!m && t) flags.unshift({ id: 'no-claim', message: 'This names the theme but does not yet make a claim about it.', prompt: `Try: "The composer presents ${theme || 'the theme'} as …" — and finish the sentence with a specific idea.` });
  else if (m && !met.specific) flags.unshift({ id: 'too-broad', message: `"…as ${claimPhrase}" is a start, but it is broad enough to describe almost any song.`, prompt: 'What kind? How does it develop? What is it contrasted with?' });
  const weights = { claim: 0.3, specific: 0.25, developed: needDevelop ? 0.2 : 0.15, musical: needMusical ? 0.2 : 0.15, relevant: 0.15 };
  let score = Object.entries(met).reduce((s, [k, v]) => s + (v ? weights[k] : 0), 0) / Object.values(weights).reduce((a, b) => a + b, 0);
  if (t.split(/\s+/).length < 6) score = Math.min(score, 0.3);
  const criteria = ARGUMENT_CRITERIA.map((c) => ({ ...c, met: met[c.key] }));
  const next = criteria.find((c) => !c.met && (c.key !== 'musical' || needMusical) && (c.key !== 'developed' || needDevelop)) || criteria.find((c) => !c.met);
  return { criteria, flags, score: Math.round(score * 100) / 100, next, claimPhrase };
}

// ---- Locations (for extended responses) ----------------------------------------
const LOCATION_RE = /\b(intro(?:duction)?|opening|first verse|second verse|third verse|verse\s?\d|verses?|pre-chorus|first chorus|second chorus|final chorus|choruses|chorus|bridge|middle eight|instrumental|solo|breakdown|build|climax|outro|coda|ending|final section|closing|last \w+|\d{1,2}:\d{2})\b/gi;
export function findLocations(text) {
  return [...new Set(((text || '').match(LOCATION_RE) || []).map((x) => x.toLowerCase()))];
}
