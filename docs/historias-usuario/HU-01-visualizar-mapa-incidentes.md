# HU-01: Visualizar mapa de Bogotá con incidentes

## Descripción

Como ciudadano,
Quiero visualizar un mapa de Bogotá con los incidentes de movilidad georreferenciados,
Para identificar rápidamente en qué zonas de la ciudad hay problemas de tránsito.

---

## Criterios de Aceptación

- [ ] **Escenario:** Carga inicial del mapa centrado en Bogotá

- [ ] **Dado que** el usuario accede a la aplicación
- [ ] **Cuando** carga la página principal
- [ ] **Entonces** el mapa muestra Bogotá centrado (coordenadas aprox: 4.7110° N, 74.0721° W) con zoom nivel 11 usando OpenStreetMap como capa base.

---

- [ ] **Escenario:** Visualización de marcadores de incidentes

- [ ] **Dado que** existen incidentes almacenados en la base de datos
- [ ] **Cuando** el mapa se renderiza
- [ ] **Entonces** cada incidente aparece como un marcador en su ubicación geográfica (latitud, longitud) con icono diferenciado según su tipo (accidente, bloqueo, congestión, retraso, problema en estación, daño en infraestructura, obra, suspensión de servicio, otro).

---

- [ ] **Escenario:** Navegación libre por el mapa

- [ ] **Dado que** el usuario está en la vista del mapa
- [ ] **Cuando** hace drag, zoom in/out o usa controles de navegación
- [ ] **Entonces** el mapa permite desplazarse fluidamente por Bogotá y los marcadores se mantienen visibles y clicables.

---

- [ ] **Escenario:** Responsive y mobile-first

- [ ] **Dado que** el usuario accede desde dispositivo móvil o escritorio
- [ ] **Cuando** visualiza el mapa
- [ ] **Entonces** la interfaz se adapta correctamente (mobile-first), el mapa ocupa toda la pantalla disponible y los controles son usables en táctil.

---

## Sub-Issues

### Frontend

- [ ] Configurar Leaflet.js con OpenStreetMap en componente principal.
- [ ] Implementar vista de mapa centrada en Bogotá (coordenadas y zoom inicial).
- [ ] Crear capa de marcadores dinámicos desde datos de API.
- [ ] Definir iconos personalizados por tipo de incidente (9 tipos).
- [ ] Implementar popup básico al hacer clic en marcador (tipo, ubicación, estado, gravedad, reportes).
- [ ] Aplicar estilos responsive/mobile-first al contenedor del mapa.
- [ ] Manejar errores de carga de tiles y marcadores.

### Backend

- [ ] Implementar endpoint `GET /api/incidents` que retorne todos los incidentes con ubicación (lat, lng), tipo, gravedad, estado, cantidad de reportes.
- [ ] Validar respuesta con paginación opcional para rendimiento.

### Database

- [ ] Crear colección `incidents` con campos: ubicación (GeoJSON Point), tipo, gravedad, estado, cantidad_reportes, created_at, updated_at.
- [ ] Crear índice geoespacial 2dsphere en campo ubicación para consultas espaciales futuras.
- [ ] Insertar datos de demostración (mínimo 15-20 incidentes distribuidos por Bogotá con variedad de tipos y gravedades).

### QA

- [ ] Verificar carga correcta del mapa en Chrome, Firefox, Safari.
- [ ] Verificar responsive en móvil (375px), tablet (768px), desktop (1440px).
- [ ] Validar que todos los marcadores de datos demo aparecen correctamente.
- [ ] Probar navegación fluida (drag, zoom, controles).
- [ ] Verificar manejo de errores de red (sin conexión, API caída).