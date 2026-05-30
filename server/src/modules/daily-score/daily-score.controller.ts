import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { DailyScoreService } from './daily-score.service';
import { CreateDailyScoreDto } from './dto/create-daily-score.dto';
import { UpdateDailyScoreDto } from './dto/update-daily-score.dto';

@ApiTags('daily-score')
@UseGuards(AuthGuard)
@Controller('daily-score')
export class DailyScoreController {
  constructor(private readonly dailyScoreService: DailyScoreService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateDailyScoreDto) {
    return this.dailyScoreService.create(req.user.sub, dto);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dailyScoreService.findAllByPatient(req.user.sub, startDate, endDate);
  }

  @Get('day/:day')
  findByDay(@Req() req: AuthenticatedRequest, @Param('day') day: string) {
    return this.dailyScoreService.findByDay(req.user.sub, day);
  }

  @Get('live/:day')
  findLiveScore(@Req() req: AuthenticatedRequest, @Param('day') day: string) {
    return this.dailyScoreService.generateLiveScore(req.user.sub, day);
  }

  @Get('average')
  async getAverage(@Req() req: AuthenticatedRequest) {
    const score = await this.dailyScoreService.getAverageScoreByUser(
      req.user.sub,
    );
    return { score };
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateDailyScoreDto,
  ) {
    return this.dailyScoreService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.dailyScoreService.remove(id, req.user.sub);
  }
}
