import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
