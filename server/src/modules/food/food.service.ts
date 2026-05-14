import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { rankByRelevance, splitSearchWords } from '../../common/utils/search.utils';
import { PrismaService } from '../database/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodPublic, foodSelect } from './food.types';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFoodDto): Promise<FoodPublic> {
    try {
      return await this.prisma.food.create({
        data: dto as Prisma.FoodCreateInput,
        select: foodSelect,
      });
    } catch {
      throw new InternalServerErrorException('Erro ao criar alimento');
    }
  }

  async findAll(): Promise<FoodPublic[]> {
    try {
      return await this.prisma.food.findMany({
        select: foodSelect,
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar alimentos');
    }
  }

  async findOne(id: string): Promise<FoodPublic> {
    try {
      const food = await this.prisma.food.findUnique({
        where: { id },
        select: foodSelect,
      });
      if (!food) throw new NotFoundException('Alimento não encontrado');
      return food;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar alimento');
    }
  }

  async update(id: string, dto: UpdateFoodDto): Promise<FoodPublic> {
    try {
      return await this.prisma.food.update({
        where: { id },
        data: dto,
        select: foodSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Alimento não encontrado');
      }
      throw new InternalServerErrorException('Erro ao atualizar alimento');
    }
  }

  async remove(id: string): Promise<FoodPublic> {
    try {
      return await this.prisma.food.delete({
        where: { id },
        select: foodSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Alimento não encontrado');
      }
      throw new InternalServerErrorException('Erro ao deletar alimento');
    }
  }

  async search(query: string): Promise<FoodPublic[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const words = splitSearchWords(trimmed);

    try {
      const results = await this.prisma.$queryRaw<FoodPublic[]>`
        SELECT id, name, source::text AS source, priority, calories, protein, carbs, fat, fiber, sodium
        FROM "Food"
        WHERE ${Prisma.join(
          words.map((w) => Prisma.sql`unaccent(name) ILIKE unaccent(${`%${w}%`})`),
          ' AND ',
        )}
        ORDER BY priority DESC, name ASC
        LIMIT 50
      `;

      return rankByRelevance(results, trimmed).slice(0, 20);
    } catch {
      throw new InternalServerErrorException('Erro ao buscar alimentos');
    }
  }
}
