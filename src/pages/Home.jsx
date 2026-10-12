import { useState } from 'react';
import { Link } from '../utils/router.jsx';
import { useProgress, getRecommendation, SKILL_GROUPS, skillPercent, SKILLS } from '../utils/progress.js';
import { summarize, strengthsAndWeaknesses } from '../utils/stats.js';
import { AccBar, Trend } from './StatsPage.jsx';
import { ButtonLink, Card, StagePill } from '../components/ui.jsx';
import { dueForReview, nextReviewIn } from '../utils/adaptive.js';

const NAV_CARDS = [
  { to: '/theory', title: 'Theory', text: 'Learn and practise musical concepts.', stage: 'know' },
  { to: '/listen', title: 'Listen', text: 'Identify musical features by listening.', stage: 'hear' },
  { to: '/analyse', title: 'Analyse', text: 'Develop musical analysis skills.', stage: 'explain' },
  { to: '/connect', title: 'Connect', text: 'Link features to meaning, the theme and each other.', stage: 'connect' },
  { to: '/argue', title: 'Argue', text: 'Develop analytical arguments from themes and evidence.', stage: 'argue' },
  { to: '/write', title: 'Write', text: 'Practise analytical writing.', stage: 'write' },
  { to: '/exam', title: 'Exam Mode', text: 'Complete timed exam-style activities.', stage: null },
];

function timeAgo(t) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

const REC_KEY = 'met-hide-rec';
const readHidden = () => { try { return localStorage.getItem(REC_KEY) === '1'; } catch { return false; } };
const writeHidden = (v) => { try { v ? localStorage.setItem(REC_KEY, '1') : localStorage.removeItem(REC_KEY); } catch { /* storage unavailable */ } };

function ReviewToday({ st }) {
  const due = dueForReview(st);
  const next = due.length ? null : nextReviewIn(st);
  if (!due.length && !next) return null;
  return (
    <section>
      <h2 className="section-title">Review today</h2>
      {due.length ? (
        <>
          <p className="small muted">Topics come back after a gap: weaker ones after a day or two, stronger ones after a couple of weeks. A quick revisit now makes them stick.</p>
          <ul className="review-list">
            {due.map((r) => (
              <li key={r.key}>
                <Link to={r.href} className="review-row">
                  <span className={`review-dot ${r.pct < 70 ? 'weak' : 'ok'}`} aria-hidden="true" />
                  <span className="review-label">{r.label}</span>
                  <span className="review-meta">{r.reason}</span>
                  <span className="review-go" aria-hidden="true">Review →</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="muted">Nothing due today. Your next review comes up in {next} day{next === 1 ? '' : 's'}.</p>
      )}
    </section>
  );
}

export default function Home() {
  const st = useProgress();
  const [recHidden, setRecHidden] = useState(readHidden);
  const hideRec = (v) => { setRecHidden(v); writeHidden(v); };
  const rec = getRecommendation(st);
  const anyProgress = SKILLS.some((s) => skillPercent(st, s.key) !== null);

  return (
    <div className="page home">
      <section className="hero hero-solo">
        <div>
          <p className="eyebrow">Your music exam coach</p>
          <h1 className="title display">From knowing music to <em>writing</em> about it.</h1>
          <p className="lede">Every exercise here moves you one step along the path examiners reward: from naming a feature to arguing what it means.</p>
        </div>
      </section>

      <section className={`home-grid ${recHidden ? 'solo' : ''}`}>
        {!recHidden && <Card className="rec-card">
          <div className="row between rec-head">
            <p className="eyebrow">What should I practise?</p>
            <button type="button" className="rec-dismiss" aria-label="Dismiss recommendation" title="Dismiss" onClick={() => hideRec(true)}>×</button>
          </div>
          <h2 className="rec-title">{rec.title}</h2>
          <p>{rec.message}</p>
          {rec.strongest && <p className="small muted">Your strongest area is {rec.strongest.label.toLowerCase()} ({rec.strongest.pct}%).</p>}
          <ButtonLink to={rec.href}>Practise {rec.skill.label} →</ButtonLink>
        </Card>}

        <Card className="progress-card">
          <div className="row between">
            <h2 className="h3">Your stats</h2>
            <span className="row gap">
              {recHidden && <button type="button" className="linkish small" onClick={() => hideRec(false)}>Show practice suggestion</button>}
              <Link to="/stats" className="small">All stats →</Link>
            </span>
          </div>
          <table className="home-stats">
            <thead><tr><th scope="col">Area</th><th scope="col">Answered</th><th scope="col">Accuracy (last 20)</th><th scope="col">Trend</th></tr></thead>
            <tbody>
              {SKILL_GROUPS.map((g) => {
                const parts = g.skills.map((k) => summarize(st.skills[k])).filter(Boolean);
                const answered = parts.reduce((n, p) => Math.max(n, p.attempts), 0); // one question can train several skills — avoid double counting
                const recent = parts.length ? Math.round(parts.reduce((n, p) => n + p.recent, 0) / parts.length) : null;
                const trends = parts.map((p) => p.trend).filter((t) => t !== null);
                return (
                  <tr key={g.label}>
                    <th scope="row">{g.label}</th>
                    <td className="num">{answered}</td>
                    <td><AccBar value={recent} label={g.label} /></td>
                    <td><Trend value={trends.length ? Math.round(trends.reduce((a, b) => a + b, 0) / trends.length) : null} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(() => {
            const { strengths, weaknesses } = strengthsAndWeaknesses(st);
            return (strengths[0] || weaknesses[0]) ? (
              <p className="small mt">
                {strengths[0] && <><span className="verdict-icon strong" aria-hidden="true">▲</span> Strongest: <Link to={strengths[0].href}>{strengths[0].label}</Link> ({strengths[0].recent}%) </>}
                {weaknesses[0] && <><br /><span className="verdict-icon weak" aria-hidden="true">▼</span> Weakest: <Link to={weaknesses[0].href}>{weaknesses[0].label}</Link> ({weaknesses[0].recent}%)</>}
              </p>
            ) : null;
          })()}
          {!anyProgress && <p className="small muted">Your accuracy, answer counts and trends appear here as you practise — for every skill, theory topic and drill.</p>}
        </Card>
      </section>

      <ReviewToday st={st} />

      <section>
        <h2 className="section-title">Practise</h2>
        <div className="card-grid nav-grid">
          {NAV_CARDS.map((c) => (
            <Link key={c.to} to={c.to} className={`nav-card ${c.stage ? 'stage-' + c.stage : 'stage-exam'}`}>
              {c.stage ? <StagePill stage={c.stage} /> : <span className="pill pill-exam">Timed</span>}
              <span className="nav-card-title">{c.title}</span>
              <span className="nav-card-text">{c.text}</span>
              <span className="nav-card-go" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Continue practising</h2>
        {st.activity.length === 0 ? (
          <p className="muted">Your recent sessions will appear here.</p>
        ) : (
          <ul className="activity">
            {st.activity.slice(0, 6).map((a, i) => (
              <li key={i}>
                <Link to={a.href} className="activity-row">
                  {a.stage && <StagePill stage={a.stage} />}
                  <span className="activity-title">{a.title}</span>
                  <span className="activity-meta">{a.count} {a.count === 1 ? 'task' : 'tasks'} · {Math.round(a.score * 100)}% · {timeAgo(a.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
