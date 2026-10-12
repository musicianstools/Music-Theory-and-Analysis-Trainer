// A short score: pitched notes WITH rhythm, key and time signatures, bar lines, an optional second (bass) staff,
// and performance markings (dynamics, hairpins, articulations, slurs, tempo and expression text, fermata).
// Durations in ticks (12 = crotchet). Pitches are spelled notes { l, a, o } from utils/music.js.
//
// score = {
//   clef, keySig, timeSig: [4,4], tempo?: 'Allegro',
//   bars: [[ev, …], …]   ev: { t, notes: [note…] | [], rest?, art?: ['staccato'|'accent'|'tenuto'|'marcato'],
//                               dyn?: 'p', text?: 'dolce', fermata?, slur?: 'start'|'end', hair?: 'cresc'|'dim'|'end' },
//   lower?: { clef: 'bass', bars: […] },  final?: 'final' | 'repeat',
//   highlight?: { kind: 'dyn'|'art'|'text'|'hair'|'slur'|'tempo'|'fermata', at: eventIndex }  (index into the upper staff's events)
// }
import { dia, keySigAccidental, KEYSIG_DIA_TREBLE } from '../../utils/music.js';
import { Accidental, TrebleClef, BassClef, BOTTOM_LINE } from './Staff.jsx';

const S = 10;
const H = S / 2;
const TOP = 60;
const STAFF_GAP = 112;
const yFor = (d, clef) => TOP + (BOTTOM_LINE[clef] + 8 - d) * H;
const beamsFor = (t) => (t === 3 ? 2 : t === 6 || t === 9 || t === 4 ? 1 : 0);
const weight = (t) => 1 + Math.sqrt(t / 3);

function ledgers(d, clef) {
  const b = BOTTOM_LINE[clef];
  const out = [];
  for (let k = b - 2; k >= d; k -= 2) out.push(yFor(k, clef));
  for (let k = b + 10; k <= d; k += 2) out.push(yFor(k, clef));
  return out;
}

function Head({ x, y, hollow, whole }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={whole ? 7 : 6} ry="4.4" transform={whole ? undefined : `rotate(-20 ${x} ${y})`} className="glyph-fill" />
      {hollow && <ellipse cx={x} cy={y} rx={whole ? 3.4 : 3.2} ry={whole ? 2.4 : 1.9} transform={`rotate(${whole ? -40 : -20} ${x} ${y})`} className="glyph-hole" />}
    </g>
  );
}

function Rest({ x, t, mid }) {
  const y = mid;
  const dot = [36, 18, 9].includes(t) ? <circle cx={x + 10} cy={y - 4} r="1.7" className="glyph-fill" /> : null;
  if (t === 48) return <rect x={x - 6} y={y - 10} width="12" height="5" className="glyph-fill" />;
  if (t === 24 || t === 36) return <g><rect x={x - 6} y={y - 5} width="12" height="5" className="glyph-fill" />{dot}</g>;
  if (t === 12 || t === 18) return <g><path d={`M${x - 2} ${y - 13} L${x + 4} ${y - 6} L${x - 2} ${y} L${x + 4} ${y + 6} C${x - 4} ${y + 3} ${x - 4} ${y + 10} ${x + 1} ${y + 12}`} fill="none" className="glyph-stroke" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" />{dot}</g>;
  const hooks = t === 3 ? 2 : 1;
  return (
    <g>
      <path d={`M${x + 4} ${y - 8} L${x - 1} ${y + 9}`} className="glyph-stroke" strokeWidth="1.5" fill="none" />
      {Array.from({ length: hooks }, (_, i) => <circle key={i} cx={x - 3 - i * 1.5} cy={y - 7 + i * 6} r="2.3" className="glyph-fill" />)}
      {dot}
    </g>
  );
}

/** x position for every onset tick in each bar, shared by both staves so they line up. */
function onsetX(bars, lowerBars, barTicks, x0, barW) {
  return bars.map((bar, b) => {
    const ticks = new Set();
    [bar, lowerBars?.[b] || []].forEach((evs) => { let t = 0; evs.forEach((e) => { ticks.add(t); t += e.t; }); });
    const sorted = [...ticks].sort((p, q) => p - q);
    const gaps = sorted.map((t, i) => (i < sorted.length - 1 ? sorted[i + 1] : barTicks) - t);
    const total = gaps.reduce((n, g) => n + weight(g), 0);
    const pad = 16;
    let acc = 0;
    const map = {};
    sorted.forEach((t, i) => { map[t] = x0 + b * barW + pad + (acc / total) * (barW - 2 * pad); acc += weight(gaps[i]); });
    return map;
  });
}

function StaffBody({ bars, clef, keySig, timeSig, xMaps, startX, width, final, beatTicks, markUp, highlight, isUpper }) {
  const els = [];
  const mid = yFor(BOTTOM_LINE[clef] + 4, clef);
  // staff lines, clef, key and time signature
  for (let i = 0; i < 5; i++) els.push(<line key={'l' + i} x1="4" x2={width - 4} y1={TOP + i * S} y2={TOP + i * S} className="staff-line" />);
  els.push(<line key="lb" x1="4" x2="4" y1={TOP} y2={TOP + 4 * S} className="staff-line" />);
  els.push(clef === 'treble' ? <TrebleClef key="c" x={10} /> : <BassClef key="c" x={12} />);
  const ks = keySig && keySig.count ? KEYSIG_DIA_TREBLE[keySig.type].slice(0, keySig.count).map((d) => (clef === 'bass' ? d - 14 : d)) : [];
  ks.forEach((d, i) => els.push(<Accidental key={'k' + i} a={keySig.type === 'sharp' ? 1 : -1} x={52 + i * 10} y={yFor(d, clef)} />));
  const tsX = 52 + ks.length * 10 + 8;
  if (timeSig) {
    els.push(<text key="ts1" x={tsX} y={TOP + 17} className="ss-ts" textAnchor="middle">{timeSig[0]}</text>);
    els.push(<text key="ts2" x={tsX} y={TOP + 37} className="ss-ts" textAnchor="middle">{timeSig[1]}</text>);
  }
  const barW = (width - startX - 6) / bars.length;
  bars.forEach((_, b) => {
    const x = startX + (b + 1) * barW;
    const last = b === bars.length - 1;
    if (last && final === 'repeat') {
      els.push(<circle key={'rd1'} cx={x - 9} cy={TOP + 15} r="2" className="glyph-fill" />, <circle key={'rd2'} cx={x - 9} cy={TOP + 25} r="2" className="glyph-fill" />);
    }
    els.push(<line key={'b' + b} x1={x - (last ? 4 : 0)} x2={x - (last ? 4 : 0)} y1={TOP} y2={TOP + 4 * S} className="staff-line" />);
    if (last) els.push(<rect key="fb" x={x - 3} y={TOP} width="3.5" height={4 * S} className="glyph-fill" />);
  });

  // notes, bar by bar, with accidentals remembered within the bar
  let idx = 0;
  const placed = [];
  bars.forEach((bar, b) => {
    let t = 0;
    const memory = {};
    bar.forEach((ev) => {
      const x = xMaps[b][t];
      const e = { ...ev, x, idx: idx++, bar: b, onset: t };
      if (!ev.rest && ev.notes.length) {
        e.ys = ev.notes.map((n) => yFor(dia(n), clef));
        e.accs = ev.notes.map((n) => {
          const key = `${n.l}${n.o}`;
          const expected = memory[key] ?? keySigAccidental(keySig, n.l);
          memory[key] = n.a;
          return n.a !== expected ? n.a : null;
        });
      }
      placed.push(e);
      t += ev.t;
    });
  });

  // beaming: runs of beamable notes inside one beat (or a 2-beat half bar for 4/4 quavers in pairs)
  const groups = [];
  let cur = [];
  placed.forEach((e, i) => {
    const beamable = !e.rest && beamsFor(e.t) > 0;
    const prev = placed[i - 1];
    const sameBeat = prev && prev.bar === e.bar && Math.floor(prev.onset / beatTicks) === Math.floor(e.onset / beatTicks);
    if (beamable && cur.length && sameBeat) cur.push(e);
    else { if (cur.length > 1) groups.push(cur); cur = beamable ? [e] : []; }
  });
  if (cur.length > 1) groups.push(cur);
  const beamed = new Map();
  groups.forEach((g, gi) => g.forEach((e) => beamed.set(e.idx, gi)));

  const stemDir = (e) => {
    const avg = e.ys.reduce((n, y) => n + y, 0) / e.ys.length;
    return avg > mid ? 'up' : 'down';
  };
  const groupDir = groups.map((g) => {
    const avg = g.flatMap((e) => e.ys).reduce((n, y, _, a) => n + y / a.length, 0);
    return avg > mid ? 'up' : 'down';
  });
  const groupBeamY = groups.map((g, gi) => (groupDir[gi] === 'up' ? Math.min(...g.flatMap((e) => e.ys)) - 30 : Math.max(...g.flatMap((e) => e.ys)) + 30));

  placed.forEach((e) => {
    if (e.rest || !e.notes.length) { els.push(<Rest key={'r' + e.idx} x={e.x} t={e.t} mid={mid} />); return; }
    const hollow = e.t >= 24;
    const whole = e.t === 48;
    e.ys.forEach((y, k) => {
      ledgers(dia(e.notes[k]), clef).forEach((ly) => els.push(<line key={`lg${e.idx}-${k}-${ly}`} x1={e.x - 10} x2={e.x + 10} y1={ly} y2={ly} className="staff-line ledger" />));
      els.push(<Head key={`h${e.idx}-${k}`} x={e.x} y={y} hollow={hollow} whole={whole} />);
      if (e.accs[k] !== null) els.push(<Accidental key={`a${e.idx}-${k}`} a={e.accs[k]} x={e.x - 15} y={y} />);
      if ([36, 18, 9].includes(e.t)) els.push(<circle key={`d${e.idx}-${k}`} cx={e.x + 10} cy={y - ((dia(e.notes[k]) - BOTTOM_LINE[clef]) % 2 === 0 ? 3 : 0)} r="1.7" className="glyph-fill" />);
    });
    if (!whole) {
      const gi = beamed.get(e.idx);
      const dir = gi !== undefined ? groupDir[gi] : stemDir(e);
      const sx = dir === 'up' ? e.x + 5.6 : e.x - 5.6;
      const yEnd = gi !== undefined ? groupBeamY[gi] : dir === 'up' ? Math.min(...e.ys) - 30 : Math.max(...e.ys) + 30;
      const yStart = dir === 'up' ? Math.max(...e.ys) : Math.min(...e.ys);
      els.push(<line key={'s' + e.idx} x1={sx} x2={sx} y1={yStart} y2={yEnd} className="glyph-stroke" strokeWidth="1.3" />);
      e.stem = { x: sx, yEnd, dir };
      if (gi === undefined) {
        for (let f = 0; f < beamsFor(e.t); f++) {
          const fy = dir === 'up' ? yEnd + f * 6 : yEnd - f * 6;
          els.push(<path key={`f${e.idx}-${f}`} d={dir === 'up' ? `M${sx} ${fy} q7 6 4 14` : `M${sx} ${fy} q7 -6 4 -14`} className="glyph-stroke" strokeWidth="1.6" fill="none" />);
        }
      }
    }
  });
  groups.forEach((g, gi) => {
    const dir = groupDir[gi];
    const y = groupBeamY[gi];
    const xs = g.map((e) => e.stem.x);
    const h = dir === 'up' ? 0 : -4;
    els.push(<rect key={'bm' + gi} x={xs[0] - 0.6} y={y + h} width={xs[xs.length - 1] - xs[0] + 1.2} height="4" className="glyph-fill" />);
    g.forEach((e, j) => {
      if (beamsFor(e.t) < 2) return;
      const y2 = dir === 'up' ? y + 6 : y - 10;
      const next2 = j < g.length - 1 && beamsFor(g[j + 1].t) === 2;
      const prev2 = j > 0 && beamsFor(g[j - 1].t) === 2;
      if (next2) els.push(<rect key={`b2${gi}-${j}`} x={xs[j] - 0.6} y={y2} width={xs[j + 1] - xs[j] + 1.2} height="4" className="glyph-fill" />);
      else if (!prev2) els.push(<rect key={`b2s${gi}-${j}`} x={(j === g.length - 1 ? xs[j] - 8 : xs[j]) - 0.6} y={y2} width="9" height="4" className="glyph-fill" />);
    });
  });

  // markings (upper staff only)
  if (isUpper) {
    const boxes = [];
    const hl = (kind, at, x, y, w, h) => { if (highlight && highlight.kind === kind && highlight.at === at) boxes.push(<rect key={'hl' + kind + at} x={x} y={y} width={w} height={h} rx="5" className="ss-highlight" />); };
    const lowest = Math.max(TOP + 4 * S, ...placed.flatMap((e) => [...(e.ys || []), e.stem?.dir === 'down' ? e.stem.yEnd : 0]));
    const below = Math.max(TOP + 4 * S + 26, lowest + 22);
    let hairStart = null;
    let slurStart = null;
    placed.forEach((e) => {
      const topY = Math.min(TOP - 8, ...(e.ys || [TOP]).map((y) => y - 10), e.stem?.dir === 'up' ? e.stem.yEnd - 4 : 999);
      (e.art || []).forEach((a, k) => {
        const ay = e.stem?.dir === 'down' || !e.stem ? Math.min(...(e.ys || [TOP])) - 10 - k * 8 : Math.max(...e.ys) + 10 + k * 8;
        const ax = e.x;
        if (a === 'staccato') els.push(<circle key={`st${e.idx}`} cx={ax} cy={ay} r="1.9" className="glyph-fill" />);
        if (a === 'accent') els.push(<path key={`ac${e.idx}`} d={`M${ax - 6} ${ay - 3} L${ax + 6} ${ay} L${ax - 6} ${ay + 3}`} className="glyph-stroke" strokeWidth="1.4" fill="none" />);
        if (a === 'tenuto') els.push(<line key={`te${e.idx}`} x1={ax - 6} x2={ax + 6} y1={ay} y2={ay} className="glyph-stroke" strokeWidth="1.8" />);
        if (a === 'marcato') els.push(<path key={`ma${e.idx}`} d={`M${ax - 5} ${ay + 3} L${ax} ${ay - 5} L${ax + 5} ${ay + 3}`} className="glyph-stroke" strokeWidth="1.8" fill="none" />);
        hl('art', e.idx, ax - 10, ay - 8, 20, 16);
      });
      if (e.fermata) {
        const fy = Math.min(TOP - 14, topY - 6);
        els.push(<g key={`fe${e.idx}`}><path d={`M${e.x - 9} ${fy} A9 8 0 0 1 ${e.x + 9} ${fy}`} className="glyph-stroke" strokeWidth="1.8" fill="none" /><circle cx={e.x} cy={fy - 2} r="1.8" className="glyph-fill" /></g>);
        hl('fermata', e.idx, e.x - 13, fy - 13, 26, 17);
      }
      if (e.dyn) {
        els.push(<text key={`dy${e.idx}`} x={e.x - 4} y={below} className="ss-dyn">{e.dyn}</text>);
        hl('dyn', e.idx, e.x - 9, below - 14, 10 + e.dyn.length * 9, 20);
      }
      if (e.text) {
        els.push(<text key={`tx${e.idx}`} x={e.x - 6} y={TOP - 26} className="ss-expr">{e.text}</text>);
        hl('text', e.idx, e.x - 10, TOP - 41, 12 + e.text.length * 6.6, 21);
      }
      if (e.hair === 'cresc' || e.hair === 'dim') hairStart = e;
      if (e.hair === 'end' && hairStart) {
        const x1 = hairStart.x + (hairStart.dyn ? 18 : 0); const x2 = e.x - (e.dyn ? 10 : -6); const y = below - 5;
        els.push(hairStart.hair === 'cresc'
          ? <path key={`hp${e.idx}`} d={`M${x2} ${y - 7} L${x1} ${y} L${x2} ${y + 7}`} className="glyph-stroke" strokeWidth="1.2" fill="none" />
          : <path key={`hp${e.idx}`} d={`M${x1} ${y - 7} L${x2} ${y} L${x1} ${y + 7}`} className="glyph-stroke" strokeWidth="1.2" fill="none" />);
        hl('hair', hairStart.idx, x1 - 6, y - 11, x2 - x1 + 12, 22);
        hairStart = null;
      }
      if (e.slur === 'start') slurStart = e;
      if (e.slur === 'end' && slurStart) {
        const up = slurStart.stem?.dir !== 'up';
        const ys = [...(slurStart.ys || []), ...(e.ys || [])];
        const y = up ? Math.min(...ys) - 10 : Math.max(...ys) + 10;
        const x1 = slurStart.x; const x2 = e.x; const c = up ? y - 12 : y + 12;
        els.push(<path key={`sl${e.idx}`} d={`M${x1} ${y} Q${(x1 + x2) / 2} ${c} ${x2} ${y}`} className="glyph-stroke" strokeWidth="1.3" fill="none" />);
        hl('slur', slurStart.idx, x1 - 6, Math.min(y, c) - 6, x2 - x1 + 12, Math.abs(c - y) + 12);
        slurStart = null;
      }
    });
    return <>{boxes}{els}</>;
  }
  return <>{els}</>;
}

export default function ScoreStaff({ score, width = 640, label = 'Score excerpt' }) {
  const { clef = 'treble', keySig = null, timeSig = [4, 4], tempo, bars, lower, final = 'final', highlight } = score;
  const ksCount = keySig?.count || 0;
  const startX = 52 + ksCount * 10 + (timeSig ? 24 : 6);
  const barTicks = (timeSig[0] * 48) / timeSig[1];
  const beatTicks = timeSig[1] === 8 ? 18 : 12;
  const barW = (width - startX - 6) / bars.length;
  const xMaps = onsetX(bars, lower?.bars, barTicks, startX, barW);
  const height = lower ? 160 + STAFF_GAP : 165;
  return (
    <svg className="score-staff" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {tempo && (
        <g>
          {highlight?.kind === 'tempo' && <rect x={startX - 6} y={4} width={12 + tempo.length * 8} height={22} rx="5" className="ss-highlight" />}
          <text x={startX} y={20} className="ss-tempo">{tempo}</text>
        </g>
      )}
      <StaffBody bars={bars} clef={clef} keySig={keySig} timeSig={timeSig} xMaps={xMaps} startX={startX} width={width} final={final} beatTicks={beatTicks} highlight={highlight} isUpper />
      {lower && (
        <g transform={`translate(0 ${STAFF_GAP})`}>
          <StaffBody bars={lower.bars} clef={lower.clef || 'bass'} keySig={keySig} timeSig={timeSig} xMaps={xMaps} startX={startX} width={width} final={final} beatTicks={beatTicks} />
        </g>
      )}
      {lower && <line x1="4" x2="4" y1={TOP} y2={TOP + STAFF_GAP + 4 * S} className="staff-line" />}
    </svg>
  );
}
