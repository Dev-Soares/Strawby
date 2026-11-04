import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DailyScoreModule } from '../daily-score/daily-score.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/send-notification/notification.module';
import { NotificationTokenModule } from '../notification/notification-token/notification-token.module';
import { MealModule } from '../meal/meal.module';

@Module({
  providers: [CronService],
  imports: [
    DailyScoreModule,
    PatientModule,
    UserModule,
    NotificationModule,
    NotificationTokenModule,
    MealModule,
  ],
})
export class CronModule {}
