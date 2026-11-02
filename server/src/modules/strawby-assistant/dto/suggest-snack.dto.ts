import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { mealTypeValues } from '../types/meal-suggestion.types';

export class SuggestSnackDto {
  @ApiProperty({
    enum: mealTypeValues,
    required: false,
    example: 'snack',
  })
  @IsOptional()
  @IsIn(mealTypeValues)
  mealType?: (typeof mealTypeValues)[number];

  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  maxResults?: number = 3;
}
