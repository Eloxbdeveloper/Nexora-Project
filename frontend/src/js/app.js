// ==========================================
// INICIALIZACIÓN Y DEPENDENCIAS
// ==========================================
import './components/Header.js';
import { initTabs } from './components/Tabs.js';
import './components/Modal.js'; 
import { initMap } from './map/map.js';

// Coordenadas centrales de Bogotá y zoom general
const BOGOTA_LAT = 4.6097;
const BOGOTA_LNG = -74.0817;
const INITIAL_ZOOM = 11;

const mapContainer = document.querySelector('.map_render');

if (mapContainer) {
  const map = L.map(mapContainer).setView([BOGOTA_LAT, BOGOTA_LNG], INITIAL_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  window.appMap = map;
}

initTabs();

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
function getIncidentEmoji(type) {
  const emojis = {
    'accidente': '🚨',
    'bloqueo': '🚧',
    'congestion': '🚗',
    'retraso': '⏱️',
    'estacion': '🚉',
    'infraestructura': '⚠️',
    'obras': '🛠️'
  };
  return emojis[type.toLowerCase()] || '📌';
}

function formatSeverity(severity) {
  const levels = {
    'alta': { class: 'high', text: 'Alta' },
    'media': { class: 'medium', text: 'Media' },
    'baja': { class: 'low', text: 'Baja' }
  };
  const key = severity.toLowerCase();
  return levels[key] || { class: 'medium', text: severity };
}

function getStatusClass(status) {
  const statuses = {
    'activo': 'status-active',
    'en revisión': 'status-review',
    'solucionado': 'status-resolved'
  };
  return statuses[status.toLowerCase()] || 'status-active';
}

function getSeverityClass(severity) {
  const levels = {
    'alta': 'severity-high',
    'media': 'severity-medium',
    'baja': 'severity-low'
  };
  const key = severity.toLowerCase();
  return levels[key] || 'severity-medium';
}

// Función auxiliar para normalizar textos (eliminar tildes y pasar a minúsculas)
function normalizeStr(str) {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// ==========================================
// FUNCIÓN PARA ABRIR EL MODAL (Tarjeta Ampliada)
// ==========================================
function openReportModal(report) {
  const modal = document.getElementById('modal');
  
  if (!modal) {
    console.error("No se encontró un elemento con id='modal' en tu HTML.");
    return;
  }

  modal.innerHTML = '';

  const emoji = getIncidentEmoji(report.type);
  const statusClass = getStatusClass(report.status || 'Activo');
  const severityClass = getSeverityClass(report.severity);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  const modalTitleWrapper = document.createElement('div');
  modalTitleWrapper.classList.add('modal-title-wrapper');

  const modalEmojiSpan = document.createElement('span');
  modalEmojiSpan.classList.add('modal-emoji');
  modalEmojiSpan.textContent = emoji;

  const modalTypeH2 = document.createElement('h2');
  modalTypeH2.id = 'modal-type';
  modalTypeH2.textContent = report.type;

  modalTitleWrapper.appendChild(modalEmojiSpan);
  modalTitleWrapper.appendChild(modalTypeH2);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'modal-close';
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = '&times;';

  modalHeader.appendChild(modalTitleWrapper);
  modalHeader.appendChild(closeBtn);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const rowStatus = document.createElement('div');
  rowStatus.classList.add('modal-info-row');
  const labelStatus = document.createElement('span');
  labelStatus.classList.add('modal-label');
  labelStatus.textContent = 'Estado:';
  const valStatus = document.createElement('span');
  valStatus.id = 'modal-status';
  valStatus.classList.add('modal-badge', statusClass);
  valStatus.textContent = report.status || 'Activo';
  rowStatus.appendChild(labelStatus);
  rowStatus.appendChild(valStatus);

  const rowSeverity = document.createElement('div');
  rowSeverity.classList.add('modal-info-row');
  const labelSeverity = document.createElement('span');
  labelSeverity.classList.add('modal-label');
  labelSeverity.textContent = 'Gravedad:';
  const valSeverity = document.createElement('span');
  valSeverity.id = 'modal-severity';
  valSeverity.classList.add('modal-badge', severityClass);
  valSeverity.textContent = report.severity;
  rowSeverity.appendChild(labelSeverity);
  rowSeverity.appendChild(valSeverity);

  const rowLocation = document.createElement('div');
  rowLocation.classList.add('modal-info-row');
  const labelLocation = document.createElement('span');
  labelLocation.classList.add('modal-label');
  labelLocation.textContent = 'Ubicación:';
  const valLocation = document.createElement('span');
  valLocation.id = 'modal-location';
  valLocation.textContent = `${report.location} (${report.locality})`;
  rowLocation.appendChild(labelLocation);
  rowLocation.appendChild(valLocation);

  const rowTime = document.createElement('div');
  rowTime.classList.add('modal-info-row');
  const labelTime = document.createElement('span');
  labelTime.classList.add('modal-label');
  labelTime.textContent = 'Fecha y Hora:';
  const valTime = document.createElement('span');
  valTime.id = 'modal-time';
  valTime.textContent = report.time;
  rowTime.appendChild(labelTime);
  rowTime.appendChild(valTime);

  const descBox = document.createElement('div');
  descBox.classList.add('modal-description-box');
  const descTitle = document.createElement('h4');
  descTitle.textContent = 'Descripción del incidente:';
  const descText = document.createElement('p');
  descText.id = 'modal-description';
  descText.textContent = report.description || 'Sin descripción detallada proporcionada para este reporte.';
  descBox.appendChild(descTitle);
  descBox.appendChild(descText);

  const footerInfo = document.createElement('div');
  footerInfo.classList.add('modal-footer-info');
  const footerSpan = document.createElement('span');
  const footerStrong = document.createElement('strong');
  footerStrong.textContent = `${report.reportsCount || 1} usuarios`;
  footerSpan.textContent = '👥 Reportado por ';
  footerSpan.appendChild(footerStrong);
  footerSpan.append(' con situaciones similares');
  footerInfo.appendChild(footerSpan);

  modalBody.appendChild(rowStatus);
  modalBody.appendChild(rowSeverity);
  modalBody.appendChild(rowLocation);
  modalBody.appendChild(rowTime);
  modalBody.appendChild(descBox);
  modalBody.appendChild(footerInfo);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  modal.classList.remove('hidden');

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// ==========================================
// RENDERIZAR LISTA DE REPORTES
// ==========================================
export function renderReports(reports) {
  const container = document.querySelector('.reports-list-container');
  
  if (!container) return;

  container.innerHTML = '';

  if (!reports || reports.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('report-card-placeholder');
    const p = document.createElement('p');
    p.textContent = 'No hay incidentes reportados en este momento.';
    placeholder.appendChild(p);
    container.appendChild(placeholder);
    return;
  }

  reports.forEach(report => {
    const emoji = getIncidentEmoji(report.type);
    const severityInfo = formatSeverity(report.severity);

    const cardElement = document.createElement('div');
    cardElement.classList.add('report-card');
    
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('report-icon-container');
    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('report-emoji');
    emojiSpan.textContent = emoji;
    iconContainer.appendChild(emojiSpan);

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('report-details');

    const titleRow = document.createElement('div');
    titleRow.classList.add('report-title-row');

    const titleH3 = document.createElement('h3');
    titleH3.classList.add('report-type-title');
    titleH3.textContent = report.type;

    const severitySpan = document.createElement('span');
    severitySpan.classList.add('report-severity', severityInfo.class);
    severitySpan.textContent = severityInfo.text;

    titleRow.appendChild(titleH3);
    titleRow.appendChild(severitySpan);

    const locationP = document.createElement('p');
    locationP.classList.add('report-location');
    locationP.textContent = `📍 ${report.location} `;
    
    const localitySpan = document.createElement('span');
    localitySpan.classList.add('report-locality');
    localitySpan.textContent = `(${report.locality})`;
    locationP.appendChild(localitySpan);

    const footerInfo = document.createElement('div');
    footerInfo.classList.add('report-footer-info');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('report-time');
    timeSpan.textContent = `🕒 ${report.time}`;

    const countSpan = document.createElement('span');
    countSpan.classList.add('report-count');
    countSpan.textContent = `👥 ${report.reportsCount || 1} reportes`;

    footerInfo.appendChild(timeSpan);
    footerInfo.appendChild(countSpan);

    detailsContainer.appendChild(titleRow);
    detailsContainer.appendChild(locationP);
    detailsContainer.appendChild(footerInfo);

    cardElement.appendChild(iconContainer);
    cardElement.appendChild(detailsContainer);

    cardElement.addEventListener('click', () => {
      openReportModal(report);
    });

    container.appendChild(cardElement);
  });
}

// ==========================================
// MOCK DATA (Datos de prueba enriquecidos)
// ==========================================
const mockReports = [
  {
    id: 1,
    type: 'Retraso',
    severity: 'media',
    status: 'Activo',
    location: 'Autopista Norte con Cl. 100',
    locality: 'Usaquén',
    time: 'Hace 42 min',
    description: 'Demoras significativas en la operación troncal debido a alta congestión vehicular en los carriles exclusivos.',
    reportsCount: 5
  },
  {
    id: 2,
    type: 'Accidente',
    severity: 'alta',
    status: 'En revisión',
    location: 'Av. Caracas con Calle 45',
    locality: 'Chapinero',
    time: 'Hace 15 min',
    description: 'Colisión múltiple genera bloqueo parcial de la vía. Autoridades de tránsito en camino.',
    reportsCount: 12
  },
  {
    id: 3,
    type: 'Congestion',
    severity: 'baja',
    status: 'Activo',
    location: 'Calle 26 con Cr. 68',
    locality: 'Fontibón',
    time: 'Hace 8 min',
    description: 'Tráfico lento en sentido oriente-occidente por alto flujo vehicular rutinario.',
    reportsCount: 2
  },
  {
    id: 4,
    type: 'Bloqueo',
    severity: 'alta',
    status: 'Activo',
    location: 'Carrera 7 con Calle 72',
    locality: 'Chapinero',
    time: 'Hace 20 min',
    description: 'Manifestación social afecta la movilidad en ambos sentidos de la vía.',
    reportsCount: 18
  },
  {
    id: 5,
    type: 'Estacion',
    severity: 'media',
    status: 'En revisión',
    location: 'Estación Calle 100 (Glorieta)',
    locality: 'Usaquén',
    time: 'Hace 30 min',
    description: 'Afluencia masiva de pasajeros y retraso en la llegada de servicios alimentadores.',
    reportsCount: 7
  },
  {
    id: 6,
    type: 'Infraestructura',
    severity: 'alta',
    status: 'Activo',
    location: 'NQS con Calle 3 sur',
    locality: 'Puente Aranda',
    time: 'Hace 1 hora',
    description: 'Hueco profundo en el carril exclusivo de TransMilenio pone en riesgo a los articulados.',
    reportsCount: 9
  },
  {
    id: 7,
    type: 'Obras',
    severity: 'baja',
    status: 'Activo',
    location: 'Avenida Boyacá con Calle 80',
    locality: 'Engativá',
    time: 'Hace 2 horas',
    description: 'Mantenimiento vial nocturno que se extendió hasta la mañana, reduciendo un carril.',
    reportsCount: 3
  },
  {
    id: 8,
    type: 'Accidente',
    severity: 'media',
    status: 'En revisión',
    location: 'Autopista Sur con Cra. 72',
    locality: 'Bosa',
    time: 'Hace 25 min',
    description: 'Vehículo particular varado tras choque leve contra separador.',
    reportsCount: 4
  },
  {
    id: 9,
    type: 'Congestion',
    severity: 'media',
    status: 'Activo',
    location: 'Calle 13 con Cra. 100',
    locality: 'Fontibón',
    time: 'Hace 12 min',
    description: 'Alto flujo de vehículos de carga pesada generando tránsito lento hacia la salida de la ciudad.',
    reportsCount: 6
  },
  {
    id: 10,
    type: 'Retraso',
    severity: 'alta',
    status: 'Activo',
    location: 'Portal del Norte',
    locality: 'Usaquén',
    time: 'Hace 5 min',
    description: 'Falla técnica en torniquetes genera fila extensa para el ingreso a la estación.',
    reportsCount: 14
  },
  {
    id: 11,
    type: 'Bloqueo',
    severity: 'alta',
    status: 'Solucionado',
    location: 'Carrera 10 con Calle 19',
    locality: 'Santa Fe',
    time: 'Hace 3 horas',
    description: 'Camión varado que obstruía el carril central ya fue retirado por grúa.',
    reportsCount: 8
  },
  {
    id: 12,
    type: 'Estacion',
    severity: 'baja',
    status: 'Activo',
    location: 'Estación Universidades',
    locality: 'La Candelaria',
    time: 'Hace 18 min',
    description: 'Pantallas de información de rutas fuera de servicio temporalmente.',
    reportsCount: 2
  },
  {
    id: 13,
    type: 'Accidente',
    severity: 'alta',
    status: 'Activo',
    location: 'Avenida Suba con Calle 127',
    locality: 'Suba',
    time: 'Hace 3 min',
    description: 'Atropello a peatón. Ambulancia y policía en el punto atendiendo la emergencia.',
    reportsCount: 22
  },
  {
    id: 14,
    type: 'Congestion',
    severity: 'alta',
    status: 'Activo',
    location: 'Calle 80 con Cra. 114',
    locality: 'Engativá',
    time: 'Hace 35 min',
    description: 'Trancón monumental ingresando al Puente de Guadua por plan éxodo.',
    reportsCount: 30
  },
  {
    id: 15,
    type: 'Infraestructura',
    severity: 'media',
    status: 'En revisión',
    location: 'Calle 72 con Cra. 13',
    locality: 'Chapinero',
    time: 'Hace 50 min',
    description: 'Semáforo desincronizado en el cruce peatonal genera riesgo de accidentalidad.',
    reportsCount: 11
  },
  {
    id: 16,
    type: 'Obras',
    severity: 'media',
    status: 'Activo',
    location: 'Avenida 68 con Calle 26',
    locality: 'Teusaquillo',
    time: 'Hace 4 horas',
    description: 'Trabajos de valorización y construcción de troncal de TransMilenio reducen calzada mixta.',
    reportsCount: 5
  },
  {
    id: 17,
    type: 'Retraso',
    severity: 'baja',
    status: 'Activo',
    location: 'Portal Sur',
    locality: 'Bosa',
    time: 'Hace 22 min',
    description: 'Demora leve en la salida de servicios zonales (SITP) por congestión en patios.',
    reportsCount: 4
  },
  {
    id: 18,
    type: 'Accidente',
    severity: 'baja',
    status: 'Solucionado',
    location: 'Calle 53 con Cra. 24',
    locality: 'Teusaquillo',
    time: 'Hace 2 horas',
    description: 'Lainas de latas entre dos taxis sin mayores afectaciones a la movilidad.',
    reportsCount: 3
  },
  {
    id: 19,
    type: 'Bloqueo',
    severity: 'media',
    status: 'Activo',
    location: 'Carrera 30 con Calle 8',
    locality: 'Los Mártires',
    time: 'Hace 40 min',
    description: 'Avería mecánica de articulado bloquea carril de incorporación.',
    reportsCount: 15
  },
  {
    id: 20,
    type: 'Estacion',
    severity: 'alta',
    status: 'Activo',
    location: 'Estación Ricaurte',
    locality: 'Puente Aranda',
    time: 'Hace 10 min',
    description: 'Puerta antivandálica averiada en el vagón sur, paso restringido.',
    reportsCount: 16
  },
  {
    id: 21,
    type: 'Congestion',
    severity: 'media',
    status: 'Activo',
    location: 'Avenida Boyacá con Calle 53',
    locality: 'Engativá',
    time: 'Hace 28 min',
    description: 'Vehículo varado en el carril central genera represamiento vehicular.',
    reportsCount: 7
  },
  {
    id: 22,
    type: 'Infraestructura',
    severity: 'baja',
    status: 'En revisión',
    location: 'Cra. 7 con Cl. 19',
    locality: 'Santa Fe',
    time: 'Hace 1 hora',
    description: 'Tapa de alcantarilla sin asegurar sobre el andén peatonal.',
    reportsCount: 2
  },
  {
    id: 23,
    type: 'Obras',
    severity: 'baja',
    status: 'Activo',
    location: 'Calle 100 con Cra. 15',
    locality: 'Usaquén',
    time: 'Hace 3 horas',
    description: 'Intervención de redes de acueducto y alcantarillado sobre el carril lento.',
    reportsCount: 1
  },
  {
    id: 24,
    type: 'Accidente',
    severity: 'alta',
    status: 'Activo',
    location: 'Autopista Sur con Calle 65 sur',
    locality: 'Ciudad Bolívar',
    time: 'Hace 14 min',
    description: 'Colisión entre motocicleta y bus zonal. Tránsito pesado en la zona.',
    reportsCount: 19
  },
  {
    id: 25,
    type: 'Retraso',
    severity: 'media',
    status: 'Activo',
    location: 'Portal de Suba',
    locality: 'Suba',
    time: 'Hace 19 min',
    description: 'Alta demanda de usuarios combinada con menor frecuencia de servicios en hora pico.',
    reportsCount: 10
  },
  {
    id: 26,
    type: 'Accidente',
    severity: 'baja',
    status: 'Solucionado',
    location: 'Calle 127 con Cra. 19',
    locality: 'Usaquén',
    time: 'Hace 2 horas',
    description: 'Choque simple de laminas sin lesionados, vehículos movilizados a la berma.',
    reportsCount: 2
  },
  {
    id: 27,
    type: 'Bloqueo',
    severity: 'alta',
    status: 'Activo',
    location: 'Avenida 1 de Mayo con Cra. 68',
    locality: 'Kennedy',
    time: 'Hace 25 min',
    description: 'Protesta comunitaria por fallas en el suministro de servicios públicos.',
    reportsCount: 14
  },
  {
    id: 28,
    type: 'Congestion',
    severity: 'alta',
    status: 'Activo',
    location: 'Autopista Sur con Portal Sur',
    locality: 'Bosa',
    time: 'Hace 10 min',
    description: 'Saturación en los accesos al portal por alta afluencia de pasajeros saliendo de laborar.',
    reportsCount: 11
  },
  {
    id: 29,
    type: 'Infraestructura',
    severity: 'media',
    status: 'En revisión',
    location: 'Calle 26 con Cra. 30',
    locality: 'Teusaquillo',
    time: 'Hace 45 min',
    description: 'Falla en el sistema de señalización lumínica del paso peatonal subterráneo.',
    reportsCount: 5
  },
  {
    id: 30,
    type: 'Estacion',
    severity: 'alta',
    status: 'Activo',
    location: 'Portal del Sur',
    locality: 'Bosa',
    time: 'Hace 12 min',
    description: 'Sobrecupo severo en los servicios de TransMilenio con destino al centro.',
    reportsCount: 13
  },
  {
    id: 31,
    type: 'Obras',
    severity: 'baja',
    status: 'Activo',
    location: 'Carrera Séptima con Calle 100',
    locality: 'Usaquén',
    time: 'Hace 3 horas',
    description: 'Demarcación y señalización vial ejecutada por la Secretaría de Movilidad.',
    reportsCount: 3
  },
  {
    id: 32,
    type: 'Retraso',
    severity: 'media',
    status: 'Activo',
    location: 'Avenida Villavicencio con Cra. 86',
    locality: 'Kennedy',
    time: 'Hace 30 min',
    description: 'Flujo vehicular lento debido a camión varado en carril central.',
    reportsCount: 8
  },
  {
    id: 33,
    type: 'Accidente',
    severity: 'alta',
    status: 'Activo',
    location: 'Calle 13 con Cra. 50',
    locality: 'Puente Aranda',
    time: 'Hace 7 min',
    description: 'Accidente grave entre tractocamión y ciclista. Vía completamente cerrada.',
    reportsCount: 25
  },
  {
    id: 34,
    type: 'Congestion',
    severity: 'baja',
    status: 'Solucionado',
    location: 'Calle 100 con Autopista Norte',
    locality: 'Usaquén',
    time: 'Hace 2 horas',
    description: 'Congestión matutina disipada con normalización del tráfico.',
    reportsCount: 4
  },
  {
    id: 35,
    type: 'Bloqueo',
    severity: 'media',
    status: 'Activo',
    location: 'Carrera 13 con Calle 54',
    locality: 'Chapinero',
    time: 'Hace 18 min',
    description: 'Árbol caído sobre la calzada bloquea parcialmente el paso vehicular.',
    reportsCount: 9
  },
  {
    id: 36,
    type: 'Estacion',
    severity: 'baja',
    status: 'Activo',
    location: 'Estación Bicentenario',
    locality: 'Santa Fe',
    time: 'Hace 40 min',
    description: 'Fila moderada para recarga de tarjetas tullave en taquilla principal.',
    reportsCount: 3
  },
  {
    id: 37,
    type: 'Infraestructura',
    severity: 'alta',
    status: 'Activo',
    location: 'Avenida Circunvalar con Calle 20',
    locality: 'Santa Fe',
    time: 'Hace 1 hora',
    description: 'Deslizamiento menor de tierra sobre el carril derecho debido a las lluvias recientes.',
    reportsCount: 7
  },
  {
    id: 38,
    type: 'Obras',
    severity: 'media',
    status: 'Activo',
    location: 'Calle 63 con Cra. 24',
    locality: 'Teusaquillo',
    time: 'Hace 2 horas',
    description: 'Repavimentación asfáltica en los alrededores del parque Simón Bolívar.',
    reportsCount: 6
  },
  {
    id: 39,
    type: 'Retraso',
    severity: 'alta',
    status: 'Activo',
    location: 'Portal Américas',
    locality: 'Kennedy',
    time: 'Hace 15 min',
    description: 'Retrasos generalizados en las rutas alimentadoras por protestas en vías aledañas.',
    reportsCount: 16
  },
  {
    id: 40,
    type: 'Accidente',
    severity: 'media',
    status: 'En revisión',
    location: 'Avenida Boyacá con Calle 127',
    locality: 'Suba',
    time: 'Hace 20 min',
    description: 'Automóvil choca contra poste de luz. Movilidad reducida.',
    reportsCount: 9
  },
  {
    id: 41,
    type: 'Congestion',
    severity: 'alta',
    status: 'Activo',
    location: 'NQS con Calle 80',
    locality: ' Barrios Unidos',
    time: 'Hace 12 min',
    description: 'Colapso vehicular en el deprimido de la NQS con Calle 80.',
    reportsCount: 14
  },
  {
    id: 42,
    type: 'Bloqueo',
    severity: 'alta',
    status: 'Activo',
    location: 'Calle 26 con Cra. 7',
    locality: 'Santa Fe',
    time: 'Hace 35 min',
    description: 'Marcha estudiantil ocupa temporalmente los carriles mixtos.',
    reportsCount: 20
  },
  {
    id: 43,
    type: 'Estacion',
    severity: 'baja',
    status: 'Activo',
    location: 'Estación Marly',
    locality: 'Chapinero',
    time: 'Hace 25 min',
    description: 'Demora en la apertura de puertas automáticas en el vagón norte.',
    reportsCount: 2
  },
  {
    id: 44,
    type: 'Infraestructura',
    severity: 'baja',
    status: 'En revisión',
    location: 'Carrera 15 con Calle 85',
    locality: 'Chapinero',
    time: 'Hace 50 min',
    description: 'Hundimiento leve en la placa asfáltica del carril de la derecha.',
    reportsCount: 4
  },
  {
    id: 45,
    type: 'Obras',
    severity: 'alta',
    status: 'Activo',
    location: 'Autopista Norte con Calle 170',
    locality: 'Usaquén',
    time: 'Hace 3 horas',
    description: 'Obras de ampliación de la troncal generan cierres intermitentes.',
    reportsCount: 12
  },
  {
    id: 46,
    type: 'Retraso',
    severity: 'baja',
    status: 'Solucionado',
    location: 'Estación Las Aguas',
    locality: 'La Candelaria',
    time: 'Hace 4 horas',
    description: 'Aglomeración matutina controlada por personal de la estación.',
    reportsCount: 5
  },
  {
    id: 47,
    type: 'Accidente',
    severity: 'alta',
    status: 'Activo',
    location: 'Calle 80 con Cra. 68',
    locality: 'Engativá',
    time: 'Hace 5 min',
    description: 'Volcamiento de vehículo particular sobre la calzada rápida. Tráfico detenido.',
    reportsCount: 28
  },
  {
    id: 48,
    type: 'Congestion',
    severity: 'media',
    status: 'Activo',
    location: 'Avenida Caracas con Calle 72',
    locality: 'Chapinero',
    time: 'Hace 18 min',
    description: 'Tránsito lento debido a alto volumen de buses zonales mal parqueados en bahías.',
    reportsCount: 7
  },
  {
    id: 49,
    type: 'Bloqueo',
    severity: 'baja',
    status: 'Solucionado',
    location: 'Carrera Séptima con Calle 24',
    locality: 'Santa Fe',
    time: 'Hace 3 horas',
    description: 'Vehículo obstaculizando el carril preferencial retirado con éxito.',
    reportsCount: 3
  },
  {
    id: 50,
    type: 'Estacion',
    severity: 'alta',
    status: 'Activo',
    location: 'Portal del Norte',
    locality: 'Usaquén',
    time: 'Hace 8 min',
    description: 'Falla general en el sistema de validación biométrica en torniquetes principales.',
    reportsCount: 17
  }
];

// ==========================================
// LÓGICA DE FILTRADO
// ==========================================
function filterReports() {
  const localityFilter = document.getElementById('filter-locality').value;
  const typeFilter = document.getElementById('filter-type').value;

  const filteredReports = mockReports.filter(report => {
    const matchesLocality = !localityFilter || normalizeStr(report.locality) === normalizeStr(localityFilter);
    const matchesType = !typeFilter || normalizeStr(report.type) === normalizeStr(typeFilter);
    
    return matchesLocality && matchesType;
  });

  renderReports(filteredReports);
}

// ==========================================
// FUNCIÓN PARA ABRIR EL MODAL DE CREACIÓN DE REPORTE
// ==========================================
function openCreateReportModal(onReportSubmit) {
  const modal = document.getElementById('modal');
  
  if (!modal) {
    console.error("No se encontró un elemento con id='modal' en tu HTML.");
    return;
  }

  modal.innerHTML = '';

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  const modalTitleWrapper = document.createElement('div');
  modalTitleWrapper.classList.add('modal-title-wrapper');

  const modalEmojiSpan = document.createElement('span');
  modalEmojiSpan.classList.add('modal-emoji');
  modalEmojiSpan.textContent = '📝';

  const modalTypeH2 = document.createElement('h2');
  modalTypeH2.id = 'modal-type';
  modalTypeH2.textContent = 'Crear Nuevo Reporte';

  modalTitleWrapper.appendChild(modalEmojiSpan);
  modalTitleWrapper.appendChild(modalTypeH2);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'modal-close';
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = '&times;';

  modalHeader.appendChild(modalTitleWrapper);
  modalHeader.appendChild(closeBtn);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const form = document.createElement('form');
  form.id = 'create-report-form';
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '0.85rem';

  const groupType = document.createElement('div');
  groupType.classList.add('modal-info-row');
  const labelType = document.createElement('span');
  labelType.classList.add('modal-label');
  labelType.textContent = 'Tipo:';
  
  const selectType = document.createElement('select');
  selectType.name = 'type';
  selectType.classList.add('report-select');
  selectType.required = true;
  
  const typesOptions = [
    { value: '', text: 'Seleccione un tipo' },
    { value: 'Accidente', text: 'Accidente' },
    { value: 'Bloqueo', text: 'Bloqueo' },
    { value: 'Congestion', text: 'Congestión / Trancón' },
    { value: 'Retraso', text: 'Retrasos' },
    { value: 'Estacion', text: 'Problemas en estación' },
    { value: 'Infraestructura', text: 'Daños en infraestructura' },
    { value: 'Obras', text: 'Obras' }
  ];
  typesOptions.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    selectType.appendChild(optionEl);
  });
  groupType.appendChild(labelType);
  groupType.appendChild(selectType);

  const groupSeverity = document.createElement('div');
  groupSeverity.classList.add('modal-info-row');
  const labelSeverity = document.createElement('span');
  labelSeverity.classList.add('modal-label');
  labelSeverity.textContent = 'Gravedad:';
  
  const selectSeverity = document.createElement('select');
  selectSeverity.name = 'severity';
  selectSeverity.classList.add('report-select');
  selectSeverity.required = true;
  
  const severityOptions = [
    { value: '', text: 'Seleccione gravedad' },
    { value: 'baja', text: 'Baja' },
    { value: 'media', text: 'Media' },
    { value: 'alta', text: 'Alta' }
  ];
  severityOptions.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    selectSeverity.appendChild(optionEl);
  });
  groupSeverity.appendChild(labelSeverity);
  groupSeverity.appendChild(selectSeverity);

  const groupLocality = document.createElement('div');
  groupLocality.classList.add('modal-info-row');
  const labelLocality = document.createElement('span');
  labelLocality.classList.add('modal-label');
  labelLocality.textContent = 'Localidad:';
  
  const selectLocality = document.createElement('select');
  selectLocality.name = 'locality';
  selectLocality.classList.add('report-select');
  selectLocality.required = true;
  
  const localitites = [
    "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", 
    "Tunjuelito", "Bosa", "Kennedy", "Fontibón", "Engativá", 
    "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", 
    "Antonio Nariño", "Puente Aranda", "La Candelaria", 
    "Rafael Uribe Uribe", "Ciudad Bolívar", "Sumapaz"
  ];
  const defaultLocOpt = document.createElement('option');
  defaultLocOpt.value = '';
  defaultLocOpt.textContent = 'Seleccione localidad';
  selectLocality.appendChild(defaultLocOpt);

  localitites.forEach(loc => {
    const optionEl = document.createElement('option');
    optionEl.value = loc;
    optionEl.textContent = loc;
    selectLocality.appendChild(optionEl);
  });
  groupLocality.appendChild(labelLocality);
  groupLocality.appendChild(selectLocality);

  const groupLocation = document.createElement('div');
  groupLocation.classList.add('modal-info-row');
  const labelLocation = document.createElement('span');
  labelLocation.classList.add('modal-label');
  labelLocation.textContent = 'Dirección:';
  
  const inputLocation = document.createElement('input');
  inputLocation.type = 'text';
  inputLocation.name = 'location';
  inputLocation.placeholder = 'Ej: Autopista Norte con Cl. 100';
  inputLocation.classList.add('report-select');
  inputLocation.required = true;
  groupLocation.appendChild(labelLocation);
  groupLocation.appendChild(inputLocation);

  const descBox = document.createElement('div');
  descBox.classList.add('modal-description-box');
  const descTitle = document.createElement('h4');
  descTitle.textContent = 'Descripción del incidente:';
  
  const textareaDesc = document.createElement('textarea');
  textareaDesc.name = 'description';
  textareaDesc.placeholder = 'Detalles adicionales...';
  textareaDesc.rows = 3;
  textareaDesc.classList.add('report-select');
  textareaDesc.style.resize = 'none';
  descBox.appendChild(descTitle);
  descBox.appendChild(textareaDesc);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.classList.add('btn-full-width');
  submitBtn.textContent = 'Publicar Reporte';

  form.appendChild(groupType);
  form.appendChild(groupSeverity);
  form.appendChild(groupLocality);
  form.appendChild(groupLocation);
  form.appendChild(descBox);
  form.appendChild(submitBtn);

  modalBody.appendChild(form);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  modal.classList.remove('hidden');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      id: Date.now(),
      type: selectType.value,
      severity: selectSeverity.value,
      status: 'Activo',
      location: inputLocation.value,
      locality: selectLocality.value,
      time: 'Hace un momento',
      description: textareaDesc.value,
      reportsCount: 1
    };

    if (onReportSubmit) {
      onReportSubmit(formData);
    }

    modal.classList.add('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// ==========================================
// PUNTO DE ENTRADA PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMap();
  renderReports(mockReports);

  // Vincular apertura del modal de creación
  const openModalBtn = document.getElementById('btn-open-modal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      openCreateReportModal((newReport) => {
        mockReports.unshift(newReport); // Añadir al inicio de los reportes
        filterReports();               // Aplicar filtros actuales a la nueva lista
      });
    });
  }

  // Vincular eventos de cambio en los selects de filtrado
  const filterLocality = document.getElementById('filter-locality');
  const filterType = document.getElementById('filter-type');

  if (filterLocality) {
    filterLocality.addEventListener('change', filterReports);
  }

  if (filterType) {
    filterType.addEventListener('change', filterReports);
  }
});