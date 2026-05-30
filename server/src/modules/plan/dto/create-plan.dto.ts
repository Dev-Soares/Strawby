import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsEnum, IsOptional } from 'class-validator';

export enum Goal {
  Lose = 'lose',
  Gain = 'gain',
}

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

  @ApiPropertyOptional({ example: 1.2 })
  @IsNumber()
  @IsOptional()
  @Min(1.2)
  movementLevel?: number;

  @ApiPropertyOptional({ example: Goal.Lose, enum: Goal })
  @IsEnum(Goal)
  @IsOptional()
  goal?: Goal;
}
