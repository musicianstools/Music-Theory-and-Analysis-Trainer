// PRACTICE EXAM QUESTION GENERATOR
// Builds a fresh question every time: song × one of its themes × a question stem.
// Recently used questions (stored per browser) are avoided so students rarely see the same one twice in a row.
// Curated questions (responsePrompts.js + examParts.js) contribute their full model plans when their song/theme comes up.
import { songs } from '../songs/songs.js';
import { responsePrompts } from './responsePrompts.js';
import { examParts } from './examParts.js';

export const QUESTION_STEMS = [
  'Analyse and evaluate how {artist} uses musical elements to communicate {theme} in "{title}". Refer to three key musical moments.',
  'Evaluate how effectively "{title}" by {artist} presents {theme}. Support your argument with three key musical moments.',
  'Analyse how musical elements work together to shape the presentation of {theme} in "{title}". Refer to three key moments in the song.',
  'Discuss how {artist} manipulates musical elements to develop the theme of {theme} across "{title}". Use three key musical moments as evidence.',
  'To what extent does the music of "{title}" present {theme} as more than a single emotion? Analyse three key musical moments to support your argument.',
  'Analyse how contrast between sections of "{title}" contributes to the presentation of {theme}. Refer to three key musical moments.',
];

const RECENT_KEY = 'met-exam-recent';
const RECENT_MAX = 15;

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(list) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(-RECENT_MAX))); } catch { /* storage unavailable */ }
}

/** Every possible question, as lightweight descriptors. */
export function allQuestionKeys() {
  return songs.flatMap((s) => s.themes.flatMap((theme) => QUESTION_STEMS.map((_, i) => `${s.id}|${theme}|${i}`)));
}

export function questionFromKey(key) {
  const [songId, theme, stemIdx] = key.split('|');
  const song = songs.find((s) => s.id === songId);
  const question = QUESTION_STEMS[Number(stemIdx)].replace('{artist}', song.artist).replace('{title}', song.title).replace('{theme}', theme);
  const curated = responsePrompts.find((p) => p.song === songId && p.theme === theme);
  const parts = curated ? examParts[curated.id] : null;
  const moments = curated ? curated.modelOutline.moments : song.moments.slice(0, 3).map((m) => ({ ...m, why: '' }));
  return {
    id: `gen-${key}`,
    key,
    generated: true,
    song: songId,
    theme,
    question,
    difficulty: curated?.difficulty || song.difficulty,
    partsId: curated?.id || null,
    modelOutline: {
      intro: parts
        ? `${parts.context} ${parts.preview} ${parts.thesis}`
        : `Open with context (the song, ${song.artist}, its style and how it relates to ${theme}); preview three key moments; end the introduction with your thesis: "… presents ${theme} as …" — a specific, arguable claim.`,
      moments,
      otherMoments: curated ? [] : song.moments.slice(3),
    },
  };
}

/** A new random question, avoiding recently used ones. */
export function generateExamQuestion() {
  const recent = loadRecent();
  const all = allQuestionKeys();
  const recentSongs = recent.slice(-2).map((k) => k.split('|')[0]);
  let pool = all.filter((k) => !recent.includes(k) && !recentSongs.includes(k.split('|')[0]));
  if (!pool.length) pool = all.filter((k) => !recent.includes(k));
  if (!pool.length) pool = all;
  const key = pool[Math.floor(Math.random() * pool.length)];
  saveRecent([...recent, key]);
  return questionFromKey(key);
}
