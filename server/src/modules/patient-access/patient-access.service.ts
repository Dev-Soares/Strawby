import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';

@Injectable()
export class PatientAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(callerId: string, patientId: string): Promise<void> {
    if (callerId === patientId) return;

    try {
      const linked = await this.prisma.patient.findFirst({
        where: { id: patientId, nutritionistId: callerId },
        select: { id: true },
      });
      if (!linked)
        throw new ForbiddenException('Sem permissão para acessar este paciente');
    } catch (error) {
      mapPrismaError(error, 'Erro ao verificar acesso ao paciente');
    }
  }
}
