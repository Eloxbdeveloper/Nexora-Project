import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { IncidentSchema, Incident } from '../incidents/entities/incident.schema';

// Coordenadas aproximadas repartidas por distintas zonas/localidades de Bogotá
// Formato GeoJSON: [longitud, latitud]
const demoIncidents = [
  {
    location: { type: 'Point', coordinates: [-74.0721, 4.711] },
    zone: 'Centro',
    type: 'accidente',
    description: 'Choque entre dos vehículos sobre la Av. Caracas con Calle 19, a la altura del semáforo.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 12,
  },
  {
    location: { type: 'Point', coordinates: [-74.0817, 4.6971] },
    zone: 'La Candelaria',
    type: 'bloqueo',
    description: 'Manifestación bloquea la Carrera 7 entre calles 10 y 13, tráfico desviado por la Carrera 5.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 25,
  },
  {
    location: { type: 'Point', coordinates: [-74.0537, 4.6486] },
    zone: 'San Cristóbal',
    type: 'congestion',
    description: 'Tráfico pesado por hora pico en la Av. 1 de Mayo, demoras de hasta 40 minutos.',
    severity: 'media',
    status: 'activo',
    reportsCount: 8,
  },
  {
    location: { type: 'Point', coordinates: [-74.1266, 4.6584] },
    zone: 'Kennedy',
    type: 'retraso',
    description: 'Retraso en la ruta troncal Américas por alta demanda de pasajeros en hora pico.',
    severity: 'media',
    status: 'en_revision',
    reportsCount: 6,
  },
  {
    location: { type: 'Point', coordinates: [-74.0459, 4.6273] },
    zone: 'Rafael Uribe Uribe',
    type: 'problema_estacion',
    description: 'Estación con fallas en torniquetes de acceso, usuarios deben usar la puerta lateral.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 4,
  },
  {
    location: { type: 'Point', coordinates: [-74.0938, 4.7495] },
    zone: 'Suba',
    type: 'dano_infraestructura',
    description: 'Puente peatonal con daño estructural visible, riesgo para peatones que lo cruzan.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 15,
  },
  {
    location: { type: 'Point', coordinates: [-74.0453, 4.6982] },
    zone: 'Chapinero',
    type: 'obra',
    description: 'Obra de mantenimiento vial reduce a un carril la Calle 63, avance lento en ambos sentidos.',
    severity: 'media',
    status: 'activo',
    reportsCount: 9,
  },
  {
    location: { type: 'Point', coordinates: [-74.1469, 4.7011] },
    zone: 'Engativá',
    type: 'suspension_servicio',
    description: 'Suspensión temporal del servicio por mantenimiento programado en la estación principal.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 18,
  },
  {
    location: { type: 'Point', coordinates: [-74.1028, 4.6097] },
    zone: 'Ciudad Bolívar',
    type: 'otro',
    description: 'Semáforo dañado genera desorden vehicular en la intersección principal del barrio.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 3,
  },
  {
    location: { type: 'Point', coordinates: [-74.0555, 4.6767] },
    zone: 'Santa Fe',
    type: 'accidente',
    description: 'Volcamiento de bus articulado, vía parcialmente cerrada mientras se retira el vehículo.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 21,
  },
  {
    location: { type: 'Point', coordinates: [-74.1136, 4.6142] },
    zone: 'Bosa',
    type: 'bloqueo',
    description: 'Bloqueo por obras de alcantarillado en vía principal, tránsito desviado por vía alterna.',
    severity: 'media',
    status: 'en_revision',
    reportsCount: 7,
  },
  {
    location: { type: 'Point', coordinates: [-74.0403, 4.7451] },
    zone: 'Usaquén',
    type: 'congestion',
    description: 'Congestión por cierre parcial en la Autopista Norte a la altura de la Calle 116.',
    severity: 'media',
    status: 'activo',
    reportsCount: 11,
  },
  {
    location: { type: 'Point', coordinates: [-74.1592, 4.6531] },
    zone: 'Fontibón',
    type: 'retraso',
    description: 'Retrasos en rutas alimentadoras cerca al aeropuerto por alta congestión vehicular.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 5,
  },
  {
    location: { type: 'Point', coordinates: [-74.0619, 4.5964] },
    zone: 'Tunjuelito',
    type: 'problema_estacion',
    description: 'Estación cerrada temporalmente por falla eléctrica en el sistema de iluminación.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 14,
  },
  {
    location: { type: 'Point', coordinates: [-74.1355, 4.6907] },
    zone: 'Engativá',
    type: 'dano_infraestructura',
    description: 'Hundimiento de vía genera riesgo para vehículos, especialmente motociclistas.',
    severity: 'media',
    status: 'activo',
    reportsCount: 10,
  },
  {
    location: { type: 'Point', coordinates: [-74.0685, 4.6351] },
    zone: 'Antonio Nariño',
    type: 'obra',
    description: 'Obra de ampliación vial en la Av. Boyacá, un carril habilitado en horario nocturno.',
    severity: 'baja',
    status: 'activo',
    reportsCount: 2,
  },
  {
    location: { type: 'Point', coordinates: [-74.0344, 4.6784] },
    zone: 'Chapinero',
    type: 'suspension_servicio',
    description: 'Suspensión de ruta por manifestación cercana a la Universidad Nacional.',
    severity: 'alta',
    status: 'activo',
    reportsCount: 19,
  },
  {
    location: { type: 'Point', coordinates: [-74.1499, 4.6015] },
    zone: 'Bosa',
    type: 'otro',
    description: 'Vendedores informales ocupan carril vehicular cerca al portal, situación ya resuelta.',
    severity: 'baja',
    status: 'solucionado',
    reportsCount: 1,
  },
  {
    location: { type: 'Point', coordinates: [-74.0501, 4.6613] },
    zone: 'Los Mártires',
    type: 'accidente',
    description: 'Atropellamiento genera cierre parcial de vía mientras atienden a la persona afectada.',
    severity: 'alta',
    status: 'en_revision',
    reportsCount: 16,
  },
  {
    location: { type: 'Point', coordinates: [-74.0779, 4.7241] },
    zone: 'Suba',
    type: 'congestion',
    description: 'Congestión prolongada por accidente cercano, la situación ya fue resuelta por las autoridades.',
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