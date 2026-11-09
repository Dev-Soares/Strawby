import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { FoodModule } from '../food/food.module';
import { MealModule } from '../meal/meal.module';
import { PlanModule } from '../plan/plan.module';
import { PatientAccessModule } from '../patient-access/patient-access.module';
import { UserModule } from '../user/user.module';
import { StrawbyAssistantController } from './strawby-assistant.controller';
import { MealExtractionAssistantService } from './meal-extraction-assistant.service';
import { MealSuggestionAssistantService } from './meal-suggestion-assistant.service';
import { PlanGenerationAssistantService } from './plan-generation-assistant.service';

@Module({
  imports: [
    AiModule,
    FoodModule,
    MealModule,
    PlanModule,
    PatientAccessModule,
    UserModule,
  ],
  controllers: [StrawbyAssistantController],
  providers: [
    MealExtractionAssistantService,
    MealSuggestionAssistantService,
    PlanGenerationAssistantService,
  ],
})
export class StrawbyAssistantModule {}
