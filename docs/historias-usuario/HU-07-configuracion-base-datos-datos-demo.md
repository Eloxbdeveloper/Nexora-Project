# HU-07: Configuración de base de datos y datos de demostración

## Descripción

Como desarrollador,
Quiero configurar MongoDB con esquemas, índices y datos ficticios representativos,
Para que el MVP tenga un escenario realista de incidentes en Bogotá desde el primer acceso.

---

## Criterios de Aceptación

- [ ] **Escenario:** Conexión a MongoDB Atlas/local

- [ ] **Dado que** la aplicación inicia
- [ ] **Cuando** se conecta a la BD usando MONGODB_URI
- [ ] **Entonces** la conexión se establece correctamente, reconexión automática ante fallos, logs de conexión/desconexión.

---

- [ ] **Escenario:** Esquemas y índices creados automáticamente

- [ ] **Dado que** la aplicación inicia por primera vez
- [ ] **Cuando** Mongoose sincroniza modelos
- [ ] **Entonces** se crean colecciones `incidents`, `reports`, `users` (opcional) con todos los índices definidos (geoespaciales 2dsphere, compuestos, texto) sin errores.

---

- [ ] **Escenario:** Datos de demostración (seed) cargados

- [ ] **Dado que** la BD está vacía o se ejecuta script de seed
- [ ] **Cuando** se ejecuta `npm run db:seed` (o similar)
- [ ] **Entonces** se insertan:
  - 5-10 usuarios ficticios (ID, nombre: "Usuario_001"..."Usuario_010")
  - 20-30 incidentes distribuidos en Bogotá (zonas: Centro, Norte, Sur, Occidente, Oriente, Chapinero, Kennedy, Suba, Bosa, Ciudad Bolívar)
  - Variedad de tipos: mínimo 2 de cada uno (accidente, bloqueo, congestion, retraso, problema_estacion, daño_infraestructura, obra, suspension_servicio, otro)
  - Variedad de gravedades: ~30% alta, ~40% media, ~30% baja
  - Variedad de estados: ~60% activo, ~20% en_revision, ~20% solucionado
  - Cantidad_reportes realista (1-15 por incidente)
  - Descripciones coherentes por tipo y zona
  - Fechas recientes (últimos 7 días)

---

- [ ] **Escenario:** Script de limpieza y reseed

- [ ] **Dado que** el desarrollador quiere reiniciar datos demo
- [ ] **Cuando** ejecuta `npm run db:reset` (limpia + seed)
- [ ] **Entonces** se eliminan todas las colecciones y se vuelven a crear con datos frescos.

---

## Sub-Issues

### Database

- [ ] Configurar conexión Mongoose en `database/mongoose.config.ts`: URI, opciones (maxPoolSize, serverSelectionTimeoutMS, socketTimeoutMS, retryWrites).
- [ ] Definir modelo `User` (opcional para MVP): _id, nombre, created_at.
- [ ] Definir modelo `Incident` (ver HU-05): todos los campos, índices 2dsphere, compuestos, texto.
- [ ] Definir modelo `Report` (ver HU-06): todos los campos, índices 2dsphere, compuestos.
- [ ] Crear script `scripts/seed.ts`: genera usuarios, incidentes, reportes vinculados usando Faker.js o datos hardcodeados realistas.
- [ ] Crear script `scripts/reset.ts`: drop collections + seed.
- [ ] Agregar npm scripts en package.json: `db:seed`, `db:reset`, `db:connect-test`.

### Backend

- [ ] Integrar conexión BD en bootstrap de la app (main.ts).
- [ ] Manejar eventos de conexión: connected, error, disconnected, reconnected.
- [ ] Health check endpoint verifica `mongoose.connection.readyState === 1`.

### Architecture

- [ ] Configurar variables de entorno: MONGODB_URI, DB_NAME, SEED_ENABLED (bool).
- [ ] Documentar modelos y relaciones en `docs/database.md` (actualizar existente).

### QA

- [ ] Verificar conexión exitosa en local y Atlas.
- [ ] Ejecutar seed y validar conteos: users=10, incidents=25, reports=50+.
- [ ] Verificar índices creados: `db.incidents.getIndexes()`, `db.reports.getIndexes()`.
- [ ] Validar distribución geográfica: incidentes en al menos 8 localidades de Bogotá.
- [ ] Validar variedad: todos los tipos, gravedades, estados representados.
- [ ] Probar reset: limpia y recrea correctamente.
- [ ] Verificar health check retorna database: "connected".