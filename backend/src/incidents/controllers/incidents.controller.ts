import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncidentsService } from '../services/incidents.service';
import { QueryIncidentsDto } from '../dto/query-incidents.dto';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos los incidentes (con filtros y paginación opcional)' })
  findAll(@Query() query: QueryIncidentsDto) {
    return this.incidentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene el detalle de un incidente por id' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }
}
