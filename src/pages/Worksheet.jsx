// PRINTABLE WORKSHEETS — any practice set (at any level) or a mock exam paper, laid out for paper,
// with an answer key on a separate page. "Print / Save as PDF" uses the browser's print dialog;
// "Download" saves a self-contained HTML copy that prints the same way from any browser.
import { useMemo, useRef, useState } from 'react';
import { getSet, DIFFICULTIES } from '../data/index.js';
import { getSong } from '../data/songs/songs.js';
import { teeesParagraphs } from '../data/writing/teees.js';
import { buildSession } from '../utils/session.js';
import { buildMockPaper, decodeConfig, sectionOf } from '../data/mockExam.js';
import { analysisChallengePrompts } from '../data/writing/responsePrompts.js';
import { generateExamQuestion } from '../data/writing/examQuestions.js';
import { themes } from '../data/themes/themes.js';
import { levelLabel } from '../data/levels.js';
import { ContextBlock, Button } from '../components/ui.jsx';
import Staff from '../components/notation/Staff.jsx';
import ScoreStaff from '../components/notation/ScoreStaff.jsx';
import { goBack } from '../utils/router.jsx';
import NotFound from './NotFound.jsx';

const L = 'ABCDEFGH';
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const printable = (it) => !((it.audio || it.audioCompare) && !it.score);

/** The question as it reads on paper. */
function promptOf(it) {
  if (it.type === 'synlist') return `List as many musical or analytical synonyms as you can for “${it.word}”. Aim for ${it.target}.`;
  if (it.type === 'upgrade') return 'Upgrade the weak statement into an analytical sentence: terminology → specific evidence → effect → meaning.';
  if (it.type === 'connect') return 'Write two or three sentences connecting these elements. Name how they relate (reinforce, contrast or develop) and what they create together.';
  if (it.type === 'teees') return it.prompt || `Plan and write a TEEES paragraph about the ${String(it.moment || '').toLowerCase()} of the song.`;
  if (it.type === 'paragraph') return it.question || it.prompt;
  return it.prompt || '';
}

const linesFor = (it) => ({ teees: 14, paragraph: 12, builder: 8, scaffold: 6, direction: 6, connect: 6, upgrade: 4, synlist: 4 }[it.type] || (it.type === 'short' ? (it.minWords > 40 ? 7 : 4) : 0));

function Lines({ n }) {
  return <div className="ws-lines" aria-hidden="true">{Array.from({ length: n }, (_, i) => <span key={i} />)}</div>;
}

/** Fixed, printed order of match options (lettered) — seeded per item so the key matches. */
function matchLayout(it) {
  const rights = shuffle(it.pairs.map((p) => p.right));
  return { lefts: it.pairs.map((p) => p.left), rights };
}

function Question({ it, n, layout }) {
  const song = it.song ? getSong(it.song) : null;
  return (
    <section className="ws-q">
      <p className="ws-qhead"><span className="ws-num">{n}</span>{it.section && <span className="ws-sec">{sectionOf(it.section)?.title}{it.groupLabel ? ` · ${it.groupLabel}` : ''}</span>}</p>
      <ContextBlock item={it} />
      {it.type === 'upgrade' && it.facts && <p className="small"><strong>What happens:</strong> {it.facts.join(' ')}</p>}
      {it.type === 'connect' && <ul className="ws-elements">{it.elements.map((e) => <li key={e.name}><strong>{e.name}:</strong> {e.observation}</li>)}</ul>}
      {it.score && <div className="ws-notation"><ScoreStaff score={it.score} width={it.score.bars.length > 6 ? 900 : it.score.bars.length > 4 ? 760 : 640} /></div>}
      {it.staff && !it.score && <div className="ws-notation"><Staff clef={it.staff.clef} columns={it.staff.columns} keySig={it.staff.keySig} width={it.staff.columns.length > 1 ? 340 : 280} label={`${it.staff.clef} clef`} /></div>}
      <p className="ws-prompt">{promptOf(it)}</p>
      {it.type === 'mcq' && <ol className="ws-opts">{it.options.map((o, i) => <li key={o.id}><span className="ws-box round" />{L[i]}. {o.text}</li>)}</ol>}
      {it.type === 'multi' && <><p className="small muted">Tick all that apply.</p><ol className="ws-opts">{it.options.map((o, i) => <li key={o.id}><span className="ws-box" />{L[i]}. {o.text}</li>)}</ol></>}
      {it.type === 'order' && <><p className="small muted">Number them 1 to {it.items.length}.</p><ul className="ws-opts">{it.items.map((x) => <li key={x.id}><span className="ws-box wide" />{x.text}</li>)}</ul></>}
      {it.type === 'match' && layout && (
        <div className="ws-match">
          <ol>{layout.lefts.map((x, i) => <li key={x}><span className="ws-box wide" />{i + 1}. {x}</li>)}</ol>
          <ol className="ws-right">{layout.rights.map((x, i) => <li key={x}>{L[i]}. {x}</li>)}</ol>
        </div>
      )}
      {it.type === 'scaffold' && it.frame && <p className="ws-frame">{String(it.frame).replace(/___+|\{\w+\}/g, '__________')}</p>}
      {linesFor(it) > 0 && <Lines n={linesFor(it)} />}
      {it.type === 'teees' && song && <p className="small muted">Topic sentence → Elaborate → Evidence (timecode or bar markers) → Explain → Summary / link.</p>}
    </section>
  );
}

function answerOf(it, layout) {
  const opt = (id) => { const i = it.options.findIndex((o) => o.id === id); return i < 0 ? '' : `${L[i]}. ${it.options[i].text}`; };
  switch (it.type) {
    case 'mcq': return opt(it.correctAnswer);
    case 'multi': return it.correctAnswers.map(opt).join('; ');
    case 'order': return it.correctOrder.map((id, i) => `${i + 1}. ${it.items.find((x) => x.id === id)?.text}`).join('  ');
    case 'match': return layout ? layout.lefts.map((l, i) => `${i + 1}→${L[layout.rights.indexOf(it.pairs[i].right)]}`).join('  ') : '';
    case 'short': return it.models?.[0]?.text ? `Model: ${it.models[0].text}` : it.correctAnswer ? opt(it.correctAnswer) : 'Teacher marked.';
    case 'synlist': return `Accept, for example: ${it.accepted.slice(0, 14).join(', ')}.`;
    case 'upgrade': return `Model: ${it.progression[it.progression.length - 1]}`;
    case 'connect': case 'scaffold': case 'direction': case 'builder': case 'paragraph': return it.model ? `Model: ${it.model}` : 'Teacher marked.';
    case 'teees': {
      const m = teeesParagraphs.find((p) => p.id === it.id);
      return m ? `Model: ${['topic', 'elaborate', 'evidence', 'explain', 'summary'].map((k) => m.parts[k]).join(' ')}` : 'Teacher marked.';
    }
    default: return 'Teacher marked.';
  }
}

function writingTask(kind) {
  if (kind === 'paragraph') { const p = pick(analysisChallengePrompts); return { title: 'Analytical paragraph', prompt: p.prompt, song: p.song, lines: 16, key: 'Look for: a specific argument, precise terminology, located evidence, effect, meaning, a connection between two elements, and an evaluation.' }; }
  if (kind === 'theme') { const t = pick(themes); return { title: 'Theme → argument', prompt: `Theme: ${t.label}. Choose a song and write a specific, arguable claim about how it presents ${t.label.toLowerCase()}. Then name the musical direction you would use to prove it.`, lines: 8, key: `Possible directions: ${t.starters.map((s) => `${t.label.toLowerCase()} as ${s}`).join('; ')}.` }; }
  if (kind === 'response') { const q = generateExamQuestion(); return { title: 'Extended response', prompt: `${q.question} Write an introduction (ending with your thesis) and three key-moment paragraphs.`, song: q.song, lines: 40, key: `Introduction: ${q.modelOutline.intro} Key moments: ${q.modelOutline.moments.map((m) => m.where).join('; ')}.` }; }
  return null;
}

function buildWorksheet(setId, query) {
  if (setId === 'mock') {
    const cfg = decodeConfig(query.c);
    const paper = buildMockPaper(cfg);
    const left = paper.questions.filter((q) => q.section === 'listening').length;
    return {
      title: 'Mock exam', subtitle: levelLabel(cfg.level), items: paper.questions.filter(printable),
      note: left ? `The ${left} listening questions need audio, so they are left off the printed paper — play them in the app.` : null,
      writing: writingTask(paper.writing), minutes: cfg.timed ? cfg.minutes : null,
    };
  }
  const set = getSet(setId);
  if (!set) return null;
  const items = [];
  for (let tries = 0; tries < 4 && items.length < 10; tries++) {
    buildSession(set, setId, query).filter(printable).forEach((it) => { if (items.length < 10 && !items.some((x) => x.id === it.id || (it.generated && x.prompt && x.prompt === it.prompt && !x.staff))) items.push(it); });
  }
  const lv = DIFFICULTIES.find((d) => d.key === query.difficulty);
  return { title: set.title, subtitle: lv ? lv.label : 'Mixed levels', items, note: null, writing: null };
}

export default function Worksheet({ setId, query }) {
  const [round, setRound] = useState(0);
  const [showKey, setShowKey] = useState(true);
  const ws = useMemo(() => buildWorksheet(setId, query), [setId, query.c, query.difficulty, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const layouts = useMemo(() => (ws ? ws.items.map((it) => (it.type === 'match' ? matchLayout(it) : null)) : []), [ws]);
  const docRef = useRef(null);
  if (!ws) return <NotFound />;

  const download = async () => {
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    // Tags are assembled in pieces so the app's own build step never mistakes them for the page's real <head>/<body>.
    const tag = (t) => `<${t}>`;
    const html = `<!doctype html><html lang="en">${tag('head')}<meta charset="utf-8"><title>${ws.title} worksheet</title>${tag('style')}${css}${tag('/style')}${tag('/head')}<body class="ws-standalone">${docRef.current.outerHTML}${tag('/body')}${tag('/html')}`;
    const filename = `${ws.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-worksheet.html`;
    // Inside the claude.ai artifact viewer, files are offered through its downloads capability;
    // anywhere else (the built site, a local copy) an ordinary download link works.
    const viaViewer = window.claude?.use ? await window.claude.use('downloads').catch(() => null) : null;
    if (viaViewer) {
      try { await viaViewer.save({ filename, data: html }); } catch { /* declined or unavailable */ }
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  };
  const print = () => { try { window.print(); } catch { download(); } };

  return (
    <div className="page worksheet-page">
      <div className="ws-toolbar no-print">
        <Button variant="ghost" onClick={() => goBack(setId === 'mock' ? '/exam/build' : '/')}>← Back</Button>
        <div className="row gap wrap">
          <label className="row gap small"><input type="checkbox" checked={showKey} onChange={(e) => setShowKey(e.target.checked)} /> Include answer key</label>
          <Button variant="secondary" onClick={() => setRound((r) => r + 1)}>New questions</Button>
          <Button variant="secondary" onClick={download}>Download</Button>
          <Button onClick={print}>Print / Save as PDF</Button>
        </div>
        <p className="small muted ws-tip">The answer key prints on its own page. If the print window does not open here, use Download and print from your browser.</p>
      </div>

      <article className="worksheet" ref={docRef}>
        <header className="ws-header">
          <div>
            <p className="ws-eyebrow">Music Exam Trainer · Worksheet</p>
            <h1 className="ws-title">{ws.title}</h1>
            <p className="ws-sub">{ws.subtitle}{ws.minutes ? ` · ${ws.minutes} minutes` : ''}</p>
          </div>
          <div className="ws-name">
            <span>Name</span><span className="ws-fill" />
            <span>Date</span><span className="ws-fill" />
          </div>
        </header>
        {ws.note && <p className="ws-note">{ws.note}</p>}
        {ws.items.map((it, i) => <Question key={it.id} it={it} n={i + 1} layout={layouts[i]} />)}
        {ws.writing && (
          <section className="ws-q ws-writing">
            <p className="ws-qhead"><span className="ws-num">{ws.items.length + 1}</span><span className="ws-sec">Written task · {ws.writing.title}</span></p>
            <p className="ws-prompt">{ws.writing.prompt}</p>
            <Lines n={ws.writing.lines} />
          </section>
        )}
        {showKey && (
          <section className="ws-key">
            <h2 className="ws-title small-title">Answer key</h2>
            <ol className="ws-key-list">
              {ws.items.map((it, i) => (
                <li key={it.id}>
                  <strong>{answerOf(it, layouts[i])}</strong>
                  {it.explanation && <span className="ws-why"> — {it.explanation}</span>}
                </li>
              ))}
              {ws.writing && <li><strong>{ws.writing.title}.</strong> <span className="ws-why">{ws.writing.key}</span></li>}
            </ol>
          </section>
        )}
      </article>
      {ws.items.length === 0 && <p className="muted no-print">No printable questions here — this set is mostly listening. Try another set or a mock exam without a listening section.</p>}
    </div>
  );
}
