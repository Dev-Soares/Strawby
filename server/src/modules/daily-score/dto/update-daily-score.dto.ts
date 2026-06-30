import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IsAppDay } from '../../../common/decorators/is-app-day.decorator';

export class UpdateDailyScoreDto {
  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsAppDay()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 90 })
  @IsNumber()
  @IsOptional()
  score?: number;
}
