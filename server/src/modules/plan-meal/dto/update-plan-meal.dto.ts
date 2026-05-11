import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePlanMealDto {
  @ApiPropertyOptional({ example: 'Almoço' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: '2026-04-13T12:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
