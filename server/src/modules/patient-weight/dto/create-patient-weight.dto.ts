import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IsAppDay } from '../../../common/decorators/is-app-day.decorator';

export class CreatePatientWeightDto {
  @ApiProperty({ example: 75.5 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: '2026-06-15' })
  @IsAppDay()
  @IsNotEmpty()
  date: string;
}
