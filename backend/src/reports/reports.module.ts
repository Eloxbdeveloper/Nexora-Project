import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './entities/report.schema';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { IncidentsModule } from '../incidents/incidents.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    IncidentsModule, // para usar IncidentsService.findOrCreateFromReport
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
