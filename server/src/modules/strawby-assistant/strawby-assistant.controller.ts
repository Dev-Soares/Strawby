import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
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
}
