import { Document, Types } from 'mongoose';
import { IncidentType, Severity } from '../../incidents/entities/incident.schema';
export declare const ESTADOS_REPORTE: readonly ["pendiente", "validado"];
export type ReportStatus = (typeof ESTADOS_REPORTE)[number];
export type ReportDocument = Report & Document;
declare class GeoLocation {
    type: string;
    coordinates: number[];
}
export declare class Report {
    userId: string;
    type: IncidentType;
    description: string;
    severity: Severity;
    location: GeoLocation;
    incidentId: Types.ObjectId;
    reportStatus: ReportStatus;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, Document<unknown, any, Report, any, {}> & Report & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, import("mongoose").FlatRecord<Report>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Report> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
