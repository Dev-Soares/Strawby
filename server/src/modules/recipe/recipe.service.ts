import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddRecipePrivateFoodItemDto } from './dto/add-recipe-private-food-item.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import {
  FoodItemPublic,
  RecipePublic,
  RecipeTotals,
  foodItemSelect,
  recipeSelect,
} from './types';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}

  private computeTotals(items: FoodItemPublic[]): RecipeTotals {
    return items.reduce(
      (initial, item) => ({
        calories: initial.calories + item.calories,
        protein: initial.protein + item.protein,
        carbs: initial.carbs + item.carbs,
        fat: initial.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  async create(patientId: string, dto: CreateRecipeDto): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.create({
        data: {
          name: dto.name,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          patientId,
        },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar receita');
    }
  }

  async findAllByPatient(patientId: string): Promise<RecipePublic[]> {
    try {
      const recipes = await this.prisma.recipe.findMany({
        where: { patientId },
        select: recipeSelect,
        orderBy: { createdAt: 'desc' },
      });
      return recipes.map((recipe) => ({
        ...recipe,
        totals: this.computeTotals(recipe.items),
      }));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar receitas');
    }
  }

  async findOne(id: string, patientId: string): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: { id, patientId },
        select: recipeSelect,
      });

      if (!recipe) throw new NotFoundException('Receita não encontrada');

      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar receita');
    }
  }

  async update(
    id: string,
    patientId: string,
    dto: UpdateRecipeDto,
  ): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.update({
        where: { id, patientId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
        },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar receita', {
        p2025: 'Receita não encontrada',
      });
    }
  }

  async remove(id: string, patientId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.recipe.delete({
        where: { id, patientId },
        select: { id: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar receita', {
        p2025: 'Receita não encontrada',
      });
    }
  }

  async addFoodItem(
    recipeId: string,
    patientId: string,
    dto: AddFoodItemDto,
  ): Promise<FoodItemPublic> {
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
      const updated = await this.prisma.recipe.update({
        where: { id: recipeId, patientId },
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
          items: {
            select: foodItemSelect,
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return updated.items[0];
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar item à receita', {
        p2025: 'Receita não encontrada',
      });
    }
  }

  async addPrivateFoodItem(
    recipeId: string,
    patientId: string,
    dto: AddRecipePrivateFoodItemDto,
  ): Promise<FoodItemPublic> {
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

      const rawServing = privateFood.servingSize
        ? Number(privateFood.servingSize)
        : NaN;
      const servingSize =
        Number.isFinite(rawServing) && rawServing > 0 ? rawServing : 100;
      const ratio = dto.quantity / servingSize;
      const updated = await this.prisma.recipe.update({
        where: { id: recipeId, patientId },
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
          items: {
            select: foodItemSelect,
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return updated.items[0];
    } catch (error) {
      mapPrismaError(error, 'Erro ao adicionar alimento privado à receita', {
        p2025: 'Receita não encontrada',
      });
    }
  }

  async removeItem(
    recipeId: string,
    itemId: string,
    patientId: string,
  ): Promise<{ id: string }> {
    try {
      const result = await this.prisma.foodItem.deleteMany({
        where: { id: itemId, recipeId, recipe: { patientId } },
      });

      if (result.count === 0) {
        throw new NotFoundException('Item não encontrado na receita');
      }

      return { id: itemId };
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover item da receita', {
        p2025: 'Item não encontrado na receita',
      });
    }
  }
}
