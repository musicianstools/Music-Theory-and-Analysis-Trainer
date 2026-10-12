import { useState } from 'react';
import { useProgress, SKILLS, STAGES, getRecommendation, resetProgress } from '../utils/progress.js';
import { summarize, strengthsAndWeaknesses, headline, drillBreakdown, THEORY_TOPICS, topicLabel, topicHref, timeAgo, MIN_FOR_VERDICT } from '../utils/stats.js';
import { SETS } from '../data/index.js';
import { EXAM_MODES } from '../data/examModes.js';
import { PageHeader, ButtonLink, Card, Button } from '../components/ui.jsx';
import { Link } from '../utils/router.jsx';

/** Accuracy bar: single-hue magnitude, value always printed beside it. */
export function AccBar({ value, label }) {
  return (
    <span className="accbar" title={value === null ? 'Not attempted' : `${label ? label + ': ' : ''}${value}% accuracy`}>
      <span className="accbar-track"><span className="accbar-fill" style={{ width: `${value ?? 0}%` }} /></span>
      <span className="accbar-val">{value === null ? '—' : `${value}%`}</span>
    </span>
  );
}

export function Trend({ value }) {
  if (value === null || value === undefined) return <span className="trend flat muted">—</span>;
  if (Math.abs(value) < 3) return <span className="trend flat" title="Steady compared with your previous 20 answers">→ steady</span>;
  return value > 0
    ? <span className="trend up" title="Recent 20 answers compared with the 20 before">▲ +{value}</span>
    : <span className="trend down" title="Recent 20 answers compared with the 20 before">▼ {value}</span>;
}

function Verdicts({ st }) {
  const { strengths, weaknesses, eligible } = strengthsAndWeaknesses(st);
  if (!eligible) {
    return <p className="muted">Answer at least {MIN_FOR_VERDICT} questions in a topic and it will appear here as a strength or a weakness.</p>;
  }
  const List = ({ rows, kind }) => (
    <ul className="verdicts">
      {rows.length === 0 && <li className="muted small verdict-empty">{kind === 'strong' ? 'Nothing above 70% yet — keep going.' : 'No topics below 70%. Try a harder level.'}</li>}
      {rows.map((r) => (
        <li key={r.key}>
          <span className={`verdict-icon ${kind}`} aria-hidden="true">{kind === 'strong' ? '▲' : '▼'}</span>
          <Link to={r.href} className="verdict-label">{r.label}</Link>
          <span className="verdict-num">{r.recent}%</span>
          <span className="small muted">{r.attempts} answered</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="two-col">
      <Card className="verdict-card">
        <h3 className="h3"><span className="verdict-icon strong" aria-hidden="true">▲</span> Strengths</h3>
        <List rows={strengths} kind="strong" />
      </Card>
      <Card className="verdict-card">
        <h3 className="h3"><span className="verdict-icon weak" aria-hidden="true">▼</span> Needs work</h3>
        <List rows={weaknesses} kind="weak" />
      </Card>
    </div>
  );
}

function TopicMap({ st }) {
  return (
    <div className="topic-map">
      {THEORY_TOPICS.map((c) => {
        const key = `cat:${c}`;
        const s = summarize(st.topics?.[key]);
        const shade = s ? Math.round(8 + (s.recent / 100) * 32) : 0;
        return (
          <Link key={c} to={topicHref(key)} className={`topic-tile ${s ? '' : 'untried'} ${s && s.attempts >= MIN_FOR_VERDICT ? (s.recent >= 70 ? 'is-strong' : 'is-weak') : ''}`}
            style={s ? { '--shade': `${shade}%` } : undefined} title={s ? `${topicLabel(key)}: ${s.recent}% (last ${Math.min(20, s.attempts)}), ${s.attempts} answered` : `${topicLabel(key)}: not tried yet`}>
            <span className="topic-name">{topicLabel(key)}</span>
            <span className="topic-num">{s ? `${s.recent}%` : 'Not tried'}</span>
            <span className="topic-meta">{s ? `${s.attempts} answered` : 'Practise →'}{s && s.attempts >= MIN_FOR_VERDICT && <span className="topic-flag">{s.recent >= 70 ? ' · ▲' : ' · ▼'}</span>}</span>
          </Link>
        );
      })}
    </div>
  );
}

function SkillTable({ st }) {
  return (
    <div className="stat-table-wrap">
      <table className="stat-table">
        <thead>
          <tr><th scope="col">Skill</th><th scope="col">Answered</th><th scope="col">Recent accuracy <span className="muted">(last 20)</span></th><th scope="col">All-time</th><th scope="col">Trend</th><th scope="col">Last practised</th><th scope="col"><span className="sr-only">Practise</span></th></tr>
        </thead>
        <tbody>
          {STAGES.map((stage) => SKILLS.filter((s) => s.stage === stage.key).map((sk, i) => {
            const s = summarize(st.skills[sk.key]);
            return (
              <tr key={sk.key}>
                <th scope="row">{i === 0 && <span className={`pill pill-${stage.key} stage-tag`}>{stage.label}</span>}{sk.label}</th>
                <td className="num">{s?.attempts ?? 0}</td>
                <td><AccBar value={s?.recent ?? null} label={sk.label} /></td>
                <td className="num">{s ? `${s.allTime}%` : '—'}</td>
                <td><Trend value={s?.trend} /></td>
                <td className="small muted">{timeAgo(s?.last)}</td>
                <td><Link className="small" to={sk.href}>Practise</Link></td>
              </tr>
            );
          }))}
        </tbody>
      </table>
    </div>
  );
}

function DrillStats({ st }) {
  const rows = drillBreakdown(st);
  const tried = rows.filter((r) => r.summary);
  const untried = rows.filter((r) => !r.summary);
  return (
    <>
      {tried.length === 0 && <p className="muted">No drill answers yet. Drill stats break down into detail — e.g. which interval sizes, clefs or chord types you miss most.</p>}
      <div className="drill-stats">
        {tried.map(({ drill, summary, groups }) => (
          <details key={drill.id} className="drill-stat" open={tried.length <= 2}>
            <summary>
              <span className="drill-stat-title">{drill.title}</span>
              <span className="small muted">{summary.attempts} answered</span>
              <AccBar value={summary.recent} label={drill.title} />
              <Trend value={summary.trend} />
            </summary>
            <div className="drill-groups">
              {groups.map((g) => (
                <div key={g.group} className="drill-group">
                  <p className="drill-group-title">By {g.group.toLowerCase()}</p>
                  <ul>
                    {g.rows.map((r) => (
                      <li key={r.value}>
                        <span className="dg-label">{r.value}</span>
                        <AccBar value={r.recent} label={`${g.group}: ${r.value}`} />
                        <span className="small muted dg-n">{r.attempts}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <ButtonLink variant="ghost" size="small" to={`/drill/${drill.id}`}>Open drill →</ButtonLink>
          </details>
        ))}
      </div>
      {untried.length > 0 && (
        <p className="small muted mt">Not tried yet: {untried.map((r, i) => <span key={r.drill.id}>{i > 0 && ' · '}<Link to={`/drill/${r.drill.id}`}>{r.drill.title}</Link></span>)}</p>
      )}
    </>
  );
}

function SetTable({ st }) {
  const sets = Object.keys(SETS).filter((id) => id !== 'theory');
  const exams = EXAM_MODES.map((m) => ({ key: `exam:${m.id}`, label: m.title, href: `/exam/${m.id}` }));
  const rows = [...sets.map((id) => ({ key: `set:${id}`, label: SETS[id].title, href: `/practice/${id}` })), ...exams]
    .map((r) => ({ ...r, s: summarize(st.topics?.[r.key]) }));
  return (
    <div className="stat-table-wrap">
      <table className="stat-table">
        <thead><tr><th scope="col">Practice set / exam</th><th scope="col">Answered</th><th scope="col">Recent accuracy</th><th scope="col">Trend</th><th scope="col">Last</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className={r.s ? '' : 'untried-row'}>
              <th scope="row"><Link to={r.href}>{r.label}</Link></th>
              <td className="num">{r.s?.attempts ?? 0}</td>
              <td><AccBar value={r.s?.recent ?? null} label={r.label} /></td>
              <td><Trend value={r.s?.trend} /></td>
              <td className="small muted">{timeAgo(r.s?.last)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatsPage() {
  const st = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const h = headline(st);
  const rec = getRecommendation(st);
  return (
    <div className="page stats">
      <PageHeader eyebrow="My stats" title="Strengths and weaknesses" lede="Accuracy for every skill, theory topic and drill — recent accuracy uses your last 20 answers, so it shows where you are now." />

      <section className="tiles" aria-label="Summary">
        <div className="tile"><span className="tile-num">{h.answered}</span><span className="tile-label">tasks answered</span></div>
        <div className="tile"><span className="tile-num">{h.accuracy === null ? '—' : `${h.accuracy}%`}</span><span className="tile-label">overall accuracy</span></div>
        <div className="tile"><span className="tile-num">{h.drillAnswers}</span><span className="tile-label">drill questions</span></div>
        <div className="tile"><span className="tile-num">{h.daysPractised}</span><span className="tile-label">days practised</span></div>
        <div className="tile"><span className="tile-num">{h.streak}</span><span className="tile-label">day streak</span></div>
      </section>

      <section>
        <h2 className="section-title">Strengths and weaknesses</h2>
        <Verdicts st={st} />
        <p className="small muted">Based on topics with at least {MIN_FOR_VERDICT} answers. ▲ 70% or more recently · ▼ below 70%.</p>
        <div className="row gap wrap"><span className="small">Suggested next: <strong>{rec.title}</strong></span><ButtonLink size="small" to={rec.href}>Practise →</ButtonLink></div>
      </section>

      <section>
        <h2 className="section-title">Theory topics</h2>
        <p className="small muted">Darker tiles = higher recent accuracy. Click a topic to practise it.</p>
        <TopicMap st={st} />
      </section>

      <section>
        <h2 className="section-title">Skills</h2>
        <SkillTable st={st} />
      </section>

      <section>
        <h2 className="section-title">Skill drills — in detail</h2>
        <DrillStats st={st} />
      </section>

      <section>
        <h2 className="section-title">Practice sets and exams</h2>
        <SetTable st={st} />
      </section>

      <div className="mt">
        {!confirmReset ? (
          <Button variant="ghost" size="small" onClick={() => setConfirmReset(true)}>Reset my stats</Button>
        ) : (
          <div className="row gap wrap">
            <span className="small">Delete all stats saved in this browser?</span>
            <Button size="small" onClick={() => { resetProgress(); setConfirmReset(false); }}>Yes, reset</Button>
            <Button variant="ghost" size="small" onClick={() => setConfirmReset(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}
