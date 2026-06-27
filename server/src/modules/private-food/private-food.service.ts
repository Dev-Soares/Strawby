import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { CreatePrivateFoodDto } from './dto/create-private-food.dto';
import { UpdatePrivateFoodDto } from './dto/update-private-food.dto';
import { PrivateFoodPublic, privateFoodSelect } from './types';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

@Injectable()
export class PrivateFoodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  async create(
    callerId: string,
    patientId: string,
    dto: CreatePrivateFoodDto,
  ): Promise<PrivateFoodPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.privateFood.create({
        data: { ...dto, patientId },
        select: privateFoodSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar alimento privado');
    }
  }

  async findAllByPatient(
    callerId: string,
    patientId: string,
  ): Promise<PrivateFoodPublic[]> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.privateFood.findMany({
        where: { patientId },
        select: privateFoodSelect,
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar alimentos privados');
    }
  }

  async update(
    callerId: string,
    patientId: string,
    id: string,
    dto: UpdatePrivateFoodDto,
  ): Promise<PrivateFoodPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.privateFood.update({
        where: { id, patientId },
        data: dto,
        select: privateFoodSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar alimento privado', {
        p2025: 'Alimento privado não encontrado',
      });
    }
  }

  async remove(
    callerId: string,
    patientId: string,
    id: string,
  ): Promise<PrivateFoodPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.privateFood.delete({
        where: { id, patientId },
        select: privateFoodSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar alimento privado', {
        p2025: 'Alimento privado não encontrado',
      });
    }
  }
}
