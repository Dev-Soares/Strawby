import { Module } from '@nestjs/common';
import { DailyScoreService } from './daily-score.service';
import { DailyScoreController } from './daily-score.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';
import { PlanModule } from '../plan/plan.module';
import { MealModule } from '../meal/meal.module';

@Module({
  imports: [DatabaseModule, AuthGuardModule, PatientAccessModule, PlanModule, MealModule],
  controllers: [DailyScoreController],
  providers: [DailyScoreService],
  exports: [DailyScoreService],
})
export class DailyScoreModule {}
