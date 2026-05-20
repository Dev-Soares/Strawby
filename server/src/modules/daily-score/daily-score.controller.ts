import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { DailyScoreService } from './daily-score.service';
import { CreateDailyScoreDto } from './dto/create-daily-score.dto';
import { UpdateDailyScoreDto } from './dto/update-daily-score.dto';

@UseGuards(AuthGuard)
@Controller('daily-score')
export class DailyScoreController {
  constructor(private readonly dailyScoreService: DailyScoreService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateDailyScoreDto) {
    return this.dailyScoreService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.dailyScoreService.findAllByUser(req.user.sub);
  }

  @Get('day/:day')
  findByDay(@Req() req: AuthenticatedRequest, @Param('day') day: string) {
    return this.dailyScoreService.findByDay(req.user.sub, day);
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
