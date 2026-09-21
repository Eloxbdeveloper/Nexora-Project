
function switchTab(tabId) { }

// src/js/components/Tabs.js

export function initTabs() {
  const btnMap = document.querySelector('.buttons_sections button.map');
  const btnReports = document.querySelector('.buttons_sections button.reports');
  
  const panelMap = document.getElementById('map');
  const panelReports = document.getElementById('reports');

  if (!btnMap || !btnReports || !panelMap || !panelReports) return;

  btnMap.addEventListener('click', () => {
    // Activar botón mapa
    btnMap.classList.add('active-btn');
    btnReports.classList.remove('active-btn');

    // Activar panel mapa
    panelMap.classList.add('active');
    panelReports.classList.remove('active');

    // ¡Vital para Leaflet! Recalcula el tamaño al volver al mapa
    if (window.appMap) {
      window.appMap.invalidateSize();
    }
  });

  btnReports.addEventListener('click', () => {
    // Activar botón reportes
    btnReports.classList.add('active-btn');
    btnMap.classList.remove('active-btn');

    // Activar panel reportes
    panelReports.classList.add('active');
    panelMap.classList.remove('active');
  });
}