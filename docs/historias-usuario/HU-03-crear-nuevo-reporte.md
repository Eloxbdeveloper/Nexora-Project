# HU-03: Crear nuevo reporte de incidente

## Descripción

Como ciudadano,
Quiero crear un nuevo reporte de incidente de movilidad seleccionando la ubicación en el mapa,
Para alertar a otros usuarios sobre una situación que afecta la movilidad en mi zona.

---

## Criterios de Aceptación

- [ ] **Escenario:** Acceso al formulario de creación de reporte

- [ ] **Dado que** el usuario está en la aplicación
- [ ] **Cuando** hace clic en "Nuevo reporte" o botón flotante (+)
- [ ] **Entonces** se muestra un formulario modal o vista dedicada con: selector de tipo de incidente (dropdown con 9 opciones), campo de descripción (textarea obligatorio), selector de gravedad (baja/media/alta), mapa interactivo para seleccionar ubicación, botón "Enviar reporte".

---

- [ ] **Escenario:** Selección de ubicación en el mapa

- [ ] **Dado que** el usuario está en el formulario de nuevo reporte
- [ ] **Cuando** hace clic en el mapa para elegir ubicación
- [ ] **Entonces** se coloca un marcador temporal en el punto seleccionado, se muestran las coordenadas (lat, lng) y se habilita el botón de envío. Opcionalmente: botón "Usar mi ubicación actual" que usa Geolocation API del navegador.

---

- [ ] **Escenario:** Envío exitoso de reporte

- [ ] **Dado que** el usuario completó todos los campos obligatorios (tipo, descripción, gravedad, ubicación)
- [ ] **Cuando** hace clic en "Enviar reporte"
- [ ] **Entonces** el sistema envía POST a `/api/reports`, muestra mensaje de éxito ("Reporte enviado correctamente"), cierra el formulario y actualiza el mapa mostrando el nuevo incidente (o incrementa contador si ya existe incidente cercano).

---

- [ ] **Escenario:** Validación de campos obligatorios

- [ ] **Dado que** el usuario intenta enviar el formulario incompleto
- [ ] **Cuando** hace clic en "Enviar reporte" sin completar campos requeridos
- [ ] **Entonces** se muestran mensajes de error inline: "Tipo es requerido", "Descripción es requerida (mín 10 caracteres)", "Gravedad es requerida", "Ubicación es requerida".

---

- [ ] **Escenario:** Manejo de error de red

- [ ] **Dado que** el usuario envía un reporte válido
- [ ] **Cuando** la API responde error (500, timeout, sin conexión)
- [ ] **Entonces** se muestra mensaje de error amigable ("No se pudo enviar el reporte. Intente nuevamente") y el formulario permanece abierto con los datos ingresados.

---

## Sub-Issues

### Frontend

- [ ] Crear vista/página "Reportes" con lista y botón "Nuevo reporte".
- [ ] Diseñar formulario modal o página dedicada: dropdown tipo (9 opciones), textarea descripción, radio/select gravedad (3 opciones), mapa Leaflet para selección de punto.
- [ ] Implementar selección de ubicación: clic en mapa -> marcador temporal + coordenadas.
- [ ] Implementar botón "Usar mi ubicación actual" (Geolocation API) con fallback manual.
- [ ] Validación cliente: tipo requerido, descripción min 10 chars, gravedad requerida, ubicación requerida.
- [ ] Consumir `POST /api/reports` con Fetch API, manejar loading, éxito, error.
- [ ] Feedback visual: toast/snackbar éxito/error, spinner en botón enviando.
- [ ] Al éxito: cerrar formulario, navegar a mapa o lista, disparar actualización de datos.
- [ ] Responsive: formulario usable en móvil (mapa a pantalla completa opcional).

### Backend

- [ ] Implementar endpoint `POST /api/reports` que reciba: user_id (simulado), tipo, descripcion, gravedad, ubicacion (GeoJSON Point), fecha_hora (server-side).
- [ ] Validación servidor: campos requeridos, enum tipo, enum gravedad, punto GeoJSON válido.
- [ ] Lógica de negocio: al crear reporte, buscar incidente existente en radio cercano (ej. 100m) -> si existe, incrementar `cantidad_reportes` y actualizar gravedad/estado si aplica; si no existe, crear nuevo incidente en colección `incidents` con reporte_count=1.
- [ ] Retornar reporte creado con ID y incidente asociado.

### Database

- [ ] Crear colección `reports` con campos: user_id, tipo, descripcion, gravedad, ubicacion (GeoJSON Point), fecha_hora, incidente_id (ref), estado_reporte (pendiente/validado), created_at.
- [ ] Crear colección `incidents` (ver HU-01) con lógica de agregación de reportes.
- [ ] Índice geoespacial 2dsphere en `reports.ubicacion` y `incidents.ubicacion`.
- [ ] Índice compuesto en `reports.incidente_id` para consultas rápidas.

### QA

- [ ] Probar formulario completo: todos los campos, validaciones, envío exitoso.
- [ ] Probar selección de ubicación: clic mapa, geolocalización (permitir/denegar).
- [ ] Probar validaciones: campos vacíos, descripción < 10 chars, tipos inválidos.
- [ ] Probar error de red: mock API 500, timeout, offline.
- [ ] Verificar que nuevo reporte aparece en mapa y lista (actualización UI).
- [ ] Probar lógica de agrupación: 2 reportes cercanos -> 1 incidente con count=2.
- [ ] Accesibilidad: labels, foco, contraste, navegación teclado.