// Clickable SVG piano keyboard. Keys are identified by MIDI number.
const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_AFTER = { 0: 1, 2: 3, 5: 6, 7: 8, 9: 10 }; // white pc → black pc to its right
const NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * startMidi should be a C. marks: { [midi]: 'target' | 'good' | 'bad' }
 */
export default function Keyboard({ startMidi = 48, octaves = 2, marks = {}, onKey, disabled = false, label = 'Piano keyboard', showC = true }) {
  const W = 30, BH = 74, WH = 120, BW = 18;
  const whites = [];
  const blacks = [];
  for (let o = 0; o < octaves; o++) {
    WHITE_PCS.forEach((pc, i) => {
      const m = startMidi + o * 12 + pc;
      const x = (o * 7 + i) * W;
      whites.push({ m, x, name: NAMES[i] + (Math.floor(m / 12) - 1) });
      if (BLACK_AFTER[pc] !== undefined) blacks.push({ m: m + 1, x: x + W - BW / 2 });
    });
  }
  const endC = startMidi + octaves * 12;
  whites.push({ m: endC, x: octaves * 7 * W, name: 'C' + (Math.floor(endC / 12) - 1) });
  const total = whites.length * W;
  const click = (m) => !disabled && onKey?.(m);
  const keyProps = (m, name) => onKey ? {
    role: 'button', tabIndex: disabled ? -1 : 0, 'aria-label': name,
    onClick: () => click(m),
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(m); } },
  } : {};

  return (
    <div className="keyboard-wrap">
      <svg className={`keyboard ${onKey && !disabled ? 'interactive' : ''}`} viewBox={`0 0 ${total + 2} ${WH + 2}`} aria-label={label} role="group">
        {whites.map((k) => (
          <g key={k.m} {...keyProps(k.m, k.name)}>
            <rect x={k.x + 1} y="1" width={W} height={WH} rx="3" className={`key white ${marks[k.m] ? 'mark-' + marks[k.m] : ''}`} />
            {showC && k.name.startsWith('C') && <text x={k.x + 1 + W / 2} y={WH - 8} textAnchor="middle" className="key-label">{k.name}</text>}
          </g>
        ))}
        {blacks.map((k) => (
          <rect key={k.m} x={k.x + 1} y="1" width={BW} height={BH} rx="2.5" className={`key black ${marks[k.m] ? 'mark-' + marks[k.m] : ''}`} {...keyProps(k.m, 'black key')} />
        ))}
      </svg>
    </div>
  );
}
