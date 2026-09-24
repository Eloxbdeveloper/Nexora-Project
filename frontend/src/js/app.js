// ==========================================
// INICIALIZACIÓN Y DEPENDENCIAS
// ==========================================
import './components/Header.js';
import { initTabs } from './components/Tabs.js';
import './components/Modal.js'; 
import { initMap } from './map/map.js';

// Importar las 3 bases de datos de escenarios
import { mockReportsHourPeak } from './reports/list.js'; // O ajusta la ruta si las tienes en otro archivo
import { mockReportsRain } from './reports/list.js';
import { mockReportsClearDay } from './reports/list.js';

// NOTA: Si las tienes exportadas en un mismo archivo, impórtalas así:
// import { mockReportsHourPeak, mockReportsRain, mockReportsClearDay } from './reports/list.js';

// Coordenadas centrales de Bogotá y zoom general
const BOGOTA_LAT = 4.6097;
const BOGOTA_LNG = -74.0817;
const INITIAL_ZOOM = 11;

let mapInstance = null;
let markersLayer = null; // Capa para agrupar y limpiar marcadores fácilmente

// Estado global para la base de datos activa (Por defecto: Hora Pico)
let currentReports = mockReportsHourPeak;

const mapContainer = document.querySelector('.map_render');

if (mapContainer) {
  const map = L.map(mapContainer).setView([BOGOTA_LAT, BOGOTA_LNG], INITIAL_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  mapInstance = map;
  window.appMap = map;
}

initTabs();

// ==========================================
// FUNCIONES AUXILIARES Y COLORES POR LOCALIDAD
// ==========================================
const localityColors = {
  'usaquén': '#e11d48',        // Rojo intenso
  'chapinero': '#7c3aed',       // Morado oscuro
  'santa fe': '#c702ba',        // Azul cobalto
  'san cristóbal': '#208c5dca', // Verde esmeralda oscuro
  'usme': '#d97706',            // Ámbar / Naranja oscuro
  'tunjuelito': '#d975a2',      // Rosa oscuro / Magenta
  'bosa': '#4f46e5',            // Índigo fuerte
  'kennedy': '#16a34a',         // Verde brillante
  'fontibón': '#9e86dc',        // Cian oscuro
  'engativá': '#9333ea',        // Púrpura vivo
  'suba': '#ea580c',            // Naranja rojizo
  'barrios unidos': '#2563eb',  // Azul rey
  'teusaquillo': '#65a30d',     // Verde oliva / Lima oscuro
  'los mártires': '#c026d3',    // Fucsia intenso
  'antonio nariño': '#b0b60c',  // Turquesa oscuro / Teal
  'puente aranda': '#eac26b',   // Dorado / Amarillo oscuro
  'la candelaria': '#410e0e',   // Gris pizarra oscuro
  'rafael uribe uribe': '#eab308', // Amarillo fuerte
  'ciudad bolívar': '#f300a6',  // Azul claro brillante
  'sumapaz': '#111827'          // Negro / Gris casi negro
};

function getLocalityColor(localityName) {
  const key = normalizeStr(localityName);
  return localityColors[key] || '#64748b';
}

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
  return emojis[type ? type.toLowerCase() : ''] || '📌';
}

function formatSeverity(severity) {
  const levels = {
    'alta': { class: 'high', text: 'Alta', color: '#ef4444' },
    'media': { class: 'medium', text: 'Media', color: '#f59e0b' },
    'baja': { class: 'low', text: 'Baja', color: '#13cf2c' }
  };
  const key = (severity || 'media').toLowerCase();
  return levels[key] || { class: 'medium', text: severity, color: '#f59e0b' };
}

function getStatusClass(status) {
  const statuses = {
    'activo': 'status-active',
    'en revisión': 'status-review',
    'solucionado': 'status-resolved'
  };
  return statuses[(status || 'activo').toLowerCase()] || 'status-active';
}

function getSeverityClass(severity) {
  const levels = {
    'alta': 'severity-high',
    'media': 'severity-medium',
    'baja': 'severity-low'
  };
  const key = (severity || 'media').toLowerCase();
  return levels[key] || 'severity-medium';
}

function normalizeStr(str) {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const localityCoords = {
  'usaquén': [4.7047, -74.0305],
  'chapinero': [4.6583, -74.0557],
  'santa fe': [4.6017, -74.0662],
  'san cristóbal': [4.5636, -74.0858],
  'usme': [4.4983, -74.1130],
  'tunjuelito': [4.5803, -74.1373],
  'bosa': [4.6110, -74.1925],
  'kennedy': [4.6281, -74.1508],
  'fontibón': [4.6740, -74.1448],
  'engativá': [4.7170, -74.1147],
  'suba': [4.7470, -74.0898],
  'barrios unidos': [4.6750, -74.0688],
  'teusaquillo': [4.6400, -74.0890],
  'los mártires': [4.6040, -74.0870],
  'antonio nariño': [4.5850, -74.1030],
  'puente aranda': [4.6190, -74.1170],
  'la candelaria': [4.5960, -74.0750],
  'rafael uribe uribe': [4.5710, -74.1140],
  'ciudad bolívar': [4.5580, -74.1670],
  'sumapaz': [4.2380, -74.2830]
};

function getFallbackCoordinates(report) {
  const localityName = typeof report.location === 'object' ? report.location.locality : report.locality;
  const key = normalizeStr(localityName);
  if (localityCoords[key]) {
    const [lat, lng] = localityCoords[key];
    const offsetLat = (Math.random() - 0.5) * 0.003;
    const offsetLng = (Math.random() - 0.5) * 0.003;
    return [lat + offsetLat, lng + offsetLng];
  }
  return [BOGOTA_LAT, BOGOTA_LNG];
}

// ==========================================
// CONVERTIDOR DE NOMENCLATURA DE BOGOTÁ A LAT/LNG
// ==========================================
function getCoordinatesFromBogotaAddress(via, num1, num2, locality) {
  const baseCoords = localityCoords[normalizeStr(locality)] || [BOGOTA_LAT, BOGOTA_LNG];
  let [lat, lng] = baseCoords;

  const n1 = parseFloat(num1) || 0;
  const n2 = parseFloat(num2) || 0;

  if (via === 'Cra' || via === 'Av') {
    lng = -74.05 - (n1 * 0.0012); 
    lat = baseCoords[0] + ((n2 - 50) * 0.0008);
  } else {
    lat = 4.58 + (n1 * 0.0011);
    lng = -74.05 - (n2 * 0.0010);
  }

  return [lat, lng];
}

// ==========================================
// RENDERIZAR MARCADORES EN EL MAPA
// ==========================================
function renderMapMarkers(reports) {
  if (!markersLayer) return;

  markersLayer.clearLayers();

  reports.forEach(report => {
    let coords = null;

    if (report.location?.coordinates?.lat != null && report.location?.coordinates?.lng != null) {
      coords = [report.location.coordinates.lat, report.location.coordinates.lng];
    } else if (report.lat != null && report.lng != null) {
      coords = [report.lat, report.lng];
    } else {
      coords = getFallbackCoordinates(report);
    }

    const addressText = typeof report.location === 'object' ? report.location.address : report.location;
    const localityText = typeof report.location === 'object' ? report.location.locality : report.locality;

    const emoji = getIncidentEmoji(report.type);
    const localityColor = getLocalityColor(localityText);

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: ${localityColor}; border: 2px solid #ffffff; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 3px 6px rgba(0,0,0,0.35);">${emoji}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(coords, { icon: customIcon });

    const popupContent = `
      <div style="font-family: sans-serif; min-width: 160px;">
        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${emoji} ${report.type}</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">📍 ${addressText}</p>
        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; color: ${localityColor};">Localidad: ${localityText}</p>
        <button id="popup-detail-${report.id}" style="background: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%;">Ver detalles</button>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('popupopen', () => {
      const btnDetail = document.getElementById(`popup-detail-${report.id}`);
      if (btnDetail) {
        btnDetail.addEventListener('click', () => {
          openReportModal(report);
        });
      }
    });

    markersLayer.addLayer(marker);
  });
}

// ==========================================
// FUNCIÓN PARA ABRIR EL MODAL (Tarjeta Ampliada)
// ==========================================
function openReportModal(report) {
  const modal = document.getElementById('modal');
  if (!modal) return;

  modal.innerHTML = '';

  const addressText = typeof report.location === 'object' ? report.location.address : report.location;
  const localityText = typeof report.location === 'object' ? report.location.locality : report.locality;

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
  valLocation.textContent = `${addressText} (${localityText})`;
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

  modalBody.appendChild(rowStatus);
  modalBody.appendChild(rowSeverity);
  modalBody.appendChild(rowLocation);
  modalBody.appendChild(rowTime);
  modalBody.appendChild(descBox);

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
// RENDERIZAR LISTA DE REPORTES Y MAPA
// ==========================================
export function renderReports(reports) {
  const container = document.querySelector('.reports-list-container');
  
  renderMapMarkers(reports);

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
    const addressText = typeof report.location === 'object' ? report.location.address : report.location;
    const localityText = typeof report.location === 'object' ? report.location.locality : report.locality;

    const emoji = getIncidentEmoji(report.type);
    const severityInfo = formatSeverity(report.severity);
    const localityColor = getLocalityColor(localityText);

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
    locationP.textContent = `📍 ${addressText} `;
    
    const localitySpan = document.createElement('span');
    localitySpan.classList.add('report-locality');
    localitySpan.style.color = localityColor;
    localitySpan.style.fontWeight = 'bold';
    localitySpan.textContent = `(${localityText})`;
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
// LÓGICA DE FILTRADO UNIFICADA
// ==========================================
function applyFilters(localityVal, typeVal) {
  const filteredReports = currentReports.filter(report => {
    const reportLocality = typeof report.location === 'object' ? report.location.locality : report.locality;
    
    const matchesLocality = !localityVal || normalizeStr(reportLocality) === normalizeStr(localityVal);
    const matchesType = !typeVal || normalizeStr(report.type) === normalizeStr(typeVal);
    
    return matchesLocality && matchesType;
  });

  renderReports(filteredReports);
}

// ==========================================
// MODAL DE CREACIÓN DE REPORTE
// ==========================================
function openCreateReportModal(onReportSubmit) {
  const modal = document.getElementById('modal');
  if (!modal) return;

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
  modalTypeH2.textContent = 'Crear Nuevo Reporte';

  modalTitleWrapper.appendChild(modalEmojiSpan);
  modalTitleWrapper.appendChild(modalTypeH2);

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = '&times;';

  modalHeader.appendChild(modalTitleWrapper);
  modalHeader.appendChild(closeBtn);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '0.85rem';

  // Tipo
  const groupType = document.createElement('div');
  groupType.classList.add('modal-info-row');
  const labelType = document.createElement('span');
  labelType.classList.add('modal-label');
  labelType.textContent = 'Tipo:';
  const selectType = document.createElement('select');
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

  // Gravedad
  const groupSeverity = document.createElement('div');
  groupSeverity.classList.add('modal-info-row');
  const labelSeverity = document.createElement('span');
  labelSeverity.classList.add('modal-label');
  labelSeverity.textContent = 'Gravedad:';
  const selectSeverity = document.createElement('select');
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

  // Localidad
  const groupLocality = document.createElement('div');
  groupLocality.classList.add('modal-info-row');
  const labelLocality = document.createElement('span');
  labelLocality.classList.add('modal-label');
  labelLocality.textContent = 'Localidad:';
  const selectLocality = document.createElement('select');
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

  // Dirección estructurada
  const groupLocation = document.createElement('div');
  groupLocation.style.display = 'flex';
  groupLocation.style.flexDirection = 'column';
  groupLocation.style.gap = '0.4rem';

  const labelLocation = document.createElement('span');
  labelLocation.classList.add('modal-label');
  labelLocation.textContent = 'Dirección estructurada (Nomenclatura Bogotá):';
  groupLocation.appendChild(labelLocation);

  const addressGrid = document.createElement('div');
  addressGrid.style.display = 'grid';
  addressGrid.style.gridTemplateColumns = '2fr 2fr 1fr 2fr 1fr';
  addressGrid.style.gap = '0.4rem';
  addressGrid.style.alignItems = 'center';

  const selectVia = document.createElement('select');
  selectVia.classList.add('report-select');
  const vias = [
    { value: 'Cl', text: 'Calle (Cl)' },
    { value: 'Cra', text: 'Carrera (Cra)' },
    { value: 'Av', text: 'Avenida (Av)' },
    { value: 'Dg', text: 'Diagonal (Dg)' },
    { value: 'Tv', text: 'Transversal (Tv)' }
  ];
  vias.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.value;
    opt.textContent = v.text;
    selectVia.appendChild(opt);
  });

  const inputNum1 = document.createElement('input');
  inputNum1.type = 'number';
  inputNum1.placeholder = 'Número';
  inputNum1.classList.add('report-select');
  inputNum1.required = true;

  const spanHash = document.createElement('span');
  spanHash.textContent = '#';
  spanHash.style.textAlign = 'center';
  spanHash.style.fontWeight = 'bold';
  spanHash.style.color = '#555';

  const inputNum2 = document.createElement('input');
  inputNum2.type = 'number';
  inputNum2.placeholder = 'Cruce';
  inputNum2.classList.add('report-select');
  inputNum2.required = true;

  const inputPlaca = document.createElement('input');
  inputPlaca.type = 'number';
  inputPlaca.placeholder = 'Placa';
  inputPlaca.classList.add('report-select');
  inputPlaca.required = true;

  addressGrid.appendChild(selectVia);
  addressGrid.appendChild(inputNum1);
  addressGrid.appendChild(spanHash);
  addressGrid.appendChild(inputNum2);
  addressGrid.appendChild(inputPlaca);
  groupLocation.appendChild(addressGrid);

  // Descripción
  const descBox = document.createElement('div');
  descBox.classList.add('modal-description-box');
  const descTitle = document.createElement('h4');
  descTitle.textContent = 'Descripción del incidente:';
  const textareaDesc = document.createElement('textarea');
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
    const formattedAddress = `${selectVia.value} ${inputNum1.value} # ${inputNum2.value} - ${inputPlaca.value}, Bogotá`;
    
    // Cálculo de coordenadas mediante la retícula vial de Bogotá
    const calculatedCoords = getCoordinatesFromBogotaAddress(
      selectVia.value, 
      inputNum1.value, 
      inputNum2.value, 
      selectLocality.value
    );
    
    const newReport = {
      id: Date.now(),
      type: selectType.value,
      severity: selectSeverity.value,
      status: 'Activo',
      location: {
        address: formattedAddress,
        coordinates: {
          lat: calculatedCoords[0],
          lng: calculatedCoords[1]
        },
        locality: selectLocality.value
      },
      time: 'Hace un momento',
      description: textareaDesc.value,
      reportsCount: 1
    };

    if (onReportSubmit) {
      onReportSubmit(newReport);
    }

    modal.classList.add('hidden');
  });

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

// ==========================================
// PUNTO DE ENTRADA PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMap();
  
  // Renderizado inicial con la base de datos por defecto (Hora Pico)
  renderReports(currentReports);

  const openModalBtn = document.getElementById('btn-open-modal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      openCreateReportModal((newReport) => {
        currentReports.unshift(newReport);
        
        const activeLocality = document.getElementById('filter-locality')?.value || document.getElementById('map-filter-locality')?.value || '';
        const activeType = document.getElementById('filter-type')?.value || document.getElementById('map-filter-type')?.value || '';
        applyFilters(activeLocality, activeType);
      });
    });
  }

  // ==========================================
  // SELECTOR DE ESCENARIOS (Sincronizado Map & Reports)
  // ==========================================
  const scenarioSelectIds = ['scenario-select', 'reports-scenario-select', 'map-scenario-select'];

  scenarioSelectIds.forEach(id => {
    const scenarioSelect = document.getElementById(id);
    
    if (scenarioSelect) {
      scenarioSelect.addEventListener('change', (e) => {
        const scenario = e.target.value;

        // Sincronizar el valor visual en todos los selectores de escenario existentes
        scenarioSelectIds.forEach(otherId => {
          const el = document.getElementById(otherId);
          if (el) el.value = scenario;
        });

        if (scenario === 'rain' || scenario === 'lluvia') {
          currentReports = mockReportsRain;
        } else if (scenario === 'clear' || scenario === 'despejado') {
          currentReports = mockReportsClearDay;
        } else {
          currentReports = mockReportsHourPeak;
        }

        // Limpiar todos los filtros de localidad y tipo al cambiar de escenario
        ['filter-locality', 'map-filter-locality', 'filter-type', 'map-filter-type'].forEach(filterId => {
          const el = document.getElementById(filterId);
          if (el) el.value = '';
        });

        renderReports(currentReports);
      });
    }
  });

  const filterLocality = document.getElementById('filter-locality');
  const filterType = document.getElementById('filter-type');
  const mapFilterLocality = document.getElementById('map-filter-locality');
  const mapFilterType = document.getElementById('map-filter-type');

  if (filterLocality) {
    filterLocality.addEventListener('change', (e) => {
      const val = e.target.value;
      if (mapFilterLocality) mapFilterLocality.value = val;
      applyFilters(val, filterType ? filterType.value : (mapFilterType ? mapFilterType.value : ''));
    });
  }

  if (filterType) {
    filterType.addEventListener('change', (e) => {
      const val = e.target.value;
      if (mapFilterType) mapFilterType.value = val;
      applyFilters(filterLocality ? filterLocality.value : (mapFilterLocality ? mapFilterLocality.value : ''), val);
    });
  }

  if (mapFilterLocality) {
    mapFilterLocality.addEventListener('change', (e) => {
      const val = e.target.value;
      if (filterLocality) filterLocality.value = val;
      applyFilters(val, mapFilterType ? mapFilterType.value : (filterType ? filterType.value : ''));
    });
  }

  if (mapFilterType) {
    mapFilterType.addEventListener('change', (e) => {
      const val = e.target.value;
      if (filterType) filterType.value = val;
      applyFilters(mapFilterLocality ? mapFilterLocality.value : (filterLocality ? filterLocality.value : ''), val);
    });
  }
});