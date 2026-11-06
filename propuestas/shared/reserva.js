/* Componente de reserva reutilizable (3 pasos). Se viste con variables CSS --rv-*. */
(function () {
  const X = window.Prop, esc = X.esc;
  function montar(root, op) {
    op = op || {};
    const S = { personas: 2, fecha: X.hoy(), hora: '', zona: '', seq: 0, paso: 1 };
    const DIAS = X.dias(7);
    root.classList.add('rv'); 
    root.innerHTML =
      '<div class="rv-p" data-p="1"><div class="rv-b"><span class="rv-k">Personas</span><div class="rv-step"><button type="button" data-m aria-label="Menos">−</button><b data-n>2</b><button type="button" data-M aria-label="Más">+</button></div></div>' +
      '<div class="rv-b"><span class="rv-k">Día</span><div class="rv-dias">' + DIAS.map((d) => '<button type="button" class="rv-dia" data-f="' + d.iso + '" aria-pressed="' + (d.iso === S.fecha) + '"><span>' + esc(d.dow) + '</span><b>' + d.num + '</b><span>' + esc(d.mes) + '</span></button>').join('') + '</div><label class="rv-otra">Otra fecha <input type="date" data-fecha min="' + X.hoy() + '" value="' + S.fecha + '"></label></div>' +
      '<div class="rv-b"><span class="rv-k">Horario</span><div class="rv-horas" data-horas></div></div></div>' +
      '<form class="rv-p" data-p="2" novalidate hidden><div class="rv-res" data-res></div>' +
      '<label class="rv-c"><span class="rv-k">Nombre</span><input data-nombre autocomplete="name" placeholder="Tu nombre"><em hidden></em></label>' +
      '<label class="rv-c"><span class="rv-k">Teléfono</span><input data-tel type="tel" inputmode="tel" autocomplete="tel" placeholder="342 …"><em hidden></em></label>' +
      '<label class="rv-c"><span class="rv-k">Alergias o restricciones <i>(opcional)</i></span><input data-alergia placeholder="Ej.: celíaca, sin lactosa"></label>' +
      '<label class="rv-c"><span class="rv-k">Algo más <i>(opcional)</i></span><input data-nota placeholder="Cumpleaños, sillita de bebé…"></label><p class="rv-err" data-eform hidden></p></form>' +
      '<div class="rv-p rv-ok" data-p="3" hidden><span class="rv-tilde"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><h3 class="serif">Mesa reservada</h3><p data-okdia></p><div class="rv-cristal" data-okd></div><a class="rv-btn" data-okwa href="#" rel="noopener">Avisar por WhatsApp</a><button type="button" class="rv-lnk" data-otra>Hacer otra reserva</button></div>' +
      '<div class="rv-nav" data-nav><button type="button" class="rv-atras" data-atras hidden aria-label="Volver">‹</button><button type="button" class="rv-btn" data-main disabled>Continuar</button></div>';
    const $ = (s) => root.querySelector(s), $$ = (s) => Array.from(root.querySelectorAll(s));
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const mostrar = (n, anim) => { S.paso = n; $$('.rv-p').forEach((p) => { p.hidden = +p.dataset.p !== n; }); $('[data-atras]').hidden = n !== 2; $('[data-nav]').hidden = n === 3; $('[data-main]').textContent = n === 1 ? 'Continuar' : 'Confirmar reserva'; $('[data-main]').disabled = n === 1 && !S.hora; if (n === 2) resumen(); if (window.gsap && !reduce && anim !== false) gsap.from($$('.rv-p:not([hidden]) > *'), { y: 18, opacity: 0, duration: .55, stagger: .06, ease: 'power3.out', clearProps: 'all' }); if (op.onPaso) op.onPaso(n); };
    const setFecha = (f) => { S.fecha = f; $('[data-fecha]').value = f; $$('.rv-dia').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f))); horas(); };
    async function horas() {
      const my = ++S.seq; S.hora = ''; $('[data-main]').disabled = S.paso === 1; const H = $('[data-horas]');
      H.innerHTML = '<span class="rv-esq"></span><span class="rv-esq"></span><span class="rv-esq"></span>';
      const r = await X.horas(S.fecha, S.personas); if (my !== S.seq) return;
      if (r.err) { H.innerHTML = '<p class="rv-vacio">' + esc(r.err) + '</p>'; return; }
      S.zona = r.zona;
      if (!r.grupos.length) { H.innerHTML = '<p class="rv-vacio">' + esc(r.msg || 'No hay lugar en el salón ese día.') + ' <a href="' + esc(X.wa('Hola! Quería reservar para ' + S.personas + ' el ' + S.fecha)) + '">Escribinos por WhatsApp</a></p>'; return; }
      H.innerHTML = r.grupos.map((g) => '<div class="rv-fr">' + (g.n ? '<span class="serif">' + esc(g.n) + '</span>' : '') + '<div>' + g.hs.map((h) => '<button type="button" class="rv-h" aria-pressed="false" data-h="' + esc(h) + '">' + esc(h) + '</button>').join('') + '</div></div>').join('');
      if (window.gsap && !reduce) gsap.from(H.querySelectorAll('.rv-h'), { y: 10, opacity: 0, duration: .45, stagger: .02, ease: 'power3.out', clearProps: 'all' });
    }
    root.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-m]')) { S.personas = Math.max(1, S.personas - 1); $('[data-n]').textContent = S.personas; horas(); }
      else if (t.closest('[data-M]')) { S.personas = Math.min(20, S.personas + 1); $('[data-n]').textContent = S.personas; horas(); }
      else if (t.closest('.rv-dia')) setFecha(t.closest('.rv-dia').dataset.f);
      else if (t.closest('[data-h]')) { const b = t.closest('[data-h]'); S.hora = b.dataset.h; $$('.rv-h').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $('[data-main]').disabled = false; if (op.onHora) op.onHora(S); }
      else if (t.closest('[data-atras]')) mostrar(1);
      else if (t.closest('[data-main]')) { if (S.paso === 1) mostrar(2); else enviar(); }
      else if (t.closest('[data-otra]')) { S.hora = ''; mostrar(1); horas(); }
    });
    $('[data-fecha]').addEventListener('change', (e) => e.target.value && setFecha(e.target.value));
    function resumen() { $('[data-res]').innerHTML = '<div><span>Día</span><b>' + esc(X.diaLargo(S.fecha)) + '</b></div><div><span>Hora</span><b>' + esc(S.hora) + '</b></div><div><span>Personas</span><b>' + S.personas + '</b></div>'; }
    const mal = (inp, m) => { const e = inp.parentNode.querySelector('em'); if (e) { e.textContent = m || ''; e.hidden = !m; } };
    async function enviar() {
      const eF = $('[data-eform]'); eF.hidden = true; mal($('[data-nombre]'), ''); mal($('[data-tel]'), ''); let m = false;
      if (!$('[data-nombre]').value.trim()) { mal($('[data-nombre]'), 'Escribí tu nombre.'); m = true; }
      if (!$('[data-tel]').value.trim()) { mal($('[data-tel]'), 'Dejanos un teléfono para confirmarte.'); m = true; }
      if (m) return;
      const b = $('[data-main]'); b.disabled = true; b.textContent = 'Reservando…';
      const d = await X.reservar({ nombre: $('[data-nombre]').value.trim(), telefono: $('[data-tel]').value.trim(), personas: S.personas, fecha: S.fecha, hora: S.hora, zona: S.zona, nota: $('[data-nota]').value.trim(), alergia: $('[data-alergia]').value.trim() });
      b.disabled = false; b.textContent = 'Confirmar reserva';
      if (!d || !d.ok) {
        if (d && d.campos) { if (d.campos.nombre) mal($('[data-nombre]'), d.campos.nombre); if (d.campos.telefono) mal($('[data-tel]'), d.campos.telefono); }
        if (!d || !d.campos || !Object.keys(d.campos).length) { eF.textContent = (d && d.mensaje) || 'No pudimos reservar. Probá de nuevo.'; eF.hidden = false; }
        return;
      }
      const dia = X.diaLargo(d.fecha || S.fecha);
      $('[data-okdia]').textContent = dia;
      $('[data-okd]').innerHTML = '<div><span>Horario</span><b>' + esc(d.hora) + '</b></div><div><span>Mesa</span><b>' + esc(d.personas) + (d.personas == 1 ? ' persona' : ' personas') + (d.zona ? ', ' + esc(d.zona.toLowerCase()) : '') + '</b></div>' + (d.numero ? '<div><span>Reserva</span><b>#' + esc(d.numero) + '</b></div>' : '') + '<div><span>Estado</span><b>' + (d.estado === 'confirmada' ? 'Confirmada' : 'Te confirmamos pronto') + '</b></div>';
      $('[data-okwa]').href = d.whatsappUrl || X.wa('Hola! Soy ' + $('[data-nombre]').value.trim() + '. Reservé para ' + d.personas + ' el ' + dia + ' a las ' + d.hora + '.');
      mostrar(3, false);
      if (window.gsap && !reduce) { gsap.fromTo(root.querySelector('.rv-tilde'), { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(2)' }); gsap.to(root.querySelector('.rv-tilde path'), { strokeDashoffset: 0, duration: .7, delay: .35, ease: 'power2.out' }); gsap.from(root.querySelectorAll('.rv-ok > *:not(.rv-tilde)'), { y: 16, opacity: 0, duration: .55, stagger: .07, delay: .2, ease: 'power3.out', clearProps: 'all' }); } else root.querySelector('.rv-tilde path').style.strokeDashoffset = 0;
      if (op.onOk) op.onOk(d);
    }
    horas(); mostrar(1, false);
    return { reset() { S.hora = ''; mostrar(1); horas(); } };
  }
  window.Reserva = { montar };
})();
