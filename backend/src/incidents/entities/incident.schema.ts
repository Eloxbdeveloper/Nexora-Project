import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const TIPOS_INCIDENTE = [
  'accidente',
  'bloqueo',
  'congestion',
  'retraso',
  'problema_estacion',
  'dano_infraestructura',
  'obra',
  'suspension_servicio',
  'otro',
] as const;

export const GRAVEDADES = ['baja', 'media', 'alta'] as const;

export const ESTADOS = ['activo', 'solucionado', 'en_revision'] as const;

export type IncidentType = (typeof TIPOS_INCIDENTE)[number];
export type Severity = (typeof GRAVEDADES)[number];
export type Status = (typeof ESTADOS)[number];

export type IncidentDocument = Incident & Document;

@Schema({ _id: false })
class GeoLocation {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  // GeoJSON: [longitud, latitud]
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

@Schema({ timestamps: true, collection: 'incidents' })
export class Incident {
  @Prop({ type: GeoLocation, required: true })
  location: GeoLocation;

  // Nombre legible de la zona/localidad (ej. "Suba", "Chapinero").
  // No usamos geocodificación externa en el MVP; se guarda directamente.
  @Prop({ type: String, trim: true, default: '' })
  zone: string;

  @Prop({ type: String, enum: TIPOS_INCIDENTE, required: true })
  type: IncidentType;

  @Prop({ type: String, trim: true, default: '' })
  description: string;

  @Prop({ type: String, enum: GRAVEDADES, required: true, default: 'media' })
  severity: Severity;

  @Prop({ type: String, enum: ESTADOS, required: true, default: 'activo' })
  status: Status;

  @Prop({ type: Number, default: 1, min: 0 })
  reportsCount: number;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

// Índice geoespacial requerido para consultas espaciales (near, within, etc.)
IncidentSchema.index({ location: '2dsphere' });
// Búsqueda de texto libre (HU-04: "search" por zona, tipo, descripción)
IncidentSchema.index({ zone: 'text', type: 'text', description: 'text' });

// Filtros frecuentes combinados con orden por fecha
IncidentSchema.index({ status: 1, createdAt: -1 });
IncidentSchema.index({ severity: 1, createdAt: -1 });
