import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/send-notification/notification.module';

@Module({
  providers: [JobsService],
  imports: [DailyScoreModule, PatientModule, UserModule, NotificationModule],
})
export class JobsModule {}