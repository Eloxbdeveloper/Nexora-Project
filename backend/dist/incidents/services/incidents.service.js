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
exports.IncidentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const incident_schema_1 = require("../entities/incident.schema");
let IncidentsService = class IncidentsService {
    constructor(incidentModel) {
        this.incidentModel = incidentModel;
    }
    async findAll(query) {
        const { page, limit, type, status, severity } = query;
        const filter = {};
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        if (severity)
            filter.severity = severity;
        if (!page && !limit) {
            const incidents = await this.incidentModel
                .find(filter)
                .sort({ createdAt: -1 })
                .exec();
            return {
                success: true,
                count: incidents.length,
                data: incidents,
            };
        }
        const pageNum = page ?? 1;
        const limitNum = limit ?? 20;
        const skip = (pageNum - 1) * limitNum;
        const [incidents, total] = await Promise.all([
            this.incidentModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .exec(),
            this.incidentModel.countDocuments(filter).exec(),
        ]);
        return {
            success: true,
            count: incidents.length,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: incidents,
        };
    }
    async findOne(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('El id proporcionado no tiene un formato válido');
        }
        const incident = await this.incidentModel.findById(id).exec();
        if (!incident) {
            throw new common_1.NotFoundException('Incidente no encontrado');
        }
        return { success: true, data: incident };
    }
};
exports.IncidentsService = IncidentsService;
exports.IncidentsService = IncidentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IncidentsService);
//# sourceMappingURL=incidents.service.js.map