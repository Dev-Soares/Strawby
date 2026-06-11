import { Module } from '@nestjs/common'
import { NotificationTokenService } from './notification-token.service'
import { DatabaseModule } from '../../database/database.module'
import { AuthGuardModule } from 'src/common/guards/auth/auth.module'

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  providers: [NotificationTokenService],
  exports: [NotificationTokenService],
})
export class NotificationTokenModule {}
