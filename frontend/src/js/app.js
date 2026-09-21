// Inicialización y dependencias
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

// ==========================================
// FUNCIÓN PARA ABRIR EL MODAL (Tarjeta Ampliada)
// ==========================================
function openReportModal(report) {
  const modal = document.getElementById('modal');
  
  if (!modal) {
    console.error("No se encontró un elemento con id='modal' en tu HTML.");
    return;
  }

  // Limpiar contenido previo del modal de forma segura
  modal.innerHTML = '';

  const emoji = getIncidentEmoji(report.type);
  const statusClass = getStatusClass(report.status || 'Activo');
  const severityClass = getSeverityClass(report.severity);

  // 1. Contenedor principal del modal
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // 2. Cabecera del Modal
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

  // 3. Cuerpo del Modal
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  // Fila Estado
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

  // Fila Gravedad
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

  // Fila Ubicación
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

  // Fila Fecha y Hora
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

  // Caja de Descripción
  const descBox = document.createElement('div');
  descBox.classList.add('modal-description-box');
  const descTitle = document.createElement('h4');
  descTitle.textContent = 'Descripción del incidente:';
  const descText = document.createElement('p');
  descText.id = 'modal-description';
  descText.textContent = report.description || 'Sin descripción detallada proporcionada para este reporte.';
  descBox.appendChild(descTitle);
  descBox.appendChild(descText);

  // Información inferior
  const footerInfo = document.createElement('div');
  footerInfo.classList.add('modal-footer-info');
  const footerSpan = document.createElement('span');
  const footerStrong = document.createElement('strong');
  footerStrong.textContent = `${report.reportsCount || 1} usuarios`;
  footerSpan.textContent = '👥 Reportado por ';
  footerSpan.appendChild(footerStrong);
  footerSpan.append(' con situaciones similares');
  footerInfo.appendChild(footerSpan);

  // Ensamblar el cuerpo
  modalBody.appendChild(rowStatus);
  modalBody.appendChild(rowSeverity);
  modalBody.appendChild(rowLocation);
  modalBody.appendChild(rowTime);
  modalBody.appendChild(descBox);
  modalBody.appendChild(footerInfo);

  // Ensamblar contenedor principal y añadir al modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  // Mostrar modal usando la clase del CSS
  modal.classList.remove('hidden');

  // Evento para cerrar con la "X"
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Evento para cerrar haciendo clic fuera del contenido del modal
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

    // Creamos la tarjeta con createElement
    const cardElement = document.createElement('div');
    cardElement.classList.add('report-card');
    
    // Contenedor del icono
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('report-icon-container');
    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('report-emoji');
    emojiSpan.textContent = emoji;
    iconContainer.appendChild(emojiSpan);

    // Detalles de la tarjeta
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('report-details');

    // Fila de título y severidad
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

    // Ubicación
    const locationP = document.createElement('p');
    locationP.classList.add('report-location');
    locationP.textContent = `📍 ${report.location} `;
    
    const localitySpan = document.createElement('span');
    localitySpan.classList.add('report-locality');
    localitySpan.textContent = `(${report.locality})`;
    locationP.appendChild(localitySpan);

    // Información inferior (Hora y conteo)
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

    // Ensamblar los detalles
    detailsContainer.appendChild(titleRow);
    detailsContainer.appendChild(locationP);
    detailsContainer.appendChild(footerInfo);

    // Ensamblar tarjeta completa
    cardElement.appendChild(iconContainer);
    cardElement.appendChild(detailsContainer);

    // AL HACER CLIC: SE ABRE EL MODAL DE ESTA TARJETA
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
  }
];

// ==========================================
// PUNTO DE ENTRADA PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMap();
  renderReports(mockReports);
});