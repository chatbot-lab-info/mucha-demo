(function () {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const X = window.Prop, esc = X.esc;
  const S = { personas: 2, fecha: X.hoy(), hora: '', zona: '', cat: null, hist: ['home'], seq: 0, cartaD: null };
  X.rotar($('#bg'), ['fachada', 'terraza', 'local', 'spritz'], 7000);
  X.rotar($('#hero'), ['croissant', 'pasta', 'aperitivo', 'fachada'], 5200);
  X.rotar($('#okbg'), ['terraza'], 9999);
  $('#lnkMapa').href = $('#okMapa').href = X.mapa();
  (function estado() { const h = new Date().getHours() + new Date().getMinutes() / 60, ab = h >= 7.5 || h < 1.5; $('#estado').textContent = ab ? 'Abierto ahora' : 'Abre a las 7:30'; })();

  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let z = 5;
  function go(n, back) {
    const to = $('#s-' + n), from = $('.scr.on');
    if (!to || from === to) return;
    to.style.zIndex = ++z; to.classList.add('on');
    if (reduce || !window.gsap) { from.classList.remove('on'); return; }
    gsap.fromTo(to, { xPercent: back ? -12 : 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .55, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.to(from, { xPercent: back ? 12 : -12, opacity: 0, duration: .4, ease: 'power2.in', onComplete: () => { from.classList.remove('on'); gsap.set(from, { clearProps: 'all' }); } });
    const items = $$('.cuerpo > *, .pie > *', to); if (items.length) gsap.from(items, { y: 18, opacity: 0, duration: .6, stagger: .06, delay: .12, ease: 'power3.out', clearProps: 'all' });
  }
  const push = (n) => { S.hist.push(n); go(n, false); };
  const back = () => { if (S.hist.length < 2) return; S.hist.pop(); go(S.hist[S.hist.length - 1], true); };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-back]'); if (b) { back(); return; }
    const g = e.target.closest('[data-go]'); if (!g) return;
    const n = g.dataset.go;
    if (n === 'carta') prepararCarta();
    if (n === 'mesa') { horas(); }
    push(n);
  });

  /* ---------- mesa ---------- */
  const DIAS = X.dias(7);
  $('#dias').innerHTML = DIAS.map((d) => '<button class="dia" type="button" data-f="' + d.iso + '" aria-pressed="' + (d.iso === S.fecha) + '"><span>' + esc(d.dow) + '</span><b>' + d.num + '</b><span>' + esc(d.mes) + '</span></button>').join('');
  const fecha = $('#fecha'); fecha.min = X.hoy(); fecha.value = S.fecha;
  const setFecha = (f) => { S.fecha = f; fecha.value = f; $$('.dia').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f))); horas(); };
  $('#dias').addEventListener('click', (e) => { const b = e.target.closest('.dia'); if (b) setFecha(b.dataset.f); });
  fecha.addEventListener('change', () => fecha.value && setFecha(fecha.value));
  $('#menos').onclick = () => { S.personas = Math.max(1, S.personas - 1); $('#pers').textContent = S.personas; horas(); };
  $('#mas').onclick = () => { S.personas = Math.min(20, S.personas + 1); $('#pers').textContent = S.personas; horas(); };
  const sk = '<span class="esq"></span><span class="esq"></span><span class="esq"></span>';
  async function horas() {
    const my = ++S.seq; S.hora = ''; $('#aDatos').disabled = true; $('#horas').innerHTML = sk;
    const r = await X.horas(S.fecha, S.personas); if (my !== S.seq) return;
    if (r.err) { $('#horas').innerHTML = '<p class="vacio">' + esc(r.err) + '</p>'; return; }
    S.zona = r.zona;
    if (!r.grupos.length) { $('#horas').innerHTML = '<p class="vacio">' + esc(r.msg || 'No hay lugar en el salón ese día.') + ' <a href="' + esc(X.wa('Hola! Quería reservar para ' + S.personas + ' el ' + S.fecha)) + '" style="color:var(--rosa)">Escribinos por WhatsApp</a></p>'; return; }
    $('#horas').innerHTML = r.grupos.map((g) => '<div class="fr">' + (g.n ? '<span>' + esc(g.n) + '</span>' : '') + '<div>' + g.hs.map((h) => '<button class="h" type="button" aria-pressed="false" data-h="' + esc(h) + '">' + esc(h) + '</button>').join('') + '</div></div>').join('');
    if (window.gsap && !reduce) gsap.from('#horas .h', { y: 10, opacity: 0, duration: .45, stagger: .02, ease: 'power3.out', clearProps: 'all' });
  }
  $('#horas').addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (!b) return; S.hora = b.dataset.h; $$('#horas .h').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $('#aDatos').disabled = false; toast('Mesa para ' + S.personas + ' · ' + S.hora, true); });
  $('#aDatos').onclick = () => { prepararDatos(); push('datos'); };

  /* ---------- carta escrita ---------- */
  let toastT;
  function toast(t, ok) { const el = $('#toast'); el.innerHTML = (ok ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E9A9B0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : '') + esc(t); if (window.gsap && !reduce) { gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, xPercent: -50, duration: .4, ease: 'power3.out' }); gsap.to(el, { opacity: 0, y: 10, duration: .35, delay: 1.8 }); } else { el.style.opacity = 1; clearTimeout(toastT); toastT = setTimeout(() => { el.style.opacity = 0; }, 1900); } }
  async function prepararCarta() {
    if (!S.cartaD) { $('#lista').innerHTML = '<p class="vacio">Cargando la carta…</p>'; S.cartaD = await X.carta(); }
    const cats = S.cartaD.cats; if (!cats.length) { $('#lista').innerHTML = '<p class="vacio">La carta se está actualizando. Escribinos por WhatsApp.</p>'; return; }
    if (!S.cat || !cats.find((c) => c.nombre === S.cat)) S.cat = cats[0].nombre;
    $('#chips').innerHTML = cats.map((c) => '<button class="chip" type="button" data-c="' + esc(c.nombre) + '" aria-pressed="' + (c.nombre === S.cat) + '">' + esc(c.nombre) + '</button>').join('');
    pintar(true);
  }
  function pintar(anim) {
    const q = $('#q').value.trim().toLowerCase(); let html = '';
    if (q) { S.cartaD.cats.forEach((c) => { const r = c.items.filter((p) => (p.nombre + ' ' + (p.descripcion || '')).toLowerCase().indexOf(q) >= 0); if (r.length) html += '<h3>' + esc(c.nombre) + '</h3>' + r.map(fila).join(''); }); if (!html) html = '<p class="vacio">No encontramos «' + esc(q) + '».</p>'; }
    else { const c = S.cartaD.cats.find((x) => x.nombre === S.cat); html = c ? c.items.map(fila).join('') : ''; }
    $('#lista').innerHTML = html; $('#cartaW').scrollTop = 0;
    if (anim && window.gsap && !reduce) gsap.from('#lista > *', { y: 22, opacity: 0, duration: .55, stagger: .03, ease: 'power3.out', clearProps: 'all' });
  }
  const fila = (p) => '<div class="it"><b>' + esc(p.nombre) + '</b><span>' + esc(X.precio(p)) + '</span>' + (p.descripcion ? '<p>' + esc(p.descripcion) + '</p>' : '') + '</div>';
  $('#chips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; S.cat = b.dataset.c; $('#q').value = ''; $$('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); pintar(true); });
  $('#lupa').onclick = () => { const bs = $('#busca'); bs.hidden = !bs.hidden; if (!bs.hidden) $('#q').focus(); else { $('#q').value = ''; pintar(false); } };
  $('#q').addEventListener('input', () => { $$('.chip').forEach((x) => x.setAttribute('aria-pressed', String(!$('#q').value && x.dataset.c === S.cat))); pintar(false); });

  /* ---------- datos ---------- */
  function prepararDatos() {
    $('#resumen').innerHTML = '<div><span>Día</span><b>' + esc(X.diaLargo(S.fecha)) + '</b></div><div><span>Hora</span><b>' + esc(S.hora) + '</b></div><div><span>Personas</span><b>' + S.personas + '</b></div>';
  }
  const mal = (inp, m) => { const e = inp.parentNode.querySelector('em'); inp.parentNode.classList.toggle('mal', !!m); if (e) { e.textContent = m || ''; e.hidden = !m; } };
  $('#enviar').onclick = async () => {
    const eF = $('#eForm'); eF.hidden = true; mal($('#nombre'), ''); mal($('#tel'), ''); let m = false;
    if (!$('#nombre').value.trim()) { mal($('#nombre'), 'Escribí tu nombre.'); m = true; }
    if (!$('#tel').value.trim()) { mal($('#tel'), 'Dejanos un teléfono para confirmarte.'); m = true; }
    if (m) return;
    const b = $('#enviar'); b.disabled = true; b.textContent = 'Reservando…';
    const nota = $('#nota').value.trim();
    const d = await X.reservar({ nombre: $('#nombre').value.trim(), telefono: $('#tel').value.trim(), personas: S.personas, fecha: S.fecha, hora: S.hora, zona: S.zona, nota, alergia: $('#alergia').value.trim() });
    b.disabled = false; b.textContent = 'Confirmar reserva';
    if (!d || !d.ok) {
      if (d && d.campos) { if (d.campos.nombre) mal($('#nombre'), d.campos.nombre); if (d.campos.telefono) mal($('#tel'), d.campos.telefono); }
      if (!d || !d.campos || !Object.keys(d.campos).length) { eF.textContent = (d && d.mensaje) || 'No pudimos reservar. Probá de nuevo.'; eF.hidden = false; }
      return;
    }
    const dia = X.diaLargo(d.fecha || S.fecha);
    $('#okDia').textContent = dia;
    $('#okDatos').innerHTML = '<div><span>Horario</span><b>' + esc(d.hora) + '</b></div><div><span>Mesa</span><b>' + esc(d.personas) + (d.personas == 1 ? ' persona' : ' personas') + (d.zona ? ', ' + esc(d.zona.toLowerCase()) : '') + '</b></div>' + (d.numero ? '<div><span>Reserva</span><b>#' + esc(d.numero) + '</b></div>' : '') + '<div><span>Estado</span><b>' + (d.estado === 'confirmada' ? 'Confirmada' : 'Te confirmamos pronto') + '</b></div>';
    $('#okWa').href = d.whatsappUrl || X.wa('Hola! Soy ' + $('#nombre').value.trim() + '. Reservé para ' + d.personas + ' el ' + dia + ' a las ' + d.hora + '.');
    S.hist = ['home', 'ok']; go('ok');
    if (window.gsap && !reduce) { gsap.fromTo('.tilde', { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(2)', delay: .25 }); gsap.to('.tilde path', { strokeDashoffset: 0, duration: .7, delay: .6, ease: 'power2.out' }); } else $('.tilde path').style.strokeDashoffset = 0;
  };
  $('#otra').onclick = () => { S.hora = ''; S.hist = ['home']; go('home', true); };
})();
