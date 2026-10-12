// A tiny hash-based router (no dependency). Routes look like #/practice/theory?difficulty=beginner
// Hash routing means the built site works from any static host or folder without server config.
import { useSyncExternalStore } from 'react';

function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
const getHash = () => (typeof window === 'undefined' ? '#/' : window.location.hash || '#/');

export function parseHash(hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs)) };
}

export function useLocation() {
  const hash = useSyncExternalStore(subscribe, getHash, () => '#/');
  return parseHash(hash);
}

// Count in-app page changes so "Back" only uses browser history when the previous page is part of this app.
let inAppSteps = 0;
if (typeof window !== 'undefined') window.addEventListener('hashchange', () => { inAppSteps += 1; });

/** Go back to the previous page in the app, or to `fallback` if the student arrived here directly. */
export function goBack(fallback = '/') {
  if (inAppSteps > 0) { inAppSteps -= 2; window.history.back(); } else navigate(fallback);
}

export function navigate(to) {
  window.location.hash = to.startsWith('#') ? to : '#' + to;
  window.scrollTo({ top: 0 });
}

/** Match "/practice/:setId" against "/practice/theory" → { setId: 'theory' } or null */
export function matchPath(pattern, path) {
  const p = pattern.split('/').filter(Boolean);
  const a = path.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}

export function Link({ to, className, children, onClick, ...rest }) {
  return (
    <a
      href={'#' + to}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) window.scrollTo({ top: 0 });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
