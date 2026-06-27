import { Injectable, NotFoundException } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { appDayRange } from '../../common/utils/date.util';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddMealPrivateFoodItemDto } from './dto/add-meal-private-food-item.dto';
import { AddMealRecipeDto } from './dto/add-meal-recipe.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import {
  FoodItemPublic,
  MealPublic,
  MealTotals,
  RecipeInMeal,
  foodItemSelect,
  mealSelect,
} from './types';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

@Injectable()
export class MealService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  private computeTotals(
    items: FoodItemPublic[],
    recipes: RecipeInMeal[],
  ): MealTotals {
    const sum = (
      arr: { calories: number; protein: number; carbs: number; fat: number }[],
    ) =>
      arr.reduce(
        (acc, i) => ({
          calories: acc.calories + i.calories,
          protein: acc.protein + i.protein,
          carbs: acc.carbs + i.carbs,
          fat: acc.fat + i.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );

    const itemTotals = sum(items);
    const recipeTotals = sum(recipes.map((r) => sum(r.items)));
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
    recipes: { id: string; name: string; items: FoodItemPublic[] }[];
    [key: string]: unknown;
  }): MealPublic {
    const { items, recipes, ...rest } = meal;
    const enrichedRecipes: RecipeInMeal[] = recipes.map((recipe) => {
      const totals = recipe.items.reduce(
        (r, i) => ({
          calories: r.calories + i.calories,
          protein: r.protein + i.protein,
          carbs: r.carbs + i.carbs,
          fat: r.fat + i.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
      return {
        id: recipe.id,
        name: recipe.name,
        ...totals,
        items: recipe.items,
      };
    });
    return {
      ...rest,
      items,
      recipes: enrichedRecipes,
      totals: this.computeTotals(items, enrichedRecipes),
    } as MealPublic;
  }

  async create(
    callerId: string,
    patientId: string,
    dto: CreateMealDto,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const meal = await this.prisma.meal.create({
        data: {
          name: this.mealTypeToName(dto.mealType),
          kind: dto.kind,
          mealType: dto.mealType,
          time: dto.time,
          date: dto.date ? new Date(dto.date) : undefined,
          patientId,
        },
        select: mealSelect,
      });
      return this.toMealPublic(meal);
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar refeição');
    }
  }

  async findAllByPatient(
    callerId: string,
    patientId: string,
    kind?: MealKind,
  ): Promise<MealPublic[]> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const meals = await this.prisma.meal.findMany({
        where: { patientId, ...(kind && { kind }) },
        select: mealSelect,
        orderBy: { date: 'desc' },
      });
      return meals.map((m) => this.toMealPublic(m));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar refeições');
    }
  }

  async findAllByPatientAndDay(
    callerId: string,
    patientId: string,
    day: string,
    kind?: MealKind,
  ): Promise<MealPublic[]> {
    await this.patientAccess.resolve(callerId, patientId);
    return this.queryMealsByDay(patientId, day, kind);
  }

  async queryMealsByDay(
    patientId: string,
    day: string,
    kind?: MealKind,
  ): Promise<MealPublic[]> {
    try {
      const { start, end } = appDayRange(day);
      const meals = await this.prisma.meal.findMany({
        where: {
          patientId,
          ...(kind && { kind }),
          date: { gte: start, lt: end },
        },
        select: mealSelect,
        orderBy: { date: 'asc' },
      });
      return meals.map((m) => this.toMealPublic(m));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar refeições');
    }
  }

  async queryMealsByDayBulk(
    patientIds: string[],
    day: string,
  ): Promise<Map<string, MealPublic[]>> {
    try {
      const { start, end } = appDayRange(day);
      const meals = await this.prisma.meal.findMany({
        where: {
          patientId: { in: patientIds },
          date: { gte: start, lt: end },
          kind: MealKind.DAILY,
        },
        select: mealSelect,
      });
      const map = new Map<string, MealPublic[]>();
      for (const patientId of patientIds) map.set(patientId, []);
      for (const meal of meals)
        map.get(meal.patientId)!.push(this.toMealPublic(meal));
      return map;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar refeições em lote');
    }
  }

  async findOne(
    callerId: string,
    patientId: string,
    id: string,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const meal = await this.prisma.meal.findFirst({
        where: { id, patientId },
        select: mealSelect,
      });
      if (!meal) throw new NotFoundException('Refeição não encontrada');
      return this.toMealPublic(meal);
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar refeição');
    }
  }

  async update(
    callerId: string,
    patientId: string,
    id: string,
    dto: UpdateMealDto,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const meal = await this.prisma.meal.update({
        where: { id, patientId },
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
      mapPrismaError(error, 'Erro ao atualizar refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async remove(
    callerId: string,
    patientId: string,
    id: string,
  ): Promise<{ id: string }> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.meal.delete({
        where: { id, patientId },
        select: { id: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async addFoodItem(
    callerId: string,
    patientId: string,
    mealId: string,
    dto: AddFoodItemDto,
  ): Promise<FoodItemPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const food = await this.prisma.food.findUnique({
        where: { id: dto.foodId },
        select: {
          id: true,
          name: true,
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
        },
      });
      if (!food) throw new NotFoundException('Alimento não encontrado');
      const ratio = dto.quantity / 100;
      const meal = await this.prisma.meal.findFirst({
        where: { id: mealId, patientId },
        select: { id: true },
      });
      if (!meal) throw new NotFoundException('Refeição não encontrada');
      return await this.prisma.foodItem.create({
        data: {
          mealId,
          foodId: food.id,
          quantity: dto.quantity,
          calories: food.calories * ratio,
          protein: food.protein * ratio,
          carbs: food.carbs * ratio,
          fat: food.fat * ratio,
        },
        select: foodItemSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar item à refeição');
    }
  }

  async addPrivateFoodItem(
    callerId: string,
    patientId: string,
    mealId: string,
    dto: AddMealPrivateFoodItemDto,
  ): Promise<FoodItemPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const privateFood = await this.prisma.privateFood.findFirst({
        where: { id: dto.privateFoodId, patientId },
        select: {
          id: true,
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
          servingSize: true,
        },
      });
      if (!privateFood)
        throw new NotFoundException('Alimento privado não encontrado');
      const servingSize = privateFood.servingSize
        ? Number(privateFood.servingSize)
        : 100;
      const ratio = dto.quantity / servingSize;
      const meal = await this.prisma.meal.findFirst({
        where: { id: mealId, patientId },
        select: { id: true },
      });
      if (!meal) throw new NotFoundException('Refeição não encontrada');
      return await this.prisma.foodItem.create({
        data: {
          mealId,
          privateFoodId: privateFood.id,
          quantity: dto.quantity,
          calories: privateFood.calories * ratio,
          protein: privateFood.protein * ratio,
          carbs: privateFood.carbs * ratio,
          fat: privateFood.fat * ratio,
        },
        select: foodItemSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar alimento privado à refeição');
    }
  }

  async updateItem(
    callerId: string,
    patientId: string,
    mealId: string,
    itemId: string,
    dto: UpdateFoodItemDto,
  ): Promise<FoodItemPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const item = await this.prisma.foodItem.findFirst({
        where: { id: itemId, meal: { id: mealId, patientId } },
        select: {
          id: true,
          food: {
            select: { calories: true, protein: true, carbs: true, fat: true },
          },
          privateFood: {
            select: {
              calories: true,
              protein: true,
              carbs: true,
              fat: true,
              servingSize: true,
            },
          },
        },
      });
      if (!item) throw new NotFoundException('Item não encontrado na refeição');
      const base = item.food ?? item.privateFood;
      if (!base) throw new NotFoundException('Alimento base não encontrado');
      const servingSize = item.privateFood?.servingSize
        ? Number(item.privateFood.servingSize)
        : 100;
      const ratio = dto.quantity / servingSize;
      return await this.prisma.foodItem.update({
        where: { id: itemId },
        data: {
          quantity: dto.quantity,
          calories: base.calories * ratio,
          protein: base.protein * ratio,
          carbs: base.carbs * ratio,
          fat: base.fat * ratio,
        },
        select: foodItemSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar item da refeição');
    }
  }

  async removeItem(
    callerId: string,
    patientId: string,
    mealId: string,
    itemId: string,
  ): Promise<{ id: string }> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const { count } = await this.prisma.foodItem.deleteMany({
        where: { id: itemId, meal: { id: mealId, patientId } },
      });
      if (count === 0)
        throw new NotFoundException('Item não encontrado na refeição');
      return { id: itemId };
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover item da refeição');
    }
  }

  async addRecipe(
    callerId: string,
    patientId: string,
    mealId: string,
    dto: AddMealRecipeDto,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: { id: dto.recipeId, patientId },
        select: { id: true },
      });
      if (!recipe) throw new NotFoundException('Receita não encontrada');
      const meal = await this.prisma.meal.update({
        where: { id: mealId, patientId },
        data: { recipes: { connect: { id: recipe.id } } },
        select: mealSelect,
      });
      return this.toMealPublic(meal);
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar receita à refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async removeRecipe(
    callerId: string,
    patientId: string,
    mealId: string,
    recipeId: string,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const meal = await this.prisma.meal.update({
        where: { id: mealId, patientId },
        data: { recipes: { disconnect: { id: recipeId } } },
        select: mealSelect,
      });
      return this.toMealPublic(meal);
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover receita da refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }
}
