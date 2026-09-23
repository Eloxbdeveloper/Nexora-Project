import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, isValidObjectId } from 'mongoose';
import { Incident, IncidentDocument } from '../entities/incident.schema';
import { QueryIncidentsDto } from '../dto/query-incidents.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name)
    private incidentModel: Model<IncidentDocument>,
  ) {}

  async findAll(query: QueryIncidentsDto) {
    const { page, limit, type, status, severity } = query;

    const filter: FilterQuery<IncidentDocument> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

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
}