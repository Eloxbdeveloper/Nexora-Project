import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, isValidObjectId } from 'mongoose';
import { Incident, IncidentDocument, Severity } from '../entities/incident.schema';
import { QueryIncidentsDto } from '../dto/query-incidents.dto';

// Radio en metros para considerar que un nuevo reporte pertenece
// a un incidente ya existente en vez de crear uno nuevo.
const GROUPING_RADIUS_METERS = 100;

const SEVERITY_RANK: Record<Severity, number> = {
  baja: 1,
  media: 2,
  alta: 3,
};
@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name)
    private incidentModel: Model<IncidentDocument>,
  ) {}

  async findAll(query: QueryIncidentsDto) {
    const { page = 1, limit = 20, type, status, severity, search, sort } = query;

    const filter: FilterQuery<IncidentDocument> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (search) filter.$text = { $search: search };

    const sortOption: Record<string, 1 | -1> =
      sort === 'createdAt' ? { createdAt: 1 } : { createdAt: -1 };

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
      if (c._id === 'activo') summary.activos = c.count;
      if (c._id === 'solucionado') summary.solucionados = c.count;
      if (c._id === 'en_revision') summary.en_revision = c.count;
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

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id proporcionado no tiene un formato válido');
    }

    const incident = await this.incidentModel.findById(id).exec();

    if (!incident) {
      throw new NotFoundException('Incidente no encontrado');
    }

    return { success: true, data: incident };
  }

  async findOrCreateFromReport(params: {
    location: { type: 'Point'; coordinates: number[] };
    type: string;
    description: string;
    severity: string;
  }) {
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

      if (SEVERITY_RANK[severity as Severity] > SEVERITY_RANK[nearby.severity]) {
        nearby.severity = severity as Severity;
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
}