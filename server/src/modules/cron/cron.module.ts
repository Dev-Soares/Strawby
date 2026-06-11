import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/send-notification/notification.module';

@Module({
  providers: [CronService],
  imports: [DailyScoreModule, PatientModule, UserModule, NotificationModule],
})
export class CronModule {}
