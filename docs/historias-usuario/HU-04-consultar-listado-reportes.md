# HU-04: Consultar listado detallado de incidentes

## Descripción

Como ciudadano,
Quiero consultar un listado organizado con todos los incidentes de movilidad,
Para revisar detalladamente cada situación sin depender solo del mapa.

---

## Criterios de Aceptación

- [ ] **Escenario:** Acceso a la sección de reportes

- [ ] **Dado que** el usuario está en la aplicación
- [ ] **Cuando** navega a la pestaña/ventana "Reportes"
- [ ] **Entonces** se muestra una lista o grid de tarjetas con todos los incidentes, cada tarjeta muestra: tipo (icono + label), ubicación/zona, gravedad (badge color), estado (badge), cantidad de reportes, fecha del último reporte.

---

- [ ] **Escenario:** Ordenamiento por fecha (más reciente primero)

- [ ] **Dado que** el usuario visualiza el listado de incidentes
- [ ] **Cuando** carga la vista
- [ ] **Entonces** los incidentes están ordenados por fecha descendente (más reciente arriba).

---

- [ ] **Escenario:** Filtrado por estado

- [ ] **Dado que** el usuario está en el listado de incidentes
- [ ] **Cuando** selecciona filtro "Estado: Activo" / "En revisión" / "Solucionado" / "Todos"
- [ ] **Entonces** la lista muestra solo incidentes con ese estado.

---

- [ ] **Escenario:** Filtrado por gravedad

- [ ] **Dado que** el usuario está en el listado de incidentes
- [ ] **Cuando** selecciona filtro "Gravedad: Alta" / "Media" / "Baja" / "Todas"
- [ ] **Entonces** la lista muestra solo incidentes con esa gravedad.

---

- [ ] **Escenario:** Búsqueda por texto (ubicación/tipo)

- [ ] **Dado que** el usuario está en el listado de incidentes
- [ ] **Cuando** escribe en el campo de búsqueda
- [ ] **Entonces** la lista filtra en tiempo real por coincidencias en ubicación, tipo o descripción.

---

- [ ] **Escenario:** Navegación al detalle desde lista

- [ ] **Dado que** el usuario ve una tarjeta de incidente en la lista
- [ ] **Cuando** hace clic en "Ver detalle" o en la tarjeta completa
- [ ] **Entonces** se muestra el mismo detalle completo que en el mapa (HU-02): descripción completa, fecha exacta, estado, gravedad, reportes count.

---

- [ ] **Escenario:** Contador total de incidentes

- [ ] **Dado que** el usuario está en el listado
- [ ] **Cuando** visualiza la cabecera
- [ ] **Entonces** se muestra: "X incidentes totales (Y activos, Z solucionados)".

---

## Sub-Issues

### Frontend

- [ ] Crear vista/página "Reportes" con layout: header (título + contador), barra de filtros (estado, gravedad, búsqueda), lista/grid de tarjetas.
- [ ] Implementar tarjeta de incidente: icono tipo, ubicación, badges gravedad/estado, contador reportes, fecha relativa ("hace 2h"), botón/click "Ver detalle".
- [ ] Implementar filtros: dropdown estado (4 opciones), dropdown gravedad (4 opciones), input búsqueda con debounce (300ms).
- [ ] Consumir `GET /api/incidents` con query params: estado, gravedad, search, sort=-fecha, limit/paginación.
- [ ] Manejar estado loading, empty state ("No hay incidentes"), error state.
- [ ] Implementar modal/panel detalle al clic en tarjeta (reutilizar componente HU-02).
- [ ] Responsive: grid 1 col móvil, 2 col tablet, 3-4 col desktop; filtros colapsables en móvil.

### Backend

- [ ] Implementar endpoint `GET /api/incidents` con query params: estado, gravedad, search (texto), sort, page, limit.
- [ ] Búsqueda texto: índice de texto en ubicación, tipo, descripción.
- [ ] Retornar paginado: data[], total, page, totalPages.
- [ ] Incluir en cada incidente: conteo de reportes asociados (lookup o campo denormalizado).

### Database

- [ ] Crear índice de texto en `incidents`: ubicacion_texto, tipo, descripcion.
- [ ] Índices compuestos para filtros frecuentes: {estado: 1, fecha: -1}, {gravedad: 1, fecha: -1}.
- [ ] Verificar campo `cantidad_reportes` se mantiene actualizado (denormalizado) o usar aggregation pipeline.

### QA

- [ ] Verificar listado carga y muestra datos demo correctamente.
- [ ] Probar filtros individuales y combinados (estado + gravedad + búsqueda).
- [ ] Probar ordenamiento por fecha descendente.
- [ ] Probar contador totales/activos/solucionados.
- [ ] Probar navegación a detalle desde tarjeta.
- [ ] Probar empty state y error state.
- [ ] Responsive: móvil (375px), tablet (768px), desktop (1440px).
- [ ] Performance: lista con 50+ incidentes, scroll fluido.
