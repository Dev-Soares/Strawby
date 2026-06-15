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

  async findByCode(code: string): Promise<NutritionistPublic> {
    try {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { code },
        select: nutritionistSelect,
      });

      if (!nutritionist) throw new NotFoundException('Nutricionista não encontrado');

      return nutritionist;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar nutricionista por código');
    }
  }

  async connectPatient(nutritionistId: string, patientId: string) {
    try {
      await this.prisma.nutritionist.update({
        where: { id: nutritionistId },
        data: {
          patients: {
            connect: { id: patientId },
          },
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao conectar paciente ao nutricionista');
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
              weight: true,
              height: true,
              birthDate: true,
              gender: true,
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

  async disconnectPatient(patientId: string): Promise<void> {
    try {
      await this.prisma.patient.update({
        where: { id: patientId },
        data: { nutritionistId: null },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao desconectar nutricionista');
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
