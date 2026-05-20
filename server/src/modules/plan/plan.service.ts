import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

type PlanPublic = Pick<Plan, 'id' | 'calories' | 'protein' | 'carbs' | 'fat' | 'userId'>;

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePlanDto): Promise<PlanPublic> {
    try {
      return await this.prisma.plan.create({
        data: {
          calories: dto.calories,
          protein: dto.protein,
          carbs: dto.carbs,
          fat: dto.fat,
          userId,
        },
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, userId: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar plano', {
        p2002: 'Usuário já possui um plano',
      });
    }
  }

  async findByUser(userId: string): Promise<PlanPublic> {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { userId },
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, userId: true },
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
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, userId: true },
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
