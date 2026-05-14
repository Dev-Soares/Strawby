import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AddPlanMealItemDto } from './dto/add-plan-meal-item.dto';
import { CreatePlanMealDto } from './dto/create-plan-meal.dto';
import { UpdatePlanMealDto } from './dto/update-plan-meal.dto';
import {
  PlanMealItemWithFood,
  PlanMealPublic,
  PlanMealSummary,
  PlanMealTotals,
  planMealItemSelect,
} from './plan-meal.types';

@Injectable()
export class PlanMealService {
  constructor(private readonly prisma: PrismaService) {}

  private computeTotals(items: PlanMealItemWithFood[]): PlanMealTotals {
    return items.reduce(
      (initial, item) => ({
        calories: initial.calories + (item.food.calories / 100) * item.quantity,
        protein: initial.protein + (item.food.protein / 100) * item.quantity,
        carbs: initial.carbs + (item.food.carbs / 100) * item.quantity,
        fat: initial.fat + (item.food.fat / 100) * item.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  async create(userId: string, dto: CreatePlanMealDto): Promise<PlanMealPublic> {
    try {
      const planMeal = await this.prisma.planMeal.create({
        data: {
          name: dto.name,
          date: dto.date ? new Date(dto.date) : undefined,
          userId,
        },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: planMealItemSelect },
        },
      });
      return { ...planMeal, totals: this.computeTotals(planMeal.items) };
    } catch {
      throw new InternalServerErrorException('Erro ao criar refeição planejada');
    }
  }

  async findAllByUser(userId: string): Promise<PlanMealSummary[]> {
    try {
      const planMeals = await this.prisma.planMeal.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: planMealItemSelect },
        },
        orderBy: { date: 'desc' },
      });
      return planMeals.map(({ items, ...planMeal }) => ({
        ...planMeal,
        totals: this.computeTotals(items),
      }));
    } catch {
      throw new InternalServerErrorException('Erro ao buscar refeições planejadas');
    }
  }

  async findOne(id: string, userId: string): Promise<PlanMealPublic> {
    try {
      const planMeal = await this.prisma.planMeal.findFirst({
        where: { id, userId },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: planMealItemSelect },
        },
      });

      if (!planMeal) throw new NotFoundException('Refeição planejada não encontrada');

      return { ...planMeal, totals: this.computeTotals(planMeal.items) };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar refeição planejada');
    }
  }

  async update(id: string, userId: string, dto: UpdatePlanMealDto): Promise<PlanMealPublic> {
    try {
      const planMeal = await this.prisma.planMeal.update({
        where: { id, userId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.date !== undefined && { date: new Date(dto.date) }),
        },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: planMealItemSelect },
        },
      });
      return { ...planMeal, totals: this.computeTotals(planMeal.items) };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Refeição planejada não encontrada');
      }
      throw new InternalServerErrorException('Erro ao atualizar refeição planejada');
    }
  }

  async remove(id: string, userId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.planMeal.delete({
        where: { id, userId },
        select: { id: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Refeição planejada não encontrada');
      }
      throw new InternalServerErrorException('Erro ao deletar refeição planejada');
    }
  }

  async addItem(
    planMealId: string,
    userId: string,
    dto: AddPlanMealItemDto,
  ): Promise<PlanMealItemWithFood> {
    try {
      const updated = await this.prisma.planMeal.update({
        where: { id: planMealId, userId },
        data: {
          items: { create: { foodId: dto.foodId, quantity: dto.quantity } },
        },
        select: {
          items: { select: planMealItemSelect, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });

      return updated.items[0];
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição planejada não encontrada');
        if (error.code === 'P2003') throw new NotFoundException('Alimento não encontrado');
      }
      throw new InternalServerErrorException('Erro ao adicionar item à refeição planejada');
    }
  }

  async removeItem(planMealId: string, itemId: string, userId: string): Promise<{ id: string }> {
    try {
      const { count } = await this.prisma.planMealItem.deleteMany({
        where: { id: itemId, planMeal: { id: planMealId, userId } },
      });

      if (count === 0) throw new NotFoundException('Item não encontrado na refeição planejada');

      return { id: itemId };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao remover item da refeição planejada');
    }
  }
}
