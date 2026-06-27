import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PatientAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(callerId: string, patientId: string): Promise<void> {
    if (callerId === patientId) return;

    const linked = await this.prisma.patient.findFirst({
      where: { id: patientId, nutritionistId: callerId },
    });
    if (!linked) throw new ForbiddenException('Sem permissão para acessar este paciente');
  }
}
