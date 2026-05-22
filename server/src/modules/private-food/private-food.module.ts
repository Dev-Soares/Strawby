import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PrivateFoodController } from './private-food.controller';
import { PrivateFoodService } from './private-food.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [PrivateFoodController],
  providers: [PrivateFoodService],
})
export class PrivateFoodModule {}
