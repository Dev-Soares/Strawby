import { Module } from '@nestjs/common';
import { DailyScoreService } from './daily-score.service';
import { DailyScoreController } from './daily-score.controller';
import { DatabaseModule } from '../database/database.module';
import { PlanModule } from '../plan/plan.module';
import { MealModule } from '../meal/meal.module';

@Module({
  controllers: [DailyScoreController],
  providers: [DailyScoreService],
  imports: [
    DatabaseModule,
    PlanModule,
    MealModule,
  ],
})
export class DailyScoreModule {}
