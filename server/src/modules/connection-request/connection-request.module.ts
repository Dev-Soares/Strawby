import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { NutritionistModule } from '../nutritionist/nutritionist.module';
import { ConnectionRequestController } from './connection-request.controller';
import { ConnectionRequestService } from './connection-request.service';
import { NotificationModule } from '../notification/send-notification/notification.module';

@Module({
  imports: [
    DatabaseModule,
    AuthGuardModule,
    NutritionistModule,
    NotificationModule,
  ],
  controllers: [ConnectionRequestController],
  providers: [ConnectionRequestService],
})
export class ConnectionRequestModule {}
