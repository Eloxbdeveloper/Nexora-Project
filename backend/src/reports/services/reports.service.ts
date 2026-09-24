import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../entities/report.schema';
import { CreateReportDto } from '../dto/create-report.dto';
import { IncidentsService } from '../../incidents/services/incidents.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    private incidentsService: IncidentsService,
  ) {}

  async create(dto: CreateReportDto) {
    const [lng, lat] = dto.location.coordinates;

    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new BadRequestException('Las coordenadas están fuera de rango válido');
    }

    const location = { type: 'Point' as const, coordinates: [lng, lat] };

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
}
