import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';

@Module({
  providers: [JobsService],
  imports: [DailyScoreModule],
})
export class JobsModule {}