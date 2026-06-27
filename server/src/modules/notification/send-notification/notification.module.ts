import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationTokenModule } from '../notification-token/notification-token.module';

@Module({
  imports: [FirebaseModule, NotificationTokenModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
