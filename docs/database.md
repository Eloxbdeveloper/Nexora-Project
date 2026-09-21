# Modelos de Datos - Muévete CB

## User
- name: String

## Incident
- location: Point [lng, lat]
- type: String (accidente, bloqueo, congestion, retraso, problema_estacion, danio_infraestructura, obras, suspension_servicio, otro)
- severity: String (baja, media, alta)
- status: String (activo, solucionado, en_revision)
- reportsCount: Number

## Report
- user: ObjectId (ref User)
- incident: ObjectId (ref Incident)
- type: String
- location: Point [lng, lat]
- description: String
- severity: String
- status: String