import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DailyScoreService } from '../daily-score/daily-score.service';
import { PatientService } from '../patient/patient.service';


@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(
        private readonly dailyScoreService: DailyScoreService,
        private readonly patientService: PatientService,
    ) {}

    @Cron('0 2 * * *', { timeZone: 'America/Sao_Paulo' })
    async closeDayScores() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const date = yesterday.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

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

}