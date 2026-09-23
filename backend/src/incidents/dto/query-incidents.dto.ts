import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ESTADOS, GRAVEDADES, TIPOS_INCIDENTE } from '../entities/incident.schema';

export class QueryIncidentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsIn(TIPOS_INCIDENTE)
  type?: string;

  @IsOptional()
  @IsIn(ESTADOS)
  status?: string;

  @IsOptional()
  @IsIn(GRAVEDADES)
  severity?: string;
}
