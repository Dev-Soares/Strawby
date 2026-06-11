import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../../common/patient-access/patient-access.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { yesterdayInAppTz } from '../../common/utils/date.util';
import type { PatientStreakPublic, StreakProcessResult } from './types';
import { DailyScoreService } from '../daily-score/daily-score.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccessService: PatientAccessService,
    private readonly dailyScoreService: DailyScoreService,
  ) {}

  async generateStreakForEachUser(): Promise<StreakProcessResult> {
    const yesterdayDate = yesterdayInAppTz();

    try {
      const [patientIds, scores] = await Promise.all([
        this.prisma.patient.findMany({ select: { id: true } }),
        this.dailyScoreService.findScoresByDate(yesterdayDate),
      ]);

      const scoreMap = new Map(scores.map((s) => [s.patientId, s.score])); //mapeia os scores por patientId para acesso rápido

      const resetIds = patientIds
        .filter((patient) => (scoreMap.get(patient.id) ?? 0) < 8)
        .map((patient) => patient.id); // pacientes com score < 8 terão streak resetado
      const incrementIds = patientIds
        .filter((patient) => (scoreMap.get(patient.id) ?? 0) >= 8)
        .map((patient) => patient.id);
      // pacientes com score >= 8 terão streak incrementado

      await this.prisma.$transaction(async (tx) => {
        if (resetIds.length > 0) {
          await tx.patient.updateMany({
            where: { id: { in: resetIds } },
            data: { currentStreak: 0 },
          });
        }

        if (incrementIds.length > 0) {
          await tx.patient.updateMany({
            where: { id: { in: incrementIds } },
            data: { currentStreak: { increment: 1 } },
          });
          // Prisma não suporta comparação coluna-a-coluna em updateMany
          await tx.$executeRaw`
            UPDATE "Patient"
            SET "bestStreak" = "currentStreak"
            WHERE "currentStreak" > "bestStreak"
              AND id IN (${Prisma.join(incrementIds)})
          `;
        }
      });

      return { incremented: incrementIds, reset: resetIds }; 
    } catch (error) {
      mapPrismaError(error, 'Erro ao processar streak dos pacientes');
    }
  }

  async getPatientStreak(
    callerId: string,
    patientId: string,
  ): Promise<PatientStreakPublic> {
    await this.patientAccessService.resolve(callerId, patientId);

    try {
      const patientStreak = await this.prisma.patient.findUnique({
        where: { id: patientId },
        select: { currentStreak: true, bestStreak: true },
      });

      if (!patientStreak)
        throw new NotFoundException('Paciente não encontrado');

      return patientStreak;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar streak do paciente');
    }
  }

  async findPatientsWithNoMeal() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define o início do dia

    try {
      const patientsIds = await this.prisma.patient.findMany({
        where: {
          meals: {
            none: {
              kind: 'DAILY',
              date: { gte: today },
            },
          },
        },
        select: { id: true },
      });

      return patientsIds.map((p) => p.id);
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar pacientes sem refeições diárias');
    }
  }
}
