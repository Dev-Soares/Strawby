import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlanMealDto {
  @ApiProperty({ example: 'Café da manhã' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: '2026-04-13T08:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
