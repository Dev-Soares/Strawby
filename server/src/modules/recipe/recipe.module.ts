import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule, PatientAccessModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
