import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealKind } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMealDto {
  @ApiProperty({ enum: MealKind, example: MealKind.DAILY })
  @IsEnum(MealKind)
  @IsNotEmpty()
  kind: MealKind;

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
