import { songs } from '../data/songs/songs.js';
import { allItems, SETS } from '../data/index.js';
import { PageHeader, Card, DifficultyTag } from '../components/ui.jsx';
import { Link } from '../utils/router.jsx';

export default function Songs() {
  const items = allItems();
  return (
    <div className="page">
      <PageHeader eyebrow="Song library" title="Repertoire" lede="Recognisable songs used throughout the exercises. Notes describe musical characteristics only — listen to the recordings yourself to gather evidence." />
      <div className="song-list">
        {songs.map((s) => {
          const linked = items.filter((i) => i.song === s.id);
          const bySet = [...new Set(linked.map((i) => i.setId))];
          return (
            <Card key={s.id} className="song">
              <div className="row between wrap">
                <div>
                  <h2 className="set-title">{s.title}</h2>
                  <p className="muted">{s.artist} · {s.year} · {s.genre}</p>
                </div>
                <DifficultyTag difficulty={s.difficulty} />
              </div>
              <div className="chips">{s.themes.map((t) => <span key={t} className="tag cap">{t}</span>)}</div>
              <h3 className="h4">Musical characteristics</h3>
              <ul className="tidy">{s.characteristics.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="small"><strong>Analytical angle:</strong> {s.analysisNote}</p>
              <p className="small muted">Terminology: {s.terminology.join(', ')}</p>
              {bySet.length > 0 && (
                <p className="small">Appears in: {bySet.map((id, i) => <span key={id}>{i > 0 && ' · '}<Link to={`/practice/${id}`}>{SETS[id].title}</Link></span>)}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
