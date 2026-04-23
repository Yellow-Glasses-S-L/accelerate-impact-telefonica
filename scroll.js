/* ─────────────────────────────────────────────────────────────
 * scroll.js — Smooth scroll + scroll-triggered animations
 * Requires: Lenis, GSAP, ScrollTrigger (all via CDN)
 * Usage: tag elements with data-reveal / data-parallax / data-counter / data-draw
 * ───────────────────────────────────────────────────────────── */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', () => {
    // Libs check
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[scroll.js] GSAP/ScrollTrigger not loaded — falling back to CSS reveals');
      document.documentElement.classList.add('no-scroll-fx');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('has-scroll-fx');

    // ─── Lenis smooth scroll ────────────────────────────────
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !reduceMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 1.6,
        wheelMultiplier: 1
      });
      // Single RAF via gsap.ticker only — eliminates double-RAF drift
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.on('scroll', ScrollTrigger.update);
      window.__lenis = lenis;
    }

    // ─── Helpers ────────────────────────────────────────────
    const dur  = (el, d = 1.1) => parseFloat(el.dataset.revealDuration) || d;
    const del  = (el, d = 0)   => parseFloat(el.dataset.revealDelay) || d;

    // ─── [data-reveal] — up|down|left|right|scale|fade|blur ─
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      const type  = (el.dataset.reveal || 'up').trim();
      const from  = { opacity: 0 };
      const start = el.dataset.revealStart || 'top 88%';

      if (type === 'up')    from.y = 56;
      if (type === 'down')  from.y = -56;
      if (type === 'left')  from.x = -64;
      if (type === 'right') from.x =  64;
      if (type === 'scale') from.scale = 0.92;
      if (type === 'blur')  from.filter = 'blur(14px)';

      gsap.from(el, {
        ...from,
        duration: dur(el, 1.15),
        delay: del(el),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none'
        }
      });
    });

    // ─── [data-reveal-stagger] ─────────────────────────────
    gsap.utils.toArray('[data-reveal-stagger]').forEach(parent => {
      const items = parent.querySelectorAll('[data-stagger-item]');
      if (!items.length) return;
      const y = parseFloat(parent.dataset.staggerDistance) || 48;
      const stagger = parseFloat(parent.dataset.staggerDelay) || 0.1;
      gsap.from(items, {
        y,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: parent,
          start: parent.dataset.revealStart || 'top 82%'
        }
      });
    });

    // ─── [data-parallax="0.3"] ─────────────────────────────
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const scope = el.closest('[data-parallax-scope]') || el.closest('section') || el.parentElement;
      gsap.to(el, {
        yPercent: -speed * 40,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    });

    // ─── [data-reveal-line] — clip-path left→right wipe ────
    gsap.utils.toArray('[data-reveal-line]').forEach(el => {
      gsap.from(el, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.6,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // ─── [data-counter="200"] — counting number ────────────
    gsap.utils.toArray('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter);
      if (isNaN(target)) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.n).toString();
        },
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // ─── [data-draw] — SVG path stroke draw on scroll ──────
    gsap.utils.toArray('[data-draw]').forEach(p => {
      try {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: parseFloat(p.dataset.drawDuration) || 2.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: p, start: 'top 82%' }
        });
      } catch(e) { /* path may be non-renderable */ }
    });

    // ─── [data-pin] — pin section briefly while content animates ─
    gsap.utils.toArray('[data-pin]').forEach(el => {
      gsap.to(el, {
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=' + (parseInt(el.dataset.pinDistance) || 600),
          pin: true,
          pinSpacing: true,
          scrub: true
        }
      });
    });

    // ─── Re-refresh after Alpine finishes rendering ────────
    if (window.Alpine) {
      document.addEventListener('alpine:initialized', () => ScrollTrigger.refresh());
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }

    // Re-measure on viewport resize (debounced by ScrollTrigger)
    // and on language change — Alpine re-renders x-text bindings
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang-toggle], button');
      if (btn && (btn.textContent.trim() === 'ES' || btn.textContent.trim() === 'EN')) {
        setTimeout(() => ScrollTrigger.refresh(), 60);
      }
    });
  });
})();
