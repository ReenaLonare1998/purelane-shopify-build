/**
 * Hero product-stage rotator: cycles the 1 -> 2 -> 3 product slides,
 * pauses on hover and while off-screen, and is click/keyboard operable
 * via the dot buttons.
 *
 * Unlike the prototype's version (a single IIFE that wires everything up
 * once on page load and never expects to run again), this initializes
 * per-`.pl-hstage` instance and hooks Shopify's section lifecycle events
 * so it keeps working correctly after the theme editor adds, removes, or
 * duplicates the Hero section:
 * - `shopify:section:load` re-initializes any `.pl-hstage` inside the
 *   (re)rendered section markup — covers add-back and duplicate.
 * - `shopify:section:unload` clears that instance's interval timer so a
 *   removed/hidden section doesn't keep silently ticking in the
 *   background.
 */
(function () {
  function initHeroStage(hstage) {
    if (hstage.__plInit) return;
    hstage.__plInit = true;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var slides = Array.prototype.slice.call(hstage.querySelectorAll('.pl-hslide'));
    var dotsWrap = hstage.parentElement.querySelector('.pl-hdots');
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('button')) : [];
    var index = 0;

    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('pl-on', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('pl-on', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function play() {
      if (hstage.__plTimer || reduce || slides.length < 2) return;
      hstage.__plTimer = setInterval(function () {
        go(index + 1);
      }, 3800);
    }

    function stop() {
      if (hstage.__plTimer) {
        clearInterval(hstage.__plTimer);
        hstage.__plTimer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stop();
        go(i);
        play();
      });
    });

    hstage.addEventListener('mouseenter', stop);
    hstage.addEventListener('mouseleave', play);
    hstage.addEventListener('focusin', stop);
    hstage.addEventListener('focusout', play);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.isIntersecting ? play() : stop();
          });
        },
        { threshold: 0.2 }
      ).observe(hstage);
    } else {
      play();
    }
  }

  function stopHeroStage(hstage) {
    if (hstage.__plTimer) {
      clearInterval(hstage.__plTimer);
      hstage.__plTimer = null;
    }
  }

  document.querySelectorAll('.pl-hstage').forEach(initHeroStage);

  document.addEventListener('shopify:section:load', function (event) {
    event.target.querySelectorAll('.pl-hstage').forEach(initHeroStage);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    event.target.querySelectorAll('.pl-hstage').forEach(stopHeroStage);
  });
})();
