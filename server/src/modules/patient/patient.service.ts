import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../../common/patient-access/patient-access.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import type { PatientStreakPublic } from './types';
import { DailyScoreService } from '../daily-score/daily-score.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccessService: PatientAccessService,
    private readonly dailyScoreService: DailyScoreService,
  ) {}

   async generateStreakForEachUser(): Promise<void> {
    const yesterdayDate = this.getYesterdayDate();

    try {
      const [patientIds, scores] = await Promise.all([
        this.prisma.patient.findMany({ select: { id: true } }),
        this.dailyScoreService.findScoresByDate(yesterdayDate),
      ]);

      const scoreMap = new Map(scores.map(s => [s.patientId, s.score])); //mapeia os scores por patientId para acesso rápido

      const resetIds = patientIds.filter(patient => (scoreMap.get(patient.id) ?? 0) < 8).map(patient => patient.id); // pacientes com score < 8 terão streak resetado
      const incrementIds = patientIds.filter(patient => (scoreMap.get(patient.id) ?? 0) >= 8).map(patient => patient.id);
      // pacientes com score >= 8 terão streak incrementado

      await this.prisma.$transaction([
        this.prisma.patient.updateMany({
          where: { id: { in: resetIds } },
          data: { currentStreak: 0 },
        }),
        this.prisma.patient.updateMany({
          where: { id: { in: incrementIds } },
          data: { currentStreak: { increment: 1 } },
        }),
        // Prisma não suporta comparação coluna-a-coluna em updateMany

        this.prisma.$queryRaw`
          UPDATE "Patient"
          SET "bestStreak" = "currentStreak"
          WHERE "currentStreak" > "bestStreak"
            AND id = ANY(${incrementIds}::uuid[])
        `,

      ]);
    } catch (error) {
      mapPrismaError(error, 'Erro ao processar streak dos pacientes');
    }
  }

  private getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString('en-CA', {
      timeZone: 'America/Sao_Paulo',
    });
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
}
