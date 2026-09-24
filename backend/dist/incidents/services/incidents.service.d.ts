import { Model } from 'mongoose';
import { Incident, IncidentDocument } from '../entities/incident.schema';
import { QueryIncidentsDto } from '../dto/query-incidents.dto';
export declare class IncidentsService {
    private incidentModel;
    constructor(incidentModel: Model<IncidentDocument>);
    findAll(query: QueryIncidentsDto): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        totalPages: number;
        summary: {
            total: number;
            activos: number;
            solucionados: number;
            en_revision: number;
        };
        data: (import("mongoose").Document<unknown, {}, IncidentDocument, {}, {}> & Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, IncidentDocument, {}, {}> & Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    findOrCreateFromReport(params: {
        location: {
            type: 'Point';
            coordinates: number[];
        };
        type: string;
        description: string;
        severity: string;
    }): Promise<{
        incident: import("mongoose").Document<unknown, {}, IncidentDocument, {}, {}> & Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        isNew: boolean;
    }>;
}
