import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { SuggestSubstitutionDto } from './dto/suggest-substitution.dto';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
import { MealExtractionAssistantService } from './meal-extraction-assistant.service';
import { FoodSubstitutionAssistantService } from './food-substitution-assistant.service';
import { MealSuggestionAssistantService } from './meal-suggestion-assistant.service';

@ApiTags('strawby-assistant')
@UseGuards(AuthGuard)
@Controller('strawby-assistant')
export class StrawbyAssistantController {
  constructor(
    private readonly mealExtraction: MealExtractionAssistantService,
    private readonly substitution: FoodSubstitutionAssistantService,
    private readonly suggestion: MealSuggestionAssistantService,
  ) {}

  @Post('create-meal')
  createMeal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SendAssistantMessageDto,
  ) {
    return this.mealExtraction.createMealFromMessage(
      req.user.sub,
      req.user.sub,
      dto,
    );
  }

  @Post('suggest-substitutions')
  suggestSubstitutions(@Body() dto: SuggestSubstitutionDto) {
    return this.substitution.suggest(dto);
  }

  @Post('suggest-snack')
  suggestSnack(@Req() req: AuthenticatedRequest, @Body() dto: SuggestSnackDto) {
    return this.suggestion.suggestSnack(req.user.sub, req.user.sub, dto);
  }
}
