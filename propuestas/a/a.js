(function () {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const X = window.Prop, esc = X.esc, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches, desk = () => innerWidth >= 900;
  const nz = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  gsap.registerPlugin(ScrollTrigger);
  $('#lMapa').href = X.mapa(); $('#lWa').href = X.wa('Hola Mucha!');

  /* ── videos: cargar cerca de la pantalla, reproducir solo lo visible ── */
  const playV = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const setV = (v, n) => { v.poster = X.M + n + '.jpg'; v.src = X.M + n + '.mp4'; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); };
  const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { if (!v.getAttribute('src')) setV(v, v.dataset.v); playV(v); } else v.pause(); }), { rootMargin: '60% 0px' });
  const watch = (v) => io.observe(v);

  /* ── texto con máscara ── */
  function splitW(el) {
    const out = [];
    const walk = (node) => Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) { const fr = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) { fr.appendChild(document.createTextNode(' ')); return; } const w = document.createElement('span'); w.className = 'sw'; const i = document.createElement('span'); i.textContent = t; w.appendChild(i); fr.appendChild(w); out.push(i); }); n.replaceWith(fr); }
      else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el); return out;
  }
  const letras = (el, txt) => { el.innerHTML = txt.split('').map((l) => '<span><i>' + l + '</i></span>').join(''); return $$('i', el); };

  /* ── scroll suave ── */
  let lenis = null;
  if (!reduce && window.Lenis) { lenis = new Lenis({ lerp: .085, wheelMultiplier: .95 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); lenis.stop(); }
  let saltando = false; const salto = document.createElement('div'); salto.className = 'salto'; document.body.appendChild(salto);
  const ir = (t, o) => { const el = typeof t === 'string' ? $(t) : t; if (!el) return; if (!lenis) { el.scrollIntoView({ behavior: 'smooth' }); return; } const d = Math.abs(el.getBoundingClientRect().top); if (d < innerHeight * .35 || (o && o.duration)) { lenis.scrollTo(el, Object.assign({ duration: 1.1, easing: (x) => 1 - Math.pow(1 - x, 4) }, o || {})); return; } lenis.stop(); saltando = true; gsap.to(salto, { opacity: 1, duration: .2, ease: 'power1.in', onComplete: () => { lenis.start(); lenis.scrollTo(el, Object.assign({ immediate: true, force: true }, o || {})); ScrollTrigger.update(); if (typeof sync === 'function') sync(true); requestAnimationFrame(() => requestAnimationFrame(() => { saltando = false; gsap.to(salto, { opacity: 0, duration: .35, ease: 'power1.out' }); })); } }); };
  /* ── reserva en celular: pantalla completa (res=panel), libre, fijo o pausa ── */
  const MR = document.documentElement.dataset.res || 'panel', panel = () => !desk() && MR === 'panel';
  const rr = $('#raTop'); let rAb = false;
  rr.insertAdjacentHTML('afterbegin', '<button class="ra-x" type="button" aria-label="Cerrar">×</button>'); rr.insertAdjacentHTML('afterbegin', '<div class="ra-bg" aria-hidden="true"></div><div class="ra-dim" aria-hidden="true"></div>'); rr.setAttribute('data-lenis-prevent', '');
  function ubicar() { const q = panel(); if (q && rr.parentNode !== document.body) document.body.appendChild(rr); else if (!q && rr.parentNode === document.body) { const w = $('.res-in'); if (w) w.appendChild(rr); } }
  ubicar();
  const hi = document.documentElement;
  function abrirRes() {
    if (rAb) return; rAb = true; ubicar(); rr.classList.add('abierto'); hi.classList.add('ra-on'); dispatchEvent(new Event('ra-fit')); setTimeout(() => dispatchEvent(new Event('ra-fit')), 300); if (lenis) lenis.stop(); try { history.pushState({ ra: 1 }, ''); } catch (e) {}
    if (reduce) return; const sh = $('#raBox', rr);
    gsap.killTweensOf([sh, $('.ra-dim', rr), $('.ra-x', rr)]);
    gsap.fromTo($('.ra-dim', rr), { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power2.out' });
    gsap.fromTo(sh, { yPercent: 100 }, { yPercent: 0, duration: .95, ease: 'power4.out', clearProps: 'transform' });
    gsap.fromTo($('.ra-x', rr), { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, delay: .45, ease: 'back.out(2)', clearProps: 'all' });
  }
  function cerrarRes(pop) {
    if (!rAb) return; rAb = false; hi.classList.remove('ra-on');
    const fin = () => { rr.classList.remove('abierto'); if (lenis) lenis.start(); };
    if (reduce) fin(); else { const sh = $('#raBox', rr); gsap.to($('.ra-dim', rr), { opacity: 0, duration: .5 }); gsap.to(sh, { yPercent: 105, duration: .6, ease: 'power3.in', onComplete: () => { fin(); gsap.set(sh, { clearProps: 'transform' }); } }); }
    if (!pop && history.state && history.state.ra) history.back();
  }
  addEventListener('popstate', () => cerrarRes(true)); addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarRes(); }); addEventListener('resize', () => { if (desk()) cerrarRes(); ubicar(); });
  $('.ra-x', rr).addEventListener('click', () => cerrarRes()); $('.ra-dim', rr).addEventListener('click', () => cerrarRes()); $('.ra-open').addEventListener('click', abrirRes);
  document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return; const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); if (a.getAttribute('href') === '#reservar' && panel()) { abrirRes(); return; } if (a.getAttribute('href') === '#inicio') { lenis ? (scrollY > innerHeight * 1.5 ? ir(document.body, { offset: 0 }) : lenis.scrollTo(0, { duration: 1.1 })) : scrollTo({ top: 0, behavior: 'smooth' }); return; } ir(t); });
  gsap.to('#prog', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0 } });

  /* ── hero: wordmark, ambiente y ventana de capítulos ── */
  const wmI = $('#wm img');
  const CH = [{ f: 'fachada', l: 'Bv. Gálvez y Mitre' }, { f: 'croissant', l: 'El café' }, { f: 'local', l: 'El salón' }, { f: 'terraza', l: 'La vereda' }];
  const win = $('#win'), chap = $('#chap'), amb = $('#amb'), DUR = 5.2;
  const hv = CH.map((c, i) => { const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = i < 2 ? 'auto' : 'metadata'; v.poster = X.M + c.f + '.jpg'; v.src = X.M + c.f + '.mp4'; v.className = 'rvid'; win.insertBefore(v, $('#chapL')); return v; });
  CH.forEach((c) => { const i = document.createElement('i'); i.style.backgroundImage = 'url(' + X.M + c.f + '.jpg)'; amb.appendChild(i); });
  chap.innerHTML = CH.map(() => '<i><u></u></i>').join('');
  const bars = $$('#chap u'), ambs = $$('#amb i'); let cur = -1, tw = null, heroOn = true;
  function cap(k) {
    cur = k; hv.forEach((v, j) => { v.classList.toggle('on', j === k); if (j === k) playV(v); else setTimeout(() => { if (cur !== j) v.pause(); }, 1500); });
    ambs.forEach((a, j) => a.classList.toggle('on', j === k));
    bars.forEach((b, j) => { gsap.killTweensOf(b); gsap.set(b, { scaleX: j < k ? 1 : 0 }); });
    $('#chapN').textContent = String(k + 1).padStart(2, '0'); $('#chapT').textContent = CH[k].l;
    if (tw) tw.kill(); tw = gsap.to(bars[k], { scaleX: 1, duration: DUR, ease: 'none', onComplete: () => cap((k + 1) % CH.length) }); if (!heroOn) tw.pause();
  }
  win.addEventListener('click', () => cap((cur + 1) % CH.length));
  cap(0);
  ScrollTrigger.create({ trigger: '#inicio', start: 'top bottom', end: 'bottom top', onToggle: (s) => { heroOn = s.isActive; if (tw) tw.paused(!heroOn); hv.forEach((v, j) => { if (!heroOn) v.pause(); else if (j === cur) playV(v); }); } });

  /* ── entrada ── */
  const nav = $('#nav'), dock = $('#dock'); let listo = false;
  function pre() {
    if (reduce) { $('#load').style.display = 'none'; listo = true; if (X.precargar) X.precargar(3); return; }
    gsap.set(wmI, { yPercent: 118 }); gsap.set(['#kick', '#sub', '#lead'], { opacity: 0, y: 26 }); gsap.set('#acc', { y: 60, opacity: 0 }); if (desk()) gsap.set('.win', { clipPath: 'inset(100% 0% 0% 0%)' }); gsap.set('.hero-win', { scale: 1.06 }); gsap.set('#nav', { opacity: 0, y: -50 }); gsap.set('.desliza', { opacity: 0 });
  }
  function entrar() {
    const L = $('#load'); if (reduce || !L) { if (lenis) lenis.start(); return; }
    const tl = gsap.timeline(), K = Math.hypot(innerWidth, innerHeight) / 2 * 1.08;
    gsap.set(L, { '--h': 0 }); let LH = L.querySelector('.load-h'); if (!LH) { LH = document.createElement('div'); LH.className = 'load-h'; L.insertBefore(LH, L.querySelector('.load-w')); } const LF = L.querySelector('.load-f'), ST = { r: 53, h: 0 }; LF.style.visibility = 'hidden'; LH.style.visibility = 'hidden';
    tl.fromTo('#load .load-b', { opacity: 0, scale: .55 }, { opacity: 1, scale: 1, duration: .85, ease: 'back.out(1.7)' }, 0)
      .to(L, { '--p': 1, duration: 1.1, ease: 'power2.inOut' }, .2)
      .add(() => { LF.style.visibility = 'visible'; LF.style.setProperty('--r', '53px'); }, 1.35)
      .to(ST, { r: K, duration: .85, ease: 'power3.in', onUpdate: () => LF.style.setProperty('--r', ST.r + 'px') }, 1.35)
      .to('#load .load-b', { opacity: 0, duration: .3 }, 1.7)
      .add(() => { L.style.backgroundColor = 'transparent'; LF.style.display = 'none'; LH.style.visibility = 'visible'; LH.style.opacity = 1; LH.style.setProperty('--hr', '0px'); }, 2.2)
      .fromTo('#load .load-w', { opacity: 0, y: 14, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'power3.out' }, 2.05)
      .to('#load .load-w', { opacity: 0, scale: 1.12, duration: .5, ease: 'power2.in' }, 2.65)
      .to(ST, { h: K, duration: 1.4, ease: 'power4.inOut', onUpdate: () => LH.style.setProperty('--hr', ST.h + 'px'), onComplete: () => { L.style.display = 'none'; if (lenis) lenis.start(); } }, 2.55)
      .add(() => { if (desk()) gsap.to('.win', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut' }); }, 2.6)
      .to('.hero-win', { scale: 1, duration: 2.2, ease: 'power3.out' }, 2.55)
      .to(wmI, { yPercent: 0, duration: 1.5, stagger: .09, ease: 'power4.out' }, 3.15)
      .to(['#kick', '#sub', '#lead'], { opacity: 1, y: 0, duration: 1.1, stagger: .12, ease: 'power3.out', clearProps: 'transform' }, 3.4)
      .to('#acc', { y: 0, opacity: 1, duration: 1.3, ease: 'power4.out', clearProps: 'transform' }, 3.5)
      .to('#nav', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 3.6)
      .to('.desliza', { opacity: 1, duration: 1 }, 4)
      .add(() => { listo = true; sync(true); if (X.precargar) X.precargar(3); }, 3.9);
  }
  pre();
  const fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]) : Promise.resolve();
  fuentes.then(() => requestAnimationFrame(entrar));

  /* ── hero: parallax con el scroll y con el mouse ── */
  if (!reduce) {
    const mm = gsap.matchMedia();
    mm.add('(min-width:900px)', () => {
      const h = { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('#hwin', { yPercent: -9, ease: 'none', scrollTrigger: h });
      gsap.to('.hero-top', { yPercent: -22, ease: 'none', scrollTrigger: h });
      if (fine) {
        const qx = gsap.quickTo('#win', 'x', { duration: 1.2, ease: 'power3' }), qy = gsap.quickTo('#win', 'y', { duration: 1.2, ease: 'power3' });
        const mv = (e) => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5; qx(nx * -22); qy(ny * -16); };
        addEventListener('pointermove', mv); return () => removeEventListener('pointermove', mv);
      }
    });
    mm.add('(max-width:899px)', () => {
      const h = { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('#win', { scale: 1.14, ease: 'none', scrollTrigger: h }); gsap.to('.hero-top', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#inicio', start: '8% top', end: '70% top', scrub: true } });
    });
  }

  /* ── navegación: indicador, ocultar al bajar, secciones activas ── */
  const links = $$('#navP a'), ni = $('#ni'); let enRes = false, paso = 1;
  let manOn = false;
  const dockSync = () => dock.classList.toggle('baja', paso > 1 && enRes && !desk());
  function marcar(id) {
    links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
    const a = links.find((x) => x.classList.contains('on')); if (a && ni) { ni.style.width = a.offsetWidth + 'px'; ni.style.transform = 'translateX(' + a.offsetLeft + 'px)'; }
    nav.classList.toggle('claro', id === 'carta' || manOn); enRes = id === 'reservar'; dockSync();
    $$('#dock a').forEach((a2) => a2.classList.toggle('on', a2.dataset.s === (id === 'dia' ? 'inicio' : id)));
  }
  [['inicio', '#inicio', '#man'], ['dia', '#dia', '#dia'], ['carta', '#carta', '#carta'], ['reservar', '#reservar', '#reservar'], ['llegar', '#llegar', '#llegar']].forEach(([id, a, b]) => ScrollTrigger.create({ trigger: a, start: 'top 55%', endTrigger: b, end: 'bottom 55%', onToggle: (s) => { if (s.isActive) marcar(id); } }));
  ScrollTrigger.create({ trigger: '#man', start: 'top 60px', end: 'bottom 60px', onToggle: (s) => { manOn = s.isActive; const a = links.find((x) => x.classList.contains('on')); if (a) marcar(a.getAttribute('href').slice(1)); } });
  marcar('inicio'); addEventListener('resize', () => { const a = links.find((x) => x.classList.contains('on')); if (a) marcar(a.getAttribute('href').slice(1)); });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { const y = s.scroll(); nav.classList.toggle('oculto', y > 240 && s.direction === 1); if (y < 240) nav.classList.remove('oculto'); sync(); } });


  /* ── los dos botones de la portada se transforman en el menú al scrollear (y vuelven al subir) ── */
  let dk = false, vol = [];
  const parejas = () => desk() ? [['#acc .btn-r', '#nav .btn-c'], ['#acc .btn-g', '#navP a[href="#carta"]']] : [['#acc .btn-r', '#dock a[data-s="reservar"]'], ['#acc .btn-g', '#dock a[data-s="carta"]']];
  const limpiarVuelo = () => { vol.forEach((f) => { f.t.kill(); f.c.remove(); f.b.classList.remove('fly'); }); vol = []; };
  function estado(on) { dk = on; document.body.classList.toggle('dk', on); dock.classList.toggle('ver', on); }
  /* móvil: los botones de la portada viajan por encima de la tarjeta crema (la acompañan al subir) y recién después se deslizan al menú */
  const accEl = $('#acc'); let accPh = null, accOn = false, accLast = '';
function accLimpiar() { if (!accEl) return; accEl.style.cssText = accEl.style.cssText.replace(/(position|left|top|width|z-index|translate)\s*:[^;]*;?/g, ''); if (accPh) { accPh.remove(); accPh = null; } accOn = false; accLast = ''; }
function accRider() {
  if (!accEl) return;
  if (desk() || reduce) { if (accOn || accPh) accLimpiar(); return; }
  if (!accPh) { accPh = document.createElement('div'); accPh.style.cssText = 'height:56px;width:100%;pointer-events:none'; accEl.parentNode.insertBefore(accPh, accEl); }
  const r = accPh.getBoundingClientRect(); if (!r.width) return;
  const m = $('#man'); let ty = 0;
  if (m && window.scrollY < 800) ty = Math.min(0, m.getBoundingClientRect().top - 12 - r.bottom);
  const k = r.left + '|' + r.top + '|' + r.width + '|' + ty;
  if (k === accLast) return; accLast = k;
  accEl.style.position = 'fixed'; accEl.style.zIndex = 40;
  accEl.style.left = r.left + 'px'; accEl.style.top = r.top + 'px'; accEl.style.width = r.width + 'px';
  accEl.style.translate = '0 ' + ty + 'px'; accOn = true;
}
if (accEl) gsap.ticker.add(accRider);
function sync(forzar) {
    if (!listo) return;
    const y = window.scrollY, quiere = desk() ? (dk ? y > 40 : y > 110) : (dk ? y > 330 : y > 400);
    if (quiere === dk && !forzar) return;
    const on = forzar ? y > (desk() ? 110 : 400) : quiere;
    limpiarVuelo(); if (typeof accRider === 'function') accRider();
    const anim = !reduce && !forzar && !saltando && !(desk() && nav.classList.contains('oculto')) && !(dock.classList.contains('baja'));
    const pares = parejas().map(([a, b]) => [$(a), $(b)]);
    const orig = pares.map(([A, B]) => { const o = on ? A : B, r = o.getBoundingClientRect(), cs = getComputedStyle(o); return { r, bg: cs.backgroundColor, col: cs.color, rad: cs.borderRadius, cn: A.cloneNode(true) }; });
    estado(on);
    if (!anim) return;
    pares.forEach(([A, B], i) => {
      const dest = on ? B : A, o = orig[i]; dest.classList.add('fly');
      const t = dest.getBoundingClientRect(), cs = getComputedStyle(dest), c = o.cn;
      c.classList.remove('mag', 'fly', 'on'); c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1;
      Object.assign(c.style, { position: 'fixed', margin: 0, left: o.r.left + 'px', top: o.r.top + 'px', width: o.r.width + 'px', height: o.r.height + 'px', zIndex: 90, pointerEvents: 'none', backgroundColor: o.bg, color: o.col, borderRadius: o.rad, transform: 'none', boxSizing: 'border-box', transition: 'none' });
      document.body.appendChild(c);
      const t1 = gsap.timeline({ onComplete: () => { c.remove(); dest.classList.remove('fly'); vol = vol.filter((f) => f.c !== c); } });
      t1.to(c, { left: t.left, top: t.top, width: t.width, height: t.height, backgroundColor: cs.backgroundColor, color: cs.color, borderRadius: cs.borderRadius, duration: .8, ease: 'power3.inOut' }, 0)
        .add(() => { dest.classList.remove('fly'); }, on ? .5 : .78);
      if (on) t1.to(c, { opacity: 0, duration: .3, ease: 'none' }, .5); else { gsap.set(c, { opacity: 0 }); t1.to(c, { opacity: 1, duration: .25, ease: 'none' }, 0); }
      vol.push({ t: t1, c, b: dest });
    });
  }
  addEventListener('resize', () => { limpiarVuelo(); sync(true); });

  /* ── tarjetas apiladas: cada sección queda fija abajo y la siguiente se solapa por encima ── */
  const apilar = ['#man', '#dia', '#carta', '#reservar'].map((s) => $(s));
  const fijar = () => apilar.forEach((el) => { el.style.top = Math.min(0, innerHeight - el.offsetHeight) + 'px'; });
  fijar(); addEventListener('resize', fijar); if (window.ResizeObserver) { const ro = new ResizeObserver(fijar); apilar.forEach((el) => ro.observe(el)); }

  /* ── manifiesto ── */
  const MAN = [['Mucha', 0], ['es', 0], ['herencia', 'em'], ['italiana:', 0], ['pan', 0], ['de', 0], ['masa', 0], ['madre', 0], ['al', 0], ['amanecer,', 0], ['pastas', 0], ['hechas', 0], ['a', 0], ['mano', 0], ['al', 0], ['mediodía,', 0], ['y', 0], ['cócteles', 0], ['cuando', 0], ['cae', 0], ['la', 0], ['noche.', 0]];
  $('#mt').innerHTML = MAN.map(([w, k]) => w[0] === '@' ? '<span class="pl"><video data-v="' + w.slice(1) + '" muted loop playsinline></video></span>' : '<span class="w">' + (k === 'em' ? '<em>' + w + '</em>' : esc(w)) + '</span>').join(' ');
  if (!reduce) gsap.to('#mt .w', { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: '#man', start: 'top 62%', end: 'bottom 70%', scrub: .5 } });
  else $$('#mt .w').forEach((w) => { w.style.opacity = 1; });

  /* ── todo el día: tarjetas que se apilan ── */
  const MOM = [
    { h: '07:30', t: 'Buen día', d: 'Café, medialunas y pan de masa madre. La panadería abre antes que nadie.', v: 'desayuno', bg: '#F1EBDF', c: '#2a1414', k: 'Desayun' },
    { h: '12:30', t: 'Mediodía', d: 'Pastas caseras, risottos y cocina italiana. La cocina está abierta todo el día.', v: 'almuerzo', bg: '#F4DCC0', c: '#3a1a14', k: 'Pastas' },
    { h: '17:00', t: 'La merienda', d: 'Pastelería artesanal, tortas y algo rico para acompañar el café.', v: 'merienda', bg: '#D98C6A', c: '#2a0f0c', k: 'Pasteler' },
    { h: '21:00', t: 'La cena', d: 'Entradas para compartir, principales y una carta de vinos para quedarse.', v: 'cena', bg: '#4a1620', c: '#F1EBDF', k: 'Principales' },
    { h: '23:30', t: 'Cócteles', d: 'Aperitivos, spritz y tragos de autor en la barra y en la vereda.', v: 'cocteles', bg: '#180d0c', c: '#F1EBDF', k: 'Cocteles' }
  ];
  $('#stack').innerHTML = MOM.map((m, i) => '<article class="mom" style="--i:' + i + ';--bg:' + m.bg + ';--c:' + m.c + '"><div class="mom-v"><img src="img/' + m.v + '.jpg" alt="" decoding="async" loading="lazy"></div><span class="mom-n">' + String(i + 1).padStart(2, '0') + ' / ' + String(MOM.length).padStart(2, '0') + '</span><div class="mom-t"><span class="hora">' + m.h + '</span><div class="hd" aria-hidden="true">' + m.h + '</div><div class="grp"><h3 class="serif">' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p><a class="btn btn-o" href="#carta" data-k="' + esc(m.k) + '">Ver en la carta</a></div></div></article>').join('');
  const cards = $$('.mom');
  if (!reduce) {
    cards.forEach((c, i) => {
      if (i < cards.length - 1) gsap.to(c, { scale: .94, '--dim': .62, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 88%', end: 'top 14%', scrub: true } });
      gsap.from($$('.grp > *, .hd, .mom-n', c), { y: 36, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 72%' } });
      gsap.fromTo($('img', c), { scale: 1.16 }, { scale: 1, ease: 'none', force3D: true, scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 20%', scrub: .7 } });
    });
  }

  /* ── títulos con máscara ── */
  $$('[data-split]').forEach((h) => { const w = splitW(h); if (reduce) return; gsap.from(w, { yPercent: 112, duration: 1.3, stagger: .07, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 86%' } }); });

  /* ── marquee ── */
  const MQ = ['Panadería', 'Pastelería artesanal', 'Pastas caseras', 'Focaccias', 'Cócteles', 'Cocina italiana'];
  const mqH = MQ.map((m) => '<span>' + esc(m) + '<b></b></span>').join('');
  $('#mq').innerHTML = '<div style="display:inline-flex">' + mqH + '</div><div style="display:inline-flex">' + mqH + '</div>';
  if (!reduce) { const t = gsap.to('#mq', { xPercent: -50, repeat: -1, duration: 40, ease: 'none' }); ScrollTrigger.create({ trigger: '.mq', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { gsap.to(t, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 240, 7) * s.direction, duration: .3, overwrite: true }); gsap.to(t, { timeScale: s.direction, duration: 1.4, delay: .3, overwrite: false }); } }); }

  /* ── carta escrita (del panel) ── */
  const fila = (p) => '<div class="it"><b>' + esc(p.nombre) + '</b><span>' + esc(X.precio(p)) + '</span>' + (p.descripcion ? '<p>' + esc(p.descripcion) + '</p>' : '') + '</div>';
  let cartaD = null, cat = null, pend = null, rf = 0;
  const refrescar = () => { clearTimeout(rf); rf = setTimeout(() => ScrollTrigger.refresh(), 120); };
  X.carta().then((d) => {
    cartaD = d; const L = $('#lista');
    if (!d.cats.length) { L.innerHTML = '<p class="vacio">La carta se está actualizando. Escribinos por WhatsApp.</p>'; return; }
    cat = d.cats[0].nombre;
    $('#cn').innerHTML = d.cats.map((c, i) => '<button type="button" data-c="' + esc(c.nombre) + '" aria-current="' + (i === 0) + '"><i>' + String(i + 1).padStart(2, '0') + '</i>' + esc(c.nombre) + '</button>').join('');
    if (pend) { elegir(pend); pend = null; } else pintar(false);
  });
  function marcarCat() { $$('#cn button').forEach((x) => x.setAttribute('aria-current', String(!$('#q').value && x.dataset.c === cat))); const a = $('#cn button[aria-current=true]'); if (a && !desk()) $('#cn').scrollTo({ left: a.offsetLeft - 22, behavior: 'smooth' }); }
  function pintar(anim) {
    const q = nz($('#q').value.trim()); let html = '';
    if (q) { cartaD.cats.forEach((c) => { const cm = nz(c.nombre).indexOf(q) >= 0, r = c.items.filter((p) => cm || nz(p.nombre + ' ' + (p.descripcion || '')).indexOf(q) >= 0); if (r.length) html += '<h3>' + esc(c.nombre) + '</h3><div class="grid">' + r.map(fila).join('') + '</div>'; }); if (!html) html = '<p class="vacio">No encontramos «' + esc($('#q').value.trim()) + '».</p>'; }
    else { const c = cartaD.cats.find((x) => x.nombre === cat); html = c ? '<h3>' + esc(cat) + '</h3><div class="grid">' + c.items.map(fila).join('') + '</div>' : ''; }
    $('#lista').innerHTML = html; $('#qx').hidden = !q; marcarCat();
    if (anim && !reduce) gsap.from('#lista h3, #lista .it', { y: 34, opacity: 0, duration: .8, stagger: .03, ease: 'power3.out', clearProps: 'all' });
    ajustar(); refrescar();
  }
  function ajustar() {
    const L = $('#lista'); L.style.removeProperty('--k'); const g = $('.grid', L);
    if (!desk() || $('#q').value.trim() || !g) { L.classList.remove('fit'); if (g) g.style.columnCount = ''; return; }
    L.classList.add('fit');
    const O = [[2, 1.1], [2, 1], [2, .92], [2, .84], [3, 1], [3, .92], [3, .84], [3, .76], [4, .9], [4, .8], [4, .72], [4, .64], [4, .56]];
    for (const [n, k] of O) { L.style.setProperty('--k', k); g.style.columnCount = n; if (g.scrollWidth <= g.clientWidth + 2) return; }
  }
  addEventListener('resize', () => { if (cartaD) ajustar(); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (cartaD) ajustar(); });
  function elegir(k) { const c = cartaD.cats.find((x) => nz(x.nombre).indexOf(nz(k)) >= 0); if (c) { cat = c.nombre; $('#q').value = ''; pintar(true); } }
  $('#cn').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $('#q').value = ''; pintar(true); });
  $('#q').addEventListener('input', () => pintar(false));
  $('#qx').addEventListener('click', () => { $('#q').value = ''; pintar(false); $('#q').focus(); });
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-k]'); if (!a) return; if (cartaD) elegir(a.dataset.k); else pend = a.dataset.k; });

  /* ── reserva ── */
  const AMBR = ['terraza', 'local', 'croissant', 'fachada'];
  AMBR.forEach((f, i) => { const e = document.createElement('i'); e.style.backgroundImage = 'url(' + X.M + f + '.jpg)'; $('#ambR').appendChild(e); });
  const ar = $$('#ambR i'); let ak = 0; ar[0].classList.add('on'); setInterval(() => { ar[ak].classList.remove('on'); ak = (ak + 1) % ar.length; ar[ak].classList.add('on'); }, 5200);
  if (desk()) X.rotar($('#resWin'), AMBR, 5200);
  Reserva.montar($('#raBox'), { onPaso: (n) => { paso = n; dockSync(); $('#reservar').classList.toggle('en-curso', n >= 2); rr.classList.toggle('ok', n === 3); if (panel()) { const b = $('.ra-body', rr); if (b) b.scrollTop = 0; return; } if (n === 1 && !lenis) return; const r = $('#raTop').getBoundingClientRect(); if (r.top < 70 || r.top > innerHeight * .5) ir('#raTop', { offset: desk() ? -(84 + 10) : -14, duration: 1.1 }); setTimeout(refrescar, 700); } });
  if (!reduce) {
    gsap.from('.res-p, .res-win', { y: 50, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#reservar', start: 'top 62%' } });
    if (!panel()) gsap.from('#raBox', { y: 80, opacity: 0, duration: 1.3, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: '#reservar', start: 'top 60%' } });
    gsap.fromTo('#resWin', { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '#reservar', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ── footer ── */
  const pm = $('#pieM img');
  if (!reduce) {
    gsap.from(pm, { yPercent: 115, duration: 1.5, stagger: .09, ease: 'power4.out', scrollTrigger: { trigger: '#llegar', start: 'top 78%' } });
    gsap.from('.pie-s, .pie-g > *, .pie-b', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.pie-g', start: 'top 92%' } });
  }

  /* ── cursor y botones magnéticos (solo mouse) ── */
  if (fine && !reduce) {
    document.documentElement.classList.add('hascur');
    const cur = $('#cur'), dot = $('b', cur), ring = $('i', cur);
    gsap.set([dot, ring], { x: -100, y: -100 }); const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    addEventListener('pointermove', (e) => { gsap.set(dot, { x: e.clientX, y: e.clientY }); rx(e.clientX); ry(e.clientY); });
    document.addEventListener('pointerover', (e) => { const on = !!e.target.closest('a,button,label,.win'); cur.classList.toggle('big', on); gsap.to(ring, { scale: on ? 1.9 : 1, duration: .45, ease: 'power3.out' }); });
    document.addEventListener('pointerleave', () => cur.classList.add('off')); document.addEventListener('pointerenter', () => cur.classList.remove('off'));
    $$('.mag').forEach((b) => { b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .32, duration: .5, ease: 'power3.out' }); }); b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.45)' })); });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})();
