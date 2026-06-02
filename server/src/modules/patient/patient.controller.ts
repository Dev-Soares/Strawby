import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../../common/guards/auth/auth.guard'
import type { AuthenticatedRequest } from '../../common/types/req-types'
import { PatientService } from './patient.service'

@ApiTags('patient')
@UseGuards(AuthGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':id/streak')
  getPatientStreak(@Req() req: AuthenticatedRequest, @Param('id') patientId: string) {
    return this.patientService.getPatientStreak(req.user.sub, patientId)
  }
}
