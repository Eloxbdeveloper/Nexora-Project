import { Document } from 'mongoose';
export declare const TIPOS_INCIDENTE: readonly ["accidente", "bloqueo", "congestion", "retraso", "problema_estacion", "dano_infraestructura", "obra", "suspension_servicio", "otro"];
export declare const GRAVEDADES: readonly ["baja", "media", "alta"];
export declare const ESTADOS: readonly ["activo", "solucionado", "en_revision"];
export type IncidentType = (typeof TIPOS_INCIDENTE)[number];
export type Severity = (typeof GRAVEDADES)[number];
export type Status = (typeof ESTADOS)[number];
export type IncidentDocument = Incident & Document;
declare class GeoLocation {
    type: string;
    coordinates: number[];
}
export declare class Incident {
    location: GeoLocation;
    zone: string;
    type: IncidentType;
    description: string;
    severity: Severity;
    status: Status;
    reportsCount: number;
}
export declare const IncidentSchema: import("mongoose").Schema<Incident, import("mongoose").Model<Incident, any, any, any, Document<unknown, any, Incident, any, {}> & Incident & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Incident, Document<unknown, {}, import("mongoose").FlatRecord<Incident>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Incident> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
