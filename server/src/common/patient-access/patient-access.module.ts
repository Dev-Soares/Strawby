import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../modules/database/database.module';
import { PatientAccessService } from './patient-access.service';

@Module({
  imports: [DatabaseModule],
  providers: [PatientAccessService],
  exports: [PatientAccessService],
})
export class PatientAccessModule {}
