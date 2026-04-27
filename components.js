(function () {

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
      <div class="max-w-2xl mx-auto relative">

        <!-- Pill -->
        <div class="navbar-pill pointer-events-auto flex items-center h-14 px-5 gap-3 rounded-full border border-black/[0.08] shadow-md"
             style="background:rgba(247,247,255,0.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);">

          <!-- Logo -->
          <a href="index.html" class="flex-shrink-0">
            <img src="accelerate-impact-logo.svg" class="h-7 w-auto" alt="Accelerate Impact">
          </a>

          <!-- Nav desktop — centrado -->
          <nav class="hidden md:flex flex-1 items-center justify-center gap-8">
            ${navLink('journey.html', `<span x-text="t('nav_journey')">Journey</span>`, 'journey')}
            ${navLink('nadia.html', 'Nadia', 'nadia')}
            ${navLink('info.html', `<span x-text="t('nav_info')">Contacto</span>`, 'info')}
          </nav>

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
      <div class="relative max-w-[1920px] mx-auto px-6 py-14 md:py-16">

        <!-- Top: logo + CTA -->
        <div class="grid grid-cols-12 gap-6 pb-10 border-b border-paper/10">
          <div class="col-span-12 md:col-span-6 flex items-start">
            <img src="accelerate-impact-logo.svg" class="h-10 md:h-12 w-auto brightness-0 invert" alt="Accelerate Impact">
          </div>
          <div class="col-span-12 md:col-span-6 flex md:justify-end items-start">
            <a href="mailto:accelerateimpact@universitas.com"
               class="group inline-flex items-center gap-3 border-b border-paper/30 hover:border-tef-blue pb-1 transition-colors">
              <span class="font-mono text-[11px] tracking-[0.2em] uppercase group-hover:text-tef-blue transition-colors" x-text="lang==='es' ? 'Escríbenos' : 'Get in touch'"></span>
              <span class="text-lg group-hover:translate-x-1 group-hover:text-tef-blue transition-all">→</span>
            </a>
          </div>
        </div>

        <!-- Middle: columns -->
        <div class="grid grid-cols-12 gap-6 py-10 border-b border-paper/10">
          <div class="col-span-12 md:col-span-4">
            <p class="font-mono text-[10px] tracking-[0.2em] uppercase text-paper/50 mb-4"
               x-text="lang==='es' ? 'Partners del programa' : 'Program partners'"></p>
            <ul class="space-y-2 text-sm">
              <li><a href="https://www.kornferry.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">Korn Ferry</a></li>
              <li><a href="https://www.egonzehnder.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">Egon Zehnder</a></li>
              <li><a href="https://universitas.telefonica.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">Telefónica Universitas</a></li>
              <li><a href="https://walkconsulting.net" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">WALK</a></li>
              <li><a href="https://peopleexcellence.com" target="_blank" rel="noopener" class="text-paper/80 hover:text-tef-blue transition-colors">People Excellence</a></li>
            </ul>
          </div>
          <div class="col-span-6 md:col-span-4">
            <p class="font-mono text-[10px] tracking-[0.2em] uppercase text-paper/50 mb-4"
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
            <p class="font-mono text-[10px] tracking-[0.2em] uppercase text-paper/50 mb-4"
               x-text="lang==='es' ? 'El programa' : 'The program'"></p>
            <ul class="space-y-2 text-sm text-paper/80">
              <li x-text="lang==='es' ? '10 meses · 3 fases' : '10 months · 3 phases'"></li>
              <li x-text="lang==='es' ? 'Comunidad de Líderes' : 'Leadership Community'"></li>
            </ul>
          </div>
        </div>

        <!-- Disclaimer — always shown -->
        <p class="py-5 text-[11px] text-paper/50 leading-relaxed max-w-3xl"
           x-text="lang==='en' ? '* The self-diagnosis is confidential and non-evaluative. Only you and the designated People team have access.' : '* El autodiagnóstico es confidencial y no evaluativo. Sólo accederás tú y el equipo People designado.'"></p>

        <!-- Bottom: legal + YG -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-paper/10">
          <p class="font-mono text-[10px] tracking-[0.18em] uppercase text-paper/40">© 2026 Telefónica S.A.</p>
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
