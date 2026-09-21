// TODO: Inicialización, routing tabs Mapa/Reportes
import './components/Header.js';
import './components/Tabs.js';
import './components/Modal.js';
import { initMap } from './map/map.js';
import { initReports } from './reports/list.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initReports();
});