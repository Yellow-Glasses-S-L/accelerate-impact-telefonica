(function () {

  /* ── PAGE LOADER — solo primera visita de la sesión ── */
  if (!sessionStorage.getItem('ai_loaded')) {
    sessionStorage.setItem('ai_loaded', '1');

    var ls = document.createElement('style');
    ls.textContent = `
      #page-loader {
        position: fixed; inset: 0; z-index: 99998;
        background: #F7F7FF;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 44px;
        transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
        will-change: transform;
      }
      /* Salida: telón que sube */
      #page-loader.out { transform: translateY(-100%); }

      /* 1. Entrada de cada círculo: materializa con blur + escala */
      @keyframes lDotIn {
        0%   { opacity: 0; transform: scale(0.12); filter: blur(18px); }
        60%  { opacity: 1; transform: scale(1.09); filter: blur(0); }
        100% { opacity: 1; transform: scale(1);    filter: blur(0); }
      }
      /* 2. Respiro colectivo post-entrada */
      @keyframes lDotBreath {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.06); }
      }
      /* 3. Texto slide-up */
      @keyframes lTextUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      /* 4. Barra de progreso automática */
      @keyframes lBarAuto {
        from { transform: scaleX(0); }
        to   { transform: scaleX(0.88); }
      }

      .l-dot {
        transform-origin: center; transform-box: fill-box;
        animation: lDotIn 0.62s cubic-bezier(0.34, 1.1, 0.64, 1) both;
      }
      .l-dot.breath {
        animation: lDotBreath 3.2s ease-in-out infinite;
      }

      #l-eyebrow {
        display: block;
        font-family: 'Telefonica Sans', Inter, sans-serif;
        font-size: 10px; letter-spacing: 0.34em; text-transform: uppercase;
        color: #031A34; opacity: 0.38; margin-bottom: 10px;
        animation: lTextUp 0.55s ease 0.85s both;
      }
      #l-title {
        display: block;
        font-family: 'Telefonica Sans', Inter, sans-serif;
        font-size: 27px; letter-spacing: -0.025em; font-weight: 400;
        color: #031A34;
        animation: lTextUp 0.6s ease 1.02s both;
      }

      /* Barra de progreso — esquina inferior */
      #l-bar {
        position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
        background: rgba(3,26,52,0.06);
        overflow: hidden;
      }
      #l-bar-fill {
        height: 100%; background: #0066FF;
        transform: scaleX(0); transform-origin: left;
      }
      #l-bar-fill.running {
        animation: lBarAuto 3.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s forwards;
      }
      #l-bar-fill.complete {
        animation: none !important;
        transform: scaleX(1) !important;
        transition: transform 0.2s ease;
      }
    `;
    document.head.appendChild(ls);

    var lang = localStorage.getItem('lang') || 'es';
    var loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <svg viewBox="0 0 464 464" width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
        <circle class="l-dot" cx="69.2"  cy="69.2"  r="69.2" fill="#0066FF" style="animation-delay:0.05s"/>
        <circle class="l-dot" cx="232"   cy="69.2"  r="69.2" fill="#0066FF" style="animation-delay:0.22s"/>
        <circle class="l-dot" cx="394.8" cy="69.2"  r="69.2" fill="#0066FF" style="animation-delay:0.39s"/>
        <circle class="l-dot" cx="232"   cy="232"   r="69.2" fill="#0066FF" style="animation-delay:0.56s"/>
        <circle class="l-dot" cx="232"   cy="394.8" r="69.2" fill="#0066FF" style="animation-delay:0.73s"/>
      </svg>
      <div style="text-align:center;">
        <span id="l-eyebrow">${lang === 'en' ? 'Welcome to' : 'Bienvenido a'}</span>
        <span id="l-title">Accelerate Impact</span>
      </div>
      <div id="l-bar"><div id="l-bar-fill"></div></div>
    `;
    document.body.prepend(loader);

    // Barra arranca en el siguiente frame para que la animación CSS se active
    requestAnimationFrame(function () {
      var fill = document.getElementById('l-bar-fill');
      if (fill) fill.classList.add('running');
    });

    // Cuando terminan las entradas (~1.35s), respiro colectivo suave
    setTimeout(function () {
      loader.querySelectorAll('.l-dot').forEach(function (d, i) {
        d.classList.add('breath');
        d.style.animationDelay = (i * 0.1) + 's';
      });
    }, 1400);

    var t0 = Date.now();
    var MIN = 2400; // mínimo que se ve la animación completa

    function dismiss() {
      // Barra a 100% antes de salir
      var fill = document.getElementById('l-bar-fill');
      if (fill) { fill.classList.remove('running'); fill.classList.add('complete'); }
      var wait = Math.max(0, MIN - (Date.now() - t0));
      setTimeout(function () {
        loader.classList.add('out');
        setTimeout(function () { loader.remove(); }, 950);
      }, wait);
    }

    var maxT = setTimeout(dismiss, 5500);

    var promises = [document.fonts.ready];
    var vid = document.querySelector('video');
    if (vid) {
      promises.push(new Promise(function (resolve) {
        if (vid.readyState >= 3) { resolve(); return; }
        vid.addEventListener('canplaythrough', resolve, { once: true });
      }));
    }
    Promise.all(promises).then(function () { clearTimeout(maxT); dismiss(); });
  }

  /* ── BASE FONT SIZE — 18px global ── */
  const baseStyle = document.createElement('style');
  baseStyle.textContent = 'html { font-size: 18px; }';
  document.head.appendChild(baseStyle);

  /* ── NAVBAR ADAPTATIVA — nav-on-dark CSS (global, todas las páginas) ── */
  const navDarkStyle = document.createElement('style');
  navDarkStyle.textContent = `
    .navbar-pill { transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease; }
    #site-navbar.nav-on-dark .navbar-pill {
      background: rgba(2,9,20,0.15) !important;
      border-color: rgba(247,247,255,0.12) !important;
      backdrop-filter: blur(24px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
    }
    #site-navbar.nav-on-dark .navbar-pill img {
      filter: brightness(0) invert(1) opacity(0.95);
      transition: filter 0.35s ease;
    }
    #site-navbar.nav-on-dark .navbar-pill nav a,
    #site-navbar.nav-on-dark .navbar-pill button { color: rgba(247,247,255,0.72) !important; }
    #site-navbar.nav-on-dark .navbar-pill nav a:hover,
    #site-navbar.nav-on-dark .navbar-pill button:hover { color: #F7F7FF !important; }
    #site-navbar.nav-on-dark .navbar-pill a.text-tef-dark,
    #site-navbar.nav-on-dark .navbar-pill button.text-tef-dark { color: #F7F7FF !important; }
    #site-navbar.nav-on-dark .navbar-pill span.text-tef-dark\\/20 { color: rgba(247,247,255,0.3) !important; }
    #site-navbar.nav-on-dark .navbar-pill button[aria-label] span { background-color: rgba(247,247,255,0.85) !important; }
  `;
  document.head.appendChild(navDarkStyle);

  /* ── CUSTOM CURSOR — punto azul Telefónica ── */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      #custom-cursor {
        position: fixed; top: 0; left: 0; z-index: 99999;
        width: 10px; height: 10px; border-radius: 50%;
        background: #0066FF;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: transform 0.12s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
        will-change: top, left;
      }
      #custom-cursor.is-hovering {
        width: 22px; height: 22px;
        background: rgba(0, 102, 255, 0.25);
        border: 1.5px solid #0066FF;
      }
    `;
    document.head.appendChild(style);

    const dot = document.createElement('div');
    dot.id = 'custom-cursor';
    document.body.appendChild(dot);

    let mx = -100, my = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    document.addEventListener('mouseover', e => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label');
      dot.classList.toggle('is-hovering', !!el);
    });
  }

  const path = window.location.pathname;
  const current =
    path.includes('nadia') ? 'nadia' :
    path.includes('info') ? 'info' :
    path.includes('journey') ? 'journey' :
    path.includes('agenda') ? 'agenda' :
    path.includes('autodiagnostico') ? 'autodiagnostico' :
    path.includes('modelo') ? 'modelo' : 'home';

  function navLink(href, inner, page) {
    const active = current === page;
    const cls = 'font-mono text-xs tracking-[0.18em] uppercase transition-colors ' +
      (active ? 'text-tef-dark' : 'text-tef-dark/50 hover:text-tef-dark');
    return `<a href="${href}" class="${cls}">${inner}</a>`;
  }

  /* ── NAVBAR ── */
  const navEl = document.getElementById('site-navbar');
  if (navEl) {
    navEl.className = 'sticky top-0 z-50';
    navEl.setAttribute('style', 'background:transparent !important;border:none !important;backdrop-filter:none !important;padding:16px 24px 0;pointer-events:none;');
    navEl.setAttribute('x-data', '{ menuOpen: false }');
    navEl.innerHTML = `
      <div class="w-fit mx-auto relative">

        <!-- Pill -->
        <div class="navbar-pill pointer-events-auto flex items-center h-14 px-5 gap-3 rounded-full border border-black/[0.08] shadow-md"
             style="background:rgba(247,247,255,0.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);">

          <!-- Logo -->
          <a href="index.html" class="flex-shrink-0">
            <img src="accelerate-impact-logo.svg" class="h-5 md:h-7 w-auto" alt="Accelerate Impact">
          </a>

          <span class="hidden md:block w-px h-4 bg-black/10 mx-3 flex-shrink-0"></span>

          <!-- Nav desktop -->
          <nav class="hidden md:flex items-center gap-8">
            ${navLink('lider-telefonica.html', 'Líder Telefónica', 'lider-telefonica')}
            ${navLink('journey.html', `<span x-text="t('nav_journey')">Journey</span>`, 'journey')}
            ${navLink('nadia.html', 'Nadia', 'nadia')}
            ${navLink('info.html', `<span x-text="t('nav_info')">Contacto</span>`, 'info')}
          </nav>

          <span class="hidden md:block w-px h-4 bg-black/10 mx-3 flex-shrink-0"></span>

          <!-- Right: lang + hamburger -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <div class="flex items-center gap-0 font-mono text-xs tracking-[0.18em]">
              <button @click="lang='es'" :class="lang==='es' ? 'text-tef-dark' : 'text-tef-dark/40 hover:text-tef-dark'" class="px-2 py-1 transition-colors uppercase">ES</button>
              <span class="text-tef-dark/20">/</span>
              <button @click="lang='en'" :class="lang==='en' ? 'text-tef-dark' : 'text-tef-dark/40 hover:text-tef-dark'" class="px-2 py-1 transition-colors uppercase">EN</button>
            </div>
            <button @click="menuOpen = !menuOpen"
                    class="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none ml-1"
                    aria-label="Menú">
              <span class="block w-5 h-px bg-tef-dark transition-all duration-300"
                    :class="menuOpen ? 'rotate-45 translate-y-[7px]' : ''"></span>
              <span class="block w-5 h-px bg-tef-dark transition-all duration-300"
                    :class="menuOpen ? 'opacity-0' : ''"></span>
              <span class="block w-5 h-px bg-tef-dark transition-all duration-300"
                    :class="menuOpen ? '-rotate-45 -translate-y-[7px]' : ''"></span>
            </button>
          </div>

        </div>

        <!-- Mobile dropdown -->
        <div x-show="menuOpen"
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 -translate-y-2"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0"
             x-transition:leave-end="opacity-0 -translate-y-2"
             class="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-black/[0.08] shadow-lg pointer-events-auto overflow-hidden"
             style="background:rgba(247,247,255,0.95);backdrop-filter:blur(18px);display:none" x-cloak>
          <nav class="px-6 py-5 flex flex-col gap-4">
            ${navLink('lider-telefonica.html', 'Líder Telefónica', 'lider-telefonica').replace('class="', '@click="menuOpen=false" class="text-base ')}
            ${navLink('journey.html', `<span x-text="t('nav_journey')">Journey</span>`, 'journey').replace('class="', '@click="menuOpen=false" class="text-base ')}
            ${navLink('nadia.html', 'Nadia', 'nadia').replace('class="', '@click="menuOpen=false" class="text-base ')}
            ${navLink('info.html', `<span x-text="t('nav_info')">Contacto</span>`, 'info').replace('class="', '@click="menuOpen=false" class="text-base ')}
          </nav>
        </div>

      </div>`;

    if (current === 'home') navEl.classList.add('nav-on-dark');
  }

  /* ── FOOTER ── */
  const footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.innerHTML = `
      <div class="relative max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-14 md:py-16">

        <!-- Top: logo -->
        <div class="pb-10 border-b border-paper/10">
          <img src="accelerate-impact-logo.svg" class="h-10 md:h-12 w-auto brightness-0 invert" alt="Accelerate Impact">
        </div>

        <!-- Middle: columns -->
        <div class="grid grid-cols-12 gap-6 py-10 border-b border-paper/10">
          <div class="col-span-12 md:col-span-4">
            <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-paper/50 mb-4"
               x-text="lang==='es' ? 'Partners del programa' : 'Program partners'"></p>
            <ul class="space-y-2 text-sm">
              <li><a href="https://www.egonzehnder.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">Egon Zehnder</a></li>
              <li><a href="https://www.kornferry.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">Korn Ferry</a></li>
              <li><a href="https://peopleexcellence.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">People Excellence</a></li>
              <li><a href="https://walkconsulting.net" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">WALK</a></li>
            </ul>
          </div>
          <div class="col-span-6 md:col-span-4">
            <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-paper/50 mb-4"
               x-text="lang==='es' ? 'Explorar' : 'Explore'"></p>
            <ul class="space-y-2 text-sm">
              <li><a href="journey.html" class="text-paper/80 hover:text-tef-blue transition-colors" x-text="t('nav_journey')"></a></li>
              <li><a href="agenda.html" class="text-paper/80 hover:text-tef-blue transition-colors" x-text="lang==='es' ? 'Agenda' : 'Agenda'"></a></li>
              <li><a href="autodiagnostico.html" class="text-paper/80 hover:text-tef-blue transition-colors" x-text="lang==='es' ? 'Tu Autodiagnóstico' : 'Self-Diagnosis'"></a></li>
              <li><a href="nadia.html" class="text-paper/80 hover:text-tef-blue transition-colors">Nadia</a></li>
              <li><a href="info.html" class="text-paper/80 hover:text-tef-blue transition-colors" x-text="t('nav_info')"></a></li>
            </ul>
          </div>
          <div class="col-span-6 md:col-span-4">
            <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-paper/50 mb-4"
               x-text="lang==='es' ? 'El programa' : 'The program'"></p>
            <ul class="space-y-2 text-sm text-paper/80">
              <li x-text="lang==='es' ? '10 meses · 3 fases' : '10 months · 3 phases'"></li>
              <li x-text="lang==='es' ? 'Comunidad de Líderes' : 'Leadership Community'"></li>
            </ul>
          </div>
        </div>

        <!-- Disclaimer — always shown -->
        <p class="py-5 text-[12px] text-paper/50 leading-relaxed max-w-3xl"
           x-text="lang==='en' ? '* The self-diagnosis is confidential and non-evaluative. Only you and the designated People team have access.' : '* El autodiagnóstico es confidencial y no evaluativo. Sólo accederás tú y el equipo People designado.'"></p>

        <!-- Bottom: legal + YG -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-paper/10">
          <p class="font-mono text-[11px] tracking-[0.18em] uppercase text-paper/40">© 2026 Telefónica S.A.</p>
          <div class="flex items-center gap-5">
            <a href="https://yellowglasses.es" target="_blank" rel="noopener"
               class="text-paper/50 hover:text-paper transition-colors" aria-label="Powered by Yellow Glasses">
              <img src="powered-by-YG.svg" alt="Powered by Yellow Glasses" class="h-6 w-auto" />
            </a>
          </div>
        </div>

      </div>`;
  }
})();
