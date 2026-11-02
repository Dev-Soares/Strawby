import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { FoodModule } from '../food/food.module';
import { MealModule } from '../meal/meal.module';
import { PlanModule } from '../plan/plan.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';
import { StrawbyAssistantController } from './strawby-assistant.controller';
import { MealExtractionAssistantService } from './meal-extraction-assistant.service';
import { FoodSubstitutionAssistantService } from './food-substitution-assistant.service';
import { MealSuggestionAssistantService } from './meal-suggestion-assistant.service';

@Module({
  imports: [AiModule, FoodModule, MealModule, PlanModule, PatientAccessModule],
  controllers: [StrawbyAssistantController],
  providers: [
    MealExtractionAssistantService,
    FoodSubstitutionAssistantService,
    MealSuggestionAssistantService,
  ],
})
export class StrawbyAssistantModule {}
