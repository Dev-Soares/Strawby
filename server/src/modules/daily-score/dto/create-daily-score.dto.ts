import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsAppDay } from '../../../common/decorators/is-app-day.decorator';

export class CreateDailyScoreDto {
  @ApiProperty({ example: '2026-05-20' })
  @IsAppDay()
  @IsNotEmpty()
  date: string;
}
