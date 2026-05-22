import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { CreateDailyScoreDto } from './dto/create-daily-score.dto';
import { UpdateDailyScoreDto } from './dto/update-daily-score.dto';
import { MealMacros, MealPublic } from '../meal/types';
import { PlanMacros } from '../plan/types';
import { PlanService } from '../plan/plan.service';
import { MealService } from '../meal/meal.service';
import { ratioTable } from './utils/ratio-table';
import { DailyScorePublic, dailyScoreSelect } from './types';

@Injectable()
export class DailyScoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
    private readonly mealService: MealService,
  ) {}

  private parseDay(day: string): Date {
    const start = new Date(day + 'T00:00:00.000Z');
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Data inválida');
    }
    return start;
  }

  async create(
    userId: string,
    dto: CreateDailyScoreDto,
  ): Promise<DailyScorePublic> {
    try {
      const date = this.parseDay(dto.date);
      const score = await this.generateLiveScore(userId, dto.date);

      return await this.prisma.dailyScore.upsert({
        where: { userId_date: { userId, date } },
        create: { date, score, userId },
        update: { score },
        select: dailyScoreSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar pontuação');
    }
  }

  async findAllByUser(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<DailyScorePublic[]> {
    try {
      const where: { userId: string; date?: { gte?: Date; lte?: Date } } = {
        userId,
      };

      if (startDate) where.date = { gte: new Date(startDate) };
      if (endDate) where.date = { ...where.date, lte: new Date(endDate) };

      return await this.prisma.dailyScore.findMany({
        where,
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

  async getAverageScoreByUser(userId: string): Promise<number> {
    try {
      const scores = await this.prisma.dailyScore.aggregate({
        where: { userId },
        _avg: { score: true },
        _count: { score: true },
      });

      if (scores._count.score === 0) {
        return this.generateLiveScore(
          userId,
          new Date().toISOString().split('T')[0],
        );
      }
      return scores._avg.score ?? 0;
    } catch (error) {
      mapPrismaError(error, 'Erro ao calcular pontuação média');
    }
  }

  async generateLiveScore(userId: string, day: string): Promise<number> {
    const start = new Date(day + 'T00:00:00.000Z');
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Data inválida');
    }
    try {
      const [meals, plan] = await Promise.all([
        this.mealService.findAllByUserAndDay(userId, day, undefined),
        this.planService.findByUser(userId),
      ]);
      if (!plan) return 0; // se não tiver plano, a pontuação é 0
      const dayMacros = this.reduceDayMacros(meals);
      const totalScore = this.calculateDailyScore(dayMacros, plan);
      return totalScore;
    } catch (error) {
      mapPrismaError(error, 'Erro ao calcular pontuação do dia');
    }
  }

  // metodo que dilui os macros de todas as refeições do dia para calcular a pontuação diária
  private reduceDayMacros(meals: MealPublic[]): MealMacros {
    if (!meals || meals.length === 0)
      return { calories: 0, carbs: 0, protein: 0, fat: 0 };
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

    const macroScore = ratioTable.find(
      (ratioComparison) =>
        ratio >= ratioComparison.min && ratio <= ratioComparison.max,
    );
    return macroScore?.score || 0;
  }

  async remove(id: string, userId: string): Promise<DailyScorePublic> {
    try {
      const existing = await this.prisma.dailyScore.findFirst({
        where: { id, userId },
        select: dailyScoreSelect,
      });
      if (!existing) throw new NotFoundException('Pontuação não encontrada');

      await this.prisma.dailyScore.delete({ where: { id } });
      return existing;
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar pontuação', {
        p2025: 'Pontuação não encontrada',
      });
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDailyScoreDto,
  ): Promise<DailyScorePublic> {
    try {
      const existing = await this.prisma.dailyScore.findFirst({
        where: { id, userId },
        select: { id: true },
      });
      if (!existing) throw new NotFoundException('Pontuação não encontrada');

      return await this.prisma.dailyScore.update({
        where: { id },
        data: {
          ...(dto.date !== undefined && { date: this.parseDay(dto.date) }),
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
}
