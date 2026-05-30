import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateMealDto } from './create-meal.dto';

export class NutritionistCreateMealDto extends CreateMealDto {
  @ApiProperty({ example: 'uuid-do-paciente' })
  @IsString()
  @IsNotEmpty()
  patientId: string;
}
