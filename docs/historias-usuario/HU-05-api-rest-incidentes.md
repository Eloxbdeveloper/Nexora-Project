# HU-05: API REST para gestión de incidentes

## Descripción

Como desarrollador backend,
Quiero implementar una API REST completa para incidentes de movilidad,
Para que el frontend pueda consultar, crear y gestionar incidentes georreferenciados.

---

## Criterios de Aceptación

- [ ] **Escenario:** Listar todos los incidentes con filtros

- [ ] **Dado que** el cliente hace GET a `/api/incidents`
- [ ] **Cuando** se envían query params opcionales (estado, gravedad, search, page, limit, sort)
- [ ] **Entonces** retorna JSON: `{ data: Incident[], total: number, page: number, totalPages: number }` con status 200.

---

- [ ] **Escenario:** Obtener incidente por ID

- [ ] **Dado que** el cliente hace GET a `/api/incidents/:id`
- [ ] **Cuando** el ID existe en base de datos
- [ ] **Entonces** retorna el incidente completo con status 200; si no existe, retorna 404 con `{ error: "Incidente no encontrado" }`.

---

- [ ] **Escenario:** Crear nuevo incidente (interno, desde reporte)

- [ ] **Dado que** el sistema recibe un reporte nuevo (ver HU-03)
- [ ] **Cuando** no existe incidente cercano en radio 100m
- [ ] **Entonces** se crea incidente en colección `incidents` con: ubicacion (GeoJSON Point), tipo, gravedad, estado="activo", cantidad_reportes=1, created_at, updated_at; retorna incidente creado con status 201.

---

- [ ] **Escenario:** Actualizar contador de reportes en incidente existente

- [ ] **Dado que** se recibe un reporte cerca de incidente existente (radio 100m)
- [ ] **Cuando** el sistema detecta la proximidad
- [ ] **Entonces** incrementa `cantidad_reportes`, recalcula gravedad (mayor de los reportes), actualiza `updated_at`, retorna incidente actualizado.

---

- [ ] **Escenario:** Health check

- [ ] **Dado que** el cliente hace GET a `/api/health`
- [ ] **Cuando** el servidor y BD están operativos
- [ ] **Entonces** retorna `{ status: "ok", timestamp: ISO8601, database: "connected" }` con status 200.

---

- [ ] **Escenario:** Validación de entrada y manejo de errores

- [ ] **Dado que** el cliente envía payload inválido
- [ ] **Cuando** falla validación (tipo no en enum, coordenadas inválidas, etc.)
- [ ] **Entonces** retorna 400 con `{ error: "ValidationError", details: [...] }`.

---

## Sub-Issues

### Backend

- [ ] Configurar Express.js con middlewares: cors, helmet, morgan, express.json().
- [ ] Implementar rutas: `GET /api/incidents`, `GET /api/incidents/:id`, `POST /api/incidents` (interno), `GET /api/health`.
- [ ] Crear controlador `IncidentsController` con métodos: findAll, findById, create, updateReportCount.
- [ ] Crear servicio `IncidentsService` con lógica de negocio: búsqueda geoespacial ($near, $maxDistance: 100m), agregación de reportes, recálculo gravedad.
- [ ] Implementar DTOs/validación con class-validator o Joi: CreateIncidentDto, UpdateIncidentDto, QueryIncidentsDto.
- [ ] Manejo global de errores: NotFoundException, ValidationException, InternalServerException.
- [ ] Documentar endpoints con OpenAPI/Swagger (opcional para MVP).
- [ ] Configurar variables de entorno: PORT, MONGODB_URI, NODE_ENV.

### Database

- [ ] Definir esquema Mongoose `IncidentSchema`: ubicacion (Point, required), tipo (enum, required), gravedad (enum, required), estado (enum, default: 'activo'), cantidad_reportes (number, default: 1), descripcion, fecha_primer_reporte, fecha_ultimo_reporte, created_at, updated_at.
- [ ] Índice geoespacial 2dsphere en `ubicacion`.
- [ ] Índice compuesto: `{ estado: 1, fecha_ultimo_reporte: -1 }`, `{ gravedad: 1, fecha_ultimo_reporte: -1 }`.
- [ ] Índice de texto en `tipo`, `descripcion`, `ubicacion_texto`.
- [ ] Middleware pre-save para updated_at automático.

### Architecture

- [ ] Definir estructura modular: modules/incidents (controller, service, dto, entity, repository).
- [ ] Aplicar patrón Repository para abstracción de datos.
- [ ] Configurar conexión MongoDB con Mongoose (pool, timeouts, retryWrites).
- [ ] Validar que no hay acoplamiento directo entre controladores y modelos de BD.

### QA

- [ ] Probar endpoints con Postman/Thunder Client: GET list, GET by ID, POST create, health.
- [ ] Probar filtros query params: estado, gravedad, search, paginación.
- [ ] Probar búsqueda geoespacial: crear incidente, enviar reporte cercano -> count incrementa.
- [ ] Probar validaciones: payloads inválidos -> 400 con detalles.
- [ ] Probar 404: ID inexistente.
- [ ] Probar health check: BD up/down.
- [ ] Load test básico: 100 req/s en GET /api/incidents.