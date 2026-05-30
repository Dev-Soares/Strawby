import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PatientAccessModule } from '../../common/patient-access/patient-access.module';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule, PatientAccessModule],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
