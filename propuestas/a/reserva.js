/* Reserva de la propuesta A: un solo componente, dos composiciones (tira de días en móvil, calendario del mes en escritorio). */
(function () {
  const X = window.Prop, esc = X.esc;
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const isoD = (y, m, d) => y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  const corto = (f) => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
  function montar(root, op) {
    op = op || {};
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const hoyIso = X.hoy(), MAXD = 90;
    const S = { personas: 2, fecha: hoyIso, hora: '', zona: '', seq: 0, paso: 1, vy: +hoyIso.slice(0, 4), vm: +hoyIso.slice(5, 7) - 1 };
    const DIAS = X.dias(14);
    const tope = new Date(); tope.setDate(tope.getDate() + MAXD); const topeIso = isoD(tope.getFullYear(), tope.getMonth(), tope.getDate());
    root.classList.add('ra');
    root.innerHTML =
      '<div class="ra-top"><div class="ra-steps" data-steps><i data-s="1"><b>1</b><span>Tu mesa</span></i><u></u><i data-s="2"><b>2</b><span>Tus datos</span></i><u></u><i data-s="3"><b>3</b><span>Listo</span></i></div></div>' +
      '<div class="ra-body">' +
      '<div class="ra-p" data-p="1"><div class="ra-col" style="display:grid;gap:22px;align-content:start">' +
      '<div class="ra-b"><span class="ra-k">Personas</span><div class="ra-step"><button type="button" data-menos aria-label="Menos">−</button><b data-n>2</b><button type="button" data-mas aria-label="Más">+</button></div></div>' +
      '<div class="ra-b"><span class="ra-k">Día</span>' +
      '<div class="ra-strip" data-strip>' + DIAS.map((d) => '<button type="button" class="ra-dia" data-f="' + d.iso + '" aria-pressed="' + (d.iso === S.fecha) + '"><span>' + esc(d.dow) + '</span><b>' + d.num + '</b><span>' + esc(d.mes) + '</span></button>').join('') + '</div>' +
      '<label class="ra-otra">Otra fecha <input type="date" data-fecha min="' + hoyIso + '" max="' + topeIso + '" value="' + S.fecha + '"></label>' +
      '<div class="ra-cal" data-cal></div></div></div>' +
      '<div class="ra-b"><span class="ra-k">Horario</span><div class="ra-horas" data-horas></div><p class="ra-note"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>Las reservas son para el salón. Vereda y terraza van por orden de llegada.</p></div></div>' +
      '<form class="ra-p" data-p="2" novalidate hidden><div class="ra-res" data-res></div><div class="ra-form">' +
      '<label class="ra-c"><span class="ra-k">Nombre</span><input data-nombre autocomplete="name" placeholder="Tu nombre"><em hidden></em></label>' +
      '<label class="ra-c"><span class="ra-k">Teléfono</span><input data-tel type="tel" inputmode="tel" autocomplete="tel" placeholder="342 …"><em hidden></em></label>' +
      '<label class="ra-c"><span class="ra-k">Alergias o restricciones <i>(opcional)</i></span><input data-alergia placeholder="Ej.: celíaca, sin lactosa"></label>' +
      '<label class="ra-c"><span class="ra-k">Algo más <i>(opcional)</i></span><input data-nota placeholder="Cumpleaños, sillita de bebé…"></label><p class="ra-err" data-eform hidden></p></div></form>' +
      '<div class="ra-p ra-ok" data-p="3" hidden><div class="ok-l"><span class="ra-tilde"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><h3 class="serif">Mesa reservada</h3><p class="dia-ok" data-okdia></p></div><div class="ok-r"><div class="ra-cristal" data-okd></div><div class="ra-acc"><a class="btn btn-c" data-okwa href="#" rel="noopener">Avisar por WhatsApp</a><a class="btn ra-btn-o" data-okmapa href="#" rel="noopener">Cómo llegar</a><button type="button" class="ra-lnk" data-otra>Hacer otra reserva</button></div></div></div>' +
      '</div>' +
      '<div class="ra-nav" data-nav><p class="ra-live" data-live></p><button type="button" class="ra-atras" data-atras hidden aria-label="Volver">‹</button><button type="button" class="btn ra-main" data-main disabled>Continuar</button></div>';
    const $ = (s) => root.querySelector(s), $$ = (s) => Array.from(root.querySelectorAll(s));
    $('[data-okmapa]').href = X.mapa();
    const live = () => { const L = $('[data-live]'); L.innerHTML = S.hora ? 'Mesa para <b>' + S.personas + '</b> · ' + esc(corto(S.fecha)) + ' · <b>' + esc(S.hora) + '</b>' : 'Elegí el día y el horario'; };
    const pasos = () => $$('[data-steps] i').forEach((i) => { const n = +i.dataset.s; i.classList.toggle('on', n === S.paso); i.classList.toggle('hecho', n < S.paso); });
    const mostrar = (n, anim) => {
      S.paso = n; $$('.ra-p').forEach((p) => { p.hidden = +p.dataset.p !== n; });
      $('[data-atras]').hidden = n !== 2; $('[data-nav]').hidden = n === 3;
      $('[data-main]').textContent = n === 1 ? 'Continuar' : 'Confirmar reserva'; $('[data-main]').disabled = n === 1 && !S.hora;
      if (n === 2) resumen(); pasos(); live();
      if (window.gsap && !reduce && anim !== false) gsap.from($$('.ra-p:not([hidden]) > *'), { y: 22, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', clearProps: 'all' });
      if (op.onPaso) op.onPaso(n);
    };
    /* calendario del mes */
    function cal() {
      const C = $('[data-cal]'), primero = new Date(S.vy, S.vm, 1), dias = new Date(S.vy, S.vm + 1, 0).getDate(), off = (primero.getDay() + 6) % 7;
      const mesHoy = +hoyIso.slice(5, 7) - 1, anioHoy = +hoyIso.slice(0, 4);
      const antes = S.vy === anioHoy && S.vm === mesHoy, ultimo = topeIso.slice(0, 7) === S.vy + '-' + String(S.vm + 1).padStart(2, '0');
      let h = '<div class="ra-cal-h"><b>' + MESES[S.vm] + ' ' + S.vy + '</b><div><button type="button" data-prev aria-label="Mes anterior"' + (antes ? ' disabled' : '') + '>‹</button><button type="button" data-next aria-label="Mes siguiente"' + (ultimo ? ' disabled' : '') + '>›</button></div></div><div class="ra-cal-g">';
      DW.forEach((d) => { h += '<span class="dw">' + d + '</span>'; });
      for (let i = 0; i < off; i++) h += '<span></span>';
      for (let d = 1; d <= dias; d++) { const f = isoD(S.vy, S.vm, d), no = f < hoyIso || f > topeIso; h += '<button type="button" class="ra-d' + (f === hoyIso ? ' hoy' : '') + '" data-f="' + f + '" aria-pressed="' + (f === S.fecha) + '"' + (no ? ' disabled' : '') + '>' + d + '</button>'; }
      C.innerHTML = h + '</div>';
    }
    const setFecha = (f) => { S.fecha = f; S.vy = +f.slice(0, 4); S.vm = +f.slice(5, 7) - 1; $('[data-fecha]').value = f; $$('.ra-dia').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f))); cal(); horas(); };
    async function horas() {
      const my = ++S.seq; S.hora = ''; $('[data-main]').disabled = S.paso === 1; live(); const H = $('[data-horas]');
      H.innerHTML = '<span class="ra-esq"></span><span class="ra-esq"></span><span class="ra-esq"></span>';
      const r = await X.horas(S.fecha, S.personas); if (my !== S.seq) return;
      if (r.err) { H.innerHTML = '<p class="ra-vacio">' + esc(r.err) + '</p>'; return; }
      S.zona = r.zona;
      if (!r.grupos.length) { H.innerHTML = '<p class="ra-vacio">' + esc(r.msg || 'No hay lugar en el salón ese día.') + ' <a href="' + esc(X.wa('Hola! Quería reservar para ' + S.personas + ' el ' + S.fecha)) + '">Escribinos por WhatsApp</a></p>'; return; }
      H.innerHTML = r.grupos.map((g) => '<div class="ra-fr">' + (g.n ? '<span class="serif">' + esc(g.n) + '</span>' : '') + '<div>' + g.hs.map((h) => '<button type="button" class="ra-h" aria-pressed="false" data-h="' + esc(h) + '">' + esc(h) + '</button>').join('') + '</div></div>').join('');
      if (window.gsap && !reduce) gsap.from(H.querySelectorAll('.ra-h'), { y: 12, opacity: 0, duration: .5, stagger: .025, ease: 'power3.out', clearProps: 'all' });
    }
    root.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-menos]')) { S.personas = Math.max(1, S.personas - 1); $('[data-n]').textContent = S.personas; horas(); }
      else if (t.closest('[data-mas]')) { S.personas = Math.min(20, S.personas + 1); $('[data-n]').textContent = S.personas; horas(); }
      else if (t.closest('[data-prev]')) { S.vm--; if (S.vm < 0) { S.vm = 11; S.vy--; } cal(); }
      else if (t.closest('[data-next]')) { S.vm++; if (S.vm > 11) { S.vm = 0; S.vy++; } cal(); }
      else if (t.closest('.ra-dia,.ra-d')) { const b = t.closest('.ra-dia,.ra-d'); if (!b.disabled) setFecha(b.dataset.f); }
      else if (t.closest('[data-h]')) { const b = t.closest('[data-h]'); S.hora = b.dataset.h; $$('.ra-h').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $('[data-main]').disabled = false; live(); if (op.onHora) op.onHora(S); }
      else if (t.closest('[data-atras]')) mostrar(1);
      else if (t.closest('[data-main]')) { if (S.paso === 1) mostrar(2); else enviar(); }
      else if (t.closest('[data-otra]')) { S.hora = ''; mostrar(1); horas(); }
    });
    $('[data-fecha]').addEventListener('change', (e) => e.target.value && e.target.value >= hoyIso && setFecha(e.target.value));
    function resumen() { $('[data-res]').innerHTML = '<span class="ra-k">Tu reserva</span><b class="big serif">' + esc(X.diaLargo(S.fecha)) + '</b><div><span>Hora</span><b>' + esc(S.hora) + '</b></div><div><span>Personas</span><b>' + S.personas + '</b></div><div><span>Lugar</span><b>Salón</b></div>'; }
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
      const tp = root.querySelector('.ra-tilde path');
      if (window.gsap && !reduce) { gsap.fromTo(root.querySelector('.ra-tilde'), { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: 'back.out(2)' }); gsap.to(tp, { strokeDashoffset: 0, duration: .8, delay: .35, ease: 'power2.out' }); gsap.from(root.querySelectorAll('.ra-ok h3,.ra-ok .dia-ok,.ra-cristal,.ra-acc'), { y: 22, opacity: 0, duration: .7, stagger: .09, delay: .25, ease: 'power3.out', clearProps: 'all' }); } else tp.style.strokeDashoffset = 0;
      if (op.onOk) op.onOk(d);
    }
    cal(); horas(); mostrar(1, false);
    return { reset() { S.hora = ''; mostrar(1); horas(); } };
  }
  window.Reserva = { montar };
})();
