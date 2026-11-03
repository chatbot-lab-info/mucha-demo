/* Movimiento de la web de Mucha (GSAP + ScrollTrigger + Lenis, todo local, sin CDN).
   Portada = UN DÍA ENTERO en Mucha: al scrollear, la luz va de la mañana a la noche y un reloj dentro del óvalo de la marca marca la hora (7:30 → 1:30).
   Si el visitante pidió "reducir animaciones" o algo falla, esta capa no corre y la web se ve igual (estática, con cinco franjas de color). */
(function () {
  const root = document.documentElement;
  if (!root.classList.contains('js-motion')) return;
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) { root.classList.remove('js-motion'); return; }
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, c) => (c || document).querySelector(s), $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const suave = 'power3.out', fino = 'power2.inOut';
  const finoMouse = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const lim = (x, a, b) => Math.min(b, Math.max(a, x)), liso = (x) => x * x * (3 - 2 * x);

  /* ---- scroll suave (Lenis) integrado con ScrollTrigger ---- */
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothTouch: false, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  /* cortina: en saltos largos (cruzar la portada fijada) no se recorre el día a toda velocidad: se funde, se salta y se vuelve a mostrar */
  const cortina = document.createElement('div');
  cortina.className = 'cortina'; cortina.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cortina);
  let saltando = false;
  const irA = (dest, opt) => {
    const el = typeof dest === 'string' ? $(dest) : dest;
    if (!el) return;
    const o = Object.assign({ offset: -54, duration: 1.7, easing: (x) => 1 - Math.pow(1 - x, 4) }, opt || {});
    const y = el === $('#inicio') ? 0 : el.getBoundingClientRect().top + window.scrollY + o.offset;
    if (Math.abs(y - window.scrollY) > innerHeight * 1.6) {
      if (saltando) return; saltando = true;
      cortina.style.background = getComputedStyle(document.body).backgroundColor;
      cortina.style.opacity = '1';
      setTimeout(() => {
        lenis.scrollTo(Math.max(0, y), { immediate: true, force: true });
        ScrollTrigger.update();
        requestAnimationFrame(() => requestAnimationFrame(() => { cortina.style.opacity = '0'; saltando = false; }));
      }, 240);
      return;
    }
    lenis.scrollTo(el === $('#inicio') ? 0 : el, o);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute('href'); if (h.length < 2) return;
    const el = $(h); if (!el) return;
    e.preventDefault(); irA(el);
  });

  /* ---- El día: paleta por momento (c1 arriba, c2 abajo, tinta = color de letras y líneas, luz = resplandor del sol/luna) ---- */
  const KF = [
    { p: 0,    c1: '#F7EFE0', c2: '#F0DAC0', t: '#A3333F', l: 'rgba(255,196,128,0.55)', lo: 0.55 },
    { p: 0.5,  c1: '#F6EBD8', c2: '#EFD3B0', t: '#A3333F', l: 'rgba(255,190,120,0.6)',  lo: 0.6 },
    { p: 1.5,  c1: '#F8F2E7', c2: '#F1EBDF', t: '#A3333F', l: 'rgba(255,236,196,0.55)', lo: 0.5 },
    { p: 2.5,  c1: '#EDC896', c2: '#D98F66', t: '#4F1520', l: 'rgba(255,168,88,0.65)',  lo: 0.65 },
    { p: 3.5,  c1: '#5B1A26', c2: '#2C0C12', t: '#F1EBDF', l: 'rgba(226,96,96,0.38)',   lo: 0.5 },
    { p: 4.5,  c1: '#1B0E0F', c2: '#0F0708', t: '#F1EBDF', l: 'rgba(241,235,223,0.14)', lo: 0.45 },
    { p: 5.3,  c1: '#1A0E0D', c2: '#120A09', t: '#F1EBDF', l: 'rgba(241,235,223,0.08)', lo: 0.4 }
  ];
  const paleta = (p) => {
    let i = 0; while (i < KF.length - 2 && p > KF[i + 1].p) i++;
    const a = KF[i], b = KF[i + 1], k = lim((p - a.p) / (b.p - a.p), 0, 1), mix = gsap.utils.interpolate;
    return { c1: mix(a.c1, b.c1, k), c2: mix(a.c2, b.c2, k), t: mix(a.t, b.t, k), l: mix(a.l, b.l, k), lo: a.lo + (b.lo - a.lo) * k };
  };
  /* hora en pantalla: 7:30 al desayuno → 1:30 al cierre (interpolada entre momentos) */
  const PCS = [0, 0.5, 1.5, 2.5, 3.5, 4.5, 5.3], MIN = [450, 450, 750, 1020, 1290, 1470, 1530];
  const minutos = (p) => { let i = 0; while (i < PCS.length - 2 && p > PCS[i + 1]) i++; return MIN[i] + (MIN[i + 1] - MIN[i]) * lim((p - PCS[i]) / (PCS[i + 1] - PCS[i]), 0, 1); };
  const hhmm = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(Math.round(m % 60) % 60).padStart(2, '0');

  const pin = $('#pin'), moms = $$('.mom'), fotos = $$('.arco-foto .f'), puntos = $$('#prog li'), astro = $('#astro'), luz = $('.luz'), estr = $('#estrellas'), reloj = $('#reloj'), pista = $('#pista'), hero = $('#hero'), abajo = $('#abajo'), arcoFoto = $('#arcoFoto');
  const sol = $('.sol', astro), luna = $('.luna', astro), horasEl = $$('.mom-hora');

  /* estrellas (solo se ven de noche) */
  for (let i = 0, n = innerWidth < 820 ? 46 : 80; i < n; i++) { const s = document.createElement('i'); s.style.left = (Math.random() * 100).toFixed(2) + '%'; s.style.top = (Math.pow(Math.random(), 1.4) * 78).toFixed(2) + '%'; const z = 1 + Math.random() * 1.8; s.style.width = s.style.height = z.toFixed(1) + 'px'; s.style.animationDelay = (-Math.random() * 3.4).toFixed(2) + 's'; s.style.animationDuration = (2.4 + Math.random() * 3).toFixed(2) + 's'; estr.appendChild(s); }
  /* fotos del local: solo se muestran las que existen en img/ (desayuno.jpg, almuerzo.jpg, merienda.jpg, cena.jpg, cocteles.jpg) */
  fotos.forEach((f) => { const im = new Image(); im.onload = () => { f.style.backgroundImage = 'url("' + f.dataset.img + '")'; f.classList.add('con'); arcoFoto.classList.add('hay'); }; im.src = f.dataset.img; });

  let W = 0, H = 0, lock = root.dataset.fijo || '';
  const layout = () => {
    W = reloj.offsetWidth; H = reloj.offsetHeight;
    pista.setAttribute('width', W); pista.setAttribute('height', H); pista.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    const e1 = $('.p1', pista), e2 = $('.p2', pista);
    [[e1, 0], [e2, 26]].forEach((x) => { const e = x[0]; e.setAttribute('cx', W / 2); e.setAttribute('cy', H / 2); e.setAttribute('rx', W / 2 + x[1]); e.setAttribute('ry', H / 2 + x[1]); });
  };
  const o = { p: 0 };
  const paint = () => {
    const p = o.p, pc = lock === 'dia' ? 1.5 : lock === 'noche' ? 5.3 : p, c = paleta(pc);
    pin.style.setProperty('--c1', c.c1); pin.style.setProperty('--c2', c.c2); pin.style.setProperty('--tinta', c.t); pin.style.setProperty('--luzc', c.l); pin.style.setProperty('--luzo', c.lo);
    root.style.setProperty('--tb', c.t);
    const m = minutos(p), th = Math.PI + 2 * Math.PI * (m - 450) / 1080;
    const ax = W / 2 + (W / 2) * Math.cos(th), ay = H / 2 + (H / 2) * Math.sin(th);
    astro.style.transform = 'translate(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px)';
    luz.style.transform = 'translate(' + (innerWidth / 2 + ax - W / 2).toFixed(1) + 'px,' + (innerHeight / 2 + ay - H / 2).toFixed(1) + 'px)';
    const noche = liso(lim((pc - 3.2) / 0.8, 0, 1));
    sol.style.opacity = (1 - noche).toFixed(3); luna.style.opacity = noche.toFixed(3); estr.style.opacity = (liso(lim((pc - 3.3) / 0.9, 0, 1)) * 0.95).toFixed(3);
    const ha = 1 - lim(p / 0.42, 0, 1);
    hero.style.opacity = ha.toFixed(3); hero.style.transform = 'translateY(' + (-p * 90).toFixed(1) + 'px) scale(' + (1 - lim(p, 0, 0.5) * 0.08).toFixed(3) + ')'; hero.style.visibility = ha > 0.01 ? 'visible' : 'hidden';
    abajo.style.opacity = (ha * 0.8).toFixed(3);
    const hora = hhmm(m);
    moms.forEach((el, k) => {
      const d = p - (k + 0.5), a = lim((d + 0.5) / 0.3, 0, 1) * (k === moms.length - 1 ? 1 : lim((0.5 - d) / 0.3, 0, 1)), aa = liso(a);
      el.style.opacity = aa.toFixed(3); el.style.visibility = aa > 0.01 ? 'visible' : 'hidden';
      el.style.transform = 'translateY(' + (-d * 70).toFixed(1) + 'px)';
      el.style.pointerEvents = aa > 0.6 ? 'auto' : 'none';
      const f = fotos[k]; if (f) { f.style.opacity = aa.toFixed(3); f.style.transform = 'scale(' + (1.08 - 0.08 * lim(d + 0.5, 0, 1)).toFixed(3) + ')'; }
    });
    horasEl.forEach((h) => { h.textContent = hora; });
    const on = Math.round(lim(p - 0.5, 0, 4)); puntos.forEach((d, i) => d.classList.toggle('on', i === on));
  };
  layout();

  /* ---- Portada: entrada (el óvalo se dibuja, aparece la marca) ---- */
  const entrada = gsap.timeline({ defaults: { ease: suave } });
  entrada
    .fromTo('.p1', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: fino }, 0.2)
    .fromTo('.p2', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.8, ease: fino }, 0.5)
    .fromTo('.marca-n', { opacity: 1, clipPath: 'inset(0 100% 0 0)', y: 12 }, { clipPath: 'inset(0 0% 0 0)', y: 0, duration: 1.7, ease: fino }, 0.5)
    .fromTo('.marca-e', { opacity: 0, scale: 0.3, rotate: -90 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.2 }, 1.5)
    .fromTo('.marca-l', { opacity: 0, y: 16 }, { opacity: 0.92, y: 0, duration: 1.3 }, 1.7)
    .fromTo('.hero-cta .btn', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.14 }, 2.1)
    .fromTo(astro, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 1.8)
    .fromTo(abajo, { opacity: 0 }, { opacity: 0.8, duration: 1 }, 2.6);
  entrada.eventCallback('onComplete', () => { gsap.set(['.marca-n', '.marca-e', '.marca-l', '.hero-cta .btn'], { clearProps: 'clipPath,y,scale,rotate' }); });

  /* ---- El recorrido: la portada queda fija ~7 pantallas y el scroll avanza el día ---- */
  let escena;
  const armar = () => {
    if (escena) { escena.scrollTrigger && escena.scrollTrigger.kill(); escena.kill(); }
    layout(); o.p = Math.min(o.p, 5.3);
    escena = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#escena', start: 'top top', end: () => '+=' + Math.round(innerHeight * 7), pin: '#pin', scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true } });
    o.p = 0; escena.to(o, { p: 5.3, duration: 10, onUpdate: paint }, 0);
    paint();
  };
  armar();
  let ancho = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - ancho) > 60) { ancho = innerWidth; armar(); ScrollTrigger.refresh(); } else { layout(); paint(); } });
  /* tema elegido a mano: día fijo / noche fija / recorrido (por defecto) */
  addEventListener('mucha-tema', (e) => { lock = (e.detail || ''); paint(); });

  /* ---- Barra: queda a la vista durante el recorrido; después se esconde al bajar y vuelve al subir ---- */
  const barra = $('#barra'), carta = $('#carta');
  let ultimo = 0;
  addEventListener('scroll', () => {
    const y = window.scrollY, pasada = carta.getBoundingClientRect().top < 90;
    if (pasada && y > ultimo + 4) barra.classList.add('oculta');
    else if (y < ultimo - 4 || !pasada) barra.classList.remove('oculta');
    ultimo = y;
  }, { passive: true });

  /* ---- Secciones: entradas con scroll ---- */
  ScrollTrigger.batch('.reveal', { start: 'top 88%', once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.2, ease: suave, stagger: 0.12, overwrite: true }) });
  const mark = $('.m-mark'); if (mark) gsap.fromTo(mark, { y: 40 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.encontranos', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

  /* ---- Carta: se anima cuando termina de pintarse ---- */
  const cartaAnim = () => {
    $$('.cat').forEach((c) => {
      const h = $('h3', c), platos = $$('.plato', c);
      if (c.dataset.mov) return; c.dataset.mov = '1';
      gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 82%', once: true } })
        .to(h, { opacity: 1, y: 0, duration: 1, ease: suave }, 0)
        .to(h, { '--l': 1, duration: 1.4, ease: fino }, 0.2)
        .to(platos, { opacity: 1, y: 0, duration: 0.9, ease: suave, stagger: 0.06 }, 0.3);
    });
    const chips = $$('#cartaTabs .chip');
    if (chips.length && !$('#cartaTabs').dataset.mov) { $('#cartaTabs').dataset.mov = '1'; gsap.to(chips, { opacity: 1, duration: 0.8, stagger: 0.06, ease: suave, scrollTrigger: { trigger: '#carta', start: 'top 80%', once: true } }); }
    ScrollTrigger.refresh();
  };
  /* ---- Reserva enviada: el tilde se dibuja ---- */
  const exito = (card) => {
    const tilde = $('.tilde', card); if (!tilde) return;
    gsap.fromTo(tilde, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' });
    gsap.fromTo($('path', tilde), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, delay: 0.25, ease: fino });
    gsap.from($$('.ok-reserva > *:not(.tilde)', card), { opacity: 0, y: 18, duration: 0.8, stagger: 0.08, delay: 0.3, ease: suave });
  };

  /* ---- Cursor y botones magnéticos (solo mouse) ---- */
  if (finoMouse) {
    const cur = $('#cursor'), qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; cur.classList.add('ver'); qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => { cur.classList.toggle('grande', !!e.target.closest('a,button,.chip,input,select,textarea,label')); });
    $$('.btn-oro, .hero-cta .btn').forEach((b) => {
      const mx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.18); my((e.clientY - r.top - r.height / 2) * 0.28); });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* las fuentes e imágenes cambian las alturas: recalcular */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); paint(); ScrollTrigger.refresh(); });
  addEventListener('load', () => ScrollTrigger.refresh());
  window.Mov = { listo: true, lenis, irA, carta: cartaAnim, exito, refrescar: () => ScrollTrigger.refresh() };
  if (window.__cartaLista) cartaAnim();
})();
