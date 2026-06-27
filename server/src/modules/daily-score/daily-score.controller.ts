import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { DailyScoreService } from './daily-score.service';
import { CreateDailyScoreDto } from './dto/create-daily-score.dto';
import { QueryDailyScoreDto } from './dto/query-daily-score.dto';

@ApiTags('daily-score')
@UseGuards(AuthGuard)
@Controller('daily-score')
export class DailyScoreController {
  constructor(private readonly dailyScoreService: DailyScoreService) {}

  @Get(':patientId')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Query() query: QueryDailyScoreDto,
  ) {
    return this.dailyScoreService.findAllByPatient(
      req.user.sub,
      patientId,
      query.startDate,
      query.endDate,
    );
  }

  @Get(':patientId/day/:day')
  findByDay(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('day') day: string,
  ) {
    return this.dailyScoreService.findByDay(req.user.sub, patientId, day);
  }

  @Get(':patientId/live/:day')
  getLiveScore(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('day') day: string,
  ) {
    return this.dailyScoreService.getLiveScore(req.user.sub, patientId, day);
  }

  @Get(':patientId/average')
  async getAverage(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    const score = await this.dailyScoreService.getAverageScore(
      req.user.sub,
      patientId,
    );
    return { score };
  }
}
