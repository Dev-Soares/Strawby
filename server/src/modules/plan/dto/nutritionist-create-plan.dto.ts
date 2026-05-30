import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePlanDto } from './create-plan.dto';

export class NutritionistCreatePlanDto extends CreatePlanDto {
  @ApiProperty({ example: 'uuid-do-paciente' })
  @IsString()
  @IsNotEmpty()
  patientId: string;
}
