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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = exports.Report = exports.ESTADOS_REPORTE = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const incident_schema_1 = require("../../incidents/entities/incident.schema");
exports.ESTADOS_REPORTE = ['pendiente', 'validado'];
let GeoLocation = class GeoLocation {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['Point'], required: true, default: 'Point' }),
    __metadata("design:type", String)
], GeoLocation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], required: true }),
    __metadata("design:type", Array)
], GeoLocation.prototype, "coordinates", void 0);
GeoLocation = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GeoLocation);
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'anonimo' }),
    __metadata("design:type", String)
], Report.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: incident_schema_1.TIPOS_INCIDENTE, required: true }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 10 }),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: incident_schema_1.GRAVEDADES, required: true }),
    __metadata("design:type", String)
], Report.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: GeoLocation, required: true }),
    __metadata("design:type", GeoLocation)
], Report.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Incident', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "incidentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: exports.ESTADOS_REPORTE, default: 'pendiente' }),
    __metadata("design:type", String)
], Report.prototype, "reportStatus", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'reports' })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
exports.ReportSchema.index({ location: '2dsphere' });
exports.ReportSchema.index({ incidentId: 1 });
//# sourceMappingURL=report.schema.js.map