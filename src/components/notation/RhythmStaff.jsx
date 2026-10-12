// Rhythm notation on a single-line (percussion) staff, drawn as plain SVG.
// Durations are in ticks: 12 = crotchet (quarter note). 48 semibreve, 36 dotted minim, 24 minim, 18 dotted crotchet,
// 12 crotchet, 9 dotted quaver, 6 quaver, 4 triplet quaver, 3 semiquaver.
// bars: [[group, …], …]; group: { notes: [{ t: ticks, rest?: true }], triplet?: true }

const LINE_Y = 44;
const STEM = 28;

function Head({ x, hollow }) {
  return (
    <g>
      <ellipse cx={x} cy={LINE_Y} rx="6.4" ry="4.6" transform={`rotate(-20 ${x} ${LINE_Y})`} className={hollow ? 'rs-hollow' : 'glyph-fill'} />
      {hollow && <ellipse cx={x} cy={LINE_Y} rx="3.4" ry="2" transform={`rotate(-20 ${x} ${LINE_Y})`} className="glyph-hole" />}
    </g>
  );
}

function Rest({ x, t }) {
  const y = LINE_Y;
  const dot = t === 36 || t === 18 || t === 9 ? <circle cx={x + 11} cy={y - 4} r="1.8" className="glyph-fill" /> : null;
  if (t === 48) return <rect x={x - 6} y={y} width="12" height="5" className="glyph-fill" />;
  if (t === 24 || t === 36) return <g><rect x={x - 6} y={y - 5} width="12" height="5" className="glyph-fill" />{dot}</g>;
  if (t === 12 || t === 18) {
    return (
      <g>
        <path d={`M${x - 2} ${y - 14} L${x + 4} ${y - 7} L${x - 2} ${y - 1} L${x + 4} ${y + 5} C${x - 4} ${y + 2} ${x - 4} ${y + 9} ${x + 1} ${y + 11}`} fill="none" className="glyph-stroke" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {dot}
      </g>
    );
  }
  // quaver / semiquaver rests: one or two hooks on a slanted stem
  const hooks = t === 3 ? 2 : 1;
  return (
    <g>
      <path d={`M${x + 4} ${y - 9} L${x - 1} ${y + 10}`} className="glyph-stroke" strokeWidth="1.6" fill="none" />
      {Array.from({ length: hooks }, (_, i) => (
        <g key={i}>
          <circle cx={x - 3 - i * 1.5} cy={y - 8 + i * 6} r="2.4" className="glyph-fill" />
          <path d={`M${x - 3 - i * 1.5} ${y - 7 + i * 6} Q${x + 1 - i * 1.5} ${y - 5 + i * 6} ${x + 4 - i * 1.5} ${y - 9 + i * 6}`} className="glyph-stroke" strokeWidth="1.4" fill="none" />
        </g>
      ))}
      {dot}
    </g>
  );
}

const beamsFor = (t) => (t === 3 ? 2 : t === 6 || t === 9 || t === 4 ? 1 : 0);

/** Lay out bars → absolute note positions. Spacing grows with duration, but less than proportionally
 * (like engraved music), so semiquavers are not squashed and long notes do not leave huge gaps. */
const weight = (t) => 1 + Math.sqrt(t / 3);
function layout(bars, barTicks, x0, width) {
  const barW = width / bars.length;
  const out = [];
  bars.forEach((bar, b) => {
    const pad = 14;
    const all = bar.flatMap((g) => g.notes);
    const filledTicks = all.reduce((n, x) => n + x.t, 0);
    const total = all.reduce((n, x) => n + weight(x.t), 0) + (filledTicks < barTicks ? weight(barTicks - filledTicks) : 0);
    let acc = 0;
    bar.forEach((g, gi) => {
      const notes = g.notes.map((n) => {
        const x = x0 + b * barW + pad + (total ? (acc / total) * (barW - 2 * pad) : 0);
        acc += weight(n.t);
        return { ...n, x };
      });
      out.push({ ...g, notes, bar: b, gi });
    });
  });
  return { groups: out, barW };
}

export default function RhythmStaff({ bars = [], timeSig = null, width = 420, height = 76, label = 'Rhythm', compact = false, tone = null, center = false }) {
  const sigW = timeSig ? 28 : 0;
  const x0 = 6 + sigW + (timeSig ? 6 : 0);
  const barTicks = timeSig ? (timeSig[0] * 48) / timeSig[1] : Math.max(...bars.map((b) => b.reduce((n, g) => n + g.notes.reduce((m, x) => m + x.t, 0), 0)), 12);
  const { groups, barW } = layout(bars, barTicks, x0, width - x0 - 6);
  if (center) groups.forEach((g) => g.notes.forEach((n) => { n.x = width / 2 - 3; }));
  return (
    <svg className={`rhythm-staff ${compact ? 'compact' : ''} ${tone ? 'tone-' + tone : ''}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <line x1="4" x2={width - 4} y1={LINE_Y} y2={LINE_Y} className="staff-line" />
      {timeSig && (
        <g className="rs-sig">
          <text x={8 + sigW / 2 - 4} y={LINE_Y - 3} textAnchor="middle">{timeSig[0]}</text>
          <text x={8 + sigW / 2 - 4} y={LINE_Y + 15} textAnchor="middle">{timeSig[1]}</text>
        </g>
      )}
      {timeSig && bars.map((_, b) => <line key={'b' + b} x1={x0 + (b + 1) * barW} x2={x0 + (b + 1) * barW} y1={LINE_Y - 14} y2={LINE_Y + 14} className={`staff-line ${b === bars.length - 1 ? 'bar' : ''}`} />)}
      {groups.map((g, k) => {
        const els = [];
        // beam runs: consecutive non-rest notes shorter than a crotchet
        const runs = [];
        let cur = [];
        g.notes.forEach((n, i) => {
          if (!n.rest && beamsFor(n.t) > 0) cur.push(i);
          else { if (cur.length) runs.push(cur); cur = []; }
        });
        if (cur.length) runs.push(cur);
        const beamed = new Set(runs.filter((r) => r.length > 1).flat());
        g.notes.forEach((n, i) => {
          if (n.rest) { els.push(<Rest key={i} x={n.x} t={n.t} />); return; }
          const hollow = n.t >= 24;
          els.push(<Head key={'h' + i} x={n.x} hollow={hollow} />);
          if (n.t !== 48) els.push(<line key={'s' + i} x1={n.x + 5.6} x2={n.x + 5.6} y1={LINE_Y - 1} y2={LINE_Y - STEM} className="glyph-stroke" strokeWidth="1.3" />);
          if (n.t === 36 || n.t === 18 || n.t === 9) els.push(<circle key={'d' + i} cx={n.x + 11} cy={LINE_Y - 1} r="1.8" className="glyph-fill" />);
          if (!beamed.has(i)) {
            for (let f = 0; f < beamsFor(n.t); f++) {
              const y = LINE_Y - STEM + f * 6;
              els.push(<path key={'f' + i + f} d={`M${n.x + 5.6} ${y} q7 6 4 15`} className="glyph-stroke" strokeWidth="1.6" fill="none" />);
            }
          }
        });
        runs.filter((r) => r.length > 1).forEach((r, ri) => {
          const xs = r.map((i) => g.notes[i].x + 5.6);
          const y = LINE_Y - STEM;
          els.push(<rect key={'bm' + ri} x={xs[0] - 0.6} y={y} width={xs[xs.length - 1] - xs[0] + 1.2} height="4" className="glyph-fill" />);
          r.forEach((i, j) => {
            if (beamsFor(g.notes[i].t) < 2) return;
            const nextIs2 = j < r.length - 1 && beamsFor(g.notes[r[j + 1]].t) === 2;
            const prevIs2 = j > 0 && beamsFor(g.notes[r[j - 1]].t) === 2;
            if (nextIs2) els.push(<rect key={`b2${ri}-${j}`} x={xs[j] - 0.6} y={y + 6} width={xs[j + 1] - xs[j] + 1.2} height="4" className="glyph-fill" />);
            else if (!prevIs2) {
              const dir = j === r.length - 1 ? -1 : 1;
              const x1 = dir > 0 ? xs[j] : xs[j] - 8;
              els.push(<rect key={`b2s${ri}-${j}`} x={x1 - 0.6} y={y + 6} width={9.2} height="4" className="glyph-fill" />);
            }
          });
        });
        if (g.triplet) {
          const xs = g.notes.map((n) => n.x + 5.6);
          const y = LINE_Y - STEM - 7;
          els.push(<text key="tr" x={(xs[0] + xs[xs.length - 1]) / 2} y={y} textAnchor="middle" className="rs-tuplet">3</text>);
        }
        return <g key={k}>{els}</g>;
      })}
    </svg>
  );
}
