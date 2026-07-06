import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { NutritionistController } from './nutritionist.controller';
import { NutritionistService } from './nutritionist.service';
import { NotificationModule } from '../notification/send-notification/notification.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [DatabaseModule, AuthGuardModule, NotificationModule, PatientModule],
  controllers: [NutritionistController],
  providers: [NutritionistService],
  exports: [NutritionistService],
})
export class NutritionistModule {}
