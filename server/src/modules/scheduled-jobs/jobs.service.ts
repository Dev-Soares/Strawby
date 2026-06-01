import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DailyScoreService } from '../daily-score/daily-score.service';
import { PatientService } from '../patient/patient.service';


@Injectable()
export class JobsService {
    constructor(
        private readonly dailyScoreService: DailyScoreService,
        private readonly patientService: PatientService,
    ) {}

    @Cron('0 2 * * *', { timeZone: 'America/Sao_Paulo' })
    async closeDayScores() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const date = yesterday.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
        await this.dailyScoreService.closeDayScoreForEachUser(date);
    }

    @Cron('0 3 * * *', { timeZone: 'America/Sao_Paulo' })
    async generateStreaks() {     
        await this.patientService.generateStreakForEachUser(date);
    }
}