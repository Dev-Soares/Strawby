import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { mealTypeValues } from '../types/meal-suggestion.types';

export class ConfirmMealItemDto {
  @ApiProperty({ example: '3f1b2c7e-9a4d-4c8b-91a2-6f0d5e8b7c13' })
  @IsUUID()
  @IsNotEmpty()
  foodId: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0.01)
  quantity: number;
}

export class ConfirmMealDto {
  @ApiPropertyOptional({ enum: mealTypeValues, example: 'lunch' })
  @IsOptional()
  @IsIn(mealTypeValues)
  mealType?: (typeof mealTypeValues)[number];

  @ApiPropertyOptional({ example: '12:30' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Horário deve estar no formato HH:MM' })
  time?: string;

  @ApiPropertyOptional({ example: 'Almoço no trabalho' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @ApiProperty({ type: [ConfirmMealItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConfirmMealItemDto)
  items: ConfirmMealItemDto[];
}
