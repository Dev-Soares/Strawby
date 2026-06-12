import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyScoreService } from '../daily-score/daily-score.service';
import { PatientService } from '../patient/patient.service';
import { UserService } from '../user/user.service';
import { yesterdayInAppTz } from '../../common/utils/date.util';
import { NotificationService } from '../notification/send-notification/notification.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly dailyScoreService: DailyScoreService,
    private readonly patientService: PatientService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: 'America/Sao_Paulo' })
  async closeDayScores() {
    const date = yesterdayInAppTz();

    try {
      const patientIds = await this.dailyScoreService.closeDayScoreForEachUser(date);

      if (patientIds?.length) {
        await this.notificationService.sendMany(
          patientIds,
          'Seu Diário Alimentar de Ontem',
          'Seu diário alimentar de ontem foi fechado. Acesse o aplicativo para ver suas pontuações!',
        );
      }
    } catch (error) {
      this.logger.error('closeDayScoreForEachUser falhou', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'America/Sao_Paulo' })
  async updateStreaks() {
    try {
      const { incremented, reset } = await this.patientService.generateStreakForEachUser();

      await this.notificationService.sendMany(
        incremented,
        'Mais um dia!',
        'Sua sequência de refeições saudáveis foi incrementada! Continue assim!',
      );
      await this.notificationService.sendMany(
        reset,
        'Não desanime!',
        'Sua sequência foi perdida, mas não desanime! Foque em manter uma alimentação saudável hoje para recuperar seu progresso amanhã!',
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

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { timeZone: 'America/Sao_Paulo' })
  async notifyPatientsWithoutDailyMeal() {
    try {
      const patientIds = await this.patientService.findPatientsWithNoMeal();

      await this.notificationService.sendMany(
        patientIds,
        'Lembrete de Refeição',
        'Olá! Notamos que você ainda não registrou uma refeição hoje. Não se esqueça de manter seu diário alimentar atualizado para acompanhar seu progresso!',
      );
    } catch (error) {
      this.logger.error('notifyPatientsWithoutDailyMeal falhou', error);
    }
  }
}
