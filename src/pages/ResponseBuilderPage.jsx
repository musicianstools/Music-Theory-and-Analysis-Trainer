import { useState } from 'react';
import { responsePrompts } from '../data/writing/responsePrompts.js';
import { generateExamQuestion } from '../data/writing/examQuestions.js';
import ResponseBuilder from '../exercises/ResponseBuilder.jsx';
import { PageHeader, StageBar, DifficultyTag, Card, Callout } from '../components/ui.jsx';
import { getSong } from '../data/songs/songs.js';
import { recordResult, logActivity } from '../utils/progress.js';
import { Link } from '../utils/router.jsx';

export default function ResponseBuilderPage() {
  const [prompt, setPrompt] = useState(null);
  const setChosen = (id) => setPrompt(id ? responsePrompts.find((p) => p.id === id) : null);
  return (
    <div className="page narrow">
      <PageHeader eyebrow="Stage 6 · Write" title="Practice Exam — guided" lede="Write a complete analytical response: an introduction and three key-moment paragraphs. Start guided, then remove the scaffolding.">
        <StageBar current="write" />
      </PageHeader>
      {!prompt ? (
        <>
          <Callout title="Structure of a strong response">
            <ol className="tidy">
              <li><strong>Introduction</strong> — your argument (theme → specific claim) and a preview of your three moments.</li>
              <li><strong>Key moment 1</strong> — locate it, analyse the evidence, effect and meaning, and connect elements.</li>
              <li><strong>Key moment 2</strong> — a different moment that develops, reinforces or contrasts your argument.</li>
              <li><strong>Key moment 3</strong> — a moment that completes the argument, ending with your overall evaluation.</li>
            </ol>
          </Callout>
          <Card className="rec-card">
            <p className="eyebrow">Recommended</p>
            <h2 className="rec-title">A new question every time</h2>
            <p>Get a freshly generated exam question on one of the set songs and themes — just like the Practice Exam.</p>
            <button className="btn btn-primary" onClick={() => setPrompt(generateExamQuestion())}>Generate a question →</button>
          </Card>
          <h2 className="section-title">Or practise a question with a full worked model</h2>
          <div className="card-grid">
            {responsePrompts.map((p) => {
              const song = getSong(p.song);
              return (
                <Card key={p.id} className="set-card stage-write">
                  <div className="row between"><span className="pill pill-write cap">{p.theme}</span><DifficultyTag difficulty={p.difficulty} /></div>
                  <h3 className="set-title">{song?.title}</h3>
                  <p className="small">{p.question}</p>
                  <button className="btn btn-primary mt" onClick={() => setChosen(p.id)}>Start this response</button>
                  <Link className="small mt-s" to={`/practice/exam-skills?song=${p.song}`}>Practise the parts first →</Link>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <div className="row gap wrap">
            <button className="btn btn-ghost btn-small" onClick={() => setChosen(null)}>← Choose another question</button>
            <button className="btn btn-ghost btn-small" onClick={() => setPrompt(generateExamQuestion())}>New random question</button>
          </div>
          <ResponseBuilder key={prompt.id} prompt={prompt} onSubmit={(vals, report) => {
            const a = report;
            recordResult(prompt.id, ['writing', 'argument'], a.score);
            logActivity({ title: `Practice Exam (guided) · ${prompt.theme}`, href: '/write/response', score: a.score, count: 1, stage: 'write' });
          }} />
        </Card>
      )}
    </div>
  );
}
