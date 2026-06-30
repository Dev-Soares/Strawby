import { Module } from '@nestjs/common';
import { PatientWeightService } from './patient-weight.service';
import { PatientWeightController } from './patient-weight.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';

@Module({
  imports: [DatabaseModule, AuthGuardModule, PatientAccessModule],
  controllers: [PatientWeightController],
  providers: [PatientWeightService],
  exports: [PatientWeightService],
})
export class PatientWeightModule {}
