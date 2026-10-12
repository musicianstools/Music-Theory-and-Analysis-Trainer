// SVG staff notation: treble/bass clef, key signatures, whole notes, chords, accidentals, ledger lines.
// All glyphs are drawn here as plain SVG shapes (no music font needed).
import { dia, KEYSIG_DIA_TREBLE, keySigAccidental } from '../../utils/music.js';

export const S = 10; // staff space
const H = S / 2;
export const TOP = 60; // y of top staff line
export const STAFF_HEIGHT = 160;
// Visible frame: room for clefs and up to four ledger lines above/below.
const VIEW = { full: [22, 116], compact: [38, 86] };
export const BOTTOM_LINE = { treble: 30, bass: 18 }; // E4, G2

export const yFor = (d, clef) => TOP + (BOTTOM_LINE[clef] + 8 - d) * H;

export function TrebleClef({ x }) {
  return (
    <g transform={`translate(${x} ${TOP})`} className="glyph-stroke">
      <path d="M14 31 C10 31 9.5 26 13 24.5 C18 23 22.5 27.5 21.5 33 C20.5 39.5 13 42.5 8 40 C2.5 37 1.5 29.5 6 23 C10 17 17.5 12.5 18 3 C18.3 -4 16.5 -11 13.5 -12 C10.5 -13 8.5 -6 9.5 0 L16 48 C16.8 54 13 58 9 57 C6 56 5.5 52 8.5 51.5"
        fill="none" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="53.5" r="3" className="glyph-fill" />
    </g>
  );
}

export function BassClef({ x }) {
  return (
    <g transform={`translate(${x} ${TOP})`}>
      <circle cx="5.5" cy="10" r="3.6" className="glyph-fill" />
      <path d="M3.2 8.5 C4 1.5 10 -1 15 0.4 C22 2.4 24.5 10 21.5 17 C18 25 10.5 31 2 35" fill="none" className="glyph-stroke" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="28" cy="5" r="1.9" className="glyph-fill" />
      <circle cx="28" cy="15" r="1.9" className="glyph-fill" />
    </g>
  );
}

/** Accidental glyph centred vertically on y (the note's line/space). */
export function Accidental({ a, x, y }) {
  const t = `translate(${x} ${y})`;
  if (a === 1) {
    return (
      <g transform={t}>
        <path d="M-2.4 -10.5 L-2.4 12 M2.4 -12 L2.4 10.5" className="glyph-stroke" strokeWidth="1.2" fill="none" />
        <path d="M-5 -1.6 L5 -4.6 L5 -1.8 L-5 1.2 Z M-5 5.4 L5 2.4 L5 5.2 L-5 8.2 Z" className="glyph-fill" />
      </g>
    );
  }
  if (a === -1) {
    return (
      <g transform={t}>
        <path d="M-3 -15 L-3 5.2" className="glyph-stroke" strokeWidth="1.3" fill="none" />
        <path d="M-3 5.2 C2.5 1.8 6 -1.2 5 -4.2 C4 -7.2 0 -6 -3 -2.4" className="glyph-stroke" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      </g>
    );
  }
  if (a === 0) {
    return (
      <g transform={t}>
        <path d="M-3 -11.5 L-3 6.5 M3 -6.5 L3 11.5" className="glyph-stroke" strokeWidth="1.2" fill="none" />
        <path d="M-3 -2.6 L3 -5 L3 -2.4 L-3 0 Z M-3 4.6 L3 2.2 L3 4.8 L-3 7.2 Z" className="glyph-fill" />
      </g>
    );
  }
  if (a === 2) {
    return (
      <g transform={t}>
        <path d="M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5" className="glyph-stroke" strokeWidth="1.6" fill="none" />
        <path d="M-4.6 -4.6 h2.6 v2.6 h-2.6 Z M2 -4.6 h2.6 v2.6 h-2.6 Z M-4.6 2 h2.6 v2.6 h-2.6 Z M2 2 h2.6 v2.6 h-2.6 Z" className="glyph-fill" />
      </g>
    );
  }
  if (a === -2) {
    return (
      <g>
        <Accidental a={-1} x={x - 5} y={y} />
        <Accidental a={-1} x={x + 2} y={y} />
      </g>
    );
  }
  return null;
}

export function WholeNote({ x, y, tone }) {
  return (
    <g className={`notehead ${tone ? 'tone-' + tone : ''}`}>
      <ellipse cx={x} cy={y} rx="7" ry="4.8" className="glyph-fill" />
      <ellipse cx={x} cy={y} rx="3.3" ry="2.4" transform={`rotate(-40 ${x} ${y})`} className="glyph-hole" />
    </g>
  );
}

export function ledgerYs(d, clef) {
  const bottom = BOTTOM_LINE[clef];
  const top = bottom + 8;
  const ys = [];
  for (let k = bottom - 2; k >= d; k -= 2) ys.push(yFor(k, clef));
  for (let k = top + 2; k <= d; k += 2) ys.push(yFor(k, clef));
  return ys;
}

/**
 * columns: array of arrays of notes (each column = one chord / harmonic interval, or one note).
 * tones: optional array (same shape) of 'good' | 'bad' | 'hint' to colour noteheads.
 */
export default function Staff({ clef = 'treble', columns = [], keySig = null, width = 300, tones = [], label, compact = false }) {
  const [vy, vh] = compact ? VIEW.compact : VIEW.full;
  const clefW = 44;
  const ksCount = keySig?.count || 0;
  const ksW = ksCount * 11 + (ksCount ? 10 : 0);
  const startX = clefW + ksW + 24;
  const usable = width - startX - 24;
  const colX = (i) => startX + (columns.length === 1 ? usable / 2 : (usable / Math.max(1, columns.length - 1)) * i);

  const ksDias = keySig && ksCount ? KEYSIG_DIA_TREBLE[keySig.type].slice(0, ksCount).map((d) => (clef === 'bass' ? d - 14 : d)) : [];

  return (
    <svg className="staff" viewBox={`0 ${vy} ${width} ${vh}`} role="img" aria-label={label || `${clef} clef staff`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="4" x2={width - 4} y1={TOP + i * S} y2={TOP + i * S} className="staff-line" />
      ))}
      <line x1="4" x2="4" y1={TOP} y2={TOP + 4 * S} className="staff-line" />
      <line x1={width - 4} x2={width - 4} y1={TOP} y2={TOP + 4 * S} className="staff-line bar" />
      {clef === 'treble' ? <TrebleClef x={10} /> : <BassClef x={12} />}
      {ksDias.map((d, i) => <Accidental key={i} a={keySig.type === 'sharp' ? 1 : -1} x={clefW + 12 + i * 11} y={yFor(d, clef)} />)}

      {columns.map((col, ci) => {
        const x = colX(ci);
        const sorted = col.map((n, i) => ({ n, i, d: dia(n) })).sort((p, q) => p.d - q.d);
        // seconds: displace upper note of an adjacent pair to the right
        let prevD = null, prevShift = false;
        const placed = sorted.map((p) => {
          const shift = prevD !== null && p.d - prevD === 1 && !prevShift;
          prevD = p.d; prevShift = shift;
          return { ...p, x: shift ? x + 13 : x, y: yFor(p.d, clef) };
        });
        // accidental columns (top-down), avoid collisions within a 6th
        const accCols = [];
        const accs = [...placed].filter((p) => p.n.showAcc ?? p.n.a !== keySigAccidental(keySig, p.n.l)).sort((p, q) => q.d - p.d).map((p) => {
          let k = 0;
          while ((accCols[k] || []).some((d) => Math.abs(d - p.d) < 6)) k++;
          (accCols[k] = accCols[k] || []).push(p.d);
          return { ...p, ax: x - 15 - k * 11 };
        });
        const ledgers = [...new Set(placed.flatMap((p) => ledgerYs(p.d, clef)))];
        const anyShift = placed.some((p) => p.x !== x);
        return (
          <g key={ci}>
            {ledgers.map((y) => <line key={y} x1={x - 11} x2={x + (anyShift ? 24 : 11)} y1={y} y2={y} className="staff-line ledger" />)}
            {accs.map((p) => <Accidental key={'a' + p.i} a={p.n.a} x={p.ax} y={p.y} />)}
            {placed.map((p) => <WholeNote key={p.i} x={p.x} y={p.y} tone={tones[ci]?.[p.i]} />)}
          </g>
        );
      })}
    </svg>
  );
}
