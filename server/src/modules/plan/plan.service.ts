import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { MacroDistribution, PlanMacros, PlanPublic, planSelect } from './types';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePlanDto): Promise<PlanPublic> {
    let recomendedPlan: PlanMacros | null = null;

    if (dto.goal && dto.movementLevel && dto.age && dto.height && dto.weight && dto.gender) {
      recomendedPlan = this.generateRecomendedPlan(dto);
    }

    const planData = recomendedPlan ? recomendedPlan : dto;

    try {
      return await this.prisma.plan.create({
        data: {
          calories: planData.calories,
          protein: planData.protein,
          carbs: planData.carbs,
          fat: planData.fat,
          userId,
        },
        select: planSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar plano', {
        p2002: 'Usuário já possui um plano',
      });
    }
  }

  private generateRecomendedPlan(dto: CreatePlanDto): PlanMacros {

    const userTmb =  this.getUserTmb(dto.weight, dto.height, dto.age, dto.gender);

    const userDailyCalories = userTmb * (dto.movementLevel ?? 1);

    let caloriesForPlan: number; 
    if(dto.goal === 'lose') caloriesForPlan = userDailyCalories - 400;
    else caloriesForPlan = userDailyCalories + 400;

    const macrosNumbers = this.generateMacrosNumbers(caloriesForPlan, dto.goal  ?? 'lose');

    return {
      calories: caloriesForPlan,
      protein: macrosNumbers.protein,
      carbs: macrosNumbers.carbs,
      fat: macrosNumbers.fat
    }
  }

  private generateMacrosNumbers (calories:number, goal: string): MacroDistribution {
    
    let proteinPercentage: number, carbsPercentage: number, fatPercentage: number;

    if (goal === 'lose') {
      proteinPercentage = 0.35;
      carbsPercentage = 0.4;
      fatPercentage = 0.25;
    } else if (goal === 'gain') {
      proteinPercentage = 0.3;
      carbsPercentage = 0.45;
      fatPercentage = 0.25;
    } else {
      proteinPercentage = 0.3;
      carbsPercentage = 0.4;
      fatPercentage = 0.3;
    }
    const proteinGrams = (calories * proteinPercentage) / 4;
    const carbsGrams = (calories * carbsPercentage) / 4;
    const fatGrams = (calories * fatPercentage) / 9;

    return {
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fat: Math.round(fatGrams)
    }

  }
//metodo privado para calcular a Taxa Metabólica Basal (TMB) usando a fórmula de Harris-Benedict
  private getUserTmb (weight: number, height: number, age: number, gender: string) {
    
    const basicTmb = (10 * weight) + (6.25 * height) - (5 * age)
    if (gender === 'male') return basicTmb + 5
    if (gender === 'female') return basicTmb - 161
    return basicTmb

  }

  async findByUser(userId: string): Promise<PlanPublic> {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { userId },
        select: planSelect,
      });

      if (!plan) throw new NotFoundException('Plano não encontrado');

      return plan;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar plano');
    }
  }

  async update(userId: string, dto: UpdatePlanDto): Promise<PlanPublic> {
    try {
      return await this.prisma.plan.update({
        where: { userId },
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

  async remove(userId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.plan.delete({
        where: { userId },
        select: { id: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar plano', {
        p2025: 'Plano não encontrado',
      });
    }
  }
}
