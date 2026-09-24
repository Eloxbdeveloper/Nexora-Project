import { Model } from 'mongoose';
import { Report, ReportDocument } from '../entities/report.schema';
import { CreateReportDto } from '../dto/create-report.dto';
import { IncidentsService } from '../../incidents/services/incidents.service';
export declare class ReportsService {
    private reportModel;
    private incidentsService;
    constructor(reportModel: Model<ReportDocument>, incidentsService: IncidentsService);
    create(dto: CreateReportDto): Promise<{
        success: boolean;
        data: {
            report: import("mongoose").Document<unknown, {}, ReportDocument, {}, {}> & Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            incident: import("mongoose").Document<unknown, {}, import("../../incidents/entities/incident.schema").IncidentDocument, {}, {}> & import("../../incidents/entities/incident.schema").Incident & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            isNewIncident: boolean;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, ReportDocument, {}, {}> & Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
