import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DailyScoreService } from '../daily-score/daily-score.service';


@Injectable()
export class JobsService {
    constructor(
        private readonly dailyScoreService: DailyScoreService,
    ) {}

    @Cron('0 2 * * *', { timeZone: 'America/Sao_Paulo' })
    async closeDayScores() {
        const today = new Date().toISOString().split('T')[0];
        await this.dailyScoreService.closeDayScoreForEachUser(today);
    }
}