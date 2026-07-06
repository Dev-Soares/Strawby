import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import {
  yesterdayInAppTz,
  todayInAppTz,
  appDayRangeTz,
} from '../../common/utils/date.util';
import type { PatientStreakPublic, StreakProcessResult } from './types';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CompleteOnboardingDto } from '../user/dto/complete-onboarding.dto';
import { DailyScoreService } from '../daily-score/daily-score.service';
import { NotificationService } from '../notification/send-notification/notification.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccessService: PatientAccessService,
    private readonly dailyScoreService: DailyScoreService,
    private readonly notificationService: NotificationService,
  ) {}

  async createFromOnboarding(
    userId: string,
    data: CompleteOnboardingDto,
  ): Promise<void> {
    if (
      data.height === undefined ||
      data.birthDate === undefined ||
      data.gender === undefined ||
      data.targetWeight === undefined
    ) {
      throw new BadRequestException(
        'Dados obrigatórios do paciente ausentes no onboarding',
      );
    }

    try {
      await this.prisma.patient.create({
        data: {
          id: userId,
          height: data.height,
          birthDate: new Date(data.birthDate),
          gender: data.gender,
          targetWeight: data.targetWeight,
        },
      });
      if (data.weight !== undefined) {
        await this.prisma.patientWeight.create({
          data: { patientId: userId, weight: data.weight, date: new Date() },
        });
      }
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar paciente');
    }
  }

  findById(patientId: string) {
    try {
      return this.prisma.patient.findUnique({
        where: { id: patientId },
        select: {
          id: true,
          height: true,
          birthDate: true,
          gender: true,
          currentStreak: true,
          bestStreak: true,
          targetWeight: true,
          weightRecord: {
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            take: 1,
            select: { weight: true, date: true },
          },
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar paciente', {
        p2025: 'Paciente não encontrado',
      });
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

  async update(patientId: string, dto: UpdatePatientDto): Promise<void> {
    try {
      await this.prisma.patient.updateMany({
        where: { id: patientId },
        data: {
          ...(dto.height !== undefined && { height: dto.height }),
          ...(dto.birthDate !== undefined && {
            birthDate: new Date(dto.birthDate),
          }),
          ...(dto.gender !== undefined && { gender: dto.gender }),
          ...(dto.targetWeight !== undefined && {
            targetWeight: dto.targetWeight,
          }),
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar paciente', {
        p2025: 'Paciente não encontrado',
      });
    }
  }

  // bi-functional method, if nutritionist calls it ( through DI at nutritionistService),
  // pass the id of the nutritionist and checks if it is connected to the patient whose id
  // was passed as parameter. if patient calls via controller, just check the ownership and
  // remove the connection
  async unlinkFromNutritionist(
    patientId: string,
    expectedNutritionistId?: string,
  ): Promise<string | null> {
    if (expectedNutritionistId) {
      await this.patientAccessService.resolve(
        expectedNutritionistId,
        patientId,
      );
    }

    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
        select: { nutritionistId: true },
      });

      await this.prisma.patient.update({
        where: { id: patientId },
        data: { nutritionistId: null },
      });

      if (expectedNutritionistId) {
        await this.notificationService.sendOne(
          patientId,
          'Conexão encerrada',
          'Seu nutricionista encerrou a conexão com você.',
        );
      }

      return patient?.nutritionistId ?? null;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      mapPrismaError(error, 'Erro ao desvincular nutricionista', {
        p2025: 'Paciente não encontrado',
      });
    }
  }

  async findPatientsWithNoMeal() {
    const { start, end } = appDayRangeTz(todayInAppTz());

    try {
      const patientsIds = await this.prisma.patient.findMany({
        where: {
          meals: {
            none: {
              kind: 'DAILY',
              date: { gte: start, lt: end },
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

  async generateStreakForEachUser(): Promise<StreakProcessResult> {
    const yesterdayDate = yesterdayInAppTz();

    try {
      const [patients, scores] = await Promise.all([
        this.prisma.patient.findMany({
          select: { id: true, currentStreak: true },
        }),
        this.dailyScoreService.findScoresByDate(yesterdayDate),
      ]);

      const scoreMap = new Map(scores.map((s) => [s.patientId, s.score])); //mapeia os scores por patientId para acesso rápido

      const resetIds = patients
        .filter(
          (patient) =>
            (scoreMap.get(patient.id) ?? 0) < 7 && patient.currentStreak !== 0,
        )
        .map((patient) => patient.id); // pacientes com score < 7 terão streak resetado

      const incrementIds = patients
        .filter((patient) => (scoreMap.get(patient.id) ?? 0) >= 7)
        .map((patient) => patient.id);
      // pacientes com score >= 7 terão streak incrementado

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
}
