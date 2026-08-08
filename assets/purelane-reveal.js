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

  function reveal(el) {
    if (el.classList.contains('pl-in')) return;
    if (io) {
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
