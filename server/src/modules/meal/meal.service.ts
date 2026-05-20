import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MealKind, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddMealPrivateFoodItemDto } from './dto/add-meal-private-food-item.dto';
import { AddMealRecipeDto } from './dto/add-meal-recipe.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import {
  FoodItemPublic,
  MealPublic,
  MealTotals,
  RecipeInMeal,
  foodItemSelect,
  mealSelect,
} from './meal.types';

@Injectable()
export class MealService {
  constructor(private readonly prisma: PrismaService) {}

  private computeTotals(items: FoodItemPublic[], recipes: RecipeInMeal[]): MealTotals {
    const itemTotals = items.reduce(
      (initial, item) => ({
        calories: initial.calories + item.calories,
        protein: initial.protein + item.protein,
        carbs: initial.carbs + item.carbs,
        fat: initial.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const recipeTotals = recipes.reduce(
      (initial, recipe) => ({
        calories: initial.calories + recipe.calories,
        protein: initial.protein + recipe.protein,
        carbs: initial.carbs + recipe.carbs,
        fat: initial.fat + recipe.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    return {
      calories: itemTotals.calories + recipeTotals.calories,
      protein: itemTotals.protein + recipeTotals.protein,
      carbs: itemTotals.carbs + recipeTotals.carbs,
      fat: itemTotals.fat + recipeTotals.fat,
    };
  }

  private mealTypeToName(mealType?: string): string {
    const map: Record<string, string> = {
      breakfast: 'Café da manhã',
      lunch: 'Almoço',
      snack: 'Lanche',
      dinner: 'Jantar',
      supper: 'Ceia',
    };
    return map[mealType ?? ''] ?? 'Refeição';
  }

  private toMealPublic(meal: {
    items: FoodItemPublic[];
    recipes: RecipeInMeal[];
    [key: string]: unknown;
  }): MealPublic {
    const { items, recipes, ...rest } = meal;
    return {
      ...rest,
      items,
      recipes,
      totals: this.computeTotals(items, recipes),
    } as MealPublic;
  }

  async create(userId: string, dto: CreateMealDto): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.create({
        data: {
          name: this.mealTypeToName(dto.mealType),
          kind: dto.kind,
          mealType: dto.mealType,
          time: dto.time,
          date: dto.date ? new Date(dto.date) : undefined,
          userId,
        },
        select: mealSelect,
      });
      return this.toMealPublic(meal);
    } catch {
      throw new InternalServerErrorException('Erro ao criar refeição');
    }
  }

  async findAllByUser(userId: string, kind?: MealKind): Promise<MealPublic[]> {
    try {
      const meals = await this.prisma.meal.findMany({
        where: { userId, ...(kind && { kind }) },
        select: mealSelect,
        orderBy: { date: 'desc' },
      });
      return meals.map((meal) => this.toMealPublic(meal));
    } catch {
      throw new InternalServerErrorException('Erro ao buscar refeições');
    }
  }

  async findAllByUserAndDay(
    userId: string,
    day: string,
    kind?: MealKind,
  ): Promise<MealPublic[]> {
    try {
      const start = new Date(day + 'T00:00:00.000Z');
      if (isNaN(start.getTime())) {
        throw new InternalServerErrorException('Data inválida');
      }
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      const meals = await this.prisma.meal.findMany({
        where: {
          userId,
          ...(kind && { kind }),
          date: {
            gte: start,
            lt: end,
          },
        },
        select: mealSelect,
        orderBy: { date: 'asc' },
      });
      return meals.map((meal) => this.toMealPublic(meal));
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException('Erro ao buscar refeições');
    }
  }

  async findOne(id: string, userId: string): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.findFirst({
        where: { id, userId },
        select: mealSelect,
      });

      if (!meal) throw new NotFoundException('Refeição não encontrada');

      return this.toMealPublic(meal);
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
          ...(dto.mealType !== undefined && { mealType: dto.mealType }),
          ...(dto.time !== undefined && { time: dto.time }),
          ...(dto.date !== undefined && { date: new Date(dto.date) }),
        },
        select: mealSelect,
      });
      return this.toMealPublic(meal);
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

  async addFoodItem(mealId: string, userId: string, dto: AddFoodItemDto): Promise<FoodItemPublic> {
    try {
      const food = await this.prisma.food.findUnique({
        where: { id: dto.foodId },
        select: { id: true, name: true, calories: true, protein: true, carbs: true, fat: true },
      });
      if (!food) throw new NotFoundException('Alimento não encontrado');

      const ratio = dto.quantity / 100;
      const updated = await this.prisma.meal.update({
        where: { id: mealId, userId },
        data: {
          items: {
            create: {
              foodId: food.id,
              quantity: dto.quantity,
              calories: food.calories * ratio,
              protein: food.protein * ratio,
              carbs: food.carbs * ratio,
              fat: food.fat * ratio,
            },
          },
        },
        select: {
          items: { select: foodItemSelect, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });

      return updated.items[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao adicionar item à refeição');
    }
  }

  async addPrivateFoodItem(mealId: string, userId: string, dto: AddMealPrivateFoodItemDto): Promise<FoodItemPublic> {
    try {
      const privateFood = await this.prisma.privateFood.findFirst({
        where: { id: dto.privateFoodId, userId },
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, servingSize: true },
      });
      if (!privateFood) throw new NotFoundException('Alimento privado não encontrado');

      const servingSize = privateFood.servingSize ? Number(privateFood.servingSize) : 100;
      const ratio = dto.quantity / servingSize;
      const updated = await this.prisma.meal.update({
        where: { id: mealId, userId },
        data: {
          items: {
            create: {
              privateFoodId: privateFood.id,
              quantity: dto.quantity,
              calories: privateFood.calories * ratio,
              protein: privateFood.protein * ratio,
              carbs: privateFood.carbs * ratio,
              fat: privateFood.fat * ratio,
            },
          },
        },
        select: {
          items: { select: foodItemSelect, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });

      return updated.items[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao adicionar alimento privado à refeição');
    }
  }

  async removeItem(mealId: string, itemId: string, userId: string): Promise<{ id: string }> {
    try {
      const { count } = await this.prisma.foodItem.deleteMany({
        where: { id: itemId, meal: { id: mealId, userId } },
      });

      if (count === 0) throw new NotFoundException('Item não encontrado na refeição');

      return { id: itemId };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao remover item da refeição');
    }
  }

  async addRecipe(mealId: string, userId: string, dto: AddMealRecipeDto): Promise<MealPublic> {
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: { id: dto.recipeId, userId },
        select: { id: true },
      });
      if (!recipe) throw new NotFoundException('Receita não encontrada');

      const meal = await this.prisma.meal.update({
        where: { id: mealId, userId },
        data: {
          recipes: {
            connect: { id: recipe.id },
          },
        },
        select: mealSelect,
      });

      return this.toMealPublic(meal);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao adicionar receita à refeição');
    }
  }

  async removeRecipe(mealId: string, recipeId: string, userId: string): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.update({
        where: { id: mealId, userId },
        data: {
          recipes: {
            disconnect: { id: recipeId },
          },
        },
        select: mealSelect,
      });

      return this.toMealPublic(meal);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Refeição não encontrada');
      }
      throw new InternalServerErrorException('Erro ao remover receita da refeição');
    }
  }
}
