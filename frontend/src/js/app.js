// TODO: Inicialización, routing tabs Mapa/Reportes
import './components/Header.js';
import {initTabs} from './components/Tabs.js';
import './components/Modal.js';
import { initMap } from './map/map.js';
import { initReports } from './reports/list.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initReports();
});

// app.js

// Coordenadas centrales de Bogotá y zoom general
const BOGOTA_LAT = 4.6097;
const BOGOTA_LNG = -74.0817;
const INITIAL_ZOOM = 11; // <--- Cambiado de 13 a 11 para ver toda la ciudad

const mapContainer = document.querySelector('.map_render');

if (mapContainer) {
  const map = L.map(mapContainer).setView([BOGOTA_LAT, BOGOTA_LNG], INITIAL_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  window.appMap = map;
}

initTabs()

