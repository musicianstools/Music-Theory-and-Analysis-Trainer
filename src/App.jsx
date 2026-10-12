import { useEffect } from 'react';
import Layout from './components/Layout.jsx';
import { useLocation, matchPath } from './utils/router.jsx';
import Home from './pages/Home.jsx';
import SectionPage from './pages/SectionPage.jsx';
import Practice from './pages/Practice.jsx';
import Ladder from './pages/Ladder.jsx';
import ResponseBuilderPage from './pages/ResponseBuilderPage.jsx';
import Exam from './pages/Exam.jsx';
import ExamRun from './pages/ExamRun.jsx';
import MockBuilder from './pages/MockBuilder.jsx';
import Worksheet from './pages/Worksheet.jsx';
import Songs from './pages/Songs.jsx';
import StatsPage from './pages/StatsPage.jsx';
import About from './pages/About.jsx';
import DrillPage from './pages/DrillPage.jsx';
import NotFound from './pages/NotFound.jsx';

const ROUTES = [
  ['/', () => <Home />],
  ['/theory', () => <SectionPage id="theory" />],
  ['/listen', () => <SectionPage id="listen" />],
  ['/analyse', () => <SectionPage id="analyse" />],
  ['/connect', () => <SectionPage id="connect" />],
  ['/argue', () => <SectionPage id="argue" />],
  ['/write', () => <SectionPage id="write" />],
  ['/write/response', () => <ResponseBuilderPage />],
  ['/ladder', () => <Ladder />],
  ['/practice/:setId', (p, q) => <Practice setId={p.setId} query={q} />],
  ['/drill/:id', (p) => <DrillPage id={p.id} />],
  ['/exam', () => <Exam />],
  ['/exam/build', () => <MockBuilder />],
  ['/exam/:mode', (p, q) => <ExamRun mode={p.mode} query={q} />],
  ['/worksheet/:setId', (p, q) => <Worksheet setId={p.setId} query={q} />],
  ['/songs', () => <Songs />],
  ['/stats', () => <StatsPage />],
  ['/progress', () => <StatsPage />],
  ['/about', () => <About />],
];

export function resolveRoute(path, query) {
  for (const [pattern, render] of ROUTES) {
    const params = matchPath(pattern, path);
    if (params) return render(params, query);
  }
  return <NotFound />;
}

export default function App() {
  const { path, query } = useLocation();
  const key = path + JSON.stringify(query);
  useEffect(() => { document.getElementById('main')?.focus({ preventScroll: true }); }, [path]);
  return <Layout><div key={key} className="route">{resolveRoute(path, query)}</div></Layout>;
}
