/* Piel de Mucha — datos del negocio. Junto con css/piel.css y las imágenes, es lo único propio de este cliente. */
window.NEGOCIO = {
  nombre: 'Mucha',
  lema: 'Herencia italiana',
  /* URL /exec del panel del cliente (Lanzador → tarjeta «Conexión con la web»). Vacía = modo demostración con una carta de ejemplo. */
  PANEL_URL: 'https://script.google.com/macros/s/AKfycbxTLrafPHotQV5hnt1WxXFQc1KQSCDj9kt-TClMpkSat8FtBIKutXrIscJ0sMqKa2nhXw/exec',
  whatsapp: '5493425266359',   /* el de sus historias: 342 526 6359 (confirmar) */
  instagram: 'mucha.sf',
  direccion: 'Mitre y Boulevard Gálvez, Santa Fe',
  horarios: ['Lunes a viernes · 7:30 a 1:30', 'Sábados y domingos · 8:30 a 1:30'],
  textoInicio: 'Panadería, pastelería artesanal y cocina italiana. Todos los días, con la cocina abierta de la mañana a la noche.',
  /* Reservas: solo en el salón y solo para almuerzo y/o cena (vereda y terraza van por orden de llegada). Las franjas son de la web; el panel decide la disponibilidad real. Confirmar horarios con el local. */
  reservas: { zona: 'Salón', franjas: [{ nombre: 'Almuerzo', desde: '12:00', hasta: '15:30' }, { nombre: 'Cena', desde: '20:00', hasta: '23:30' }] }
};
