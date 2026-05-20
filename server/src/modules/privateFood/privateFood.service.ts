import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePrivateFoodDto } from './dto/create-private-food.dto';
import { UpdatePrivateFoodDto } from './dto/update-private-food.dto';
import { PrivateFoodPublic, privateFoodSelect } from './privateFood.types';

@Injectable()
export class PrivateFoodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePrivateFoodDto): Promise<PrivateFoodPublic> {
    try {
      return await this.prisma.privateFood.create({
        data: { ...dto, userId },
        select: privateFoodSelect,
      });
    } catch {
      throw new InternalServerErrorException('Erro ao criar alimento privado');
    }
  }

  async findAllByUser(userId: string): Promise<PrivateFoodPublic[]> {
    try {
      return await this.prisma.privateFood.findMany({
        where: { userId },
        select: privateFoodSelect,
        orderBy: { name: 'asc' },
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar alimentos privados');
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePrivateFoodDto,
  ): Promise<PrivateFoodPublic> {
    try {
      return await this.prisma.privateFood.update({
        where: { id, userId },
        data: dto,
        select: privateFoodSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Alimento privado não encontrado');
      }
      throw new InternalServerErrorException('Erro ao atualizar alimento privado');
    }
  }

  async remove(id: string, userId: string): Promise<PrivateFoodPublic> {
    try {
      return await this.prisma.privateFood.delete({
        where: { id, userId },
        select: privateFoodSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Alimento privado não encontrado');
      }
      throw new InternalServerErrorException('Erro ao deletar alimento privado');
    }
  }
}
