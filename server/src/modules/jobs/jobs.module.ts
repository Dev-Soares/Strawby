import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [JobsService],
  imports: [DailyScoreModule, PatientModule, UserModule],
})
export class JobsModule {}