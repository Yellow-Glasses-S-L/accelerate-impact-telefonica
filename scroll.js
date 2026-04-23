/* ─────────────────────────────────────────────────────────────
 * scroll.js — Animation engine
 * Stack: Lenis + GSAP + ScrollTrigger + SplitType + Barba.js
 * ───────────────────────────────────────────────────────────── */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Dynamic script loader ── */
  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  /* ── Boot sequence ── */
  window.addEventListener('load', async () => {
    // Load SplitType (lightweight, ~7kb)
    await loadScript('https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js');

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[scroll.js] GSAP not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('has-scroll-fx');

    /* ── Lenis smooth scroll ── */
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !reduced) {
      lenis = new Lenis({
        duration: 0.55,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 1.6,
        wheelMultiplier: 1
      });
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.on('scroll', ScrollTrigger.update);
      window.__lenis = lenis;
    }

    /* ── SplitType helpers ── */
    function splitAndAnimate(selector, type, vars) {
      if (reduced || typeof SplitType === 'undefined') return;
      const els = gsap.utils.toArray(selector);
      els.forEach(el => {
        // Wait for Alpine x-text to render
        requestAnimationFrame(() => {
          if (!el.textContent.trim()) return;
          const split = new SplitType(el, { types: type });
          const targets = type === 'chars' ? split.chars : split.words;
          if (!targets || !targets.length) return;
          gsap.from(targets, {
            ...vars,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          });
        });
      });
    }

    /* ══════════════════════════════════════════════════════
     * HOME — Intro cinematográfico
     * ══════════════════════════════════════════════════════ */
    const introEl = document.querySelector('.intro-hero');
    if (introEl) {
      // Eyebrow + scroll hint fade-up on load
      gsap.from('.intro-eyebrow', { y: 16, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      gsap.from('.intro-scroll',  { y: 12, opacity: 0, duration: 1, ease: 'power3.out', delay: 1.4 });

      // Big title: chars animate in one by one
      if (!reduced && typeof SplitType !== 'undefined') {
        const introWord = document.querySelector('.intro-word');
        if (introWord && introWord.textContent.trim()) {
          const split = new SplitType(introWord, { types: 'chars' });
          gsap.from(split.chars, {
            y: 60, opacity: 0, rotateX: -40,
            duration: 0.8, ease: 'power3.out',
            stagger: 0.04, delay: 0.5,
            transformOrigin: '50% 100%'
          });
        }
      }

      // Subtitle fade after title
      gsap.from('.intro-sub', { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 1.1 });

      // Scroll-out: intro title zooms + blurs out
      if (!reduced) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: introEl,
            start: 'top top',
            end: '+=80%',
            scrub: 0.5
          }
        });
        tl
          .to('.intro-word',    { scale: 1.8, y: -80, opacity: 0, filter: 'blur(12px)', duration: 1 }, 0)
          .to('.intro-sub',     { y: -40, opacity: 0, duration: 0.8 }, 0)
          .to('.intro-eyebrow', { y: -20, opacity: 0, duration: 0.6 }, 0)
          .to('.intro-scroll',  { opacity: 0, duration: 0.4 }, 0);
      }
    }

    /* ══════════════════════════════════════════════════════
     * HOME — Hero sequential 3 actos
     * ══════════════════════════════════════════════════════ */
    const heroSequential = document.querySelector('.hero-sequential');
    if (heroSequential && !reduced && window.innerWidth >= 768) {
      gsap.set('[data-hero-act="1"]', { opacity: 1, filter: 'blur(0px)' });
      gsap.set('[data-hero-act="2"], [data-hero-act="3"]', { opacity: 0, filter: 'blur(8px)' });

      // Animate act words on first load
      if (typeof SplitType !== 'undefined') {
        document.querySelectorAll('.act-word').forEach((el, i) => {
          if (!el.textContent.trim()) return;
          const split = new SplitType(el, { types: 'chars' });
          gsap.set(split.chars, { opacity: i === 0 ? 1 : 0 });
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSequential,
          start: 'top top',
          end: '+=220%',
          pin: '.hero-stage',
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      tl
        .to({}, { duration: 0.5 })
        .to('[data-hero-act="1"]', { opacity: 0, filter: 'blur(8px)', duration: 0.25 })
        .to('[data-hero-act="2"]', { opacity: 1, filter: 'blur(0px)', duration: 0.25 }, '<0.05')
        .to('[data-hero-dot="1"]', { backgroundColor: 'rgba(247,247,255,0.2)', width: '28px', duration: 0.2 }, '<')
        .to('[data-hero-dot="2"]', { backgroundColor: '#0066FF', width: '44px', duration: 0.2 }, '<')
        .to({}, { duration: 0.5 })
        .to('[data-hero-act="2"]', { opacity: 0, filter: 'blur(8px)', duration: 0.25 })
        .to('[data-hero-act="3"]', { opacity: 1, filter: 'blur(0px)', duration: 0.25 }, '<0.05')
        .to('[data-hero-dot="2"]', { backgroundColor: 'rgba(247,247,255,0.2)', width: '28px', duration: 0.2 }, '<')
        .to('[data-hero-dot="3"]', { backgroundColor: '#0066FF', width: '44px', duration: 0.2 }, '<')
        .to({}, { duration: 0.4 });

    } else if (heroSequential) {
      gsap.set('[data-hero-act="1"], [data-hero-act="2"], [data-hero-act="3"]',
        { position: 'relative', opacity: 1, scale: 1, filter: 'none', inset: 'auto' });
      heroSequential.querySelector('.hero-stage').style.height = 'auto';
    }

    /* ══════════════════════════════════════════════════════
     * SECCIÓN "Accelerate Impact" — zoom scrubbed + splits
     * ══════════════════════════════════════════════════════ */
    const accHead = document.querySelector('[data-accelerate-header]');
    if (accHead && !reduced) {
      gsap.set(accHead, { transformOrigin: '50% 50%' });
      gsap.fromTo(accHead,
        { scale: 0.55, opacity: 0, filter: 'blur(10px)' },
        {
          scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
          scrollTrigger: { trigger: accHead, start: 'top 95%', end: 'top 40%', scrub: 0.7 }
        }
      );
      gsap.from('.accelerate-eyebrow', {
        clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: accHead, start: 'top 75%' }
      });
    }

    // Títulos de los 4 bloques — palabras entran en cascada
    if (!reduced && typeof SplitType !== 'undefined') {
      document.querySelectorAll('[data-cards-3d] h3').forEach((el, i) => {
        requestAnimationFrame(() => {
          if (!el.textContent.trim()) return;
          const split = new SplitType(el, { types: 'words' });
          if (!split.words || !split.words.length) return;
          gsap.from(split.words, {
            y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 88%' }
          });
        });
      });
    }

    // 4 bloques: línea divisoria se expande + article sube
    gsap.utils.toArray('[data-cards-3d] article').forEach((card, i) => {
      const line = card.querySelector('.flex-1.h-px');
      if (line) {
        gsap.from(line, {
          scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        });
      }
      gsap.from(card, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: (i % 2) * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });

    /* ══════════════════════════════════════════════════════
     * TRACK — nodos entran en cascada desde abajo
     * ══════════════════════════════════════════════════════ */
    const trackTitle = document.querySelector('[data-track-section] .text-center');
    if (trackTitle && !reduced && typeof SplitType !== 'undefined') {
      requestAnimationFrame(() => {
        const h2 = trackTitle.querySelector('h2');
        if (h2 && h2.textContent.trim()) {
          const split = new SplitType(h2, { types: 'words' });
          if (split.words && split.words.length) {
            gsap.from(split.words, {
              y: 32, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
              scrollTrigger: { trigger: h2, start: 'top 85%' }
            });
          }
        }
      });
    }

    gsap.utils.toArray('[data-track-section] .grid > div').forEach((node, i) => {
      gsap.from(node, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: node, start: 'top 90%' }
      });
    });

    /* ══════════════════════════════════════════════════════
     * NADIA + COHORT — slide desde lados
     * ══════════════════════════════════════════════════════ */
    const cohorNadia = document.querySelector('[data-cohort-nadia]');
    if (cohorNadia) {
      const [left, right] = cohorNadia.children;
      if (left) gsap.from(left, {
        x: -50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: cohorNadia, start: 'top 85%' }
      });
      if (right) gsap.from(right, {
        x: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: cohorNadia, start: 'top 85%' }
      });
    }

    /* ══════════════════════════════════════════════════════
     * UNIVERSAL — data-reveal en todas las páginas
     * ══════════════════════════════════════════════════════ */
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      const type = (el.dataset.reveal || 'up').trim();
      const from = { opacity: 0 };
      const start = el.dataset.revealStart || 'top 88%';
      if (type === 'up')    from.y = 56;
      if (type === 'down')  from.y = -56;
      if (type === 'left')  from.x = -64;
      if (type === 'right') from.x = 64;
      if (type === 'scale') from.scale = 0.92;
      if (type === 'blur')  from.filter = 'blur(14px)';
      gsap.from(el, {
        ...from,
        duration: parseFloat(el.dataset.revealDuration) || 1.0,
        delay:    parseFloat(el.dataset.revealDelay) || 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' }
      });
    });

    gsap.utils.toArray('[data-reveal-stagger]').forEach(parent => {
      const items = parent.querySelectorAll('[data-stagger-item]');
      if (!items.length) return;
      gsap.from(items, {
        y: parseFloat(parent.dataset.staggerDistance) || 48,
        opacity: 0, duration: 1.0, ease: 'power3.out',
        stagger: parseFloat(parent.dataset.staggerDelay) || 0.1,
        scrollTrigger: { trigger: parent, start: parent.dataset.revealStart || 'top 82%' }
      });
    });

    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const scope = el.closest('[data-parallax-scope]') || el.closest('section') || el.parentElement;
      gsap.to(el, {
        yPercent: -speed * 40, ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });

    gsap.utils.toArray('[data-reveal-line]').forEach(el => {
      gsap.from(el, {
        clipPath: 'inset(0 100% 0 0)', duration: 1.6, ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    gsap.utils.toArray('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter);
      if (isNaN(target)) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target, duration: 1.8, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.n).toString(); },
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    gsap.utils.toArray('[data-draw]').forEach(p => {
      try {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: parseFloat(p.dataset.drawDuration) || 2.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: p, start: 'top 82%' }
        });
      } catch(e) {}
    });

    gsap.utils.toArray('[data-pin]').forEach(el => {
      gsap.to(el, {
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top top',
          end: '+=' + (parseInt(el.dataset.pinDistance) || 600),
          pin: true, pinSpacing: true, scrub: true
        }
      });
    });

    /* ══════════════════════════════════════════════════════
     * UNIVERSAL — h1, h2 con data-split-words en cualquier página
     * ══════════════════════════════════════════════════════ */
    if (!reduced && typeof SplitType !== 'undefined') {
      // Palabras en titulares de sección
      document.querySelectorAll('[data-split-words]').forEach(el => {
        requestAnimationFrame(() => {
          if (!el.textContent.trim()) return;
          const split = new SplitType(el, { types: 'words' });
          if (!split.words || !split.words.length) return;
          gsap.from(split.words, {
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%' }
          });
        });
      });

      // Chars en titulares hero de otras páginas
      document.querySelectorAll('[data-split-chars]').forEach(el => {
        requestAnimationFrame(() => {
          if (!el.textContent.trim()) return;
          const split = new SplitType(el, { types: 'chars' });
          if (!split.chars || !split.chars.length) return;
          gsap.from(split.chars, {
            y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.03,
            scrollTrigger: { trigger: el, start: 'top 90%' }
          });
        });
      });
    }

    /* ── Refresh tras Alpine + resize ── */
    if (window.Alpine) {
      document.addEventListener('alpine:initialized', () => ScrollTrigger.refresh());
    } else {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn && (btn.textContent.trim() === 'ES' || btn.textContent.trim() === 'EN')) {
        setTimeout(() => ScrollTrigger.refresh(), 60);
      }
    });

    /* ══════════════════════════════════════════════════════
     * PAGE TRANSITIONS — GSAP fade (compatible con Alpine)
     * ══════════════════════════════════════════════════════ */
    const pageMain = document.querySelector('main');
    if (pageMain && !reduced) {
      gsap.from(pageMain, { opacity: 0, y: 24, duration: 0.55, ease: 'power3.out', delay: 0.05 });
    }
    if (!reduced) {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
            href.startsWith('http') || href.startsWith('tel:')) return;
        if (a.target === '_blank' || a.hasAttribute('data-no-transition')) return;
        e.preventDefault();
        const dest = href;
        gsap.to(pageMain || document.body, {
          opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
          onComplete: () => { window.location.href = dest; }
        });
      }, { capture: true });
    }

    /* ══════════════════════════════════════════════════════
     * JOURNEY — Hero entrance, track nodes
     * ══════════════════════════════════════════════════════ */
    const journeyHero = document.querySelector('[data-journey-hero]');
    if (journeyHero && !reduced) {
      gsap.from('[data-journey-eyebrow]', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
      if (typeof SplitType !== 'undefined') {
        requestAnimationFrame(() => {
          const h1 = journeyHero.querySelector('h1');
          if (h1 && h1.textContent.trim()) {
            const split = new SplitType(h1, { types: 'words' });
            if (split.words?.length) {
              gsap.from(split.words, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.6 });
            }
          }
        });
      }
      gsap.from('[data-journey-sub]', { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 1.0 });
    }

    gsap.utils.toArray('[data-track-node]').forEach((node, i) => {
      gsap.from(node, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: node.closest('.track-ascend') || node, start: 'top 78%' }
      });
    });

    /* ══════════════════════════════════════════════════════
     * NADIA — Avatar, title, purpose, use cards, tips
     * ══════════════════════════════════════════════════════ */
    const nadiaHero = document.querySelector('[data-nadia-hero]');
    if (nadiaHero && !reduced) {
      const avatar = nadiaHero.querySelector('[data-nadia-avatar]');
      if (avatar) gsap.from(avatar, { scale: 0.5, opacity: 0, duration: 1.4, ease: 'back.out(1.7)', delay: 0.2 });
      gsap.from('[data-nadia-eyebrow]', { y: 12, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
      if (typeof SplitType !== 'undefined') {
        requestAnimationFrame(() => {
          const h1 = nadiaHero.querySelector('h1');
          if (h1 && h1.textContent.trim()) {
            const split = new SplitType(h1, { types: 'chars' });
            if (split.chars?.length) {
              gsap.from(split.chars, {
                y: 60, opacity: 0, rotateX: -40, duration: 0.8, ease: 'power3.out',
                stagger: 0.04, delay: 0.6, transformOrigin: '50% 100%'
              });
            }
          }
        });
      }
      gsap.from('[data-nadia-sub]', { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.9 });
    }

    const nadiaPurpose = document.querySelector('[data-nadia-purpose]');
    if (nadiaPurpose && !reduced && typeof SplitType !== 'undefined') {
      requestAnimationFrame(() => {
        if (!nadiaPurpose.textContent.trim()) return;
        const split = new SplitType(nadiaPurpose, { types: 'words' });
        if (split.words?.length) {
          gsap.from(split.words, {
            y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.025,
            scrollTrigger: { trigger: nadiaPurpose, start: 'top 85%' }
          });
        }
      });
    }

    gsap.utils.toArray('[data-nadia-card]').forEach((card, i) => {
      gsap.from(card, {
        x: i % 2 === 0 ? -55 : 55, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 86%' }
      });
    });

    gsap.utils.toArray('[data-nadia-tip]').forEach((tip, i) => {
      gsap.from(tip, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: tip.closest('ol') || tip, start: 'top 84%' }
      });
    });

    /* ══════════════════════════════════════════════════════
     * INFO — letter reveal sequence
     * ══════════════════════════════════════════════════════ */
    const infoPage = document.querySelector('[data-info-page]');
    if (infoPage && !reduced) {
      gsap.from('[data-info-meta]', {
        clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power3.inOut', delay: 0.4
      });
      gsap.from('[data-info-letter]', {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.55
      });
      if (typeof SplitType !== 'undefined') {
        requestAnimationFrame(() => {
          const greeting = document.querySelector('[data-info-greeting]');
          if (greeting && greeting.textContent.trim()) {
            const split = new SplitType(greeting, { types: 'chars' });
            if (split.chars?.length) {
              gsap.from(split.chars, {
                y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 0.9
              });
            }
          }
        });
      }
      gsap.from('[data-info-stamp]', {
        x: 50, opacity: 0, duration: 1.0, ease: 'back.out(1.2)', delay: 1.1
      });
    }

  });
})();
