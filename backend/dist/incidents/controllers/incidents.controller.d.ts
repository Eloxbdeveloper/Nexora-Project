import { IncidentsService } from '../services/incidents.service';
import { QueryIncidentsDto } from '../dto/query-incidents.dto';
export declare class IncidentsController {
    private readonly incidentsService;
    constructor(incidentsService: IncidentsService);
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
        data: (import("mongoose").Document<unknown, {}, import("../entities/incident.schema").IncidentDocument, {}, {}> & import("../entities/incident.schema").Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("../entities/incident.schema").IncidentDocument, {}, {}> & import("../entities/incident.schema").Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
