// MOCK EXAM BUILDER — choose a level, how many questions in each section, a written task and the time.
import { useState } from 'react';
import { LEVELS } from '../data/levels.js';
import { SECTIONS, WRITING_TASKS, DEFAULT_CONFIG, suggestedMinutes, encodeConfig, decodeConfig } from '../data/mockExam.js';
import { PageHeader, Card, Button } from '../components/ui.jsx';
import { navigate } from '../utils/router.jsx';
import { useProgress } from '../utils/progress.js';
import { suggestOverallLevel } from '../utils/adaptive.js';

const STORE = 'met-mock-config';
function loadConfig() {
  try { const s = localStorage.getItem(STORE); return s ? decodeConfig(s) : null; } catch { return null; }
}

const PRESETS = [
  { label: 'Quick check', note: '≈15 min', cfg: { theory: 4, listening: 3, score: 0, analysis: 3, writing: 'none' } },
  { label: 'Theory & aural', note: '≈35 min', cfg: { theory: 12, listening: 8, score: 1, analysis: 0, writing: 'none' } },
  { label: 'Balanced paper', note: '≈50 min', cfg: { theory: 8, listening: 6, score: 1, analysis: 6, writing: 'paragraph' } },
  { label: 'Full mock', note: '≈2 h', cfg: { theory: 12, listening: 8, score: 2, analysis: 8, writing: 'response' } },
];

function Stepper({ value, max, onChange, label, unit }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="btn btn-ghost btn-small" onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} aria-label={`Fewer ${label}`}>−</button>
      <span className="stepper-val" aria-live="polite">{value}<span className="small muted"> {unit}{value === 1 ? '' : 's'}</span></span>
      <button type="button" className="btn btn-ghost btn-small" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>+</button>
    </div>
  );
}

export default function MockBuilder() {
  const st = useProgress();
  const sugg = suggestOverallLevel(st);
  const [cfg, setCfg] = useState(() => loadConfig() || { ...DEFAULT_CONFIG, level: sugg?.level || DEFAULT_CONFIG.level, minutes: suggestedMinutes(DEFAULT_CONFIG) });
  const [ownTime, setOwnTime] = useState(false);
  const minutes = ownTime ? cfg.minutes : suggestedMinutes(cfg);
  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));
  const objective = SECTIONS.reduce((t, s) => t + (s.key === 'score' ? 0 : cfg[s.key]), 0);
  const empty = objective === 0 && cfg.score === 0 && cfg.writing === 'none';

  const start = () => {
    const final = { ...cfg, minutes };
    try { localStorage.setItem(STORE, encodeConfig(final)); } catch { /* storage unavailable */ }
    navigate(`/exam/custom?c=${encodeConfig(final)}&attempt=${Date.now().toString(36)}`);
  };

  return (
    <div className="page narrow">
      <PageHeader eyebrow="Exam Mode" title="Build a mock exam" lede="Choose a level and what goes in the paper. Every paper is generated fresh, and every question is marked when you submit." />

      <Card>
        <h2 className="h3">Level</h2>
        <div className="level-row" role="radiogroup" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.n} type="button" role="radio" aria-checked={cfg.level === l.n} className={`level-btn lv-${l.n} ${cfg.level === l.n ? 'on' : ''}`} onClick={() => set({ level: l.n })} title={l.note}>
              <span className="level-n">Level {l.n}{sugg?.level === l.n && <span className="level-sug">Suggested</span>}</span><span className="level-name">{l.name}</span>
            </button>
          ))}
        </div>
        <p className="small muted">{LEVELS[cfg.level - 1].note}.{sugg && <> Suggested for you: <strong>Level {sugg.level}</strong> — {sugg.reason}</>}</p>
      </Card>

      <Card>
        <h2 className="h3">Start from</h2>
        <div className="row gap wrap">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className="chip-btn" onClick={() => { set(p.cfg); setOwnTime(false); }}>
              <strong>{p.label}</strong> <span className="small muted">{p.note}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="h3">Sections</h2>
        <div className="mock-sections">
          {SECTIONS.map((s) => (
            <div key={s.key} className={`mock-section ${cfg[s.key] ? '' : 'off'}`}>
              <div>
                <p className="mock-section-title"><span className="mock-letter">{s.letter}</span> {s.title}</p>
                <p className="small muted">{s.blurb}</p>
              </div>
              <Stepper value={cfg[s.key]} max={s.max} label={s.title} unit={s.unit || 'question'} onChange={(v) => set({ [s.key]: v })} />
            </div>
          ))}
        </div>
        <h3 className="field-label mt">E · Written task</h3>
        <div className="mock-writing" role="radiogroup" aria-label="Written task">
          {WRITING_TASKS.map((w) => (
            <label key={w.key} className={`mock-writing-opt ${cfg.writing === w.key ? 'on' : ''}`}>
              <input type="radio" name="mock-writing" checked={cfg.writing === w.key} onChange={() => set({ writing: w.key })} />
              <span><strong>{w.title}</strong>{w.minutes ? <span className="small muted"> · about {w.minutes} min</span> : null}{w.blurb && <span className="small muted block">{w.blurb}</span>}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="h3">Time</h2>
        <label className="row gap"><input type="checkbox" checked={cfg.timed} onChange={(e) => set({ timed: e.target.checked })} /> Timed</label>
        {cfg.timed && (
          <div className="row gap wrap mt">
            {ownTime ? (
              <label className="row gap">
                <input className="input mock-minutes" type="number" min={5} max={240} value={cfg.minutes} onChange={(e) => set({ minutes: Math.max(5, Math.min(240, Number(e.target.value) || 5)) })} aria-label="Minutes" /> minutes
              </label>
            ) : (
              <p><strong>{minutes} minutes</strong> <span className="small muted">— suggested for this paper</span></p>
            )}
            <button type="button" className="btn btn-ghost btn-small" onClick={() => { if (!ownTime) set({ minutes }); setOwnTime(!ownTime); }}>{ownTime ? 'Use suggested time' : 'Set my own time'}</button>
          </div>
        )}
      </Card>

      <div className="row gap wrap mt">
        <Button onClick={start} disabled={empty}>Start mock exam</Button>
        <Button variant="secondary" disabled={empty || (cfg.theory + cfg.score + cfg.analysis === 0 && cfg.writing === 'none')} onClick={() => navigate(`/worksheet/mock?c=${encodeConfig({ ...cfg, minutes })}&attempt=${Date.now().toString(36)}`)}>Print as a worksheet</Button>
        <span className="small muted">
          {[cfg.theory + cfg.listening + cfg.analysis > 0 && `${cfg.theory + cfg.listening + cfg.analysis} questions`, cfg.score > 0 && `${cfg.score} score excerpt${cfg.score > 1 ? 's' : ''}`, cfg.writing !== 'none' && 'a written task'].filter(Boolean).join(' + ') || 'Add at least one section'}
        </span>
      </div>
    </div>
  );
}
