import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { CreatePlanDto } from './dto/create-plan.dto';
import { NutritionistCreatePlanDto } from './dto/nutritionist-create-plan.dto';
import { NutritionistUpdatePlanDto } from './dto/nutritionist-update-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plan.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { OwnershipGuard } from 'src/common/guards/auth/ownership.guard';

@ApiTags('plan')
@UseGuards(AuthGuard)
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePlanDto) {
    return this.planService.create(req.user.sub, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('nutritionist')
  @Post('patient')
  createForPatient(@Req() req: AuthenticatedRequest, @Body() dto: NutritionistCreatePlanDto) {
    return this.planService.createForPatient(req.user.sub, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('nutritionist')
  @Patch('patient')
  updateForPatient(@Req() req: AuthenticatedRequest, @Body() dto: NutritionistUpdatePlanDto) {
    return this.planService.updateForPatient(req.user.sub, dto);
  }


  @Get()
  findMine(@Req() req: AuthenticatedRequest) {
    return this.planService.findByPatient(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Req() req: AuthenticatedRequest, @Body() dto: UpdatePlanDto) {
    return this.planService.update(req.user.sub, dto);
  }
  
  @UseGuards(AuthGuard)
  @Delete()
  remove(@Req() req: AuthenticatedRequest) {
    return this.planService.remove(req.user.sub);
  }
}
