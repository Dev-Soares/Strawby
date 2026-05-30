import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UpdatePlanDto } from './update-plan.dto';

export class NutritionistUpdatePlanDto extends UpdatePlanDto {
  @ApiProperty({ example: 'uuid-do-paciente' })
  @IsString()
  @IsNotEmpty()
  patientId: string;
}
