import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { mealTypeValues } from '../types/meal-suggestion.types';

export class AddSuggestedMealDto {
  @ApiProperty({
    enum: mealTypeValues,
    example: 'snack',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(mealTypeValues)
  mealType: (typeof mealTypeValues)[number];

  @ApiProperty({ example: 'Iogurte grego com frutas' })
  @IsString()
  @IsNotEmpty()
  mealName: string;
}
