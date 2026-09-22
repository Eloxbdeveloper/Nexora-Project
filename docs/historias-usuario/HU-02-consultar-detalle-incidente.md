# HU-02: Consultar detalle de un incidente

## Descripción

Como ciudadano,
Quiero consultar la información detallada de un incidente al seleccionar su marcador en el mapa,
Para conocer la descripción, gravedad, estado y cuántos usuarios lo han reportado.

---

## Criterios de Aceptación

- [ ] **Escenario:** Apertura de popup/detalle al hacer clic en marcador

- [ ] **Dado que** el usuario visualiza el mapa con marcadores de incidentes
- [ ] **Cuando** hace clic en un marcador
- [ ] **Entonces** se muestra un popup o panel lateral con: tipo de incidente, ubicación (dirección/zona), descripción completa, fecha y hora del reporte, estado (activo/solucionado/en revisión), nivel de gravedad (baja/media/alta), cantidad de reportes asociados.

---

- [ ] **Escenario:** Cierre del detalle

- [ ] **Dado que** el usuario está viendo el detalle de un incidente
- [ ] **Cuando** hace clic en cerrar, fuera del popup o en otro marcador
- [ ] **Entonces** el detalle se cierra y el mapa vuelve a su estado normal.

---

- [ ] **Escenario:** Visualización de gravedad con código de color

- [ ] **Dado que** el usuario consulta el detalle de un incidente
- [ ] **Cuando** ve el nivel de gravedad
- [ ] **Entonces** la gravedad se muestra con código de color: Alta (rojo), Media (amarillo/naranja), Baja (verde).

---

- [ ] **Escenario:** Visualización de estado con badge

- [ ] **Dado que** el usuario consulta el detalle de un incidente
- [ ] **Cuando** ve el estado
- [ ] **Entonces** el estado se muestra con badge: Activo (rojo/pulsante), En revisión (azul), Solucionado (verde).

---

## Sub-Issues

### Frontend

- [ ] Implementar popup de Leaflet o panel lateral para detalle de incidente.
- [ ] Mapear campos de respuesta API a vista: tipo, ubicación, descripción, fecha, estado, gravedad, reportes_count.
- [ ] Aplicar estilos de código de color para gravedad (rojo/amarillo/verde).
- [ ] Aplicar estilos de badge para estado (activo/en revisión/solucionado).
- [ ] Formatear fecha/hora en formato legible (DD/MM/YYYY HH:mm).
- [ ] Manejar clic fuera para cerrar popup.
- [ ] Accesibilidad: foco en popup, navegable por teclado, aria-labels.

### Backend

- [ ] Implementar endpoint `GET /api/incidents/:id` que retorne detalle completo de un incidente.
- [ ] Incluir en respuesta: ubicación formateada (dirección si disponible), timestamps ISO 8601.

### Database

- [ ] Verificar que colección `incidents` tiene todos los campos requeridos para el detalle.
- [ ] Validar datos de demostración tienen descripciones completas y variadas.

### QA

- [ ] Verificar popup muestra todos los campos correctamente.
- [ ] Probar códigos de color gravedad (3 niveles).
- [ ] Probar badges de estado (3 estados).
- [ ] Verificar cierre de popup (clic fuera, tecla ESC, botón cerrar).
- [ ] Validar formato de fecha localizada (es-CO).
- [ ] Probar accesibilidad: navegación teclado, screen reader.