import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDailyScoreDto {
  @ApiProperty({ example: '2026-05-20' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
