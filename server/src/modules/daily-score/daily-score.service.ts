import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DailyScore } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { CreateDailyScoreDto } from './dto/create-daily-score.dto';
import { UpdateDailyScoreDto } from './dto/update-daily-score.dto';
import { MealMacros, MealPublic } from '../meal/meal.types';
import { PlanMacros } from '../plan/plan.types';
import { PlanService } from '../plan/plan.service';
import { MealService } from '../meal/meal.service';

type DailyScorePublic = Pick<
  DailyScore,
  'id' | 'date' | 'score' | 'userId' | 'createdAt' | 'updatedAt'
>;

const dailyScoreSelect = {
  id: true,
  date: true,
  score: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class DailyScoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
    private readonly mealService: MealService,
  ) {}

  async create(
    userId: string,
    dto: CreateDailyScoreDto,
  ): Promise<DailyScorePublic> {
    try {
      return await this.prisma.dailyScore.create({
        data: {
          date: new Date(dto.date),
          score: dto.score,
          userId,
        },
        select: dailyScoreSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar pontuação');
    }
  }

  async findAllByUser(userId: string): Promise<DailyScorePublic[]> {
    try {
      return await this.prisma.dailyScore.findMany({
        where: { userId },
        select: dailyScoreSelect,
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pontuações');
    }
  }

  async findByDay(userId: string, day: string): Promise<DailyScorePublic> {
    try {
      const start = new Date(day + 'T00:00:00.000Z');
      if (isNaN(start.getTime())) {
        throw new BadRequestException('Data inválida');
      }
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      const score = await this.prisma.dailyScore.findFirst({
        where: {
          userId,
          date: {
            gte: start,
            lt: end,
          },
        },
        select: dailyScoreSelect,
      });

      if (!score)
        throw new NotFoundException('Pontuação do dia não encontrada');

      return score;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pontuação do dia');
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDailyScoreDto,
  ): Promise<DailyScorePublic> {
    try {
      return await this.prisma.dailyScore.update({
        where: { id, userId },
        data: {
          ...(dto.date !== undefined && { date: new Date(dto.date) }),
          ...(dto.score !== undefined && { score: dto.score }),
        },
        select: dailyScoreSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar pontuação', {
        p2025: 'Pontuação não encontrada',
      });
    }
  }

  async remove(id: string, userId: string): Promise<DailyScorePublic> {
    try {
      return await this.prisma.dailyScore.delete({
        where: { id, userId },
        select: dailyScoreSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar pontuação', {
        p2025: 'Pontuação não encontrada',
      });
    }
  }

  private async getScoreForDay(userId: string, day: string): Promise<number> {
    try {
      const [meals, plan] = await Promise.all([
        this.mealService.findAllByUserAndDay(userId, day, undefined),
        this.planService.findByUser(userId),
      ]);
      const dayMacros = this.reduceDayMacros(meals);
      const totalScore = this.calculateDailyScore(dayMacros, plan);
      return totalScore;
    } catch (error) {
      mapPrismaError(error, 'Erro ao calcular pontuação do dia');
    }
  }

  // metodo que dilui os macros de todas as refeições do dia para calcular a pontuação diária
  private reduceDayMacros(meals: MealPublic[]): MealMacros {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += meal.totals.calories;
        acc.carbs += meal.totals.carbs;
        acc.protein += meal.totals.protein;
        acc.fat += meal.totals.fat;
        return acc;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
  }

  private calculateDailyScore(
    mealMacros: MealMacros,
    planMacros: PlanMacros,
  ): number {
    const caloriesScore = this.calculateMacroRatio(
      mealMacros.calories,
      planMacros.calories,
    );
    const carbsScore = this.calculateMacroRatio(
      mealMacros.carbs,
      planMacros.carbs,
    );
    const proteinScore = this.calculateMacroRatio(
      mealMacros.protein,
      planMacros.protein,
    );
    const fatScore = this.calculateMacroRatio(mealMacros.fat, planMacros.fat);

    // média ponderada dos macronutrientes, dando mais peso para as calorias
    return (
      caloriesScore * 0.4 +
      carbsScore * 0.2 +
      proteinScore * 0.3 +
      fatScore * 0.1
    );
  }

  // metodo que calcula a porcentagem de divergencia entre o macro do dia e o macro planejado
  private calculateMacroRatio(mealMacro: number, planMacro: number): number {
    // regra de negócio para calcular a pontuação com base na proporção entre o macro do plano e o macro da refeição
    if (planMacro === 0 || mealMacro === 0) return 0;
    const ratio = mealMacro / planMacro;

    const ratioTable = [
      { min: 0.9, max: 1.1, score: 10 },
      { min: 0.8, max: 1.2, score: 8 },
      { min: 0.7, max: 1.3, score: 6 },
      { min: 0.6, max: 1.4, score: 4 },
      { min: 0.5, max: 1.5, score: 2 },
      { min: 0, max: 0.4, score: 0 },
      { min: 1.5, max: Infinity, score: 0 },
    ];

    const macroScore = ratioTable.find(
      (ratioComparison) =>
        ratio >= ratioComparison.min && ratio <= ratioComparison.max,
    );
    return macroScore?.score || 0;
  }
}
