import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../patient-access/patient-access.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  private computeTotals(items: FoodItemPublic[]): RecipeTotals {
    return items.reduce(
      (acc, i) => ({
        calories: acc.calories + i.calories,
        protein: acc.protein + i.protein,
        carbs: acc.carbs + i.carbs,
        fat: acc.fat + i.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  async create(
    callerId: string,
    patientId: string,
    dto: CreateRecipeDto,
  ): Promise<RecipePublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const recipe = await this.prisma.recipe.create({
        data: { name: dto.name, patientId },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar receita');
    }
  }

  async findAllByPatient(
    callerId: string,
    patientId: string,
  ): Promise<RecipePublic[]> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const recipes = await this.prisma.recipe.findMany({
        where: { patientId },
        select: recipeSelect,
        orderBy: { createdAt: 'desc' },
      });
      return recipes.map((r) => ({
        ...r,
        totals: this.computeTotals(r.items),
      }));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar receitas');
    }
  }

  async findOne(
    callerId: string,
    patientId: string,
    id: string,
  ): Promise<RecipePublic> {
    await this.patientAccess.resolve(callerId, patientId);
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
    callerId: string,
    patientId: string,
    id: string,
    dto: UpdateRecipeDto,
  ): Promise<RecipePublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const recipe = await this.prisma.recipe.update({
        where: { id, patientId },
        data: { ...(dto.name !== undefined && { name: dto.name }) },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar receita', {
        p2025: 'Receita não encontrada',
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
    callerId: string,
    patientId: string,
    recipeId: string,
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
      const recipe = await this.prisma.recipe.findFirst({
        where: { id: recipeId, patientId },
        select: { id: true },
      });
      if (!recipe) throw new NotFoundException('Receita não encontrada');
      return await this.prisma.foodItem.create({
        data: {
          recipeId,
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
      mapPrismaError(error, 'Erro ao adicionar item à receita');
    }
  }

  async addPrivateFoodItem(
    callerId: string,
    patientId: string,
    recipeId: string,
    dto: AddRecipePrivateFoodItemDto,
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
      const rawServing = privateFood.servingSize
        ? Number(privateFood.servingSize)
        : NaN;
      const servingSize =
        Number.isFinite(rawServing) && rawServing > 0 ? rawServing : 100;
      const ratio = dto.quantity / servingSize;
      const recipe = await this.prisma.recipe.findFirst({
        where: { id: recipeId, patientId },
        select: { id: true },
      });
      if (!recipe) throw new NotFoundException('Receita não encontrada');
      return await this.prisma.foodItem.create({
        data: {
          recipeId,
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
      mapPrismaError(error, 'Erro ao adicionar alimento privado à receita');
    }
  }

  async removeItem(
    callerId: string,
    patientId: string,
    recipeId: string,
    itemId: string,
  ): Promise<{ id: string }> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const result = await this.prisma.foodItem.deleteMany({
        where: { id: itemId, recipeId, recipe: { patientId } },
      });
      if (result.count === 0)
        throw new NotFoundException('Item não encontrado na receita');
      return { id: itemId };
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover item da receita', {
        p2025: 'Item não encontrado na receita',
      });
    }
  }
}
