// THE FIVE LEVELS — used by every practice set (as item difficulty) and every skill drill (as a preset).
// Set items keep their original difficulty keys (beginner … exam) so saved progress still works; 'expert' is Level 5.
export const LEVELS = [
  { n: 1, key: 'beginner', name: 'Beep Boop', note: 'First steps — lots of help' },
  { n: 2, key: 'developing', name: "It's Probably a C Major", note: 'The basics, in familiar territory' },
  { n: 3, key: 'confident', name: 'Music Theory Enjoyer', note: 'Wider range, less help' },
  { n: 4, key: 'exam', name: 'Tritone substitution addict', note: 'Exam standard — independent' },
  { n: 5, key: 'expert', name: 'Arnold Schoenberg has entered the chat', note: 'Everything, with no help at all' },
];
export const levelLabel = (n) => `Level ${n}: ${LEVELS[n - 1].name}`;
export const levelByKey = (key) => LEVELS.find((l) => l.key === key);
