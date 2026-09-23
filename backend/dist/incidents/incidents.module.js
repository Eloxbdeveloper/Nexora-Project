"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const incident_schema_1 = require("./entities/incident.schema");
const incidents_controller_1 = require("./controllers/incidents.controller");
const incidents_service_1 = require("./services/incidents.service");
let IncidentsModule = class IncidentsModule {
};
exports.IncidentsModule = IncidentsModule;
exports.IncidentsModule = IncidentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: incident_schema_1.Incident.name, schema: incident_schema_1.IncidentSchema },
            ]),
        ],
        controllers: [incidents_controller_1.IncidentsController],
        providers: [incidents_service_1.IncidentsService],
        exports: [incidents_service_1.IncidentsService],
    })
], IncidentsModule);
//# sourceMappingURL=incidents.module.js.map