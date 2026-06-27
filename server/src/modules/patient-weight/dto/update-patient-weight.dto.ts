import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdatePatientWeightDto {
  @ApiPropertyOptional({ example: 76.0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: '2026-06-15' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
