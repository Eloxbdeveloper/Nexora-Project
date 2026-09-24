import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsNumber } from 'class-validator';

export class LocationDto {
  @IsIn(['Point'])
  type: 'Point';

  // [longitud, latitud]
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: number[];
}
