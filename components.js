(function () {
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
    navEl.setAttribute('x-data', '{ menuOpen: false }');
    navEl.innerHTML = `
      <!-- Bar principal -->
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="index.html" class="flex items-center gap-3 group">
          <img src="accelerate-impact-logo.svg" class="h-7 w-auto" alt="Accelerate Impact">
        </a>
        <div class="flex items-center gap-6">
          <!-- Nav desktop -->
          <nav class="hidden md:flex items-center gap-8">
            ${navLink('journey.html', `<span x-text="t('nav_journey')">Journey</span>`, 'journey')}
            ${navLink('nadia.html', 'Nadia', 'nadia')}
            ${navLink('info.html', `<span x-text="t('nav_info')">Contacto</span>`, 'info')}
          </nav>
          <!-- Idioma -->
          <div class="flex items-center gap-0 font-mono text-xs tracking-[0.18em]">
            <button @click="lang='es'" :class="lang==='es' ? 'text-tef-dark' : 'text-tef-dark/40 hover:text-tef-dark'" class="px-2 py-1 transition-colors uppercase">ES</button>
            <span class="text-tef-dark/20">/</span>
            <button @click="lang='en'" :class="lang==='en' ? 'text-tef-dark' : 'text-tef-dark/40 hover:text-tef-dark'" class="px-2 py-1 transition-colors uppercase">EN</button>
          </div>
          <!-- Hamburguesa (solo mobile) -->
          <button @click="menuOpen = !menuOpen"
                  class="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
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

      <!-- Menú mobile desplegable -->
      <div x-show="menuOpen"
           x-transition:enter="transition ease-out duration-200"
           x-transition:enter-start="opacity-0 -translate-y-2"
           x-transition:enter-end="opacity-100 translate-y-0"
           x-transition:leave="transition ease-in duration-150"
           x-transition:leave-start="opacity-100 translate-y-0"
           x-transition:leave-end="opacity-0 -translate-y-2"
           class="md:hidden absolute top-full left-0 right-0 bg-paper/95 backdrop-blur-md border-b border-ink/10 z-40"
           style="display:none" x-cloak>
        <nav class="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
          ${navLink('journey.html', `<span x-text="t('nav_journey')">Journey</span>`, 'journey').replace('class="', '@click="menuOpen=false" class="text-base ')}
          ${navLink('nadia.html', 'Nadia', 'nadia').replace('class="', '@click="menuOpen=false" class="text-base ')}
          ${navLink('info.html', `<span x-text="t('nav_info')">Contacto</span>`, 'info').replace('class="', '@click="menuOpen=false" class="text-base ')}
        </nav>
      </div>`;
  }

  /* ── FOOTER ── */
  const footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.innerHTML = `
      <div class="relative max-w-7xl mx-auto px-6 py-14 md:py-16">

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
