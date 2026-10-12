import { useState } from 'react';
import { Link, useLocation } from '../utils/router.jsx';

const NAV = [
  { to: '/', label: 'Home', match: (p) => p === '/' },
  { to: '/theory', label: 'Theory', match: (p) => p.startsWith('/theory') || p === '/practice/theory' || ['/drill/note-id', '/drill/key-id', '/drill/key-find', '/drill/interval-id', '/drill/chord-id', '/drill/interval-build', '/drill/chord-build', '/drill/scale-build', '/drill/keysig-id', '/drill/rhythm', '/drill/timbre', '/drill/nashville', '/drill/form', '/drill/transpose', '/drill/score-terms', '/drill/excerpt'].includes(p) },
  { to: '/listen', label: 'Listen', match: (p) => p.startsWith('/listen') || p === '/practice/listening' || p.startsWith('/drill/ear-') },
  { to: '/analyse', label: 'Analyse', match: (p) => p.startsWith('/analyse') || p.startsWith('/ladder') || ['synonyms', 'feature-effect', 'evidence-meaning', 'upgrade', 'ladder'].some((s) => p === `/practice/${s}`) },
  { to: '/connect', label: 'Connect', match: (p) => p.startsWith('/connect') || ['connect', 'feature-meaning', 'relationships'].some((s) => p === `/practice/${s}`) },
  { to: '/argue', label: 'Argue', match: (p) => p.startsWith('/argue') || ['theme-argument', 'argument-builder'].some((s) => p === `/practice/${s}`) },
  { to: '/write', label: 'Write', match: (p) => p.startsWith('/write') || ['teees', 'sentence-builder', 'paragraph-builder'].some((s) => p === `/practice/${s}`) },
  { to: '/exam', label: 'Exam Mode', match: (p) => p.startsWith('/exam') },
  { to: '/stats', label: 'My stats', match: (p) => p === '/stats' || p === '/progress' },
];

export default function Layout({ children }) {
  const { path } = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" fill="currentColor" /><circle cx="17" cy="16" r="3" fill="currentColor" /></svg>
            </span>
            <span className="brand-text">Music Exam Trainer</span>
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Menu'}
          </button>
          <nav id="main-nav" className={`nav ${open ? 'open' : ''}`} aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={`nav-link ${n.match(path) ? 'active' : ''}`} aria-current={n.match(path) ? 'page' : undefined} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="main">{children}</main>
      <footer className="footer">
        <p>Know → Hear → Analyse → Connect → Argue → Write · Progress is saved in this browser only.</p>
        <p><Link to="/songs">Song library</Link> · <Link to="/stats">My stats</Link> · <Link to="/about">About &amp; teacher notes</Link></p>
      </footer>
    </div>
  );
}
