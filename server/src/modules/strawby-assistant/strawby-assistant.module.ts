import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { FoodModule } from '../food/food.module';
import { MealModule } from '../meal/meal.module';
import { StrawbyAssistantController } from './strawby-assistant.controller';
import { StrawbyAssistantService } from './strawby-assistant.service';

@Module({
  imports: [AiModule, FoodModule, MealModule],
  controllers: [StrawbyAssistantController],
  providers: [StrawbyAssistantService],
})
export class StrawbyAssistantModule {}
