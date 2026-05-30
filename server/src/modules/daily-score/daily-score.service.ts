import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../../common/patient-access/patient-access.service';
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
    private readonly patientAccess: PatientAccessService,
    private readonly planService: PlanService,
    private readonly mealService: MealService,
  ) {}

  private parseDay(day: string): Date {
    const start = new Date(day + 'T00:00:00.000Z');
    if (isNaN(start.getTime())) throw new BadRequestException('Data inválida');
    return start;
  }

  async create(callerId: string, patientId: string, dto: CreateDailyScoreDto): Promise<DailyScorePublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const date = this.parseDay(dto.date);
      const score = await this.computeLiveScore(patientId, dto.date);
      return await this.prisma.dailyScore.upsert({
        where: { patientId_date: { patientId, date } },
        create: { date, score, patientId },
        update: { score },
        select: dailyScoreSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar pontuação');
    }
  }

  async findAllByPatient(callerId: string, patientId: string, startDate?: string, endDate?: string): Promise<DailyScorePublic[]> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const where: { patientId: string; date?: { gte?: Date; lte?: Date } } = { patientId };
      if (startDate) where.date = { gte: new Date(startDate) };
      if (endDate) where.date = { ...where.date, lte: new Date(endDate) };
      return await this.prisma.dailyScore.findMany({ where, select: dailyScoreSelect, orderBy: { date: 'desc' } });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pontuações');
    }
  }

  async findByDay(callerId: string, patientId: string, day: string): Promise<DailyScorePublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const start = new Date(day + 'T00:00:00.000Z');
      if (isNaN(start.getTime())) throw new BadRequestException('Data inválida');
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      const score = await this.prisma.dailyScore.findFirst({ where: { patientId, date: { gte: start, lt: end } }, select: dailyScoreSelect });
      if (!score) throw new NotFoundException('Pontuação do dia não encontrada');
      return score;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pontuação do dia');
    }
  }

  async getAverageScore(callerId: string, patientId: string): Promise<number> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const scores = await this.prisma.dailyScore.aggregate({ where: { patientId }, _avg: { score: true }, _count: { score: true } });
      if (scores._count.score === 0) return this.computeLiveScore(patientId, new Date().toISOString().split('T')[0]);
      return scores._avg.score ?? 0;
    } catch (error) {
      mapPrismaError(error, 'Erro ao calcular pontuação média');
    }
  }

  async getLiveScore(callerId: string, patientId: string, day: string): Promise<number> {
    await this.patientAccess.resolve(callerId, patientId);
    return this.computeLiveScore(patientId, day);
  }

  private async computeLiveScore(patientId: string, day: string): Promise<number> {
    const start = new Date(day + 'T00:00:00.000Z');
    if (isNaN(start.getTime())) throw new BadRequestException('Data inválida');
    try {
      const [meals, plan] = await Promise.all([
        this.mealService.queryMealsByDay(patientId, day),
        this.planService.queryPlanByPatient(patientId),
      ]);
      if (!plan) return 0;
      return this.calculateDailyScore(this.reduceDayMacros(meals), plan);
    } catch (error) {
      mapPrismaError(error, 'Erro ao calcular pontuação do dia');
    }
  }

  private reduceDayMacros(meals: MealPublic[]): MealMacros {
    if (!meals?.length) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.totals.calories,
      carbs: acc.carbs + meal.totals.carbs,
      protein: acc.protein + meal.totals.protein,
      fat: acc.fat + meal.totals.fat,
    }), { calories: 0, carbs: 0, protein: 0, fat: 0 });
  }

  private calculateDailyScore(mealMacros: MealMacros, planMacros: PlanMacros): number {
    return (
      this.calculateMacroRatio(mealMacros.calories, planMacros.calories) * 0.4 +
      this.calculateMacroRatio(mealMacros.carbs, planMacros.carbs) * 0.2 +
      this.calculateMacroRatio(mealMacros.protein, planMacros.protein) * 0.3 +
      this.calculateMacroRatio(mealMacros.fat, planMacros.fat) * 0.1
    );
  }

  private calculateMacroRatio(mealMacro: number, planMacro: number): number {
    if (planMacro === 0 || mealMacro === 0) return 0;
    const ratio = mealMacro / planMacro;
    return ratioTable.find(r => ratio >= r.min && ratio <= r.max)?.score ?? 0;
  }
}
