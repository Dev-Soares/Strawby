import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { NutritionistPublic, nutritionistSelect } from './types';
import { CreateCodeDto } from './dto/create-code.dto';
import { NotificationService } from '../notification/send-notification/notification.service';

@Injectable()
export class NutritionistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findOne(id: string): Promise<NutritionistPublic> {
    try {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { id },
        select: nutritionistSelect,
      });

      if (!nutritionist)
        throw new NotFoundException('Nutricionista não encontrado');

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

      if (!nutritionist)
        throw new NotFoundException('Nutricionista não encontrado');

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
              height: true,
              birthDate: true,
              gender: true,
              weightRecord: {
                orderBy: { date: 'desc' },
                take: 1,
                select: { weight: true, date: true },
              },
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      if (!nutritionist)
        throw new NotFoundException('Nutricionista não encontrado');

      return nutritionist.patients.map((patient) => ({
        id: patient.id,
        height: patient.height,
        gender: patient.gender,
        weight: patient.weightRecord[0]?.weight ?? null,
        age: patient.birthDate ? this.calculateAge(patient.birthDate) : null,
        user: patient.user,
      }));
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pacientes');
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  async disconnectPatient(patientId: string): Promise<void> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
        select: { nutritionistId: true },
      });

      await this.prisma.patient.update({
        where: { id: patientId },
        data: { nutritionistId: null },
      });

      if (patient?.nutritionistId) {
        await this.notificationService.sendOne(
          patient.nutritionistId,
          'Paciente desconectado',
          'Um paciente encerrou a conexão com você.',
        );
      }
    } catch (error) {
      mapPrismaError(error, 'Erro ao desconectar nutricionista');
    }
  }

  async updateCode(nutritionistId: string, dto: CreateCodeDto) {
    try {
      const updated = await this.prisma.nutritionist.update({
        where: { id: nutritionistId },
        data: { code: dto.code },
        select: nutritionistSelect,
      });

      return updated;
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar código de acesso', {
        p2002: 'Código de acesso já existe',
      });
    }
  }
}
