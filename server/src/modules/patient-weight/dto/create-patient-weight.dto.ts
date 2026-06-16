import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePatientWeightDto {
  @ApiProperty({ example: 75.5 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
