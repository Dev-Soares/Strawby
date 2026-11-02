import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { substitutionGoalValues } from '../types/food-substitution.types';

export class SuggestSubstitutionDto {
  @ApiProperty({ example: 'arroz branco' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  foodName: string;

  @ApiProperty({
    enum: substitutionGoalValues,
    example: 'less-carbs',
  })
  @IsIn(substitutionGoalValues)
  goal: (typeof substitutionGoalValues)[number];

  @ApiProperty({ required: false, example: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  maxResults = 3;
}
