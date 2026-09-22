# HU-06: API REST para gestión de reportes ciudadanos

## Descripción

Como desarrollador backend,
Quiero implementar una API REST para recibir y consultar reportes de ciudadanos,
Para almacenar cada aporte individual y vincularlo a incidentes geográficos.

---

## Criterios de Aceptación

- [ ] **Escenario:** Crear reporte desde frontend

- [ ] **Dado que** el cliente hace POST a `/api/reports` con body: `{ user_id, tipo, descripcion, gravedad, ubicacion: { type: "Point", coordinates: [lng, lat] } }`
- [ ] **Cuando** los datos son válidos
- [ ] **Entonces** crea reporte en colección `reports`, busca/vincula incidente cercano (radio 100m, ver HU-05), retorna `{ reporte: Report, incidente: Incident }` con status 201.

---

- [ ] **Escenario:** Listar reportes (admin/debug)

- [ ] **Dado que** el cliente hace GET a `/api/reports`
- [ ] **Cuando** se envían query params opcionales (incidente_id, user_id, page, limit)
- [ ] **Entonces** retorna lista paginada de reportes con status 200.

---

- [ ] **Escenario:** Validación de campos obligatorios

- [ ] **Dado que** el cliente envía POST a `/api/reports` con campos faltantes
- [ ] **Cuando** falta: user_id, tipo, descripcion, gravedad, o ubicacion
- [ ] **Entonces** retorna 400 con detalles de cada campo faltante/inválido.

---

- [ ] **Escenario:** Validación de enums y GeoJSON

- [ ] **Dado que** el cliente envía tipo/gravedad fuera de enum o coordenadas inválidas
- [ ] **Cuando** tipo no en [accidente, bloqueo, congestion, retraso, problema_estacion, daño_infraestructura, obra, suspension_servicio, otro] O gravedad no en [baja, media, alta] O coordinates no [number, number] en rango válido
- [ ] **Entonces** retorna 400 con mensaje específico de validación.

---

- [ ] **Escenario:** Usuario simulado (sin auth real en MVP)

- [ ] **Dado que** el MVP no tiene autenticación real
- [ ] **Cuando** se crea reporte
- [ ] **Entonces** `user_id` se genera como string aleatorio o se toma de header `x-user-id` (default: "anon-{random}"), y se almacena nombre ficticio en campo `usuario_nombre` (ej: "Usuario_123").

---

## Sub-Issues

### Backend

- [ ] Implementar ruta `POST /api/reports` y `GET /api/reports`.
- [ ] Crear controlador `ReportsController`: create, findAll.
- [ ] Crear servicio `ReportsService`: lógica de creación, vinculación a incidente (delegar a IncidentsService), generación de user_id simulado.
- [ ] Crear DTOs: CreateReportDto (validaciones: tipo enum, gravedad enum, descripcion min 10, ubicacion GeoJSON Point), QueryReportsDto.
- [ ] Middleware de validación global para DTOs.
- [ ] Manejo de errores: 400 validación, 500 servidor, 201 creado.

### Database

- [ ] Definir esquema Mongoose `ReportSchema`: user_id (String, required), usuario_nombre (String), tipo (enum, required), descripcion (String, required, min 10), gravedad (enum, required), ubicacion (Point, required), incidente_id (ObjectId, ref: 'Incident', required), estado_reporte (enum: pendiente/validado, default: 'pendiente'), created_at, updated_at.
- [ ] Índice geoespacial 2dsphere en `ubicacion`.
- [ ] Índice en `incidente_id` para consultas rápidas de reportes por incidente.
- [ ] Índice compuesto: `{ user_id: 1, created_at: -1 }`.

### Architecture

- [ ] Módulo `reports` independiente pero colaborador con `incidents` (inyección de dependencias).
- [ ] Evento/hook post-save en Report para notificar a IncidentsService (patrón observer o llamada directa de servicio).
- [ ] Transaccionalidad: crear reporte + actualizar incidente en misma operación (MongoDB transactions si replica set, sino compensación manual).

### QA

- [ ] Probar POST /api/reports: payload válido -> 201, reporte + incidente vinculado.
- [ ] Probar validaciones: cada campo requerido, enums, GeoJSON, descripcion min 10.
- [ ] Probar vinculación: 2 reportes cercanos -> mismo incidente_id, count=2.
- [ ] Probar GET /api/reports con filtros: incidente_id, paginación.
- [ ] Verificar user_id simulado y usuario_nombre en respuesta.
- [ ] Probar concurrencia: 10 reportes simultáneos misma zona -> count correcto.