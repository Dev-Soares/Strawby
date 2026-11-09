import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
