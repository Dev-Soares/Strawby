import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMealDto {
  @ApiProperty({ example: 'Café da manhã' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'breakfast' })
  @IsString()
  @IsOptional()
  mealType?: string;

  @ApiPropertyOptional({ example: '07:00' })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiPropertyOptional({ example: '2026-04-13T08:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
