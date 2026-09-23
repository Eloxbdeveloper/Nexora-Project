import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { IncidentSchema, Incident } from '../incidents/entities/incident.schema';

// Coordenadas aproximadas repartidas por distintas zonas/localidades de Bogotá
// Formato GeoJSON: [longitud, latitud]
const demoIncidents = [
  {
    location: { type: 'Point', coordinates: [-74.0721, 4.711] }, // Centro
    type: 'accidente',
    description: 'Choque entre dos vehículos sobre la Av. Caracas.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 12,
  },
  {
    location: { type: 'Point', coordinates: [-74.0817, 4.6971] }, // La Candelaria
    type: 'bloqueo',
    description: 'Manifestación bloquea la Carrera 7.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 25,
  },
  {
    location: { type: 'Point', coordinates: [-74.0537, 4.6486] }, // San Cristóbal
    type: 'congestion',
    description: 'Tráfico pesado por hora pico en la Av. 1 de Mayo.',
    severity: 'media',
    status: 'activo',
    reportsCount: 8,
  },
  {
    location: { type: 'Point', coordinates: [-74.1266, 4.6584] }, // Kennedy
    type: 'retraso',
    description: 'Retraso en la ruta troncal Américas por alta demanda.',
    severity: 'media',
    status: 'en_revision',
    reportsCount: 6,
  },
  {
    location: { type: 'Point', coordinates: [-74.0459, 4.6273] }, // Rafael Uribe Uribe
    type: 'problema_estacion',
    description: 'Estación con fallas en torniquetes de acceso.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 4,
  },
  {
    location: { type: 'Point', coordinates: [-74.0938, 4.7495] }, // Suba
    type: 'dano_infraestructura',
    description: 'Puente peatonal con daño estructural visible.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 15,
  },
  {
    location: { type: 'Point', coordinates: [-74.0453, 4.6982] }, // Chapinero
    type: 'obra',
    description: 'Obra de mantenimiento vial reduce a un carril la Calle 63.',
    severity: 'media',
    status: 'activo',
    reportsCount: 9,
  },
  {
    location: { type: 'Point', coordinates: [-74.1469, 4.7011] }, // Engativá
    type: 'suspension_servicio',
    description: 'Suspensión temporal del servicio por mantenimiento.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 18,
  },
  {
    location: { type: 'Point', coordinates: [-74.1028, 4.6097] }, // Ciudad Bolívar
    type: 'otro',
    description: 'Semáforo dañado genera desorden vehicular.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 3,
  },
  {
    location: { type: 'Point', coordinates: [-74.0555, 4.6767] }, // Santa Fe
    type: 'accidente',
    description: 'Volcamiento de bus articulado, vía parcialmente cerrada.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 21,
  },
  {
    location: { type: 'Point', coordinates: [-74.1136, 4.6142] }, // Bosa
    type: 'bloqueo',
    description: 'Bloqueo por obras de alcantarillado en vía principal.',
    severity: 'media',
    status: 'en_revision',
    reportsCount: 7,
  },
  {
    location: { type: 'Point', coordinates: [-74.0403, 4.7451] }, // Usaquén
    type: 'congestion',
    description: 'Congestión por cierre parcial en la Autopista Norte.',
    severity: 'media',
    status: 'activo',
    reportsCount: 11,
  },
  {
    location: { type: 'Point', coordinates: [-74.1592, 4.6531] }, // Fontibón
    type: 'retraso',
    description: 'Retrasos en rutas alimentadoras cerca al aeropuerto.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 5,
  },
  {
    location: { type: 'Point', coordinates: [-74.0619, 4.5964] }, // Tunjuelito
    type: 'problema_estacion',
    description: 'Estación cerrada temporalmente por falla eléctrica.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 14,
  },
  {
    location: { type: 'Point', coordinates: [-74.1355, 4.6907] }, // Engativá (norte)
    type: 'dano_infraestructura',
    description: 'Hundimiento de vía genera riesgo para vehículos.',
    severity: 'media',
    status: 'activo',
    reportsCount: 10,
  },
  {
    location: { type: 'Point', coordinates: [-74.0685, 4.6351] }, // Antonio Nariño
    type: 'obra',
    description: 'Obra de ampliación vial en la Av. Boyacá.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 2,
  },
  {
    location: { type: 'Point', coordinates: [-74.0344, 4.6784] }, // Chapinero alto
    type: 'suspension_servicio',
    description: 'Suspensión de ruta por manifestación cercana.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 19,
  },
  {
    location: { type: 'Point', coordinates: [-74.1499, 4.6015] }, // Bosa sur
    type: 'otro',
    description: 'Vendedores informales ocupan carril vehicular.',
    severity: 'baja',
    status: 'solucionado',
    reportsCount: 1,
  },
  {
    location: { type: 'Point', coordinates: [-74.0501, 4.6613] }, // Los Mártires
    type: 'accidente',
    description: 'Atropellamiento genera cierre parcial de vía.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 16,
  },
  {
    location: { type: 'Point', coordinates: [-74.0779, 4.7241] }, // Suba centro
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

  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB');

  const IncidentModel = mongoose.model(Incident.name, IncidentSchema);

  await IncidentModel.deleteMany({});
  console.log('🗑️  Colección incidents limpiada');

  const inserted = await IncidentModel.insertMany(demoIncidents);
  console.log(`✅ ${inserted.length} incidentes demo insertados`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Error al hacer seed:', error.message);
  process.exit(1);
});
