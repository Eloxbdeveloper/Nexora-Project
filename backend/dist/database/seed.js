"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const mongoose_1 = require("mongoose");
const incident_schema_1 = require("../incidents/entities/incident.schema");
const demoIncidents = [
    {
        location: { type: 'Point', coordinates: [-74.0721, 4.711] },
        type: 'accidente',
        description: 'Choque entre dos vehículos sobre la Av. Caracas.',
        severity: 'alta',
        status: 'activo',
        reportsCount: 12,
    },
    {
        location: { type: 'Point', coordinates: [-74.0817, 4.6971] },
        type: 'bloqueo',
        description: 'Manifestación bloquea la Carrera 7.',
        severity: 'alta',
        status: 'activo',
        reportsCount: 25,
    },
    {
        location: { type: 'Point', coordinates: [-74.0537, 4.6486] },
        type: 'congestion',
        description: 'Tráfico pesado por hora pico en la Av. 1 de Mayo.',
        severity: 'media',
        status: 'activo',
        reportsCount: 8,
    },
    {
        location: { type: 'Point', coordinates: [-74.1266, 4.6584] },
        type: 'retraso',
        description: 'Retraso en la ruta troncal Américas por alta demanda.',
        severity: 'media',
        status: 'en_revision',
        reportsCount: 6,
    },
    {
        location: { type: 'Point', coordinates: [-74.0459, 4.6273] },
        type: 'problema_estacion',
        description: 'Estación con fallas en torniquetes de acceso.',
        severity: 'baja',
        status: 'activo',
        reportsCount: 4,
    },
    {
        location: { type: 'Point', coordinates: [-74.0938, 4.7495] },
        type: 'dano_infraestructura',
        description: 'Puente peatonal con daño estructural visible.',
        severity: 'alta',
        status: 'en_revision',
        reportsCount: 15,
    },
    {
        location: { type: 'Point', coordinates: [-74.0453, 4.6982] },
        type: 'obra',
        description: 'Obra de mantenimiento vial reduce a un carril la Calle 63.',
        severity: 'media',
        status: 'activo',
        reportsCount: 9,
    },
    {
        location: { type: 'Point', coordinates: [-74.1469, 4.7011] },
        type: 'suspension_servicio',
        description: 'Suspensión temporal del servicio por mantenimiento.',
        severity: 'alta',
        status: 'activo',
        reportsCount: 18,
    },
    {
        location: { type: 'Point', coordinates: [-74.1028, 4.6097] },
        type: 'otro',
        description: 'Semáforo dañado genera desorden vehicular.',
        severity: 'baja',
        status: 'activo',
        reportsCount: 3,
    },
    {
        location: { type: 'Point', coordinates: [-74.0555, 4.6767] },
        type: 'accidente',
        description: 'Volcamiento de bus articulado, vía parcialmente cerrada.',
        severity: 'alta',
        status: 'activo',
        reportsCount: 21,
    },
    {
        location: { type: 'Point', coordinates: [-74.1136, 4.6142] },
        type: 'bloqueo',
        description: 'Bloqueo por obras de alcantarillado en vía principal.',
        severity: 'media',
        status: 'en_revision',
        reportsCount: 7,
    },
    {
        location: { type: 'Point', coordinates: [-74.0403, 4.7451] },
        type: 'congestion',
        description: 'Congestión por cierre parcial en la Autopista Norte.',
        severity: 'media',
        status: 'activo',
        reportsCount: 11,
    },
    {
        location: { type: 'Point', coordinates: [-74.1592, 4.6531] },
        type: 'retraso',
        description: 'Retrasos en rutas alimentadoras cerca al aeropuerto.',
        severity: 'baja',
        status: 'activo',
        reportsCount: 5,
    },
    {
        location: { type: 'Point', coordinates: [-74.0619, 4.5964] },
        type: 'problema_estacion',
        description: 'Estación cerrada temporalmente por falla eléctrica.',
        severity: 'alta',
        status: 'en_revision',
        reportsCount: 14,
    },
    {
        location: { type: 'Point', coordinates: [-74.1355, 4.6907] },
        type: 'dano_infraestructura',
        description: 'Hundimiento de vía genera riesgo para vehículos.',
        severity: 'media',
        status: 'activo',
        reportsCount: 10,
    },
    {
        location: { type: 'Point', coordinates: [-74.0685, 4.6351] },
        type: 'obra',
        description: 'Obra de ampliación vial en la Av. Boyacá.',
        severity: 'baja',
        status: 'activo',
        reportsCount: 2,
    },
    {
        location: { type: 'Point', coordinates: [-74.0344, 4.6784] },
        type: 'suspension_servicio',
        description: 'Suspensión de ruta por manifestación cercana.',
        severity: 'alta',
        status: 'activo',
        reportsCount: 19,
    },
    {
        location: { type: 'Point', coordinates: [-74.1499, 4.6015] },
        type: 'otro',
        description: 'Vendedores informales ocupan carril vehicular.',
        severity: 'baja',
        status: 'solucionado',
        reportsCount: 1,
    },
    {
        location: { type: 'Point', coordinates: [-74.0501, 4.6613] },
        type: 'accidente',
        description: 'Atropellamiento genera cierre parcial de vía.',
        severity: 'alta',
        status: 'en_revision',
        reportsCount: 16,
    },
    {
        location: { type: 'Point', coordinates: [-74.0779, 4.7241] },
        type: 'congestion',
        description: 'Congestión prolongada por accidente cercano ya resuelto.',
        severity: 'media',
        status: 'solucionado',
        reportsCount: 8,
    },
];
async function seed() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        throw new Error('DATABASE_URL no está definida en el archivo .env');
    }
    await mongoose_1.default.connect(uri);
    console.log('✅ Conectado a MongoDB');
    const IncidentModel = mongoose_1.default.model(incident_schema_1.Incident.name, incident_schema_1.IncidentSchema);
    await IncidentModel.deleteMany({});
    console.log('🗑️  Colección incidents limpiada');
    const inserted = await IncidentModel.insertMany(demoIncidents);
    console.log(`✅ ${inserted.length} incidentes demo insertados`);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
seed().catch((error) => {
    console.error('❌ Error al hacer seed:', error.message);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map