import { useEffect, useRef, useState } from 'react';
import { playSynth, synthDuration, playMidiEvents, eventsDuration } from '../utils/audioSynth.js';

/**
 * Plays either a synthesised excerpt ({ synth }) or a real recording ({ src, start, end }).
 * Shows an elapsed timer so students can locate evidence ("at about 3 seconds…").
 */
export default function AudioPlayer({ audio, label = 'Excerpt' }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const stopRef = useRef(null);
  const tickRef = useRef(null);
  const audioRef = useRef(null);
  const isSynth = !!audio?.synth;
  const isEvents = !!audio?.events;
  const total = isEvents ? eventsDuration(audio.events) : isSynth ? synthDuration(audio.synth) : audio?.end && audio?.start !== undefined ? audio.end - audio.start : null;

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    clearInterval(tickRef.current);
    setPlaying(false);
  };

  useEffect(() => stop, []);

  const play = () => {
    setError(null);
    stop();
    const t0 = performance.now();
    setElapsed(0);
    try {
      if (isEvents) {
        stopRef.current = playMidiEvents(audio.events);
      } else if (isSynth) {
        stopRef.current = playSynth(audio.synth);
      } else {
        const el = audioRef.current;
        el.currentTime = audio.start || 0;
        el.play().catch(() => setError('This recording could not be played. Check the file exists in /public/audio.'));
        const onTime = () => { if (audio.end && el.currentTime >= audio.end) stop(); };
        el.addEventListener('timeupdate', onTime);
        stopRef.current = () => { el.pause(); el.removeEventListener('timeupdate', onTime); };
      }
    } catch (e) {
      setError('Audio is not available in this browser.');
      return;
    }
    setPlaying(true);
    tickRef.current = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      setElapsed(s);
      if (total && s >= total) stop();
    }, 100);
  };

  return (
    <div className="audio">
      {!isSynth && !isEvents && audio?.src && <audio ref={audioRef} src={audio.src} preload="metadata" />}
      <button type="button" className={`audio-btn ${playing ? 'playing' : ''}`} onClick={playing ? stop : play} aria-label={playing ? `Stop ${label}` : `Play ${label}`}>
        <span aria-hidden="true">{playing ? '■' : '▶'}</span>
      </button>
      <div className="audio-meta">
        <span className="audio-label">{label}</span>
        <span className="audio-time" aria-live="off">{elapsed.toFixed(1)}s{total ? ` / ${total.toFixed(1)}s` : ''}</span>
        <div className="audio-track"><span style={{ width: total ? `${Math.min(100, (elapsed / total) * 100)}%` : '0%' }} /></div>
      </div>
      {error && <p className="audio-error">{error}</p>}
    </div>
  );
}
