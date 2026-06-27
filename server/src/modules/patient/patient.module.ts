import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';
import { DailyScoreModule } from '../daily-score/daily-score.module';

@Module({
  imports: [
    DatabaseModule,
    AuthGuardModule,
    PatientAccessModule,
    DailyScoreModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
