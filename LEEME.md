# Mucha — capa propia (web + app de mesa)

Sitio estático (HTML/CSS/JS) para el restó Mucha (Boulevard y Mitre, Santa Fe). Se publica con GitHub Pages.

## Qué hay
- La dirección raíz (`/mucha-demo/`) abre la web elegida (propuesta A, `propuestas/a/`). La versión anterior se ve con `?anterior=1`. Los QR de mesa (`?mesa=CÓDIGO`) siguen yendo a `mesa/`.
- `index.html` — web motion: recorrido día → noche (desayuno, almuerzo, merienda, cena, cócteles), carta, reservas, contacto.
- `mesa/index.html` — app QR de mesa (siempre en tema noche).
- `js/config.js` — datos del negocio y `PANEL_URL` (URL /exec del panel). Si está vacío o con `?demo=1`, usa `js/demo.js`.
- `js/motion.js` — escena fijada con GSAP + ScrollTrigger + Lenis. Un solo progreso `o.p` (0→5.3) maneja paleta, reloj, astro y momentos.
- `js/web.js`, `js/panel.js`, `js/mesa.js`, `js/controles.js` — lógica y conexión con el panel (solo GET públicos, nunca manda precios).
- `css/web.css`, `css/piel.css`, `css/mesa.css` — estilos y tokens (burdeos #A3333F, crema #F1EBDF).

## Modos útiles
- `?quieto=1` — versión estática sin animación (también con reduced-motion o sin JS).
- `?demo=1` — fuerza datos de demo.
- `?ping=1` — prueba de conexión con el panel.
- Tema: botón sol/luna fija día o noche (se guarda en `localStorage` como `mucha-tema`).

## Pendiente
- Fotos reales: `img/desayuno.jpg`, `almuerzo.jpg`, `merienda.jpg`, `cena.jpg`, `cocteles.jpg` (hasta que existan, el arco de foto queda oculto).
- Confirmar WhatsApp (`5493425266359`) y horarios de las franjas de reserva (Almuerzo 12:00–15:30, Cena 20:00–23:30, supuestos).
- Tipografías del logo (Rhastelie y la del wordmark): hoy hay sustitutas (Mrs Saint Delafield y Cormorant Garamond).
- Cache busting: subir el `?v=N` de los scripts/estilos en `index.html` al cambiar archivos.
