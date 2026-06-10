import { Module } from '@nestjs/common';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PatientAccessModule } from '../../common/patient-access/patient-access.module';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PdfModule } from '../pdf/pdf.module';
import { MealModule } from '../meal/meal.module';

@Module({
  imports: [DatabaseModule, AuthGuardModule, PatientAccessModule, PdfModule, MealModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
