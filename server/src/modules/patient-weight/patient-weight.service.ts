import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { CreatePatientWeightDto } from './dto/create-patient-weight.dto';
import { UpdatePatientWeightDto } from './dto/update-patient-weight.dto';
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper';

@Injectable()
export class PatientWeightService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  async insert(
    callerId: string,
    patientId: string,
    dto: CreatePatientWeightDto,
  ) {
    await this.patientAccess.resolve(callerId, patientId);

    try {
      await this.prisma.patientWeight.create({
        data: {
          weight: dto.weight,
          date: new Date(dto.date),
          patientId,
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao registrar peso do paciente.');
    }
  }

  async edit(
    callerId: string,
    patientId: string,
    recordId: string,
    dto: UpdatePatientWeightDto,
  ) {
    await this.patientAccess.resolve(callerId, patientId);

    try {
      const { count } = await this.prisma.patientWeight.updateMany({
        where: { id: recordId, patientId },
        data: {
          weight: dto.weight,
          date: dto.date ? new Date(dto.date) : undefined,
        },
      });

      if (count === 0) {
        throw new NotFoundException('Registro de peso não encontrado.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      mapPrismaError(error, 'Erro ao atualizar registro de peso do paciente.');
    }
  }

  async remove(callerId: string, patientId: string, recordId: string) {
    await this.patientAccess.resolve(callerId, patientId);

    try {
      const { count } = await this.prisma.patientWeight.deleteMany({
        where: { id: recordId, patientId },
      });

      if (count === 0) {
        throw new NotFoundException('Registro de peso não encontrado.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      mapPrismaError(error, 'Erro ao remover registro de peso do paciente.');
    }
  }

  async getAllByPatient(callerId: string, patientId: string) {
    await this.patientAccess.resolve(callerId, patientId);

    return this.prisma.patientWeight.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
  }

  async getLastRegister(callerId: string, patientId: string) {
    await this.patientAccess.resolve(callerId, patientId);

    return this.prisma.patientWeight.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
  }
}
