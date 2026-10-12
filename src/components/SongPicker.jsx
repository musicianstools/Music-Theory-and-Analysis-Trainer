// Suggests well-known songs for a theme so the student's argument is tied to a specific piece.
import { songsForTheme } from '../data/songs/themeSongs.js';

export default function SongPicker({ theme, value, onChange, label = 'Choose a song to write about' }) {
  const songs = songsForTheme(theme);
  if (!songs.length) return null;
  const chosen = songs.find((s) => s.key === value);
  return (
    <div className="song-picker">
      <p className="field-label">{label}</p>
      <div className="chips" role="radiogroup" aria-label={label}>
        {songs.map((s) => (
          <button key={s.key} type="button" role="radio" aria-checked={value === s.key} className={`chip song-chip ${value === s.key ? 'on' : ''}`} onClick={() => onChange(value === s.key ? null : s.key, s)}>
            <strong>{s.title}</strong>&nbsp;<span className="muted">— {s.artist}</span>
          </button>
        ))}
      </div>
      {chosen ? (
        <div className="listen-for">
          <p className="small"><strong>Listen for in “{chosen.title}”</strong> ({chosen.year}):</p>
          <ul>{chosen.listenFor.map((l) => <li key={l}>{l}</li>)}</ul>
          <p className="small muted">Listen to the song and check these features before you write. Your argument should fit what you hear.</p>
        </div>
      ) : (
        <p className="small muted">Tie your argument to one song — it makes the claim specific and gives you real evidence to point to.</p>
      )}
    </div>
  );
}

/** Starter text tied to a chosen song. */
export function songStarter(song, theme) {
  return `In "${song.title}" (${song.artist}), the composer presents ${theme} as `;
}
