import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { MacroDistribution, PlanMacros, PlanPublic, planSelect } from './types';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(patientId: string, dto: CreatePlanDto): Promise<PlanPublic> {
    let planData: PlanMacros;

    if (dto.goal && dto.movementLevel && dto.age && dto.height && dto.weight && dto.gender) {
      planData = this.generateRecomendedPlan(dto);
    } else if (dto.calories !== undefined && dto.protein !== undefined && dto.carbs !== undefined && dto.fat !== undefined) {
      planData = { calories: dto.calories, protein: dto.protein, carbs: dto.carbs, fat: dto.fat };
    } else {
      throw new BadRequestException('Informe as macros manualmente ou os dados para cálculo automático');
    }

    try {
      return await this.prisma.plan.create({
        data: { ...planData, patientId },
        select: planSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar plano', {
        p2002: 'Paciente já possui um plano',
      });
    }
  }

  private generateRecomendedPlan(dto: CreatePlanDto): PlanMacros {

    const userTmb = this.getUserTmb(dto.weight!, dto.height!, dto.age!, dto.gender!);

    const userDailyCalories = userTmb * dto.movementLevel!;

    let caloriesForPlan: number;
    if (dto.goal === 'lose') caloriesForPlan = userDailyCalories - 400;
    else caloriesForPlan = userDailyCalories + 400;

    const macrosNumbers = this.generateMacrosNumbers(caloriesForPlan, dto.goal!, dto.weight!);

    return {
      calories: Math.round(caloriesForPlan),
      protein: macrosNumbers.protein,
      carbs: macrosNumbers.carbs,
      fat: macrosNumbers.fat
    }
  }

  private generateMacrosNumbers(calories: number, goal: string, weight: number): MacroDistribution {
    const proteinPerKg = goal === 'lose' ? 2.0 : 1.8;
    const fatPerKg = goal === 'lose' ? 0.8 : 1.0;

    const protein = Math.round(weight * proteinPerKg);
    const fat = Math.round(weight * fatPerKg);
    const remaining = calories - (protein * 4) - (fat * 9);
    const carbs = Math.round(Math.max(remaining, 0) / 4);

    return { protein, carbs, fat };
  }
  // Mifflin-St Jeor (1990) — fórmula mais precisa para TMB
  private getUserTmb (weight: number, height: number, age: number, gender: string) {
    
    const basicTmb = (10 * weight) + (6.25 * height) - (5 * age)
    if (gender === 'male') return basicTmb + 5
    if (gender === 'female') return basicTmb - 161
    return basicTmb

  }

  async findByPatient(patientId: string): Promise<PlanPublic | null> {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { patientId },
        select: planSelect,
      });

      return plan ?? null;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar plano');
    }
  }

  async update(patientId: string, dto: UpdatePlanDto): Promise<PlanPublic> {
    try {
      return await this.prisma.plan.update({
        where: { patientId },
        data: {
          ...(dto.calories !== undefined && { calories: dto.calories }),
          ...(dto.protein !== undefined && { protein: dto.protein }),
          ...(dto.carbs !== undefined && { carbs: dto.carbs }),
          ...(dto.fat !== undefined && { fat: dto.fat }),
        },
        select: planSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar plano', {
        p2025: 'Plano não encontrado',
      });
    }
  }

  async remove(patientId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.plan.delete({
        where: { patientId },
        select: { id: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar plano', {
        p2025: 'Plano não encontrado',
      });
    }
  }
}
