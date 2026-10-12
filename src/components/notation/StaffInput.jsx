// Interactive staff: the student WRITES notes. Column 0 can hold a given note; each other column
// takes one note. Click (or tap) a line or space in a column to place a note there with the current
// accidental. Keyboard: Tab to a column, ↑/↓ to move its note, Delete to clear.
import { useRef, useState } from 'react';
import { dia, fromDia, LETTERS, ACC_TEXT } from '../../utils/music.js';
import { Accidental, WholeNote, TrebleClef, BassClef, ledgerYs, yFor, TOP, S, BOTTOM_LINE } from './Staff.jsx';

const H = S / 2;
const VIEW_Y = 26;
const VIEW_H = 114;

export default function StaffInput({ clef = 'treble', given = null, count, values, onChange, active, onActive, acc, disabled, tones = [], width = 560, label = 'Staff — click to write notes' }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // { col, d }
  const cols = (given ? 1 : 0) + count;
  const startX = 70;
  const step = (width - startX - 26) / cols;
  const colX = (i) => startX + step * (i + 0.5);
  const bottom = BOTTOM_LINE[clef];
  const minD = bottom - 4;
  const maxD = bottom + 12;

  const toSvg = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  const locate = (e) => {
    const p = toSvg(e);
    const i = Math.floor((p.x - startX) / step) - (given ? 1 : 0);
    if (i < 0 || i >= count) return null;
    const d = Math.max(minD, Math.min(maxD, Math.round(bottom + 8 - (p.y - TOP) / H)));
    return { col: i, d };
  };
  const place = (i, d, a = acc) => {
    const next = values.slice();
    next[i] = fromDia(d, a);
    onChange(next);
  };

  const onClick = (e) => {
    if (disabled) return;
    const loc = locate(e);
    if (!loc) return;
    place(loc.col, loc.d);
    onActive(Math.min(loc.col + 1, count - 1));
  };
  const onKey = (i) => (e) => {
    if (disabled) return;
    const cur = values[i];
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const base = cur ? dia(cur) : (given ? dia(given) + i + 1 : bottom + 4);
      const d = cur ? base + (e.key === 'ArrowUp' ? 1 : -1) : base;
      place(i, Math.max(minD, Math.min(maxD, d)), cur ? cur.a : acc);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      const next = values.slice(); next[i] = null; onChange(next);
    }
  };

  const notes = [...(given ? [{ n: given, given: true }] : []), ...values.map((n, i) => ({ n, i }))];

  return (
    <svg ref={svgRef} className={`staff staff-input ${disabled ? 'is-disabled' : ''}`} viewBox={`0 ${VIEW_Y} ${width} ${VIEW_H}`} role="group" aria-label={label}
      onClick={onClick} onMouseMove={(e) => !disabled && setHover(locate(e))} onMouseLeave={() => setHover(null)}>
      {Array.from({ length: count }, (_, i) => {
        const x = colX(i + (given ? 1 : 0));
        return <rect key={'c' + i} x={x - step / 2 + 2} y={VIEW_Y} width={step - 4} height={VIEW_H} rx="6" className={`si-col ${active === i && !disabled ? 'on' : ''}`} />;
      })}
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="4" x2={width - 4} y1={TOP + i * S} y2={TOP + i * S} className="staff-line" />)}
      <line x1="4" x2="4" y1={TOP} y2={TOP + 4 * S} className="staff-line" />
      <line x1={width - 4} x2={width - 4} y1={TOP} y2={TOP + 4 * S} className="staff-line bar" />
      {clef === 'treble' ? <TrebleClef x={10} /> : <BassClef x={12} />}

      {notes.map(({ n, given: g, i }, k) => {
        const x = colX(k);
        if (!n) {
          return (
            <g key={k} tabIndex={disabled ? -1 : 0} role="button" aria-label={`Note ${i + (given ? 2 : 1)}: empty. Use the arrow keys to write a note.`}
              onFocus={() => onActive(i)} onKeyDown={onKey(i)} className="si-slot">
              <text x={x} y={TOP + 4 * S + 34} textAnchor="middle" className="si-num">{i + (given ? 2 : 1)}</text>
            </g>
          );
        }
        const d = dia(n);
        const y = yFor(d, clef);
        const tone = g ? undefined : tones[i];
        return (
          <g key={k} tabIndex={g || disabled ? -1 : 0} role={g ? undefined : 'button'}
            aria-label={g ? `Given note ${LETTERS[n.l]}${ACC_TEXT[n.a]}${n.o}` : `Note ${i + (given ? 2 : 1)}: ${LETTERS[n.l]}${ACC_TEXT[n.a]}${n.o}. Arrow keys move it.`}
            onFocus={g ? undefined : () => onActive(i)} onKeyDown={g ? undefined : onKey(i)} className={g ? 'si-given' : 'si-slot'}>
            {ledgerYs(d, clef).map((ly) => <line key={ly} x1={x - 11} x2={x + 11} y1={ly} y2={ly} className="staff-line ledger" />)}
            {n.a !== 0 && <Accidental a={n.a} x={x - 16} y={y} />}
            <WholeNote x={x} y={y} tone={tone} />
            {!g && <text x={x} y={TOP + 4 * S + 34} textAnchor="middle" className="si-num">{i + (given ? 2 : 1)}</text>}
          </g>
        );
      })}

      {hover && !disabled && (() => {
        const x = colX(hover.col + (given ? 1 : 0));
        const y = yFor(hover.d, clef);
        return (
          <g className="si-ghost" pointerEvents="none">
            {ledgerYs(hover.d, clef).map((ly) => <line key={ly} x1={x - 11} x2={x + 11} y1={ly} y2={ly} className="staff-line ledger" />)}
            {acc !== 0 && <Accidental a={acc} x={x - 16} y={y} />}
            <WholeNote x={x} y={y} />
          </g>
        );
      })()}
    </svg>
  );
}
