# HU-08: Estructura base del frontend y navegación

## Descripción

Como desarrollador frontend,
Quiero establecer la arquitectura base de la aplicación (HTML5, CSS3, JS ES6+, routing, componentes compartidos),
Para tener una base sólida y mantenible sobre la que construir las funcionalidades de mapa y reportes.

---

## Criterios de Aceptación

- [ ] **Escenario:** Aplicación carga sin errores

- [ ] **Dado que** el usuario abre index.html en navegador
- [ ] **Cuando** carga la página
- [ ] **Entonces** no hay errores en consola, se muestra la vista principal (Mapa), Leaflet.css/js cargados, estilos base aplicados.

---

- [ ] **Escenario:** Navegación entre dos vistas principales (SPA)

- [ ] **Dado que** el usuario está en la aplicación
- [ ] **Cuando** hace clic en tab "Mapa" o "Reportes" (o navega por hash/history)
- [ ] **Entonces** cambia la vista sin recarga completa, URL refleja la vista actual (#/mapa, #/reportes), estado activo en navegación visible.

---

- [ ] **Escenario:** Layout responsive mobile-first

- [ ] **Dado que** el usuario accede desde cualquier dispositivo
- [ ] **Cuando** visualiza la app
- [ ] **Entonces** layout usa CSS Grid/Flexbox, breakpoints: móvil (< 640px), tablet (640-1024px), desktop (> 1024px), navbar colapsable en móvil, mapa/lista ocupan 100% viewport.

---

- [ ] **Escenario:** Tema visual consistente

- [ ] **Dado que** el usuario navega por la app
- [ ] **Cuando** ve cualquier componente
- [ ] **Entonces** usa design system base: paleta colores (primario azul TransMilenio #0033A0, éxito verde, advertencia amarillo, peligro rojo), tipografía system-ui, espaciado 8px base, border-radius 8px, sombras suaves.

---

- [ ] **Escenario:** Manejo de estado global simple

- [ ] **Dado que** las vistas necesitan compartir datos (incidentes, loading, error)
- [ ] **Cuando** se actualiza un incidente (nuevo reporte)
- [ ] **Entonces** ambas vistas (Mapa y Reportes) se actualizan reactivamente sin recarga manual (event bus simple o estado compartido).

---

## Sub-Issues

### Frontend

- [ ] Estructura de carpetas: `src/` (index.html, main.js, styles.css), `src/js/` (app.js, router.js, state.js, components/), `src/css/` (variables.css, base.css, components.css, map.css, reports.css), `src/assets/`.
- [ ] Configurar build/dev server: Vite (recomendado) o live-server para desarrollo, build optimizado para producción.
- [ ] Implementar router SPA simple (hash-based): `router.js` maneja rutas `/mapa`, `/reportes`, renderiza vista correspondiente en `<main id="app">`.
- [ ] Crear componente `Navbar`: logo "Muévete CB", tabs Mapa/Reportes con estado activo, responsive (hamburger en móvil).
- [ ] Crear `state.js`: store reactiva simple (Proxy/EventTarget) con: incidents[], loading, error, selectedIncident, filters; métodos: fetchIncidents(), addIncident(), updateIncident().
- [ ] Crear `components/IncidentCard.js`: tarjeta reutilizable para lista (HU-04) y popup (HU-02).
- [ ] Crear `components/IncidentDetailModal.js`: modal/panel detalle reutilizable (HU-02, HU-04).
- [ ] Crear `components/Toast.js`: notificaciones toast (éxito, error, info).
- [ ] Estilos base: `variables.css` (colores, spacing, typography, breakpoints, z-index), `base.css` (reset, layout grid), `components.css` (btn, input, select, badge, card, modal, toast).
- [ ] Favicon, meta tags (viewport, theme-color, description), PWA manifest básico (opcional).

### Architecture

- [ ] Definir convenciones: naming (kebab-case archivos, PascalCase componentes), ES modules, sin frameworks (vanilla JS), patrón component-based.
- [ ] Documentar arquitectura frontend en `docs/frontend-architecture.md`.

### QA

- [ ] Verificar carga sin errores en Chrome, Firefox, Safari, Edge.
- [ ] Probar navegación SPA: tabs, botón atrás del navegador, refresh en sub-ruta.
- [ ] Responsive testing: 375px, 768px, 1440px (Chrome DevTools).
- [ ] Verificar tema: colores, tipografía, espaciado consistentes.
- [ ] Probar estado compartido: crear reporte en /reportes -> aparece en /mapa sin refresh.
- [ ] Lighthouse: Performance > 90, Accessibility > 90, Best Practices > 90.