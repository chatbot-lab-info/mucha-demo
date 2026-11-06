(function () {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const X = window.Prop, esc = X.esc, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  $('#lMapa').href = X.mapa(); $('#lWa').href = X.wa('Hola Mucha!');
  /* videos: cada <video data-v> carga su clip */
  const playV = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const setV = (v, n) => { v.poster = X.M + n + '.jpg'; v.src = X.M + n + '.mp4'; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); };
  $$('video[data-v]').forEach((v) => { setV(v, v.dataset.v); playV(v); });
  /* reproducir solo lo visible */
  const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { if (!v.src) setV(v, v.dataset.v); playV(v); } else v.pause(); }), { rootMargin: '20% 0px' });
  const watch = (v) => io.observe(v);

  /* scroll suave */
  let lenis = null;
  if (!reduce && window.Lenis) { lenis = new Lenis({ lerp: .09, wheelMultiplier: .95 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return; const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); lenis ? lenis.scrollTo(t, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView({ behavior: 'smooth' }); });
  gsap.to('#barraP', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0 } });
  ScrollTrigger.create({ start: 80, onUpdate: (s) => $('#nav').classList.toggle('fondo', s.scroll() > 80) });

  /* hero */
  const wm = $$('.wm span');
  if (!reduce) {
    gsap.set('.wm', { overflow: 'hidden' }); gsap.from(wm, { yPercent: 120, duration: 1.4, stagger: .09, ease: 'power4.out', delay: .2 });
    gsap.from('.vw', { clipPath: 'inset(100% 0 0 0)', duration: 1.5, stagger: .14, ease: 'power4.inOut', delay: .1 });
    gsap.from('.vw video', { scale: 1.5, duration: 2.2, ease: 'power3.out', delay: .1 });
    gsap.from('.sub,.hero-pie', { opacity: 0, y: 24, duration: 1.1, delay: 1.1, stagger: .15, ease: 'power3.out' });
    const h = { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 };
    gsap.to('.vl', { yPercent: -28, ease: 'none', scrollTrigger: h }); gsap.to('.vr', { yPercent: -48, ease: 'none', scrollTrigger: h }); gsap.to('.vc', { yPercent: -12, scale: 1.08, ease: 'none', scrollTrigger: h });
    gsap.to(wm, { yPercent: (i) => -20 - i * 12, opacity: .0, ease: 'none', scrollTrigger: { trigger: '#hero', start: '35% top', end: 'bottom top', scrub: .6 } });
    gsap.to('.sub', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: '#hero', start: '15% top', end: '55% top', scrub: .6 } });
  }
  watch($('.vl video')); watch($('.vc video')); watch($('.vr video'));

  /* manifiesto */
  const MAN = [['Mucha', 0], ['es', 0], ['herencia', 'em'], ['italiana:', 0], ['pan', 0], ['de', 0], ['masa', 0], ['madre', 0], ['al', 0], ['amanecer,', 0], ['@pan', 1], ['pastas', 0], ['hechas', 0], ['a', 0], ['mano', 0], ['al', 0], ['mediodía,', 0], ['@pasta', 1], ['y', 0], ['cócteles', 0], ['cuando', 0], ['cae', 0], ['la', 0], ['noche.', 0], ['@aperitivo', 1]];
  $('#mt').innerHTML = MAN.map(([w, k]) => w[0] === '@' ? '<span class="pl"><video data-v="' + w.slice(1) + '" muted loop playsinline></video></span>' : '<span class="w">' + (k === 'em' ? '<em>' + w + '</em>' : esc(w)) + '</span>').join(' ');
  $$('#mt video').forEach((v) => { setV(v, v.dataset.v); v.preload = 'auto'; playV(v); });
  if (!reduce) {
    gsap.to('#mt .w', { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: '#man', start: 'top 70%', end: 'bottom 70%', scrub: .4 } });
    $$('#mt .pl').forEach((p) => gsap.to(p, { scale: 1, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%' } }));
  } else { $$('#mt .w').forEach((w) => { w.style.opacity = 1; }); $$('#mt .pl').forEach((p) => { p.style.opacity = 1; p.style.transform = 'none'; }); }

  /* recorrido horizontal: de la mañana a la noche */
  const PAN = [
    { h: '07:30', t: 'Buen día', d: 'Café, medialunas y pan de masa madre. La panadería abre antes que nadie.', v: 'croissant', bg: '#F1EBDF', c: '#2a1414' },
    { h: '12:30', t: 'Mediodía', d: 'Pastas caseras, risottos y cocina italiana. La cocina está abierta todo el día.', v: 'pasta', bg: '#F4DCC0', c: '#3a1a14' },
    { h: '17:00', t: 'La merienda', d: 'Pastelería artesanal, tortas y algo rico para acompañar el café.', v: 'horno', bg: '#D98C6A', c: '#2a0f0c' },
    { h: '21:00', t: 'La cena', d: 'Entradas para compartir, principales y una carta de vinos para quedarse.', v: 'plato', bg: '#4a1620', c: '#F1EBDF' },
    { h: '23:30', t: 'Cócteles', d: 'Aperitivos, spritz y tragos de autor en la barra, la vereda y la terraza.', v: 'spritz', bg: '#120A09', c: '#F1EBDF' }
  ];
  $('#track').innerHTML = PAN.map((p) => '<article class="pan"><div class="tx"><div class="n">' + p.h + '</div><h3>' + esc(p.t) + '</h3><p>' + esc(p.d) + '</p></div><div class="ar"><video data-v="' + p.v + '" muted loop playsinline></video></div></article>').join('');
  $$('#track video').forEach((v) => { setV(v, v.dataset.v); v.preload = 'auto'; playV(v); });
  const rec = $('#recorrido'), mm = gsap.matchMedia();
  const bgAt = (i) => ({ backgroundColor: PAN[i].bg, '--c': PAN[i].c });
  gsap.set(rec, bgAt(0));
  if (!reduce) {
    mm.add('(min-width:900px)', () => {
      const tr = $('#track'), dist = () => tr.scrollWidth - innerWidth;
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#recorrido', start: 'top top', end: () => '+=' + dist() * 1.15, pin: '#recIn', scrub: .7, invalidateOnRefresh: true } });
      tl.to(tr, { x: () => -dist(), ease: 'none', duration: PAN.length - 1 });
      PAN.slice(1).forEach((p, i) => tl.to(rec, { ...bgAt(i + 1), duration: .8, ease: 'none' }, i + .1));
      $$('.pan .ar').forEach((a, i) => gsap.fromTo(a, { yPercent: 8 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '#recorrido', start: 'top top', end: () => '+=' + dist() * 1.15, scrub: true } }));
    });
    mm.add('(max-width:899px)', () => {
      $$('.pan').forEach((p, i) => ScrollTrigger.create({ trigger: p, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) gsap.to(rec, { ...bgAt(i), duration: .8, ease: 'power2.out' }); } }));
      $$('.pan').forEach((p) => gsap.from(p.children, { y: 50, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 75%' } }));
      $$('.pan').forEach((p) => { p.style.height = 'auto'; p.style.minHeight = '92svh'; }); $('#track').style.flexDirection = 'column'; $('.rec-in').style.height = 'auto'; $('#track').style.flex = 'none';
      $$('.pan').forEach((p) => { p.style.width = '100%'; });
    });
  } else { $('#track').style.flexDirection = 'column'; $('.rec-in').style.height = 'auto'; $$('.pan').forEach((p) => { p.style.width = '100%'; p.style.height = 'auto'; p.style.padding = '40px 24px'; }); }

  /* marquee */
  const MQ = ['Panadería', 'Pastelería artesanal', 'Pastas caseras', 'Focaccias', 'Cócteles', 'Cocina italiana'];
  const mqH = MQ.map((m) => '<span>' + esc(m) + '</span><span><b>✦</b></span>').join('');
  $('#mq').innerHTML = '<div style="display:inline-flex">' + mqH + '</div><div style="display:inline-flex">' + mqH + '</div>';
  if (!reduce) { const t = gsap.to('#mq', { xPercent: -50, repeat: -1, duration: 38, ease: 'none' }); ScrollTrigger.create({ trigger: '.mq', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { gsap.to(t, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 220, 8) * (s.direction), duration: .3, overwrite: true }); gsap.to(t, { timeScale: s.direction, duration: 1.4, delay: .3, overwrite: false }); } }); }

  /* carta escrita */
  const CLIP = { 'Desayunos y meriendas': 'croissant', 'Panadería y bollería': 'horno', 'Pastelería': 'horno', 'Cafetería': 'croissant', 'Antipasti': 'burrata', 'Focaccias': 'mesa', 'Ensaladas': 'mesa', 'Pastas': 'pasta', 'Principales': 'plato', 'Dolci': 'horno', 'Infantil y sin TACC': 'pasta', 'Aperitivos y spritz': 'aperitivo', 'Cócteles': 'spritz', 'Vinos': 'vino', 'Licores y whiskies': 'barra', 'Bebidas': 'spritz' };
  const carV = $('#carV'), vids = {};
  const clipDe = (c) => CLIP[c] || 'mesa';
  function clipVer(c) { const n = clipDe(c); if (!vids[n]) { const v = document.createElement('video'); setV(v, n); carV.appendChild(v); vids[n] = v; } Object.keys(vids).forEach((k) => { const on = k === n; vids[k].classList.toggle('on', on); if (on) playV(vids[k]); else setTimeout(() => { if (!vids[k].classList.contains('on')) vids[k].pause(); }, 1100); }); }
  const fila = (p) => '<div class="it"><b>' + esc(p.nombre) + '</b><span>' + esc(X.precio(p)) + '</span>' + (p.descripcion ? '<p>' + esc(p.descripcion) + '</p>' : '') + '</div>';
  let cartaD = null, cat = null;
  X.carta().then((d) => {
    cartaD = d; const R = $('#carR');
    if (!d.cats.length) { R.innerHTML = '<p class="vacio">La carta se está actualizando. Escribinos por WhatsApp.</p>'; return; }
    cat = d.cats[0].nombre;
    $('#cn').innerHTML = d.cats.map((c, i) => '<button type="button" data-c="' + esc(c.nombre) + '" aria-current="' + (i === 0) + '"><i>' + String(i + 1).padStart(2, '0') + '</i>' + esc(c.nombre) + '</button>').join('');
    pintar(false);
  });
  function pintar(anim) { const c = cartaD.cats.find((x) => x.nombre === cat); $('#carR').innerHTML = '<h4 class="sr">' + esc(cat) + '</h4>' + c.items.map(fila).join(''); clipVer(cat); if (anim && !reduce) gsap.from('#carR .it', { y: 36, opacity: 0, duration: .7, stagger: .035, ease: 'power3.out', clearProps: 'all' }); ScrollTrigger.refresh(); }
  $('#cn').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $$('#cn button').forEach((x) => x.setAttribute('aria-current', String(x === b))); pintar(true); if (innerWidth < 900) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); else { const r = $('.car-r').getBoundingClientRect(); if (r.top < 0) (lenis ? lenis.scrollTo('.car-r', { offset: -110 }) : null); } });

  /* reserva */
  X.rotar($('#resV'), ['terraza', 'fachada', 'spritz', 'local'], 6500);
  Reserva.montar($('#resBox'), { onPaso: () => ScrollTrigger.refresh() });
  if (!reduce) {
    gsap.from('.res-t > *', { y: 50, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#reservar', start: 'top 65%' } });
    gsap.fromTo('.res-v .rvid', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#reservar', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.pie-m span', { yPercent: 110, duration: 1.3, stagger: .08, ease: 'power4.out', scrollTrigger: { trigger: '.pie', start: 'top 80%' } });
    gsap.from('.pie-g > *', { y: 40, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.pie-g', start: 'top 90%' } });
  }
  $('#pieM').innerHTML = 'MUCHA'.split('').map((l) => '<span>' + l + '</span>').join('');
  addEventListener('load', () => ScrollTrigger.refresh());
})();
