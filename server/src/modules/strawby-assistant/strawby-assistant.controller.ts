import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { ConfirmMealDto } from './dto/confirm-meal.dto';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
import { AddSuggestedMealDto } from './dto/add-suggested-meal.dto';
import { MealExtractionAssistantService } from './meal-extraction-assistant.service';
import { MealSuggestionAssistantService } from './meal-suggestion-assistant.service';

@ApiTags('strawby-assistant')
@UseGuards(AuthGuard)
@Controller('strawby-assistant')
export class StrawbyAssistantController {
  constructor(
    private readonly mealExtraction: MealExtractionAssistantService,
    private readonly suggestion: MealSuggestionAssistantService,
  ) {}

  @Post('preview-meal')
  previewMeal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SendAssistantMessageDto,
  ) {
    return this.mealExtraction.previewMealFromMessage(
      req.user.sub,
      req.user.sub,
      dto,
    );
  }

  @Post('confirm-meal')
  confirmMeal(@Req() req: AuthenticatedRequest, @Body() dto: ConfirmMealDto) {
    return this.mealExtraction.confirmMeal(req.user.sub, req.user.sub, dto);
  }

  @Post('suggest-snack')
  async suggestSnack(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SuggestSnackDto,
  ) {
    const { remaining, options } = await this.suggestion.suggestSnack(
      req.user.sub,
      req.user.sub,
      dto,
    );
    return { remaining, options };
  }

  @Post('add-suggested-meal')
  addSuggestedMeal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddSuggestedMealDto,
  ) {
    return this.suggestion.addSuggestedMeal(req.user.sub, req.user.sub, dto);
  }
}
