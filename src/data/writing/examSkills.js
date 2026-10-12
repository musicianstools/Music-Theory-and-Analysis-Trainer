// PRACTICE EXAM SKILLS — short writing tasks generated from the Practice Exam questions.
// Each task practises one part of a full response, in the order you would write it:
// context → preview → thesis (last sentence of the introduction) → (topic sentence → analysis → interconnectivity) × 3,
// with a transition and a final evaluation.
import { responsePrompts } from './responsePrompts.js';
import { examParts } from './examParts.js';
import { getSong } from '../songs/songs.js';

const ORD = ['first', 'second', 'final'];

function tasksFor(p) {
  const parts = examParts[p.id];
  const song = getSong(p.song);
  const outline = p.modelOutline;
  const common = { song: p.song, theme: p.theme, examQuestion: p.question, category: 'exam-skills' };
  const t = [];

  t.push({
    ...common, id: `${p.id}-context`, type: 'short', mode: 'analysis', kind: 'context', difficulty: 'beginner', skills: ['writing'],
    prompt: 'Introduction, sentence 1: set the context — name the song, the artist and how it relates to the theme.',
    starter: `"${song.title}" (${song.year}) by ${song.artist} `,
    expect: ['theme'],
    hints: ['Mention the genre or style, the year and the theme in the question.', 'Keep it to one sentence — your argument comes at the end of the introduction.'],
    models: [{ text: parts.context, why: 'Orients the reader: work, artist, style and theme — without arguing yet.' }],
  });
  t.push({
    ...common, id: `${p.id}-preview`, type: 'short', mode: 'analysis', kind: 'preview', difficulty: 'developing', skills: ['writing', 'argument'],
    prompt: 'Introduction, sentence 2: preview your three key moments and the musical elements you will analyse.',
    expect: ['terminology', 'evidence'],
    hints: ['Name each moment by where it happens (opening, chorus, bridge, ending…).', 'Mention the musical feature that makes each moment important.'],
    models: [{ text: parts.preview, why: 'Names three different moments and the evidence in each — a roadmap for the reader.' }],
  });
  t.push({
    ...common, id: `${p.id}-thesis`, type: 'short', mode: 'argument', kind: 'thesis', difficulty: 'developing', skills: ['themeArgument', 'argument', 'writing'],
    prompt: 'Introduction, final sentence: write your thesis — the argument your whole response will prove. It should be the last sentence of your introduction.',
    starter: `Through these moments, ${song.artist} present${/^(The |Queen|Coldplay)/.test(song.artist) ? '' : 's'} ${p.theme} as `,
    hints: ['Finish with a specific, arguable idea — not just "sad" or "important".', 'Add how the theme develops or what it is contrasted with.'],
    needDevelop: true,
    models: [{ text: parts.thesis, why: 'The introduction builds to this claim: specific, arguable, and it suggests a journey you can trace across three moments.' }],
  });

  parts.moments.forEach((m, i) => {
    const o = outline.moments[i];
    const n = i + 1;
    t.push({
      ...common, id: `${p.id}-m${n}-topic`, type: 'short', mode: 'analysis', kind: 'topic', difficulty: 'developing', skills: ['writing', 'argument'],
      argument: parts.thesis, moment: `${o.where} — ${o.what}`,
      prompt: `Key moment ${n} (${o.where}): write the topic sentence that opens this paragraph and links the moment to your argument.`,
      expect: ['evidence', 'meaning'],
      hints: [`Name where the moment is (${o.where.toLowerCase()}).`, `Say what this moment shows about ${p.theme} — connect it to the thesis.`],
      models: [{ text: m.topic, why: 'Locates the moment and states what it contributes to the argument, before any detail.' }],
    });
    t.push({
      ...common, id: `${p.id}-m${n}-analysis`, type: 'short', mode: 'analysis', kind: 'analysis', difficulty: 'confident', skills: ['writing', 'evidence', 'effect'],
      argument: parts.thesis, facts: [`Where: ${o.where}`, `What happens: ${o.what}`],
      prompt: `Key moment ${n}: using the musical facts, write 2–3 sentences of analysis — evidence, effect and meaning.`,
      expect: ['terminology', 'evidence', 'effect', 'meaning'],
      minWords: 30, rows: 5,
      hints: ['Evidence: what happens, with musical terms.', 'Effect: what it creates or changes.', `Meaning: what it suggests about ${p.theme}.`],
      models: [{ text: m.analysis, why: 'Evidence → effect → meaning, in that order, with precise terminology.' }],
    });
    t.push({
      ...common, id: `${p.id}-m${n}-connection`, type: 'short', mode: 'analysis', kind: 'connection', difficulty: 'confident', skills: ['interconnectivity', 'writing'],
      argument: parts.thesis, facts: [`Where: ${o.where}`, `What happens: ${o.what}`],
      prompt: `Key moment ${n}: write an interconnectivity sentence — show how two musical elements in this moment work together.`,
      expect: ['terminology', 'connection', 'meaning'],
      hints: ['Use a connective: "while", "works with", "together", "reinforced by", "in contrast".', 'Say what the two elements achieve together.'],
      models: [{ text: m.connection, why: 'Names two elements and the relationship between them, then links to meaning.' }],
    });
    if (i === 0) {
      t.push({
        ...common, id: `${p.id}-transition`, type: 'short', mode: 'analysis', kind: 'transition', difficulty: 'developing', skills: ['writing', 'argument'],
        argument: parts.thesis, moment: `From ${outline.moments[0].where.toLowerCase()} to ${outline.moments[1].where.toLowerCase()}`,
        prompt: `Write a linking sentence that moves from your ${ORD[0]} key moment to your ${ORD[1]}, showing how the argument develops.`,
        expect: ['evidence'],
        hints: ['Use a verb of development: develops, challenges, transforms, contrasts, builds on.'],
        models: [{ text: parts.transition, why: 'Moves the argument forward rather than just listing the next moment.' }],
      });
    }
  });

  t.push({
    ...common, id: `${p.id}-judgement`, type: 'short', mode: 'analysis', kind: 'judgement', difficulty: 'exam', skills: ['writing', 'argument'],
    argument: parts.thesis,
    prompt: 'Final sentence: write the overall evaluation that ends your response — how effectively is the theme communicated, and why?',
    starter: 'Ultimately, ',
    expect: ['judgement', 'meaning', 'theme'],
    hints: ['Use an evaluative word: effectively, powerfully, convincingly.', 'Sum up the musical journey across your three moments — not just one feature.'],
    models: [{ text: parts.judgement, why: 'Evaluates, refers back to the whole structure and restates the argument in its final form.' }],
  });
  return t;
}

export const examSkillTasks = responsePrompts.flatMap(tasksFor);
