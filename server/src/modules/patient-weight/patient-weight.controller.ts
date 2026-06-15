import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { PatientWeightService } from './patient-weight.service';
import { CreatePatientWeightDto } from './dto/create-patient-weight.dto';
import { UpdatePatientWeightDto } from './dto/update-patient-weight.dto';

@ApiTags('patient-weight')
@UseGuards(AuthGuard)
@Controller('patient-weight')
export class PatientWeightController {
  constructor(private readonly patientWeightService: PatientWeightService) {}

  @Post(':patientId')
  insert(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Body() dto: CreatePatientWeightDto,
  ) {
    return this.patientWeightService.insert(req.user.sub, patientId, dto);
  }

  @Patch(':patientId/:id')
  edit(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePatientWeightDto,
  ) {
    return this.patientWeightService.edit(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.patientWeightService.remove(req.user.sub, patientId, id);
  }

  @Get(':patientId')
  getAllByPatient(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.patientWeightService.getAllByPatient(req.user.sub, patientId);
  }

  @Get(':patientId/last')
  getLastRegister(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.patientWeightService.getLastRegister(req.user.sub, patientId);
  }
}
