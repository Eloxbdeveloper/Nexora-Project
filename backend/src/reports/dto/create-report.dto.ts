import { IsIn, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TIPOS_INCIDENTE, GRAVEDADES } from '../../incidents/entities/incident.schema';
import { LocationDto } from './location.dto';

export class CreateReportDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsIn(TIPOS_INCIDENTE, { message: 'El tipo de incidente no es válido' })
  type: string;

  @IsString()
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  description: string;

  @IsIn(GRAVEDADES, { message: 'La gravedad debe ser baja, media o alta' })
  severity: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
