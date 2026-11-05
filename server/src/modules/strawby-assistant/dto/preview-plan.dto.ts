import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class PreviewPlanDto {
  @ApiProperty({
    example: 1.4,
    description: 'Multiplicador de atividade física sobre a TMB',
  })
  @IsNumber()
  @Min(1.15)
  @Max(1.6)
  movementLevel: number;
}
