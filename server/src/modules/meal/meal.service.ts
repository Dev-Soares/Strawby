import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddMealPrivateFoodItemDto } from './dto/add-meal-private-food-item.dto';
import { AddMealRecipeDto } from './dto/add-meal-recipe.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { NutritionistCreateMealDto } from './dto/nutritionist-create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
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

    const recipeTotals = recipes.reduce((initial, recipe) => {
      const rTotals = recipe.items.reduce(
        (r, item) => ({
          calories: r.calories + item.calories,
          protein: r.protein + item.protein,
          carbs: r.carbs + item.carbs,
          fat: r.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
      return {
        calories: initial.calories + rTotals.calories,
        protein: initial.protein + rTotals.protein,
        carbs: initial.carbs + rTotals.carbs,
        fat: initial.fat + rTotals.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

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
      const rTotals = recipe.items.reduce(
        (r, item) => ({
          calories: r.calories + item.calories,
          protein: r.protein + item.protein,
          carbs: r.carbs + item.carbs,
          fat: r.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
      return {
        id: recipe.id,
        name: recipe.name,
        calories: rTotals.calories,
        protein: rTotals.protein,
        carbs: rTotals.carbs,
        fat: rTotals.fat,
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

  async create(patientId: string, dto: CreateMealDto): Promise<MealPublic> {
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

  async createForPatient(nutritionistId: string, dto: NutritionistCreateMealDto): Promise<MealPublic> {
    try {
      const patient = await this.prisma.patient.findFirst({
        where: { id: dto.patientId, nutritionistId },
      });
      if (!patient) throw new NotFoundException('Paciente não encontrado ou não atendido por este nutricionista');

      return await this.create(dto.patientId, dto);
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar refeição para paciente');
    }
  }

  async findAllByPatient(patientId: string, kind?: MealKind): Promise<MealPublic[]> {
    try {
      const meals = await this.prisma.meal.findMany({
        where: { patientId, ...(kind && { kind }) },
        select: mealSelect,
        orderBy: { date: 'desc' },
      });
      return meals.map((meal) => this.toMealPublic(meal));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar refeições');
    }
  }

  async findAllByPatientAndDay(
    patientId: string,
    day: string,
    kind?: MealKind,
  ): Promise<MealPublic[]> {
    try {
      const start = new Date(day + 'T00:00:00.000Z');
      if (isNaN(start.getTime())) {
        throw new BadRequestException('Data inválida');
      }
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      const meals = await this.prisma.meal.findMany({
        where: {
          patientId,
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
      mapPrismaError(error, 'Erro ao buscar refeições');
    }
  }

  async findOne(id: string, patientId: string): Promise<MealPublic> {
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

  async update(id: string, patientId: string, dto: UpdateMealDto): Promise<MealPublic> {
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

  async remove(id: string, patientId: string): Promise<{ id: string }> {
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

  async addFoodItem(mealId: string, patientId: string, dto: AddFoodItemDto): Promise<FoodItemPublic> {
    try {
      const food = await this.prisma.food.findUnique({
        where: { id: dto.foodId },
        select: { id: true, name: true, calories: true, protein: true, carbs: true, fat: true },
      });
      if (!food) throw new NotFoundException('Alimento não encontrado');

      const ratio = dto.quantity / 100;
      const updated = await this.prisma.meal.update({
        where: { id: mealId, patientId },
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
      mapPrismaError(error, 'Erro ao adicionar item à refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async addPrivateFoodItem(mealId: string, patientId: string, dto: AddMealPrivateFoodItemDto): Promise<FoodItemPublic> {
    try {
      const privateFood = await this.prisma.privateFood.findFirst({
        where: { id: dto.privateFoodId, patientId },
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, servingSize: true },
      });
      if (!privateFood) throw new NotFoundException('Alimento privado não encontrado');

      const servingSize = privateFood.servingSize ? Number(privateFood.servingSize) : 100;
      const ratio = dto.quantity / servingSize;
      const updated = await this.prisma.meal.update({
        where: { id: mealId, patientId },
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
      mapPrismaError(error, 'Erro ao adicionar alimento privado à refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async removeItem(mealId: string, itemId: string, patientId: string): Promise<{ id: string }> {
    try {
      const { count } = await this.prisma.foodItem.deleteMany({
        where: { id: itemId, meal: { id: mealId, patientId } },
      });

      if (count === 0) throw new NotFoundException('Item não encontrado na refeição');

      return { id: itemId };
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover item da refeição');
    }
  }

  async addRecipe(mealId: string, patientId: string, dto: AddMealRecipeDto): Promise<MealPublic> {
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: { id: dto.recipeId, patientId },
        select: { id: true },
      });
      if (!recipe) throw new NotFoundException('Receita não encontrada');

      const meal = await this.prisma.meal.update({
        where: { id: mealId, patientId },
        data: {
          recipes: {
            connect: { id: recipe.id },
          },
        },
        select: mealSelect,
      });

      return this.toMealPublic(meal);
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar receita à refeição', {
        p2025: 'Refeição não encontrada',
      });
    }
  }

  async removeRecipe(mealId: string, recipeId: string, patientId: string): Promise<MealPublic> {
    try {
      const meal = await this.prisma.meal.update({
        where: { id: mealId, patientId },
        data: {
          recipes: {
            disconnect: { id: recipeId },
          },
        },
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
