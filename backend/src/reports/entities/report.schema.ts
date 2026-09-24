import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  TIPOS_INCIDENTE,
  GRAVEDADES,
  IncidentType,
  Severity,
} from '../../incidents/entities/incident.schema';

export const ESTADOS_REPORTE = ['pendiente', 'validado'] as const;
export type ReportStatus = (typeof ESTADOS_REPORTE)[number];

export type ReportDocument = Report & Document;

@Schema({ _id: false })
class GeoLocation {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  // GeoJSON: [longitud, latitud]
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

@Schema({ timestamps: true, collection: 'reports' })
export class Report {
  // Usuario simulado (no hay autenticación real en el MVP)
  @Prop({ type: String, default: 'anonimo' })
  userId: string;

  @Prop({ type: String, enum: TIPOS_INCIDENTE, required: true })
  type: IncidentType;

  @Prop({ type: String, required: true, minlength: 10 })
  description: string;

  @Prop({ type: String, enum: GRAVEDADES, required: true })
  severity: Severity;

  @Prop({ type: GeoLocation, required: true })
  location: GeoLocation;

  // Referencia al incidente al que quedó asociado este reporte
  // (nuevo o existente si cayó dentro del radio de agrupación)
  @Prop({ type: Types.ObjectId, ref: 'Incident', required: true })
  incidentId: Types.ObjectId;

  @Prop({ type: String, enum: ESTADOS_REPORTE, default: 'pendiente' })
  reportStatus: ReportStatus;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Índice geoespacial (por si en el futuro se consulta por cercanía de reportes)
ReportSchema.index({ location: '2dsphere' });

// Índice compuesto para buscar rápido todos los reportes de un incidente
ReportSchema.index({ incidentId: 1 });
