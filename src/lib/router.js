/**
 * A two-route client-side router.
 *
 * react-router would add roughly a quarter of this app's bundle to serve two
 * paths with no params, so the History API is driven directly. If the site
 * ever grows nested or parameterised routes, swap this out rather than
 * extending it.
 *
 * Direct hits on /build only work because vercel.json rewrites unknown paths
 * to index.html. Without that rewrite the route 404s on refresh.
 */

import { useSyncExternalStore } from 'react';

const listeners = new Set();
let current = typeof window === 'undefined' ? '/' : normalise(window.location.pathname);

function normalise(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    current = normalise(window.location.pathname);
    emit();
    // The browser restores scroll for back/forward on the same document, but
    // not across our route swaps, so a hash in the restored URL still needs
    // honouring.
    scrollAfterPaint(window.location.hash.slice(1));
  });
}

/**
 * Wait for the new route to render before looking for the anchor.
 *
 * Polled on a timer rather than requestAnimationFrame: rAF is paused while
 * the tab is in the background, which would leave the scroll permanently
 * unapplied for a link opened in a background tab. A fixed delay is not
 * enough either, because React may not have committed the incoming page yet,
 * so this retries until the element exists and then gives up.
 */
const SCROLL_POLL_MS = 16;
const SCROLL_TIMEOUT_MS = 600;

function scrollAfterPaint(id) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const deadline = Date.now() + SCROLL_TIMEOUT_MS;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (Date.now() < deadline) setTimeout(attempt, SCROLL_POLL_MS);
    else window.scrollTo({ top: 0, behavior: 'auto' });
  };
  setTimeout(attempt, 0);
}

/**
 * @param {string} to e.g. "/build", "/#muscles", "/"
 */
export function navigate(to) {
  const [rawPath, hash = ''] = String(to).split('#');
  const path = normalise(rawPath || '/');

  if (path === current) {
    // Same page: this is an in-page jump, so don't push a history entry the
    // back button would have to unwind one anchor at a time.
    if (hash) {
      window.history.replaceState(null, '', `${path}#${hash}`);
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  window.history.pushState(null, '', to);
  current = path;
  emit();
  scrollAfterPaint(hash);
}

/** Current pathname, without a trailing slash. */
export function usePath() {
  return useSyncExternalStore(subscribe, () => current, () => current);
}

/** True when a plain left click should be handled in-app. */
export function isPlainClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
