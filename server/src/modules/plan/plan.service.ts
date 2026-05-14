import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Usuário já possui um plano');
      }
      throw new InternalServerErrorException('Erro ao criar plano');
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
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar plano');
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Plano não encontrado');
      }
      throw new InternalServerErrorException('Erro ao atualizar plano');
    }
  }

  async remove(userId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.plan.delete({
        where: { userId },
        select: { id: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Plano não encontrado');
      }
      throw new InternalServerErrorException('Erro ao deletar plano');
    }
  }
}
