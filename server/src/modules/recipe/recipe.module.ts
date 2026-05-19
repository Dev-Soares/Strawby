import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [DatabaseModule, AuthGuardModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
