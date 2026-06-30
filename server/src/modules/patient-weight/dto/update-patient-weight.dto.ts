import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsAppDay } from '../../../common/decorators/is-app-day.decorator';

export class UpdatePatientWeightDto {
  @ApiPropertyOptional({ example: 76.0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: '2026-06-15' })
  @IsAppDay()
  @IsOptional()
  date?: string;
}
