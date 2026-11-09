import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber } from 'class-validator';
import { ACTIVITY_FACTORS } from '../../plan/utils/activity-levels';

export class PreviewPlanDto {
  @ApiProperty({
    example: 1.55,
    enum: ACTIVITY_FACTORS,
    description: 'Fator de atividade física aplicado sobre a TMB',
  })
  @IsNumber()
  @IsIn(ACTIVITY_FACTORS, { message: 'Nível de atividade física inválido' })
  movementLevel: number;
}
