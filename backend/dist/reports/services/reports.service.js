"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("../entities/report.schema");
const incidents_service_1 = require("../../incidents/services/incidents.service");
let ReportsService = class ReportsService {
    constructor(reportModel, incidentsService) {
        this.reportModel = reportModel;
        this.incidentsService = incidentsService;
    }
    async create(dto) {
        const [lng, lat] = dto.location.coordinates;
        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
            throw new common_1.BadRequestException('Las coordenadas están fuera de rango válido');
        }
        const location = { type: 'Point', coordinates: [lng, lat] };
        const { incident, isNew } = await this.incidentsService.findOrCreateFromReport({
            location,
            type: dto.type,
            description: dto.description,
            severity: dto.severity,
        });
        const report = await this.reportModel.create({
            userId: dto.userId ?? 'anonimo',
            type: dto.type,
            description: dto.description,
            severity: dto.severity,
            location,
            incidentId: incident._id,
            reportStatus: 'pendiente',
        });
        return {
            success: true,
            data: {
                report,
                incident,
                isNewIncident: isNew,
            },
        };
    }
    async findAll() {
        const reports = await this.reportModel.find().sort({ createdAt: -1 }).exec();
        return {
            success: true,
            count: reports.length,
            data: reports,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        incidents_service_1.IncidentsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map