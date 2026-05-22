import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryDailyScoreDto {
  @ApiPropertyOptional({ example: '2026-05-18' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-24' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
