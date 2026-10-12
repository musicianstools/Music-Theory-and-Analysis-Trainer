// Helpers shared by the writing-based exercises.

export const HL_LABELS = {
  claim: 'Claim / argument',
  evidence: 'Evidence',
  effect: 'Effect',
  meaning: 'Meaning',
  connection: 'Interconnectivity',
  judgement: 'Evaluation',
};

// Map builder/response keys onto the six highlight colours.
export const HL_KEY = {
  claim: 'claim', argument: 'claim', interpretation: 'claim', theme: 'claim', final: 'claim',
  evidence: 'evidence', evidence2: 'evidence', element: 'evidence', element2: 'evidence',
  effect: 'effect',
  meaning: 'meaning', meaning2: 'meaning',
  connection: 'connection', interconnection: 'connection',
  judgement: 'judgement',
};

export function fillFrame(frame, values, blankText = '______') {
  return frame.replace(/\{(\d+)\}/g, (_, n) => (values[n] && values[n].trim() ? values[n].trim() : blankText));
}

export function blankCount(frame) {
  return (frame.match(/\{\d+\}/g) || []).length;
}

export function HighlightLegend({ keys = Object.keys(HL_LABELS) }) {
  return (
    <ul className="hl-legend" aria-label="Colour key">
      {keys.map((k) => <li key={k}><span className={`hl-swatch hl-${k}`} />{HL_LABELS[k]}</li>)}
    </ul>
  );
}

/** Render [{key, text}] as one paragraph with each component highlighted. */
export function HighlightedParagraph({ parts }) {
  return (
    <p className="hl-paragraph">
      {parts.filter((p) => p.text && p.text.trim()).map((p, i) => (
        <span key={i}>
          <mark className={`hl hl-${HL_KEY[p.key] || p.key}`} title={HL_LABELS[HL_KEY[p.key] || p.key]}>{p.text.trim()}</mark>{' '}
        </span>
      ))}
    </p>
  );
}

/** Clickable phrase bank. `suggestions` may be strings or {text, quality, note}. */
export function Chips({ suggestions = [], onPick, selected }) {
  if (!suggestions.length) return null;
  return (
    <div className="chips" role="group" aria-label="Suggestions">
      {suggestions.map((s) => {
        const text = typeof s === 'string' ? s : s.text;
        return (
          <button type="button" key={text} className={`chip ${selected === text ? 'on' : ''}`} onClick={() => onPick(text)}>
            {text}
          </button>
        );
      })}
    </div>
  );
}

export function ensureSentence(t) {
  const s = (t || '').trim();
  if (!s) return '';
  return /[.!?]$/.test(s) ? s : s + '.';
}
