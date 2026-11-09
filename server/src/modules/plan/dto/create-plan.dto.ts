import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsIn } from 'class-validator';
import { ACTIVITY_FACTORS } from '../utils/activity-levels';

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

  @ApiPropertyOptional({
    example: 1.55,
    enum: ACTIVITY_FACTORS,
    description: 'Fator de atividade física — apenas valores da tabela',
  })
  @IsNumber()
  @IsOptional()
  @IsIn(ACTIVITY_FACTORS, {
    message: 'Nível de atividade física inválido',
  })
  movementLevel?: number;
}
