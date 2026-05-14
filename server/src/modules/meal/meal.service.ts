import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AddMealItemDto } from './dto/add-meal-item.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealItemWithFood, MealPublic, MealSummary, MealTotals, mealItemSelect } from './meal.types';

@Injectable()
export class MealService {
  constructor(private readonly prisma: PrismaService) {}

  private computeTotals(items: MealItemWithFood[]): MealTotals {
    // Calcula os totais de calorias, proteínas, carboidratos e gorduras com base nos itens da refeição
    return items.reduce(
      (initial, item) => ({
        calories: initial.calories + (item.food.calories / 100) * item.quantity,
        protein: initial.protein + (item.food.protein / 100) * item.quantity,
        carbs: initial.carbs + (item.food.carbs / 100 ) * item.quantity,
        fat: initial.fat + (item.food.fat / 100) * item.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  async create(userId: string, dto: CreateMealDto): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.create({
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
          items: { select: mealItemSelect },
        },
      });
      return { ...meal, totals: this.computeTotals(meal.items) };
    } catch {
      throw new InternalServerErrorException('Erro ao criar refeição');
    }
  }

  async findAllByUser(userId: string): Promise<MealSummary[]> {
    try {
      const meals = await this.prisma.meal.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: mealItemSelect },
        },
        orderBy: { date: 'desc' },
      });
      return meals.map(({ items, ...meal }) => ({
        ...meal,
        totals: this.computeTotals(items),
      }));
    } catch {
      throw new InternalServerErrorException('Erro ao buscar refeições');
    }
  }

  async findOne(id: string, userId: string): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.findFirst({
        where: { id, userId },
        select: {
          id: true,
          name: true,
          date: true,
          userId: true,
          items: { select: mealItemSelect },
        },
      });

      if (!meal) throw new NotFoundException('Refeição não encontrada');

      return { ...meal, totals: this.computeTotals(meal.items) };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar refeição');
    }
  }

  async update(id: string, userId: string, dto: UpdateMealDto): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.update({
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
          items: { select: mealItemSelect },
        },
      });
      return { ...meal, totals: this.computeTotals(meal.items) };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao atualizar refeição');
    }
  }

  async remove(id: string, userId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.meal.delete({
        where: { id, userId },
        select: { id: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao deletar refeição');
    }
  }

  async addItem(mealId: string, userId: string, dto: AddMealItemDto): Promise<MealItemWithFood> {
    try {
      const updated = await this.prisma.meal.update({
        where: { id: mealId, userId },
        data: {
          items: { create: { foodId: dto.foodId, quantity: dto.quantity } },
        },
        select: {
          items: { select: mealItemSelect, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });

      return updated.items[0];
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição não encontrada');
        if (error.code === 'P2003') throw new NotFoundException('Alimento não encontrado');
      }
      throw new InternalServerErrorException('Erro ao adicionar item à refeição');
    }
  }

  async removeItem(mealId: string, itemId: string, userId: string): Promise<{ id: string }> {
    try {
      const { count } = await this.prisma.mealItem.deleteMany({
        where: { id: itemId, meal: { id: mealId, userId } },
      });

      if (count === 0) throw new NotFoundException('Item não encontrado na refeição');

      return { id: itemId };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao remover item da refeição');
    }
  }
}
