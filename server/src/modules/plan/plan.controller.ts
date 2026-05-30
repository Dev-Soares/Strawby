import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plan.service';

@ApiTags('plan')
@UseGuards(AuthGuard)
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePlanDto) {
    return this.planService.create(req.user.sub, dto);
  }

  @Get()
  findMine(@Req() req: AuthenticatedRequest) {
    return this.planService.findByPatient(req.user.sub);
  }

  @Patch()
  update(@Req() req: AuthenticatedRequest, @Body() dto: UpdatePlanDto) {
    return this.planService.update(req.user.sub, dto);
  }

  @Delete()
  remove(@Req() req: AuthenticatedRequest) {
    return this.planService.remove(req.user.sub);
  }
}
