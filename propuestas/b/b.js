(function () {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const X = window.Prop, esc = X.esc, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const CH = [
    { v: 'fachada', k: 'Santa Fe · Bv. & Mitre', t: 'Mucha', sc: 1, d: 'Panadería, pastelería artesanal y cocina italiana. De la mañana a la noche.', n: 'Portada' },
    { v: 'croissant', k: '07:30', t: 'Buen día', d: 'Medialunas, croissants y café. La panadería arranca antes que nadie.', n: 'Buen día' },
    { v: 'pan', k: 'Panadería', t: 'Masa madre', d: 'Pan que se corta en la mesa, tostadas y bollería hecha todos los días.', n: 'Panadería' },
    { v: 'pasta', k: 'Mediodía', t: 'Cocina italiana', d: 'Pastas caseras, gratinados, risottos y platos para compartir.', n: 'Pastas' },
    { v: 'burrata', k: 'Antipasti', t: 'Para compartir', d: 'Burratas, croquetas, focaccias y empanadas para arrancar la mesa.', n: 'Antipasti' },
    { v: 'mesa', k: 'Cocina abierta', t: 'Todo el día', d: 'Desayuno, almuerzo, merienda y cena sin pausas.', n: 'Todo el día' },
    { v: 'aperitivo', k: '19:00', t: 'La hora del spritz', d: 'Aperitivos, vermuts y cócteles para que la tarde no termine.', n: 'Aperitivos' },
    { v: 'terraza', k: 'Noche', t: 'Vereda y terraza', d: 'Se llena de gente, música y copas. Por orden de llegada.', n: 'La noche' },
    { v: 'barra', k: 'Barra', t: 'Cócteles y vinos', d: 'Carta de cócteles, vinos por copa y botella, licores y whiskies.', n: 'Barra' },
    { v: 'local', k: 'Te esperamos', t: 'Reservá tu mesa', d: 'Reservas en el salón. Escribinos o reservá en un minuto.', n: 'Reservar', fin: 1 }
  ];
  const DUR = 6.2, N = CH.length;
  $('#fMapa').href = X.mapa(); $('#lWa').href = X.wa('Hola Mucha!');
  /* videos */
  const clips = $('#clips'), amb = $('#amb'), vs = [], av = [];
  CH.forEach((c, i) => {
    const mk = () => { const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = i < 2 ? 'auto' : 'none'; v.poster = X.M + c.v + '.jpg'; v.src = X.M + c.v + '.mp4'; return v; };
    const v = mk(); clips.appendChild(v); vs.push(v);
    const a = mk(); a.preload = 'none'; a.removeAttribute('poster'); amb.appendChild(a); av.push(a);
  });
  /* progreso + índice */
  const prog = $('#prog'); prog.innerHTML = CH.map(() => '<i></i>').join('');
  const segs = $$('i', prog);
  $('#idxL').innerHTML = CH.map((c, i) => '<li><button type="button" data-g="' + i + '">' + esc(c.n) + '</button></li>').join('');
  let cur = -1, tw = null, bloqueo = 0, abierto = null;
  const play = (v) => { v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  function ir(i, dir) {
    if (i < 0) i = 0; if (i >= N) { i = N - 1; }
    if (i === cur) return;
    const prev = cur, c = CH[i]; cur = i;
    if (tw) tw.kill();
    segs.forEach((s, j) => { s.style.setProperty('--s', j < i ? 1 : 0); });
    $$('#idxL li').forEach((li, j) => li.classList.toggle('on', j === i));
    /* video */
    const v = vs[i]; play(v); play(av[i]); if (vs[i + 1]) vs[i + 1].preload = 'auto'; if (av[i + 1]) av[i + 1].preload = 'metadata';
    vs.forEach((x, j) => { if (j !== i && j !== prev) { x.pause(); gsap.set(x, { opacity: 0 }); } });
    av.forEach((x, j) => { x.classList.toggle('on', j === i); if (j !== i) setTimeout(() => { if (!x.classList.contains('on')) x.pause(); }, 1300); });
    gsap.killTweensOf(v); gsap.set(v, { zIndex: 2 }); if (vs[prev]) gsap.set(vs[prev], { zIndex: 1 });
    gsap.fromTo(v, { opacity: 0, scale: 1.16 }, { opacity: 1, scale: 1, duration: reduce ? .01 : 1.1, ease: 'power2.out' });
    if (vs[prev]) gsap.to(vs[prev], { opacity: 0, duration: reduce ? .01 : .9, delay: .2, onComplete: () => { vs[prev].pause(); } });
    /* texto */
    $('#cabK').textContent = c.k;
    const T = $('#tT'); T.classList.toggle('sc', !!c.sc);
    $('#tK').textContent = c.k; T.innerHTML = c.t.split(' ').map((w) => '<span>' + esc(w) + '</span>').join(' '); $('#tD').textContent = c.d;
    $('#fin').classList.toggle('on', !!c.fin); $('#bar').style.opacity = c.fin ? 0 : 1; $('#bar').style.pointerEvents = c.fin ? 'none' : 'auto';
    if (!reduce) {
      gsap.fromTo('#tK', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, delay: .15, ease: 'power3.out' });
      gsap.fromTo('#tT span', { yPercent: 60, opacity: 0, rotate: 2 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 1, stagger: .08, delay: .2, ease: 'power4.out' });
      gsap.fromTo('#tD', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, delay: .55, ease: 'power3.out' });
      if (c.fin) gsap.fromTo('#fin > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, stagger: .08, delay: .7, ease: 'power3.out' });
    }
    /* temporizador */
    if (!c.fin) { const s = segs[i]; const o = { p: 0 }; tw = gsap.to(o, { p: 1, duration: DUR, ease: 'none', onUpdate: () => s.style.setProperty('--s', o.p), onComplete: () => ir(cur + 1) }); }
    else segs[i].style.setProperty('--s', 1);
    if (abierto) tw && tw.pause();
  }
  const sig = () => ir(cur + 1), ant = () => { if (tw && tw.progress() > .15) { const i = cur; cur = -1; ir(i); } else ir(cur - 1); };
  /* toques: tap = avanzar/retroceder, mantener = pausa */
  const stage = $('#stage'); let down = 0, hold = false, hT, sx = 0, sy = 0;
  $('#taps').addEventListener('pointerdown', (e) => { down = Date.now(); hold = false; sx = e.clientX; sy = e.clientY; hT = setTimeout(() => { hold = true; if (tw) tw.pause(); stage.classList.add('hold'); }, 220); });
  const fin = (e) => { clearTimeout(hT); stage.classList.remove('hold'); if (hold) { hold = false; if (tw && !abierto) tw.resume(); return; } if (!down) return; down = 0; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? sig() : ant(); return; } if (dy < -70 && Math.abs(dy) > Math.abs(dx)) { abrir('carta'); return; } const r = stage.getBoundingClientRect(); (e.clientX - r.left) < r.width * .34 ? ant() : sig(); };
  $('#taps').addEventListener('pointerup', fin); $('#taps').addEventListener('pointercancel', () => { clearTimeout(hT); if (hold && tw && !abierto) tw.resume(); hold = false; down = 0; });
  prog.addEventListener('click', (e) => { const i = segs.indexOf(e.target.closest('i')); if (i >= 0) { cur = -1; ir(i); } });
  $('#idxL').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) { cur = -1; ir(+b.dataset.g); } });
  $('#replay').onclick = () => { cur = -1; ir(0); };
  let pz = false; $('#pausa').onclick = () => { pz = !pz; if (tw) pz ? tw.pause() : tw.resume(); $('#pausa').innerHTML = pz ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'; };
  addEventListener('keydown', (e) => { if (abierto) { if (e.key === 'Escape') cerrar(); return; } if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); sig(); } if (e.key === 'ArrowLeft') ant(); });
  let wl = 0; stage.addEventListener('wheel', (e) => { if (abierto) return; const t = Date.now(); if (t - wl < 750 || Math.abs(e.deltaY) < 12) return; wl = t; e.deltaY > 0 ? sig() : ant(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!tw) return; if (document.hidden) tw.pause(); else if (!abierto && !pz) tw.resume(); });

  /* hojas */
  const sheets = { carta: $('#shCarta'), res: $('#shRes') };
  function abrir(n) { if (abierto === n) return; if (abierto) cerrar(true); abierto = n; const s = sheets[n]; s.setAttribute('aria-hidden', 'false'); if (tw) tw.pause(); if (n === 'carta') cargarCarta(); if (n === 'res') montarRes(); gsap.to(s, { y: 0, yPercent: 0, duration: reduce ? .01 : .65, ease: 'power4.out', startAt: { yPercent: 105 } }); gsap.to('#txt,#bar', { opacity: 0, duration: .3 }); }
  function cerrar(rapido) { const n = abierto; if (!n) return; const s = sheets[n]; abierto = null; s.setAttribute('aria-hidden', 'true'); gsap.to(s, { yPercent: 105, y: 0, duration: rapido ? .01 : .45, ease: 'power3.in' }); gsap.to('#txt', { opacity: 1, duration: .4 }); gsap.to('#bar', { opacity: CH[cur].fin ? 0 : 1, duration: .4 }); if (!rapido && tw && !pz) tw.resume(); }
  document.addEventListener('click', (e) => { const o = e.target.closest('[data-open]'); if (o) { abrir(o.dataset.open); return; } if (e.target.closest('[data-cerrar]')) cerrar(); });
  /* arrastrar para cerrar */
  $$('[data-asa]').forEach((a) => { let y0 = 0, dy = 0, s = a.parentNode; a.addEventListener('pointerdown', (e) => { y0 = e.clientY; dy = 0; a.setPointerCapture(e.pointerId); }); a.addEventListener('pointermove', (e) => { if (!a.hasPointerCapture(e.pointerId)) return; dy = Math.max(0, e.clientY - y0); gsap.set(s, { y: dy }); }); a.addEventListener('pointerup', (e) => { if (dy > 120) cerrar(); else gsap.to(s, { y: 0, duration: .4, ease: 'power3.out' }); dy = 0; }); });
  gsap.set(Object.values(sheets), { yPercent: 105 });

  /* carta escrita */
  let cartaD = null, cat = null;
  async function cargarCarta() {
    if (cartaD) return; $('#lista').innerHTML = '<p class="vacio">Cargando la carta…</p>'; cartaD = await X.carta();
    if (!cartaD.cats.length) { $('#lista').innerHTML = '<p class="vacio">La carta se está actualizando. Escribinos por WhatsApp.</p>'; return; }
    cat = cartaD.cats[0].nombre;
    $('#chips').innerHTML = cartaD.cats.map((c) => '<button class="chip" type="button" data-c="' + esc(c.nombre) + '" aria-pressed="' + (c.nombre === cat) + '">' + esc(c.nombre) + '</button>').join(''); pintar(true);
  }
  const fila = (p) => '<div class="it"><b>' + esc(p.nombre) + '</b><span>' + esc(X.precio(p)) + '</span>' + (p.descripcion ? '<p>' + esc(p.descripcion) + '</p>' : '') + '</div>';
  function pintar(a) {
    const q = $('#q').value.trim().toLowerCase(); let h = '';
    if (q) { cartaD.cats.forEach((c) => { const r = c.items.filter((p) => (p.nombre + ' ' + (p.descripcion || '')).toLowerCase().indexOf(q) >= 0); if (r.length) h += '<h4>' + esc(c.nombre) + '</h4>' + r.map(fila).join(''); }); if (!h) h = '<p class="vacio">No encontramos «' + esc(q) + '».</p>'; }
    else { const c = cartaD.cats.find((x) => x.nombre === cat); h = c ? c.items.map(fila).join('') : ''; }
    $('#lista').innerHTML = '<div class="lista">' + h + '</div>'; $('#lista').scrollTop = 0;
    if (a && !reduce) gsap.from('#lista .it', { y: 22, opacity: 0, duration: .55, stagger: .03, ease: 'power3.out', clearProps: 'all' });
  }
  $('#chips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.c; $('#q').value = ''; $$('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); pintar(true); });
  $('#q').addEventListener('input', () => { $$('.chip').forEach((x) => x.setAttribute('aria-pressed', String(!$('#q').value && x.dataset.c === cat))); pintar(false); });
  /* reserva */
  let rm = null;
  function montarRes() { if (rm) return; rm = Reserva.montar($('#resBox'), { onHora: (S) => { const t = $('#toast'); t.textContent = '✓  Mesa para ' + S.personas + ' · ' + S.hora; gsap.fromTo(t, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out' }); gsap.to(t, { opacity: 0, duration: .35, delay: 1.7 }); } }); }
  ir(0);
})();
