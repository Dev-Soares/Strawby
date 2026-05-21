import { Module } from '@nestjs/common';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
