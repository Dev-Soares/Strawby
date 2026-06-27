import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Post(':patientId')
  create(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Body() dto: CreatePlanDto,
  ) {
    return this.planService.create(req.user.sub, patientId, dto);
  }

  @Get(':patientId')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.planService.findByPatient(req.user.sub, patientId);
  }

  @Patch(':patientId')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.planService.update(req.user.sub, patientId, dto);
  }

  @Delete(':patientId')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.planService.remove(req.user.sub, patientId);
  }

  @UseGuards(AuthGuard)
  @Get(':patientId/pdf')
  async getPlanPdf(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    const { buffer, filename } = await this.planService.getPlanPdf(
      req.user.sub,
      patientId,
    );
    return {
      filename,
      contentType: 'application/pdf',
      data: buffer,
    };
  }
}
