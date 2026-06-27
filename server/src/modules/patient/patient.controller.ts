import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { OwnershipGuard } from '../../common/guards/auth/ownership.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientService } from './patient.service';

@ApiTags('patient')
@UseGuards(AuthGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':id')
  @UseGuards(OwnershipGuard)
  findById(@Param('id') id: string) {
    return this.patientService.findById(id);
  }

  @Get(':id/streak')
  getPatientStreak(
    @Req() req: AuthenticatedRequest,
    @Param('id') patientId: string,
  ) {
    return this.patientService.getPatientStreak(req.user.sub, patientId);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }
}
