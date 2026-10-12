// Synthesised listening excerpts (Web Audio API) so the Listening trainer works with no audio files.
// Real recordings are supported too: give a question `audio: { src, start, end }` instead of `audio: { synth }`.
// Each recipe returns a list of note events: { t, d, notes: [midi], gain, gainEnd?, type? }.

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
const m2f = (m) => 440 * Math.pow(2, (m - 69) / 12);

const C = 60;
const scale = [0, 2, 4, 5, 7, 9, 11, 12];

const RECIPES = {
  crescendoStrong: () => {
    const ev = [];
    for (let i = 0; i < 24; i++) ev.push({ t: i * 0.25, d: 0.22, notes: [48, 60, 64, 67], gain: 0.04 + (i / 23) * 0.9 });
    return ev;
  },
  crescendoSubtle: () => {
    const ev = [];
    for (let i = 0; i < 24; i++) ev.push({ t: i * 0.25, d: 0.22, notes: [48, 60, 64, 67], gain: 0.42 + (i / 23) * 0.18 });
    return ev;
  },
  staccato: () => [0, 2, 4, 5, 7, 5, 4, 2, 0].map((s, i) => ({ t: i * 0.32, d: 0.09, notes: [C + 12 + s], gain: 0.6 })),
  legato: () => [0, 2, 4, 5, 7, 5, 4, 2, 0].map((s, i) => ({ t: i * 0.32, d: 0.36, notes: [C + 12 + s], gain: 0.55 })),
  ascending: () => scale.map((s, i) => ({ t: i * 0.35, d: 0.34, notes: [C + s], gain: 0.55 })).concat([{ t: 2.8, d: 0.9, notes: [C + 12, C + 4], gain: 0.5 }]),
  descending: () => [...scale].reverse().map((s, i) => ({ t: i * 0.35, d: 0.34, notes: [C + 4 + s], gain: 0.55 })).concat([{ t: 2.8, d: 0.9, notes: [C + 4, C - 8], gain: 0.5 }]),
  majorThenMinor: () => [
    { t: 0, d: 0.3, notes: [60], gain: 0.5 }, { t: 0.3, d: 0.3, notes: [64], gain: 0.5 }, { t: 0.6, d: 0.3, notes: [67], gain: 0.5 },
    { t: 0.9, d: 1.0, notes: [60, 64, 67], gain: 0.45 },
    { t: 2.3, d: 0.3, notes: [60], gain: 0.5 }, { t: 2.6, d: 0.3, notes: [63], gain: 0.5 }, { t: 2.9, d: 0.3, notes: [67], gain: 0.5 },
    { t: 3.2, d: 1.0, notes: [60, 63, 67], gain: 0.45 },
  ],
  textureChange: () => {
    const mel = [7, 9, 7, 4, 5, 4, 2, 0, 2, 4, 5, 7, 9, 7, 4, 2, 0, 2, 4, 0];
    const ev = mel.map((s, i) => ({ t: i * 0.35, d: 0.32, notes: [C + 12 + s], gain: 0.5 }));
    // Thick accompaniment enters at ~3.5s
    const chords = [[48, 55, 64], [45, 57, 64], [41, 57, 65], [43, 55, 62]];
    for (let b = 0; b < 4; b++) {
      for (let k = 0; k < 4; k++) ev.push({ t: 3.5 + b * 0.875 + k * 0.22, d: 0.2, notes: chords[b], gain: 0.32 });
      ev.push({ t: 3.5 + b * 0.875, d: 0.8, notes: [chords[b][0] - 12], gain: 0.5, type: 'sine' });
    }
    return ev;
  },
  syncopation: () => {
    const ev = [];
    const beat = 0.5;
    for (let bar = 0; bar < 3; bar++) {
      for (let b = 0; b < 4; b++) ev.push({ t: bar * 2 + b * beat, d: 0.05, notes: [96], gain: 0.15, type: 'square' }); // click on the beat
      // chord stabs on off-beats and anticipations: & of 1, & of 2, (tied) 4
      [0.25, 0.75, 1.25, 1.75].forEach((o) => ev.push({ t: bar * 2 + o, d: 0.18, notes: [57, 60, 64], gain: 0.55 }));
      ev.push({ t: bar * 2, d: 0.4, notes: [45], gain: 0.5, type: 'sine' });
    }
    return ev;
  },
  straight: () => {
    const ev = [];
    for (let bar = 0; bar < 3; bar++) {
      for (let b = 0; b < 4; b++) {
        ev.push({ t: bar * 2 + b * 0.5, d: 0.05, notes: [96], gain: 0.15, type: 'square' });
        ev.push({ t: bar * 2 + b * 0.5, d: 0.3, notes: [57, 60, 64], gain: 0.5 });
      }
    }
    return ev;
  },
  imperfectCadence: () => {
    const prog = [[48, 60, 64, 67], [41, 60, 65, 69], [48, 60, 64, 67], [43, 59, 62, 67]];
    return prog.map((n, i) => ({ t: i * 1.0, d: i === 3 ? 1.6 : 0.95, notes: n, gain: 0.45 }));
  },
  perfectCadence: () => {
    const prog = [[48, 60, 64, 67], [41, 60, 65, 69], [43, 59, 62, 67], [48, 60, 64, 72]];
    return prog.map((n, i) => ({ t: i * 1.0, d: i === 3 ? 1.6 : 0.95, notes: n, gain: 0.45 }));
  },
  accelerando: () => {
    const ev = [];
    let t = 0, gap = 0.6;
    for (let i = 0; i < 18; i++) {
      ev.push({ t, d: Math.min(0.2, gap * 0.8), notes: [i % 2 ? 67 : 60], gain: 0.5 });
      t += gap;
      gap = Math.max(0.14, gap * 0.88);
    }
    return ev;
  },
};

export const SYNTH_RECIPES = Object.keys(RECIPES);

export function synthDuration(name) {
  const ev = RECIPES[name]?.() || [];
  return ev.reduce((m, e) => Math.max(m, e.t + e.d), 0) + 0.4;
}

/** Play a synth recipe. Returns a stop() function. */
export function playSynth(name) {
  const make = RECIPES[name];
  if (!make) throw new Error(`Unknown synth recipe: ${name}`);
  const ac = getCtx();
  const master = ac.createGain();
  master.gain.value = 0.35;
  const comp = ac.createDynamicsCompressor();
  master.connect(comp).connect(ac.destination);
  const t0 = ac.currentTime + 0.05;
  const oscs = [];
  for (const e of make()) {
    for (const n of e.notes) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = e.type || 'triangle';
      o.frequency.value = m2f(n);
      const peak = (e.gain ?? 0.5) / Math.sqrt(e.notes.length);
      const start = t0 + e.t;
      const end = start + e.d;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + 0.015);
      g.gain.setValueAtTime(Math.max(0.0002, peak), Math.max(start + 0.016, end - 0.05));
      g.gain.exponentialRampToValueAtTime(0.0001, end + 0.08);
      o.connect(g).connect(master);
      o.start(start);
      o.stop(end + 0.1);
      oscs.push(o);
    }
  }
  return () => {
    oscs.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
    master.disconnect();
  };
}

// ---------- Timbre voices (for timbre ear training) ----------
// A voice: { wave, filter?: {type, freq, Q, sweepTo?}, drive?, noise?, fm?: {ratio, index}, attack, release, decay? }
let noiseBuf = null;
function noiseBuffer(ac) {
  if (noiseBuf) return noiseBuf;
  noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}
function driveCurve(amount) {
  const n = 1024; const c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(amount * x) / Math.tanh(amount); }
  return c;
}
function voiceNote(ac, out, v, f, start, dur, vel, nodes) {
  const end = start + dur;
  const amp = ac.createGain();
  const peak = Math.max(0.0003, 0.45 * vel * (v.level ?? 1));
  const atk = v.attack ?? 0.01;
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(peak, start + atk);
  if (v.decay) amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * (v.sustain ?? 0.05)), start + atk + v.decay);
  else amp.gain.setValueAtTime(peak, Math.max(start + atk + 0.001, end - 0.03));
  amp.gain.exponentialRampToValueAtTime(0.0001, end + (v.release ?? 0.08));
  let head = amp;
  if (v.filter) {
    const flt = ac.createBiquadFilter();
    flt.type = v.filter.type || 'lowpass';
    flt.frequency.setValueAtTime(v.filter.freq === 'pitch' ? f : v.filter.freq, start);
    if (v.filter.sweepTo) flt.frequency.exponentialRampToValueAtTime(v.filter.sweepTo, start + Math.min(0.4, dur));
    flt.Q.value = v.filter.Q ?? 0.7;
    flt.connect(amp); head = flt;
  }
  if (v.drive) {
    const ws = ac.createWaveShaper(); ws.curve = driveCurve(v.drive); ws.oversample = '2x';
    const pre = ac.createGain(); pre.gain.value = 1.5;
    pre.connect(ws).connect(head); head = pre;
  }
  amp.connect(out);
  if (v.noise) {
    const src = ac.createBufferSource(); src.buffer = noiseBuffer(ac); src.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * (v.noiseAt || 2); bp.Q.value = v.noiseQ || 1.2;
    const ng = ac.createGain(); ng.gain.value = v.noise;
    src.connect(bp).connect(ng).connect(head);
    src.start(start); src.stop(end + 0.3); nodes.push(src);
  }
  if (v.wave) {
    const o = ac.createOscillator(); o.type = v.wave; o.frequency.value = f;
    const og = ac.createGain(); og.gain.value = v.toneLevel ?? 1;
    if (v.fm) {
      const mod = ac.createOscillator(); mod.frequency.value = f * v.fm.ratio;
      const mg = ac.createGain(); mg.gain.setValueAtTime(f * v.fm.index, start);
      if (v.fm.decay) mg.gain.exponentialRampToValueAtTime(Math.max(1, f * v.fm.index * 0.05), start + v.fm.decay);
      mod.connect(mg).connect(o.frequency); mod.start(start); mod.stop(end + 0.3); nodes.push(mod);
    }
    o.connect(og).connect(head); o.start(start); o.stop(end + 0.3); nodes.push(o);
  }
}

/**
 * Play pitched notes with a soft piano-like tone.
 * events: [{ t: seconds, d: seconds, notes: [midi, …], gain?: 0–1.3 (default 1), timbre?: 'piano' | 'organ' | 'click', voice?: timbre voice (see voiceNote) }].
 * 'organ' sustains for the full duration (useful for legato and chordal textures); 'click' is a short metronome tick.
 * Returns stop().
 */
export function playMidiEvents(events) {
  const ac = getCtx();
  const master = ac.createGain();
  master.gain.value = 0.32;
  const comp = ac.createDynamicsCompressor();
  // Gentle compression only, so dynamic changes (crescendo, accents) stay audible.
  comp.threshold.value = -8; comp.ratio.value = 3; comp.knee.value = 6;
  master.connect(comp).connect(ac.destination);
  const t0 = ac.currentTime + 0.05;
  const oscs = [];
  for (const e of events) {
    const vel = e.gain ?? 1;
    if (e.voice) { e.notes.forEach((n) => voiceNote(ac, master, e.voice, m2f(n), t0 + e.t, e.d, vel / Math.sqrt(e.notes.length), oscs)); continue; }
    for (const n of e.notes) {
      const f = m2f(n);
      const start = t0 + e.t;
      const end = start + e.d;
      const peak = Math.max(0.0003, (0.5 * vel) / Math.sqrt(e.notes.length));
      const partials = e.timbre === 'click' ? [[1, 'square', 0.25]]
        : e.timbre === 'organ' ? [[1, 'sine', 0.8], [2, 'sine', 0.35], [3, 'triangle', 0.12]]
          : [[1, 'triangle', 1], [2, 'sine', 0.25], [3, 'sine', 0.08]];
      partials.forEach(([mult, type, lvl]) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = f * mult;
        g.gain.setValueAtTime(0.0001, start);
        if (e.timbre === 'click') {
          g.gain.exponentialRampToValueAtTime(peak * lvl, start + 0.003);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
        } else if (e.timbre === 'organ') {
          g.gain.exponentialRampToValueAtTime(peak * lvl, start + 0.03);
          g.gain.setValueAtTime(peak * lvl, Math.max(start + 0.031, end - 0.03));
          g.gain.exponentialRampToValueAtTime(0.0001, end + 0.06);
        } else {
          g.gain.exponentialRampToValueAtTime(peak * lvl, start + 0.012);
          g.gain.exponentialRampToValueAtTime(peak * lvl * 0.35, start + Math.min(0.5, e.d));
          g.gain.exponentialRampToValueAtTime(0.0001, end + 0.25);
        }
        o.connect(g).connect(master);
        o.start(start);
        o.stop(end + 0.3);
        oscs.push(o);
      });
    }
  }
  return () => { oscs.forEach((o) => { try { o.stop(); } catch { /* done */ } }); master.disconnect(); };
}

export const eventsDuration = (events) => events.reduce((m, e) => Math.max(m, e.t + e.d), 0) + 0.3;
