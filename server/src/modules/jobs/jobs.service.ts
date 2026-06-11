import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyScoreService } from '../daily-score/daily-score.service';
import { PatientService } from '../patient/patient.service';
import { UserService } from '../user/user.service';
import { yesterdayInAppTz } from '../../common/utils/date.util';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly dailyScoreService: DailyScoreService,
    private readonly patientService: PatientService,
    private readonly userService: UserService,
  ) {}

  @Cron('0 2 * * *', { timeZone: 'America/Sao_Paulo' })
  async closeDayScores() {
    const date = yesterdayInAppTz();

    try {
      await this.dailyScoreService.closeDayScoreForEachUser(date);
    } catch (error) {
      this.logger.error('closeDayScoreForEachUser falhou', error);
    }

    try {
      await this.patientService.generateStreakForEachUser();
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
}
