import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Crea un nuevo reporte. Si hay un incidente cercano (100m), suma al contador; si no, crea uno nuevo.',
  })
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los reportes' })
  findAll() {
    return this.reportsService.findAll();
  }
}
