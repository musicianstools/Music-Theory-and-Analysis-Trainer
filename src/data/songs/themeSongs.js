// SONG SUGGESTIONS BY THEME — so students tie every argument to a specific, well-known song.
// Entries are either a song-database id (string) or a lightweight suggestion { title, artist, year, listenFor[] }.
// `listenFor` lists audible features to anchor the argument; add your own repertoire freely.
import { getSong } from './songs.js';

const S = (title, artist, year, listenFor) => ({ title, artist, year, listenFor });

const RAW = {
  heartbreak: ['someone-like-you', S('drivers license', 'Olivia Rodrigo', 2021, ['Sparse piano-led verses', 'A bridge that builds to a loud, layered climax with crashing drums', 'A return to quiet afterwards'])],
  conflict: [
    'zombie',
    'bohemian-rhapsody',
  ],
  peace: ['imagine', S('What a Wonderful World', 'Louis Armstrong', 1967, ['Slow tempo', 'Lush, sustained strings', 'Warm, gravelly vocal timbre'])],
  identity: ['what-was-i-made-for', 'bohemian-rhapsody', 'treaty', 'respect', S('This Is Me', 'Keala Settle (The Greatest Showman)', 2017, ['A quiet, hesitant opening', 'A build to a full texture with gospel-style choir, stomps and claps', 'A powerful, belted lead vocal'])],
  freedom: [
    'free-bird',
    S('I Want to Break Free', 'Queen', 1984, ['A steady, unchanging beat and bass line', 'A synthesizer solo in the middle section']),
  ],
  belonging: ['man-in-the-mirror', 'we-are-the-champions', S('Lean on Me', 'Bill Withers', 1972, ['Simple, mostly stepwise piano melody', 'Gospel-influenced style with handclaps', 'Backing vocals answering the lead'])],
  loss: ['someone-like-you', 'yesterday', 'hallelujah', 'fix-you', S('Tears in Heaven', 'Eric Clapton', 1992, ['Gentle fingerpicked acoustic guitar', 'Soft, restrained dynamics', 'An intimate, understated vocal']), S('See You Again', 'Wiz Khalifa ft. Charlie Puth', 2015, ['A piano-led sung chorus', 'Contrast between the sung chorus and rapped verses'])],
  hope: ['fix-you', 'let-it-be', S('Here Comes the Sun', 'The Beatles', 1969, ['Bright fingerpicked acoustic guitar', 'Moog synthesizer colours', 'An irregular, shifting metre in the bridge'])],
  love: ['cant-help-falling-in-love', 'hallelujah', 'under-pressure', S('Perfect', 'Ed Sheeran', 2017, ['A gentle, swaying compound (waltz-like) metre', 'Acoustic guitar with strings added later', 'A gradual build in texture'])],
  change: ['man-in-the-mirror', S('A Change Is Gonna Come', 'Sam Cooke', 1964, ['Dramatic orchestral strings', 'A slow, swaying compound feel', 'A soulful, sustained vocal'])],
  triumph: ['we-are-the-champions', S('Eye of the Tiger', 'Survivor', 1982, ['A punchy, palm-muted guitar riff with heavy accents', 'A driving rock beat'])],
  acceptance: ['let-it-be', 'someone-like-you'],
  pressure: ['under-pressure', 'billie-jean'],
  faith: ['hallelujah', 'let-it-be'],
  doubt: ['hallelujah'],
  guilt: ['bohemian-rhapsody'],
  fate: ['bohemian-rhapsody'],
  rebellion: ['smells-like-teen-spirit'],
  alienation: ['smells-like-teen-spirit', 'what-was-i-made-for'],
  youth: ['smells-like-teen-spirit'],
  paranoia: ['billie-jean'],
  regret: ['yesterday', 'clocks'],
  nostalgia: ['yesterday'],
  memory: ['yesterday', 'someone-like-you'],
  empowerment: ['respect'],
  equality: ['respect', 'treaty'],
  reconciliation: ['treaty'],
  culture: ['treaty'],
  mourning: ['adagio-for-strings'],
  tension: ['adagio-for-strings', 'hall-of-the-mountain-king'],
  danger: ['hall-of-the-mountain-king'],
  urgency: ['clocks', 'hall-of-the-mountain-king'],
  time: ['clocks'],
  isolation: ['what-was-i-made-for'],
  grief: ['fix-you', 'adagio-for-strings', 'zombie'],
  longing: ['someone-like-you'],
};

export function songsForTheme(theme) {
  const list = RAW[(theme || '').toLowerCase()] || [];
  return list.map((x) => {
    if (typeof x !== 'string') return { ...x, key: x.title };
    const s = getSong(x);
    return { key: s.id, id: s.id, title: s.title, artist: s.artist, year: s.year, listenFor: s.characteristics.slice(0, 3) };
  });
}

export const THEMES_WITH_SONGS = Object.keys(RAW);
