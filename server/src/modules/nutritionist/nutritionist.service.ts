import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { NutritionistPublic, nutritionistSelect } from './types';
import { CreateCodeDto } from './dto/create-code.dto';

@Injectable()
export class NutritionistService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<NutritionistPublic> {
    try {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { id },
        select: nutritionistSelect,
      });

      if (!nutritionist) throw new NotFoundException('Nutricionista não encontrado');

      return nutritionist;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar nutricionista');
    }
  }

  async findPatients(id: string) {
    try {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { id },
        select: {
          patients: {
            select: {
              id: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      if (!nutritionist) throw new NotFoundException('Nutricionista não encontrado');

      return nutritionist.patients;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pacientes');
    }
  }

  async updateCode (nutritionistId: string, dto: CreateCodeDto) {
    try {
      const updated = await this.prisma.nutritionist.update({
        where: { id: nutritionistId },
        data: { code: dto.code },
        select: nutritionistSelect,
      })

      return updated;
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar código de acesso', {
        p2002: 'Código de acesso já existe',
      });
    }
  }     
}
