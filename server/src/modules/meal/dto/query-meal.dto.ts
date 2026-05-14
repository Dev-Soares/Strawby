import { ApiPropertyOptional } from '@nestjs/swagger';
import { MealKind } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryMealDto {
  @ApiPropertyOptional({ enum: MealKind, example: MealKind.DAILY })
  @IsEnum(MealKind)
  @IsOptional()
  kind?: MealKind;
}
