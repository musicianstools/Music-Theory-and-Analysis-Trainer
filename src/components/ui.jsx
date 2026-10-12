import { Link } from '../utils/router.jsx';
import { STAGES } from '../utils/progress.js';
import { DIFFICULTIES } from '../data/index.js';
import { getSong } from '../data/songs/songs.js';
import VerbText from './VerbText.jsx';

export function PageHeader({ eyebrow, title, lede, children }) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="title">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  );
}

export function Card({ children, className = '', as: As = 'div', ...rest }) {
  return <As className={`card ${className}`} {...rest}>{children}</As>;
}

export function Button({ children, variant = 'primary', size, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ to, children, variant = 'primary', size, className = '' }) {
  return <Link to={to} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${className}`}>{children}</Link>;
}

export function ProgressBar({ value, label, showValue = true, tone }) {
  const v = value ?? 0;
  return (
    <div className={`progress-row ${!label ? 'no-label' : ''} ${!showValue ? 'no-value' : ''}`}>
      {label && <span className="progress-label">{label}</span>}
      <div className={`progress ${tone ? 'progress-' + tone : ''}`} role="progressbar" aria-valuenow={value ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <span style={{ width: `${v}%` }} />
      </div>
      {showValue && <span className="progress-value">{value === null || value === undefined ? '—' : `${value}%`}</span>}
    </div>
  );
}

// Each stage of the progression links to its section.
export const STAGE_HREF = { know: '/theory', hear: '/listen', explain: '/analyse', connect: '/connect', argue: '/argue', write: '/write' };

export function StageBar({ current, compact = false }) {
  const idx = STAGES.findIndex((s) => s.key === current);
  return (
    <ol className={`stagebar ${compact ? 'compact' : ''}`} aria-label="Learning progression">
      {STAGES.map((s, i) => (
        <li key={s.key} className="stage-item">
          <Link to={STAGE_HREF[s.key]} className={`stage stage-${s.key} ${i === idx ? 'active' : ''} ${idx > -1 && i < idx ? 'before' : ''}`} aria-current={i === idx ? 'step' : undefined} title={`${s.label}: ${s.statement}`}>
            <span className="stage-num">{i + 1}</span>
            <span className="stage-label">{s.label}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function StagePill({ stage }) {
  const s = STAGES.find((x) => x.key === stage);
  if (!s) return null;
  return <span className={`pill pill-${stage}`}>{s.label}</span>;
}

export function DifficultyTag({ difficulty }) {
  const d = DIFFICULTIES.find((x) => x.key === difficulty);
  if (!d) return null;
  return <span className={`tag tag-${difficulty}`} title={d.note}>{d.label}</span>;
}

export function Callout({ title, children, tone = 'info' }) {
  return (
    <aside className={`callout callout-${tone}`}>
      {title && <p className="callout-title">{title}</p>}
      <div>{children}</div>
    </aside>
  );
}

/** Shows the context of an exercise: theme, song, evidence, feature, weak statement. */
export function ContextBlock({ item }) {
  const song = item.song ? getSong(item.song) : null;
  const c = item.context || {};
  const theme = item.theme || c.theme;
  const rows = [
    item.examQuestion && ['Exam question', <span className="exam-q"><VerbText text={item.examQuestion} /></span>],
    theme && ['Theme', <span className="cap">{theme}</span>],
    song && ['Song', <span><strong>{song.artist}</strong> — <em>{song.title}</em></span>],
    c.feature && ['Feature', c.feature],
    c.evidence && ['Evidence', c.evidence],
    item.weak && ['Weak statement', <span className="weak-quote">“{item.weak}”</span>],
    item.argument && ['Argument', item.argument],
    item.moment && ['Key moment', item.moment],
    item.stimulus && [item.category === 'teees' ? 'Paragraph' : 'Stimulus', item.stimulus],
  ].filter(Boolean);
  if (!rows.length) return null;
  return (
    <>
      <dl className="context">
        {rows.map(([k, v]) => (
          <div key={k} className="context-row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {song?.moments?.length > 0 && (
        <details className="song-moments">
          <summary>What happens in “{song.title}”</summary>
          <ul>{song.moments.map((m) => <li key={m.where}><strong>{m.where}:</strong> {m.what}</li>)}</ul>
        </details>
      )}
    </>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      <div>{children}</div>
    </div>
  );
}
