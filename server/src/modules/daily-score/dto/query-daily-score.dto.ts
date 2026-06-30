import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsAppDay } from '../../../common/decorators/is-app-day.decorator';

export class QueryDailyScoreDto {
  @ApiPropertyOptional({ example: '2026-05-18' })
  @IsAppDay()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-24' })
  @IsAppDay()
  @IsOptional()
  endDate?: string;
}
