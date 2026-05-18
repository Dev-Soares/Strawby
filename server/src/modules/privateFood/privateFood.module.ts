import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PrivateFoodController } from './privateFood.controller';
import { PrivateFoodService } from './privateFood.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [PrivateFoodController],
  providers: [PrivateFoodService],
})
export class PrivateFoodModule {}
