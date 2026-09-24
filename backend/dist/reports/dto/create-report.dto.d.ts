import { LocationDto } from './location.dto';
export declare class CreateReportDto {
    userId?: string;
    type: string;
    description: string;
    severity: string;
    location: LocationDto;
}
