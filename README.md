# Music Exam Trainer

A React web app that teaches senior secondary music students to move from **knowing musical concepts** to **writing sophisticated musical analysis**:

**KNOW → HEAR → ANALYSE → CONNECT → ARGUE → WRITE**

## Run it

Requires Node.js 18+.

```bash
npm install
npm run dev        # local dev server → open the URL it prints
npm run build      # production build in dist/ (static files, host anywhere)
npm run validate   # check every content file for missing fields / broken answer keys
```

The build uses relative paths and hash routing (`#/theory`), so `dist/` works from any static host or subfolder with no server config.

## What's included

| Section | What students do | Content |
|---|---|---|
| **Theory** (Know) | 288 levelled theory questions (59 beginner · 89 developing · 97 confident · 43 exam) across 26 topics — many computed from the music engine (keys, relative keys, scale degrees, diatonic chords, cadences in keys, interval inversion) plus terms, instruments, voices, form, melody and advanced harmony (`src/data/theory/theoryBank.js`). |
| **Theory (more)** | **Skill drills** (endless, randomly generated): Note Identification, Keyboard Identification, Find the Key, Interval Identification, Chord Identification (triads, sevenths, inversions), **Interval Building** (write the note above/below), **Chord Building** (spell triads and sevenths slot by slot), **Scale Building** (major, minor and modes — written on an interactive stave or as note names), Key Signatures, **Rhythm Reading & Dictation** (hear & choose, build it, name note values; simple → complex; 2/4, 3/4, 4/4, 6/8), **Timbre Words** (choose all words that fit, or type your own; synthesised sounds or instrument descriptions). Plus MCQ, matching, ordering, build-the-concept, correct-the-mistake, compare | 16 drills + 288 questions |
| **Listen** (Hear) | **Ear-training drills**: intervals (ascending/descending/together), chord qualities, scales & modes. Plus identify element / feature / terminology, compare excerpts, evidence hunt | 3 drills + 9 excerpts |
| **Analyse** (Analyse/Connect) | Feature → Effect, Evidence → Meaning (+ write-your-own), Musical Synonyms, Upgrade the Analysis, Analysis Ladder, Interconnectivity (5 scaffold levels) | 53 exercises |
| **Argue** | Theme ≠ Argument lesson; strongest argument, upgrade the theme, make it specific, add a musical direction, build the argument chain, argument quality; Argument Builder (whole or one component at a time — written steps give a hint and sentence starter, and only show a model to compare with *after* the student has written the step) | 20 exercises |
| **Write** | **Practice Exam Skills**: 65 short writing tasks generated from the five Practice Exam questions — thesis, introduction preview, then topic sentence, analysis and interconnectivity for each key moment, a linking sentence and a final evaluation. Filter by song (build one response) or by part. Sentence Builder tasks are also tied to the exam questions. |
| **Write (more)** | Sentence Builder, Paragraph Builder (full scaffold → prompts → independent, colour-coded output), Response Builder (Introduction + three key-moment paragraphs; guided → prompts → independent) | 10 exercises + 5 full-response prompts |
| **Exam Mode** | Quick Practice, Theory Test, Listening Test, Analysis Challenge, Theme → Argument Challenge, Practice Exam (real exam timing: 20 minutes planning + 2 hours writing; a freshly generated question every attempt; Introduction (context → preview → thesis last) + 3 key-moment paragraphs; structure checks and per-paragraph diagnostic), Full Practice — timer (hideable), question navigation, review with explanations | — |

Also: home dashboard with recommended practice, per-skill progress (9 skills, never one "music score"), recent activity, song library (7 songs), "Have I…" self-assessment checklist, and a **vague analysis detector** (`src/utils/coach.js`).

### About the writing coach
Written answers are checked by a transparent rule-based coach. It detects the *components* of strong analysis (terminology, specific evidence, effect, meaning, link to theme, interconnectivity, evaluation) and flags weak patterns ("the music gets louder", "the song is good", "makes the listener feel emotional", "minor = sad"…). It cannot judge musical accuracy or insight, so it is presented as a diagnostic, never a grade. Patterns and term lists are plain data you can extend (`VAGUE_PATTERNS` in `coach.js`, `src/data/glossary.js`).

## Project structure

```text
src/
  components/   Layout, UI primitives, AudioPlayer, Coach (feedback, WritePad, SelfAssessment)
  exercises/    Reusable exercise engines — one per exercise type
  pages/        Home, SectionPage (Theory/Listen/Analyse/Argue/Write), Practice, Ladder,
                ResponseBuilderPage, Exam, ExamRun, Songs, ProgressPage, About
  data/
    index.js        ← content registry: every practice set is listed here
    sections.js     which sets appear on which section page
    examModes.js    exam mode timings, question counts, pools
    theory/ listening/ analysis/ argument/ connect/ writing/ songs/ themes/
    glossary.js     terminology the coach recognises
  utils/        router (hash), progress (localStorage), grade, coach, audioSynth
scripts/validate-content.mjs
```

## Stats
`My stats` (`src/pages/StatsPage.jsx`, `src/utils/stats.js`) shows: headline numbers; strengths and weaknesses across theory topics, drill details and practice sets (min. 5 answers); a theory-topic heat map; a skills table (answered, recent accuracy over the last 20, all-time, trend vs the previous 20, last practised); a per-drill breakdown by detail (e.g. interval size and quality, clef, chord type, inversion, key type); and practice sets/exams. Everything is recorded via `recordResult(itemId, skills, score, topics)` — topics are keys like `cat:intervals`, `set:connect`, `drill:interval-id|Size|6th`. Drills attach detail tags to each question (`tags: ['Size|6th', …]`).

## Randomised practice
Every practice session draws a fresh, random selection of 10 tasks, mixing task types (multiple choice, matching, ordering, short response, scaffolds and builders). Authored items come from the data files; extra items are generated each session by `src/data/generators.js` (notation questions from the drill engine, ear questions, term matching, ordering, relationship questions, exam-skill ordering and more). "Practise again" always draws new questions. Exam Mode papers draw from the same pools. Practice Exam questions are generated by `src/data/writing/examQuestions.js` (every song × each of its themes × six question stems), avoiding recently used questions.

## Skill drills
Drills live in `src/drills/drills.js`. Staff drills can be set to use key signatures (none, up to 2, up to 4 or any key), accidentals outside the key (none, sharps/flats/naturals, or double sharps/flats), clef and range; chord drills generate diatonic chords in the chosen key and name their Roman numeral. Each drill has `settings` (shown as toggles, remembered per browser) and a `generate(settings)` function that returns a fresh question: what to display (`staff`, `keyboard` or `audio`), which answer pad to use (`note`, `interval`, `chord`, `choice`, `keyboard`), a `check`, the `answerText` and an `explain`ation shown when the student is wrong. Music logic (spelling-aware intervals, chords, inversions, key signatures, scales) is in `src/utils/music.js`; notation is drawn as SVG in `src/components/notation/` (no music font needed). Every drill answer counts towards the Theory or Listening skill on the progress page.

## Adding content (no page code changes needed)

1. Open the relevant data file and copy an existing item.
2. Give it a unique `id`, a `difficulty` (`beginner | developing | confident | exam`) and `skills` from:
   `theory, terminology, listening, evidence, effect, interconnectivity, themeArgument, argument, writing`.
3. Run `npm run validate`.

### Exercise types (`type`)

| type | Used for | Key fields |
|---|---|---|
| `mcq` | Most objective questions | `prompt, options[{id,text,feedback}], correctAnswer, explanation`; optional `context`, `song`, `audio`, `contextNote`, `followUp` |
| `multi` | Build the concept | `options, correctAnswers[]` |
| `order` | Ordering / ranking | `items[{id,text}], correctOrder[]` |
| `match` | Matching | `pairs[{left,right}]` |
| `scaffold` | Fill-the-frame sentences | `frame: 'The composer presents X as {0}.'`, `blanks[{label, suggestions[{text, quality, note}]}]`, `model` |
| `upgrade` | Upgrade the Analysis | `weak, facts[], expect[], progression[]` |
| `connect` | Interconnectivity | `elements[2–3], options, correctAnswer, frameModel[3], model, modelThree, relationship` |
| `direction` | Add a musical direction | `argument, elements[{id, fit, note}], compose{starter}, model` |
| `builder` | Argument Builder / argument chain | `steps[{key,label,prompt,placeholder,hint,suggestions,expect}]`, optional `finalKey`. Steps with `expect` are written: `suggestions[0]` is hidden until the step is done. Steps without `expect` show `suggestions` as choice chips. |
| `short` | Written short response with revise-and-check loop | `mode: 'argument' \| 'analysis'`, `prompt`, optional `starter`, `hints`, `needMusical`, `needDevelop`, `expect` (analysis mode), `models[{text, why}]` |
| `paragraph` | Paragraph Builder | `question, fields[{key,label,frame,question}], model` |

A new practice set = new data file + one entry in `SETS` (`src/data/index.js`) + list it in `sections.js`.
A new exercise *type* = a component taking `{ item, onComplete(score 0–1) }`, registered in `src/exercises/ExerciseRenderer.jsx`.

### Song suggestions for theme arguments
`src/data/songs/themeSongs.js` maps each theme to well-known songs (database songs or lightweight entries with a `listenFor` list). Whenever a Theme → Argument task has no fixed song, students pick one and the starter becomes "In "Song" (Artist), the composer presents [theme] as …".

### Practice Exam questions
`src/data/writing/responsePrompts.js` holds the questions and model plans; `src/data/writing/examParts.js` holds a model sentence for every part of each response. Add a question to both files and its 13 skill tasks are generated automatically (`examSkills.js`).

### Songs and Queensland repertoire
Add entries to `src/data/songs/songs.js` (title, artist, themes, characteristics, elements, terminology, `analysisNote`). Link any exercise to a song with `song: '<id>'`; the Song Library shows where each song is used. Tag syllabus works however suits you (e.g. `tags: ['qcaa']`).

### Real audio
Put licensed recordings in `public/audio/` and use, on any question:

```js
audio: { src: 'audio/someone-like-you.mp3', start: 42, end: 61 }
// or compare two excerpts:
audioCompare: [{ label: 'Excerpt A', src: '…', start: 0, end: 15 }, { label: 'Excerpt B', synth: 'crescendoStrong' }]
```

Synthesised recipes live in `src/utils/audioSynth.js` (crescendo, staccato/legato, ascending/descending, major→minor, texture change, syncopation, cadences, accelerando).

## Future teacher mode (not built yet)
The architecture is ready for it:
- **Content** is plain data behind one registry — a teacher editor would write the same objects (or load them from an API instead of imports).
- **Progress** (`src/utils/progress.js`) is a single serialisable object (`skills`, `items`, `activity`); syncing it to a backend gives class views and exports.
- **Assignments/exams**: `examModes.js` already defines papers as pools + counts; teacher-created exams would be additional entries.

Not yet implemented: teacher dashboard, accounts/classes, assigning work, exporting results, bundled real recordings.


## Cognitive verbs

Instruction words in task prompts (analyse, evaluate, discuss, explain, identify, describe, interpret, compare, contrast, justify, examine, synthesise, define, develop, "to what extent") are underlined and show a definition on hover, tap or keyboard focus. Definitions live in `src/data/cognitiveVerbs.js` and are also listed on the About page. Wrap any new prompt text in `<VerbText text={…} />` to get the tooltips.

## Terminology note

The app uses **Analyse** as the single name for stage 3 (it includes explaining what a feature does). "Explain" still appears as a rung on the Analysis Ladder and as a cognitive verb.

## Home recommendation

The "What should I practise?" card can be dismissed (stored in `localStorage` under `met-hide-rec`) and restored from the stats card.

`src/components/notation/StaffInput.jsx` is a reusable interactive stave for writing tasks: click a line/space per column, ▲/▼ or arrow keys to adjust, accidental toggle. Drills use it with `pad: 'staffwrite'`.

## Connect (Stage 4)

`/connect` has its own section with three sets: **Feature → Meaning** (`src/data/connect/connectMeaning.js`, plus generated tasks for every Practice Exam song × moment), **Interconnectivity** (five scaffold levels) and **Reinforce · Contrast · Develop** (relationships and linking language, plus generated tasks). It also links to the interconnectivity tasks in Practice Exam Skills. Every step in the stage bar links to its section.

## Ear training (Stage 2 · Hear)

Nine endless ear drills on the Listen page: **Musical Features by Ear** (dynamics, tempo, articulation, texture and register changes), **Texture** (monophonic / homophonic / melody and accompaniment / polyphonic), **Major or Minor?**, **Metre** (2/4, 3/4, 4/4, 6/8), **Cadences** (perfect, imperfect, plagal, interrupted; major and minor keys), **Melodic Dictation** (hear a melody, choose the matching notation), plus Intervals, Chord Quality and Scales & Modes. The newer drills live in `src/drills/earDrills.js`; every question is generated with a random key, tempo and melody. `playMidiEvents` events accept `gain` (dynamics/accents) and `timbre` ('piano', 'organ' for sustained/legato, 'click' for a beat click). The Listening Trainer practice set also mixes in questions from these drills.

## Cognitive verbs in every task

Each task shows a **Cognitive verbs** row (e.g. *Analyse · Evaluate*). Hover, tap or tab to a verb for its definition. Verbs come from two places (`verbsForItem` in `src/data/cognitiveVerbs.js`): verbs the prompt uses as an instruction ("Analyse and evaluate…", "…to justify"), plus the thinking the task type requires (by `subtype`, `kind` or `category`; ordering adds *Sequence*, matching adds *Classify*). Drills can set `verbs: [...]`. Words used descriptively ("a dynamic contrast") are not treated as instructions.

Note: "evaluation" is the student-facing name for the final component of an argument. Internal data keys still use `judgement` (e.g. step keys, `kind: 'judgement'`, highlight class `hl-judgement`) so existing saved progress keeps working.

## Every theme task is about a real song

Any exercise with a `theme` (or `context.theme`) must also have a `song` from `src/data/songs/songs.js` — `scripts/validate-content.mjs` fails otherwise — so students always argue about a piece they can hear rather than an imagined one. Tasks with a song show a collapsible "What happens in …" list of the song's key moments. The song library has 11 songs, including Zombie (conflict), Free Bird (freedom), Can't Help Falling in Love (love) and Under Pressure (pressure). New songs automatically add Practice Exam questions for each of their themes.

## TEEES paragraphs (Write section)

`src/data/writing/teees.js` holds the TEEES structure (Topic sentence → Elaborate → Evidence → Explain → Summary/link, wording from the department's *Music analysis scaffold*), the four planning questions (Musical characteristics, Context, Purpose, Impact) and six model paragraphs, one per song moment. Each model has a `summary` ending (single paragraph) and a `link` ending (another paragraph follows). The `teees` exercise type (`src/exercises/TeeesExercise.jsx`) lets students plan the moment, then write part by part (with sentence starters and a per-part check) or as a whole paragraph (with a TEEES checklist); the result is colour-coded by part and compared with the model. Generated tasks: order the five parts, match sentences to parts, choose the best topic sentence, find the missing part. "[timecode]" in models marks where students add the time from their recording.

The thesis is recommended — not required — as the last sentence of the introduction: the Practice Exam report accepts a thesis anywhere in the introduction and adds a note suggesting it move to the end.

## More vocabulary and theory tasks

- **Synonym lists** (`type: 'synlist'`, `src/data/analysis/synonymLists.js`): "List as many musical or analytical words as you can for *shows* / *loud* / *gets softer* …". Answers are matched against a word bank (inflections allowed — conveys/conveyed/conveying); unrecognised words are shown as "not in our list", never marked wrong. Edit the banks freely.
- **Timbre Words** (`src/drills/timbreDrill.js`): ten synthesised timbres (bright, mellow, pure, hollow, nasal, breathy, harsh, metallic, muffled, plucked) and fourteen instrument descriptions, each with fitting and non-fitting words.
- **Rhythm** (`src/drills/rhythmDrill.js`, notation in `src/components/notation/RhythmStaff.jsx`): rhythms are built from random beat-groups at three levels; the feedback gives the counting ("1 e & a", "1 trip-let", compound "1 & a").
- **TEEES Evidence**: the check only looks for a timecode (e.g. 1:05) or bar markers (e.g. bars 9–12) — never whether it is correct, since recordings and editions differ.

## Five levels (everywhere)

| Level | Name |
|---|---|
| 1 | Beep Boop |
| 2 | It's Probably a C Major |
| 3 | Music Theory Enjoyer |
| 4 | Tritone substitution addict |
| 5 | Arnold Schoenberg has entered the chat |

Defined in `src/data/levels.js`. **Practice sets**: item `difficulty` keys `beginner/developing/confident/exam` are Levels 1–4 and `expert` is Level 5; every set card links to all five levels. If a level has fewer than 6 tasks, the session tops up from the nearest levels. Level 5 tasks are made on the fly by `src/utils/expert.js` (multiple choice becomes "write it yourself", hints/starters/scaffolds removed, synonym targets raised, TEEES whole-paragraph only) plus the hardest drill questions for Theory and Listening. **Drills**: a Level row sets difficulty presets (`src/drills/levelPresets.js`, or a drill's own `levels`); the original settings stay available under "Fine-tune settings".

## New theory drills

- **Nashville Numbers** (`src/drills/nashvilleDrill.js`): chords → numbers (built slot by slot), numbers → chords, hear a progression → chart. Level 1: 1–4–5 in C … Level 5: tritone subs (♭27), ♭3, ♯4°, augmented.
- **Form & Structure** (`formDrill.js`): hear a generated piece and name the form (AB, ABA, AAA, AABA, rondo, verse–chorus, bridge, variations, arch, 12-bar blues, through-composed, 7-part rondo); read a song map; section names and their jobs.
- **Transposition** (`transposeDrill.js`): by an interval or for B♭/E♭/F instruments (concert ↔ written), answered on the stave or as note names.
- **Score-Reading Terms** (`scoreTermsDrill.js`): a marking is highlighted in a short score — what does it mean? (or which marking means…). 40 terms, from p to Sprechstimme.
- **Score Excerpt Analysis** (`excerptDrill.js`): a freshly composed 4–8 bar excerpt (melody + optional chordal accompaniment, harmony-first so everything agrees), with up to 12 questions: key, time signature, tempo, dynamics, articulation (select all), melodic shape and movement, texture, range, cadence, sequence, rit./fermata. Notation by `src/components/notation/ScoreStaff.jsx`.
- **Melodic Dictation** can now be answered by writing the melody on the stave.

## Song library (21 songs)

Someone Like You · Imagine · What Was I Made For? · Man in the Mirror · We Are the Champions · Let It Be · Fix You · Zombie · Free Bird · Can't Help Falling in Love · Under Pressure · Hallelujah · Bohemian Rhapsody · Smells Like Teen Spirit · Billie Jean · Yesterday · Respect · Treaty (Yothu Yindi) · Adagio for Strings (Barber) · In the Hall of the Mountain King (Grieg) · Clocks.
Every song's themes automatically generate Practice Exam questions, and its key moments feed the "What happens in…" panels and song pickers.
Every one of the 21 songs also has written tasks: the second-wave songs get Feature → Effect (fe-013–022), Evidence → Meaning (em-011–020), Feature → Meaning (fm-015–020), Reinforce · Contrast · Develop (rel-013–018) and TEEES model paragraphs (teees-007–012), all in `src/data/songs/songTasks.js`.

## Mock exam builder (`#/exam/build`)

Students choose a level (1–5), how many questions go in each section — A Theory, B Listening, C Score reading (whole 4–8 bar excerpts), D Analysis — and a written task (none, theme → argument, analytical paragraph or extended response). The suggested time is worked out from the paper (or set your own, or untimed). Results are broken down by section. Papers are built by `src/data/mockExam.js`; the config is kept in the URL (`#/exam/custom?c=level.theory.listening.score.analysis.writing.minutes`) so a teacher can share the same paper settings with a class.

Quick Practice now always includes two notation (stave) questions and one score-reading question.

## Suggested levels and spaced review (`src/utils/adaptive.js`)

- Every answer is also recorded against the level it was answered at (`lv:set:<id>:<n>`, `lv:drill:<id>:<n>`, `lv:mock:<n>`).
- After 6 answers at a level, the app suggests a level: **85%+** over the last 10 → move up; **below 50%** → drop down; otherwise stay. The suggestion appears as a "Suggested" badge on drill level buttons, set cards and the mock exam builder.
- **Review today** (Home): topics come back after a gap that grows with how well they are known — below 50% after 1 day, below 70% after 2 days, below 85% after 5 days, otherwise 14 days.

## Printable worksheets (`#/worksheet/<setId>` and `#/worksheet/mock?c=…`)

Any practice set (at any level — "Print a worksheet" on each set card) or a mock exam paper ("Print as a worksheet" in the builder) can be printed or saved as a PDF, with name/date lines, ruled answer lines for written tasks, staves and score excerpts, and an answer key (model answers and explanations) on its own page. Listening questions are left off paper copies. "Download" saves a self-contained HTML copy that prints the same way from any browser.
