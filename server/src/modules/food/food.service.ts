import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  normalizeForSearch,
  rankByRelevance,
  splitSearchWords,
} from '../../common/utils/search.utils';
import { expandQuerySynonyms } from './food.synonyms';
import { PrismaService } from '../database/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodPublic, foodSelect } from './types';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFoodDto): Promise<FoodPublic> {
    try {
      return await this.prisma.food.create({
        data: dto as Prisma.FoodCreateInput,
        select: foodSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar alimento');
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
      mapPrismaError(error, 'Erro ao buscar alimento');
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
      mapPrismaError(error, 'Erro ao atualizar alimento', {
        p2025: 'Alimento não encontrado',
      });
    }
  }

  async remove(id: string): Promise<FoodPublic> {
    try {
      return await this.prisma.food.delete({
        where: { id },
        select: foodSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar alimento', {
        p2025: 'Alimento não encontrado',
      });
    }
  }

  async search(query: string): Promise<FoodPublic[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const normalized = normalizeForSearch(trimmed);
    const words = splitSearchWords(normalized);

    // Frases sinônimas extras (regionalismos): expandQuerySynonyms retorna a
    // query como primeiro item — fica só com as alternativas adicionais.
    const synonymPhrases = expandQuerySynonyms(normalized).slice(1);

    // Filtro (indexado/barato): trigram OU todas as palavras via ILIKE OU
    // full-text search OU qualquer frase sinônima.
    const filters: Prisma.Sql[] = [
      Prisma.sql`unaccent(name) % unaccent(${trimmed})`,
      Prisma.join(
        words.map(
          (w) => Prisma.sql`unaccent(name) ILIKE unaccent(${`%${w}%`})`,
        ),
        ' AND ',
      ),
      Prisma.sql`to_tsvector('portuguese', unaccent(name)) @@ websearch_to_tsquery('portuguese', unaccent(${trimmed}))`,
      ...synonymPhrases.map(
        (p) => Prisma.sql`unaccent(name) ILIKE unaccent(${`%${p}%`})`,
      ),
    ];

    try {
      // Ordena os candidatos combinando relevância full-text (ts_rank),
      // similaridade trigram (tolera erro de digitação) e priority da fonte.
      const results = await this.prisma.$queryRaw<FoodPublic[]>`
        SELECT id, name, source::text AS source, priority, calories, protein, carbs, fat, fiber, sodium
        FROM "Food"
        WHERE ${Prisma.join(
          filters.map((f) => Prisma.sql`(${f})`),
          ' OR ',
        )}
        ORDER BY ts_rank(
                   to_tsvector('portuguese', unaccent(name)),
                   websearch_to_tsquery('portuguese', unaccent(${trimmed}))
                 ) DESC,
                 priority DESC,
                 similarity(unaccent(name), unaccent(${trimmed})) DESC,
                 name ASC
        LIMIT 60
      `;

      return rankByRelevance(results, trimmed).slice(0, 20);
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar alimentos');
    }
  }
}
