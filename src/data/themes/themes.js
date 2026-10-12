// THEMES — used by Theme → Argument lessons and the Theme → Argument exam challenge.
// `directions` are ways an argument can go beyond the theme; `starters` seed beginner scaffolds.

export const ARGUMENT_DIRECTIONS = [
  'how the theme is presented',
  'what the theme means',
  'what perspective the composer takes',
  'how the theme develops',
  'how the theme changes',
  'what the theme is contrasted with',
  'what the composer suggests about the theme',
];

export const ARGUMENT_QUALITIES = [
  { key: 'specific', label: 'Specific', text: 'It says something more than simply repeating the theme.' },
  { key: 'arguable', label: 'Arguable', text: 'It makes a claim someone could disagree with — and that you can support with evidence.' },
  { key: 'relevant', label: 'Relevant', text: 'It directly answers the question asked.' },
  { key: 'developable', label: 'Developable', text: 'It gives you something to prove through several musical elements or moments.' },
  { key: 'musical', label: 'Musical', text: 'It can actually be supported by what happens in the music.' },
];

export const THEME_LADDER_EXAMPLE = [
  { level: 1, label: 'Theme', text: 'Heartbreak' },
  { level: 2, label: 'Basic statement', text: 'The composer presents heartbreak.' },
  { level: 3, label: 'Interpretation', text: 'The composer presents heartbreak as emotionally painful.' },
  { level: 4, label: 'Developed argument', text: 'The composer presents heartbreak as an emotionally overwhelming experience.' },
  { level: 5, label: 'Sophisticated argument', text: 'The composer presents heartbreak as an emotionally overwhelming experience that gradually becomes difficult to escape.' },
];

export const themes = [
  { id: 'heartbreak', label: 'Heartbreak', songs: ['someone-like-you'], starters: ['emotionally overwhelming', 'something to be accepted rather than overcome', 'a memory that refuses to resolve'] },
  { id: 'conflict', label: 'Conflict', songs: ['zombie'], starters: ['increasingly intense', 'unavoidable', 'an internal struggle', 'necessary for change', 'a source of division'] },
  { id: 'peace', label: 'Peace', songs: ['imagine'], starters: ['a fragile ideal', 'a simple, achievable choice', 'a desirable alternative to conflict'] },
  { id: 'identity', label: 'Identity', songs: ['what-was-i-made-for', 'bohemian-rhapsody', 'treaty'], starters: ['uncertain and unresolved', 'fragile and easily lost', 'something discovered gradually'] },
  { id: 'freedom', label: 'Freedom', songs: ['free-bird'], starters: ['hard-won', 'an escape from restriction', 'liberating but uncertain'] },
  { id: 'belonging', label: 'Belonging', songs: ['man-in-the-mirror', 'we-are-the-champions', 'respect'], starters: ['collective rather than individual', 'something earned through shared struggle'] },
  { id: 'loss', label: 'Loss', songs: ['fix-you', 'someone-like-you', 'yesterday', 'adagio-for-strings'], starters: ['quietly devastating', 'something that lingers', 'a starting point for healing'] },
  { id: 'hope', label: 'Hope', songs: ['fix-you', 'let-it-be', 'imagine'], starters: ['emerging gradually from despair', 'fragile but persistent', 'a source of comfort'] },
  { id: 'pressure', label: 'Pressure', songs: ['under-pressure', 'billie-jean'], starters: ['constant and inescapable', 'something that can only be relieved together', 'a force that builds until it breaks'] },
  { id: 'love', label: 'Love', songs: ['cant-help-falling-in-love', 'under-pressure', 'hallelujah'], starters: ['intimate and vulnerable', 'enduring despite distance', 'complicated by longing'] },
];

export const getTheme = (id) => themes.find((t) => t.id === id);
