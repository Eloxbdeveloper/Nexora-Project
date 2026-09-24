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
const GROUPING_RADIUS_METERS = 100;
const SEVERITY_RANK = {
    baja: 1,
    media: 2,
    alta: 3,
};
let IncidentsService = class IncidentsService {
    constructor(incidentModel) {
        this.incidentModel = incidentModel;
    }
    async findAll(query) {
        const { page = 1, limit = 20, type, status, severity, search, sort } = query;
        const filter = {};
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        if (severity)
            filter.severity = severity;
        if (search)
            filter.$text = { $search: search };
        const sortOption = sort === 'createdAt' ? { createdAt: 1 } : { createdAt: -1 };
        const skip = (page - 1) * limit;
        const [incidents, total, counts] = await Promise.all([
            this.incidentModel.find(filter).sort(sortOption).skip(skip).limit(limit).exec(),
            this.incidentModel.countDocuments(filter).exec(),
            this.incidentModel.aggregate([
                { $match: filter },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
        ]);
        const summary = { total, activos: 0, solucionados: 0, en_revision: 0 };
        for (const c of counts) {
            if (c._id === 'activo')
                summary.activos = c.count;
            if (c._id === 'solucionado')
                summary.solucionados = c.count;
            if (c._id === 'en_revision')
                summary.en_revision = c.count;
        }
        return {
            success: true,
            count: incidents.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            summary,
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
    async findOrCreateFromReport(params) {
        const { location, type, description, severity } = params;
        const nearby = await this.incidentModel.findOne({
            location: {
                $near: {
                    $geometry: location,
                    $maxDistance: GROUPING_RADIUS_METERS,
                },
            },
        });
        if (nearby) {
            nearby.reportsCount += 1;
            if (SEVERITY_RANK[severity] > SEVERITY_RANK[nearby.severity]) {
                nearby.severity = severity;
            }
            await nearby.save();
            return { incident: nearby, isNew: false };
        }
        const created = await this.incidentModel.create({
            location,
            type,
            description,
            severity,
            status: 'activo',
            reportsCount: 1,
        });
        return { incident: created, isNew: true };
    }
};
exports.IncidentsService = IncidentsService;
exports.IncidentsService = IncidentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IncidentsService);
//# sourceMappingURL=incidents.service.js.map