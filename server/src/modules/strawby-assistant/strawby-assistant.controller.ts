import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { ConfirmMealDto } from './dto/confirm-meal.dto';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
import { AddSuggestedMealDto } from './dto/add-suggested-meal.dto';
import { PreviewPlanDto } from './dto/preview-plan.dto';
import { ConfirmPlanDto } from './dto/confirm-plan.dto';
import { MealExtractionAssistantService } from './meal-extraction-assistant.service';
import { MealSuggestionAssistantService } from './meal-suggestion-assistant.service';
import { PlanGenerationAssistantService } from './plan-generation-assistant.service';

@ApiTags('strawby-assistant')
@UseGuards(AuthGuard)
@Controller('strawby-assistant')
export class StrawbyAssistantController {
  constructor(
    private readonly mealExtraction: MealExtractionAssistantService,
    private readonly suggestion: MealSuggestionAssistantService,
    private readonly planGeneration: PlanGenerationAssistantService,
  ) {}

  /**
   * Único endpoint do assistente que chama o LLM — cada request é uma chamada
   * paga. O limite é por IP (tracker padrão do ThrottlerGuard) e serve como
   * teto de abuso, não como cota: residência e rede móvel compartilham IP,
   * então a contagem justa por usuário fica no `assistantUsage`.
   */
  @Post('preview-meal')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
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
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  confirmMeal(@Req() req: AuthenticatedRequest, @Body() dto: ConfirmMealDto) {
    return this.mealExtraction.confirmMeal(req.user.sub, req.user.sub, dto);
  }

  @Post('suggest-snack')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
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
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  addSuggestedMeal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddSuggestedMealDto,
  ) {
    return this.suggestion.addSuggestedMeal(req.user.sub, req.user.sub, dto);
  }

  @Post('preview-plan')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  previewPlan(@Req() req: AuthenticatedRequest, @Body() dto: PreviewPlanDto) {
    return this.planGeneration.previewPlan(req.user.sub, req.user.sub, dto);
  }

  @Post('confirm-plan')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  confirmPlan(@Req() req: AuthenticatedRequest, @Body() dto: ConfirmPlanDto) {
    return this.planGeneration.confirmPlan(req.user.sub, req.user.sub, dto);
  }
}
