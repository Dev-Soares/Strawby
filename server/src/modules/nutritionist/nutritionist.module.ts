import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { NutritionistController } from './nutritionist.controller';
import { NutritionistService } from './nutritionist.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [NutritionistController],
  providers: [NutritionistService],
  exports: [NutritionistService],
})
export class NutritionistModule {}
