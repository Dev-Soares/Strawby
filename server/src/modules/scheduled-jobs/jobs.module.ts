import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  providers: [JobsService],
  imports: [DailyScoreModule, PatientModule],
})
export class JobsModule {}