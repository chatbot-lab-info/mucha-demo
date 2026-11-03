/* Modo demostración: contesta como el panel (mismo formato) con una carta de ejemplo, para mostrar la web sin conexión. NO se usa cuando hay PANEL_URL. */
(function () {
  const L = (id, nombre, categoria, precio, descripcion, estacion) => ({ productoId: id, nombre, categoria, precioBase: precio, descripcion: descripcion || '', imagenUrl: '', presentaciones: [], estacion: estacion || 'cocina' });
  const PRODUCTOS = [
    L('p01', 'Mucha', 'Desayuno y merienda', 13000, 'Pan de masa madre tostado, mermelada casera de frutas de estación y queso crema + café latte.', 'barra'),
    L('p02', 'Dolce', 'Desayuno y merienda', 13900, 'Croissant relleno con pastelera o dulce de leche + café latte.', 'barra'),
    L('p03', 'Avocado', 'Desayuno y merienda', 17500, 'Pan de masa madre, palta, huevo y semillas + café latte.'),
    L('p04', 'Croissant', 'Desayuno y merienda', 5800, 'De manteca, laminado a mano.'),
    L('p05', 'Pastel de nata', 'Desayuno y merienda', 4900, 'Masa de hojaldre con crema pastelera.'),
    L('p06', 'Burrata', 'Antipasti', 22500, 'Pesto de tomates secos, olivas marinadas, almendras tostadas y crocante de panceta.'),
    L('p07', 'Próvola ahumada y cherries confit', 'Antipasti', 19000, ''),
    L('p08', 'Croquetas vitello tonnato', 'Antipasti', 14500, 'De carne de ternera braseada en cocción de 6 hs, crema vitello y alcaparras.'),
    L('p09', 'Frito misto di mare', 'Antipasti', 23500, 'Aros de calamar, langostinos y pesca de mar en tempura, alioli.'),
    L('p10', 'Empanada de carne braseada', 'Antipasti', 7800, 'Cocción lenta de 6 hs.'),
    L('p11', 'Cappellaccis de salmón', 'Pastas fatto a mano', 31000, 'Rellenos de salmón rosado y mascarpone, bisque de langostinos, crema de mejillones y aceite de albahaca.'),
    L('p12', 'Tortellonis de roast beef', 'Pastas fatto a mano', 31000, 'Roast beef braseado y crema de hongos.'),
    L('p13', 'Lasagna mixta', 'Pastas fatto a mano', 29500, 'Espinaca, hongos, bolognesa, ricota cremosa, salsa filetto y crema de parmesano.'),
    L('p14', 'Panzottis de zapallo cabutia', 'Pastas fatto a mano', 29000, 'Mozzarella y queso azul con crema de parmesano y almendras tostadas.'),
    L('p15', 'Gnocchis de papa', 'Pastas fatto a mano', 27500, 'Con crema de parmesano y crocante de panceta.'),
    L('p16', 'Cavatellis con ragú', 'Pastas fatto a mano', 27900, 'Crema de parmesano y ragú de ternera braseada en cocción de 6 hs.'),
    L('p17', 'Entraña', 'Principales', 34000, 'Único punto: jugoso. Papas triple cocción, cremoso de coliflor ahumado y gremolata.'),
    L('p18', 'Salmón rosado en croute', 'Principales', 38000, 'De hierbas y semillas, emulsión de cítricos y cremoso de espinacas.'),
    L('p19', 'Risotto di mare al azafrán', 'Principales', 33000, 'Salmón rosado, mejillones y langostinos.'),
    L('p20', 'Risotto de cabutia', 'Principales', 28000, 'Ricota cremosa de la casa, almendras tostadas y suave pesto de albahaca.'),
    L('p21', 'Caesar', 'Ensaladas', 24000, 'Hojas verdes, pollo grillé, croutons, huevo sous vide, hebras de parmesano y olivas.'),
    L('p22', 'Lomito ahumado', 'Focaccia sandwich', 21000, 'Láminas de parmesano, rúcula, tomates asados, queso blanco y tapenade de olivas negras.'),
    L('p23', 'Aperol Spritz', 'Cocteles', 9000, 'Aperol, espumante y soda.', 'barra'),
    L('p24', 'Negroni', 'Cocteles', 9000, '', 'barra'),
    L('p25', 'Espresso Martini', 'Cocteles', 8900, '', 'barra'),
    L('p26', 'Amaretto Sour', 'Cocteles', 9000, '', 'barra')
  ];
  const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
  const ls = { get: (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* nada */ } } };
  const hoy = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const ETIQ = { por_confirmar: 'Esperando que el personal lo confirme', nuevo: 'Recibido', preparando: 'En preparación', listo: 'Listo, ya te lo llevan', entregado: 'Entregado' };
  const estadoPor = (seg) => (seg < 7 ? 'por_confirmar' : seg < 15 ? 'nuevo' : seg < 28 ? 'preparando' : seg < 42 ? 'listo' : 'entregado');

  async function llamar(action, d) {
    await pausa(220);
    if (action === 'carta') return { ok: true, productos: PRODUCTOS, config: { nombreNegocio: 'Mucha', whatsappNumero: '' }, demo: true };
    if (action === 'disponibilidad') {
      const n = Number(d.personas) || 2, horarios = [];
      if (!d.fecha || d.fecha < hoy()) return { ok: false, code: 'VALIDACION', mensaje: 'Elegí una fecha válida.' };
      const ahora = new Date(), esHoy = d.fecha === hoy(), min = ahora.getHours() * 60 + ahora.getMinutes();
      for (let t = 7 * 60 + 30; t <= 23 * 60 + 30; t += 30) {
        if (esHoy && t < min + 20) continue;
        if ((t / 30 + n + Number(d.fecha.slice(-2))) % 7 === 0) continue;   // algunos horarios «completos» para que se vea real
        horarios.push({ hora: String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'), zonas: ['Salón', 'Vereda'] });
      }
      if (n > 8) return { ok: true, fecha: d.fecha, personas: n, zonas: ['Salón', 'Vereda'], horarios: [], mensaje: 'Para grupos de más de 8 personas escribinos por WhatsApp y lo coordinamos.' };
      return { ok: true, fecha: d.fecha, personas: n, zonas: ['Salón', 'Vereda'], duracionMin: 90, horarios: horarios, mensaje: horarios.length ? '' : 'No hay lugar ese día. Probá otro día o escribinos por WhatsApp.' };
    }
    if (action === 'crearReserva') {
      if (!d.nombre || String(d.nombre).trim().length < 2) return { ok: false, code: 'VALIDACION', mensaje: 'Revisá los datos de la reserva.', campos: { nombre: 'Escribí tu nombre.' } };
      if (!/\d{3}.*\d{6,}|\d{9,}/.test(String(d.telefono || '').replace(/\D/g, '') ? String(d.telefono) : '')) return { ok: false, code: 'VALIDACION', mensaje: 'Revisá los datos de la reserva.', campos: { telefono: 'Poné tu teléfono con código de área, por ejemplo 342 5123456.' } };
      const n = (ls.get('demo_nres') || 0) + 1; ls.set('demo_nres', n);
      return { ok: true, reservaId: d.reservaId, numero: n, estado: 'pendiente', fecha: d.fecha, hora: d.hora, personas: d.personas, zona: d.zona || 'Salón', whatsappUrl: '' };
    }
    const token = String(d.token || '');
    if (!/^[A-Za-z0-9]{24,48}$/.test(token)) return { ok: false, code: 'NO_ENCONTRADO', mensaje: 'Este código ya no está activo. Pedile ayuda al personal.' };
    const est = ls.get('demo_mesa_' + token) || { pedidos: [], aviso: '' };
    if (action === 'mesaQr') {
      const ahora = Date.now(), pedidos = [];
      est.pedidos.forEach((p) => p.items.forEach((i) => { const e = estadoPor((ahora - p.t) / 1000); pedidos.push({ nombre: i.nombre, detalle: '', cantidad: i.cantidad, estado: e, estadoTexto: ETIQ[e] }); }));
      return { ok: true, negocio: 'Mucha', whatsappNumero: '', mesa: { numero: 5, zona: 'Salón' }, productos: PRODUCTOS, aviso: est.aviso && ahora - est.avisoT < 90000 ? est.aviso : '', pedidos: pedidos, mostrarEstado: true, demo: true };
    }
    if (action === 'qrPedir') {
      if (!Array.isArray(d.items) || !d.items.length) return { ok: false, code: 'VALIDACION', mensaje: 'Elegí al menos un plato o bebida.' };
      if (!est.pedidos.some((p) => p.id === d.pedidoQrId)) { est.pedidos.push({ id: d.pedidoQrId, t: Date.now(), items: d.items.map((i) => ({ nombre: (PRODUCTOS.find((p) => p.productoId === i.productoId) || {}).nombre || 'Pedido', cantidad: i.cantidad })) }); ls.set('demo_mesa_' + token, est); }
      return { ok: true, renglones: d.items.length, avisos: [], mensaje: 'Recibimos tu pedido. El personal lo confirma y avisa a cocina.' };
    }
    if (action === 'qrLlamar') {
      est.aviso = { mozo: 'llamo', carta: 'pidio_carta', cuenta: 'pidio_cuenta' }[d.motivo] || ''; est.avisoT = Date.now(); ls.set('demo_mesa_' + token, est);
      return { ok: true, aviso: est.aviso, mensaje: 'Ya avisamos al personal.' };
    }
    return { ok: false, code: 'NO_ENCONTRADO', mensaje: 'Esa acción no existe.' };
  }
  window.MuchaDemo = { llamar };
})();
