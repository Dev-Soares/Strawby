import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsEnum, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @ApiPropertyOptional({ example: 2000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  protein?: number;

  @ApiPropertyOptional({ example: 250 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  carbs?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fat?: number;

  @ApiPropertyOptional({ example: 1.4 })
  @IsNumber()
  @IsOptional()
  @Min(1.15)
  movementLevel?: number;
}
