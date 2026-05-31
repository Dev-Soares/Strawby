import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { NutritionistModule } from '../nutritionist/nutritionist.module';
import { ConnectionRequestController } from './connection-request.controller';
import { ConnectionRequestService } from './connection-request.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule, NutritionistModule],
  controllers: [ConnectionRequestController],
  providers: [ConnectionRequestService],
})
export class ConnectionRequestModule {}
