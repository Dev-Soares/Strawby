import { Module } from '@nestjs/common'
import { NotificationTokenService } from './notification-token.service'
import { NotificationTokenController } from './notification-token.controller'
import { DatabaseModule } from '../../database/database.module'
import { AuthGuardModule } from 'src/common/guards/auth/auth.module'

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [NotificationTokenController],
  providers: [NotificationTokenService],
  exports: [NotificationTokenService],
})
export class NotificationTokenModule {}
