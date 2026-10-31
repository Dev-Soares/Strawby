import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyScoreService } from '../daily-score/daily-score.service';
import { PatientService } from '../patient/patient.service';
import { UserService } from '../user/user.service';
import { appTimeWindow, yesterdayInAppTz } from '../../common/utils/date.util';
import { NotificationService } from '../notification/send-notification/notification.service';
import { MealService } from '../meal/meal.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly dailyScoreService: DailyScoreService,
    private readonly patientService: PatientService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly mealService: MealService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: 'America/Sao_Paulo' })
  async closeDayScores() {
    const date = yesterdayInAppTz();

    try {
      await this.dailyScoreService.closeDayScoreForEachUser(date);
    } catch (error) {
      this.logger.error('closeDayScoreForEachUser falhou', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'America/Sao_Paulo' })
  async updateStreaks() {
    try {
      const { incremented, reset } =
        await this.patientService.generateStreakForEachUser();

      await this.notificationService.sendMany(
        incremented,
        'Mais um dia!',
        'Sua sequência de refeições saudáveis foi incrementada! Continue assim!',
      );
      await this.notificationService.sendMany(
        reset,
        'Sequência Perdida',
        'Sua sequência foi perdida, mas não desanime!',
      );
    } catch (error) {
      this.logger.error('generateStreakForEachUser falhou', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async clearExpiredVerificationTokens(): Promise<void> {
    try {
      await this.userService.clearExpiredTokens();
    } catch (error) {
      this.logger.error('clearExpiredVerificationTokens falhou', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM, { timeZone: 'America/Sao_Paulo' })
  async notifyPatientsWithoutDailyMeal() {
    try {
      const patientIds = await this.patientService.findPatientsWithNoMeal();

      await this.notificationService.sendMany(
        patientIds,
        'Registre suas Refeições',
        ' Não se esqueça de manter sua consistência!',
      );
    } catch (error) {
      this.logger.error('notifyPatientsWithoutDailyMeal falhou', error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, { timeZone: 'America/Sao_Paulo' })
  async notifyPatientsWithPlannedMeal() {
    const { startTime, endTime } = appTimeWindow(10);

    try {
      const mealsData = await this.mealService.findMissingMealByTime(
        startTime,
        endTime,
      );

      const breakfastPatientIds: string[] = [];
      const lunchPatientIds: string[] = [];
      const snackPatientIds: string[] = [];
      const dinnerPatientIds: string[] = [];
      const supperPatientIds: string[] = [];

      for (const meal of mealsData) {
        switch (meal.mealType) {
          case 'breakfast':
            breakfastPatientIds.push(meal.patientId);
            break;
          case 'lunch':
            lunchPatientIds.push(meal.patientId);
            break;
          case 'snack':
            snackPatientIds.push(meal.patientId);
            break;
          case 'dinner':
            dinnerPatientIds.push(meal.patientId);
            break;
          case 'supper':
            supperPatientIds.push(meal.patientId);
            break;
        }
      }

      await this.notificationService.sendMany(
        breakfastPatientIds,
        'Hora do Café da manhã',
        'Está na hora do café da manhã do seu plano!',
      );
      await this.notificationService.sendMany(
        lunchPatientIds,
        'Hora do Almoço',
        'Está na hora do almoço do seu plano!',
      );
      await this.notificationService.sendMany(
        snackPatientIds,
        'Hora do Lanche',
        'Está na hora do lanche do seu plano!',
      );
      await this.notificationService.sendMany(
        dinnerPatientIds,
        'Hora do Jantar',
        'Está na hora do jantar do seu plano!',
      );
      await this.notificationService.sendMany(
        supperPatientIds,
        'Hora da Ceia',
        'Está na hora da ceia do seu plano!',
      );
    } catch (error) {
      this.logger.error('notifyPatientsWithPlannedMeal falhou', error);
    }
  }
}
