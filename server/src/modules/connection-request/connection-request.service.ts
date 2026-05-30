import { Injectable } from '@nestjs/common';
import { ConnectionRequest } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NutritionistService } from '../nutritionist/nutritionist.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';

type ConnectionRequestPublic = Pick<
  ConnectionRequest,
  'id' | 'status' | 'nutritionistId' | 'patientId' | 'createdAt'
>;

const connectionRequestSelect = {
  id: true,
  status: true,
  nutritionistId: true,
  patientId: true,
  createdAt: true,
} as const;

@Injectable()
export class ConnectionRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nutritionistService: NutritionistService,
  ) {}

  async makeRequest(
    patientId: string,
    dto: CreateConnectionRequestDto,
  ): Promise<ConnectionRequestPublic> {

    const nutritionist = await this.nutritionistService.findByCode(dto.code);

    try {
      return await this.prisma.connectionRequest.create({
        data: {
          patientId,
          nutritionistId: nutritionist.id,
          status: 'PENDING',
        },
        select: connectionRequestSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar solicitação de conexão');
    }
  }

  async reject(id: string, nutritionistId: string): Promise<ConnectionRequestPublic> {
    try {
      return await this.prisma.connectionRequest.update({
        where: { id, nutritionistId },
        data: { status: 'REJECTED' },
        select: connectionRequestSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao rejeitar solicitação', {
        p2025: 'Solicitação não encontrada',
      });
    }
  }

  async accept(id: string, nutritionistId: string): Promise<ConnectionRequestPublic> {
    try {
      const updated = await this.prisma.connectionRequest.update({
        where: { id, nutritionistId },
        data: { status: 'ACCEPTED' },
        select: connectionRequestSelect,
      });

      await this.nutritionistService.connectPatient(
        updated.nutritionistId,
        updated.patientId,
      );

      return updated;
    } catch (error) {
      mapPrismaError(error, 'Erro ao aceitar solicitação');
    }
  }

  async findAllPendingByNutritionist(
    nutritionistId: string,
  ): Promise<ConnectionRequestPublic[]> {
    try {
      return await this.prisma.connectionRequest.findMany({
        where: { nutritionistId, status: 'PENDING' },
        select: connectionRequestSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar solicitações');
    }
  }
}
