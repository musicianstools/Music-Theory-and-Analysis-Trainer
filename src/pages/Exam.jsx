import { Link } from '../utils/router.jsx';
import { EXAM_MODES } from '../data/examModes.js';
import { PageHeader, Callout } from '../components/ui.jsx';

export default function Exam() {
  return (
    <div className="page">
      <PageHeader eyebrow="Exam Mode" title="Practise under exam conditions" lede="Timed, with feedback held until you submit. Use it to build confidence — the review afterwards is where the learning happens." />
      <Link to="/exam/build" className="card exam-card mock-card">
        <span className="exam-time">Build your own</span>
        <h2 className="set-title">Mock exam builder</h2>
        <p>Choose a level from 1 to 5, then mix theory, listening, score reading, analysis and a written task into one timed paper. Results are broken down by section.</p>
        <span className="small muted">Every paper is generated fresh →</span>
      </Link>
      <div className="card-grid">
        {EXAM_MODES.map((m) => (
          <Link key={m.id} to={`/exam/${m.id}`} className="card exam-card">
            <span className="exam-time">{m.planningMinutes ? `${m.planningMinutes} min + ${m.minutes / 60} h` : `${m.minutes} min`}</span>
            <h2 className="set-title">{m.title}</h2>
            <p>{m.blurb}</p>
            <span className="small muted">
              {[m.objective && `${m.objective.count} questions`, m.writing && 'written task'].filter(Boolean).join(' + ')}
            </span>
          </Link>
        ))}
      </div>
      <Callout title="A calm approach">
        You can hide the timer at any point. When time runs out your work is submitted automatically, and you will see explanations for every question.
      </Callout>
    </div>
  );
}
