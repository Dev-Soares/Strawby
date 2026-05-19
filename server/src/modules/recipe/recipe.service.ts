import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
} from './recipe.types';

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

  async create(userId: string, dto: CreateRecipeDto): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.create({
        data: {
          name: dto.name,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          userId,
        },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch {
      throw new InternalServerErrorException('Erro ao criar receita');
    }
  }

  async findAllByUser(userId: string): Promise<RecipePublic[]> {
    try {
      const recipes = await this.prisma.recipe.findMany({
        where: { userId },
        select: recipeSelect,
        orderBy: { createdAt: 'desc' },
      });
      return recipes.map((recipe) => ({
        ...recipe,
        totals: this.computeTotals(recipe.items),
      }));
    } catch {
      throw new InternalServerErrorException('Erro ao buscar receitas');
    }
  }

  async findOne(id: string, userId: string): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: { id, userId },
        select: recipeSelect,
      });

      if (!recipe) throw new NotFoundException('Receita não encontrada');

      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar receita');
    }
  }

  async update(id: string, userId: string, dto: UpdateRecipeDto): Promise<RecipePublic> {
    try {
      const recipe = await this.prisma.recipe.update({
        where: { id, userId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
        },
        select: recipeSelect,
      });
      return { ...recipe, totals: this.computeTotals(recipe.items) };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Receita não encontrada');
      }
      throw new InternalServerErrorException('Erro ao atualizar receita');
    }
  }

  async remove(id: string, userId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.recipe.delete({
        where: { id, userId },
        select: { id: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Receita não encontrada');
      }
      throw new InternalServerErrorException('Erro ao deletar receita');
    }
  }

  async addFoodItem(recipeId: string, userId: string, dto: AddFoodItemDto): Promise<FoodItemPublic> {
    try {
      const food = await this.prisma.food.findUnique({
        where: { id: dto.foodId },
        select: { id: true, name: true, calories: true, protein: true, carbs: true, fat: true },
      });
      if (!food) throw new NotFoundException('Alimento não encontrado');

      const ratio = dto.quantity / 100;
      const updated = await this.prisma.recipe.update({
        where: { id: recipeId, userId },
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
        if (error.code === 'P2025') throw new NotFoundException('Receita não encontrada');
      }
      throw new InternalServerErrorException('Erro ao adicionar item à receita');
    }
  }

  async addPrivateFoodItem(recipeId: string, userId: string, dto: AddRecipePrivateFoodItemDto): Promise<FoodItemPublic> {
    try {
      const privateFood = await this.prisma.privateFood.findFirst({
        where: { id: dto.privateFoodId, userId },
        select: { id: true, calories: true, protein: true, carbs: true, fat: true, servingSize: true },
      });
      if (!privateFood) throw new NotFoundException('Alimento privado não encontrado');

      const servingSize = privateFood.servingSize ? Number(privateFood.servingSize) : 100;
      const ratio = dto.quantity / servingSize;
      const updated = await this.prisma.recipe.update({
        where: { id: recipeId, userId },
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
        if (error.code === 'P2025') throw new NotFoundException('Receita não encontrada');
      }
      throw new InternalServerErrorException('Erro ao adicionar alimento privado à receita');
    }
  }

  async removeItem(recipeId: string, itemId: string, userId: string): Promise<{ id: string }> {
    try {
      await this.prisma.foodItem.delete({
        where: { id: itemId, recipe: { id: recipeId, userId } },
      });

      return { id: itemId };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Item não encontrado na receita');
      }
      throw new InternalServerErrorException('Erro ao remover item da receita');
    }
  }
}
