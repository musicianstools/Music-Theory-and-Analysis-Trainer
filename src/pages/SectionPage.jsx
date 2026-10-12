import { useState } from 'react';
import { Link } from '../utils/router.jsx';
import { SECTIONS } from '../data/sections.js';
import { SETS, DIFFICULTIES, FILTER_LABELS } from '../data/index.js';
import { analyticalVerbs } from '../data/analysis/verbs.js';
import { ARGUMENT_QUALITIES, THEME_LADDER_EXAMPLE, ARGUMENT_DIRECTIONS } from '../data/themes/themes.js';
import { PageHeader, StageBar, StagePill, Callout, Card } from '../components/ui.jsx';
import { useProgress } from '../utils/progress.js';
import { suggestLevel } from '../utils/adaptive.js';
import { getDrill } from '../drills/drills.js';
import { getSong } from '../data/songs/songs.js';
const getSongTitle = (id) => getSong(id)?.title || id;
import Staff from '../components/notation/Staff.jsx';
import RhythmStaff from '../components/notation/RhythmStaff.jsx';
import Keyboard from '../components/notation/Keyboard.jsx';
import { parseNote, buildChord, KEYS } from '../utils/music.js';

const P = parseNote;
const PREVIEW = {
  'note-id': () => <Staff clef="treble" columns={[[P('G4')]]} width={150} compact />,
  'interval-id': () => <Staff clef="treble" columns={[[P('D4')], [P('A4')]]} width={170} compact />,
  'chord-id': () => <Staff clef="treble" columns={[buildChord(P('F4'), 'maj')]} width={150} compact />,
  'interval-build': () => <Staff clef="treble" columns={[[P('E4')], [P('C5')]]} tones={[[], ['hint']]} width={170} compact />,
  'chord-build': () => <Staff clef="treble" columns={[[P('G4')], buildChord(P('G4'), 'dom7')]} tones={[[], ['', 'hint', 'hint', 'hint']]} width={170} compact />,
  'scale-build': () => <Staff clef="treble" columns={['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'].map((n) => [P(n)])} tones={[[], ['hint'], ['hint'], ['hint'], ['hint'], ['hint'], ['hint'], ['hint']]} width={190} compact />,
  'ear-melody': () => <Staff clef="treble" columns={['C4', 'D4', 'E4', 'C4', 'G4'].map((n) => [P(n)])} width={170} compact />,
  rhythm: () => <RhythmStaff bars={[[{ notes: [{ t: 12 }] }, { notes: [{ t: 6 }, { t: 6 }] }, { notes: [{ t: 9 }, { t: 3 }] }, { notes: [{ t: 12, rest: true }] }]]} timeSig={[4, 4]} width={190} height={70} compact />,
  'keysig-id': () => <Staff clef="treble" keySig={KEYS[3]} columns={[]} width={150} compact />,
  'key-id': () => <Keyboard startMidi={60} octaves={1} marks={{ 64: 'target' }} showC={false} />,
  'key-find': () => <Keyboard startMidi={60} octaves={1} marks={{ 67: 'target' }} showC={false} />,
};

const EAR_GLYPH = { timbre: '〰', nashville: '1·4·5', form: 'ABA', transpose: '⇅', 'score-terms': 'p < f', excerpt: '♩ ♫ ♪', 'ear-feature': 'ƒ', 'ear-texture': '≡', 'ear-tonality': '◐', 'ear-metre': '¾', 'ear-cadence': '♫', 'ear-interval': '♩♪', 'ear-chord': '♬', 'ear-scale': '♪♪♪' };

function DrillCard({ id }) {
  const d = getDrill(id);
  const Preview = PREVIEW[id];
  return (
    <Link to={`/drill/${id}`} className={`drill-tile stage-${d.stage}`}>
      <span className="drill-tile-preview" aria-hidden="true">{Preview ? <Preview /> : <span className="ear-glyph">{EAR_GLYPH[id] || '♪'}</span>}</span>
      <span className="drill-tile-kind">{d.kind || (d.ear ? 'Ear training' : 'Recognition')}</span>
      <span className="drill-tile-title">{d.title}</span>
      <span className="drill-tile-text">{d.blurb}</span>
    </Link>
  );
}

function SetCard({ id }) {
  const set = SETS[id];
  const st = useProgress();
  const done = set.items.filter((it) => st.items[it.id]).length;
  const counts = DIFFICULTIES.map((d) => [d, set.items.filter((it) => it.difficulty === d.key).length]);
  const sugg = suggestLevel(st, `set:${id}`);
  return (
    <Card className={`set-card stage-${set.stage}`}>
      <div className="row between">
        <StagePill stage={set.stage} />
        <span className="small muted">{set.items.length}+ tasks · {done} done</span>
      </div>
      <h3 className="set-title">{set.title}</h3>
      <p>{set.blurb}</p>
      <p className="small muted why">{set.why}</p>
      <div className="row gap wrap mt">
        <Link className="btn btn-primary" to={`/practice/${id}`}>Start a random set</Link>
        {id !== 'listening' && <Link className="btn btn-ghost btn-small" to={`/worksheet/${id}${sugg?.count >= 6 ? `?difficulty=${DIFFICULTIES[sugg.level - 1].key}` : ''}`} title="A printable worksheet with an answer key">Print a worksheet</Link>}
      </div>
      <div className="set-levels" aria-label="Practise at a level">
        {counts.map(([d, n]) => (
          <Link key={d.key} className={`set-level lv-${d.n}`} to={`/practice/${id}?difficulty=${d.key}`} title={`${d.note}${n ? ` · ${n} written tasks + generated tasks` : ' · generated tasks'}`}>
            <span className="level-n">{d.short}</span><span className="level-name">{d.name}</span>
            {sugg?.level === d.n && sugg.count >= 6 && <span className="level-sug" title={sugg.reason}>{sugg.dir === 'up' ? '▲ ' : sugg.dir === 'down' ? '▼ ' : ''}Suggested</span>}
          </Link>
        ))}
      </div>
    </Card>
  );
}

function ExamSkillsFilter() {
  const set = SETS['exam-skills'];
  const songIds = [...new Set(set.items.map((i) => i.song))];
  const kinds = [...new Set(set.items.map((i) => i.kind))];
  return (
    <section>
      <h2 className="section-title">Practice Exam Skills — build one response at a time</h2>
      <div className="chips">
        {songIds.map((id) => (
          <Link key={id} className="chip" to={`/practice/exam-skills?song=${id}`}>{getSongTitle(id)} <span className="muted">· {set.items.filter((i) => i.song === id).length} tasks</span></Link>
        ))}
      </div>
      <p className="small muted mt">Or practise one part across every question:</p>
      <div className="chips">
        {kinds.map((k) => <Link key={k} className="chip" to={`/practice/exam-skills?kind=${k}`}>{FILTER_LABELS.kind[k]}</Link>)}
      </div>
    </section>
  );
}

function TopicFilter({ setId }) {
  const set = SETS[setId];
  const cats = [...new Set(set.items.map((i) => i.category))];
  return (
    <section>
      <h2 className="section-title">Practise by topic</h2>
      <div className="chips">
        {cats.map((c) => (
          <Link key={c} className="chip" to={`/practice/${setId}?category=${c}`}>
            {FILTER_LABELS.category[c] || c} <span className="muted">· {set.items.filter((i) => i.category === c).length}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ThemeLesson() {
  const [level, setLevel] = useState(1);
  return (
    <section className="lesson">
      <div className="lesson-head">
        <p className="eyebrow">Core lesson</p>
        <h2 className="h2">Theme ≠ Argument</h2>
        <p>A theme is a broad topic. An argument is a specific claim about that topic that you can prove with musical evidence. Step through the levels.</p>
      </div>
      <ol className="theme-ladder">
        {THEME_LADDER_EXAMPLE.map((l) => (
          <li key={l.level} className={`tl-step ${l.level <= level ? 'shown' : ''}`} aria-hidden={l.level > level}>
            <span className="tl-level">Level {l.level} · {l.label}</span>
            <span className="tl-text">{l.level <= level ? l.text : '…'}</span>
          </li>
        ))}
      </ol>
      <div className="row gap">
        {level < 5 ? <button className="btn btn-secondary" onClick={() => setLevel(level + 1)}>Next level →</button> : <button className="btn btn-ghost" onClick={() => setLevel(1)}>Start again</button>}
      </div>
      <div className="two-col mt">
        <div>
          <h3 className="h3">An argument makes a claim about…</h3>
          <ul className="tidy">{ARGUMENT_DIRECTIONS.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
        <div>
          <h3 className="h3">A strong argument is…</h3>
          <dl className="qualities">
            {ARGUMENT_QUALITIES.map((q) => (
              <div key={q.key}><dt>{q.label}</dt><dd>{q.text}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="chips mt">
        {Object.entries(FILTER_LABELS.kind).map(([k, label]) => (
          <Link key={k} className="chip" to={`/practice/theme-argument?kind=${k}`}>{label}</Link>
        ))}
      </div>
    </section>
  );
}

function VerbsPanel() {
  return (
    <details className="verbs">
      <summary>Reference: analytical verbs are not interchangeable</summary>
      <dl className="verb-list">
        {analyticalVerbs.map((v) => (
          <div key={v.verb}><dt>{v.verb}</dt><dd>{v.meaning}<span className="small muted"> — {v.use}</span></dd></div>
        ))}
      </dl>
    </details>
  );
}

function FactInterpretArgue() {
  return (
    <div className="fia">
      <div><span className="fia-label">Musical fact</span><p>The melody descends.</p></div>
      <div><span className="fia-label">Interpretation</span><p>The descending melody may create a sense of sadness.</p></div>
      <div><span className="fia-label">Argument</span><p>The descending melody contributes to the presentation of heartbreak as emotionally painful and unresolved.</p></div>
    </div>
  );
}

export default function SectionPage({ id }) {
  const s = SECTIONS[id];
  return (
    <div className="page">
      <PageHeader eyebrow={s.eyebrow} title={s.title} lede={s.lede}>
        <StageBar current={s.stage} />
      </PageHeader>

      {s.progression && (
        <section className="progression" aria-label="Analytical progression">
          {s.progression.map((p, i) => (
            <span key={p} className="prog-step">{p}{i < s.progression.length - 1 && <span className="prog-arrow" aria-hidden="true">→</span>}</span>
          ))}
        </section>
      )}

      {s.drills && (
        <section>
          <div className="row between wrap section-title-row">
            <h2 className="section-title">Skill drills</h2>
            <span className="small muted">Endless random questions · instant feedback · adjustable settings</span>
          </div>
          <div className="drill-grid">{s.drills.map((d) => <DrillCard key={d} id={d} />)}</div>
        </section>
      )}

      {s.themeLesson && <ThemeLesson />}
      {s.note && <Callout title="About these excerpts">{s.note}</Callout>}
      {id === 'analyse' && (
        <Callout title="No feature has one fixed meaning">
          <p>Interpretation depends on context, the combination with other elements, lyrics, structure, performance and purpose. Distinguish between:</p>
          <FactInterpretArgue />
        </Callout>
      )}

      <section>
        <h2 className="section-title">Practice sets</h2>
        <div className="card-grid">
          {s.sets.map((setId) => <SetCard key={setId} id={setId} />)}
          {(s.links || []).map((l) => (
            <Link key={l.to} to={l.to} className={`card set-card link-card stage-${l.stage}`}>
              <StagePill stage={l.stage} />
              <h3 className="set-title">{l.title}</h3>
              <p>{l.blurb}</p>
              <span className="btn btn-secondary mt">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      {s.topicFilter && <TopicFilter setId="theory" />}
      {s.examSkills && <ExamSkillsFilter />}
      {id === 'analyse' && <VerbsPanel />}
    </div>
  );
}
