import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(dto: CreateReportDto): Promise<{
        success: boolean;
        data: {
            report: import("mongoose").Document<unknown, {}, import("../entities/report.schema").ReportDocument, {}, {}> & import("../entities/report.schema").Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
        data: (import("mongoose").Document<unknown, {}, import("../entities/report.schema").ReportDocument, {}, {}> & import("../entities/report.schema").Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
