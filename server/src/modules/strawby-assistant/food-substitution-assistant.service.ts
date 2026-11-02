import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { SuggestSubstitutionDto } from './dto/suggest-substitution.dto';
import { findPublicFoodMatch } from './utils/food-matching.util';
import {
  buildSubstitutionPrompt,
  SUBSTITUTION_SYSTEM_PROMPT,
} from './prompts/food-substitution.prompts';
import { foodSubstitutionListSchema } from './types/food-substitution.types';

type FoodSubstitutionResult = {
  foodName: string;
  reason: string;
  food: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
};

@Injectable()
export class FoodSubstitutionAssistantService {
  constructor(
    private readonly ai: AiService,
    private readonly food: FoodService,
  ) {}

  async suggest(
    dto: SuggestSubstitutionDto,
  ): Promise<{ substitutions: FoodSubstitutionResult[] }> {
    const maxResults = dto.maxResults ?? 3;

    const extracted = await this.ai.generateObject({
      system: SUBSTITUTION_SYSTEM_PROMPT,
      prompt: buildSubstitutionPrompt(dto.foodName, dto.goal, maxResults),
      schema: foodSubstitutionListSchema,
      temperature: 0.3,
    });

    const substitutions = await this.resolveSubstitutions(
      extracted.substitutions,
      maxResults,
    );

    return { substitutions };
  }

  private async resolveSubstitutions(
    candidates: { foodName: string; reason: string }[],
    maxResults: number,
  ): Promise<FoodSubstitutionResult[]> {
    const limited = candidates.slice(0, maxResults);

    const resolved = await Promise.all(
      limited.map(async (candidate) => {
        const match = await findPublicFoodMatch(candidate.foodName, this.food);
        return {
          foodName: candidate.foodName,
          reason: candidate.reason,
          food: match
            ? {
                id: match.id,
                name: match.name,
                calories: match.calories,
                protein: match.protein,
                carbs: match.carbs,
                fat: match.fat,
              }
            : null,
        };
      }),
    );

    return resolved;
  }
}
