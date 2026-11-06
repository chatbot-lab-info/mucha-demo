/* Propuestas Mucha · utilidades comunes (carta real del panel, horarios, reserva, videos). */
(function () {
  const P = window.Panel, N = window.NEGOCIO || {};
  const M = '../media/', I = '../img/';
  const IMG = {
    'Desayunos y meriendas': [I + 'desayuno.jpg', I + 'merienda.jpg', M + 'croissant.jpg'], 'Desayuno y merienda': [I + 'desayuno.jpg', I + 'merienda.jpg'], 'Panadería y bollería': [M + 'croissant.jpg', I + 'merienda.jpg', M + 'pan.jpg'], 'Pastelería': [I + 'merienda.jpg', M + 'croissant.jpg'], 'Cafetería': [I + 'desayuno.jpg', M + 'croissant.jpg'],
    'Antipasti': [M + 'burrata.jpg', M + 'mesa.jpg', M + 'plato.jpg'], 'Focaccias': [M + 'mesa.jpg', M + 'burrata.jpg'], 'Ensaladas': [M + 'mesa.jpg', M + 'burrata.jpg'], 'Pastas': [I + 'almuerzo.jpg', M + 'pasta.jpg'], 'Pastas fatto a mano': [I + 'almuerzo.jpg', M + 'pasta.jpg'], 'Principales': [M + 'plato.jpg', M + 'mesa.jpg', I + 'almuerzo.jpg'], 'Dolci': [I + 'merienda.jpg', M + 'croissant.jpg'],
    'Infantil y sin TACC': [M + 'pasta.jpg', I + 'almuerzo.jpg'], 'Aperitivos y spritz': [M + 'aperitivo.jpg', I + 'cocteles.jpg', M + 'spritz.jpg'], 'Cócteles': [I + 'cocteles.jpg', M + 'aperitivo.jpg', M + 'spritz.jpg'], 'Cocteles': [I + 'cocteles.jpg', M + 'aperitivo.jpg'], 'Vinos': [M + 'vino.jpg', I + 'cena.jpg'], 'Licores y whiskies': [I + 'cena.jpg', M + 'vino.jpg'], 'Bebidas': [M + 'spritz.jpg', I + 'cocteles.jpg', I + 'cena.jpg']
  };
  const POS = ['center', '30% 35%', '70% 65%', '50% 20%', '20% 70%', '80% 30%'];
  /* foto de un plato: la del panel (imagenUrl) si existe; si no, una del local según la categoría, con encuadres distintos */
  const imgDe = (cat, i, p) => { if (p && p.imagenUrl) return { src: p.imagenUrl, pos: 'center' }; const l = IMG[cat] || [I + 'cena.jpg']; return { src: l[(i || 0) % l.length], pos: POS[(i || 0) % POS.length] }; };
  async function carta() {
    const d = await P.carta();
    const cats = Array.from(P.porCategoria((d && d.productos) || []).entries()).map(([nombre, items]) => ({ nombre, items }));
    return { cats, ok: !!(d && d.ok) };
  }
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const hoy = () => iso(new Date());
  const dias = (n) => { const o = []; const b = new Date(); for (let i = 0; i < n; i++) { const d = new Date(b); d.setDate(b.getDate() + i); o.push({ iso: iso(d), dow: i === 0 ? 'Hoy' : i === 1 ? 'Mañ' : d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', ''), num: d.getDate(), mes: d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '') }); } return o; };
  const diaLargo = (f) => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const nz = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const aMin = (h) => { const p = String(h).split(':'); return (+p[0]) * 60 + (+p[1] || 0); };
  /* horarios: la zona se recuerda (una sola consulta al panel), los resultados se guardan un minuto y se pueden precargar */
  const HC = new Map(); let ZONA = ''; try { ZONA = sessionStorage.getItem('zona:' + (N.PANEL_URL || 'demo')) || ''; } catch (e) { /* sin almacenamiento */ }
  async function horasReal(fecha, personas) {
    const R = N.reservas || {}, FR = R.franjas || [];
    let d = null, zona = '';
    if (ZONA) { d = await P.llamar('disponibilidad', { fecha, personas, zona: ZONA }); if (d && d.ok) zona = ZONA; else d = null; }
    if (!d) {
      d = await P.llamar('disponibilidad', { fecha, personas, zona: '' });
      if (!d || !d.ok) return { err: (d && d.mensaje) || 'No pudimos ver los horarios.' };
      if (R.zona) { const z = (d.zonas || []).find((x) => nz(x).indexOf(nz(R.zona)) === 0); if (z) { zona = z; const d2 = await P.llamar('disponibilidad', { fecha, personas, zona }); if (!d2 || !d2.ok) return { err: (d2 && d2.mensaje) || 'No pudimos ver los horarios.' }; d = d2; ZONA = z; try { sessionStorage.setItem('zona:' + (N.PANEL_URL || 'demo'), z); } catch (e) { /* sin almacenamiento */ } } }
    }
    const franjaDe = (h) => FR.find((x) => aMin(h) >= aMin(x.desde) && aMin(h) <= aMin(x.hasta));
    const ah = new Date(), esHoy = fecha === ah.getFullYear() + '-' + String(ah.getMonth() + 1).padStart(2, '0') + '-' + String(ah.getDate()).padStart(2, '0'), minAhora = ah.getHours() * 60 + ah.getMinutes() + 15;
    const libres = (d.horarios || []).filter((h) => (!FR.length || franjaDe(h.hora)) && !(esHoy && aMin(h.hora) < minAhora));
    const grupos = FR.length ? FR.map((x) => ({ n: x.nombre, hs: libres.filter((h) => franjaDe(h.hora) === x).map((h) => h.hora) })).filter((g) => g.hs.length) : [{ n: '', hs: libres.map((h) => h.hora) }];
    return { grupos, zona, msg: d.mensaje || '' };
  }
  function horas(fecha, personas) {
    const k = fecha + '|' + personas; if (HC.has(k)) return HC.get(k);
    const p = horasReal(fecha, personas).then((r) => { if (r.err) HC.delete(k); return r; }); HC.set(k, p); setTimeout(() => HC.delete(k), 60000); return p;
  }
  /* se llama al cargar la página: así los horarios de hoy y los próximos días ya están cuando se abre la reserva */
  async function precargar(n) { try { const ds = dias(n || 3); await horas(ds[0].iso, 2); ds.slice(1).forEach((x) => horas(x.iso, 2)); } catch (e) { /* sin red */ } }
  let resId = P.idAleatorio('res');
  async function reservar(f) {
    const d = await P.llamar('crearReserva', { reservaId: resId, nombre: f.nombre, telefono: f.telefono, personas: f.personas, fecha: f.fecha, hora: f.hora, zona: f.zona || undefined, nota: f.nota || undefined, alergia: f.alergia || undefined });
    HC.clear();
    if (d && !d.ok && (d.code === 'CONFLICTO' || /lugar/.test(d.mensaje || ''))) resId = P.idAleatorio('res');
    return d;
  }
  const wa = (t) => P.whatsappLink(N.whatsapp, t);
  const mapa = () => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Mucha ' + (N.direccion || 'Santa Fe'));
  /* rota videos con fundido cruzado dentro de un contenedor */
  function rotar(el, files, ms) {
    const vs = files.map((f, i) => { const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = i < 2 ? 'auto' : 'metadata'; v.poster = M + f + '.jpg'; v.src = M + f + '.mp4'; v.className = 'rvid'; el.appendChild(v); return v; });
    let k = 0; const show = (i) => { vs.forEach((v, j) => { v.classList.toggle('on', j === i); if (j === i) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else setTimeout(() => { if (!v.classList.contains('on')) v.pause(); }, 1400); }); };
    show(0); if (vs.length > 1) setInterval(() => { k = (k + 1) % vs.length; show(k); }, ms || 6000);
    return { show };
  }
  window.Prop = { P, N, M, I, carta, imgDe, horas, precargar, reservar, dias, diaLargo, hoy, wa, mapa, rotar, esc: P.esc, pesos: P.pesos, precio: (p) => P.pesos(P.precioDe(p).valor) };
})();
