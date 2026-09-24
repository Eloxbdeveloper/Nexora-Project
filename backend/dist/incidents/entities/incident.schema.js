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
exports.IncidentSchema = exports.Incident = exports.ESTADOS = exports.GRAVEDADES = exports.TIPOS_INCIDENTE = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.TIPOS_INCIDENTE = [
    'accidente',
    'bloqueo',
    'congestion',
    'retraso',
    'problema_estacion',
    'dano_infraestructura',
    'obra',
    'suspension_servicio',
    'otro',
];
exports.GRAVEDADES = ['baja', 'media', 'alta'];
exports.ESTADOS = ['activo', 'solucionado', 'en_revision'];
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
let Incident = class Incident {
};
exports.Incident = Incident;
__decorate([
    (0, mongoose_1.Prop)({ type: GeoLocation, required: true }),
    __metadata("design:type", GeoLocation)
], Incident.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: '' }),
    __metadata("design:type", String)
], Incident.prototype, "zone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: exports.TIPOS_INCIDENTE, required: true }),
    __metadata("design:type", String)
], Incident.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: '' }),
    __metadata("design:type", String)
], Incident.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: exports.GRAVEDADES, required: true, default: 'media' }),
    __metadata("design:type", String)
], Incident.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: exports.ESTADOS, required: true, default: 'activo' }),
    __metadata("design:type", String)
], Incident.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1, min: 0 }),
    __metadata("design:type", Number)
], Incident.prototype, "reportsCount", void 0);
exports.Incident = Incident = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'incidents' })
], Incident);
exports.IncidentSchema = mongoose_1.SchemaFactory.createForClass(Incident);
exports.IncidentSchema.index({ location: '2dsphere' });
exports.IncidentSchema.index({ zone: 'text', type: 'text', description: 'text' });
exports.IncidentSchema.index({ status: 1, createdAt: -1 });
exports.IncidentSchema.index({ severity: 1, createdAt: -1 });
//# sourceMappingURL=incident.schema.js.map