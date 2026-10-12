import { PageHeader, Card, Callout } from '../components/ui.jsx';
import { SETS } from '../data/index.js';
import { COGNITIVE_VERBS } from '../data/cognitiveVerbs.js';

export default function About() {
  const total = Object.values(SETS).reduce((n, s) => n + s.items.length, 0);
  return (
    <div className="page narrow">
      <PageHeader eyebrow="About" title="How this trainer works" lede="Built around one goal: students becoming better at thinking and writing about music." />
      <Card>
        <h2 className="h3">The progression</h2>
        <p><strong>Know → Hear → Analyse → Connect → Argue → Write.</strong> Each section practises one step, and every exercise explains why an answer is strong — not just whether it is right.</p>
        <h2 className="h3">The writing coach</h2>
        <p>Written answers are checked by a transparent, rule-based coach. It looks for the components of strong analysis (terminology, specific evidence, effect, meaning, link to theme, interconnectivity, evaluation) and flags common vague patterns such as “the music gets louder” or “the song is good”. It cannot judge musical accuracy or insight, so its feedback is a diagnostic, not a mark.</p>
        <h2 className="h3">Your data</h2>
        <p>Progress is stored only in this browser (localStorage). Clearing site data resets it.</p>
      </Card>
      <Card>
        <h2 className="h3" id="verbs">Cognitive verbs</h2>
        <p className="muted">The instruction word in a task tells you what kind of thinking it wants. In task prompts these words are underlined with dots — hover, tap or tab to them for the definition.</p>
        <dl className="verb-list">
          {COGNITIVE_VERBS.map((v) => (
            <div key={v.verb}><dt>{v.verb}</dt><dd>{v.def}</dd></div>
          ))}
        </dl>
      </Card>
      <Callout title="Teacher notes">
        <p>{total} exercises are currently loaded from data files in <code>src/data/</code>. Add questions, songs and themes by editing those files — no page code needs to change. See <code>README.md</code> for the data formats, how to add real audio excerpts, and where a future teacher dashboard (assignments, classes, exported results) would plug in.</p>
      </Callout>
      <Callout title="Not yet built" tone="muted">
        <p>Teacher dashboard, class management, assigning work, exporting results and real recorded audio excerpts are planned extensions. The architecture supports them, but they are not part of this version. In the meantime, teachers can share a mock exam link (the settings travel in the URL) and print any set or paper as a worksheet with an answer key.</p>
      </Callout>
    </div>
  );
}
