import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDailyScoreDto {
  @ApiProperty({ example: '2026-05-20' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 85.5 })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
