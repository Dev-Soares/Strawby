import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PlanMealController } from './plan-meal.controller';
import { PlanMealService } from './plan-meal.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [PlanMealController],
  providers: [PlanMealService],
})
export class PlanMealModule {}
