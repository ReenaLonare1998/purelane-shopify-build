/**
 * Shared reveal-on-scroll for every Purelane section. Loaded redundantly
 * by each section that has .pl-rv elements (Hero, Shop grid, Combos,
 * Bundles, Reviews rail) — the guard below makes that safe, and browsers
 * dedupe repeated <script src> requests to the same URL, so it costs one
 * request total regardless of how many sections include it.
 *
 * The prototype's equivalent only ever queried `.rv` once, on load. That
 * works for a static page but not inside the theme editor: adding a
 * section back after removing it, or duplicating one, injects new .rv
 * elements that a load-time-only querySelectorAll can never see, so they
 * stay invisible (opacity: 0) forever. The MutationObserver below is
 * what actually fixes that — it keeps picking up newly-inserted .pl-rv
 * elements for as long as the page is open, which is exactly the editor
 * workflow this needs to survive.
 *
 * `.pl-rv-eager` (Hero's own rule/lede/CTAs/badge strip only) skips the
 * IntersectionObserver entirely and reveals right after paint instead.
 * The prototype's own reveal threshold (rootMargin -12%, threshold 0.12
 * — kept as-is below for every other .pl-rv element) assumes hero
 * content comfortably fits the initial viewport, so "reveal on scroll
 * into view" reads as a quick on-load cascade. On a real but shorter
 * viewport (~730px, common on 768px-class laptop screens once browser
 * chrome is subtracted) Hero's own min-height:100svh section renders
 * taller than that, so its bottom-aligned copy sits below the fold on
 * first paint with nothing to scroll into — confirmed live, reported
 * as looking like a stuck/blank skeleton rather than a deliberate
 * animation, which is a fair reading: there's no "scrolling into the
 * page" narrative for the very first screen a visitor sees. Every
 * other section's .pl-rv content (Reviews, Combos, Bundles, Shop) is
 * genuinely below the fold on load, where scroll-triggered reveal is
 * the point, and keeps the original IntersectionObserver behavior.
 */
(function () {
  if (window.__purelaneRevealInit) return;
  window.__purelaneRevealInit = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('pl-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
  }

  function revealEager(el) {
    // Double rAF: guarantees the browser has painted the initial
    // opacity:0/blur state at least once before pl-in is added, so the
    // CSS transition actually animates instead of snapping straight to
    // its end state.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('pl-in');
      });
    });
  }

  function reveal(el) {
    if (el.classList.contains('pl-in')) return;
    if (el.classList.contains('pl-rv-eager')) {
      revealEager(el);
    } else if (io) {
      io.observe(el);
    } else {
      el.classList.add('pl-in');
    }
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.classList && root.classList.contains('pl-rv')) reveal(root);
    root.querySelectorAll('.pl-rv').forEach(reveal);
  }

  scan(document);

  if ('MutationObserver' in window) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) scan(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
